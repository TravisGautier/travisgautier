import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const projectRoot = path.resolve(import.meta.dirname, '..', '..');
const html = fs.readFileSync(path.join(projectRoot, 'index.html'), 'utf-8');

describe('DOM parity', () => {
  /// Tests checklist items: [11]
  it('parity_dom_elements', () => {
    expect(html).toContain('id="cursor"');
    expect(html).toContain('id="cursorTrail"');
    expect(html).toContain('id="canvas-container"');
    expect(html).toContain('id="logo"');
    expect(html).toMatch(/data-hover/);
    expect(html).toContain('id="labelLeft"');
    expect(html).toContain('id="labelRight"');
    expect(html).toContain('class="label-num"');
    expect(html).toContain('class="label-title"');
    expect(html).toContain('class="label-desc"');
    expect(html).toContain('class="scroll-line"');
    expect(html).toContain('id="holdFill"');
    expect(html).toContain('id="transitionA"');
    expect(html).toContain('id="transitionB"');
  });

  /// Tests checklist items: [11]
  it('parity_dom_no_cdn', () => {
    expect(html).toContain('<script type="module" src="/src/main.js">');
    expect(html).not.toMatch(/cdn\.jsdelivr\.net/);
    expect(html).not.toMatch(/cdnjs\.cloudflare\.com/);
    expect(html).not.toMatch(/fonts\.googleapis\.com/);
  });

  /// Tests checklist items: [1] — Feature 3.5
  it('build_html_loading_div_exists', () => {
    expect(html).toContain('id="loading"');

    const loadingMatch = html.match(/<div[^>]*id=["']loading["'][^>]*>/);
    expect(loadingMatch).not.toBeNull();

    const loadingTag = loadingMatch[0];
    expect(loadingTag).toMatch(/z-index:\s*1000/);
    expect(loadingTag).toMatch(/background:\s*#c8dcea/);

    const loadingSection = html.match(/<div[^>]*id=["']loading["'][^>]*>[\s\S]*?<\/div>/);
    expect(loadingSection).not.toBeNull();
    expect(loadingSection[0]).toContain('Travis Gautier');
  });

  /// Tests checklist items: [1, 2] — Feature 4.3
  it('parity_header_no_hash_href', () => {
    expect(html).not.toMatch(/class="header-link"[^>]*href="#"/);
    expect(html).not.toMatch(/href="#"[^>]*class="header-link"/);
  });

  /// Tests checklist items: [2] — Feature 4.3
  it('parity_header_contact_mailto', () => {
    expect(html).toMatch(/href="mailto:travis@travisgautier\.com"/);
  });

  /// Tests checklist items: [2] — Feature 4.3
  it('parity_header_links_data_hover', () => {
    const headerLinks = html.match(/<a[^>]*class="header-link"[^>]*>/g) || [];
    expect(headerLinks.length).toBeGreaterThan(0);
    for (const link of headerLinks) {
      expect(link).toContain('data-hover');
    }
  });

  /// Tests checklist items: [11, 12]
  it('parity_dom_transition_css', () => {
    const transA = html.match(/<div[^>]*id="transitionA"[\s\S]*?<\/div>\s*<\/div>/);
    const transB = html.match(/<div[^>]*id="transitionB"[\s\S]*?<\/div>\s*<\/div>/);
    expect(transA).not.toBeNull();
    expect(transB).not.toBeNull();
    expect(transA[0]).not.toContain('style=');
    expect(transB[0]).not.toContain('style=');
    expect(html).toContain('class="transition-bg gold"');
    expect(html).toContain('class="transition-bg purple"');
  });
});
