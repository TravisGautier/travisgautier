import { state } from '../interaction/state.js';
import { updateDragPhysics, deriveHoldProgress } from '../interaction/dragOrbit.js';
import { initOverlay } from './overlay.js';
import { updateTransition, dismissTransition } from './transition.js';
import { initCursor } from '../interaction/cursor.js';
import { DRAG_SENSITIVITY, TOUCH_DRAG_SENSITIVITY, TILT_MIN, TILT_MAX, TILT_SENSITIVITY } from '../config/constants.js';

const DT_CLAMP_MAX = 0.1;

const GOLD_R = 184, GOLD_G = 148, GOLD_B = 46;
const PURPLE_R = 124, PURPLE_G = 82, PURPLE_B = 212;

function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function initFallback() {
  document.body.classList.add('fallback-mode');

  const container = document.getElementById('canvas-container');

  const tintEl = document.createElement('div');
  tintEl.className = 'fallback-tint';
  tintEl.setAttribute('aria-hidden', 'true');
  container.appendChild(tintEl);

  let lastMoveTime = 0;

  function onMouseMove(e) {
    state.mouse.x = e.clientX;
    state.mouse.y = e.clientY;
    if (state.dragging) {
      const deltaX = e.clientX - state.lastDragX;
      state.targetAngle -= deltaX * DRAG_SENSITIVITY;
      const now = performance.now();
      const moveDt = (now - lastMoveTime) / 1000;
      if (moveDt > 0 && moveDt < 0.1) {
        state.dragVelocity = (-deltaX * DRAG_SENSITIVITY) / moveDt;
      }
      lastMoveTime = now;
      state.lastDragX = e.clientX;
      state.lastDragY = e.clientY;
    } else {
      state.mouse.nx = (e.clientX / window.innerWidth) * 2 - 1;
      state.mouse.ny = -(e.clientY / window.innerHeight) * 2 + 1;
    }
  }

  function onMouseDown(e) {
    state.dragging = true;
    state.lastDragX = e.clientX;
    state.lastDragY = e.clientY;
    state.dragVelocity = 0;
    state.snappedTo = null;
    lastMoveTime = performance.now();
  }

  function onMouseUp() {
    state.dragging = false;
  }

  function onKeyDown(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      state.transitioning = false;
      state.dwellTimer = 0;
    }
  }

  function onTouchStart(e) {
    e.preventDefault();
    state.isTouchDevice = true;
    if (e.touches && e.touches[0]) {
      state.dragging = true;
      state.lastDragX = e.touches[0].clientX;
      state.lastDragY = e.touches[0].clientY;
      state.dragVelocity = 0;
      state.snappedTo = null;
      lastMoveTime = performance.now();
      state.mouse.x = e.touches[0].clientX;
      state.mouse.y = e.touches[0].clientY;
    }
  }

  function onTouchMove(e) {
    if (e.touches && e.touches.length === 1) {
      const t = e.touches[0];
      const deltaX = t.clientX - state.lastDragX;
      state.targetAngle -= deltaX * TOUCH_DRAG_SENSITIVITY;
      const now = performance.now();
      const moveDt = (now - lastMoveTime) / 1000;
      if (moveDt > 0 && moveDt < 0.1) {
        state.dragVelocity = (-deltaX * TOUCH_DRAG_SENSITIVITY) / moveDt;
      }
      lastMoveTime = now;
      state.lastDragX = t.clientX;
      state.lastDragY = t.clientY;
    }
  }

  function onTouchEnd() {
    state.dragging = false;
  }

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mousedown', onMouseDown);
  document.addEventListener('mouseup', onMouseUp);
  document.addEventListener('keydown', onKeyDown);
  container.addEventListener('touchstart', onTouchStart, { passive: false });
  container.addEventListener('touchmove', onTouchMove, { passive: false });
  container.addEventListener('touchend', onTouchEnd);

  let rafId = null;
  let lastTime = 0;

  function tick(now) {
    rafId = window.requestAnimationFrame(tick);
    if (lastTime === 0) { lastTime = now; return; }
    const dt = Math.min((now - lastTime) / 1000, DT_CLAMP_MAX);
    lastTime = now;

    updateDragPhysics(state, dt);
    updateTransition(state, dt);

    const p = state.holdProgress;
    const r = Math.round(lerp(GOLD_R, PURPLE_R, p));
    const g = Math.round(lerp(GOLD_G, PURPLE_G, p));
    const b = Math.round(lerp(GOLD_B, PURPLE_B, p));
    tintEl.style.background = `rgba(${r},${g},${b},0.18)`;
  }

  rafId = window.requestAnimationFrame(tick);

  function stop() {
    if (rafId != null) {
      window.cancelAnimationFrame(rafId);
      rafId = null;
    }
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mousedown', onMouseDown);
    document.removeEventListener('mouseup', onMouseUp);
    document.removeEventListener('keydown', onKeyDown);
    container.removeEventListener('touchstart', onTouchStart);
    container.removeEventListener('touchmove', onTouchMove);
    container.removeEventListener('touchend', onTouchEnd);
  }

  return { stop };
}
