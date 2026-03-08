import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

/// Tests checklist items: [6] — Feature 4.2

describe('animate loop transition wiring', () => {
  /// Tests checklist items: [6] — Feature 4.2
  it('int_transition_animate_wiring', () => {
    const projectRoot = path.resolve(import.meta.dirname, '..');
    const source = fs.readFileSync(path.join(projectRoot, 'src', 'animate.js'), 'utf-8');

    // Verify updateTransition is destructured from deps
    expect(source).toMatch(/updateTransition/);

    // Verify updateTransition is called in the animate function
    expect(source).toMatch(/updateTransition\s*\(\s*state\s*,\s*dt\s*\)/);

    // Verify ordering: updateHoldProgress before updateTransition before updateOverlay
    const holdIdx = source.indexOf('updateHoldProgress(state, dt)');
    const transIdx = source.indexOf('updateTransition(state, dt)');
    const overlayIdx = source.indexOf('updateOverlay(');

    expect(holdIdx).toBeGreaterThan(-1);
    expect(transIdx).toBeGreaterThan(-1);
    expect(overlayIdx).toBeGreaterThan(-1);
    expect(transIdx).toBeGreaterThan(holdIdx);
    expect(transIdx).toBeLessThan(overlayIdx);
  });
});
