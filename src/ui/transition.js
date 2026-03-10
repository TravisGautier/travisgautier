import { TRANSITION_DWELL_TIME, TRANSITION_NAV_DELAY, VENTURES } from '../config/constants.js';

const transitionA = typeof document !== 'undefined' ? document.getElementById('transitionA') : null;
const transitionB = typeof document !== 'undefined' ? document.getElementById('transitionB') : null;
let navTimeoutId = null;

export function updateTransition(state, dt) {
  if (state.transitioning) return;

  const atPurple = state.snappedTo === 'purple';
  const atGold = state.snappedTo === 'gold' && state.hasEngaged;

  if (atPurple || atGold) {
    state.dwellTimer += dt;
  } else {
    state.dwellTimer = 0;
    return;
  }

  // Navigation disabled — camera stays where user leaves it
}

export function dismissTransition(state) {
  if (!state.transitioning) return;
  if (navTimeoutId != null) {
    clearTimeout(navTimeoutId);
    navTimeoutId = null;
  }
  state.transitioning = false;
  state.dwellTimer = 0;
  transitionA?.classList.remove('active');
  transitionB?.classList.remove('active');
}
