import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const projectRoot = path.resolve(import.meta.dirname, '..', '..');
const faviconSvgPath = path.join(projectRoot, 'public', 'favicon.svg');
const faviconIcoPath = path.join(projectRoot, 'public', 'favicon.ico');
const appleTouchIconPath = path.join(projectRoot, 'public', 'apple-touch-icon.png');

describe('Favicon — Feature 8.3', () => {
  /// Tests checklist items: [1]
  it('favicon_svg_file_exists', () => {
    expect(fs.existsSync(faviconSvgPath)).toBe(true);
  });

  /// Tests checklist items: [1]
  it('favicon_svg_valid_markup', () => {
    const content = fs.readFileSync(faviconSvgPath, 'utf-8');
    expect(content).toContain('<svg');
    expect(content).toContain('xmlns="http://www.w3.org/2000/svg"');
  });

  /// Tests checklist items: [1]
  it('favicon_svg_uses_brand_colors', () => {
    const content = fs.readFileSync(faviconSvgPath, 'utf-8').toLowerCase();
    // Must contain gold color (brand gold or portal edge gold)
    const hasGold = content.includes('#b8942e') || content.includes('#c9a84c');
    expect(hasGold).toBe(true);
    // Must contain purple color
    expect(content).toContain('#7c52d4');
  });

  /// Tests checklist items: [1]
  it('favicon_svg_file_size', () => {
    const stat = fs.statSync(faviconSvgPath);
    // Minimal icon: at least 100 bytes, at most 2KB
    expect(stat.size).toBeGreaterThan(100);
    expect(stat.size).toBeLessThan(2048);
  });

  /// Tests checklist items: [2]
  it('favicon_ico_file_exists', () => {
    expect(fs.existsSync(faviconIcoPath)).toBe(true);
  });

  /// Tests checklist items: [2]
  it('favicon_ico_valid_format', () => {
    const buf = fs.readFileSync(faviconIcoPath);
    // ICO magic bytes: 00 00 01 00
    expect(buf[0]).toBe(0x00);
    expect(buf[1]).toBe(0x00);
    expect(buf[2]).toBe(0x01);
    expect(buf[3]).toBe(0x00);
  });

  /// Tests checklist items: [2]
  it('favicon_ico_file_size', () => {
    const stat = fs.statSync(faviconIcoPath);
    // Reasonable ICO: 1KB–10KB for 16x16 + 32x32
    expect(stat.size).toBeGreaterThan(1024);
    expect(stat.size).toBeLessThan(10240);
  });

  /// Tests checklist items: [3]
  it('favicon_apple_touch_icon_exists', () => {
    expect(fs.existsSync(appleTouchIconPath)).toBe(true);
  });

  /// Tests checklist items: [3]
  it('favicon_apple_touch_icon_valid_png', () => {
    const buf = fs.readFileSync(appleTouchIconPath);
    // PNG magic bytes: 89 50 4E 47
    expect(buf[0]).toBe(0x89);
    expect(buf[1]).toBe(0x50);
    expect(buf[2]).toBe(0x4e);
    expect(buf[3]).toBe(0x47);
  });

  /// Tests checklist items: [4]
  it('favicon_link_tags_in_html', () => {
    const html = fs.readFileSync(path.join(projectRoot, 'index.html'), 'utf-8');
    const headMatch = html.match(/<head>([\s\S]*?)<\/head>/);
    expect(headMatch).not.toBeNull();
    const head = headMatch[1];

    // SVG icon link
    expect(head).toMatch(/<link\s[^>]*rel=["']icon["'][^>]*type=["']image\/svg\+xml["'][^>]*href=["'][^"']*favicon\.svg["']/);

    // ICO icon link
    expect(head).toMatch(/<link\s[^>]*rel=["']icon["'][^>]*sizes=["']32x32["'][^>]*href=["'][^"']*favicon\.ico["']/);

    // Apple touch icon link
    expect(head).toMatch(/<link\s[^>]*rel=["']apple-touch-icon["'][^>]*href=["'][^"']*apple-touch-icon\.png["']/);
  });
});
