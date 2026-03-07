import * as THREE from 'three';
import { SCROLL_MULT_TRACKPAD, SCROLL_MULT_WHEEL, RAYCAST_THROTTLE_MS } from '../config/constants.js';

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

export function initControls(state, camera, renderer, portalSurfaces = []) {
  let scrollTarget = 0;
  let isTrackpad = false;
  const cursorEl = typeof document !== 'undefined' ? document.getElementById('cursor') : null;
  const cursorTrail = typeof document !== 'undefined' ? document.getElementById('cursorTrail') : null;
  const raycaster = new THREE.Raycaster();
  let lastRaycast = 0;

  if (typeof document !== 'undefined') {
    document.addEventListener('mousemove', (e) => {
      state.mouse.x = e.clientX;
      state.mouse.y = e.clientY;
      state.mouse.nx = (e.clientX / window.innerWidth) * 2 - 1;
      state.mouse.ny = -(e.clientY / window.innerHeight) * 2 + 1;

      const now = performance.now();
      if (portalSurfaces.length > 0 && now - lastRaycast >= RAYCAST_THROTTLE_MS) {
        lastRaycast = now;
        const ndc = { x: state.mouse.nx, y: state.mouse.ny };
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
        state.holding = true;
        cursorEl?.classList.add('holding');
        cursorTrail?.classList.add('holding');
      }
    });
    window.addEventListener('mouseup', () => {
      state.holding = false;
      cursorEl?.classList.remove('holding');
      cursorTrail?.classList.remove('holding');
    });
    window.addEventListener('mouseleave', () => {
      state.holding = false;
      cursorEl?.classList.remove('holding');
      cursorTrail?.classList.remove('holding');
    });

    window.addEventListener('wheel', (e) => {
      if (detectTrackpad(e.deltaY)) {
        isTrackpad = true;
      }
      scrollTarget = computeScrollDelta(scrollTarget, e.deltaY, isTrackpad);
    }, { passive: true });

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  if (typeof renderer.domElement.addEventListener === 'function') {
    renderer.domElement.addEventListener('contextmenu', (e) => e.preventDefault());
    renderer.domElement.addEventListener('mousedown', (e) => e.preventDefault());
  }

  return { getScrollTarget: () => scrollTarget };
}
