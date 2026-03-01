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

    const holdMechanic = await import('../../src/interaction/holdMechanic.js');
    expect(typeof holdMechanic.updateHoldProgress).toBe('function');

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

  /// Tests checklist items: [9]
  it('int_overlay_updates', async () => {
    const { initOverlay } = await import('../../src/ui/overlay.js');

    const result = initOverlay();

    expect(result).toBeDefined();
    expect(typeof result.updateOverlay).toBe('function');
  });
});
