import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { createPortal } from '../../src/scene/portal.js';

const added = [];
const scene = { add: (obj) => added.push(obj) };
const result = createPortal(scene);
const group = result.portalGroup;

describe('portal parity', () => {
  /// Tests checklist items: [6]
  it('parity_portal_frame_material', () => {
    // First child (gate pillar) uses frameMat
    const frameMat = group.children[0].material;
    expect(frameMat.color.getHex()).toBe(0x1a1a1e);
    expect(frameMat.metalness).toBe(0.85);
    expect(frameMat.roughness).toBe(0.2);
    expect(frameMat.emissive.getHex()).toBe(0x080808);
    expect(frameMat.emissiveIntensity).toBe(0.1);
  });

  /// Tests checklist items: [6]
  it('parity_portal_edge_material', () => {
    expect(result.edgeMat.color.getHex()).toBe(0xc9a84c);
    expect(result.edgeMat.metalness).toBe(0.95);
    expect(result.edgeMat.roughness).toBe(0.12);
    expect(result.edgeMat.emissive.getHex()).toBe(0xc9a84c);
    expect(result.edgeMat.emissiveIntensity).toBe(0.1);
  });

  /// Tests checklist items: [6]
  it('parity_portal_group_position', () => {
    expect(group.position.y).toBe(1.0);
  });

  /// Tests checklist items: [6]
  it('parity_portal_group_children', () => {
    // 2 gate pillars × 2 parts + kasagi + cap + nuki + botBar + 5 trim + surfA + surfB = 15
    expect(group.children.length).toBe(15);
  });

  /// Tests checklist items: [6]
  it('parity_portal_surface_a_gold', () => {
    // surfA is at index 13 (after 4 pillar parts + 4 frame + 5 trim)
    const surfA = group.children[13];
    expect(surfA.position.z).toBe(0.001);
    expect(surfA.material.side).toBe(THREE.FrontSide);
    expect(surfA.material.transparent).toBe(true);
    expect(surfA.material.depthWrite).toBe(false);
    expect(surfA.material.uniforms).toHaveProperty('uTime');
    expect(surfA.material.uniforms).toHaveProperty('uMouse');
    expect(surfA.material.uniforms).toHaveProperty('uHover');
    expect(surfA.material.uniforms.uMouse.value).toBeInstanceOf(THREE.Vector2);
  });

  /// Tests checklist items: [6]
  it('parity_portal_surface_b_purple', () => {
    // surfB is at index 14
    const surfB = group.children[14];
    expect(surfB.position.z).toBe(-0.001);
    expect(surfB.rotation.y).toBeCloseTo(Math.PI, 5);
    expect(surfB.material.uniforms).toHaveProperty('uTime');
    expect(surfB.material.uniforms).toHaveProperty('uMouse');
    expect(surfB.material.uniforms).toHaveProperty('uHover');
  });

  /// Tests checklist items: [6]
  it('parity_portal_surface_geometry', () => {
    // W=1.1, H=1.5 → PlaneGeometry(W*2=2.2, H*2=3.0)
    const surfA = group.children[13];
    const surfB = group.children[14];
    expect(surfA.geometry.parameters.width).toBeCloseTo(2.2, 5);
    expect(surfA.geometry.parameters.height).toBeCloseTo(3.0, 5);
    expect(surfB.geometry.parameters.width).toBeCloseTo(2.2, 5);
    expect(surfB.geometry.parameters.height).toBeCloseTo(3.0, 5);
  });
});
