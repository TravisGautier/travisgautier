/**
 * Creates a mock state object with sensible defaults.
 * Mirrors src/interaction/state.js but allows overrides for test isolation.
 * @param {object} [overrides] - Properties to override.
 * @returns {object} State object.
 */
export function createMockState(overrides = {}) {
  const mouseDefaults = { x: 0, y: 0, nx: 0, ny: 0 };
  return {
    mouse: { ...mouseDefaults, ...(overrides.mouse || {}) },
    scroll: 0,
    hoverPortal: false,
    time: 0,
    holding: false,
    holdProgress: 0,
    reversing: false,
    currentAngle: 0.25,
    targetAngle: 0.25,
    hasEngaged: false,
    transitioning: false,
    dwellTimer: 0,
    isTouchDevice: false,
    ...overrides,
    // Re-apply mouse after spread to preserve nested merge
    mouse: { ...mouseDefaults, ...(overrides.mouse || {}) },
  };
}

/**
 * Creates a mock quality config with tier-3 defaults.
 * Mirrors the output of src/config/quality.js determineQuality().
 * @param {object} [overrides] - Properties to override.
 * @returns {object} Quality config object.
 */
export function createMockQualityConfig(overrides = {}) {
  return {
    tier: 3,
    pixelRatio: 2,
    shadowMapSize: 2048,
    shadowsEnabled: true,
    particleCount: 200,
    pillarCount: 12,
    pillarFluting: true,
    cloudLayers: 2,
    skyCloudNoise: true,
    useGyroscope: false,
    freezeShaderTime: false,
    disableParticles: false,
    disablePortalBob: false,
    instantCameraTransition: false,
    ...overrides,
  };
}

/**
 * Preset quality configs for each tier.
 */
export const TIER_CONFIGS = {
  tier0: {
    tier: 0,
    pixelRatio: 1,
    shadowMapSize: 0,
    shadowsEnabled: false,
    particleCount: 0,
    pillarCount: 6,
    pillarFluting: false,
    cloudLayers: 0,
    skyCloudNoise: false,
    useGyroscope: true,
    freezeShaderTime: false,
    disableParticles: false,
    disablePortalBob: false,
    instantCameraTransition: false,
  },
  tier1: {
    tier: 1,
    pixelRatio: 1,
    shadowMapSize: 0,
    shadowsEnabled: false,
    particleCount: 50,
    pillarCount: 8,
    pillarFluting: false,
    cloudLayers: 1,
    skyCloudNoise: false,
    useGyroscope: true,
    freezeShaderTime: false,
    disableParticles: false,
    disablePortalBob: false,
    instantCameraTransition: false,
  },
  tier2: {
    tier: 2,
    pixelRatio: 1.5,
    shadowMapSize: 1024,
    shadowsEnabled: true,
    particleCount: 100,
    pillarCount: 10,
    pillarFluting: false,
    cloudLayers: 1,
    skyCloudNoise: true,
    useGyroscope: false,
    freezeShaderTime: false,
    disableParticles: false,
    disablePortalBob: false,
    instantCameraTransition: false,
  },
  tier3: {
    tier: 3,
    pixelRatio: 2,
    shadowMapSize: 2048,
    shadowsEnabled: true,
    particleCount: 200,
    pillarCount: 12,
    pillarFluting: true,
    cloudLayers: 2,
    skyCloudNoise: true,
    useGyroscope: false,
    freezeShaderTime: false,
    disableParticles: false,
    disablePortalBob: false,
    instantCameraTransition: false,
  },
};
