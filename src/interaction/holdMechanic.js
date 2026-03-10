export function updateHoldProgress(state, dt) {
  if (state.transitioning) return;

  if (state.holding) {
    if (state.reversing) {
      state.holdProgress = Math.max(0, state.holdProgress - dt * 1.2);
    } else {
      state.holdProgress = Math.min(1, state.holdProgress + dt * 1.2);
    }
  }

  const p = state.holdProgress;

  if (state.holding && p > 0.99 && !state.reversing) {
    state.reversing = true;
  }
  if (p < 0.01) {
    state.reversing = false;
  }

  if (state.holdProgress > 0.5) {
    state.hasEngaged = true;
  }
}
