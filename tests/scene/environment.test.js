import { describe, it, expect } from 'vitest';
import { createEnvironment } from '../../src/scene/environment.js';

describe('environment', () => {
  /// Tests checklist items: [2]
  it('unit_environment_exports', () => {
    expect(typeof createEnvironment).toBe('function');

    // Mock scene with add method
    const scene = { add: () => {} };

    const result = createEnvironment(scene);

    expect(result).toBeDefined();
    expect(result).toHaveProperty('skyMat');
    expect(result.skyMat.uniforms).toHaveProperty('uHold');
    expect(result.skyMat.uniforms).toHaveProperty('uTime');
    expect(result).toHaveProperty('cloudSeaMat');
    expect(result.cloudSeaMat.uniforms).toHaveProperty('uTime');
    expect(result.cloudSeaMat.uniforms).toHaveProperty('uHold');
    expect(result).toHaveProperty('cloudSea2');
    expect(result).toHaveProperty('particles');
    expect(result).toHaveProperty('particleSpeeds');
    expect(result.particleSpeeds).toHaveLength(200);
    expect(result).toHaveProperty('particleMat');
  });
});
