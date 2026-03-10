const FALLBACK_CONFIG = {
  tier: 0,
  pixelRatio: 1,
  shadowMapSize: 0,
  shadowsEnabled: false,
  particleCount: 0,
  pillarCount: 6,
  pillarFluting: false,
  cloudLayers: 0,
  skyCloudNoise: false,
};

export async function loadAssets(determineQuality, timeoutMs = 8000) {
  const fontPromise = (typeof document !== 'undefined' && document.fonts)
    ? document.fonts.ready.catch(() => {})
    : Promise.resolve();

  const qualityPromise = determineQuality();

  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('timeout')), timeoutMs)
  );

  let config;
  try {
    config = await Promise.race([qualityPromise, timeoutPromise]);
  } catch {
    config = { ...FALLBACK_CONFIG };
  }

  await fontPromise;

  return config;
}

let settled = false;

export function hideLoading() {
  if (typeof document === 'undefined') {
    return Promise.resolve();
  }

  const el = document.getElementById('loading');

  document.body.classList.add('scene-ready');

  if (!el || settled) {
    return Promise.resolve();
  }

  el.style.opacity = '0';
  settled = true;

  return new Promise((resolve) => {
    let removed = false;
    const done = () => {
      if (removed) return;
      removed = true;
      el.remove();
      resolve();
    };
    el.addEventListener('transitionend', done);
    setTimeout(done, 3000);
  });
}
