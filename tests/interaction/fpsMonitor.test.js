import { describe, it, expect, vi } from 'vitest';
import { createFPSMonitor, applyRuntimeDowngrade } from '../../src/interaction/fpsMonitor.js';

describe('fpsMonitor', () => {
  /// Tests checklist items: [1]
  it('unit_fpsMonitor_exports', () => {
    expect(typeof createFPSMonitor).toBe('function');
    expect(typeof createFPSMonitor(vi.fn())).toBe('function');
  });

  /// Tests checklist items: [1]
  it('unit_fpsMonitor_no_callback_before_threshold', () => {
    const onDowngrade = vi.fn();
    const sample = createFPSMonitor(onDowngrade);

    // Feed 119 slow samples — not enough to evaluate
    for (let i = 0; i < 119; i++) {
      sample(0.030);
    }

    expect(onDowngrade).not.toHaveBeenCalled();
  });

  /// Tests checklist items: [1]
  it('unit_fpsMonitor_triggers_downgrade_on_slow_fps', () => {
    const onDowngrade = vi.fn();
    const sample = createFPSMonitor(onDowngrade);

    // Feed 120 samples at ~30fps (dt=0.033)
    for (let i = 0; i < 120; i++) {
      sample(0.033);
    }

    expect(onDowngrade).toHaveBeenCalledTimes(1);
  });

  /// Tests checklist items: [1]
  it('unit_fpsMonitor_no_downgrade_on_good_fps', () => {
    const onDowngrade = vi.fn();
    const sample = createFPSMonitor(onDowngrade);

    // Feed 120 samples at ~60fps (dt=0.016)
    for (let i = 0; i < 120; i++) {
      sample(0.016);
    }

    expect(onDowngrade).not.toHaveBeenCalled();
  });

  /// Tests checklist items: [1, 8]
  it('unit_fpsMonitor_settled_after_evaluation', () => {
    const onDowngrade = vi.fn();
    const sample = createFPSMonitor(onDowngrade);

    // First 120 bad samples trigger downgrade
    for (let i = 0; i < 120; i++) {
      sample(0.033);
    }
    expect(onDowngrade).toHaveBeenCalledTimes(1);

    // 120 more bad samples — settled, no re-trigger
    for (let i = 0; i < 120; i++) {
      sample(0.033);
    }
    expect(onDowngrade).toHaveBeenCalledTimes(1);
  });

  /// Tests checklist items: [1, 8]
  it('unit_fpsMonitor_settled_no_op', () => {
    const onDowngrade = vi.fn();
    const sample = createFPSMonitor(onDowngrade);

    // 120 good samples — settles without triggering
    for (let i = 0; i < 120; i++) {
      sample(0.016);
    }

    // 120 bad samples after settling — ignored
    for (let i = 0; i < 120; i++) {
      sample(0.050);
    }

    expect(onDowngrade).not.toHaveBeenCalled();
  });

  /// Tests checklist items: [1]
  it('unit_fpsMonitor_boundary_exactly_threshold', () => {
    const onDowngrade = vi.fn();
    const sample = createFPSMonitor(onDowngrade);

    // Feed 120 samples exactly at threshold (0.022)
    for (let i = 0; i < 120; i++) {
      sample(0.022);
    }

    // Strict greater-than: avg === threshold should NOT trigger
    expect(onDowngrade).not.toHaveBeenCalled();
  });

  /// Tests checklist items: [1]
  it('unit_fpsMonitor_boundary_just_above', () => {
    const onDowngrade = vi.fn();
    const sample = createFPSMonitor(onDowngrade);

    // Feed 120 samples just above threshold
    for (let i = 0; i < 120; i++) {
      sample(0.0221);
    }

    expect(onDowngrade).toHaveBeenCalledTimes(1);
  });

  /// Tests checklist items: [1]
  it('unit_fpsMonitor_mixed_samples_above', () => {
    const onDowngrade = vi.fn();
    const sample = createFPSMonitor(onDowngrade);

    // 60 fast + 60 slow = avg 0.023 > 0.022
    for (let i = 0; i < 60; i++) {
      sample(0.016);
    }
    for (let i = 0; i < 60; i++) {
      sample(0.030);
    }

    expect(onDowngrade).toHaveBeenCalledTimes(1);
  });

  /// Tests checklist items: [1]
  it('unit_fpsMonitor_mixed_samples_below', () => {
    const onDowngrade = vi.fn();
    const sample = createFPSMonitor(onDowngrade);

    // 80 fast + 40 slow = avg ~0.02067 < 0.022
    for (let i = 0; i < 80; i++) {
      sample(0.016);
    }
    for (let i = 0; i < 40; i++) {
      sample(0.030);
    }

    expect(onDowngrade).not.toHaveBeenCalled();
  });
});

