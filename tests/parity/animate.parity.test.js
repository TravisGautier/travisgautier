import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const projectRoot = path.resolve(import.meta.dirname, '..', '..');
const src = fs.readFileSync(path.join(projectRoot, 'src', 'animate.js'), 'utf-8');

describe('animate parity', () => {
  /// Tests checklist items: [8]
  it('parity_anim_target_angle', () => {
    expect(src).toContain('GOLD_ANGLE + p * (PURPLE_ANGLE - GOLD_ANGLE)');
  });

  /// Tests checklist items: [8]
  it('parity_anim_angle_lerp', () => {
    expect(src).toContain('state.currentAngle) * 0.14');
  });

  /// Tests checklist items: [8]
  it('parity_anim_scroll_lerp', () => {
    expect(src).toContain('state.scroll) * 0.1');
  });

  /// Tests checklist items: [8]
  it('parity_anim_portal_bob', () => {
    expect(src).toContain('1.0 + Math.sin(state.time * 0.4) * 0.015');
  });

  /// Tests checklist items: [8]
  it('parity_anim_orbit_params', () => {
    expect(src).toContain('state.mouse.nx * 0.12');
    expect(src).toContain('state.scroll * 1.2');
    expect(src).toContain('state.scroll * 0.4');
    expect(src).toContain('state.mouse.ny * 0.25');
  });

  /// Tests checklist items: [8]
  it('parity_anim_camera_position_lerp', () => {
    expect(src).toContain('camera.position.x) * 0.15');
    expect(src).toContain('camera.position.z) * 0.15');
    expect(src).toContain('camera.position.y) * 0.12');
  });

  /// Tests checklist items: [8]
  it('parity_anim_hover_lerp', () => {
    expect(src).toContain('portalMatA.uniforms.uHover.value) * 0.05');
    expect(src).toContain('portalMatB.uniforms.uHover.value) * 0.05');
  });

  /// Tests checklist items: [8]
  it('parity_anim_edge_color_interpolation', () => {
    expect(src).toContain('0.78 + p * (0.61 - 0.78)');
    expect(src).toContain('0.66 + p * (0.43 - 0.66)');
    expect(src).toContain('0.30 + p * (1.0 - 0.30)');
  });

  /// Tests checklist items: [8]
  it('parity_anim_emissive_intensity', () => {
    expect(src).toContain('0.08 + Math.sin(state.time * 0.8) * 0.04');
  });

  /// Tests checklist items: [8]
  it('parity_anim_gold_light_formula', () => {
    expect(src).toContain('(2.5 + Math.sin(state.time * 0.5) * 0.4) * (1 - p)');
  });

  /// Tests checklist items: [8]
  it('parity_anim_purple_light_formula', () => {
    expect(src).toContain('(2.5 + Math.cos(state.time * 0.4) * 0.4) * p');
  });

  /// Tests checklist items: [8]
  it('parity_anim_fog_interpolation', () => {
    expect(src).toContain('0.75 * (1 - p) + 0.68 * p');
    expect(src).toContain('0.83 * (1 - p) + 0.72 * p');
    expect(src).toContain('0.89 * (1 - p) + 0.88 * p');
  });

  /// Tests checklist items: [8]
  it('parity_anim_hemi_light_interpolation', () => {
    expect(src).toContain('0.53 * (1 - p) + 0.45 * p');
    expect(src).toContain('0.73 * (1 - p) + 0.55 * p');
    expect(src).toContain('0.86 * (1 - p) + 0.78 * p');
  });

  /// Tests checklist items: [8]
  it('parity_anim_particle_logic', () => {
    expect(src).toContain('particleSpeeds[i]');
    expect(src).toContain('Math.sin(state.time * 0.3 + i) * 0.001');
    expect(src).toContain('positions[i * 3 + 1] > 8');
    expect(src).toContain('positions[i * 3 + 1] = -1');
    expect(src).toContain('(Math.random() - 0.5) * 16');
  });

  /// Tests checklist items: [8]
  it('parity_anim_particle_opacity', () => {
    expect(src).toContain('0.3 + 0.2 * Math.sin(state.time * 0.4)');
  });

  /// Tests checklist items: [2, 4] — Feature 2.1
  it('parity_anim_dt_clamp', () => {
    expect(src).toContain('Math.min(clock.getDelta(), DT_CLAMP_MAX)');
  });

  /// Tests checklist items: [3] — Feature 2.1
  it('parity_anim_visibility_handler', () => {
    expect(src).toContain("document.addEventListener('visibilitychange'");
    expect(src).toContain('clock.stop()');
    expect(src).toContain('clock.start()');
  });

  /// Tests checklist items: [2] — Feature 2.1
  it('parity_anim_dt_clamp_import', () => {
    expect(src).toContain('DT_CLAMP_MAX');
  });

  /// Tests checklist items: [2] — Feature 2.4
  it('parity_anim_time_wrap_import', () => {
    expect(src).toContain('TIME_WRAP_PERIOD');
  });

  /// Tests checklist items: [3] — Feature 2.4
  it('parity_anim_time_wrap_calc', () => {
    expect(src).toContain('state.time % TIME_WRAP_PERIOD');
  });

  /// Tests checklist items: [4] — Feature 2.4
  it('parity_anim_uniforms_wrapped', () => {
    expect(src).toContain('portalMatA.uniforms.uTime.value = wrappedTime');
    expect(src).toContain('portalMatB.uniforms.uTime.value = wrappedTime');
    expect(src).toContain('skyMat.uniforms.uTime.value = wrappedTime');
    expect(src).toContain('cloudSeaMat.uniforms.uTime.value = wrappedTime');
    expect(src).toContain('cloudSea2.material.uniforms.uTime.value = wrappedTime');
  });
});
