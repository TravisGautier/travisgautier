import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { detectTrackpad, computeScrollDelta, checkPortalHover, computePinchDist, computeGyroParallax } from '../../src/interaction/controls.js';

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

describe('computePinchDist', () => {
  /// Tests checklist items: [2] — Feature 5.2
  it('unit_computePinchDist_is_function', () => {
    expect(typeof computePinchDist).toBe('function');
  });

  /// Tests checklist items: [2] — Feature 5.2
  it('unit_computePinchDist_horizontal', () => {
    expect(computePinchDist({ clientX: 0, clientY: 0 }, { clientX: 100, clientY: 0 })).toBe(100);
  });

  /// Tests checklist items: [2] — Feature 5.2
  it('unit_computePinchDist_vertical', () => {
    expect(computePinchDist({ clientX: 0, clientY: 0 }, { clientX: 0, clientY: 200 })).toBe(200);
  });

  /// Tests checklist items: [2] — Feature 5.2
  it('unit_computePinchDist_diagonal', () => {
    expect(computePinchDist({ clientX: 0, clientY: 0 }, { clientX: 3, clientY: 4 })).toBe(5);
  });

  /// Tests checklist items: [2] — Feature 5.2
  it('unit_computePinchDist_same_point', () => {
    expect(computePinchDist({ clientX: 50, clientY: 50 }, { clientX: 50, clientY: 50 })).toBe(0);
  });

  /// Tests checklist items: [2] — Feature 5.2
  it('unit_computePinchDist_negative_coords', () => {
    expect(computePinchDist({ clientX: 100, clientY: 100 }, { clientX: 0, clientY: 0 })).toBeCloseTo(141.42, 1);
  });
});

