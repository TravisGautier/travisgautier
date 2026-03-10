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

    updateTransition(state, 0.3);
    expect(state.dwellTimer).toBeCloseTo(0.3, 5);

    updateTransition(state, 0.3);
    expect(state.dwellTimer).toBeCloseTo(0.6, 5);
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
    expect(state.dwellTimer).toBeCloseTo(0.2, 5);

    // Move holdProgress away from endpoint — dwell resets
    state.holdProgress = 0.8;
    updateTransition(state, 0.1);
    expect(state.dwellTimer).toBe(0);
  });

  /// Tests checklist items: [4] — Feature 4.2
  it('unit_transition_no_navigation', async () => {
    const mockLocation = { href: '' };
    vi.stubGlobal('window', { location: mockLocation });
    vi.stubGlobal('setTimeout', vi.fn());

    const { updateTransition } = await import('../../src/ui/transition.js');

    const state = {
      holdProgress: 1.0,
      holding: false,
      hasEngaged: true,
      transitioning: false,
      dwellTimer: 0,
    };

    // Even with extended dwell, navigation should never trigger
    updateTransition(state, 5.0);
    expect(state.transitioning).toBe(false);
    expect(mockLocation.href).toBe('');
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

    updateTransition(state, 1.0);
    expect(state.dwellTimer).toBe(0);
    expect(state.transitioning).toBe(false);
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

    // Should bail out early when already transitioning
    expect(transitionB.classList.add).not.toHaveBeenCalledWith('active');
    expect(transitionA.classList.add).not.toHaveBeenCalledWith('active');
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
  it('unit_dismissTransition_is_exported', async () => {
    const mod = await import('../../src/ui/transition.js');
    expect(typeof mod.dismissTransition).toBe('function');
  });
});
