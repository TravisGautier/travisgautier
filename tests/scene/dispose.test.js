import { describe, it, expect, vi } from 'vitest';
import { dispose } from '../../src/scene/setup.js';

describe('dispose', () => {
  /// Tests checklist items: [3, 6] — Feature 2.8
  it('unit_dispose_export', () => {
    expect(typeof dispose).toBe('function');
  });

  /// Tests checklist items: [3] — Feature 2.8
  it('unit_dispose_traverses_geometry', () => {
    const geomDispose = vi.fn();
    const objects = [{ geometry: { dispose: geomDispose } }];
    const scene = { traverse: (cb) => objects.forEach(cb) };
    const renderer = { dispose: vi.fn() };

    dispose(scene, renderer);

    expect(geomDispose).toHaveBeenCalledTimes(1);
  });

  /// Tests checklist items: [3] — Feature 2.8
  it('unit_dispose_traverses_material', () => {
    const matDispose = vi.fn();
    const objects = [{ material: { dispose: matDispose } }];
    const scene = { traverse: (cb) => objects.forEach(cb) };
    const renderer = { dispose: vi.fn() };

    dispose(scene, renderer);

    expect(matDispose).toHaveBeenCalledTimes(1);
  });

  /// Tests checklist items: [4] — Feature 2.8
  it('unit_dispose_handles_material_array', () => {
    const mat1 = { dispose: vi.fn() };
    const mat2 = { dispose: vi.fn() };
    const objects = [{ material: [mat1, mat2] }];
    const scene = { traverse: (cb) => objects.forEach(cb) };
    const renderer = { dispose: vi.fn() };

    dispose(scene, renderer);

    expect(mat1.dispose).toHaveBeenCalledTimes(1);
    expect(mat2.dispose).toHaveBeenCalledTimes(1);
  });

  /// Tests checklist items: [5] — Feature 2.8
  it('unit_dispose_calls_renderer_dispose', () => {
    const scene = { traverse: (cb) => {} };
    const renderer = { dispose: vi.fn() };

    dispose(scene, renderer);

    expect(renderer.dispose).toHaveBeenCalledTimes(1);
  });

  /// Tests checklist items: [5] — Feature 2.8
  it('unit_dispose_calls_forceContextLoss', () => {
    const scene = { traverse: (cb) => {} };
    const renderer = { dispose: vi.fn(), forceContextLoss: vi.fn() };

    dispose(scene, renderer);

    expect(renderer.forceContextLoss).toHaveBeenCalledTimes(1);
  });

  /// Tests checklist items: [5] — Feature 2.8
  it('unit_dispose_skips_forceContextLoss_if_missing', () => {
    const scene = { traverse: (cb) => {} };
    const renderer = { dispose: vi.fn() };

    expect(() => dispose(scene, renderer)).not.toThrow();
  });
});
