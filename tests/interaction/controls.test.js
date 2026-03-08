import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { detectTrackpad, computeScrollDelta, checkPortalHover } from '../../src/interaction/controls.js';

describe('detectTrackpad', () => {
  /// Tests checklist items: [2, 6] — Feature 2.7
  it('unit_detectTrackpad_small_noninteger', () => {
    expect(detectTrackpad(2.5)).toBe(true);
  });

  /// Tests checklist items: [2, 6] — Feature 2.7
  it('unit_detectTrackpad_large_integer', () => {
    expect(detectTrackpad(100)).toBe(false);
  });

  /// Tests checklist items: [2, 6] — Feature 2.7
  it('unit_detectTrackpad_zero', () => {
    expect(detectTrackpad(0)).toBe(false);
  });

  /// Tests checklist items: [2, 6] — Feature 2.7
  it('unit_detectTrackpad_negative_small', () => {
    expect(detectTrackpad(-3.7)).toBe(true);
  });

  /// Tests checklist items: [2, 6] — Feature 2.7
  it('unit_detectTrackpad_small_integer', () => {
    expect(detectTrackpad(3)).toBe(false);
  });
});

describe('computeScrollDelta', () => {
  /// Tests checklist items: [3, 6] — Feature 2.7
  it('unit_computeScrollDelta_wheel', () => {
    expect(computeScrollDelta(0, 100, false)).toBeCloseTo(0.08, 5);
  });

  /// Tests checklist items: [3, 6] — Feature 2.7
  it('unit_computeScrollDelta_trackpad', () => {
    expect(computeScrollDelta(0, 5, true)).toBeCloseTo(0.015, 5);
  });

  /// Tests checklist items: [3, 6] — Feature 2.7
  it('unit_computeScrollDelta_clamp_max', () => {
    expect(computeScrollDelta(0.95, 100, false)).toBe(1.0);
  });

  /// Tests checklist items: [3, 6] — Feature 2.7
  it('unit_computeScrollDelta_clamp_min', () => {
    expect(computeScrollDelta(-0.95, -100, false)).toBe(-1.0);
  });
});

describe('checkPortalHover', () => {
  /// Tests checklist items: [3] — Feature 4.1
  it('unit_checkPortalHover_is_function', () => {
    expect(typeof checkPortalHover).toBe('function');
  });

  /// Tests checklist items: [3] — Feature 4.1
  it('unit_checkPortalHover_returns_true_on_intersection', () => {
    const raycaster = {
      setFromCamera: vi.fn(),
      intersectObjects: vi.fn().mockReturnValue([{ object: {} }]),
    };
    const camera = {};
    const ndc = { x: 0.5, y: -0.3 };
    const surfaces = [{}, {}];

    const result = checkPortalHover(raycaster, camera, ndc, surfaces);
    expect(result).toBe(true);
  });

  /// Tests checklist items: [3] — Feature 4.1
  it('unit_checkPortalHover_returns_false_no_intersection', () => {
    const raycaster = {
      setFromCamera: vi.fn(),
      intersectObjects: vi.fn().mockReturnValue([]),
    };
    const camera = {};
    const ndc = { x: 0, y: 0 };
    const surfaces = [{}, {}];

    const result = checkPortalHover(raycaster, camera, ndc, surfaces);
    expect(result).toBe(false);
  });

  /// Tests checklist items: [3] — Feature 4.1
  it('unit_checkPortalHover_calls_setFromCamera', () => {
    const raycaster = {
      setFromCamera: vi.fn(),
      intersectObjects: vi.fn().mockReturnValue([]),
    };
    const camera = { id: 'cam' };
    const ndc = { x: 0.2, y: -0.4 };
    const surfaces = [{}];

    checkPortalHover(raycaster, camera, ndc, surfaces);
    expect(raycaster.setFromCamera).toHaveBeenCalledWith(ndc, camera);
  });

  /// Tests checklist items: [3] — Feature 4.1
  it('unit_checkPortalHover_calls_intersectObjects', () => {
    const raycaster = {
      setFromCamera: vi.fn(),
      intersectObjects: vi.fn().mockReturnValue([]),
    };
    const camera = {};
    const ndc = { x: 0, y: 0 };
    const surfaces = [{}, {}];

    checkPortalHover(raycaster, camera, ndc, surfaces);
    expect(raycaster.intersectObjects).toHaveBeenCalledWith(surfaces);
  });

  /// Tests checklist items: [3] — Feature 4.1
  it('unit_checkPortalHover_empty_surfaces', () => {
    const raycaster = {
      setFromCamera: vi.fn(),
      intersectObjects: vi.fn().mockReturnValue([]),
    };
    const camera = {};
    const ndc = { x: 0, y: 0 };

    const result = checkPortalHover(raycaster, camera, ndc, []);
    expect(result).toBe(false);
  });
});

