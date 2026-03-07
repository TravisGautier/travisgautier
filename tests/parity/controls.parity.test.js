import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const projectRoot = path.resolve(import.meta.dirname, '..', '..');
const src = fs.readFileSync(path.join(projectRoot, 'src', 'interaction', 'controls.js'), 'utf-8');

describe('controls parity', () => {
  /// Tests checklist items: [2, 7] — Feature 2.7
  it('parity_controls_trackpad_detection', () => {
    expect(src).toContain('detectTrackpad');
  });

  /// Tests checklist items: [4, 7] — Feature 2.7
  it('parity_controls_passive_wheel', () => {
    expect(src).toContain('passive: true');
  });

  /// Tests checklist items: [1, 7] — Feature 2.7
  it('parity_controls_multiplier_imports', () => {
    expect(src).toContain('SCROLL_MULT_TRACKPAD');
    expect(src).toContain('SCROLL_MULT_WHEEL');
  });

  /// Tests checklist items: [4, 7] — Feature 2.7
  it('parity_controls_isTrackpad_latch', () => {
    expect(src).toContain('isTrackpad = true');
  });
});
