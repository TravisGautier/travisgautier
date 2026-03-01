import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const projectRoot = path.resolve(import.meta.dirname, '..', '..');

describe('styles', () => {
  // --- BUILD TESTS ---

  /// Tests checklist items: [1]
  it('build_css_file_exists', () => {
    const cssPath = path.join(projectRoot, 'styles', 'main.css');
    expect(fs.existsSync(cssPath)).toBe(true);

    const css = fs.readFileSync(cssPath, 'utf-8');
    expect(css.length).toBeGreaterThan(0);

    const lineCount = css.split('\n').length;
    expect(lineCount).toBeGreaterThanOrEqual(200);
    expect(lineCount).toBeLessThanOrEqual(500);
  });

  /// Tests checklist items: [4]
  it('build_html_no_inline_style', () => {
    const html = fs.readFileSync(path.join(projectRoot, 'index.html'), 'utf-8');

    // No <style> block in index.html
    expect(html).not.toMatch(/<style[\s>]/);

    // Has <link> referencing styles/main.css
    expect(html).toMatch(/<link[^>]+href=["']\/styles\/main\.css["']/);

    // No inline style attributes on transition screen elements
    const transitionA = html.match(/<div[^>]*id="transitionA"[\s\S]*?<\/div>\s*<\/div>/);
    if (transitionA) {
      expect(transitionA[0]).not.toContain('style=');
    }
    const transitionB = html.match(/<div[^>]*id="transitionB"[\s\S]*?<\/div>\s*<\/div>/);
    if (transitionB) {
      expect(transitionB[0]).not.toContain('style=');
    }
  });

  // --- UNIT TESTS ---

  /// Tests checklist items: [1]
  it('unit_css_custom_properties', () => {
    const css = fs.readFileSync(path.join(projectRoot, 'styles', 'main.css'), 'utf-8');

    expect(css).toContain('--gold: #b8942e');
    expect(css).toContain('--gold-light: #8b7330');
    expect(css).toContain('--purple: #7c52d4');
    expect(css).toContain('--purple-light: #6b44b8');
    expect(css).toContain('--bg: #c8dcea');
  });

  /// Tests checklist items: [2]
  it('unit_css_font_face_declarations', () => {
    const css = fs.readFileSync(path.join(projectRoot, 'styles', 'main.css'), 'utf-8');

    // Count @font-face blocks
    const fontFaceBlocks = css.match(/@font-face\s*\{/g);
    expect(fontFaceBlocks).not.toBeNull();
    expect(fontFaceBlocks.length).toBe(7);

    // Cormorant Garamond weights
    expect(css).toMatch(/@font-face\s*\{[^}]*font-family:\s*['"]Cormorant Garamond['"][^}]*font-weight:\s*300[^}]*\}/s);
    expect(css).toMatch(/@font-face\s*\{[^}]*font-family:\s*['"]Cormorant Garamond['"][^}]*font-weight:\s*400[^}]*\}/s);
    expect(css).toMatch(/@font-face\s*\{[^}]*font-family:\s*['"]Cormorant Garamond['"][^}]*font-weight:\s*600[^}]*\}/s);

    // Cormorant Garamond 300 italic
    expect(css).toMatch(/@font-face\s*\{[^}]*font-family:\s*['"]Cormorant Garamond['"][^}]*font-style:\s*italic[^}]*font-weight:\s*300[^}]*\}/s);

    // Outfit weights
    expect(css).toMatch(/@font-face\s*\{[^}]*font-family:\s*['"]Outfit['"][^}]*font-weight:\s*200[^}]*\}/s);
    expect(css).toMatch(/@font-face\s*\{[^}]*font-family:\s*['"]Outfit['"][^}]*font-weight:\s*300[^}]*\}/s);
    expect(css).toMatch(/@font-face\s*\{[^}]*font-family:\s*['"]Outfit['"][^}]*font-weight:\s*400[^}]*\}/s);

    // All must have font-display: swap
    const blocks = css.split('@font-face');
    for (let i = 1; i < blocks.length; i++) {
      expect(blocks[i]).toContain('font-display: swap');
    }

    // All src urls point to /fonts/ with woff2 format
    for (let i = 1; i < blocks.length; i++) {
      expect(blocks[i]).toMatch(/src:\s*url\(['"]?\/fonts\//);
      expect(blocks[i]).toContain('woff2');
    }
  });

  /// Tests checklist items: [3]
  it('unit_css_no_google_import', () => {
    const css = fs.readFileSync(path.join(projectRoot, 'styles', 'main.css'), 'utf-8');

    expect(css).not.toContain("@import url('https://fonts.googleapis.com");
    expect(css).not.toContain('fonts.googleapis.com');
  });

  /// Tests checklist items: [1]
  it('unit_css_selectors_present', () => {
    const css = fs.readFileSync(path.join(projectRoot, 'styles', 'main.css'), 'utf-8');

    // All expected selectors from prototype
    expect(css).toMatch(/\.cursor\s*\{/);
    expect(css).toMatch(/\.cursor-trail\s*\{/);
    expect(css).toMatch(/\.overlay\s*\{/);
    expect(css).toMatch(/\.header\s*\{/);
    expect(css).toMatch(/\.logo\s*\{/);
    expect(css).toMatch(/\.side-label\s*\{/);
    expect(css).toMatch(/\.bottom-bar\s*\{/);
    expect(css).toMatch(/\.scroll-hint\s*\{/);
    expect(css).toMatch(/\.hold-indicator\s*\{/);
    expect(css).toMatch(/\.transition-screen\s*\{/);

    // Keyframe animations
    expect(css).toContain('@keyframes fadeDown');
    expect(css).toContain('@keyframes fadeUp');
    expect(css).toContain('@keyframes scrollPulse');

    // Media query
    expect(css).toContain('@media (max-width: 768px)');
  });

  // --- CONTEXT LOSS CSS TESTS ---

  /// Tests checklist items: [7] — Feature 2.2
  it('css_context_lost_classes', () => {
    const css = fs.readFileSync(path.join(projectRoot, 'styles', 'main.css'), 'utf-8');

    expect(css).toMatch(/\.context-lost-overlay\s*\{/);
    expect(css).toMatch(/\.context-lost-btn\s*\{/);
    expect(css).toMatch(/\.context-lost-title\s*\{/);
    expect(css).toContain('@keyframes contextLostFadeIn');
  });

  // --- ACCESSIBILITY TESTS ---

  /// Tests checklist items: [1]
  it('a11y_responsive_breakpoint', () => {
    const css = fs.readFileSync(path.join(projectRoot, 'styles', 'main.css'), 'utf-8');

    expect(css).toContain('@media (max-width: 768px)');

    // Extract content inside the media query
    const mediaMatch = css.match(/@media\s*\(max-width:\s*768px\)\s*\{([\s\S]*?)\n\}/);
    expect(mediaMatch).not.toBeNull();
    const mediaContent = mediaMatch[1];

    // Mobile breakpoint adjusts header padding
    expect(mediaContent).toMatch(/\.header\s*\{[^}]*padding/);

    // Mobile breakpoint adjusts side label positions
    expect(mediaContent).toMatch(/\.side-label\.left\s*\{[^}]*left/);
    expect(mediaContent).toMatch(/\.side-label\.right\s*\{[^}]*right/);

    // Mobile breakpoint adjusts label title font size
    expect(mediaContent).toMatch(/\.side-label\s+\.label-title\s*\{[^}]*font-size/);

    // Mobile breakpoint adjusts bottom bar padding
    expect(mediaContent).toMatch(/\.bottom-bar\s*\{[^}]*padding/);
  });

  // --- INTEGRATION TESTS ---

  /// Tests checklist items: [5]
  it('int_css_transition_classes', () => {
    const css = fs.readFileSync(path.join(projectRoot, 'styles', 'main.css'), 'utf-8');
    const html = fs.readFileSync(path.join(projectRoot, 'index.html'), 'utf-8');

    // CSS has .transition-bg rule with position:absolute and inset:0
    expect(css).toMatch(/\.transition-bg\s*\{/);
    expect(css).toContain('position: absolute');
    expect(css).toContain('inset: 0');

    // Gold transition background gradient
    expect(css).toMatch(/\.transition-bg\.gold/);
    expect(css).toContain('rgba(180,148,46,0.25)');

    // Purple transition background gradient
    expect(css).toMatch(/\.transition-bg\.purple/);
    expect(css).toContain('rgba(124,82,212,0.25)');

    // Gold transition title color
    expect(css).toContain('#6b5a28');

    // Purple transition title color
    expect(css).toContain('#5a3d8a');

    // HTML uses CSS classes instead of inline styles
    expect(html).toMatch(/class="[^"]*transition-bg[^"]*gold/);
    expect(html).toMatch(/class="[^"]*transition-bg[^"]*purple/);

    // No style= attributes inside transition screen elements
    const transitionSections = html.match(/<div[^>]*id="transition[AB]"[\s\S]*?<\/div>\s*<\/div>/g);
    if (transitionSections) {
      for (const section of transitionSections) {
        expect(section).not.toContain('style=');
      }
    }
  });
});
