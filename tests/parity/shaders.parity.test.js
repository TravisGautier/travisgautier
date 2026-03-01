import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const shaderDir = path.resolve('src/shaders');

function readShader(name) {
  return fs.readFileSync(path.join(shaderDir, name), 'utf-8');
}

describe('shader parity', () => {
  /// Tests checklist items: [10]
  it('parity_shader_gold_portal_constants', () => {
    const src = readShader('portalGold.frag');
    // Noise frequencies
    expect(src).toContain('uv.x*3.0');
    expect(src).toContain('uv.y*2.0');
    expect(src).toContain('uTime*0.4');
    expect(src).toContain('uv.x*5.0');
    expect(src).toContain('uv.y*3.0');
    expect(src).toContain('uTime*0.55');
    // Color values
    expect(src).toContain('vec3(0.12,0.08,0.02)');
    expect(src).toContain('vec3(0.65,0.45,0.12)');
    expect(src).toContain('vec3(0.92,0.78,0.42)');
    expect(src).toContain('vec3(1.0,0.95,0.75)');
    // Pulse frequency
    expect(src).toContain('uTime*0.6');
    // Edge glow
    expect(src).toContain('vec3(0.78,0.55,0.15)');
  });

  /// Tests checklist items: [10]
  it('parity_shader_purple_portal_constants', () => {
    const src = readShader('portalPurple.frag');
    // Noise frequencies
    expect(src).toContain('uv.x*2.5');
    expect(src).toContain('uTime*0.18');
    expect(src).toContain('uv.y*3.0');
    expect(src).toContain('uTime*0.35');
    // Color values
    expect(src).toContain('vec3(0.06,0.02,0.14)');
    expect(src).toContain('vec3(0.38,0.18,0.65)');
    expect(src).toContain('vec3(0.62,0.42,0.95)');
    expect(src).toContain('vec3(0.82,0.68,1.0)');
    // Pulse with offset
    expect(src).toContain('uTime*0.5+1.5');
    // Edge glow
    expect(src).toContain('vec3(0.35,0.15,0.6)');
  });

  /// Tests checklist items: [10]
  it('parity_shader_sky_constants', () => {
    const src = readShader('sky.frag');
    // Sun direction
    expect(src).toContain('vec3(0.6, 0.45, -0.5)');
    // Sun glow powers
    expect(src).toContain('pow(sunDot, 48.0) * 2.0');
    expect(src).toContain('pow(sunDot, 6.0) * 0.35');
    // Gold zenith and horizon
    expect(src).toContain('vec3(0.30, 0.52, 0.85)');
    expect(src).toContain('vec3(0.72, 0.82, 0.92)');
    // Purple zenith and horizon
    expect(src).toContain('vec3(0.28, 0.25, 0.65)');
    expect(src).toContain('vec3(0.60, 0.55, 0.78)');
  });

  /// Tests checklist items: [10]
  it('parity_shader_clouds1_constants', () => {
    const src = readShader('clouds1.frag');
    // UV scale
    expect(src).toContain('vUv * 6.0');
    // Noise speeds
    expect(src).toContain('uTime * 0.015');
    expect(src).toContain('uTime * 0.02');
    expect(src).toContain('uTime * 0.01');
    // Density thresholds
    expect(src).toContain('smoothstep(0.28, 0.65, n)');
    // Edge fade
    expect(src).toContain('smoothstep(1.0, 0.3, dist)');
    // Alpha multiplier
    expect(src).toContain('* 0.92');
  });

  /// Tests checklist items: [10]
  it('parity_shader_clouds2_constants', () => {
    const src = readShader('clouds2.frag');
    // UV scale
    expect(src).toContain('vUv * 4.0 + 10.0');
    // Noise speeds
    expect(src).toContain('uTime * 0.01');
    expect(src).toContain('uTime * 0.015');
    // Density thresholds
    expect(src).toContain('smoothstep(0.32, 0.7, n)');
    // Edge fade
    expect(src).toContain('smoothstep(1.0, 0.4, dist)');
    // Alpha multiplier
    expect(src).toContain('* 0.7');
  });

  /// Tests checklist items: [10]
  it('parity_shader_portal_gold_smoothsteps', () => {
    const src = readShader('portalGold.frag');
    expect(src).toContain('smoothstep(-0.4,0.2,n)');
    expect(src).toContain('smoothstep(0.1,0.6,n)');
    expect(src).toContain('smoothstep(0.55,0.9,n)');
    expect(src).toContain('smoothstep(0.0,0.06,uv.x)');
    expect(src).toContain('smoothstep(1.0,0.94,uv.x)');
  });

  /// Tests checklist items: [10]
  it('parity_shader_portal_purple_smoothsteps', () => {
    const src = readShader('portalPurple.frag');
    expect(src).toContain('smoothstep(-0.4,0.2,n)');
    // Differs from gold: 0.15 instead of 0.1
    expect(src).toContain('smoothstep(0.15,0.6,n)');
    // Differs from gold: 0.5,0.85 instead of 0.55,0.9
    expect(src).toContain('smoothstep(0.5,0.85,n)');
  });
});
