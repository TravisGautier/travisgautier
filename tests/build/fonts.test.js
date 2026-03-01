import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const projectRoot = path.resolve(import.meta.dirname, '..', '..');
const fontsDir = path.join(projectRoot, 'public', 'fonts');

const expectedFonts = [
  'CormorantGaramond-Light.woff2',
  'CormorantGaramond-Regular.woff2',
  'CormorantGaramond-SemiBold.woff2',
  'CormorantGaramond-LightItalic.woff2',
  'Outfit-ExtraLight.woff2',
  'Outfit-Light.woff2',
  'Outfit-Regular.woff2',
];

describe('fonts', () => {
  /// Tests checklist items: [1, 2]
  it('build_font_files_exist', () => {
    for (const font of expectedFonts) {
      expect(fs.existsSync(path.join(fontsDir, font))).toBe(true);
    }
  });

  /// Tests checklist items: [2, 3]
  it('build_font_files_valid_woff2', () => {
    const woff2Files = fs.readdirSync(fontsDir).filter((f) => f.endsWith('.woff2'));
    expect(woff2Files).toHaveLength(7);

    for (const font of woff2Files) {
      const buf = fs.readFileSync(path.join(fontsDir, font));
      expect(buf.length).toBeGreaterThan(100);
      // wOF2 magic bytes
      expect(buf[0]).toBe(0x77);
      expect(buf[1]).toBe(0x4f);
      expect(buf[2]).toBe(0x46);
      expect(buf[3]).toBe(0x32);
    }
  });

  /// Tests checklist items: [2]
  it('build_font_files_reasonable_size', () => {
    for (const font of expectedFonts) {
      const stat = fs.statSync(path.join(fontsDir, font));
      expect(stat.size).toBeGreaterThan(2 * 1024);
      expect(stat.size).toBeLessThan(100 * 1024);
    }
  });

  /// Tests checklist items: [3]
  it('int_css_font_urls_match_files', () => {
    const css = fs.readFileSync(path.join(projectRoot, 'styles', 'main.css'), 'utf-8');
    const urlMatches = css.matchAll(/url\(['"]?\/fonts\/([\w.-]+\.woff2)['"]?\)/g);
    const referencedFiles = [...urlMatches].map((m) => m[1]);

    expect(referencedFiles.length).toBeGreaterThan(0);
    for (const file of referencedFiles) {
      expect(fs.existsSync(path.join(fontsDir, file))).toBe(true);
    }
  });

  /// Tests checklist items: [3]
  it('int_no_external_font_deps', () => {
    const html = fs.readFileSync(path.join(projectRoot, 'index.html'), 'utf-8');
    const css = fs.readFileSync(path.join(projectRoot, 'styles', 'main.css'), 'utf-8');

    expect(html).not.toMatch(/fonts\.googleapis\.com/);
    expect(html).not.toMatch(/fonts\.gstatic\.com/);
    expect(css).not.toMatch(/fonts\.googleapis\.com/);
    expect(css).not.toMatch(/fonts\.gstatic\.com/);
  });
});
