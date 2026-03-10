import { describe, it, expect } from 'vitest';
import {
  createMockScene,
  createMockContainer,
  createMockRenderer,
  createMockRaycaster,
  createMockCamera,
  createMockClock,
  createMockElement,
  createMockDocument,
} from './three-mocks.js';
import {
  createMockState,
  createMockQualityConfig,
  TIER_CONFIGS,
} from './fixtures.js';
import { state as realState } from '../../src/interaction/state.js';

// --- Three.js Mocks ---

describe('createMockScene', () => {
  it('unit_mockScene_returns_scene_with_add_spy', () => {
    const { scene } = createMockScene();
    expect(typeof scene.add).toBe('function');
    expect(scene.add).toBeDefined();
  });

  it('unit_mockScene_tracks_added_objects', () => {
    const { scene, added } = createMockScene();
    const obj1 = { name: 'mesh1' };
    const obj2 = { name: 'mesh2' };
    scene.add(obj1);
    scene.add(obj2);
    expect(added).toHaveLength(2);
    expect(added[0]).toBe(obj1);
    expect(added[1]).toBe(obj2);
  });

  it('unit_mockScene_has_traverse', () => {
    const { scene } = createMockScene();
    expect(typeof scene.traverse).toBe('function');
  });
});

describe('createMockContainer', () => {
  it('unit_mockContainer_returns_container_with_appendChild_spy', () => {
    const { container } = createMockContainer();
    expect(typeof container.appendChild).toBe('function');
  });

  it('unit_mockContainer_tracks_appended_children', () => {
    const { container, appendedChildren } = createMockContainer();
    const child = { tagName: 'CANVAS' };
    container.appendChild(child);
    expect(appendedChildren).toHaveLength(1);
    expect(appendedChildren[0]).toBe(child);
  });
});

describe('createMockRenderer', () => {
  it('unit_mockRenderer_has_all_expected_properties', () => {
    const renderer = createMockRenderer();
    expect(renderer).toHaveProperty('domElement');
    expect(renderer).toHaveProperty('setSize');
    expect(renderer).toHaveProperty('setPixelRatio');
    expect(renderer).toHaveProperty('getPixelRatio');
    expect(renderer).toHaveProperty('render');
    expect(renderer).toHaveProperty('dispose');
    expect(renderer).toHaveProperty('shadowMap');
    expect(renderer).toHaveProperty('toneMapping');
    expect(renderer).toHaveProperty('toneMappingExposure');
  });

  it('unit_mockRenderer_accepts_overrides', () => {
    const renderer = createMockRenderer({ pixelRatio: 2, shadowsEnabled: false });
    expect(renderer.getPixelRatio()).toBe(2);
    expect(renderer.shadowMap.enabled).toBe(false);
  });

  it('unit_mockRenderer_domElement_has_event_spies', () => {
    const renderer = createMockRenderer();
    expect(typeof renderer.domElement.addEventListener).toBe('function');
    expect(typeof renderer.domElement.setAttribute).toBe('function');
  });
});

describe('createMockRaycaster', () => {
  it('unit_mockRaycaster_has_spied_methods', () => {
    const raycaster = createMockRaycaster();
    expect(typeof raycaster.setFromCamera).toBe('function');
    expect(typeof raycaster.intersectObjects).toBe('function');
  });

  it('unit_mockRaycaster_returns_provided_intersections', () => {
    const hits = [{ object: { name: 'portal' } }];
    const raycaster = createMockRaycaster(hits);
    expect(raycaster.intersectObjects()).toBe(hits);
  });

  it('unit_mockRaycaster_defaults_to_empty', () => {
    const raycaster = createMockRaycaster();
    expect(raycaster.intersectObjects()).toEqual([]);
  });
});

describe('createMockCamera', () => {
  it('unit_mockCamera_has_expected_properties', () => {
    const camera = createMockCamera();
    expect(camera).toHaveProperty('position');
    expect(camera).toHaveProperty('lookAt');
    expect(camera).toHaveProperty('fov', 50);
    expect(camera).toHaveProperty('aspect');
    expect(typeof camera.updateProjectionMatrix).toBe('function');
  });
});

describe('createMockClock', () => {
  it('unit_mockClock_getDelta_returns_fixed_delta', () => {
    const clock = createMockClock(0.033);
    expect(clock.getDelta()).toBe(0.033);
  });

  it('unit_mockClock_defaults_to_0016', () => {
    const clock = createMockClock();
    expect(clock.getDelta()).toBeCloseTo(0.016);
  });

  it('unit_mockClock_has_start_stop', () => {
    const clock = createMockClock();
    expect(typeof clock.start).toBe('function');
    expect(typeof clock.stop).toBe('function');
  });
});

describe('createMockElement', () => {
  it('unit_mockElement_has_style_classList_listeners', () => {
    const el = createMockElement();
    expect(el).toHaveProperty('style');
    expect(el).toHaveProperty('classList');
    expect(typeof el.addEventListener).toBe('function');
    expect(typeof el.removeEventListener).toBe('function');
  });

  it('unit_mockElement_classList_spies_work', () => {
    const el = createMockElement();
    el.classList.add('active');
    expect(el.classList.add).toHaveBeenCalledWith('active');
    expect(el.classList.contains()).toBe(false);
  });

  it('unit_mockElement_accepts_overrides', () => {
    const el = createMockElement({ id: 'cursor', textContent: 'hello' });
    expect(el.id).toBe('cursor');
    expect(el.textContent).toBe('hello');
  });
});

