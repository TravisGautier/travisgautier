import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';

/// Tests checklist items: [2, 4] — Feature 4.2

describe('transition', () => {
  let transitionA, transitionB;

  beforeEach(() => {
    vi.resetModules();
    transitionA = {
      classList: { add: vi.fn(), remove: vi.fn(), contains: vi.fn(() => false) },
    };
    transitionB = {
      classList: { add: vi.fn(), remove: vi.fn(), contains: vi.fn(() => false) },
    };
    vi.stubGlobal('document', {
      getElementById: vi.fn((id) => {
        if (id === 'transitionA') return transitionA;
        if (id === 'transitionB') return transitionB;
        return null;
      }),
    });
    vi.stubGlobal('setTimeout', vi.fn((cb) => cb));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  // ============================================================
  // Unit tests
  // ============================================================

  /// Tests checklist items: [4] — Feature 4.2
  it('unit_transition_dwell_accumulates', async () => {
    const { updateTransition } = await import('../../src/ui/transition.js');

    const state = {
      holdProgress: 1.0,
      holding: false,
      hasEngaged: true,
      transitioning: false,
      dwellTimer: 0,
    };

    // First call: 0.3s of dwell time — not enough to trigger (threshold is 0.5s)
    updateTransition(state, 0.3);
    expect(state.transitioning).toBe(false);

    // Second call: another 0.3s (0.6s total) — should now trigger
    updateTransition(state, 0.3);
    expect(state.transitioning).toBe(true);
  });

  /// Tests checklist items: [4] — Feature 4.2
  it('unit_transition_dwell_resets', async () => {
    const { updateTransition } = await import('../../src/ui/transition.js');

    const state = {
      holdProgress: 1.0,
      holding: false,
      hasEngaged: true,
      transitioning: false,
      dwellTimer: 0,
    };

    // Accumulate some dwell time
    updateTransition(state, 0.2);
    expect(state.transitioning).toBe(false);

    // Move holdProgress away from endpoint
    state.holdProgress = 0.8;
    updateTransition(state, 0.1);
    expect(state.transitioning).toBe(false);

    // Return to endpoint — should need full dwell time again
    state.holdProgress = 1.0;
    updateTransition(state, 0.3);
    expect(state.transitioning).toBe(false); // only 0.3s, not 0.5s
  });

  /// Tests checklist items: [4] — Feature 4.2
  it('unit_transition_triggers_purple', async () => {
    const { updateTransition } = await import('../../src/ui/transition.js');

    const state = {
      holdProgress: 1.0,
      holding: false,
      hasEngaged: true,
      transitioning: false,
      dwellTimer: 0,
    };

    // Accumulate enough dwell time
    updateTransition(state, 0.3);
    updateTransition(state, 0.3);

    expect(state.transitioning).toBe(true);
    expect(transitionB.classList.add).toHaveBeenCalledWith('active');
    expect(transitionA.classList.add).not.toHaveBeenCalledWith('active');
  });

  /// Tests checklist items: [4] — Feature 4.2
  it('unit_transition_triggers_gold', async () => {
    const { updateTransition } = await import('../../src/ui/transition.js');

    const state = {
      holdProgress: 0.0,
      holding: false,
      hasEngaged: true,
      transitioning: false,
      dwellTimer: 0,
    };

    // Accumulate enough dwell time
    updateTransition(state, 0.3);
    updateTransition(state, 0.3);

    expect(state.transitioning).toBe(true);
    expect(transitionA.classList.add).toHaveBeenCalledWith('active');
    expect(transitionB.classList.add).not.toHaveBeenCalledWith('active');
  });

  /// Tests checklist items: [2, 4] — Feature 4.2
  it('unit_transition_no_gold_without_engaged', async () => {
    const { updateTransition } = await import('../../src/ui/transition.js');

    const state = {
      holdProgress: 0.0,
      holding: false,
      hasEngaged: false,
      transitioning: false,
      dwellTimer: 0,
    };

    // Even with plenty of dwell time, should not trigger
    updateTransition(state, 1.0);
    updateTransition(state, 1.0);

    expect(state.transitioning).toBe(false);
    expect(transitionA.classList.add).not.toHaveBeenCalledWith('active');
    expect(transitionB.classList.add).not.toHaveBeenCalledWith('active');
  });

  /// Tests checklist items: [4] — Feature 4.2
  it('unit_transition_no_retrigger', async () => {
    const { updateTransition } = await import('../../src/ui/transition.js');

    const state = {
      holdProgress: 1.0,
      holding: false,
      hasEngaged: true,
      transitioning: true, // already transitioning
      dwellTimer: 0,
    };

    updateTransition(state, 1.0);

    // Should not add .active again when already transitioning
    expect(transitionB.classList.add).not.toHaveBeenCalledWith('active');
    expect(transitionA.classList.add).not.toHaveBeenCalledWith('active');
  });

  // ============================================================
  // Integration tests
  // ============================================================

  /// Tests checklist items: [4] — Feature 4.2
  it('int_transition_dom_active', async () => {
    const { updateTransition } = await import('../../src/ui/transition.js');

    // Test purple side
    const statePurple = {
      holdProgress: 1.0,
      holding: false,
      hasEngaged: true,
      transitioning: false,
      dwellTimer: 0,
    };

    updateTransition(statePurple, 0.6);
    expect(transitionB.classList.add).toHaveBeenCalledWith('active');
    expect(transitionB.classList.add).toHaveBeenCalledTimes(1);
    expect(transitionA.classList.add).not.toHaveBeenCalledWith('active');
  });

  /// Tests checklist items: [4] — Feature 4.2
  it('int_transition_navigation', async () => {
    const mockLocation = { href: '' };
    vi.stubGlobal('window', { location: mockLocation });

    const mockSetTimeout = vi.fn((cb) => { cb(); return 1; });
    vi.stubGlobal('setTimeout', mockSetTimeout);

    const { updateTransition } = await import('../../src/ui/transition.js');
    const { VENTURES, TRANSITION_NAV_DELAY } = await import('../../src/config/constants.js');

    const state = {
      holdProgress: 1.0,
      holding: false,
      hasEngaged: true,
      transitioning: false,
      dwellTimer: 0,
    };

    // Trigger purple transition
    updateTransition(state, 0.6);

    expect(mockSetTimeout).toHaveBeenCalled();
    const delay = mockSetTimeout.mock.calls[0][1];
    expect(delay).toBe(TRANSITION_NAV_DELAY);
    expect(mockLocation.href).toBe(VENTURES.purple.url);
  });

  // ============================================================
  // Accessibility tests
  // ============================================================

  /// Tests checklist items: [4] — Feature 4.2
  it('a11y_transition_focus_management', () => {
    const projectRoot = path.resolve(import.meta.dirname, '..', '..');
    const css = fs.readFileSync(path.join(projectRoot, 'styles', 'main.css'), 'utf-8');

    // Verify .transition-screen.active has opacity: 1 and pointer-events: auto
    expect(css).toMatch(/\.transition-screen\.active\s*\{[^}]*opacity:\s*1/);
    expect(css).toMatch(/\.transition-screen\.active\s*\{[^}]*pointer-events:\s*auto/);
  });

  // ============================================================
  // dismissTransition tests — Feature 4.4
  // ============================================================

  /// Tests checklist items: [4] — Feature 4.4
  it('unit_dismissTransition_resets_state', async () => {
    const { dismissTransition } = await import('../../src/ui/transition.js');

    const state = {
      holdProgress: 1.0,
      holding: false,
      hasEngaged: true,
      transitioning: true,
      dwellTimer: 0.6,
    };

    dismissTransition(state);
    expect(state.transitioning).toBe(false);
    expect(state.dwellTimer).toBe(0);
  });

  /// Tests checklist items: [4] — Feature 4.4
  it('unit_dismissTransition_removes_active_class', async () => {
    const { dismissTransition } = await import('../../src/ui/transition.js');

    const state = {
      holdProgress: 1.0,
      holding: false,
      hasEngaged: true,
      transitioning: true,
      dwellTimer: 0.6,
    };

    dismissTransition(state);
    expect(transitionA.classList.remove).toHaveBeenCalledWith('active');
    expect(transitionB.classList.remove).toHaveBeenCalledWith('active');
  });

  /// Tests checklist items: [4] — Feature 4.4
  it('unit_dismissTransition_noop_when_not_transitioning', async () => {
    const { dismissTransition } = await import('../../src/ui/transition.js');

    const state = {
      holdProgress: 0.5,
      holding: false,
      hasEngaged: false,
      transitioning: false,
      dwellTimer: 0,
    };

    dismissTransition(state);
    expect(transitionA.classList.remove).not.toHaveBeenCalled();
    expect(transitionB.classList.remove).not.toHaveBeenCalled();
  });

  /// Tests checklist items: [4] — Feature 4.4
  it('unit_dismissTransition_cancels_timeout', async () => {
    const mockClearTimeout = vi.fn();
    vi.stubGlobal('clearTimeout', mockClearTimeout);
    const mockSetTimeout = vi.fn(() => 42);
    vi.stubGlobal('setTimeout', mockSetTimeout);

    const { updateTransition, dismissTransition } = await import('../../src/ui/transition.js');

    const state = {
      holdProgress: 1.0,
      holding: false,
      hasEngaged: true,
      transitioning: false,
      dwellTimer: 0,
    };

    // Trigger transition to set the timeout
    updateTransition(state, 0.6);
    expect(state.transitioning).toBe(true);
    expect(mockSetTimeout).toHaveBeenCalled();

    // Dismiss should clear the timeout
    dismissTransition(state);
    expect(mockClearTimeout).toHaveBeenCalledWith(42);
    expect(state.transitioning).toBe(false);
  });

  /// Tests checklist items: [4] — Feature 4.4
  it('unit_dismissTransition_is_exported', async () => {
    const mod = await import('../../src/ui/transition.js');
    expect(typeof mod.dismissTransition).toBe('function');
  });
});
