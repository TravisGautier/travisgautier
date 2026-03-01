import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { createLighting } from '../../src/scene/lighting.js';

const added = [];
const scene = { add: (obj) => added.push(obj) };
const result = createLighting(scene);

describe('lighting parity', () => {
  /// Tests checklist items: [7]
  it('parity_light_ambient', () => {
    const light = added[0];
    expect(light).toBeInstanceOf(THREE.AmbientLight);
    expect(light.color.getHex()).toBe(0xFFF5E6);
    expect(light.intensity).toBe(0.7);
  });

  /// Tests checklist items: [7]
  it('parity_light_hemisphere', () => {
    const light = added[1];
    expect(light).toBeInstanceOf(THREE.HemisphereLight);
    expect(light.color.getHex()).toBe(0x87BADB);
    expect(light.groundColor.getHex()).toBe(0xD4C4A8);
    expect(light.intensity).toBe(0.6);
  });

  /// Tests checklist items: [7]
  it('parity_light_sun', () => {
    const light = added[2];
    expect(light).toBeInstanceOf(THREE.DirectionalLight);
    expect(light.color.getHex()).toBe(0xFFF0D4);
    expect(light.intensity).toBe(1.8);
    expect(light.position.x).toBe(12);
    expect(light.position.y).toBe(20);
    expect(light.position.z).toBe(-10);
    expect(light.castShadow).toBe(true);
    expect(light.shadow.mapSize.width).toBe(2048);
    expect(light.shadow.mapSize.height).toBe(2048);
    expect(light.shadow.camera.left).toBe(-12);
    expect(light.shadow.camera.right).toBe(12);
    expect(light.shadow.camera.top).toBe(12);
    expect(light.shadow.camera.bottom).toBe(-6);
    expect(light.shadow.bias).toBe(-0.001);
  });

  /// Tests checklist items: [7]
  it('parity_light_fill', () => {
    const light = added[3];
    expect(light).toBeInstanceOf(THREE.DirectionalLight);
    expect(light.color.getHex()).toBe(0xC8D8F0);
    expect(light.intensity).toBe(0.4);
    expect(light.position.x).toBe(-8);
    expect(light.position.y).toBe(10);
    expect(light.position.z).toBe(8);
  });

  /// Tests checklist items: [7]
  it('parity_light_gold', () => {
    expect(result.goldLight).toBeInstanceOf(THREE.PointLight);
    expect(result.goldLight.color.getHex()).toBe(0xc9a84c);
    expect(result.goldLight.intensity).toBe(2.5);
    expect(result.goldLight.distance).toBe(12);
    expect(result.goldLight.position.x).toBe(0);
    expect(result.goldLight.position.y).toBe(2.5);
    expect(result.goldLight.position.z).toBe(3);
    expect(result.goldLight.castShadow).toBe(true);
  });

  /// Tests checklist items: [7]
  it('parity_light_purple', () => {
    expect(result.purpleLight).toBeInstanceOf(THREE.PointLight);
    expect(result.purpleLight.color.getHex()).toBe(0x9b6dff);
    expect(result.purpleLight.intensity).toBe(1.5);
    expect(result.purpleLight.distance).toBe(12);
    expect(result.purpleLight.position.x).toBe(0);
    expect(result.purpleLight.position.y).toBe(2.5);
    expect(result.purpleLight.position.z).toBe(-3);
  });

  /// Tests checklist items: [7]
  it('parity_light_pillars', () => {
    expect(result.pillarLight1).toBeInstanceOf(THREE.PointLight);
    expect(result.pillarLight1.color.getHex()).toBe(0xFFE8C4);
    expect(result.pillarLight1.intensity).toBe(0.5);
    expect(result.pillarLight1.distance).toBe(8);
    expect(result.pillarLight1.position.x).toBe(5);
    expect(result.pillarLight1.position.y).toBe(3);
    expect(result.pillarLight1.position.z).toBe(0);

    expect(result.pillarLight2).toBeInstanceOf(THREE.PointLight);
    expect(result.pillarLight2.color.getHex()).toBe(0xFFE8C4);
    expect(result.pillarLight2.intensity).toBe(0.5);
    expect(result.pillarLight2.distance).toBe(8);
    expect(result.pillarLight2.position.x).toBe(-5);
    expect(result.pillarLight2.position.y).toBe(3);
    expect(result.pillarLight2.position.z).toBe(0);
  });

  /// Tests checklist items: [7]
  it('parity_light_ground_glow', () => {
    expect(result.groundGlow).toBeInstanceOf(THREE.PointLight);
    expect(result.groundGlow.color.getHex()).toBe(0xc9a84c);
    expect(result.groundGlow.intensity).toBe(0.8);
    expect(result.groundGlow.distance).toBe(4);
    expect(result.groundGlow.position.x).toBe(0);
    expect(result.groundGlow.position.y).toBe(0.1);
    expect(result.groundGlow.position.z).toBe(0);
  });

  /// Tests checklist items: [7]
  it('parity_light_total_count', () => {
    expect(added.length).toBe(9);
  });
});
