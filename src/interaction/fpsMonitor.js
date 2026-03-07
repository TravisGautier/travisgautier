import { FPS_SAMPLE_COUNT, FPS_THRESHOLD, FPS_DOWNGRADE_PIXEL_RATIO_DROP } from '../config/constants.js';

export function createFPSMonitor(onDowngrade) {
  const samples = [];
  let settled = false;

  return function sample(dt) {
    if (settled) return;

    samples.push(dt);

    if (samples.length >= FPS_SAMPLE_COUNT) {
      const avg = samples.reduce((a, b) => a + b, 0) / samples.length;
      if (avg > FPS_THRESHOLD) {
        onDowngrade();
      }
      settled = true;
    }
  };
}

export function applyRuntimeDowngrade(renderer, particleMat, skyMat) {
  renderer.setPixelRatio(Math.max(1, renderer.getPixelRatio() - FPS_DOWNGRADE_PIXEL_RATIO_DROP));
  renderer.shadowMap.enabled = false;
  particleMat.visible = false;
  skyMat.uniforms.uSkyCloudNoise.value = 0.0;
}
