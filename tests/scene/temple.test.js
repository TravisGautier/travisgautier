import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { createTemple } from '../../src/scene/temple.js';

function runTemple(config) {
  const added = [];
  const scene = { add: (obj) => added.push(obj) };
  createTemple(scene, config);
  return added;
}

function getPillars(added) {
  return added.slice(6, added.length - 1);
}

describe('temple config wiring', () => {
  describe('integration', () => {
    /// Tests checklist items: [1] — Feature 3.2
    it('int_temple_export_unchanged', () => {
      expect(typeof createTemple).toBe('function');
    });

    /// Tests checklist items: [1] — Feature 3.2
    it('int_temple_accepts_config', () => {
      const scene = { add: () => {} };
      expect(() => createTemple(scene, { pillarCount: 8, pillarFluting: false })).not.toThrow();
    });
  });

  describe('default (no config)', () => {
    /// Tests checklist items: [1, 2, 3] — Feature 3.2
    it('unit_temple_default_no_config', () => {
      const added = runTemple();
      expect(added.length).toBe(19);
      const pillars = getPillars(added);
      expect(pillars.length).toBe(12);
      expect(pillars[0].children.length).toBe(12);
    });
  });

  describe('tier configs', () => {
    /// Tests checklist items: [2, 3] — Feature 3.2
    it('unit_temple_tier3_config', () => {
      const added = runTemple({ pillarCount: 12, pillarFluting: true });
      expect(added.length).toBe(19);
      const pillars = getPillars(added);
      expect(pillars.length).toBe(12);
      for (const p of pillars) {
        expect(p.children.length).toBe(12);
      }
      expect(added[18].geometry.parameters.radius).toBe(5.2);
    });

    /// Tests checklist items: [2, 3] — Feature 3.2
    it('unit_temple_tier2_config', () => {
      const added = runTemple({ pillarCount: 10, pillarFluting: false });
      expect(added.length).toBe(17);
      const pillars = getPillars(added);
      expect(pillars.length).toBe(10);
      expect(pillars[0].children.length).toBe(4);
      expect(added[16].geometry.parameters.radius).toBe(5.2);
    });

    /// Tests checklist items: [2, 3] — Feature 3.2
    it('unit_temple_tier1_config', () => {
      const added = runTemple({ pillarCount: 8, pillarFluting: false });
      expect(added.length).toBe(15);
      const pillars = getPillars(added);
      expect(pillars.length).toBe(8);
      expect(pillars[0].children.length).toBe(4);
    });

    /// Tests checklist items: [2, 3] — Feature 3.2
    it('unit_temple_tier0_config', () => {
      const added = runTemple({ pillarCount: 6, pillarFluting: false });
      expect(added.length).toBe(13);
      const pillars = getPillars(added);
      expect(pillars.length).toBe(6);
      expect(pillars[0].children.length).toBe(4);
    });
  });

  describe('geometry invariants', () => {
    /// Tests checklist items: [2] — Feature 3.2
    it('unit_temple_pillar_radius_constant', () => {
      const configs = [
        { pillarCount: 6, pillarFluting: false },
        { pillarCount: 8, pillarFluting: false },
        { pillarCount: 10, pillarFluting: false },
        { pillarCount: 12, pillarFluting: true },
      ];
      for (const cfg of configs) {
        const added = runTemple(cfg);
        const pillars = getPillars(added);
        for (const p of pillars) {
          const dist = Math.sqrt(p.position.x ** 2 + p.position.z ** 2);
          expect(dist).toBeCloseTo(5.2, 1);
        }
      }
    });

    /// Tests checklist items: [2] — Feature 3.2
    it('unit_temple_pillar_spacing_even', () => {
      const added = runTemple({ pillarCount: 8, pillarFluting: false });
      const pillars = getPillars(added);
      expect(pillars.length).toBe(8);
      for (let i = 0; i < pillars.length; i++) {
        const angle = Math.atan2(pillars[i].position.z, pillars[i].position.x);
        const expectedAngle = (i / 8) * Math.PI * 2;
        const norm = ((angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        const normExp = ((expectedAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        expect(norm).toBeCloseTo(normExp, 4);
      }
    });

    /// Tests checklist items: [2, 3] — Feature 3.2
    it('unit_temple_floor_steps_rings_unchanged', () => {
      const defaultAdded = runTemple();
      const tier0Added = runTemple({ pillarCount: 6, pillarFluting: false });

      for (let i = 0; i < 6; i++) {
        expect(tier0Added[i].geometry.type).toBe(defaultAdded[i].geometry.type);
        expect(tier0Added[i].position.y).toBe(defaultAdded[i].position.y);
      }
    });

    /// Tests checklist items: [2] — Feature 3.2
    it('unit_temple_architrave_always_present', () => {
      const configs = [
        undefined,
        { pillarCount: 6, pillarFluting: false },
        { pillarCount: 8, pillarFluting: false },
        { pillarCount: 10, pillarFluting: false },
        { pillarCount: 12, pillarFluting: true },
      ];
      for (const cfg of configs) {
        const added = runTemple(cfg);
        const last = added[added.length - 1];
        expect(last.geometry.parameters.radius).toBe(5.2);
        expect(last.geometry.parameters.tube).toBe(0.14);
        expect(last.position.y).toBe(4.38);
      }
    });
  });

  describe('fluting detail', () => {
    /// Tests checklist items: [3] — Feature 3.2
    it('unit_temple_fluting_children_detail', () => {
      const added = runTemple({ pillarCount: 6, pillarFluting: true });
      const pillars = getPillars(added);
      const pillar = pillars[0];
      expect(pillar.children.length).toBe(12);
      for (let f = 0; f < 8; f++) {
        const flute = pillar.children[2 + f];
        expect(flute.geometry.parameters.radiusTop).toBe(0.018);
        expect(flute.geometry.parameters.radiusBottom).toBe(0.024);
        expect(flute.geometry.parameters.height).toBe(3.7);
        expect(flute.geometry.parameters.radialSegments).toBe(4);
      }
    });

    /// Tests checklist items: [3] — Feature 3.2
    it('unit_temple_no_fluting_children_detail', () => {
      const added = runTemple({ pillarCount: 6, pillarFluting: false });
      const pillars = getPillars(added);
      const pillar = pillars[0];
      expect(pillar.children.length).toBe(4);

      const base = pillar.children[0];
      expect(base.geometry.parameters.width).toBe(0.6);
      expect(base.geometry.parameters.height).toBe(0.3);
      expect(base.geometry.parameters.depth).toBe(0.6);

      const shaft = pillar.children[1];
      expect(shaft.geometry.parameters.radiusTop).toBe(0.17);
      expect(shaft.geometry.parameters.radiusBottom).toBe(0.22);
      expect(shaft.geometry.parameters.height).toBe(3.8);
      expect(shaft.geometry.parameters.radialSegments).toBe(20);

      const echinus = pillar.children[2];
      expect(echinus.geometry.parameters.radiusTop).toBe(0.28);
      expect(echinus.geometry.parameters.radiusBottom).toBe(0.17);
      expect(echinus.geometry.parameters.height).toBe(0.15);
      expect(echinus.geometry.parameters.radialSegments).toBe(16);

      const abacus = pillar.children[3];
      expect(abacus.geometry.parameters.width).toBe(0.6);
      expect(abacus.geometry.parameters.height).toBe(0.1);
      expect(abacus.geometry.parameters.depth).toBe(0.6);
    });
  });
});
