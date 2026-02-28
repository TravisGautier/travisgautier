import { describe, it, expect } from 'vitest';
import { state } from '../../src/interaction/state.js';

describe('state', () => {
  /// Tests checklist items: [2]
  it('unit_state_defaults', () => {
    expect(state.mouse.x).toBe(0);
    expect(state.mouse.y).toBe(0);
    expect(state.mouse.nx).toBe(0);
    expect(state.mouse.ny).toBe(0);
    expect(state.scroll).toBe(0);
    expect(state.hoverPortal).toBe(false);
    expect(state.time).toBe(0);
    expect(state.holding).toBe(false);
    expect(state.holdProgress).toBe(0);
    expect(state.reversing).toBe(false);
    expect(state.currentAngle).toBe(0.25);
    expect(state.targetAngle).toBe(0.25);
  });

  /// Tests checklist items: [2]
  it('unit_state_mutable', () => {
    state.holdProgress = 0.5;
    expect(state.holdProgress).toBe(0.5);

    state.mouse.nx = 0.7;
    expect(state.mouse.nx).toBe(0.7);

    state.holding = true;
    expect(state.holding).toBe(true);

    // Reset to defaults for other tests
    state.holdProgress = 0;
    state.mouse.nx = 0;
    state.holding = false;
  });
});
