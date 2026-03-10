import * as THREE from 'three';
import { GOLD_ANGLE, PURPLE_ANGLE, CAM_ORBIT_RADIUS, MIN_ORBIT_RADIUS, MAX_ORBIT_RADIUS, CAM_HEIGHT, LOOK_TARGET, DT_CLAMP_MAX, TIME_WRAP_PERIOD, DAMP_ANGLE_BASE, DAMP_SCROLL_BASE, DAMP_CAM_XZ_BASE, DAMP_CAM_Y_BASE, DAMP_HOVER_BASE, DAMP_TILT_BASE } from './config/constants.js';
import { shortestAngularDiff } from './interaction/dragOrbit.js';

export function startAnimateLoop(deps) {
  const {
    state, scene, camera, renderer,
    portalGroup, portalMatA, portalMatB, edgeMat,
    goldLight, purpleLight, groundGlow, pillarLight1, pillarLight2, hemiLight,
    skyMat, cloudSeaMat, cloudSea2,
    particles, particleSpeeds, particleMat,
    updateHoldProgress, updateTransition, updateOverlay, updateCursor,
    getScrollTarget,
    sampleFPS,
    motionConfig,
  } = deps;

  const { freezeShaderTime, disableParticles, disablePortalBob, instantCameraTransition } = motionConfig || {};

  const clock = new THREE.Clock();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clock.stop();
    } else {
      clock.start();
    }
  });

  function dampFactor(base, dt) {
    return 1 - Math.pow(base, dt);
  }

  let animationId;

  function animate() {
    animationId = requestAnimationFrame(animate);
    const dt = Math.min(clock.getDelta(), DT_CLAMP_MAX);
    sampleFPS?.(dt);
    state.time += dt;
    const wrappedTime = freezeShaderTime ? 0 : state.time % TIME_WRAP_PERIOD;

    updateHoldProgress(state, dt);
    updateTransition(state, dt);

    const angleDiff = shortestAngularDiff(state.targetAngle, state.currentAngle);
    state.currentAngle += angleDiff * dampFactor(DAMP_ANGLE_BASE, dt);

    const p = state.holdProgress;

    const scrollTarget = getScrollTarget();
    state.scroll += (scrollTarget - state.scroll) * dampFactor(DAMP_SCROLL_BASE, dt);

    if (!disablePortalBob) {
      portalGroup.position.y = 1.0 + Math.sin(state.time * 0.4) * 0.015;
    }

    const orbitAngle = state.currentAngle;
    const orbitRadius = Math.max(MIN_ORBIT_RADIUS, Math.min(MAX_ORBIT_RADIUS, CAM_ORBIT_RADIUS - state.scroll * 1.2));
    state.currentTilt += (state.targetTilt - state.currentTilt) * dampFactor(DAMP_TILT_BASE, dt);
    const camY = CAM_HEIGHT + state.scroll * 0.4;

    const targetX = Math.sin(orbitAngle) * orbitRadius;
    const targetZ = Math.cos(orbitAngle) * orbitRadius;

    if (instantCameraTransition) {
      camera.position.x = targetX;
      camera.position.z = targetZ;
      camera.position.y = camY;
    } else {
      camera.position.x += (targetX - camera.position.x) * dampFactor(DAMP_CAM_XZ_BASE, dt);
      camera.position.z += (targetZ - camera.position.z) * dampFactor(DAMP_CAM_XZ_BASE, dt);
      camera.position.y += (camY - camera.position.y) * dampFactor(DAMP_CAM_Y_BASE, dt);
    }
    const lookY = LOOK_TARGET.y + state.currentTilt * 2.0;
    camera.lookAt(new THREE.Vector3(LOOK_TARGET.x, lookY, LOOK_TARGET.z));

    const hv = state.hoverPortal ? 1.0 : 0.0;
    portalMatA.uniforms.uTime.value = wrappedTime;
    portalMatA.uniforms.uMouse.value.set(state.mouse.nx, state.mouse.ny);
    portalMatA.uniforms.uHover.value += (hv - portalMatA.uniforms.uHover.value) * dampFactor(DAMP_HOVER_BASE, dt);
    portalMatB.uniforms.uTime.value = wrappedTime;
    portalMatB.uniforms.uMouse.value.set(state.mouse.nx, state.mouse.ny);
    portalMatB.uniforms.uHover.value += (hv - portalMatB.uniforms.uHover.value) * dampFactor(DAMP_HOVER_BASE, dt);

    const tRed = 0.78 + p * (0.61 - 0.78);
    const tGrn = 0.66 + p * (0.43 - 0.66);
    const tBlu = 0.30 + p * (1.0 - 0.30);
    edgeMat.color.setRGB(tRed, tGrn, tBlu);
    edgeMat.emissive.setRGB(tRed * 0.5, tGrn * 0.5, tBlu * 0.5);
    edgeMat.emissiveIntensity = 0.08 + Math.sin(state.time * 0.8) * 0.04;

    goldLight.intensity = (2.5 + Math.sin(state.time * 0.5) * 0.3 + Math.sin(state.time * 1.3) * 0.1) * (1 - p);
    purpleLight.intensity = (2.5 + Math.cos(state.time * 0.4) * 0.3 + Math.cos(state.time * 1.1) * 0.1) * p;

    groundGlow.color.setRGB(
      0.78 * (1 - p) + 0.61 * p,
      0.66 * (1 - p) + 0.43 * p,
      0.30 * (1 - p) + 1.0 * p
    );
    groundGlow.intensity = 0.8 + Math.sin(state.time * 0.6) * 0.2 + Math.sin(state.time * 1.7) * 0.1;

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
    const pillarBreath = 0.5 + Math.sin(state.time * 0.7) * 0.08 + Math.sin(state.time * 1.9) * 0.04;
    pillarLight1.intensity = pillarBreath;
    pillarLight2.intensity = pillarBreath;

    skyMat.uniforms.uHold.value = p;
    skyMat.uniforms.uTime.value = wrappedTime;

    if (cloudSeaMat) {
      cloudSeaMat.uniforms.uTime.value = wrappedTime;
      cloudSeaMat.uniforms.uHold.value = p;
    }
    if (cloudSea2) {
      cloudSea2.material.uniforms.uTime.value = wrappedTime;
      cloudSea2.material.uniforms.uHold.value = p;
    }

    const fogR = 0.75 * (1 - p) + 0.68 * p;
    const fogG = 0.83 * (1 - p) + 0.72 * p;
    const fogB = 0.89 * (1 - p) + 0.88 * p;
    scene.fog.color.setRGB(fogR, fogG, fogB);
    renderer.setClearColor(scene.fog.color);
    scene.fog.density = 0.007 + p * 0.003;

    hemiLight.color.setRGB(
      0.53 * (1 - p) + 0.45 * p,
      0.73 * (1 - p) + 0.55 * p,
      0.86 * (1 - p) + 0.78 * p
    );
    hemiLight.intensity = 0.6 + Math.sin(state.time * 0.35) * 0.05;

    if (!disableParticles) {
      const positions = particles.geometry.attributes.position.array;
      for (let i = 0; i < particleSpeeds.length; i++) {
        positions[i * 3 + 1] += particleSpeeds[i];
        positions[i * 3] += Math.sin(state.time * 0.3 + i) * 0.001;
        const dx = -positions[i * 3];
        const dz = -positions[i * 3 + 2];
        const dist = Math.sqrt(dx * dx + dz * dz) + 0.1;
        positions[i * 3] += dx / dist * 0.0004;
        positions[i * 3 + 2] += dz / dist * 0.0004;
        if (positions[i * 3 + 1] > 8) {
          positions[i * 3 + 1] = -1;
          positions[i * 3] = (Math.random() - 0.5) * 16;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 16;
        }
      }
      particles.geometry.attributes.position.needsUpdate = true;
      particleMat.opacity = 0.3 + 0.2 * Math.sin(state.time * 0.4);
      particleMat.color.setRGB(
        1.0 + p * (0.88 - 1.0),
        0.97 + p * (0.82 - 0.97),
        0.88 + p * (1.0 - 0.88)
      );
    }

    updateOverlay(p, state.transitioning, state);
    updateCursor(state);

    renderer.render(scene, camera);
  }

  animate();

  return {
    stop() {
      cancelAnimationFrame(animationId);
    }
  };
}
