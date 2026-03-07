import { getGPUTier } from 'detect-gpu';

const TIER_CONFIGS = [
  { pixelRatio: 1, shadowMapSize: 0, shadowsEnabled: false, particleCount: 0, pillarCount: 6, pillarFluting: false, cloudLayers: 0, skyCloudNoise: false },
  { pixelRatio: 1, shadowMapSize: 0, shadowsEnabled: false, particleCount: 50, pillarCount: 8, pillarFluting: false, cloudLayers: 1, skyCloudNoise: false },
  { pixelRatio: 1.5, shadowMapSize: 1024, shadowsEnabled: true, particleCount: 100, pillarCount: 10, pillarFluting: false, cloudLayers: 1, skyCloudNoise: true },
  { pixelRatio: 0, shadowMapSize: 2048, shadowsEnabled: true, particleCount: 200, pillarCount: 12, pillarFluting: true, cloudLayers: 2, skyCloudNoise: true },
];

function isMobile() {
  try {
    return /Mobile/i.test(globalThis.navigator?.userAgent);
  } catch {
    return false;
  }
}

function isSmallScreen() {
  try {
    return (globalThis.innerWidth || Infinity) < 768;
  } catch {
    return false;
  }
}

export async function determineQuality() {
  let tier = 0;

  try {
    const result = await getGPUTier();
    tier = result.tier;
  } catch {
    tier = 0;
  }

  if (isMobile() && tier > 1) tier = 1;
  if (isSmallScreen() && tier > 2) tier = 2;

  tier = Math.max(0, Math.min(3, tier));

  const config = { tier, ...TIER_CONFIGS[tier] };

  if (tier === 3) {
    const dpr = globalThis.devicePixelRatio || 1;
    config.pixelRatio = Math.min(dpr, 2);
  }

  return config;
}
