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
    expect(state.holdProgress).toBe(0);
    expect(state.currentAngle).toBe(0.25);
    expect(state.targetAngle).toBe(0.25);
    expect(state.isTouchDevice).toBe(false);
    expect(state.dragging).toBe(false);
    expect(state.dragVelocity).toBe(0);
    expect(state.tiltVelocity).toBe(0);
    expect(state.lastDragX).toBe(0);
    expect(state.lastDragY).toBe(0);
    expect(state.targetTilt).toBe(0);
    expect(state.currentTilt).toBe(0);
    expect(state.snappedTo).toBe(null);
  });

  /// Tests checklist items: [2] — Feature 5.4
  it('unit_state_isTouchDevice_default', () => {
    expect(state.isTouchDevice).toBe(false);
  });

  /// Tests checklist items: [2] — Feature 5.4
  it('unit_state_isTouchDevice_mutable', () => {
    state.isTouchDevice = true;
    expect(state.isTouchDevice).toBe(true);

    // Reset to default for other tests
    state.isTouchDevice = false;
  });

  /// Tests checklist items: [2]
  it('unit_state_mutable', () => {
    state.holdProgress = 0.5;
    expect(state.holdProgress).toBe(0.5);

    state.mouse.nx = 0.7;
    expect(state.mouse.nx).toBe(0.7);

    state.dragging = true;
    expect(state.dragging).toBe(true);

    // Reset to defaults for other tests
    state.holdProgress = 0;
    state.mouse.nx = 0;
    state.dragging = false;
  });

  /// Tests checklist items: [4] — Feature 7.2
  it('unit_state_additional_defaults', () => {
    expect(state.hasEngaged).toBe(false);
    expect(state.transitioning).toBe(false);
    expect(state.dwellTimer).toBe(0);
  });
});
