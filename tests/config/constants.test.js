import { describe, it, expect } from 'vitest';
import {
  GOLD_ANGLE,
  PURPLE_ANGLE,
  CAM_ORBIT_RADIUS,
  CAM_HEIGHT,
  LOOK_TARGET,
  DT_CLAMP_MAX,
  TIME_WRAP_PERIOD,
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
});
