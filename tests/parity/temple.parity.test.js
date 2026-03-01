import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { createTemple } from '../../src/scene/temple.js';

const added = [];
const scene = { add: (obj) => added.push(obj) };
createTemple(scene);

describe('temple parity', () => {
  /// Tests checklist items: [5]
  it('parity_temple_floor', () => {
    const floor = added[0];
    expect(floor.geometry.parameters.radiusTop).toBe(6);
    expect(floor.geometry.parameters.radiusBottom).toBe(6.2);
    expect(floor.geometry.parameters.height).toBe(0.3);
    expect(floor.geometry.parameters.radialSegments).toBe(64);
    expect(floor.position.y).toBe(-0.15);
    expect(floor.material.color.getHex()).toBe(0xCCC4B4);
    expect(floor.receiveShadow).toBe(true);
  });

  /// Tests checklist items: [5]
  it('parity_temple_steps', () => {
    // Step 1: CylinderGeometry(6.8, 7.0, 0.2, 64), y=-0.4, stoneStep(0xBEB6A6)
    const step1 = added[1];
    expect(step1.geometry.parameters.radiusTop).toBe(6.8);
    expect(step1.geometry.parameters.radiusBottom).toBe(7.0);
    expect(step1.geometry.parameters.height).toBe(0.2);
    expect(step1.geometry.parameters.radialSegments).toBe(64);
    expect(step1.position.y).toBe(-0.4);
    expect(step1.material.color.getHex()).toBe(0xBEB6A6);

    // Step 2: CylinderGeometry(7.4, 7.6, 0.2, 64), y=-0.6, stoneFloor(0xCCC4B4)
    const step2 = added[2];
    expect(step2.geometry.parameters.radiusTop).toBe(7.4);
    expect(step2.geometry.parameters.radiusBottom).toBe(7.6);
    expect(step2.geometry.parameters.height).toBe(0.2);
    expect(step2.position.y).toBe(-0.6);
    expect(step2.material.color.getHex()).toBe(0xCCC4B4);

    // Step 3: CylinderGeometry(8.0, 8.3, 0.25, 64), y=-0.85, stoneStep(0xBEB6A6)
    const step3 = added[3];
    expect(step3.geometry.parameters.radiusTop).toBe(8.0);
    expect(step3.geometry.parameters.radiusBottom).toBe(8.3);
    expect(step3.geometry.parameters.height).toBe(0.25);
    expect(step3.position.y).toBe(-0.85);
    expect(step3.material.color.getHex()).toBe(0xBEB6A6);
  });

  /// Tests checklist items: [5]
  it('parity_temple_floor_rings', () => {
    // Ring 1: RingGeometry(2.8, 3.0, 64)
    const ring1 = added[4];
    expect(ring1.geometry.parameters.innerRadius).toBe(2.8);
    expect(ring1.geometry.parameters.outerRadius).toBe(3.0);
    expect(ring1.geometry.parameters.thetaSegments).toBe(64);
    expect(ring1.rotation.x).toBeCloseTo(-Math.PI / 2, 5);
    expect(ring1.position.y).toBe(0.01);

    // Ring 2: RingGeometry(1.5, 1.55, 64)
    const ring2 = added[5];
    expect(ring2.geometry.parameters.innerRadius).toBe(1.5);
    expect(ring2.geometry.parameters.outerRadius).toBe(1.55);
    expect(ring2.geometry.parameters.thetaSegments).toBe(64);
    expect(ring2.rotation.x).toBeCloseTo(-Math.PI / 2, 5);
    expect(ring2.position.y).toBe(0.01);

    // Shared ring material
    expect(ring1.material.color.getHex()).toBe(0xB8A888);
    expect(ring1.material.metalness).toBe(0.15);
    expect(ring1.material.roughness).toBe(0.45);
    expect(ring1.material.side).toBe(THREE.DoubleSide);
  });

  /// Tests checklist items: [5]
  it('parity_temple_pillar_count', () => {
    const pillars = added.slice(6, 18);
    expect(pillars.length).toBe(12);
    for (const pillar of pillars) {
      expect(pillar).toBeInstanceOf(THREE.Group);
      const dist = Math.sqrt(pillar.position.x ** 2 + pillar.position.z ** 2);
      expect(dist).toBeCloseTo(5.2, 1);
    }
  });

  /// Tests checklist items: [5]
  it('parity_temple_pillar_structure', () => {
    // Each pillar group: base + shaft + 8 flutes + echinus + abacus = 12 children
    const pillar = added[6];
    expect(pillar.children.length).toBe(12);

    // Base: BoxGeometry(0.6, 0.3, 0.6), y=0.15
    const base = pillar.children[0];
    expect(base.geometry.parameters.width).toBe(0.6);
    expect(base.geometry.parameters.height).toBe(0.3);
    expect(base.geometry.parameters.depth).toBe(0.6);
    expect(base.position.y).toBe(0.15);

    // Shaft: CylinderGeometry(0.17, 0.22, 3.8, 20), y=2.2
    const shaft = pillar.children[1];
    expect(shaft.geometry.parameters.radiusTop).toBe(0.17);
    expect(shaft.geometry.parameters.radiusBottom).toBe(0.22);
    expect(shaft.geometry.parameters.height).toBe(3.8);
    expect(shaft.geometry.parameters.radialSegments).toBe(20);
    expect(shaft.position.y).toBe(2.2);

    // 8 flutes: CylinderGeometry(0.018, 0.024, 3.7, 4)
    for (let f = 0; f < 8; f++) {
      const flute = pillar.children[2 + f];
      expect(flute.geometry.parameters.radiusTop).toBe(0.018);
      expect(flute.geometry.parameters.radiusBottom).toBe(0.024);
      expect(flute.geometry.parameters.height).toBe(3.7);
      expect(flute.geometry.parameters.radialSegments).toBe(4);
    }

    // Echinus: CylinderGeometry(0.28, 0.17, 0.15, 16), y=4.15
    const echinus = pillar.children[10];
    expect(echinus.geometry.parameters.radiusTop).toBe(0.28);
    expect(echinus.geometry.parameters.radiusBottom).toBe(0.17);
    expect(echinus.geometry.parameters.height).toBe(0.15);
    expect(echinus.geometry.parameters.radialSegments).toBe(16);
    expect(echinus.position.y).toBe(4.15);

    // Abacus: BoxGeometry(0.6, 0.1, 0.6), y=4.28
    const abacus = pillar.children[11];
    expect(abacus.geometry.parameters.width).toBe(0.6);
    expect(abacus.geometry.parameters.height).toBe(0.1);
    expect(abacus.geometry.parameters.depth).toBe(0.6);
    expect(abacus.position.y).toBe(4.28);
  });

  /// Tests checklist items: [5]
  it('parity_temple_pillar_materials', () => {
    const pillar = added[6];

    // Base: marbleCream 0xF0E8DC, metalness=0.02, roughness=0.55
    expect(pillar.children[0].material.color.getHex()).toBe(0xF0E8DC);
    expect(pillar.children[0].material.metalness).toBe(0.02);
    expect(pillar.children[0].material.roughness).toBe(0.55);

    // Shaft: marbleWhite 0xE8E0D4, metalness=0.02, roughness=0.45
    expect(pillar.children[1].material.color.getHex()).toBe(0xE8E0D4);
    expect(pillar.children[1].material.metalness).toBe(0.02);
    expect(pillar.children[1].material.roughness).toBe(0.45);

    // Flutes: marbleWarm 0xD8CCBC, metalness=0.05, roughness=0.5
    expect(pillar.children[2].material.color.getHex()).toBe(0xD8CCBC);
    expect(pillar.children[2].material.metalness).toBe(0.05);
    expect(pillar.children[2].material.roughness).toBe(0.5);

    // Echinus: marbleCream 0xF0E8DC
    expect(pillar.children[10].material.color.getHex()).toBe(0xF0E8DC);

    // Abacus: marbleWhite 0xE8E0D4
    expect(pillar.children[11].material.color.getHex()).toBe(0xE8E0D4);
  });

  /// Tests checklist items: [5]
  it('parity_temple_architrave', () => {
    const arch = added[18];
    expect(arch.geometry.parameters.radius).toBe(5.2);
    expect(arch.geometry.parameters.tube).toBe(0.14);
    expect(arch.geometry.parameters.radialSegments).toBe(8);
    expect(arch.geometry.parameters.tubularSegments).toBe(64);
    expect(arch.rotation.x).toBeCloseTo(Math.PI / 2, 5);
    expect(arch.position.y).toBe(4.38);
  });

  /// Tests checklist items: [5]
  it('parity_temple_total_adds', () => {
    // floor + 3 steps + 2 rings + 12 pillar groups + architrave = 19
    expect(added.length).toBe(19);
  });
});