describe('computeGyroParallax', () => {
  /// Tests checklist items: [3] — Feature 5.3
  it('unit_computeGyroParallax_is_function', () => {
    expect(typeof computeGyroParallax).toBe('function');
  });

  /// Tests checklist items: [3, 8] — Feature 5.3
  it('unit_computeGyroParallax_neutral_position', () => {
    const result = computeGyroParallax(0, 45);
    expect(result.nx).toBeCloseTo(0, 5);
    expect(result.ny).toBeCloseTo(0, 5);
  });

  /// Tests checklist items: [3, 8] — Feature 5.3
  it('unit_computeGyroParallax_tilt_right', () => {
    const result = computeGyroParallax(22.5, 45);
    expect(result.nx).toBeCloseTo(0.5, 5);
    expect(result.ny).toBeCloseTo(0, 5);
  });

  /// Tests checklist items: [3, 8] — Feature 5.3
  it('unit_computeGyroParallax_tilt_left', () => {
    const result = computeGyroParallax(-45, 45);
    expect(result.nx).toBeCloseTo(-1, 5);
    expect(result.ny).toBeCloseTo(0, 5);
  });

  /// Tests checklist items: [3, 8] — Feature 5.3
  it('unit_computeGyroParallax_tilt_forward', () => {
    const result = computeGyroParallax(0, 67.5);
    expect(result.nx).toBeCloseTo(0, 5);
    expect(result.ny).toBeCloseTo(0.5, 5);
  });

  /// Tests checklist items: [3, 8] — Feature 5.3
  it('unit_computeGyroParallax_tilt_back', () => {
    const result = computeGyroParallax(0, 0);
    expect(result.nx).toBeCloseTo(0, 5);
    expect(result.ny).toBeCloseTo(-1, 5);
  });

  /// Tests checklist items: [8] — Feature 5.3
  it('unit_computeGyroParallax_clamps_nx_max', () => {
    const result = computeGyroParallax(90, 45);
    expect(result.nx).toBe(1);
  });

  /// Tests checklist items: [8] — Feature 5.3
  it('unit_computeGyroParallax_clamps_nx_min', () => {
    const result = computeGyroParallax(-90, 45);
    expect(result.nx).toBe(-1);
  });

  /// Tests checklist items: [8] — Feature 5.3
  it('unit_computeGyroParallax_clamps_ny_max', () => {
    const result = computeGyroParallax(0, 135);
    expect(result.ny).toBe(1);
  });

  /// Tests checklist items: [8] — Feature 5.3
  it('unit_computeGyroParallax_clamps_ny_min', () => {
    const result = computeGyroParallax(0, -90);
    expect(result.ny).toBe(-1);
  });

  /// Tests checklist items: [3, 8] — Feature 5.3
  it('unit_computeGyroParallax_null_gamma', () => {
    const result = computeGyroParallax(null, 45);
    expect(result.nx).toBeCloseTo(0, 5);
    expect(result.ny).toBeCloseTo(0, 5);
  });

  /// Tests checklist items: [3, 8] — Feature 5.3
  it('unit_computeGyroParallax_null_beta', () => {
    const result = computeGyroParallax(0, null);
    expect(result.nx).toBeCloseTo(0, 5);
    expect(result.ny).toBeCloseTo(-1, 5);
  });

  /// Tests checklist items: [3, 8] — Feature 5.3
  it('unit_computeGyroParallax_both_null', () => {
    const result = computeGyroParallax(null, null);
    expect(result.nx).toBeCloseTo(0, 5);
    expect(result.ny).toBeCloseTo(-1, 5);
  });

  /// Tests checklist items: [3, 8] — Feature 5.3
  it('unit_computeGyroParallax_undefined_values', () => {
    const result = computeGyroParallax(undefined, undefined);
    expect(result.nx).toBeCloseTo(0, 5);
    expect(result.ny).toBeCloseTo(-1, 5);
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

describe('touch controls', () => {
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

  /// Tests checklist items: [3] — Feature 5.1
  it('unit_touch_start_sets_holding_true', async () => {
    const listeners = {};
    vi.stubGlobal('window', {
      innerWidth: 1920,
      innerHeight: 1080,
      addEventListener: vi.fn((event, handler, opts) => {
        if (!listeners[event]) listeners[event] = [];
        listeners[event].push(handler);
      }),
    });

    const domListeners = {};
    const mockRenderer = {
      domElement: {
        addEventListener: vi.fn((event, handler, opts) => {
          if (!domListeners[event]) domListeners[event] = [];
          domListeners[event].push(handler);
        }),
      },
    };

    const { initControls } = await import('../../src/interaction/controls.js');
    const mockCamera = { aspect: 1, updateProjectionMatrix: vi.fn() };
    initControls(state, mockCamera, mockRenderer, [], mockDismiss);

    const touchstartHandler = domListeners['touchstart'][0];
    touchstartHandler({ touches: [{ clientX: 960, clientY: 540 }], preventDefault: vi.fn() });

    expect(state.holding).toBe(true);
  });

  /// Tests checklist items: [5] — Feature 5.1
  it('unit_touch_end_sets_holding_false', async () => {
    const listeners = {};
    vi.stubGlobal('window', {
      innerWidth: 1920,
      innerHeight: 1080,
      addEventListener: vi.fn((event, handler, opts) => {
        if (!listeners[event]) listeners[event] = [];
        listeners[event].push(handler);
      }),
    });

    const domListeners = {};
    const mockRenderer = {
      domElement: {
        addEventListener: vi.fn((event, handler, opts) => {
          if (!domListeners[event]) domListeners[event] = [];
          domListeners[event].push(handler);
        }),
      },
    };

    const { initControls } = await import('../../src/interaction/controls.js');
    const mockCamera = { aspect: 1, updateProjectionMatrix: vi.fn() };
    initControls(state, mockCamera, mockRenderer, [], mockDismiss);

    // Touch down then up
    const touchstartHandler = domListeners['touchstart'][0];
    touchstartHandler({ touches: [{ clientX: 960, clientY: 540 }], preventDefault: vi.fn() });
    expect(state.holding).toBe(true);

    const touchendHandler = domListeners['touchend'][0];
    touchendHandler({});

    expect(state.holding).toBe(false);
  });

  /// Tests checklist items: [3] — Feature 5.1
  it('unit_touch_start_updates_mouse_ndc', async () => {
    const listeners = {};
    vi.stubGlobal('window', {
      innerWidth: 1920,
      innerHeight: 1080,
      addEventListener: vi.fn((event, handler, opts) => {
        if (!listeners[event]) listeners[event] = [];
        listeners[event].push(handler);
      }),
    });

    const domListeners = {};
    const mockRenderer = {
      domElement: {
        addEventListener: vi.fn((event, handler, opts) => {
          if (!domListeners[event]) domListeners[event] = [];
          domListeners[event].push(handler);
        }),
      },
    };

    const { initControls } = await import('../../src/interaction/controls.js');
    const mockCamera = { aspect: 1, updateProjectionMatrix: vi.fn() };
    initControls(state, mockCamera, mockRenderer, [], mockDismiss);

    const touchstartHandler = domListeners['touchstart'][0];
    touchstartHandler({ touches: [{ clientX: 480, clientY: 270 }], preventDefault: vi.fn() });

    // NDC: nx = (480/1920)*2-1 = 0.5-1 = -0.5
    // NDC: ny = -(270/1080)*2+1 = -0.5+1 = 0.5
    expect(state.mouse.nx).toBeCloseTo(-0.5, 5);
    expect(state.mouse.ny).toBeCloseTo(0.5, 5);
  });

  /// Tests checklist items: [4] — Feature 5.1
  it('unit_touch_move_updates_mouse_ndc', async () => {
    const listeners = {};
    vi.stubGlobal('window', {
      innerWidth: 1920,
      innerHeight: 1080,
      addEventListener: vi.fn((event, handler, opts) => {
        if (!listeners[event]) listeners[event] = [];
        listeners[event].push(handler);
      }),
    });

    const domListeners = {};
    const mockRenderer = {
      domElement: {
        addEventListener: vi.fn((event, handler, opts) => {
          if (!domListeners[event]) domListeners[event] = [];
          domListeners[event].push(handler);
        }),
      },
    };

    const { initControls } = await import('../../src/interaction/controls.js');
    const mockCamera = { aspect: 1, updateProjectionMatrix: vi.fn() };
    initControls(state, mockCamera, mockRenderer, [], mockDismiss);

    const touchmoveHandler = domListeners['touchmove'][0];
    touchmoveHandler({ touches: [{ clientX: 1440, clientY: 810 }] });

    // NDC: nx = (1440/1920)*2-1 = 1.5-1 = 0.5
    // NDC: ny = -(810/1080)*2+1 = -1.5+1 = -0.5
    expect(state.mouse.nx).toBeCloseTo(0.5, 5);
    expect(state.mouse.ny).toBeCloseTo(-0.5, 5);
  });

  /// Tests checklist items: [3] — Feature 5.1
  it('unit_touch_start_prevents_default', async () => {
    const listeners = {};
    vi.stubGlobal('window', {
      innerWidth: 1920,
      innerHeight: 1080,
      addEventListener: vi.fn((event, handler, opts) => {
        if (!listeners[event]) listeners[event] = [];
        listeners[event].push(handler);
      }),
    });

    const domListeners = {};
    const mockRenderer = {
      domElement: {
        addEventListener: vi.fn((event, handler, opts) => {
          if (!domListeners[event]) domListeners[event] = [];
          domListeners[event].push(handler);
        }),
      },
    };

    const { initControls } = await import('../../src/interaction/controls.js');
    const mockCamera = { aspect: 1, updateProjectionMatrix: vi.fn() };
    initControls(state, mockCamera, mockRenderer, [], mockDismiss);

    const preventDefault = vi.fn();
    const touchstartHandler = domListeners['touchstart'][0];
    touchstartHandler({ touches: [{ clientX: 960, clientY: 540 }], preventDefault });

    expect(preventDefault).toHaveBeenCalledTimes(1);
  });

  /// Tests checklist items: [6] — Feature 5.1
  it('unit_touch_cancel_clears_holding', async () => {
    const listeners = {};
    vi.stubGlobal('window', {
      innerWidth: 1920,
      innerHeight: 1080,
      addEventListener: vi.fn((event, handler, opts) => {
        if (!listeners[event]) listeners[event] = [];
        listeners[event].push(handler);
      }),
    });

    const domListeners = {};
    const mockRenderer = {
      domElement: {
        addEventListener: vi.fn((event, handler, opts) => {
          if (!domListeners[event]) domListeners[event] = [];
          domListeners[event].push(handler);
        }),
      },
    };

    const { initControls } = await import('../../src/interaction/controls.js');
    const mockCamera = { aspect: 1, updateProjectionMatrix: vi.fn() };
    initControls(state, mockCamera, mockRenderer, [], mockDismiss);

    // Touch down then cancel
    const touchstartHandler = domListeners['touchstart'][0];
    touchstartHandler({ touches: [{ clientX: 960, clientY: 540 }], preventDefault: vi.fn() });
    expect(state.holding).toBe(true);

    const touchcancelHandler = domListeners['touchcancel'][0];
    touchcancelHandler({});

    expect(state.holding).toBe(false);
  });

  /// Tests checklist items: [3] — Feature 5.1
  it('unit_touch_start_adds_holding_class', async () => {
    const listeners = {};
    vi.stubGlobal('window', {
      innerWidth: 1920,
      innerHeight: 1080,
      addEventListener: vi.fn((event, handler, opts) => {
        if (!listeners[event]) listeners[event] = [];
        listeners[event].push(handler);
      }),
    });

    const domListeners = {};
    const mockRenderer = {
      domElement: {
        addEventListener: vi.fn((event, handler, opts) => {
          if (!domListeners[event]) domListeners[event] = [];
          domListeners[event].push(handler);
        }),
      },
    };

    const { initControls } = await import('../../src/interaction/controls.js');
    const mockCamera = { aspect: 1, updateProjectionMatrix: vi.fn() };
    initControls(state, mockCamera, mockRenderer, [], mockDismiss);

    const touchstartHandler = domListeners['touchstart'][0];
    touchstartHandler({ touches: [{ clientX: 960, clientY: 540 }], preventDefault: vi.fn() });

    expect(cursorEl.classList.add).toHaveBeenCalledWith('holding');
    expect(cursorTrail.classList.add).toHaveBeenCalledWith('holding');
  });

  /// Tests checklist items: [5] — Feature 5.1
  it('unit_touch_end_removes_holding_class', async () => {
    const listeners = {};
    vi.stubGlobal('window', {
      innerWidth: 1920,
      innerHeight: 1080,
      addEventListener: vi.fn((event, handler, opts) => {
        if (!listeners[event]) listeners[event] = [];
        listeners[event].push(handler);
      }),
    });

    const domListeners = {};
    const mockRenderer = {
      domElement: {
        addEventListener: vi.fn((event, handler, opts) => {
          if (!domListeners[event]) domListeners[event] = [];
          domListeners[event].push(handler);
        }),
      },
    };

    const { initControls } = await import('../../src/interaction/controls.js');
    const mockCamera = { aspect: 1, updateProjectionMatrix: vi.fn() };
    initControls(state, mockCamera, mockRenderer, [], mockDismiss);

    // Touch down then up
    const touchstartHandler = domListeners['touchstart'][0];
    touchstartHandler({ touches: [{ clientX: 960, clientY: 540 }], preventDefault: vi.fn() });

    const touchendHandler = domListeners['touchend'][0];
    touchendHandler({});

    expect(cursorEl.classList.remove).toHaveBeenCalledWith('holding');
    expect(cursorTrail.classList.remove).toHaveBeenCalledWith('holding');
  });

  /// Tests checklist items: [2, 8] — Feature 5.1
  it('int_touch_dual_track_keyboard', async () => {
    const listeners = {};
    vi.stubGlobal('window', {
      innerWidth: 1920,
      innerHeight: 1080,
      addEventListener: vi.fn((event, handler, opts) => {
        if (!listeners[event]) listeners[event] = [];
        listeners[event].push(handler);
      }),
    });

    const domListeners = {};
    const mockRenderer = {
      domElement: {
        addEventListener: vi.fn((event, handler, opts) => {
          if (!domListeners[event]) domListeners[event] = [];
          domListeners[event].push(handler);
        }),
      },
    };

    const { initControls } = await import('../../src/interaction/controls.js');
    const mockCamera = { aspect: 1, updateProjectionMatrix: vi.fn() };
    initControls(state, mockCamera, mockRenderer, [], mockDismiss);

    // Hold Space
    const keydownHandler = listeners['keydown'][0];
    keydownHandler({ key: ' ', repeat: false, preventDefault: vi.fn(), target: { closest: () => null } });
    expect(state.holding).toBe(true);

    // Also touch down
    const touchstartHandler = domListeners['touchstart'][0];
    touchstartHandler({ touches: [{ clientX: 960, clientY: 540 }], preventDefault: vi.fn() });
    expect(state.holding).toBe(true);

    // Release touch — Space is still held, so holding should stay true
    const touchendHandler = domListeners['touchend'][0];
    touchendHandler({});
    expect(state.holding).toBe(true);

    // Release Space — now holding should be false
    const keyupHandler = listeners['keyup'][0];
    keyupHandler({ key: ' ', preventDefault: vi.fn() });
    expect(state.holding).toBe(false);
  });

  /// Tests checklist items: [2, 8] — Feature 5.1
  it('int_touch_dual_track_mouse', async () => {
    const listeners = {};
    vi.stubGlobal('window', {
      innerWidth: 1920,
      innerHeight: 1080,
      addEventListener: vi.fn((event, handler, opts) => {
        if (!listeners[event]) listeners[event] = [];
        listeners[event].push(handler);
      }),
    });

    const domListeners = {};
    const mockRenderer = {
      domElement: {
        addEventListener: vi.fn((event, handler, opts) => {
          if (!domListeners[event]) domListeners[event] = [];
          domListeners[event].push(handler);
        }),
      },
    };

    const { initControls } = await import('../../src/interaction/controls.js');
    const mockCamera = { aspect: 1, updateProjectionMatrix: vi.fn() };
    initControls(state, mockCamera, mockRenderer, [], mockDismiss);

    // Mouse down
    const mousedownHandler = listeners['mousedown'][0];
    mousedownHandler({ button: 0 });
    expect(state.holding).toBe(true);

    // Also touch down
    const touchstartHandler = domListeners['touchstart'][0];
    touchstartHandler({ touches: [{ clientX: 960, clientY: 540 }], preventDefault: vi.fn() });
    expect(state.holding).toBe(true);

    // Release touch — mouse is still down, so holding should stay true
    const touchendHandler = domListeners['touchend'][0];
    touchendHandler({});
    expect(state.holding).toBe(true);

    // Release mouse — now holding should be false
    const mouseupHandler = listeners['mouseup'][0];
    mouseupHandler();
    expect(state.holding).toBe(false);
  });
});

describe('pinch zoom', () => {
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

  async function setupPinchTest() {
    const listeners = {};
    vi.stubGlobal('window', {
      innerWidth: 1920,
      innerHeight: 1080,
      addEventListener: vi.fn((event, handler, opts) => {
        if (!listeners[event]) listeners[event] = [];
        listeners[event].push(handler);
      }),
    });

    const domListeners = {};
    const mockRenderer = {
      domElement: {
        addEventListener: vi.fn((event, handler, opts) => {
          if (!domListeners[event]) domListeners[event] = [];
          domListeners[event].push(handler);
        }),
      },
    };

    const { initControls } = await import('../../src/interaction/controls.js');
    const mockCamera = { aspect: 1, updateProjectionMatrix: vi.fn() };
    const result = initControls(state, mockCamera, mockRenderer, [], mockDismiss);

    return { listeners, domListeners, result };
  }

  /// Tests checklist items: [5] — Feature 5.2
  it('unit_pinch_zoom_updates_scroll_target', async () => {
    const { domListeners, result } = await setupPinchTest();
    const touchmoveHandler = domListeners['touchmove'][0];

    // First 2-finger move — establishes baseline
    touchmoveHandler({ touches: [{ clientX: 200, clientY: 300 }, { clientX: 400, clientY: 300 }] });
    // Second 2-finger move — fingers closer (pinch in)
    touchmoveHandler({ touches: [{ clientX: 250, clientY: 300 }, { clientX: 350, clientY: 300 }] });

    expect(result.getScrollTarget()).toBeGreaterThan(0);
  });

  /// Tests checklist items: [5] — Feature 5.2
  it('unit_pinch_zoom_outward_decreases_scroll', async () => {
    const { domListeners, result } = await setupPinchTest();
    const touchmoveHandler = domListeners['touchmove'][0];

    // First 2-finger move — establishes baseline
    touchmoveHandler({ touches: [{ clientX: 300, clientY: 300 }, { clientX: 350, clientY: 300 }] });
    // Second 2-finger move — fingers further apart (pinch out)
    touchmoveHandler({ touches: [{ clientX: 200, clientY: 300 }, { clientX: 450, clientY: 300 }] });

    expect(result.getScrollTarget()).toBeLessThan(0);
  });

  /// Tests checklist items: [5] — Feature 5.2
  it('unit_pinch_zoom_first_move_no_delta', async () => {
    const { domListeners, result } = await setupPinchTest();
    const touchmoveHandler = domListeners['touchmove'][0];

    // Single 2-finger move — establishes baseline, no delta
    touchmoveHandler({ touches: [{ clientX: 200, clientY: 300 }, { clientX: 400, clientY: 300 }] });

    expect(result.getScrollTarget()).toBe(0);
  });

  /// Tests checklist items: [5] — Feature 5.2
  it('unit_pinch_zoom_clamps_max', async () => {
    const { domListeners, result } = await setupPinchTest();
    const touchmoveHandler = domListeners['touchmove'][0];

    // Establish baseline with large distance
    touchmoveHandler({ touches: [{ clientX: 0, clientY: 300 }, { clientX: 500, clientY: 300 }] });
    // Extreme pinch in — distance drops from 500 to 1
    touchmoveHandler({ touches: [{ clientX: 249, clientY: 300 }, { clientX: 250, clientY: 300 }] });

    expect(result.getScrollTarget()).toBe(1.0);
  });

  /// Tests checklist items: [5] — Feature 5.2
  it('unit_pinch_zoom_clamps_min', async () => {
    const { domListeners, result } = await setupPinchTest();
    const touchmoveHandler = domListeners['touchmove'][0];

    // Establish baseline with small distance
    touchmoveHandler({ touches: [{ clientX: 249, clientY: 300 }, { clientX: 250, clientY: 300 }] });
    // Extreme pinch out — distance jumps from 1 to 500
    touchmoveHandler({ touches: [{ clientX: 0, clientY: 300 }, { clientX: 500, clientY: 300 }] });

    expect(result.getScrollTarget()).toBe(-1.0);
  });

  /// Tests checklist items: [6] — Feature 5.2
  it('unit_pinch_zoom_touchend_resets', async () => {
    const { domListeners, result } = await setupPinchTest();
    const touchmoveHandler = domListeners['touchmove'][0];
    const touchendHandler = domListeners['touchend'][0];

    // Pinch sequence
    touchmoveHandler({ touches: [{ clientX: 200, clientY: 300 }, { clientX: 400, clientY: 300 }] });
    touchmoveHandler({ touches: [{ clientX: 250, clientY: 300 }, { clientX: 350, clientY: 300 }] });
    const scrollAfterPinch = result.getScrollTarget();
    expect(scrollAfterPinch).toBeGreaterThan(0);

    // touchend resets lastPinchDist
    touchendHandler({});

    // New pinch starts fresh — first move should not produce delta
    const scrollBeforeNewPinch = result.getScrollTarget();
    touchmoveHandler({ touches: [{ clientX: 200, clientY: 300 }, { clientX: 400, clientY: 300 }] });
    expect(result.getScrollTarget()).toBe(scrollBeforeNewPinch);
  });

  /// Tests checklist items: [7] — Feature 5.2
  it('unit_pinch_zoom_touchcancel_resets', async () => {
    const { domListeners, result } = await setupPinchTest();
    const touchmoveHandler = domListeners['touchmove'][0];
    const touchcancelHandler = domListeners['touchcancel'][0];

    // Pinch sequence
    touchmoveHandler({ touches: [{ clientX: 200, clientY: 300 }, { clientX: 400, clientY: 300 }] });
    touchmoveHandler({ touches: [{ clientX: 250, clientY: 300 }, { clientX: 350, clientY: 300 }] });
    const scrollAfterPinch = result.getScrollTarget();
    expect(scrollAfterPinch).toBeGreaterThan(0);

    // touchcancel resets lastPinchDist
    touchcancelHandler({});

    // New pinch starts fresh — first move should not produce delta
    const scrollBeforeNewPinch = result.getScrollTarget();
    touchmoveHandler({ touches: [{ clientX: 200, clientY: 300 }, { clientX: 400, clientY: 300 }] });
    expect(result.getScrollTarget()).toBe(scrollBeforeNewPinch);
  });

  /// Tests checklist items: [5] — Feature 5.2
  it('unit_pinch_single_touch_still_updates_ndc', async () => {
    const { domListeners } = await setupPinchTest();
    const touchmoveHandler = domListeners['touchmove'][0];

    // Single-finger touchmove
    touchmoveHandler({ touches: [{ clientX: 480, clientY: 270 }] });

    // NDC: nx = (480/1920)*2-1 = -0.5, ny = -(270/1080)*2+1 = 0.5
    expect(state.mouse.nx).toBeCloseTo(-0.5, 5);
    expect(state.mouse.ny).toBeCloseTo(0.5, 5);
  });

  /// Tests checklist items: [5] — Feature 5.2
  it('unit_pinch_two_touch_does_not_update_ndc', async () => {
    const { domListeners } = await setupPinchTest();
    const touchmoveHandler = domListeners['touchmove'][0];

    // Two-finger touchmove should NOT update NDC
    touchmoveHandler({ touches: [{ clientX: 200, clientY: 300 }, { clientX: 400, clientY: 300 }] });

    expect(state.mouse.nx).toBe(0);
    expect(state.mouse.ny).toBe(0);
  });

  /// Tests checklist items: [5, 6] — Feature 5.2
  it('int_pinch_then_single_touch_hold', async () => {
    const { domListeners } = await setupPinchTest();
    const touchstartHandler = domListeners['touchstart'][0];
    const touchmoveHandler = domListeners['touchmove'][0];
    const touchendHandler = domListeners['touchend'][0];

    // touchstart with 1 finger — sets touchHolding
    touchstartHandler({ touches: [{ clientX: 300, clientY: 300 }], preventDefault: vi.fn() });
    expect(state.holding).toBe(true);

    // 2-finger pinch gesture
    touchmoveHandler({ touches: [{ clientX: 200, clientY: 300 }, { clientX: 400, clientY: 300 }] });
    touchmoveHandler({ touches: [{ clientX: 250, clientY: 300 }, { clientX: 350, clientY: 300 }] });

    // Lift one finger — touchend fires
    touchendHandler({});

    // After touchend, touchHolding is false, but we can start a new touch
    touchstartHandler({ touches: [{ clientX: 500, clientY: 400 }], preventDefault: vi.fn() });
    expect(state.holding).toBe(true);

    // Single-finger touchmove resumes NDC updates
    touchmoveHandler({ touches: [{ clientX: 960, clientY: 540 }] });
    expect(state.mouse.nx).toBeCloseTo(0, 5);
    expect(state.mouse.ny).toBeCloseTo(0, 5);
  });
});

describe('gyroscope controls', () => {
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

  async function setupGyroTest(qualityConfig) {
    const listeners = {};
    vi.stubGlobal('window', {
      innerWidth: 1920,
      innerHeight: 1080,
      addEventListener: vi.fn((event, handler, opts) => {
        if (!listeners[event]) listeners[event] = [];
        listeners[event].push(handler);
      }),
    });

    const domListeners = {};
    const mockRenderer = {
      domElement: {
        addEventListener: vi.fn((event, handler, opts) => {
          if (!domListeners[event]) domListeners[event] = [];
          domListeners[event].push(handler);
        }),
      },
    };

    const { initControls } = await import('../../src/interaction/controls.js');
    const mockCamera = { aspect: 1, updateProjectionMatrix: vi.fn() };
    const result = initControls(state, mockCamera, mockRenderer, [], mockDismiss, qualityConfig);

    return { listeners, domListeners, result };
  }

  /// Tests checklist items: [5, 7] — Feature 5.3
  it('int_gyro_binds_deviceorientation_when_enabled', async () => {
    const { listeners } = await setupGyroTest({ useGyroscope: true });
    expect(listeners['deviceorientation']).toBeDefined();
    expect(listeners['deviceorientation'].length).toBeGreaterThan(0);
  });

  /// Tests checklist items: [5, 7] — Feature 5.3
  it('int_gyro_updates_state_on_deviceorientation', async () => {
    const { listeners } = await setupGyroTest({ useGyroscope: true });
    const handler = listeners['deviceorientation'][0];

    handler({ gamma: 22.5, beta: 67.5 });

    expect(state.mouse.nx).toBeCloseTo(0.5, 5);
    expect(state.mouse.ny).toBeCloseTo(0.5, 5);
  });

  /// Tests checklist items: [5] — Feature 5.3
  it('int_gyro_skipped_when_useGyroscope_false', async () => {
    const { listeners } = await setupGyroTest({ useGyroscope: false });
    expect(listeners['deviceorientation']).toBeUndefined();
  });

  /// Tests checklist items: [4] — Feature 5.3
  it('int_gyro_skipped_when_qualityConfig_empty', async () => {
    const { listeners } = await setupGyroTest({});
    expect(listeners['deviceorientation']).toBeUndefined();
  });

  /// Tests checklist items: [4] — Feature 5.3
  it('int_gyro_skipped_when_no_qualityConfig', async () => {
    const listeners = {};
    vi.stubGlobal('window', {
      innerWidth: 1920,
      innerHeight: 1080,
      addEventListener: vi.fn((event, handler, opts) => {
        if (!listeners[event]) listeners[event] = [];
        listeners[event].push(handler);
      }),
    });

    const domListeners = {};
    const mockRenderer = {
      domElement: {
        addEventListener: vi.fn((event, handler, opts) => {
          if (!domListeners[event]) domListeners[event] = [];
          domListeners[event].push(handler);
        }),
      },
    };

    const { initControls } = await import('../../src/interaction/controls.js');
    const mockCamera = { aspect: 1, updateProjectionMatrix: vi.fn() };
    initControls(state, mockCamera, mockRenderer, [], mockDismiss);

    expect(listeners['deviceorientation']).toBeUndefined();
  });

  /// Tests checklist items: [6] — Feature 5.3
  it('int_gyro_ios_permission_granted', async () => {
    const mockRequestPermission = vi.fn().mockResolvedValue('granted');
    vi.stubGlobal('DeviceOrientationEvent', {
      requestPermission: mockRequestPermission,
    });

    const { listeners, domListeners } = await setupGyroTest({ useGyroscope: true });

    // Gyro should NOT be bound yet (iOS requires user gesture)
    expect(listeners['deviceorientation']).toBeUndefined();

    // Simulate touchstart (user gesture triggers permission request)
    const touchstartHandler = domListeners['touchstart'][0];
    touchstartHandler({ touches: [{ clientX: 960, clientY: 540 }], preventDefault: vi.fn() });

    // Flush microtask for permission promise
    await new Promise(r => setTimeout(r, 0));

    expect(mockRequestPermission).toHaveBeenCalledTimes(1);
    expect(listeners['deviceorientation']).toBeDefined();
    expect(listeners['deviceorientation'].length).toBeGreaterThan(0);
  });

  /// Tests checklist items: [6] — Feature 5.3
  it('int_gyro_ios_permission_denied', async () => {
    const mockRequestPermission = vi.fn().mockResolvedValue('denied');
    vi.stubGlobal('DeviceOrientationEvent', {
      requestPermission: mockRequestPermission,
    });

    const { listeners, domListeners } = await setupGyroTest({ useGyroscope: true });

    const touchstartHandler = domListeners['touchstart'][0];
    touchstartHandler({ touches: [{ clientX: 960, clientY: 540 }], preventDefault: vi.fn() });

    await new Promise(r => setTimeout(r, 0));

    expect(mockRequestPermission).toHaveBeenCalledTimes(1);
    expect(listeners['deviceorientation']).toBeUndefined();
  });

  /// Tests checklist items: [6] — Feature 5.3
  it('int_gyro_ios_permission_error', async () => {
    const mockRequestPermission = vi.fn().mockRejectedValue(new Error('Permission error'));
    vi.stubGlobal('DeviceOrientationEvent', {
      requestPermission: mockRequestPermission,
    });

    const { listeners, domListeners } = await setupGyroTest({ useGyroscope: true });

    const touchstartHandler = domListeners['touchstart'][0];

    // Should not throw
    expect(() => {
      touchstartHandler({ touches: [{ clientX: 960, clientY: 540 }], preventDefault: vi.fn() });
    }).not.toThrow();

    await new Promise(r => setTimeout(r, 0));

    expect(mockRequestPermission).toHaveBeenCalledTimes(1);
    expect(listeners['deviceorientation']).toBeUndefined();
  });

  /// Tests checklist items: [6] — Feature 5.3
  it('int_gyro_ios_touchstart_fires_only_once', async () => {
    const mockRequestPermission = vi.fn().mockResolvedValue('granted');
    vi.stubGlobal('DeviceOrientationEvent', {
      requestPermission: mockRequestPermission,
    });

    const { domListeners } = await setupGyroTest({ useGyroscope: true });

    const touchstartHandler = domListeners['touchstart'][0];

    // First touch — triggers permission request
    touchstartHandler({ touches: [{ clientX: 960, clientY: 540 }], preventDefault: vi.fn() });
    await new Promise(r => setTimeout(r, 0));

    // Second touch — should NOT trigger permission request again
    touchstartHandler({ touches: [{ clientX: 500, clientY: 300 }], preventDefault: vi.fn() });
    await new Promise(r => setTimeout(r, 0));

    expect(mockRequestPermission).toHaveBeenCalledTimes(1);
  });
});

describe('responsive controls', () => {
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

  async function setupResponsiveTest(qualityConfig) {
    const listeners = {};
    vi.stubGlobal('window', {
      innerWidth: 1920,
      innerHeight: 1080,
      addEventListener: vi.fn((event, handler, opts) => {
        if (!listeners[event]) listeners[event] = [];
        listeners[event].push({ handler, opts });
      }),
    });

    const domListeners = {};
    const domListenerOpts = {};
    const mockRenderer = {
      domElement: {
        addEventListener: vi.fn((event, handler, opts) => {
          if (!domListeners[event]) domListeners[event] = [];
          domListeners[event].push(handler);
          if (!domListenerOpts[event]) domListenerOpts[event] = [];
          domListenerOpts[event].push(opts);
        }),
      },
    };

    const mockCamera = { aspect: 1, updateProjectionMatrix: vi.fn() };

    const { initControls } = await import('../../src/interaction/controls.js');
    initControls(state, mockCamera, mockRenderer, [], mockDismiss, qualityConfig || {});

    return { listeners, domListeners, domListenerOpts, mockCamera, mockRenderer };
  }

  /// Tests checklist items: [9] — Feature 5.5
  it('unit_resize_refactored', async () => {
    const { listeners, mockCamera } = await setupResponsiveTest();

    // Resize listener must be registered
    expect(listeners['resize']).toBeDefined();
    expect(listeners['resize'].length).toBeGreaterThan(0);

    // Trigger resize
    const resizeEntry = listeners['resize'][0];
    resizeEntry.handler();

    // Camera aspect ratio should be updated
    expect(mockCamera.aspect).toBe(1920 / 1080);
    expect(mockCamera.updateProjectionMatrix).toHaveBeenCalled();
  });

  /// Tests checklist items: [7, 9] — Feature 5.5
  it('unit_orientationchange_handler', async () => {
    const { listeners } = await setupResponsiveTest();

    // Either screen.orientation 'change' or window 'orientationchange' must be registered
    const hasOrientation = listeners['orientationchange'] !== undefined;
    const hasScreenOrientation = listeners['change'] !== undefined;

    expect(hasOrientation || hasScreenOrientation).toBe(true);
  });

  /// Tests checklist items: [8] — Feature 5.5
  it('unit_touchmove_prevents_default', async () => {
    const { domListeners, domListenerOpts } = await setupResponsiveTest();

    // touchmove must be registered
    expect(domListeners['touchmove']).toBeDefined();

    // touchmove must use { passive: false } to allow preventDefault
    const touchmoveOpts = domListenerOpts['touchmove'];
    expect(touchmoveOpts).toBeDefined();
    const hasPassiveFalse = touchmoveOpts.some(opts =>
      opts && typeof opts === 'object' && opts.passive === false
    );
    expect(hasPassiveFalse).toBe(true);

    // Simulate touchmove — preventDefault must be called
    const mockEvent = {
      touches: [{ clientX: 500, clientY: 300 }],
      preventDefault: vi.fn(),
    };
    const touchmoveHandler = domListeners['touchmove'][0];
    touchmoveHandler(mockEvent);
    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });

  /// Tests checklist items: [7] — Feature 5.5
  it('unit_orientation_timeout', async () => {
    const originalSetTimeout = globalThis.setTimeout;
    const setTimeoutSpy = vi.fn(originalSetTimeout);
    vi.stubGlobal('setTimeout', setTimeoutSpy);

    const { listeners } = await setupResponsiveTest();

    // Trigger orientation change
    const orientationEntry = listeners['orientationchange'] || listeners['change'];
    expect(orientationEntry).toBeDefined();
    orientationEntry[0].handler();

    // setTimeout should be called with a delay (typically ~100ms for orientation settle)
    expect(setTimeoutSpy).toHaveBeenCalled();
    const delayArg = setTimeoutSpy.mock.calls.find(call => call[1] >= 50 && call[1] <= 200);
    expect(delayArg).toBeDefined();
  });
});
