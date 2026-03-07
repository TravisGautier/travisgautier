import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const projectRoot = path.resolve(import.meta.dirname, '..', '..');
const fpsMonitorSrc = fs.readFileSync(path.join(projectRoot, 'src', 'interaction', 'fpsMonitor.js'), 'utf-8');
const animateSrc = fs.readFileSync(path.join(projectRoot, 'src', 'animate.js'), 'utf-8');
const mainSrc = fs.readFileSync(path.join(projectRoot, 'src', 'main.js'), 'utf-8');

describe('fpsMonitor parity', () => {
  /// Tests checklist items: [1, 2]
  it('parity_fpsMonitor_uses_constants', () => {
    expect(fpsMonitorSrc).toContain('FPS_SAMPLE_COUNT');
    expect(fpsMonitorSrc).toContain('FPS_THRESHOLD');
  });

  /// Tests checklist items: [1, 8]
  it('parity_fpsMonitor_settled_guard', () => {
    expect(fpsMonitorSrc).toContain('if (settled) return');
  });

  /// Tests checklist items: [1]
  it('parity_fpsMonitor_average_computation', () => {
    expect(fpsMonitorSrc).toContain('samples.reduce');
  });

  /// Tests checklist items: [3]
  it('parity_animate_calls_sampleFPS', () => {
    expect(animateSrc).toContain('sampleFPS');
  });

  /// Tests checklist items: [5]
  it('parity_main_downgrade_knobs', () => {
    expect(mainSrc).toContain('applyRuntimeDowngrade');
  });

  /// Tests checklist items: [5, 8]
  it('parity_main_no_structural_changes', () => {
    // applyRuntimeDowngrade should NOT modify structural properties
    expect(fpsMonitorSrc).not.toContain('pillarCount');
    expect(fpsMonitorSrc).not.toContain('pillarFluting');
  });
});
