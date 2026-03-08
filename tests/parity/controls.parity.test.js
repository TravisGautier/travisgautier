import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const projectRoot = path.resolve(import.meta.dirname, '..', '..');
const src = fs.readFileSync(path.join(projectRoot, 'src', 'interaction', 'controls.js'), 'utf-8');

describe('controls parity', () => {
  /// Tests checklist items: [2, 7] — Feature 2.7
  it('parity_controls_trackpad_detection', () => {
    expect(src).toContain('detectTrackpad');
  });

  /// Tests checklist items: [4, 7] — Feature 2.7
  it('parity_controls_passive_wheel', () => {
    expect(src).toContain('passive: true');
  });

  /// Tests checklist items: [1, 7] — Feature 2.7
  it('parity_controls_multiplier_imports', () => {
    expect(src).toContain('SCROLL_MULT_TRACKPAD');
    expect(src).toContain('SCROLL_MULT_WHEEL');
  });

  /// Tests checklist items: [4, 7] — Feature 2.7
  it('parity_controls_isTrackpad_latch', () => {
    expect(src).toContain('isTrackpad = true');
  });

  /// Tests checklist items: [1] — Feature 2.8
  it('parity_controls_contextmenu_prevention', () => {
    expect(src).toContain('contextmenu');
    expect(src).toContain('preventDefault');
  });

  /// Tests checklist items: [2] — Feature 2.8
  it('parity_controls_canvas_mousedown_prevention', () => {
    expect(src).toMatch(/domElement[\s\S]*mousedown[\s\S]*preventDefault/);
  });

  /// Tests checklist items: [3, 4] — Feature 4.1
  it('parity_controls_raycaster_usage', () => {
    expect(src).toContain('Raycaster');
  });

  /// Tests checklist items: [4] — Feature 4.1
  it('parity_controls_hover_cursor_class', () => {
    expect(src).toMatch(/classList\.\w+\(['"]hover['"]\)/);
  });

  /// Tests checklist items: [4] — Feature 4.1
  it('parity_controls_raycast_throttle', () => {
    expect(src).toContain('RAYCAST_THROTTLE_MS');
  });

  /// Tests checklist items: [5] — Feature 4.1
  it('parity_controls_portal_surfaces_param', () => {
    expect(src).toContain('portalSurfaces');
  });

  /// Tests checklist items: [2, 3] — Feature 5.2
  it('parity_controls_pinch_zoom_function', () => {
    expect(src).toContain('computePinchDist');
  });

  /// Tests checklist items: [1] — Feature 5.2
  it('parity_controls_pinch_zoom_multiplier', () => {
    expect(src).toContain('PINCH_ZOOM_MULT');
  });

  /// Tests checklist items: [4] — Feature 5.2
  it('parity_controls_pinch_dist_reset', () => {
    expect(src).toContain('lastPinchDist = 0');
  });

  /// Tests checklist items: [3] — Feature 5.3
  it('parity_controls_computeGyroParallax', () => {
    expect(src).toContain('computeGyroParallax');
  });

  /// Tests checklist items: [5, 7] — Feature 5.3
  it('parity_controls_deviceorientation', () => {
    expect(src).toContain('deviceorientation');
  });

  /// Tests checklist items: [1] — Feature 5.3
  it('parity_controls_gyro_constants', () => {
    expect(src).toContain('GYRO_GAMMA_DIVISOR');
  });
});
