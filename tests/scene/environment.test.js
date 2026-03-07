import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import fs from 'fs';
import path from 'path';
import { createEnvironment } from '../../src/scene/environment.js';

function runEnvironment(config) {
  const added = [];
  const scene = { add: (obj) => added.push(obj) };
  const result = createEnvironment(scene, config);
  return { added, result };
}

describe('environment config wiring', () => {
  describe('integration', () => {
    /// Tests checklist items: [1] — Feature 3.3
    it('int_env_export_unchanged', () => {
      expect(typeof createEnvironment).toBe('function');
    });

    /// Tests checklist items: [1] — Feature 3.3
    it('int_env_accepts_config', () => {
      const scene = { add: () => {} };
      expect(() => createEnvironment(scene, { cloudLayers: 1, particleCount: 50, skyCloudNoise: false })).not.toThrow();
    });

    /// Tests checklist items: [5] — Feature 3.3
    it('int_env_return_shape_consistent', () => {
      const configs = [
        undefined,
        { cloudLayers: 2, particleCount: 200, skyCloudNoise: true },
        { cloudLayers: 1, particleCount: 100, skyCloudNoise: true },
        { cloudLayers: 0, particleCount: 0, skyCloudNoise: false },
      ];
      for (const cfg of configs) {
        const { result } = runEnvironment(cfg);
        expect(result).toHaveProperty('skyMat');
        expect(result).toHaveProperty('cloudSeaMat');
        expect(result).toHaveProperty('cloudSea2');
        expect(result).toHaveProperty('particles');
        expect(result).toHaveProperty('particleSpeeds');
        expect(result).toHaveProperty('particleMat');
        expect(result.skyMat).toBeInstanceOf(THREE.ShaderMaterial);
        expect(result.particles).toBeInstanceOf(THREE.Points);
        expect(result.particleMat).toBeInstanceOf(THREE.PointsMaterial);
      }
    });
  });

  describe('default (no config)', () => {
    /// Tests checklist items: [1, 2, 3, 4, 5] — Feature 3.3
    it('unit_env_default_no_config', () => {
      const { result } = runEnvironment();
      expect(result.particleSpeeds).toHaveLength(200);
      expect(result.cloudSeaMat).not.toBeNull();
      expect(result.cloudSeaMat.uniforms).toHaveProperty('uTime');
      expect(result.cloudSeaMat.uniforms).toHaveProperty('uHold');
      expect(result.cloudSea2).not.toBeNull();
      expect(result.skyMat.uniforms).toHaveProperty('uSkyCloudNoise');
      expect(result.skyMat.uniforms.uSkyCloudNoise.value).toBe(1.0);
    });
  });

  describe('tier configs', () => {
    /// Tests checklist items: [2, 3, 4] — Feature 3.3
    it('unit_env_tier3_config', () => {
      const { result } = runEnvironment({ cloudLayers: 2, particleCount: 200, skyCloudNoise: true });
      expect(result.particleSpeeds).toHaveLength(200);
      expect(result.cloudSeaMat).not.toBeNull();
      expect(result.cloudSea2).not.toBeNull();
      expect(result.skyMat.uniforms.uSkyCloudNoise.value).toBe(1.0);
    });

    /// Tests checklist items: [2, 3, 4] — Feature 3.3
    it('unit_env_tier2_config', () => {
      const { result } = runEnvironment({ cloudLayers: 1, particleCount: 100, skyCloudNoise: true });
      expect(result.particleSpeeds).toHaveLength(100);
      expect(result.cloudSeaMat).not.toBeNull();
      expect(result.cloudSea2).toBeNull();
      expect(result.skyMat.uniforms.uSkyCloudNoise.value).toBe(1.0);
    });

    /// Tests checklist items: [2, 3, 4] — Feature 3.3
    it('unit_env_tier1_config', () => {
      const { result } = runEnvironment({ cloudLayers: 1, particleCount: 50, skyCloudNoise: false });
      expect(result.particleSpeeds).toHaveLength(50);
      expect(result.cloudSeaMat).not.toBeNull();
      expect(result.cloudSea2).toBeNull();
      expect(result.skyMat.uniforms.uSkyCloudNoise.value).toBe(0.0);
    });

    /// Tests checklist items: [2, 3, 4, 5] — Feature 3.3
    it('unit_env_tier0_config', () => {
      const { result } = runEnvironment({ cloudLayers: 0, particleCount: 0, skyCloudNoise: false });
      expect(result.particleSpeeds).toHaveLength(0);
      expect(result.cloudSeaMat).toBeNull();
      expect(result.cloudSea2).toBeNull();
      expect(result.skyMat.uniforms.uSkyCloudNoise.value).toBe(0.0);
      expect(result.particles.geometry.attributes.position.count).toBe(0);
    });

    /// Tests checklist items: [3] — Feature 3.3
    it('unit_env_particle_speeds_match_count', () => {
      for (const count of [0, 50, 100, 200]) {
        const { result } = runEnvironment({ cloudLayers: 2, particleCount: count, skyCloudNoise: true });
        expect(result.particleSpeeds).toHaveLength(count);
        for (const speed of result.particleSpeeds) {
          expect(speed).toBeGreaterThanOrEqual(0.002);
          expect(speed).toBeLessThanOrEqual(0.008);
        }
      }
    });
  });

  describe('invariants', () => {
    /// Tests checklist items: [2, 3] — Feature 3.3
    it('unit_env_mountains_snow_unchanged', () => {
      const { added: defaultAdded } = runEnvironment();
      const { added: tier0Added } = runEnvironment({ cloudLayers: 0, particleCount: 0, skyCloudNoise: false });

      // Default: sky(1) + 2 clouds + 5 mountains + 3 snow + particles = 12
      // Tier 0:  sky(1) + 0 clouds + 5 mountains + 3 snow + particles = 10
      const defaultMountains = defaultAdded.slice(3, 8);
      const tier0Mountains = tier0Added.slice(1, 6);

      expect(defaultMountains).toHaveLength(5);
      expect(tier0Mountains).toHaveLength(5);

      for (let i = 0; i < 5; i++) {
        expect(tier0Mountains[i].position.x).toBe(defaultMountains[i].position.x);
        expect(tier0Mountains[i].position.y).toBe(defaultMountains[i].position.y);
        expect(tier0Mountains[i].position.z).toBe(defaultMountains[i].position.z);
      }

      const defaultSnow = defaultAdded.slice(8, 11);
      const tier0Snow = tier0Added.slice(6, 9);

      expect(defaultSnow).toHaveLength(3);
      expect(tier0Snow).toHaveLength(3);

      for (let i = 0; i < 3; i++) {
        expect(tier0Snow[i].position.x).toBe(defaultSnow[i].position.x);
        expect(tier0Snow[i].position.y).toBe(defaultSnow[i].position.y);
        expect(tier0Snow[i].position.z).toBe(defaultSnow[i].position.z);
      }
    });

    /// Tests checklist items: [1, 4] — Feature 3.3
    it('unit_env_sky_dome_always_present', () => {
      const configs = [
        undefined,
        { cloudLayers: 2, particleCount: 200, skyCloudNoise: true },
        { cloudLayers: 0, particleCount: 0, skyCloudNoise: false },
      ];
      for (const cfg of configs) {
        const { added, result } = runEnvironment(cfg);
        const sky = added[0];
        expect(sky).toBeInstanceOf(THREE.Mesh);
        expect(sky.geometry.parameters.radius).toBe(200);
        expect(sky.geometry.parameters.widthSegments).toBe(64);
        expect(sky.geometry.parameters.heightSegments).toBe(32);
        expect(sky.material.side).toBe(THREE.BackSide);
        expect(sky.material.depthWrite).toBe(false);
        expect(result.skyMat.uniforms).toHaveProperty('uHold');
        expect(result.skyMat.uniforms).toHaveProperty('uTime');
        expect(result.skyMat.uniforms).toHaveProperty('uSkyCloudNoise');
      }
    });
  });

  describe('shader', () => {
    const skyFragPath = path.resolve('src/shaders/sky.frag');

    /// Tests checklist items: [4] — Feature 3.3
    it('shader_sky_cloud_noise_uniform', () => {
      const content = fs.readFileSync(skyFragPath, 'utf-8');
      expect(content).toContain('uniform float uSkyCloudNoise');
    });

    /// Tests checklist items: [4] — Feature 3.3
    it('shader_sky_cloud_noise_conditional', () => {
      const content = fs.readFileSync(skyFragPath, 'utf-8');
      expect(content).toMatch(/uSkyCloudNoise\s*[>*]/);
    });
  });
});
