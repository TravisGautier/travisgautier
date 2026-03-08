import { vi } from 'vitest';

/**
 * Creates a mock Scene object with a tracked `add` method.
 * @returns {{ scene: object, added: Array }}
 */
export function createMockScene() {
  const added = [];
  const scene = {
    add: vi.fn((obj) => added.push(obj)),
    traverse: vi.fn((cb) => added.forEach(cb)),
  };
  return { scene, added };
}

/**
 * Creates a mock container element (the DOM element that holds the canvas).
 * @returns {{ container: object, appendedChildren: Array }}
 */
export function createMockContainer() {
  const appendedChildren = [];
  const container = {
    appendChild: vi.fn((child) => appendedChildren.push(child)),
  };
  return { container, appendedChildren };
}

/**
 * Creates a mock WebGLRenderer-like object with spies.
 * @param {object} [overrides] - Properties to override on the mock.
 * @returns {object} Mock renderer.
 */
export function createMockRenderer(overrides = {}) {
  return {
    domElement: {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      setAttribute: vi.fn(),
      getAttribute: vi.fn(),
    },
    setSize: vi.fn(),
    setPixelRatio: vi.fn(),
    getPixelRatio: vi.fn(() => overrides.pixelRatio ?? 1),
    setClearColor: vi.fn(),
    render: vi.fn(),
    dispose: vi.fn(),
    forceContextLoss: vi.fn(),
    toneMapping: 4,
    toneMappingExposure: 1.4,
    shadowMap: {
      enabled: overrides.shadowsEnabled ?? true,
      type: 2,
    },
    ...overrides,
  };
}

/**
 * Creates a mock Raycaster with spied methods.
 * @param {Array} [intersections] - Array of intersection results to return.
 * @returns {object} Mock raycaster.
 */
export function createMockRaycaster(intersections = []) {
  return {
    setFromCamera: vi.fn(),
    intersectObjects: vi.fn(() => intersections),
  };
}

/**
 * Creates a mock Camera object.
 * @returns {object} Mock camera.
 */
export function createMockCamera() {
  return {
    position: { x: 0, y: 0, z: 0, set: vi.fn() },
    lookAt: vi.fn(),
    fov: 50,
    aspect: 16 / 9,
    updateProjectionMatrix: vi.fn(),
  };
}

/**
 * Creates a mock Clock object.
 * @param {number} [fixedDelta=0.016] - Fixed delta time to return.
 * @returns {object} Mock clock.
 */
export function createMockClock(fixedDelta = 0.016) {
  return {
    getDelta: vi.fn(() => fixedDelta),
    getElapsedTime: vi.fn(() => 0),
    start: vi.fn(),
    stop: vi.fn(),
  };
}

/**
 * Creates a mock DOM element with classList spy methods.
 * @param {object} [overrides] - Additional properties.
 * @returns {object} Mock DOM element.
 */
export function createMockElement(overrides = {}) {
  return {
    style: {},
    classList: {
      add: vi.fn(),
      remove: vi.fn(),
      contains: vi.fn(() => false),
    },
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    remove: vi.fn(),
    setAttribute: vi.fn(),
    getAttribute: vi.fn(),
    textContent: '',
    ...overrides,
  };
}

/**
 * Creates a mock `document` object with an getElementById dispatch table.
 * @param {Object<string, object>} elementMap - Map of element IDs to mock elements.
 * @param {Array} [querySelectorAllResult] - Result for querySelectorAll calls.
 * @returns {object} Mock document object suitable for vi.stubGlobal('document', ...).
 */
export function createMockDocument(elementMap = {}, querySelectorAllResult = []) {
  return {
    getElementById: vi.fn((id) => elementMap[id] ?? null),
    querySelectorAll: vi.fn(() => querySelectorAllResult),
    addEventListener: vi.fn(),
    createElement: vi.fn(() => createMockElement()),
    body: {
      appendChild: vi.fn(),
      classList: {
        add: vi.fn(),
        remove: vi.fn(),
        contains: vi.fn(() => false),
      },
    },
    fonts: {
      ready: Promise.resolve(),
    },
  };
}
