import { describe, it, expect } from 'vitest';
import { detectTrackpad, computeScrollDelta } from '../../src/interaction/controls.js';

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
