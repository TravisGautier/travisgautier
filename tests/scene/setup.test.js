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
});
