import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const html = fs.readFileSync(path.resolve('index.html'), 'utf-8');

/// Tests checklist items: [1, 2, 3, 4] — Feature 6.2

describe('ARIA attributes — Feature 6.2', () => {
  /// Tests checklist items: [1] — Feature 6.2
  it('a11y_canvas_container_role', () => {
    // Extract the canvas-container element tag
    const match = html.match(/<div[^>]*id=["']canvas-container["'][^>]*>/);
    expect(match).not.toBeNull();
    const tag = match[0];

    // Must have role="img"
    expect(tag).toContain('role="img"');

    // Must have aria-label with descriptive text
    expect(tag).toMatch(/aria-label="[^"]*Interactive 3D scene[^"]*"/);
  });

  /// Tests checklist items: [2] — Feature 6.2
  it('a11y_decorative_hidden', () => {
    // Cursor element must have aria-hidden="true"
    const cursorMatch = html.match(/<div[^>]*id=["']cursor["'][^>]*>/);
    expect(cursorMatch).not.toBeNull();
    expect(cursorMatch[0]).toContain('aria-hidden="true"');

    // Cursor trail element must have aria-hidden="true"
    const trailMatch = html.match(/<div[^>]*id=["']cursorTrail["'][^>]*>/);
    expect(trailMatch).not.toBeNull();
    expect(trailMatch[0]).toContain('aria-hidden="true"');
  });

  /// Tests checklist items: [3] — Feature 6.2
  it('a11y_loading_hidden', () => {
    // Loading overlay must have aria-hidden="true"
    const match = html.match(/<div[^>]*id=["']loading["'][^>]*>/);
    expect(match).not.toBeNull();
    expect(match[0]).toContain('aria-hidden="true"');
  });

  /// Tests checklist items: [2] — Feature 6.2
  it('a11y_label_num_hidden', () => {
    // All label-num spans must have aria-hidden="true"
    const matches = html.match(/<span[^>]*class=["']label-num["'][^>]*>/g);
    expect(matches).not.toBeNull();
    expect(matches.length).toBeGreaterThanOrEqual(2);
    for (const tag of matches) {
      expect(tag).toContain('aria-hidden="true"');
    }
  });

  /// Tests checklist items: [4] — Feature 6.2
  it('a11y_live_region_exists', () => {
    // Venture announcer element must exist
    const match = html.match(/<div[^>]*id=["']venture-announcer["'][^>]*>/);
    expect(match).not.toBeNull();
    const tag = match[0];

    // Must have aria-live="polite"
    expect(tag).toContain('aria-live="polite"');

    // Must have aria-atomic="true"
    expect(tag).toContain('aria-atomic="true"');

    // Must have sr-only class
    expect(tag).toMatch(/class="[^"]*sr-only[^"]*"/);
  });

  /// Tests checklist items: [2] — Feature 6.2
  it('a11y_transition_bg_hidden', () => {
    // All transition-bg divs must have aria-hidden="true"
    const matches = html.match(/<div[^>]*class=["'][^"]*transition-bg[^"]*["'][^>]*>/g);
    expect(matches).not.toBeNull();
    expect(matches.length).toBeGreaterThanOrEqual(2);
    for (const tag of matches) {
      expect(tag).toContain('aria-hidden="true"');
    }
  });
});
