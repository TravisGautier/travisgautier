import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const projectRoot = path.resolve(import.meta.dirname, '..', '..');
const css = fs.readFileSync(path.join(projectRoot, 'styles', 'main.css'), 'utf-8');
const html = fs.readFileSync(path.join(projectRoot, 'index.html'), 'utf-8');

/// Tests checklist items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] — Feature 6.4

describe('Color contrast (WCAG AA) — Feature 6.4', () => {
  /// Tests checklist items: [1] — Feature 6.4
  it('a11y_header_link_gold_contrast', () => {
    // .header-link base color must use rgba(42,37,32) with alpha >= 0.7
    const match = css.match(/\.header-link\s*\{[^}]*color:\s*rgba\(42,\s*37,\s*32,\s*([\d.]+)\)/s);
    expect(match).not.toBeNull();
    expect(parseFloat(match[1])).toBeGreaterThanOrEqual(0.7);
  });

  /// Tests checklist items: [2] — Feature 6.4
  it('a11y_header_link_purple_contrast', () => {
    // .header-link.purple color must use rgba(74,53,112) with alpha >= 0.8
    const match = css.match(/\.header-link\.purple\s*\{[^}]*color:\s*rgba\(74,\s*53,\s*112,\s*([\d.]+)\)/s);
    expect(match).not.toBeNull();
    expect(parseFloat(match[1])).toBeGreaterThanOrEqual(0.8);
  });

  /// Tests checklist items: [3] — Feature 6.4
  it('a11y_label_desc_contrast', () => {
    // Both .side-label.left and .right .label-desc must have alpha >= 0.7
    const leftMatch = css.match(/\.side-label\.left\s+\.label-desc\s*\{[^}]*color:\s*rgba\(42,\s*37,\s*32,\s*([\d.]+)\)/s);
    expect(leftMatch).not.toBeNull();
    expect(parseFloat(leftMatch[1])).toBeGreaterThanOrEqual(0.7);

    const rightMatch = css.match(/\.side-label\.right\s+\.label-desc\s*\{[^}]*color:\s*rgba\(42,\s*37,\s*32,\s*([\d.]+)\)/s);
    expect(rightMatch).not.toBeNull();
    expect(parseFloat(rightMatch[1])).toBeGreaterThanOrEqual(0.7);
  });

  /// Tests checklist items: [4] — Feature 6.4
  it('a11y_scroll_hint_gold_contrast', () => {
    // .scroll-hint base color must have alpha >= 0.7
    const match = css.match(/\.scroll-hint\s*\{[^}]*color:\s*rgba\(42,\s*37,\s*32,\s*([\d.]+)\)/s);
    expect(match).not.toBeNull();
    expect(parseFloat(match[1])).toBeGreaterThanOrEqual(0.7);
  });

  /// Tests checklist items: [5] — Feature 6.4
  it('a11y_hold_hint_gold_contrast', () => {
    // .hold-hint base color must have alpha >= 0.7
    const match = css.match(/\.hold-hint\s*\{[^}]*color:\s*rgba\(42,\s*37,\s*32,\s*([\d.]+)\)/s);
    expect(match).not.toBeNull();
    expect(parseFloat(match[1])).toBeGreaterThanOrEqual(0.7);
  });

  /// Tests checklist items: [6, 7] — Feature 6.4
  it('a11y_hint_purple_contrast', () => {
    // .scroll-hint.purple and .hold-hint.purple must have alpha >= 0.8
    const scrollMatch = css.match(/\.scroll-hint\.purple\s*\{[^}]*color:\s*rgba\(74,\s*53,\s*112,\s*([\d.]+)\)/s);
    expect(scrollMatch).not.toBeNull();
    expect(parseFloat(scrollMatch[1])).toBeGreaterThanOrEqual(0.8);

    const holdMatch = css.match(/\.hold-hint\.purple\s*\{[^}]*color:\s*rgba\(74,\s*53,\s*112,\s*([\d.]+)\)/s);
    expect(holdMatch).not.toBeNull();
    expect(parseFloat(holdMatch[1])).toBeGreaterThanOrEqual(0.8);
  });

  /// Tests checklist items: [8] — Feature 6.4
  it('a11y_transition_desc_contrast', () => {
    // .transition-screen .inner p color must have alpha >= 0.7
    const match = css.match(/\.transition-screen\s+\.inner\s+p\s*\{[^}]*color:\s*rgba\(42,\s*37,\s*32,\s*([\d.]+)\)/s);
    expect(match).not.toBeNull();
    expect(parseFloat(match[1])).toBeGreaterThanOrEqual(0.7);
  });

  /// Tests checklist items: [9] — Feature 6.4
  it('a11y_context_lost_text_contrast', () => {
    // .context-lost-overlay p color must have alpha >= 0.5
    const match = css.match(/\.context-lost-overlay\s+p\s*\{[^}]*color:\s*rgba\(255,\s*255,\s*255,\s*([\d.]+)\)/s);
    expect(match).not.toBeNull();
    expect(parseFloat(match[1])).toBeGreaterThanOrEqual(0.5);
  });

  /// Tests checklist items: [10] — Feature 6.4
  it('a11y_skip_link_contrast', () => {
    // .skip-link must NOT use var(--gold) or #b8942e — must use a darker color
    const skipBlock = css.match(/\.skip-link\s*\{([^}]*)\}/s);
    expect(skipBlock).not.toBeNull();
    const colorLine = skipBlock[1];

    // Must not reference var(--gold) or #b8942e
    expect(colorLine).not.toMatch(/color:\s*var\(--gold\)/);
    expect(colorLine).not.toMatch(/color:\s*#b8942e/i);

    // Must use #6b5a28 (dark gold with 4.77:1 contrast)
    expect(colorLine).toMatch(/color:\s*#6b5a28/);
  });

  /// Tests checklist items: [11] — Feature 6.4
  it('a11y_prefers_contrast_media_query', () => {
    // @media (prefers-contrast: more) block must exist
    expect(css).toMatch(/@media\s*\(prefers-contrast:\s*more\)/);

    // Extract the block and verify it contains key overrides
    const mediaMatch = css.match(/@media\s*\(prefers-contrast:\s*more\)\s*\{([\s\S]*?)\n\}/);
    expect(mediaMatch).not.toBeNull();
    const mediaContent = mediaMatch[1];

    // Must override header-link, scroll-hint, and context-lost text
    expect(mediaContent).toMatch(/\.header-link\s*\{[^}]*color:/);
    expect(mediaContent).toMatch(/\.scroll-hint\s*\{[^}]*color:/);
    expect(mediaContent).toMatch(/\.context-lost-overlay\s+p\s*\{[^}]*color:/);
  });

  /// Tests checklist items: [] — Feature 6.4 (decorative exemption)
  it('a11y_label_num_decorative', () => {
    // .label-num span elements must have aria-hidden="true" in HTML
    // confirming they are decorative and exempt from contrast requirements
    const labelNumSpans = html.match(/<span[^>]*class=["']label-num["'][^>]*>/g) ||
                          html.match(/class=["']label-num["']/g);
    expect(labelNumSpans).not.toBeNull();

    // Each .label-num should contain a span with aria-hidden
    const labelNumSections = [...html.matchAll(/class=["']label-num["'][^>]*>[\s\S]*?<\/span>/g)];
    for (const section of labelNumSections) {
      expect(section[0]).toMatch(/aria-hidden=["']true["']/);
    }
  });

  /// Tests checklist items: [] — Feature 6.4 (regression guard)
  it('a11y_passing_elements_preserved', () => {
    // Verify already-passing colors have not been accidentally changed
    expect(css).toMatch(/\.logo\s*\{[^}]*color:\s*#3d3225/s);
    expect(css).toMatch(/\.logo\.purple\s*\{[^}]*color:\s*#4a3570/s);
    expect(css).toMatch(/color:\s*#2a2520/); // body text
    expect(css).toMatch(/\.side-label\.left\s+\.label-title\s*\{[^}]*color:\s*#6b5a28/s);
    expect(css).toMatch(/\.side-label\.right\s+\.label-title\s*\{[^}]*color:\s*#5a3d8a/s);
  });
});
