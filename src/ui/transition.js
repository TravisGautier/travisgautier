import { TRANSITION_DWELL_TIME, TRANSITION_NAV_DELAY, VENTURES } from '../config/constants.js';

const transitionA = typeof document !== 'undefined' ? document.getElementById('transitionA') : null;
const transitionB = typeof document !== 'undefined' ? document.getElementById('transitionB') : null;

export function updateTransition(state, dt) {
  if (state.transitioning) return;

  const atPurple = state.holdProgress > 0.99 && !state.holding;
  const atGold = state.holdProgress < 0.01 && !state.holding && state.hasEngaged;

  if (atPurple || atGold) {
    state.dwellTimer += dt;
  } else {
    state.dwellTimer = 0;
    return;
  }

  if (state.dwellTimer >= TRANSITION_DWELL_TIME) {
    state.transitioning = true;

    if (atPurple) {
      if (transitionB) transitionB.classList.add('active');
      setTimeout(() => {
        window.location.href = VENTURES.purple.url;
      }, TRANSITION_NAV_DELAY);
    } else {
      if (transitionA) transitionA.classList.add('active');
      setTimeout(() => {
        window.location.href = VENTURES.gold.url;
      }, TRANSITION_NAV_DELAY);
    }
  }
}
