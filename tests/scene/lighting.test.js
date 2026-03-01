import { describe, it, expect } from 'vitest';
import { createLighting } from '../../src/scene/lighting.js';

describe('lighting', () => {
  /// Tests checklist items: [5]
  it('unit_lighting_exports', () => {
    expect(typeof createLighting).toBe('function');

    // Mock scene with add method
    const scene = { add: () => {} };

    const result = createLighting(scene);

    expect(result).toBeDefined();
    expect(result).toHaveProperty('goldLight');
    expect(result).toHaveProperty('purpleLight');
    expect(result).toHaveProperty('groundGlow');
    expect(result).toHaveProperty('pillarLight1');
    expect(result).toHaveProperty('pillarLight2');
    expect(result).toHaveProperty('hemiLight');
  });
});
