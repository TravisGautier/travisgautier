import { describe, it, expect } from 'vitest';

describe('scaffold integration', () => {
  /// Tests checklist items: [3, 6]
  it('int_main_imports', async () => {
    // main.js should import constants and state without errors
    const constants = await import('../../src/config/constants.js');
    const stateModule = await import('../../src/interaction/state.js');

    // Constants module has expected named exports
    expect(constants.GOLD_ANGLE).toBeDefined();
    expect(constants.PURPLE_ANGLE).toBeDefined();
    expect(constants.CAM_ORBIT_RADIUS).toBeDefined();
    expect(constants.CAM_HEIGHT).toBeDefined();
    expect(constants.LOOK_TARGET).toBeDefined();

    // State module has state object
    expect(stateModule.state).toBeDefined();
    expect(typeof stateModule.state).toBe('object');
  });

  /// Tests checklist items: [2, 6]
  it('int_state_shared_ref', async () => {
    // Two imports of state should reference the same object
    const { state: stateA } = await import('../../src/interaction/state.js');
    const { state: stateB } = await import('../../src/interaction/state.js');

    // Same reference (ES module singleton)
    expect(stateA).toBe(stateB);

    // Mutation via one reference is visible through the other
    stateA.holdProgress = 0.42;
    expect(stateB.holdProgress).toBe(0.42);

    // Reset
    stateA.holdProgress = 0;
  });
});
