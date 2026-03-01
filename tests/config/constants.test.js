import { describe, it, expect } from 'vitest';
import {
  GOLD_ANGLE,
  PURPLE_ANGLE,
  CAM_ORBIT_RADIUS,
  CAM_HEIGHT,
  LOOK_TARGET,
  DT_CLAMP_MAX,
  TIME_WRAP_PERIOD,
  DAMP_ANGLE_BASE,
  DAMP_SCROLL_BASE,
  DAMP_CAM_XZ_BASE,
  DAMP_CAM_Y_BASE,
  DAMP_HOVER_BASE,
} from '../../src/config/constants.js';

describe('constants', () => {
  /// Tests checklist items: [1]
  it('unit_constants_camera_exports', () => {
    expect(GOLD_ANGLE).toBe(0.25);
    expect(PURPLE_ANGLE).toBe(Math.PI + 0.25);
    expect(CAM_ORBIT_RADIUS).toBe(4.2);
    expect(CAM_HEIGHT).toBe(2.0);
  });

  /// Tests checklist items: [1]
  it('unit_constants_look_target', () => {
    expect(LOOK_TARGET).toBeDefined();
    expect(LOOK_TARGET.x).toBe(0);
    expect(LOOK_TARGET.y).toBe(1.2);
    expect(LOOK_TARGET.z).toBe(0);
  });

  /// Tests checklist items: [1] — Feature 2.1
  it('unit_constants_dt_clamp_max', () => {
    expect(DT_CLAMP_MAX).toBe(0.1);
    expect(DT_CLAMP_MAX).toBeGreaterThan(0);
  });

  /// Tests checklist items: [1] — Feature 2.4
  it('unit_time_wrap_constant', () => {
    expect(TIME_WRAP_PERIOD).toBeDefined();
    expect(typeof TIME_WRAP_PERIOD).toBe('number');
    expect(TIME_WRAP_PERIOD).toBe(10000.0);
  });

  /// Tests checklist items: [3] — Feature 2.4
  it('unit_time_wrap_basic', () => {
    expect(10000.0 % TIME_WRAP_PERIOD).toBe(0);
    expect(15000.5 % TIME_WRAP_PERIOD).toBeCloseTo(5000.5, 5);
    expect(25432.7 % TIME_WRAP_PERIOD).toBeCloseTo(5432.7, 5);
  });

  /// Tests checklist items: [3] — Feature 2.4
  it('unit_time_wrap_small_values', () => {
    expect(0 % TIME_WRAP_PERIOD).toBe(0);
    expect(500.0 % TIME_WRAP_PERIOD).toBeCloseTo(500.0, 5);
    expect(9999.9 % TIME_WRAP_PERIOD).toBeCloseTo(9999.9, 5);
  });

  /// Tests checklist items: [1] — Feature 2.5
  it('unit_damp_constants_exist', () => {
    expect(typeof DAMP_ANGLE_BASE).toBe('number');
    expect(typeof DAMP_SCROLL_BASE).toBe('number');
    expect(typeof DAMP_CAM_XZ_BASE).toBe('number');
    expect(typeof DAMP_CAM_Y_BASE).toBe('number');
    expect(typeof DAMP_HOVER_BASE).toBe('number');
  });

  /// Tests checklist items: [1] — Feature 2.5
  it('unit_damp_constants_range', () => {
    const bases = [DAMP_ANGLE_BASE, DAMP_SCROLL_BASE, DAMP_CAM_XZ_BASE, DAMP_CAM_Y_BASE, DAMP_HOVER_BASE];
    for (const base of bases) {
      expect(base).toBeGreaterThan(0);
      expect(base).toBeLessThan(1);
    }
  });

  /// Tests checklist items: [1] — Feature 2.5
  it('unit_damp_constants_ordering', () => {
    // Faster damping (higher original factor) = smaller base value
    // 0.15 > 0.14 > 0.12 > 0.10 > 0.05  =>  CAM_XZ < ANGLE < CAM_Y < SCROLL < HOVER
    expect(DAMP_CAM_XZ_BASE).toBeLessThan(DAMP_ANGLE_BASE);
    expect(DAMP_ANGLE_BASE).toBeLessThan(DAMP_CAM_Y_BASE);
    expect(DAMP_CAM_Y_BASE).toBeLessThan(DAMP_SCROLL_BASE);
    expect(DAMP_SCROLL_BASE).toBeLessThan(DAMP_HOVER_BASE);
  });

  /// Tests checklist items: [3] — Feature 2.5
  it('unit_damp_frame_rate_independence', () => {
    const bases = [DAMP_ANGLE_BASE, DAMP_SCROLL_BASE, DAMP_CAM_XZ_BASE, DAMP_CAM_Y_BASE, DAMP_HOVER_BASE];
    for (const base of bases) {
      const results = {};
      for (const fps of [30, 60, 144]) {
        const dt = 1 / fps;
        let val = 10;
        for (let i = 0; i < fps; i++) {
          val += (0 - val) * (1 - Math.pow(base, dt));
        }
        results[fps] = val;
      }
      expect(results[30]).toBeCloseTo(results[60], 10);
      expect(results[60]).toBeCloseTo(results[144], 10);
    }
  });

  /// Tests checklist items: [1, 3] — Feature 2.5
  it('unit_damp_matches_original_at_60fps', () => {
    const dt60 = 1 / 60;
    expect(1 - Math.pow(DAMP_ANGLE_BASE, dt60)).toBeCloseTo(0.14, 10);
    expect(1 - Math.pow(DAMP_SCROLL_BASE, dt60)).toBeCloseTo(0.10, 10);
    expect(1 - Math.pow(DAMP_CAM_XZ_BASE, dt60)).toBeCloseTo(0.15, 10);
    expect(1 - Math.pow(DAMP_CAM_Y_BASE, dt60)).toBeCloseTo(0.12, 10);
    expect(1 - Math.pow(DAMP_HOVER_BASE, dt60)).toBeCloseTo(0.05, 10);
  });
});
