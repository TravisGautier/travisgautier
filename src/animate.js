import * as THREE from 'three';
import { GOLD_ANGLE, PURPLE_ANGLE, CAM_ORBIT_RADIUS, CAM_HEIGHT, LOOK_TARGET, DT_CLAMP_MAX } from './config/constants.js';

export function startAnimateLoop(deps) {
  const {
    state, scene, camera, renderer,
    portalGroup, portalMatA, portalMatB, edgeMat,
    goldLight, purpleLight, groundGlow, pillarLight1, pillarLight2, hemiLight,
    skyMat, cloudSeaMat, cloudSea2,
    particles, particleSpeeds, particleMat,
    updateHoldProgress, updateOverlay, updateCursor,
    getScrollTarget,
  } = deps;

  const clock = new THREE.Clock();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clock.stop();
    } else {
      clock.start();
    }
  });

  function animate() {
    requestAnimationFrame(animate);
    const dt = Math.min(clock.getDelta(), DT_CLAMP_MAX);
    state.time += dt;

    updateHoldProgress(state, dt);

    const p = state.holdProgress;

    state.targetAngle = GOLD_ANGLE + p * (PURPLE_ANGLE - GOLD_ANGLE);
    state.currentAngle += (state.targetAngle - state.currentAngle) * 0.14;

    const scrollTarget = getScrollTarget();
    state.scroll += (scrollTarget - state.scroll) * 0.1;

    portalGroup.position.y = 1.0 + Math.sin(state.time * 0.4) * 0.015;

    const orbitAngle = state.currentAngle + state.mouse.nx * 0.12;
    const orbitRadius = CAM_ORBIT_RADIUS - state.scroll * 1.2;
    const camY = CAM_HEIGHT + state.scroll * 0.4 + state.mouse.ny * 0.25;

    const targetX = Math.sin(orbitAngle) * orbitRadius;
    const targetZ = Math.cos(orbitAngle) * orbitRadius;

    camera.position.x += (targetX - camera.position.x) * 0.15;
    camera.position.z += (targetZ - camera.position.z) * 0.15;
    camera.position.y += (camY - camera.position.y) * 0.12;
    camera.lookAt(LOOK_TARGET);

    const hv = state.hoverPortal ? 1.0 : 0.0;
    portalMatA.uniforms.uTime.value = state.time;
    portalMatA.uniforms.uMouse.value.set(state.mouse.nx, state.mouse.ny);
    portalMatA.uniforms.uHover.value += (hv - portalMatA.uniforms.uHover.value) * 0.05;
    portalMatB.uniforms.uTime.value = state.time;
    portalMatB.uniforms.uMouse.value.set(state.mouse.nx, state.mouse.ny);
    portalMatB.uniforms.uHover.value += (hv - portalMatB.uniforms.uHover.value) * 0.05;

    const tRed = 0.78 + p * (0.61 - 0.78);
    const tGrn = 0.66 + p * (0.43 - 0.66);
    const tBlu = 0.30 + p * (1.0 - 0.30);
    edgeMat.color.setRGB(tRed, tGrn, tBlu);
    edgeMat.emissive.setRGB(tRed * 0.5, tGrn * 0.5, tBlu * 0.5);
    edgeMat.emissiveIntensity = 0.08 + Math.sin(state.time * 0.8) * 0.04;

    goldLight.intensity = (2.5 + Math.sin(state.time * 0.5) * 0.4) * (1 - p);
    purpleLight.intensity = (2.5 + Math.cos(state.time * 0.4) * 0.4) * p;

    groundGlow.color.setRGB(
      0.78 * (1 - p) + 0.61 * p,
      0.66 * (1 - p) + 0.43 * p,
      0.30 * (1 - p) + 1.0 * p
    );
    groundGlow.intensity = 0.8 + Math.sin(state.time * 0.6) * 0.3;

    pillarLight1.color.setRGB(
      1.0 * (1 - p) + 0.75 * p,
      0.91 * (1 - p) + 0.60 * p,
      0.77 * (1 - p) + 1.0 * p
    );
    pillarLight2.color.setRGB(
      1.0 * (1 - p) + 0.75 * p,
      0.91 * (1 - p) + 0.60 * p,
      0.77 * (1 - p) + 1.0 * p
    );

    skyMat.uniforms.uHold.value = p;
    skyMat.uniforms.uTime.value = state.time;

    cloudSeaMat.uniforms.uTime.value = state.time;
    cloudSeaMat.uniforms.uHold.value = p;
    cloudSea2.material.uniforms.uTime.value = state.time;
    cloudSea2.material.uniforms.uHold.value = p;

    const fogR = 0.75 * (1 - p) + 0.68 * p;
    const fogG = 0.83 * (1 - p) + 0.72 * p;
    const fogB = 0.89 * (1 - p) + 0.88 * p;
    scene.fog.color.setRGB(fogR, fogG, fogB);
    renderer.setClearColor(scene.fog.color);

    hemiLight.color.setRGB(
      0.53 * (1 - p) + 0.45 * p,
      0.73 * (1 - p) + 0.55 * p,
      0.86 * (1 - p) + 0.78 * p
    );

    const positions = particles.geometry.attributes.position.array;
    for (let i = 0; i < 200; i++) {
      positions[i * 3 + 1] += particleSpeeds[i];
      positions[i * 3] += Math.sin(state.time * 0.3 + i) * 0.001;
      if (positions[i * 3 + 1] > 8) {
        positions[i * 3 + 1] = -1;
        positions[i * 3] = (Math.random() - 0.5) * 16;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 16;
      }
    }
    particles.geometry.attributes.position.needsUpdate = true;
    particleMat.opacity = 0.3 + 0.2 * Math.sin(state.time * 0.4);

    updateOverlay(p);
    updateCursor(state);

    renderer.render(scene, camera);
  }

  animate();
}
