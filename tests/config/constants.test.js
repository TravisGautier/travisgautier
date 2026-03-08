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
  MIN_ORBIT_RADIUS,
  MAX_ORBIT_RADIUS,
  SCROLL_MULT_TRACKPAD,
  SCROLL_MULT_WHEEL,
  FPS_SAMPLE_COUNT,
  FPS_THRESHOLD,
  FPS_DOWNGRADE_PIXEL_RATIO_DROP,
  RAYCAST_THROTTLE_MS,
  NAV_LINKS,
  PINCH_ZOOM_MULT,
  GYRO_GAMMA_DIVISOR,
  GYRO_BETA_OFFSET,
  GYRO_BETA_DIVISOR,
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

  /// Tests checklist items: [1] — Feature 2.6
  it('unit_constants_orbit_bounds', () => {
    expect(MIN_ORBIT_RADIUS).toBe(2.8);
    expect(MAX_ORBIT_RADIUS).toBe(5.0);
  });

  /// Tests checklist items: [1] — Feature 2.6
  it('unit_constants_orbit_bounds_range', () => {
    expect(MIN_ORBIT_RADIUS).toBeLessThan(CAM_ORBIT_RADIUS);
    expect(CAM_ORBIT_RADIUS).toBeLessThan(MAX_ORBIT_RADIUS);
  });

  /// Tests checklist items: [1, 3] — Feature 2.6
  it('unit_orbit_clamp_behavior', () => {
    // At scroll=1.0 (max zoom in): 4.2 - 1.0 * 1.2 = 3.0 (within bounds)
    const radiusZoomIn = Math.max(MIN_ORBIT_RADIUS, Math.min(MAX_ORBIT_RADIUS, CAM_ORBIT_RADIUS - 1.0 * 1.2));
    expect(radiusZoomIn).toBe(3.0);

    // At scroll=-1.0 (max zoom out): 4.2 - (-1.0) * 1.2 = 5.4 → clamped to 5.0
    const radiusZoomOut = Math.max(MIN_ORBIT_RADIUS, Math.min(MAX_ORBIT_RADIUS, CAM_ORBIT_RADIUS - (-1.0) * 1.2));
    expect(radiusZoomOut).toBe(5.0);

    // At scroll=0 (default): orbit radius = CAM_ORBIT_RADIUS (4.2, within bounds)
    const radiusDefault = Math.max(MIN_ORBIT_RADIUS, Math.min(MAX_ORBIT_RADIUS, CAM_ORBIT_RADIUS - 0 * 1.2));
    expect(radiusDefault).toBe(CAM_ORBIT_RADIUS);
  });

  /// Tests checklist items: [1, 5] — Feature 2.7
  it('unit_constants_scroll_multipliers', () => {
    expect(SCROLL_MULT_TRACKPAD).toBe(0.003);
    expect(SCROLL_MULT_WHEEL).toBe(0.0008);
  });

  /// Tests checklist items: [1, 5] — Feature 2.7
  it('unit_constants_scroll_multiplier_ratio', () => {
    expect(SCROLL_MULT_TRACKPAD).toBeGreaterThan(SCROLL_MULT_WHEEL);
  });

  /// Tests checklist items: [2] — Feature 3.6
  it('unit_constants_fps_sample_count', () => {
    expect(typeof FPS_SAMPLE_COUNT).toBe('number');
    expect(FPS_SAMPLE_COUNT).toBe(120);
  });

  /// Tests checklist items: [2] — Feature 3.6
  it('unit_constants_fps_threshold', () => {
    expect(typeof FPS_THRESHOLD).toBe('number');
    expect(FPS_THRESHOLD).toBe(0.022);
  });

  /// Tests checklist items: [2] — Feature 3.6
  it('unit_constants_fps_downgrade_pixel_ratio_drop', () => {
    expect(typeof FPS_DOWNGRADE_PIXEL_RATIO_DROP).toBe('number');
    expect(FPS_DOWNGRADE_PIXEL_RATIO_DROP).toBe(0.5);
  });

  /// Tests checklist items: [2] — Feature 4.1
  it('unit_constants_raycast_throttle_ms', () => {
    expect(typeof RAYCAST_THROTTLE_MS).toBe('number');
    expect(RAYCAST_THROTTLE_MS).toBe(50);
    expect(RAYCAST_THROTTLE_MS).toBeGreaterThan(0);
  });

  /// Tests checklist items: [3] — Feature 4.3
  it('unit_nav_links_defined', () => {
    expect(NAV_LINKS).toBeDefined();
    expect(NAV_LINKS.contact).toBeDefined();
    expect(NAV_LINKS.contact.label).toBe('Contact');
    expect(NAV_LINKS.contact.href).toBe('mailto:travis@travisgautier.com');
  });

  /// Tests checklist items: [1] — Feature 5.2
  it('unit_constants_PINCH_ZOOM_MULT_exists', () => {
    expect(typeof PINCH_ZOOM_MULT).toBe('number');
  });

  /// Tests checklist items: [1] — Feature 5.2
  it('unit_constants_PINCH_ZOOM_MULT_value', () => {
    expect(PINCH_ZOOM_MULT).toBe(0.005);
  });

  /// Tests checklist items: [1] — Feature 5.3
  it('unit_constants_GYRO_GAMMA_DIVISOR', () => {
    expect(typeof GYRO_GAMMA_DIVISOR).toBe('number');
    expect(GYRO_GAMMA_DIVISOR).toBe(45);
  });

  /// Tests checklist items: [1] — Feature 5.3
  it('unit_constants_GYRO_BETA_OFFSET', () => {
    expect(typeof GYRO_BETA_OFFSET).toBe('number');
    expect(GYRO_BETA_OFFSET).toBe(45);
  });

  /// Tests checklist items: [1] — Feature 5.3
  it('unit_constants_GYRO_BETA_DIVISOR', () => {
    expect(typeof GYRO_BETA_DIVISOR).toBe('number');
    expect(GYRO_BETA_DIVISOR).toBe(45);
  });
});
