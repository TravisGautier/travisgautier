import { describe, it, expect } from 'vitest';
import { createPortal } from '../../src/scene/portal.js';

describe('portal', () => {
  /// Tests checklist items: [4]
  it('unit_portal_exports', () => {
    expect(typeof createPortal).toBe('function');

    // Mock scene with add method
    const scene = { add: () => {} };

    const result = createPortal(scene);

    expect(result).toBeDefined();
    expect(result).toHaveProperty('portalGroup');
    expect(result).toHaveProperty('portalMatA');
    expect(result.portalMatA.uniforms).toHaveProperty('uTime');
    expect(result.portalMatA.uniforms).toHaveProperty('uMouse');
    expect(result.portalMatA.uniforms).toHaveProperty('uHover');
    expect(result).toHaveProperty('portalMatB');
    expect(result.portalMatB.uniforms).toHaveProperty('uTime');
    expect(result.portalMatB.uniforms).toHaveProperty('uMouse');
    expect(result.portalMatB.uniforms).toHaveProperty('uHover');
    expect(result).toHaveProperty('edgeMat');
  });

  /// Tests checklist items: [1] — Feature 4.1
  it('unit_portal_exports_surfA_and_surfB', () => {
    const scene = { add: () => {} };
    const result = createPortal(scene);
    expect(result).toHaveProperty('surfA');
    expect(result).toHaveProperty('surfB');
    expect(result.surfA.isMesh).toBe(true);
    expect(result.surfB.isMesh).toBe(true);
  });
});
