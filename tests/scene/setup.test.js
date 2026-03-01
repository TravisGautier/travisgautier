import { describe, it, expect } from 'vitest';
import { createSetup } from '../../src/scene/setup.js';

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
});
