import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { createEnvironment } from '../../src/scene/environment.js';

const added = [];
const scene = { add: (obj) => added.push(obj) };
const result = createEnvironment(scene);

describe('environment parity', () => {
  /// Tests checklist items: [4]
  it('parity_env_sky_dome_geometry', () => {
    const sky = added[0];
    expect(sky).toBeInstanceOf(THREE.Mesh);
    expect(sky.geometry.parameters.radius).toBe(200);
    expect(sky.geometry.parameters.widthSegments).toBe(64);
    expect(sky.geometry.parameters.heightSegments).toBe(32);
    expect(sky.material.side).toBe(THREE.BackSide);
    expect(sky.material.depthWrite).toBe(false);
  });

  /// Tests checklist items: [4]
  it('parity_env_sky_dome_uniforms', () => {
    expect(result.skyMat.uniforms.uHold.value).toBe(0);
    expect(result.skyMat.uniforms.uTime.value).toBe(0);
  });

  /// Tests checklist items: [4]
  it('parity_env_cloud_layer1', () => {
    const cloud = added[1];
    expect(cloud).toBeInstanceOf(THREE.Mesh);
    expect(cloud.geometry.parameters.width).toBe(300);
    expect(cloud.geometry.parameters.height).toBe(300);
    expect(cloud.position.y).toBe(-3.5);
    expect(cloud.rotation.x).toBeCloseTo(-Math.PI / 2, 5);
    expect(cloud.material.transparent).toBe(true);
    expect(cloud.material.depthWrite).toBe(false);
  });

  /// Tests checklist items: [4]
  it('parity_env_cloud_layer2', () => {
    const cloud2 = added[2];
    expect(cloud2.position.y).toBe(-5.5);
    expect(cloud2.rotation.x).toBeCloseTo(-Math.PI / 2, 5);
    // Cloned geometry has same vertex count as the 300x300 original
    const origCloud = added[1];
    expect(cloud2.geometry.attributes.position.count)
      .toBe(origCloud.geometry.attributes.position.count);
  });

  /// Tests checklist items: [4]
  it('parity_env_mountain_count_positions', () => {
    const mountains = added.slice(3, 8);
    expect(mountains.length).toBe(5);

    const expected = [
      { p: [-35, -12, -50], s: [1.2, 0.8, 1.4] },
      { p: [40, -14, -55], s: [1.5, 0.9, 1.2] },
      { p: [8, -15, -65], s: [2.0, 1.1, 1.5] },
      { p: [-20, -13, -60], s: [1.1, 0.7, 1.3] },
      { p: [55, -16, -70], s: [1.8, 1.0, 1.6] },
    ];
    for (let i = 0; i < 5; i++) {
      expect(mountains[i].position.x).toBe(expected[i].p[0]);
      expect(mountains[i].position.y).toBe(expected[i].p[1]);
      expect(mountains[i].position.z).toBe(expected[i].p[2]);
      expect(mountains[i].scale.x).toBe(expected[i].s[0]);
      expect(mountains[i].scale.y).toBe(expected[i].s[1]);
      expect(mountains[i].scale.z).toBe(expected[i].s[2]);
    }
  });

  /// Tests checklist items: [4]
  it('parity_env_mountain_material', () => {
    const mt = added[3];
    expect(mt.material.color.getHex()).toBe(0x8090A4);
    expect(mt.material.roughness).toBe(0.85);
    expect(mt.material.metalness).toBe(0.0);
  });

  /// Tests checklist items: [4]
  it('parity_env_mountain_geometry', () => {
    const mt = added[3];
    expect(mt.geometry.parameters.radius).toBe(18);
    expect(mt.geometry.parameters.height).toBe(14);
    expect(mt.geometry.parameters.radialSegments).toBe(6);
  });

  /// Tests checklist items: [4]
  it('parity_env_snow_caps', () => {
    const snowCaps = added.slice(8, 11);
    expect(snowCaps.length).toBe(3);
    for (const cap of snowCaps) {
      expect(cap.geometry.parameters.radius).toBe(6);
      expect(cap.geometry.parameters.height).toBe(3);
      expect(cap.geometry.parameters.radialSegments).toBe(6);
      expect(cap.material.color.getHex()).toBe(0xE8E4E0);
      expect(cap.material.roughness).toBe(0.6);
    }
  });

  /// Tests checklist items: [4]
  it('parity_env_particle_count_speeds', () => {
    expect(result.particleSpeeds.length).toBe(200);
    for (const speed of result.particleSpeeds) {
      expect(speed).toBeGreaterThanOrEqual(0.002);
      expect(speed).toBeLessThanOrEqual(0.008);
    }
  });

  /// Tests checklist items: [4]
  it('parity_env_particle_material', () => {
    expect(result.particleMat.color.getHex()).toBe(0xFFF8E0);
    expect(result.particleMat.size).toBe(0.035);
    expect(result.particleMat.opacity).toBe(0.5);
    expect(result.particleMat.transparent).toBe(true);
    expect(result.particleMat.depthWrite).toBe(false);
  });
});
