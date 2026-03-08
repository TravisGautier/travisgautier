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

export function initControls(state, camera, renderer, portalSurfaces = [], dismissTransition) {
  let scrollTarget = 0;
  let isTrackpad = false;
  let mouseHolding = false;
  let keyboardHolding = false;
  const cursorEl = typeof document !== 'undefined' ? document.getElementById('cursor') : null;
  const cursorTrail = typeof document !== 'undefined' ? document.getElementById('cursorTrail') : null;
  const raycaster = new THREE.Raycaster();
  let lastRaycast = 0;

  function updateHoldingState() {
    state.holding = mouseHolding || keyboardHolding;
    if (state.holding) {
      cursorEl?.classList.add('holding');
      cursorTrail?.classList.add('holding');
    } else {
      cursorEl?.classList.remove('holding');
      cursorTrail?.classList.remove('holding');
    }
  }

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
        mouseHolding = true;
        updateHoldingState();
      }
    });
    window.addEventListener('mouseup', () => {
      mouseHolding = false;
      updateHoldingState();
    });
    window.addEventListener('mouseleave', () => {
      mouseHolding = false;
      updateHoldingState();
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === ' ' && !e.repeat && !e.target.closest('a, button, input, textarea, select, [contenteditable]')) {
        e.preventDefault();
        keyboardHolding = true;
        updateHoldingState();
      }
      if (e.key === 'Escape') {
        dismissTransition?.(state);
      }
    });
    window.addEventListener('keyup', (e) => {
      if (e.key === ' ') {
        e.preventDefault();
        keyboardHolding = false;
        updateHoldingState();
      }
    });

    window.addEventListener('blur', () => {
      mouseHolding = false;
      keyboardHolding = false;
      updateHoldingState();
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
