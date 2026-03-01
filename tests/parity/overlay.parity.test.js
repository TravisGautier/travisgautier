import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const projectRoot = path.resolve(import.meta.dirname, '..', '..');
const src = fs.readFileSync(path.join(projectRoot, 'src', 'ui', 'overlay.js'), 'utf-8');

describe('overlay parity', () => {
  /// Tests checklist items: [9]
  it('parity_overlay_hold_fill', () => {
    expect(src).toContain("(p * 100) + '%'");
  });

  /// Tests checklist items: [9]
  it('parity_overlay_label_toggle', () => {
    // Uses strict greater-than (p > 0.5), not >=
    expect(src).toContain('p > 0.5');
    expect(src).not.toContain('p >= 0.5');
  });

  /// Tests checklist items: [9]
  it('parity_overlay_logo_purple', () => {
    expect(src).toContain("logo.classList.add('purple')");
    expect(src).toContain("logo.classList.remove('purple')");
  });
});
