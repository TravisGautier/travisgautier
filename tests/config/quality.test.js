import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('detect-gpu', () => ({
  getGPUTier: vi.fn(),
}));

describe('quality', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubGlobal('devicePixelRatio', 2);
    vi.stubGlobal('innerWidth', 1920);
    vi.stubGlobal('navigator', { userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  /// Tests checklist items: [1] — Feature 3.1
  it('unit_quality_exports_async', async () => {
    const { getGPUTier } = await import('detect-gpu');
    getGPUTier.mockResolvedValue({ tier: 3, type: 'BENCHMARK' });
    const { determineQuality } = await import('../../src/config/quality.js');
    expect(typeof determineQuality).toBe('function');
    const result = determineQuality();
    expect(result).toBeInstanceOf(Promise);
    await result;
  });

  /// Tests checklist items: [5] — Feature 3.1
  it('unit_quality_returns_all_keys', async () => {
    const { getGPUTier } = await import('detect-gpu');
    getGPUTier.mockResolvedValue({ tier: 3, type: 'BENCHMARK' });
    const { determineQuality } = await import('../../src/config/quality.js');
    const config = await determineQuality();
    const keys = ['tier', 'pixelRatio', 'shadowMapSize', 'shadowsEnabled', 'particleCount', 'pillarCount', 'pillarFluting', 'cloudLayers', 'skyCloudNoise'];
    for (const key of keys) {
      expect(config).toHaveProperty(key);
      expect(config[key]).not.toBeUndefined();
    }
  });

  /// Tests checklist items: [2, 5] — Feature 3.1
  it('unit_quality_tier3_config', async () => {
    const { getGPUTier } = await import('detect-gpu');
    getGPUTier.mockResolvedValue({ tier: 3, type: 'BENCHMARK' });
    const { determineQuality } = await import('../../src/config/quality.js');
    const config = await determineQuality();
    expect(config.tier).toBe(3);
    expect(config.pixelRatio).toBe(2);
    expect(config.shadowMapSize).toBe(2048);
    expect(config.shadowsEnabled).toBe(true);
    expect(config.particleCount).toBe(200);
    expect(config.pillarCount).toBe(12);
    expect(config.pillarFluting).toBe(true);
    expect(config.cloudLayers).toBe(2);
    expect(config.skyCloudNoise).toBe(true);
  });

  /// Tests checklist items: [2, 5] — Feature 3.1
  it('unit_quality_tier2_config', async () => {
    const { getGPUTier } = await import('detect-gpu');
    getGPUTier.mockResolvedValue({ tier: 2, type: 'BENCHMARK' });
    const { determineQuality } = await import('../../src/config/quality.js');
    const config = await determineQuality();
    expect(config.tier).toBe(2);
    expect(config.pixelRatio).toBe(1.5);
    expect(config.shadowMapSize).toBe(1024);
    expect(config.shadowsEnabled).toBe(true);
    expect(config.particleCount).toBe(100);
    expect(config.pillarCount).toBe(10);
    expect(config.pillarFluting).toBe(false);
    expect(config.cloudLayers).toBe(1);
    expect(config.skyCloudNoise).toBe(true);
  });

  /// Tests checklist items: [2, 5] — Feature 3.1
  it('unit_quality_tier1_config', async () => {
    const { getGPUTier } = await import('detect-gpu');
    getGPUTier.mockResolvedValue({ tier: 1, type: 'FALLBACK' });
    const { determineQuality } = await import('../../src/config/quality.js');
    const config = await determineQuality();
    expect(config.tier).toBe(1);
    expect(config.pixelRatio).toBe(1);
    expect(config.shadowMapSize).toBe(0);
    expect(config.shadowsEnabled).toBe(false);
    expect(config.particleCount).toBe(50);
    expect(config.pillarCount).toBe(8);
    expect(config.pillarFluting).toBe(false);
    expect(config.cloudLayers).toBe(1);
    expect(config.skyCloudNoise).toBe(false);
  });

  /// Tests checklist items: [2, 5] — Feature 3.1
  it('unit_quality_tier0_config', async () => {
    const { getGPUTier } = await import('detect-gpu');
    getGPUTier.mockResolvedValue({ tier: 0, type: 'WEBGL_UNSUPPORTED' });
    const { determineQuality } = await import('../../src/config/quality.js');
    const config = await determineQuality();
    expect(config.tier).toBe(0);
    expect(config.pixelRatio).toBe(1);
    expect(config.shadowMapSize).toBe(0);
    expect(config.shadowsEnabled).toBe(false);
    expect(config.particleCount).toBe(0);
    expect(config.pillarCount).toBe(6);
    expect(config.pillarFluting).toBe(false);
    expect(config.cloudLayers).toBe(0);
    expect(config.skyCloudNoise).toBe(false);
  });

  /// Tests checklist items: [3] — Feature 3.1
  it('unit_quality_mobile_caps_tier1', async () => {
    vi.stubGlobal('navigator', { userAgent: 'Mozilla/5.0 (Linux; Android 10; Pixel 3) AppleWebKit/537.36 Mobile' });
    const { getGPUTier } = await import('detect-gpu');
    getGPUTier.mockResolvedValue({ tier: 3, type: 'BENCHMARK' });
    const { determineQuality } = await import('../../src/config/quality.js');
    const config = await determineQuality();
    expect(config.tier).toBe(1);
    expect(config.particleCount).toBe(50);
    expect(config.pillarCount).toBe(8);
  });

  /// Tests checklist items: [4] — Feature 3.1
  it('unit_quality_small_screen_caps_tier2', async () => {
    vi.stubGlobal('innerWidth', 600);
    const { getGPUTier } = await import('detect-gpu');
    getGPUTier.mockResolvedValue({ tier: 3, type: 'BENCHMARK' });
    const { determineQuality } = await import('../../src/config/quality.js');
    const config = await determineQuality();
    expect(config.tier).toBe(2);
    expect(config.particleCount).toBe(100);
    expect(config.pillarCount).toBe(10);
  });

  /// Tests checklist items: [3, 4] — Feature 3.1
  it('unit_quality_mobile_and_small_screen', async () => {
    vi.stubGlobal('navigator', { userAgent: 'Mozilla/5.0 (Linux; Android 10; Pixel 3) AppleWebKit/537.36 Mobile' });
    vi.stubGlobal('innerWidth', 600);
    const { getGPUTier } = await import('detect-gpu');
    getGPUTier.mockResolvedValue({ tier: 3, type: 'BENCHMARK' });
    const { determineQuality } = await import('../../src/config/quality.js');
    const config = await determineQuality();
    expect(config.tier).toBe(1);
    expect(config.particleCount).toBe(50);
  });

  /// Tests checklist items: [6] — Feature 3.1
  it('unit_quality_fallback_on_error', async () => {
    const { getGPUTier } = await import('detect-gpu');
    getGPUTier.mockRejectedValue(new Error('GPU detection failed'));
    const { determineQuality } = await import('../../src/config/quality.js');
    const config = await determineQuality();
    expect(config.tier).toBe(0);
    const keys = ['tier', 'pixelRatio', 'shadowMapSize', 'shadowsEnabled', 'particleCount', 'pillarCount', 'pillarFluting', 'cloudLayers', 'skyCloudNoise'];
    for (const key of keys) {
      expect(config).toHaveProperty(key);
    }
  });

  /// Tests checklist items: [5] — Feature 3.1
  it('unit_quality_pixel_ratio_caps_dpr', async () => {
    vi.stubGlobal('devicePixelRatio', 3);
    const { getGPUTier } = await import('detect-gpu');
    getGPUTier.mockResolvedValue({ tier: 3, type: 'BENCHMARK' });
    const { determineQuality } = await import('../../src/config/quality.js');
    const config = await determineQuality();
    expect(config.pixelRatio).toBe(2);
  });

  /// Tests checklist items: [5] — Feature 3.1
  it('unit_quality_pixel_ratio_low_dpr', async () => {
    vi.stubGlobal('devicePixelRatio', 1.5);
    const { getGPUTier } = await import('detect-gpu');
    getGPUTier.mockResolvedValue({ tier: 3, type: 'BENCHMARK' });
    const { determineQuality } = await import('../../src/config/quality.js');
    const config = await determineQuality();
    expect(config.pixelRatio).toBe(1.5);
  });

  /// Tests checklist items: [6] — Feature 3.1
  it('unit_quality_ssr_returns_tier0', async () => {
    vi.unstubAllGlobals();
    const { getGPUTier } = await import('detect-gpu');
    getGPUTier.mockResolvedValue({ tier: 0, type: 'SSR' });
    const { determineQuality } = await import('../../src/config/quality.js');
    const config = await determineQuality();
    expect(config.tier).toBe(0);
    expect(config.pixelRatio).toBe(1);
  });

  /// Tests checklist items: [2] — Feature 5.3
  it('unit_quality_tier0_useGyroscope', async () => {
    const { getGPUTier } = await import('detect-gpu');
    getGPUTier.mockResolvedValue({ tier: 0, type: 'WEBGL_UNSUPPORTED' });
    const { determineQuality } = await import('../../src/config/quality.js');
    const config = await determineQuality();
    expect(config.useGyroscope).toBe(true);
  });

  /// Tests checklist items: [2] — Feature 5.3
  it('unit_quality_tier1_useGyroscope', async () => {
    const { getGPUTier } = await import('detect-gpu');
    getGPUTier.mockResolvedValue({ tier: 1, type: 'FALLBACK' });
    const { determineQuality } = await import('../../src/config/quality.js');
    const config = await determineQuality();
    expect(config.useGyroscope).toBe(true);
  });

  /// Tests checklist items: [2] — Feature 5.3
  it('unit_quality_tier2_useGyroscope', async () => {
    const { getGPUTier } = await import('detect-gpu');
    getGPUTier.mockResolvedValue({ tier: 2, type: 'BENCHMARK' });
    const { determineQuality } = await import('../../src/config/quality.js');
    const config = await determineQuality();
    expect(config.useGyroscope).toBe(false);
  });

  /// Tests checklist items: [2] — Feature 5.3
  it('unit_quality_tier3_useGyroscope', async () => {
    const { getGPUTier } = await import('detect-gpu');
    getGPUTier.mockResolvedValue({ tier: 3, type: 'BENCHMARK' });
    const { determineQuality } = await import('../../src/config/quality.js');
    const config = await determineQuality();
    expect(config.useGyroscope).toBe(false);
  });

  /// Tests checklist items: [2] — Feature 5.3
  it('unit_quality_returns_all_keys_includes_useGyroscope', async () => {
    const { getGPUTier } = await import('detect-gpu');
    getGPUTier.mockResolvedValue({ tier: 3, type: 'BENCHMARK' });
    const { determineQuality } = await import('../../src/config/quality.js');
    const config = await determineQuality();
    expect(config).toHaveProperty('useGyroscope');
    expect(typeof config.useGyroscope).toBe('boolean');
  });

  /// Tests checklist items: [5] — Feature 3.1
  it('unit_quality_config_valid_ranges', async () => {
    const tiers = [
      { tier: 0, type: 'WEBGL_UNSUPPORTED' },
      { tier: 1, type: 'FALLBACK' },
      { tier: 2, type: 'BENCHMARK' },
      { tier: 3, type: 'BENCHMARK' },
    ];
    for (const gpuResult of tiers) {
      vi.resetModules();
      const { getGPUTier } = await import('detect-gpu');
      getGPUTier.mockResolvedValue(gpuResult);
      const { determineQuality } = await import('../../src/config/quality.js');
      const config = await determineQuality();

      expect(Number.isInteger(config.tier)).toBe(true);
      expect(config.tier).toBeGreaterThanOrEqual(0);
      expect(config.tier).toBeLessThanOrEqual(3);
      expect(config.pixelRatio).toBeGreaterThanOrEqual(1);
      expect(config.pixelRatio).toBeLessThanOrEqual(2);
      expect([0, 1024, 2048]).toContain(config.shadowMapSize);
      expect(typeof config.shadowsEnabled).toBe('boolean');
      expect([0, 50, 100, 200]).toContain(config.particleCount);
      expect([6, 8, 10, 12]).toContain(config.pillarCount);
      expect(typeof config.pillarFluting).toBe('boolean');
      expect([0, 1, 2]).toContain(config.cloudLayers);
      expect(typeof config.skyCloudNoise).toBe('boolean');
    }
  });

  /// Tests checklist items: [2] — Feature 5.3
  it('unit_quality_config_valid_ranges_includes_useGyroscope', async () => {
    const tiers = [
      { tier: 0, type: 'WEBGL_UNSUPPORTED' },
      { tier: 1, type: 'FALLBACK' },
      { tier: 2, type: 'BENCHMARK' },
      { tier: 3, type: 'BENCHMARK' },
    ];
    const expectedGyro = [true, true, false, false];
    for (let i = 0; i < tiers.length; i++) {
      vi.resetModules();
      const { getGPUTier } = await import('detect-gpu');
      getGPUTier.mockResolvedValue(tiers[i]);
      const { determineQuality } = await import('../../src/config/quality.js');
      const config = await determineQuality();
      expect(config.useGyroscope).toBe(expectedGyro[i]);
    }
  });

  // --- REDUCED MOTION TESTS (Feature 6.1) ---

  /// Tests checklist items: [1] — Feature 6.1
  it('unit_quality_reduced_motion_flags_true', async () => {
    vi.stubGlobal('matchMedia', (query) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    const { getGPUTier } = await import('detect-gpu');
    getGPUTier.mockResolvedValue({ tier: 3, type: 'BENCHMARK' });
    const { determineQuality } = await import('../../src/config/quality.js');
    const config = await determineQuality();
    expect(config.freezeShaderTime).toBe(true);
    expect(config.disableParticles).toBe(true);
    expect(config.disablePortalBob).toBe(true);
    expect(config.instantCameraTransition).toBe(true);
  });

  /// Tests checklist items: [1] — Feature 6.1
  it('unit_quality_reduced_motion_flags_false', async () => {
    vi.stubGlobal('matchMedia', (query) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    const { getGPUTier } = await import('detect-gpu');
    getGPUTier.mockResolvedValue({ tier: 3, type: 'BENCHMARK' });
    const { determineQuality } = await import('../../src/config/quality.js');
    const config = await determineQuality();
    expect(config.freezeShaderTime).toBe(false);
    expect(config.disableParticles).toBe(false);
    expect(config.disablePortalBob).toBe(false);
    expect(config.instantCameraTransition).toBe(false);
  });

  /// Tests checklist items: [1] — Feature 6.1
  it('unit_quality_reduced_motion_no_matchMedia', async () => {
    vi.stubGlobal('matchMedia', undefined);
    const { getGPUTier } = await import('detect-gpu');
    getGPUTier.mockResolvedValue({ tier: 3, type: 'BENCHMARK' });
    const { determineQuality } = await import('../../src/config/quality.js');
    const config = await determineQuality();
    expect(config.freezeShaderTime).toBe(false);
    expect(config.disableParticles).toBe(false);
    expect(config.disablePortalBob).toBe(false);
    expect(config.instantCameraTransition).toBe(false);
  });

  /// Tests checklist items: [1] — Feature 6.1
  it('unit_quality_reduced_motion_matchMedia_throws', async () => {
    vi.stubGlobal('matchMedia', () => { throw new Error('matchMedia not supported'); });
    const { getGPUTier } = await import('detect-gpu');
    getGPUTier.mockResolvedValue({ tier: 3, type: 'BENCHMARK' });
    const { determineQuality } = await import('../../src/config/quality.js');
    const config = await determineQuality();
    expect(config.freezeShaderTime).toBe(false);
    expect(config.disableParticles).toBe(false);
    expect(config.disablePortalBob).toBe(false);
    expect(config.instantCameraTransition).toBe(false);
  });
});
