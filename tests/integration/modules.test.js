import { describe, it, expect } from 'vitest';

describe('module integration', () => {
  /// Tests checklist items: [11]
  it('int_main_init_sequence', async () => {
    // main.js module imports should resolve without errors
    const mainModule = await import('../../src/main.js');
    expect(mainModule).toBeDefined();
  });

  /// Tests checklist items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  it('int_module_exports', async () => {
    // Each new module exports the expected factory/init function
    const setup = await import('../../src/scene/setup.js');
    expect(typeof setup.createSetup).toBe('function');

    const environment = await import('../../src/scene/environment.js');
    expect(typeof environment.createEnvironment).toBe('function');

    const temple = await import('../../src/scene/temple.js');
    expect(typeof temple.createTemple).toBe('function');

    const portal = await import('../../src/scene/portal.js');
    expect(typeof portal.createPortal).toBe('function');

    const lighting = await import('../../src/scene/lighting.js');
    expect(typeof lighting.createLighting).toBe('function');

    const controls = await import('../../src/interaction/controls.js');
    expect(typeof controls.initControls).toBe('function');

    const cursor = await import('../../src/interaction/cursor.js');
    expect(typeof cursor.initCursor).toBe('function');

    const dragOrbit = await import('../../src/interaction/dragOrbit.js');
    expect(typeof dragOrbit.updateDragPhysics).toBe('function');

    const overlay = await import('../../src/ui/overlay.js');
    expect(typeof overlay.initOverlay).toBe('function');

    const animate = await import('../../src/animate.js');
    expect(typeof animate.startAnimateLoop).toBe('function');
  });

  /// Tests checklist items: [1]
  it('int_setup_creates_scene', async () => {
    const { createSetup } = await import('../../src/scene/setup.js');

    const container = { appendChild: () => {} };
    const result = createSetup(container);

    // scene should have fog set
    expect(result.scene).toBeDefined();
    expect(result.scene.fog).toBeDefined();

    // camera should be PerspectiveCamera with FOV=50
    expect(result.camera).toBeDefined();
    expect(result.camera.fov).toBe(50);

    // renderer should have shadowMap enabled
    expect(result.renderer).toBeDefined();
    expect(result.renderer.shadowMap.enabled).toBe(true);
  });

  /// Tests checklist items: [4]
  it('int_portal_adds_to_scene', async () => {
    const { createPortal } = await import('../../src/scene/portal.js');

    const addedObjects = [];
    const scene = { add: (obj) => addedObjects.push(obj) };

    const result = createPortal(scene);

    // scene.add should have been called with portalGroup
    expect(addedObjects).toContain(result.portalGroup);
    // portalGroup should have children (frame pieces + surfaces)
    expect(result.portalGroup.children.length).toBeGreaterThan(0);
  });

  /// Tests checklist items: [6]
  it('int_controls_writes_state', async () => {
    const { initControls } = await import('../../src/interaction/controls.js');
    const { state } = await import('../../src/interaction/state.js');

    // Mock camera and renderer
    const camera = {};
    const renderer = { domElement: { addEventListener: () => {} } };

    // Should not throw
    expect(() => initControls(state, camera, renderer)).not.toThrow();
  });

  /// Tests checklist items: [2] — Feature 9.4
  it('int_fallback_module_exports', async () => {
    const fallback = await import('../../src/ui/fallback.js');
    expect(typeof fallback.initFallback).toBe('function');
  });

  /// Tests checklist items: [1] — Feature 9.4
  it('int_main_tier0_branch', async () => {
    const fs = await import('fs');
    const path = await import('path');
    const src = fs.readFileSync(path.resolve('src/main.js'), 'utf-8');

    // main.js must check for tier 0
    expect(src).toMatch(/quality\.tier\s*===\s*0/);
    // main.js must dynamically import fallback.js
    expect(src).toContain('./ui/fallback.js');
  });

  /// Tests checklist items: [2, 3] — Feature 2.2
  it('int_overlay_exports_context_lost', async () => {
    const overlay = await import('../../src/ui/overlay.js');

    expect(typeof overlay.showContextLostMessage).toBe('function');
    expect(typeof overlay.hideContextLostMessage).toBe('function');
  });

  /// Tests checklist items: [9]
  it('int_overlay_updates', async () => {
    const { initOverlay } = await import('../../src/ui/overlay.js');

    const result = initOverlay();

    expect(result).toBeDefined();
    expect(typeof result.updateOverlay).toBe('function');
  });

  /// Tests checklist items: [3] — Feature 3.5
  it('int_loading_module_exports', async () => {
    const mod = await import('../../src/ui/loading.js');
    expect(typeof mod.loadAssets).toBe('function');
    expect(typeof mod.hideLoading).toBe('function');
  });

  /// Tests checklist items: [6] — Feature 2.8
  it('int_setup_exports_dispose', async () => {
    const setup = await import('../../src/scene/setup.js');
    expect(typeof setup.dispose).toBe('function');
  });

  /// Tests checklist items: [1, 4] — Feature 3.6
  it('int_fpsMonitor_module_exports', async () => {
    const mod = await import('../../src/interaction/fpsMonitor.js');
    expect(typeof mod.createFPSMonitor).toBe('function');
    expect(typeof mod.applyRuntimeDowngrade).toBe('function');
  });

  /// Tests checklist items: [3] — Feature 3.6
  it('int_animate_accepts_sampleFPS', async () => {
    const fs = await import('fs');
    const path = await import('path');
    const src = fs.readFileSync(path.resolve('src/animate.js'), 'utf-8');
    // sampleFPS should be in deps destructuring or called in loop
    expect(src).toContain('sampleFPS');
  });

  /// Tests checklist items: [5] — Feature 3.6
  it('int_main_imports_fpsMonitor', async () => {
    const fs = await import('fs');
    const path = await import('path');
    const src = fs.readFileSync(path.resolve('src/main.js'), 'utf-8');
    expect(src).toContain('createFPSMonitor');
    expect(src).toContain('sampleFPS');
  });

  /// Tests checklist items: [2] — Feature 6.1
  it('int_main_passes_motionConfig', async () => {
    const fs = await import('fs');
    const path = await import('path');
    const src = fs.readFileSync(path.resolve('src/main.js'), 'utf-8');
    expect(src).toContain('determineQuality');
    expect(src).toContain('motionConfig');
  });
});
