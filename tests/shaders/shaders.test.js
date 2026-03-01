import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const shaderDir = path.resolve('src/shaders');

describe('shader files', () => {
  /// Tests checklist items: [1, 2, 3, 4, 5, 6, 7, 8]
  it('unit_shader_files_exist', () => {
    const expectedFiles = [
      'noise.glsl',
      'portal.vert',
      'sky.vert',
      'portalGold.frag',
      'portalPurple.frag',
      'sky.frag',
      'clouds1.frag',
      'clouds2.frag',
    ];
    for (const file of expectedFiles) {
      expect(fs.existsSync(path.join(shaderDir, file))).toBe(true);
    }
  });

  /// Tests checklist items: [1]
  it('unit_noise_contains_snoise', () => {
    const content = fs.readFileSync(path.join(shaderDir, 'noise.glsl'), 'utf-8');
    expect(content).toMatch(/float\s+snoise\s*\(\s*vec2/);
    expect(content).toContain('mod289');
    expect(content).toContain('permute');
  });

  /// Tests checklist items: [4, 5, 6, 7, 8]
  it('unit_frag_shaders_include_noise', () => {
    const fragFiles = [
      'portalGold.frag',
      'portalPurple.frag',
      'sky.frag',
      'clouds1.frag',
      'clouds2.frag',
    ];
    for (const file of fragFiles) {
      const content = fs.readFileSync(path.join(shaderDir, file), 'utf-8');
      expect(content).toContain('#include');
      expect(content).toMatch(/noise\.glsl/);
    }
  });

  /// Tests checklist items: [4, 5]
  it('unit_portal_frags_declare_uniforms', () => {
    for (const file of ['portalGold.frag', 'portalPurple.frag']) {
      const content = fs.readFileSync(path.join(shaderDir, file), 'utf-8');
      expect(content).toContain('uniform float uTime');
      expect(content).toContain('uniform vec2 uMouse');
      expect(content).toContain('uniform float uHover');
    }
  });

  /// Tests checklist items: [6]
  it('unit_sky_frag_declares_uniforms', () => {
    const content = fs.readFileSync(path.join(shaderDir, 'sky.frag'), 'utf-8');
    expect(content).toContain('uniform float uHold');
    expect(content).toContain('uniform float uTime');
  });

  /// Tests checklist items: [7, 8]
  it('unit_cloud_frags_declare_uniforms', () => {
    for (const file of ['clouds1.frag', 'clouds2.frag']) {
      const content = fs.readFileSync(path.join(shaderDir, file), 'utf-8');
      expect(content).toContain('uniform float uTime');
      expect(content).toContain('uniform float uHold');
    }
  });

  /// Tests checklist items: [2]
  it('unit_portal_vert_declares_vUv', () => {
    const content = fs.readFileSync(path.join(shaderDir, 'portal.vert'), 'utf-8');
    expect(content).toContain('varying vec2 vUv');
  });

  /// Tests checklist items: [3]
  it('unit_sky_vert_declares_varyings', () => {
    const content = fs.readFileSync(path.join(shaderDir, 'sky.vert'), 'utf-8');
    expect(content).toContain('varying vec3 vPos');
    expect(content).toContain('varying vec2 vUv');
  });

  /// Tests checklist items: [9]
  it('unit_no_inline_glsl_portal', () => {
    const content = fs.readFileSync(path.resolve('src/scene/portal.js'), 'utf-8');
    expect(content).not.toContain('noiseGLSL');
    expect(content).not.toContain('gl_Position');
    expect(content).not.toContain('gl_FragColor');
  });

  /// Tests checklist items: [10]
  it('unit_no_inline_glsl_environment', () => {
    const content = fs.readFileSync(path.resolve('src/scene/environment.js'), 'utf-8');
    expect(content).not.toContain('noiseGLSL');
    expect(content).not.toContain('gl_Position');
    expect(content).not.toContain('gl_FragColor');
  });
});
