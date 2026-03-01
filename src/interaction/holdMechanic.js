export function updateHoldProgress(state, dt) {
  if (state.holding) {
    if (state.reversing) {
      state.holdProgress = Math.max(0, state.holdProgress - dt * 1.2);
    } else {
      state.holdProgress = Math.min(1, state.holdProgress + dt * 1.2);
    }
  } else {
    if (state.holdProgress > 0.5) {
      state.holdProgress = Math.min(1, state.holdProgress + dt * 2.5);
    } else {
      state.holdProgress = Math.max(0, state.holdProgress - dt * 2.5);
    }
  }

  const p = state.holdProgress;

  if (state.holding && p > 0.99 && !state.reversing) {
    state.reversing = true;
  }
  if (p < 0.01) {
    state.reversing = false;
  }
}
