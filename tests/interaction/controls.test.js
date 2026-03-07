import { describe, it, expect, vi } from 'vitest';
import { detectTrackpad, computeScrollDelta, checkPortalHover } from '../../src/interaction/controls.js';

describe('detectTrackpad', () => {
  /// Tests checklist items: [2, 6] — Feature 2.7
  it('unit_detectTrackpad_small_noninteger', () => {
    expect(detectTrackpad(2.5)).toBe(true);
  });

  /// Tests checklist items: [2, 6] — Feature 2.7
  it('unit_detectTrackpad_large_integer', () => {
    expect(detectTrackpad(100)).toBe(false);
  });

  /// Tests checklist items: [2, 6] — Feature 2.7
  it('unit_detectTrackpad_zero', () => {
    expect(detectTrackpad(0)).toBe(false);
  });

  /// Tests checklist items: [2, 6] — Feature 2.7
  it('unit_detectTrackpad_negative_small', () => {
    expect(detectTrackpad(-3.7)).toBe(true);
  });

  /// Tests checklist items: [2, 6] — Feature 2.7
  it('unit_detectTrackpad_small_integer', () => {
    expect(detectTrackpad(3)).toBe(false);
  });
});

describe('computeScrollDelta', () => {
  /// Tests checklist items: [3, 6] — Feature 2.7
  it('unit_computeScrollDelta_wheel', () => {
    expect(computeScrollDelta(0, 100, false)).toBeCloseTo(0.08, 5);
  });

  /// Tests checklist items: [3, 6] — Feature 2.7
  it('unit_computeScrollDelta_trackpad', () => {
    expect(computeScrollDelta(0, 5, true)).toBeCloseTo(0.015, 5);
  });

  /// Tests checklist items: [3, 6] — Feature 2.7
  it('unit_computeScrollDelta_clamp_max', () => {
    expect(computeScrollDelta(0.95, 100, false)).toBe(1.0);
  });

  /// Tests checklist items: [3, 6] — Feature 2.7
  it('unit_computeScrollDelta_clamp_min', () => {
    expect(computeScrollDelta(-0.95, -100, false)).toBe(-1.0);
  });
});

describe('checkPortalHover', () => {
  /// Tests checklist items: [3] — Feature 4.1
  it('unit_checkPortalHover_is_function', () => {
    expect(typeof checkPortalHover).toBe('function');
  });

  /// Tests checklist items: [3] — Feature 4.1
  it('unit_checkPortalHover_returns_true_on_intersection', () => {
    const raycaster = {
      setFromCamera: vi.fn(),
      intersectObjects: vi.fn().mockReturnValue([{ object: {} }]),
    };
    const camera = {};
    const ndc = { x: 0.5, y: -0.3 };
    const surfaces = [{}, {}];

    const result = checkPortalHover(raycaster, camera, ndc, surfaces);
    expect(result).toBe(true);
  });

  /// Tests checklist items: [3] — Feature 4.1
  it('unit_checkPortalHover_returns_false_no_intersection', () => {
    const raycaster = {
      setFromCamera: vi.fn(),
      intersectObjects: vi.fn().mockReturnValue([]),
    };
    const camera = {};
    const ndc = { x: 0, y: 0 };
    const surfaces = [{}, {}];

    const result = checkPortalHover(raycaster, camera, ndc, surfaces);
    expect(result).toBe(false);
  });

  /// Tests checklist items: [3] — Feature 4.1
  it('unit_checkPortalHover_calls_setFromCamera', () => {
    const raycaster = {
      setFromCamera: vi.fn(),
      intersectObjects: vi.fn().mockReturnValue([]),
    };
    const camera = { id: 'cam' };
    const ndc = { x: 0.2, y: -0.4 };
    const surfaces = [{}];

    checkPortalHover(raycaster, camera, ndc, surfaces);
    expect(raycaster.setFromCamera).toHaveBeenCalledWith(ndc, camera);
  });

  /// Tests checklist items: [3] — Feature 4.1
  it('unit_checkPortalHover_calls_intersectObjects', () => {
    const raycaster = {
      setFromCamera: vi.fn(),
      intersectObjects: vi.fn().mockReturnValue([]),
    };
    const camera = {};
    const ndc = { x: 0, y: 0 };
    const surfaces = [{}, {}];

    checkPortalHover(raycaster, camera, ndc, surfaces);
    expect(raycaster.intersectObjects).toHaveBeenCalledWith(surfaces);
  });

  /// Tests checklist items: [3] — Feature 4.1
  it('unit_checkPortalHover_empty_surfaces', () => {
    const raycaster = {
      setFromCamera: vi.fn(),
      intersectObjects: vi.fn().mockReturnValue([]),
    };
    const camera = {};
    const ndc = { x: 0, y: 0 };

    const result = checkPortalHover(raycaster, camera, ndc, []);
    expect(result).toBe(false);
  });
});
