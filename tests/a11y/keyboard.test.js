import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const html = fs.readFileSync(path.resolve('index.html'), 'utf-8');
const projectRoot = path.resolve(import.meta.dirname, '..', '..');
const css = fs.readFileSync(path.join(projectRoot, 'styles', 'main.css'), 'utf-8');

/// Tests checklist items: [1, 2, 3, 4, 5] — Feature 6.3

describe('Keyboard navigation + focus styles — Feature 6.3', () => {
  /// Tests checklist items: [1] — Feature 6.3
  it('a11y_skip_link_exists', () => {
    // Skip-to-content link must exist with correct class, href, and text
    const match = html.match(/<a[^>]*class=["']skip-link["'][^>]*>/);
    expect(match).not.toBeNull();
    const tag = match[0];

    // Must target the main content area
    expect(tag).toContain('href="#canvas-container"');

    // Must contain accessible text
    expect(html).toMatch(/<a[^>]*class=["']skip-link["'][^>]*>[^<]*Skip to content/);
  });

  /// Tests checklist items: [1] — Feature 6.3
  it('a11y_skip_link_first_focusable', () => {
    // Skip link must be the first <a> or <button> in the document
    const interactiveElements = [...html.matchAll(/<(a|button)\b[^>]*>/g)];
    expect(interactiveElements.length).toBeGreaterThan(0);

    const firstInteractive = interactiveElements[0][0];
    expect(firstInteractive).toContain('skip-link');

    // Skip link must appear before the cursor div (first child of body)
    const skipPos = html.indexOf('class="skip-link"');
    const cursorPos = html.indexOf('id="cursor"');
    expect(skipPos).toBeGreaterThan(-1);
    expect(skipPos).toBeLessThan(cursorPos);
  });

  /// Tests checklist items: [2] — Feature 6.3
  it('a11y_skip_link_visible_on_focus', () => {
    // Base .skip-link rule must exist with position: absolute
    expect(css).toMatch(/\.skip-link\s*\{/);
    expect(css).toMatch(/\.skip-link\s*\{[^}]*position:\s*absolute/s);

    // :focus-visible rule must exist and change top to a visible position
    expect(css).toMatch(/\.skip-link:focus-visible\s*\{/);
    expect(css).toMatch(/\.skip-link:focus-visible\s*\{[^}]*top/s);
  });

  /// Tests checklist items: [2] — Feature 6.3
  it('a11y_skip_link_hidden_default', () => {
    // Base .skip-link rule must position element off-screen
    expect(css).toMatch(/\.skip-link\s*\{[^}]*top:\s*-/s);

    // z-index must be high enough to appear above all overlays (cursor is 9999)
    const skipBlock = css.match(/\.skip-link\s*\{([^}]*)\}/s);
    expect(skipBlock).not.toBeNull();
    const zMatch = skipBlock[1].match(/z-index:\s*(\d+)/);
    expect(zMatch).not.toBeNull();
    expect(parseInt(zMatch[1], 10)).toBeGreaterThanOrEqual(10000);
  });

  /// Tests checklist items: [3] — Feature 6.3
  it('a11y_focus_outline_2px', () => {
    // Header link focus-visible must have 2px outline (not 1px)
    expect(css).toMatch(/\.header-link:focus-visible\s*\{[^}]*outline:\s*2px\s+solid/s);

    // Must retain outline-offset: 4px
    expect(css).toMatch(/\.header-link:focus-visible\s*\{[^}]*outline-offset:\s*4px/s);
  });

  /// Tests checklist items: [4] — Feature 6.3
  it('a11y_context_lost_btn_focus', () => {
    // Context-lost button must have a :focus-visible rule
    expect(css).toMatch(/\.context-lost-btn:focus-visible\s*\{/);

    // The rule must include an outline property
    expect(css).toMatch(/\.context-lost-btn:focus-visible\s*\{[^}]*outline/s);
  });

  /// Tests checklist items: [5] — Feature 6.3
  it('a11y_tab_order_logical', () => {
    // Skip link must appear before header link in DOM order
    const skipLinkPos = html.indexOf('class="skip-link"');
    const headerLinkPos = html.indexOf('class="header-link"');
    const transitionAPos = html.indexOf('id="transitionA"');

    expect(skipLinkPos).toBeGreaterThan(-1);
    expect(skipLinkPos).toBeLessThan(headerLinkPos);
    expect(headerLinkPos).toBeLessThan(transitionAPos);

    // No negative tabindex values that would remove elements from tab order
    expect(html).not.toMatch(/tabindex=["']-/);
  });

  /// Tests checklist items: [3, 4] — Feature 6.3
  it('int_focus_styles_gold_purple', () => {
    // Gold default: 2px solid outline using --gold custom property
    expect(css).toMatch(/\.header-link:focus-visible\s*\{[^}]*outline:\s*2px\s+solid\s+var\(--gold\)/s);

    // Purple variant: outline-color using --purple custom property
    expect(css).toMatch(/\.header-link\.purple:focus-visible\s*\{[^}]*outline-color:\s*var\(--purple\)/s);
  });
});
