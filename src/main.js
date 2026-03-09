import { GOLD_ANGLE, PURPLE_ANGLE, CAM_ORBIT_RADIUS, CAM_HEIGHT, LOOK_TARGET } from './config/constants.js';
import { state } from './interaction/state.js';
import { createSetup } from './scene/setup.js';
import { createEnvironment } from './scene/environment.js';
import { createTemple } from './scene/temple.js';
import { createPortal } from './scene/portal.js';
import { createLighting } from './scene/lighting.js';
import { initControls } from './interaction/controls.js';
import { initCursor } from './interaction/cursor.js';
import { updateHoldProgress } from './interaction/holdMechanic.js';
import { createFPSMonitor, applyRuntimeDowngrade } from './interaction/fpsMonitor.js';
import { initOverlay, showContextLostMessage } from './ui/overlay.js';
import { updateTransition, dismissTransition } from './ui/transition.js';
import { startAnimateLoop } from './animate.js';
import { determineQuality } from './config/quality.js';
import { hideLoading } from './ui/loading.js';

async function init() {
  const quality = await determineQuality();

  if (quality.tier === 0) {
    const { initFallback } = await import('./ui/fallback.js');
    initFallback();
    hideLoading();
    return;
  }

  const container = document.getElementById('canvas-container');
  let animLoop;
  const { scene, camera, renderer } = createSetup(container, {
    onContextLost: () => {
      animLoop.stop();
      showContextLostMessage();
    },
    onContextRestored: () => {
      location.reload();
    },
  });

  const { skyMat, cloudSeaMat, cloudSea2, particles, particleSpeeds, particleMat } = createEnvironment(scene);
  createTemple(scene);
  const { portalGroup, portalMatA, portalMatB, edgeMat, surfA, surfB } = createPortal(scene);
  const { goldLight, purpleLight, groundGlow, pillarLight1, pillarLight2, hemiLight } = createLighting(scene);

  const { getScrollTarget } = initControls(state, camera, renderer, [surfA, surfB], dismissTransition);
  const { updateCursor } = initCursor();
  const { updateOverlay } = initOverlay();

  const sampleFPS = createFPSMonitor(() => applyRuntimeDowngrade(renderer, particleMat, skyMat));

  const motionConfig = {
    freezeShaderTime: quality.freezeShaderTime,
    disableParticles: quality.disableParticles,
    disablePortalBob: quality.disablePortalBob,
    instantCameraTransition: quality.instantCameraTransition,
  };

  animLoop = startAnimateLoop({
    state, scene, camera, renderer,
    portalGroup, portalMatA, portalMatB, edgeMat,
    goldLight, purpleLight, groundGlow, pillarLight1, pillarLight2, hemiLight,
    skyMat, cloudSeaMat, cloudSea2,
    particles, particleSpeeds, particleMat,
    updateHoldProgress, updateTransition, updateOverlay, updateCursor,
    getScrollTarget,
    sampleFPS,
    motionConfig,
  });
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}