describe('keyboard controls', () => {
  let state;
  let mockDismiss;
  let cursorEl;
  let cursorTrail;

  beforeEach(() => {
    vi.resetModules();
    state = {
      mouse: { x: 0, y: 0, nx: 0, ny: 0 },
      scroll: 0,
      hoverPortal: false,
      time: 0,
      holding: false,
      holdProgress: 0,
      reversing: false,
      currentAngle: 0.25,
      targetAngle: 0.25,
      hasEngaged: false,
      transitioning: false,
      dwellTimer: 0,
    };
    mockDismiss = vi.fn();
    cursorEl = { classList: { add: vi.fn(), remove: vi.fn() } };
    cursorTrail = { classList: { add: vi.fn(), remove: vi.fn() } };

    vi.stubGlobal('document', {
      getElementById: vi.fn((id) => {
        if (id === 'cursor') return cursorEl;
        if (id === 'cursorTrail') return cursorTrail;
        return null;
      }),
      addEventListener: vi.fn(),
    });
    vi.stubGlobal('performance', { now: vi.fn(() => 0) });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  /// Tests checklist items: [1] — Feature 4.4
  it('unit_keyboard_space_sets_holding_true', async () => {
    const listeners = {};
    vi.stubGlobal('window', {
      innerWidth: 1920,
      innerHeight: 1080,
      addEventListener: vi.fn((event, handler, opts) => {
        if (!listeners[event]) listeners[event] = [];
        listeners[event].push(handler);
      }),
    });

    const { initControls } = await import('../../src/interaction/controls.js');
    const mockRenderer = { domElement: { addEventListener: vi.fn() } };
    const mockCamera = { aspect: 1, updateProjectionMatrix: vi.fn() };
    initControls(state, mockCamera, mockRenderer, [], mockDismiss);

    const keydownHandler = listeners['keydown'][0];
    keydownHandler({ key: ' ', repeat: false, preventDefault: vi.fn(), target: { closest: () => null } });

    expect(state.holding).toBe(true);
  });

  /// Tests checklist items: [1] — Feature 4.4
  it('unit_keyboard_space_keyup_sets_holding_false', async () => {
    const listeners = {};
    vi.stubGlobal('window', {
      innerWidth: 1920,
      innerHeight: 1080,
      addEventListener: vi.fn((event, handler, opts) => {
        if (!listeners[event]) listeners[event] = [];
        listeners[event].push(handler);
      }),
    });

    const { initControls } = await import('../../src/interaction/controls.js');
    const mockRenderer = { domElement: { addEventListener: vi.fn() } };
    const mockCamera = { aspect: 1, updateProjectionMatrix: vi.fn() };
    initControls(state, mockCamera, mockRenderer, [], mockDismiss);

    const keydownHandler = listeners['keydown'][0];
    const keyupHandler = listeners['keyup'][0];
    keydownHandler({ key: ' ', repeat: false, preventDefault: vi.fn(), target: { closest: () => null } });
    expect(state.holding).toBe(true);

    keyupHandler({ key: ' ', preventDefault: vi.fn() });
    expect(state.holding).toBe(false);
  });

  /// Tests checklist items: [1] — Feature 4.4
  it('unit_keyboard_space_repeat_ignored', async () => {
    const listeners = {};
    vi.stubGlobal('window', {
      innerWidth: 1920,
      innerHeight: 1080,
      addEventListener: vi.fn((event, handler, opts) => {
        if (!listeners[event]) listeners[event] = [];
        listeners[event].push(handler);
      }),
    });

    const { initControls } = await import('../../src/interaction/controls.js');
    const mockRenderer = { domElement: { addEventListener: vi.fn() } };
    const mockCamera = { aspect: 1, updateProjectionMatrix: vi.fn() };
    initControls(state, mockCamera, mockRenderer, [], mockDismiss);

    const keydownHandler = listeners['keydown'][0];
    keydownHandler({ key: ' ', repeat: true, preventDefault: vi.fn(), target: { closest: () => null } });

    expect(state.holding).toBe(false);
  });

  /// Tests checklist items: [1] — Feature 4.4
  it('unit_keyboard_space_prevents_default', async () => {
    const listeners = {};
    vi.stubGlobal('window', {
      innerWidth: 1920,
      innerHeight: 1080,
      addEventListener: vi.fn((event, handler, opts) => {
        if (!listeners[event]) listeners[event] = [];
        listeners[event].push(handler);
      }),
    });

    const { initControls } = await import('../../src/interaction/controls.js');
    const mockRenderer = { domElement: { addEventListener: vi.fn() } };
    const mockCamera = { aspect: 1, updateProjectionMatrix: vi.fn() };
    initControls(state, mockCamera, mockRenderer, [], mockDismiss);

    const pd = vi.fn();
    const keydownHandler = listeners['keydown'][0];
    keydownHandler({ key: ' ', repeat: false, preventDefault: pd, target: { closest: () => null } });

    expect(pd).toHaveBeenCalled();
  });

  /// Tests checklist items: [2] — Feature 4.4
  it('unit_keyboard_escape_calls_dismiss', async () => {
    const listeners = {};
    vi.stubGlobal('window', {
      innerWidth: 1920,
      innerHeight: 1080,
      addEventListener: vi.fn((event, handler, opts) => {
        if (!listeners[event]) listeners[event] = [];
        listeners[event].push(handler);
      }),
    });

    const { initControls } = await import('../../src/interaction/controls.js');
    const mockRenderer = { domElement: { addEventListener: vi.fn() } };
    const mockCamera = { aspect: 1, updateProjectionMatrix: vi.fn() };
    initControls(state, mockCamera, mockRenderer, [], mockDismiss);

    const keydownHandler = listeners['keydown'][0];
    keydownHandler({ key: 'Escape', repeat: false, preventDefault: vi.fn(), target: { closest: () => null } });

    expect(mockDismiss).toHaveBeenCalledWith(state);
  });

  /// Tests checklist items: [1] — Feature 4.4
  it('unit_keyboard_other_keys_ignored', async () => {
    const listeners = {};
    vi.stubGlobal('window', {
      innerWidth: 1920,
      innerHeight: 1080,
      addEventListener: vi.fn((event, handler, opts) => {
        if (!listeners[event]) listeners[event] = [];
        listeners[event].push(handler);
      }),
    });

    const { initControls } = await import('../../src/interaction/controls.js');
    const mockRenderer = { domElement: { addEventListener: vi.fn() } };
    const mockCamera = { aspect: 1, updateProjectionMatrix: vi.fn() };
    initControls(state, mockCamera, mockRenderer, [], mockDismiss);

    const keydownHandler = listeners['keydown'][0];
    keydownHandler({ key: 'a', repeat: false, preventDefault: vi.fn(), target: { closest: () => null } });

    expect(state.holding).toBe(false);
    expect(mockDismiss).not.toHaveBeenCalled();
  });

  /// Tests checklist items: [1, 7] — Feature 4.4
  it('unit_keyboard_space_adds_holding_class', async () => {
    const listeners = {};
    vi.stubGlobal('window', {
      innerWidth: 1920,
      innerHeight: 1080,
      addEventListener: vi.fn((event, handler, opts) => {
        if (!listeners[event]) listeners[event] = [];
        listeners[event].push(handler);
      }),
    });

    const { initControls } = await import('../../src/interaction/controls.js');
    const mockRenderer = { domElement: { addEventListener: vi.fn() } };
    const mockCamera = { aspect: 1, updateProjectionMatrix: vi.fn() };
    initControls(state, mockCamera, mockRenderer, [], mockDismiss);

    const keydownHandler = listeners['keydown'][0];
    keydownHandler({ key: ' ', repeat: false, preventDefault: vi.fn(), target: { closest: () => null } });

    expect(cursorEl.classList.add).toHaveBeenCalledWith('holding');
    expect(cursorTrail.classList.add).toHaveBeenCalledWith('holding');
  });

  /// Tests checklist items: [2] — Feature 4.4
  it('unit_keyboard_dual_track_mouseup_keeps_holding_if_space_held', async () => {
    const listeners = {};
    vi.stubGlobal('window', {
      innerWidth: 1920,
      innerHeight: 1080,
      addEventListener: vi.fn((event, handler, opts) => {
        if (!listeners[event]) listeners[event] = [];
        listeners[event].push(handler);
      }),
    });

    const { initControls } = await import('../../src/interaction/controls.js');
    const mockRenderer = { domElement: { addEventListener: vi.fn() } };
    const mockCamera = { aspect: 1, updateProjectionMatrix: vi.fn() };
    initControls(state, mockCamera, mockRenderer, [], mockDismiss);

    // Hold Space
    const keydownHandler = listeners['keydown'][0];
    keydownHandler({ key: ' ', repeat: false, preventDefault: vi.fn(), target: { closest: () => null } });
    expect(state.holding).toBe(true);

    // Also hold mouse
    const mousedownHandler = listeners['mousedown'][0];
    mousedownHandler({ button: 0 });
    expect(state.holding).toBe(true);

    // Release mouse — Space is still held, so holding should stay true
    const mouseupHandler = listeners['mouseup'][0];
    mouseupHandler();
    expect(state.holding).toBe(true);

    // Release Space — now holding should be false
    const keyupHandler = listeners['keyup'][0];
    keyupHandler({ key: ' ', preventDefault: vi.fn() });
    expect(state.holding).toBe(false);
  });
});
