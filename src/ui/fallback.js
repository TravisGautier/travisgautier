import { state } from '../interaction/state.js';
import { updateHoldProgress } from '../interaction/holdMechanic.js';
import { initOverlay } from './overlay.js';
import { updateTransition, dismissTransition } from './transition.js';
import { initCursor } from '../interaction/cursor.js';

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

  function onMouseMove(e) {
    state.mouse.x = e.clientX;
    state.mouse.y = e.clientY;
    state.mouse.nx = (e.clientX / window.innerWidth) * 2 - 1;
    state.mouse.ny = -(e.clientY / window.innerHeight) * 2 + 1;
  }

  function onMouseDown() {
    state.holding = true;
  }

  function onMouseUp() {
    state.holding = false;
  }

  function onKeyDown(e) {
    if (e.key === ' ') {
      e.preventDefault();
      state.holding = true;
    } else if (e.key === 'Escape') {
      e.preventDefault();
      state.transitioning = false;
      state.dwellTimer = 0;
    }
  }

  function onKeyUp(e) {
    if (e.key === ' ') {
      state.holding = false;
    }
  }

  function onTouchStart(e) {
    e.preventDefault();
    state.isTouchDevice = true;
    state.holding = true;
    if (e.touches && e.touches[0]) {
      state.mouse.x = e.touches[0].clientX;
      state.mouse.y = e.touches[0].clientY;
      state.mouse.nx = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
      state.mouse.ny = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
    }
  }

  function onTouchEnd() {
    state.holding = false;
  }

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mousedown', onMouseDown);
  document.addEventListener('mouseup', onMouseUp);
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);
  container.addEventListener('touchstart', onTouchStart, { passive: false });
  container.addEventListener('touchend', onTouchEnd);

  let rafId = null;
  let lastTime = 0;

  function tick(now) {
    rafId = window.requestAnimationFrame(tick);
    if (lastTime === 0) { lastTime = now; return; }
    const dt = Math.min((now - lastTime) / 1000, DT_CLAMP_MAX);
    lastTime = now;

    updateHoldProgress(state, dt);
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
    document.removeEventListener('keyup', onKeyUp);
    container.removeEventListener('touchstart', onTouchStart);
    container.removeEventListener('touchend', onTouchEnd);
  }

  return { stop };
}
