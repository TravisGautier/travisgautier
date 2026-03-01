import { describe, it, expect } from 'vitest';
import { updateHoldProgress } from '../../src/interaction/holdMechanic.js';

describe('holdMechanic', () => {
  /// Tests checklist items: [8]
  it('unit_holdMechanic_increase', () => {
    // holdProgress increases at 1.2/sec when holding and not reversing
    const state = { holding: true, reversing: false, holdProgress: 0 };

    updateHoldProgress(state, 0.5);

    // 0 + 0.5 * 1.2 = 0.6
    expect(state.holdProgress).toBeCloseTo(0.6, 5);
    expect(state.holdProgress).toBeLessThanOrEqual(1);
    expect(state.holdProgress).toBeGreaterThanOrEqual(0);
  });

  /// Tests checklist items: [8]
  it('unit_holdMechanic_decrease', () => {
    // holdProgress decreases at 1.2/sec when holding and reversing
    const state = { holding: true, reversing: true, holdProgress: 1.0 };

    updateHoldProgress(state, 0.5);

    // 1.0 - 0.5 * 1.2 = 0.4
    expect(state.holdProgress).toBeCloseTo(0.4, 5);
    expect(state.holdProgress).toBeLessThanOrEqual(1);
    expect(state.holdProgress).toBeGreaterThanOrEqual(0);
  });

  /// Tests checklist items: [8]
  it('unit_holdMechanic_snap', () => {
    // On release past halfway, snaps toward 1 at 2.5/sec
    const stateAbove = { holding: false, reversing: false, holdProgress: 0.7 };
    updateHoldProgress(stateAbove, 0.1);
    // 0.7 + 0.1 * 2.5 = 0.95
    expect(stateAbove.holdProgress).toBeCloseTo(0.95, 5);

    // On release below halfway, snaps toward 0 at 2.5/sec
    const stateBelow = { holding: false, reversing: false, holdProgress: 0.3 };
    updateHoldProgress(stateBelow, 0.1);
    // 0.3 - 0.1 * 2.5 = 0.05
    expect(stateBelow.holdProgress).toBeCloseTo(0.05, 5);

    // Clamped to [0, 1]
    expect(stateAbove.holdProgress).toBeLessThanOrEqual(1);
    expect(stateBelow.holdProgress).toBeGreaterThanOrEqual(0);
  });

  /// Tests checklist items: [8]
  it('unit_holdMechanic_toggle', () => {
    // Sets reversing when holdProgress > 0.99 while holding
    const state = { holding: true, reversing: false, holdProgress: 1.0 };
    updateHoldProgress(state, 0.016);
    expect(state.reversing).toBe(true);

    // Resets reversing when holdProgress < 0.01
    const state2 = { holding: true, reversing: true, holdProgress: 0.0 };
    updateHoldProgress(state2, 0.016);
    expect(state2.reversing).toBe(false);
  });
});
