import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { createSetup } from '../../src/scene/setup.js';
import fs from 'fs';
import path from 'path';

const container = { appendChild: () => {} };
const { scene, camera, renderer } = createSetup(container);
const projectRoot = path.resolve(import.meta.dirname, '..', '..');

describe('setup parity', () => {
  /// Tests checklist items: [3]
  it('parity_setup_camera_fov_near_far', () => {
    expect(camera.fov).toBe(50);
    expect(camera.near).toBe(0.1);
    expect(camera.far).toBe(500);
  });

  /// Tests checklist items: [3]
  it('parity_setup_camera_initial_position', () => {
    expect(camera.position.x).toBeCloseTo(Math.sin(0.25) * 4.2, 5);
    expect(camera.position.y).toBeCloseTo(2.0, 5);
    expect(camera.position.z).toBeCloseTo(Math.cos(0.25) * 4.2, 5);
  });

  /// Tests checklist items: [3]
  it('parity_setup_fog', () => {
    expect(scene.fog).toBeInstanceOf(THREE.FogExp2);
    expect(scene.fog.density).toBe(0.008);
    expect(scene.fog.color.getHex()).toBe(0xC0D4E4);
  });

  /// Tests checklist items: [3]
  it('parity_setup_renderer_config', () => {
    expect(renderer.toneMapping).toBe(THREE.ACESFilmicToneMapping);
    expect(renderer.toneMappingExposure).toBe(1.4);
    expect(renderer.shadowMap.enabled).toBe(true);
    expect(renderer.shadowMap.type).toBe(THREE.PCFSoftShadowMap);
  });

  /// Tests checklist items: [3]
  it('parity_setup_clear_color', () => {
    const src = fs.readFileSync(path.join(projectRoot, 'src', 'scene', 'setup.js'), 'utf-8');
    expect(src).toContain('setClearColor(0x87BADB)');
  });
});
