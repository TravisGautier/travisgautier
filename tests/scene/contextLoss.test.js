import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const projectRoot = path.resolve(import.meta.dirname, '..', '..');
const setupSrc = fs.readFileSync(path.join(projectRoot, 'src', 'scene', 'setup.js'), 'utf-8');
const animateSrc = fs.readFileSync(path.join(projectRoot, 'src', 'animate.js'), 'utf-8');
const overlaySrc = fs.readFileSync(path.join(projectRoot, 'src', 'ui', 'overlay.js'), 'utf-8');
const mainSrc = fs.readFileSync(path.join(projectRoot, 'src', 'main.js'), 'utf-8');
const cssSrc = fs.readFileSync(path.join(projectRoot, 'styles', 'main.css'), 'utf-8');

describe('context loss parity', () => {
  // --- setup.js context loss listeners ---

  /// Tests checklist items: [4]
  it('parity_setup_contextlost_listener', () => {
    expect(setupSrc).toContain("addEventListener('webglcontextlost'");
  });

  /// Tests checklist items: [4]
  it('parity_setup_preventdefault', () => {
    expect(setupSrc).toContain('e.preventDefault()');
  });

  /// Tests checklist items: [5]
  it('parity_setup_contextrestored_listener', () => {
    expect(setupSrc).toContain("addEventListener('webglcontextrestored'");
  });

  /// Tests checklist items: [4]
  it('parity_setup_oncontextlost_callback', () => {
    expect(setupSrc).toContain('onContextLost');
  });

  /// Tests checklist items: [5]
  it('parity_setup_oncontextrestored_callback', () => {
    expect(setupSrc).toContain('onContextRestored');
  });

  // --- animate.js stop mechanism ---

  /// Tests checklist items: [1]
  it('parity_animate_captures_animationid', () => {
    expect(animateSrc).toContain('animationId = requestAnimationFrame');
  });

  /// Tests checklist items: [1]
  it('parity_animate_cancel_animation', () => {
    expect(animateSrc).toContain('cancelAnimationFrame(animationId)');
  });

  /// Tests checklist items: [1]
  it('parity_animate_returns_stop', () => {
    expect(animateSrc).toMatch(/return\s*\{[\s\S]*stop/);
  });

  // --- overlay.js context lost message ---

  /// Tests checklist items: [2]
  it('parity_overlay_show_export', () => {
    expect(overlaySrc).toContain('export function showContextLostMessage');
  });

  /// Tests checklist items: [3]
  it('parity_overlay_hide_export', () => {
    expect(overlaySrc).toContain('export function hideContextLostMessage');
  });

  /// Tests checklist items: [2]
  it('parity_overlay_context_lost_class', () => {
    expect(overlaySrc).toContain('context-lost-overlay');
  });

  /// Tests checklist items: [2]
  it('parity_overlay_reload', () => {
    expect(overlaySrc).toContain('location.reload()');
  });

  // --- main.js wiring ---

  /// Tests checklist items: [6]
  it('parity_main_imports_context_lost', () => {
    expect(mainSrc).toContain('showContextLostMessage');
  });

  /// Tests checklist items: [6]
  it('parity_main_passes_oncontextlost', () => {
    expect(mainSrc).toContain('onContextLost');
  });

  /// Tests checklist items: [6]
  it('parity_main_captures_animloop', () => {
    expect(mainSrc).toMatch(/animLoop\s*=\s*startAnimateLoop/);
  });

  /// Tests checklist items: [6]
  it('parity_main_stops_animloop', () => {
    expect(mainSrc).toContain('animLoop.stop()');
  });

  // --- CSS context-lost overlay ---

  /// Tests checklist items: [7]
  it('parity_css_context_lost_overlay', () => {
    expect(cssSrc).toContain('.context-lost-overlay');
    expect(cssSrc).toContain('.context-lost-btn');

    // z-index must be > 100 to sit above all other overlays
    const zIndexMatch = cssSrc.match(/\.context-lost-overlay\s*\{[^}]*z-index:\s*(\d+)/s);
    expect(zIndexMatch).not.toBeNull();
    expect(Number(zIndexMatch[1])).toBeGreaterThan(100);
  });
});
