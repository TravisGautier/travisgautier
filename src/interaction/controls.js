import * as THREE from 'three';
import { SCROLL_MULT_TRACKPAD, SCROLL_MULT_WHEEL, RAYCAST_THROTTLE_MS, PINCH_ZOOM_MULT, GYRO_GAMMA_DIVISOR, GYRO_BETA_OFFSET, GYRO_BETA_DIVISOR, DRAG_SENSITIVITY, TOUCH_DRAG_SENSITIVITY, TILT_SENSITIVITY, TILT_MIN, TILT_MAX } from '../config/constants.js';

export function detectTrackpad(deltaY) {
  return deltaY % 1 !== 0;
}

export function computeScrollDelta(scrollTarget, deltaY, isTrackpad) {
  const mult = isTrackpad ? SCROLL_MULT_TRACKPAD : SCROLL_MULT_WHEEL;
  return Math.max(-1.0, Math.min(1.0, scrollTarget + deltaY * mult));
}

export function checkPortalHover(raycaster, camera, ndc, surfaces) {
  raycaster.setFromCamera(ndc, camera);
  const hits = raycaster.intersectObjects(surfaces);
  return hits.length > 0;
}

export function computePinchDist(t0, t1) {
  const dx = t1.clientX - t0.clientX;
  const dy = t1.clientY - t0.clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

export function computeGyroParallax(gamma, beta) {
  const nx = Math.max(-1, Math.min(1, (gamma || 0) / GYRO_GAMMA_DIVISOR));
  const ny = Math.max(-1, Math.min(1, ((beta || 0) - GYRO_BETA_OFFSET) / GYRO_BETA_DIVISOR));
  return { nx, ny };
}

export function initControls(state, camera, renderer, portalSurfaces = [], dismissTransition, qualityConfig = {}) {
  let scrollTarget = 0;
  let isTrackpad = false;
  let lastPinchDist = 0;
  let gyroNeedsPermission = false;
  let permissionRequested = false;
  let gyroHandler = null;
  let lastMoveTime = 0;
  const cursorEl = typeof document !== 'undefined' ? document.getElementById('cursor') : null;
  const cursorTrail = typeof document !== 'undefined' ? document.getElementById('cursorTrail') : null;
  const raycaster = new THREE.Raycaster();
  let lastRaycast = 0;

  function startDrag(x, y) {
    state.dragging = true;
    state.lastDragX = x;
    state.lastDragY = y;
    state.dragVelocity = 0;
    state.tiltVelocity = 0;
    state.snappedTo = null;
    lastMoveTime = performance.now();
    cursorEl?.classList.add('grabbing');
    cursorTrail?.classList.add('grabbing');
  }

  function endDrag() {
    state.dragging = false;
    cursorEl?.classList.remove('grabbing');
    cursorTrail?.classList.remove('grabbing');
  }

  function handleDragMove(x, y, sensitivity) {
    const deltaX = x - state.lastDragX;
    const deltaY = y - state.lastDragY;

    state.targetAngle -= deltaX * sensitivity;
    state.targetTilt = Math.max(TILT_MIN, Math.min(TILT_MAX, state.targetTilt + deltaY * TILT_SENSITIVITY));

    const now = performance.now();
    const moveDt = (now - lastMoveTime) / 1000;
    if (moveDt > 0 && moveDt < 0.1) {
      state.dragVelocity = (-deltaX * sensitivity) / moveDt;
      state.tiltVelocity = (deltaY * TILT_SENSITIVITY) / moveDt;
    }
    lastMoveTime = now;

    state.lastDragX = x;
    state.lastDragY = y;
  }

  if (typeof document !== 'undefined') {
    document.addEventListener('mousemove', (e) => {
      state.mouse.x = e.clientX;
      state.mouse.y = e.clientY;

      if (state.dragging) {
        handleDragMove(e.clientX, e.clientY, DRAG_SENSITIVITY);
      } else {
        state.mouse.nx = (e.clientX / window.innerWidth) * 2 - 1;
        state.mouse.ny = -(e.clientY / window.innerHeight) * 2 + 1;
      }

      const now = performance.now();
      if (portalSurfaces.length > 0 && now - lastRaycast >= RAYCAST_THROTTLE_MS) {
        lastRaycast = now;
        const ndc = { x: (e.clientX / window.innerWidth) * 2 - 1, y: -(e.clientY / window.innerHeight) * 2 + 1 };
        const hovering = checkPortalHover(raycaster, camera, ndc, portalSurfaces);
        state.hoverPortal = hovering;
        if (hovering) {
          cursorEl?.classList.add('hover');
        } else {
          cursorEl?.classList.remove('hover');
        }
      }
    });
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('mousedown', (e) => {
      if (e.button === 0) {
        startDrag(e.clientX, e.clientY);
      }
    });
    window.addEventListener('mouseup', () => {
      endDrag();
    });
    window.addEventListener('mouseleave', () => {
      endDrag();
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        dismissTransition?.(state);
      }
    });

    window.addEventListener('blur', () => {
      endDrag();
    });

    window.addEventListener('wheel', (e) => {
      if (detectTrackpad(e.deltaY)) {
        isTrackpad = true;
      }
      scrollTarget = computeScrollDelta(scrollTarget, e.deltaY, isTrackpad);
    }, { passive: true });

    function handleResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      if (renderer.setSize) renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', handleResize);

    window.addEventListener('orientationchange', () => {
      setTimeout(handleResize, 100);
    });

    if (qualityConfig.useGyroscope) {
      gyroHandler = (e) => {
        const result = computeGyroParallax(e.gamma, e.beta);
        if (!state.dragging) {
          state.mouse.nx = result.nx;
          state.mouse.ny = result.ny;
        }
      };

      if (typeof DeviceOrientationEvent !== 'undefined' &&
          typeof DeviceOrientationEvent.requestPermission === 'function') {
        gyroNeedsPermission = true;
      } else {
        window.addEventListener('deviceorientation', gyroHandler);
      }
    }
  }

  if (typeof renderer.domElement.addEventListener === 'function') {
    renderer.domElement.addEventListener('contextmenu', (e) => e.preventDefault());
    renderer.domElement.addEventListener('mousedown', (e) => e.preventDefault());

    renderer.domElement.addEventListener('touchstart', (e) => {
      e.preventDefault();
      state.isTouchDevice = true;
      if (e.touches.length === 1) {
        const t = e.touches[0];
        startDrag(t.clientX, t.clientY);
      }

      if (gyroNeedsPermission && !permissionRequested) {
        permissionRequested = true;
        DeviceOrientationEvent.requestPermission()
          .then((response) => {
            if (response === 'granted') {
              window.addEventListener('deviceorientation', gyroHandler);
            }
          })
          .catch(() => {});
      }
    }, { passive: false });

    renderer.domElement.addEventListener('touchmove', (e) => {
      if (e.preventDefault) e.preventDefault();
      if (e.touches.length === 2) {
        const dist = computePinchDist(e.touches[0], e.touches[1]);
        if (lastPinchDist > 0) {
          const delta = lastPinchDist - dist;
          scrollTarget = Math.max(-1.0, Math.min(1.0, scrollTarget + delta * PINCH_ZOOM_MULT));
        }
        lastPinchDist = dist;
      } else if (e.touches.length === 1) {
        const t = e.touches[0];
        handleDragMove(t.clientX, t.clientY, TOUCH_DRAG_SENSITIVITY);
      }
    }, { passive: false });

    renderer.domElement.addEventListener('touchend', () => {
      endDrag();
      lastPinchDist = 0;
    }, { passive: true });

    renderer.domElement.addEventListener('touchcancel', () => {
      endDrag();
      lastPinchDist = 0;
    }, { passive: true });
  }

  return { getScrollTarget: () => scrollTarget };
}
