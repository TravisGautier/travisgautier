import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { createSetup } from '../../src/scene/setup.js';

function runSetup(config) {
  const container = { appendChild: () => {} };
  return createSetup(container, config ? { config } : {});
}

describe('setup', () => {
  /// Tests checklist items: [1]
  it('unit_setup_exports', () => {
    expect(typeof createSetup).toBe('function');

    // Mock a container element
    const container = {
      appendChild: () => {},
    };

    const result = createSetup(container);

    expect(result).toBeDefined();
    expect(result).toHaveProperty('scene');
    expect(result).toHaveProperty('camera');
    expect(result).toHaveProperty('renderer');
    // renderer.domElement should have been appended to container
    expect(result.renderer).toBeDefined();
  });

  /// Tests checklist items: [4, 5] — Feature 2.2
  it('unit_setup_accepts_options', () => {
    const container = {
      appendChild: () => {},
    };

    // createSetup should accept a second options parameter without throwing
    expect(() => createSetup(container, {})).not.toThrow();

    // Should also still work without options (backward compatible)
    expect(() => createSetup(container)).not.toThrow();
  });

  /// Tests checklist items: [4, 5] — Feature 2.2
  it('unit_setup_return_shape_unchanged', () => {
    const container = {
      appendChild: () => {},
    };

    const result = createSetup(container, {});

    expect(result).toBeDefined();
    expect(result).toHaveProperty('scene');
    expect(result).toHaveProperty('camera');
    expect(result).toHaveProperty('renderer');
  });

  describe('integration — config acceptance', () => {
    /// Tests checklist items: [1] — Feature 3.4
    it('int_setup_export_unchanged', () => {
      expect(typeof createSetup).toBe('function');
    });

    /// Tests checklist items: [1] — Feature 3.4
    it('int_setup_accepts_config', () => {
      const container = { appendChild: () => {} };
      expect(() =>
        createSetup(container, { config: { pixelRatio: 1, shadowsEnabled: false } })
      ).not.toThrow();
    });
  });

  describe('tier configs', () => {
    /// Tests checklist items: [2, 3] — Feature 3.4
    it('unit_setup_tier3_config', () => {
      const { renderer } = runSetup({ pixelRatio: 2, shadowsEnabled: true });
      expect(renderer.shadowMap.enabled).toBe(true);
    });

    /// Tests checklist items: [2, 3] — Feature 3.4
    it('unit_setup_tier2_config', () => {
      const { renderer } = runSetup({ pixelRatio: 1.5, shadowsEnabled: true });
      expect(renderer.shadowMap.enabled).toBe(true);
    });

    /// Tests checklist items: [2, 3] — Feature 3.4
    it('unit_setup_tier1_config', () => {
      const { renderer } = runSetup({ pixelRatio: 1, shadowsEnabled: false });
      expect(renderer.shadowMap.enabled).toBe(false);
    });

    /// Tests checklist items: [2, 3] — Feature 3.4
    it('unit_setup_tier0_config', () => {
      const { renderer } = runSetup({ pixelRatio: 1, shadowsEnabled: false });
      expect(renderer.shadowMap.enabled).toBe(false);
    });
  });

  describe('defaults and invariants', () => {
    /// Tests checklist items: [2, 3] — Feature 3.4
    it('unit_setup_default_no_config', () => {
      const { renderer } = runSetup();
      expect(renderer.shadowMap.enabled).toBe(true);
    });

    /// Tests checklist items: [2, 3, 4] — Feature 3.4
    it('unit_setup_invariants_across_tiers', () => {
      const configs = [
        undefined,
        { pixelRatio: 1, shadowsEnabled: false },
        { pixelRatio: 1, shadowsEnabled: false },
        { pixelRatio: 1.5, shadowsEnabled: true },
        { pixelRatio: 2, shadowsEnabled: true },
      ];

      for (const config of configs) {
        const { renderer, camera, scene } = runSetup(config);
        expect(renderer.toneMapping).toBe(THREE.ACESFilmicToneMapping);
        expect(renderer.toneMappingExposure).toBe(1.4);
        expect(renderer.shadowMap.type).toBe(THREE.PCFSoftShadowMap);
        expect(camera.fov).toBe(50);
        expect(scene.fog.density).toBeCloseTo(0.008);
      }
    });

    /// Tests checklist items: [1, 4] — Feature 3.4
    it('unit_setup_return_shape_with_config', () => {
      const result = runSetup({ pixelRatio: 1.5, shadowsEnabled: true });
      expect(result).toHaveProperty('scene');
      expect(result).toHaveProperty('camera');
      expect(result).toHaveProperty('renderer');
    });
  });

  /// Tests checklist items: [7] — Feature 6.2
  it('int_canvas_aria_hidden', () => {
    const appendedChildren = [];
    const container = { appendChild: (child) => appendedChildren.push(child) };
    createSetup(container);
    // The appended canvas (renderer.domElement) should have aria-hidden="true"
    const canvas = appendedChildren[0];
    expect(canvas.getAttribute('aria-hidden')).toBe('true');
  });
});