describe('createMockDocument', () => {
  it('unit_mockDocument_getElementById_dispatches_from_map', () => {
    const logo = { id: 'logo' };
    const doc = createMockDocument({ logo });
    expect(doc.getElementById('logo')).toBe(logo);
  });

  it('unit_mockDocument_getElementById_returns_null_for_unknown', () => {
    const doc = createMockDocument({});
    expect(doc.getElementById('nonexistent')).toBeNull();
  });

  it('unit_mockDocument_querySelectorAll_returns_provided_result', () => {
    const items = [{ id: 'a' }, { id: 'b' }];
    const doc = createMockDocument({}, items);
    expect(doc.querySelectorAll('.item')).toBe(items);
  });

  it('unit_mockDocument_body_has_classList', () => {
    const doc = createMockDocument();
    expect(typeof doc.body.classList.add).toBe('function');
    expect(typeof doc.body.classList.remove).toBe('function');
  });
});

// --- Fixtures ---

describe('createMockState', () => {
  it('unit_mockState_matches_real_state_keys', () => {
    const mock = createMockState();
    const realKeys = Object.keys(realState).sort();
    const mockKeys = Object.keys(mock).sort();
    expect(mockKeys).toEqual(realKeys);
  });

  it('unit_mockState_matches_real_state_defaults', () => {
    const mock = createMockState();
    expect(mock).toEqual(realState);
  });

  it('unit_mockState_accepts_top_level_overrides', () => {
    const mock = createMockState({ holdProgress: 0.5, dragging: true });
    expect(mock.holdProgress).toBe(0.5);
    expect(mock.dragging).toBe(true);
    expect(mock.scroll).toBe(0);
  });

  it('unit_mockState_accepts_nested_mouse_overrides', () => {
    const mock = createMockState({ mouse: { x: 100 } });
    expect(mock.mouse.x).toBe(100);
    expect(mock.mouse.y).toBe(0);
    expect(mock.mouse.nx).toBe(0);
    expect(mock.mouse.ny).toBe(0);
  });

  it('unit_mockState_returns_fresh_objects', () => {
    const a = createMockState();
    const b = createMockState();
    expect(a).not.toBe(b);
    expect(a.mouse).not.toBe(b.mouse);
    a.holdProgress = 1;
    expect(b.holdProgress).toBe(0);
  });
});

describe('createMockQualityConfig', () => {
  const REQUIRED_KEYS = [
    'tier', 'pixelRatio', 'shadowMapSize', 'shadowsEnabled',
    'particleCount', 'pillarCount', 'pillarFluting', 'cloudLayers',
    'skyCloudNoise', 'useGyroscope', 'freezeShaderTime', 'disableParticles',
    'disablePortalBob', 'instantCameraTransition',
  ];

  it('unit_mockQualityConfig_returns_tier3_with_all_keys', () => {
    const config = createMockQualityConfig();
    expect(config.tier).toBe(3);
    for (const key of REQUIRED_KEYS) {
      expect(config).toHaveProperty(key);
    }
  });

  it('unit_mockQualityConfig_accepts_overrides', () => {
    const config = createMockQualityConfig({ tier: 1, shadowsEnabled: false });
    expect(config.tier).toBe(1);
    expect(config.shadowsEnabled).toBe(false);
    expect(config.pillarCount).toBe(12);
  });

  it('unit_mockQualityConfig_returns_fresh_objects', () => {
    const a = createMockQualityConfig();
    const b = createMockQualityConfig();
    expect(a).not.toBe(b);
    a.tier = 0;
    expect(b.tier).toBe(3);
  });
});

describe('TIER_CONFIGS', () => {
  const REQUIRED_KEYS = [
    'tier', 'pixelRatio', 'shadowMapSize', 'shadowsEnabled',
    'particleCount', 'pillarCount', 'pillarFluting', 'cloudLayers',
    'skyCloudNoise', 'useGyroscope', 'freezeShaderTime', 'disableParticles',
    'disablePortalBob', 'instantCameraTransition',
  ];

  it('unit_tierConfigs_has_all_four_tiers', () => {
    expect(TIER_CONFIGS).toHaveProperty('tier0');
    expect(TIER_CONFIGS).toHaveProperty('tier1');
    expect(TIER_CONFIGS).toHaveProperty('tier2');
    expect(TIER_CONFIGS).toHaveProperty('tier3');
  });

  it('unit_tierConfigs_all_have_required_keys', () => {
    for (const [name, config] of Object.entries(TIER_CONFIGS)) {
      for (const key of REQUIRED_KEYS) {
        expect(config, `${name} missing ${key}`).toHaveProperty(key);
      }
    }
  });

  it('unit_tierConfigs_tier_values_match', () => {
    expect(TIER_CONFIGS.tier0.tier).toBe(0);
    expect(TIER_CONFIGS.tier1.tier).toBe(1);
    expect(TIER_CONFIGS.tier2.tier).toBe(2);
    expect(TIER_CONFIGS.tier3.tier).toBe(3);
  });

  it('unit_tierConfigs_tier0_has_minimal_features', () => {
    const t0 = TIER_CONFIGS.tier0;
    expect(t0.pixelRatio).toBe(1);
    expect(t0.shadowsEnabled).toBe(false);
    expect(t0.particleCount).toBe(0);
    expect(t0.pillarCount).toBe(6);
    expect(t0.cloudLayers).toBe(0);
  });

  it('unit_tierConfigs_tier3_has_max_features', () => {
    const t3 = TIER_CONFIGS.tier3;
    expect(t3.pixelRatio).toBe(2);
    expect(t3.shadowsEnabled).toBe(true);
    expect(t3.particleCount).toBe(200);
    expect(t3.pillarCount).toBe(12);
    expect(t3.pillarFluting).toBe(true);
    expect(t3.cloudLayers).toBe(2);
  });
});
