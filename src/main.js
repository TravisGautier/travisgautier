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
import { initOverlay } from './ui/overlay.js';
import { startAnimateLoop } from './animate.js';

function init() {
  const container = document.getElementById('canvas-container');
  const { scene, camera, renderer } = createSetup(container);

  const { skyMat, cloudSeaMat, cloudSea2, particles, particleSpeeds, particleMat } = createEnvironment(scene);
  createTemple(scene);
  const { portalGroup, portalMatA, portalMatB, edgeMat } = createPortal(scene);
  const { goldLight, purpleLight, groundGlow, pillarLight1, pillarLight2, hemiLight } = createLighting(scene);

  const { getScrollTarget } = initControls(state, camera, renderer);
  const { updateCursor } = initCursor();
  const { updateOverlay } = initOverlay();

  startAnimateLoop({
    state, scene, camera, renderer,
    portalGroup, portalMatA, portalMatB, edgeMat,
    goldLight, purpleLight, groundGlow, pillarLight1, pillarLight2, hemiLight,
    skyMat, cloudSeaMat, cloudSea2,
    particles, particleSpeeds, particleMat,
    updateHoldProgress, updateOverlay, updateCursor,
    getScrollTarget,
  });
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}