describe('applyRuntimeDowngrade', () => {
  /// Tests checklist items: [4, 6]
  it('unit_downgrade_drops_pixel_ratio', () => {
    const renderer = {
      getPixelRatio: () => 2.0,
      setPixelRatio: vi.fn(),
      shadowMap: { enabled: true },
    };
    const particleMat = { visible: true };
    const skyMat = { uniforms: { uSkyCloudNoise: { value: 1.0 } } };

    applyRuntimeDowngrade(renderer, particleMat, skyMat);

    expect(renderer.setPixelRatio).toHaveBeenCalledWith(1.5);
  });

  /// Tests checklist items: [4, 6]
  it('unit_downgrade_pixel_ratio_floor', () => {
    const renderer = {
      getPixelRatio: () => 1.0,
      setPixelRatio: vi.fn(),
      shadowMap: { enabled: true },
    };
    const particleMat = { visible: true };
    const skyMat = { uniforms: { uSkyCloudNoise: { value: 1.0 } } };

    applyRuntimeDowngrade(renderer, particleMat, skyMat);

    // Should not go below 1.0
    expect(renderer.setPixelRatio).toHaveBeenCalledWith(1.0);
  });

  /// Tests checklist items: [4]
  it('unit_downgrade_disables_shadows', () => {
    const renderer = {
      getPixelRatio: () => 2.0,
      setPixelRatio: vi.fn(),
      shadowMap: { enabled: true },
    };
    const particleMat = { visible: true };
    const skyMat = { uniforms: { uSkyCloudNoise: { value: 1.0 } } };

    applyRuntimeDowngrade(renderer, particleMat, skyMat);

    expect(renderer.shadowMap.enabled).toBe(false);
  });

  /// Tests checklist items: [4]
  it('unit_downgrade_hides_particles', () => {
    const renderer = {
      getPixelRatio: () => 2.0,
      setPixelRatio: vi.fn(),
      shadowMap: { enabled: true },
    };
    const particleMat = { visible: true };
    const skyMat = { uniforms: { uSkyCloudNoise: { value: 1.0 } } };

    applyRuntimeDowngrade(renderer, particleMat, skyMat);

    expect(particleMat.visible).toBe(false);
  });

  /// Tests checklist items: [4]
  it('unit_downgrade_disables_cloud_noise', () => {
    const renderer = {
      getPixelRatio: () => 2.0,
      setPixelRatio: vi.fn(),
      shadowMap: { enabled: true },
    };
    const particleMat = { visible: true };
    const skyMat = { uniforms: { uSkyCloudNoise: { value: 1.0 } } };

    applyRuntimeDowngrade(renderer, particleMat, skyMat);

    expect(skyMat.uniforms.uSkyCloudNoise.value).toBe(0.0);
  });

  /// Tests checklist items: [4, 8]
  it('unit_downgrade_idempotent', () => {
    const renderer = {
      getPixelRatio: () => 1.0,
      setPixelRatio: vi.fn(),
      shadowMap: { enabled: false },
    };
    const particleMat = { visible: false };
    const skyMat = { uniforms: { uSkyCloudNoise: { value: 0.0 } } };

    // Should not throw on already-downgraded state
    expect(() => applyRuntimeDowngrade(renderer, particleMat, skyMat)).not.toThrow();

    // State remains unchanged
    expect(renderer.shadowMap.enabled).toBe(false);
    expect(particleMat.visible).toBe(false);
    expect(skyMat.uniforms.uSkyCloudNoise.value).toBe(0.0);
    expect(renderer.setPixelRatio).toHaveBeenCalledWith(1.0);
  });
});
