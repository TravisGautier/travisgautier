import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const projectRoot = path.resolve(import.meta.dirname, '..', '..');
const distDir = path.join(projectRoot, 'dist');
const assetsDir = path.join(distDir, 'assets');

describe('build config', () => {
  const configPath = path.join(projectRoot, 'vite.config.js');
  const configContent = fs.readFileSync(configPath, 'utf-8');

  /// Tests checklist items: [1, 2]
  it('build_config_uses_terser', () => {
    expect(configContent).toMatch(/minify:\s*['"]terser['"]/);
    expect(configContent).not.toMatch(/minify:\s*['"]esbuild['"]/);
  });
});

const expectedFonts = [
  'CormorantGaramond-Light.woff2',
  'CormorantGaramond-Regular.woff2',
  'CormorantGaramond-SemiBold.woff2',
  'CormorantGaramond-LightItalic.woff2',
  'Outfit-ExtraLight.woff2',
  'Outfit-Light.woff2',
  'Outfit-Regular.woff2',
];

describe('build output', () => {
  beforeAll(() => {
    execSync('npx vite build', { cwd: projectRoot, stdio: 'pipe' });
  }, 30_000);

  afterAll(() => {
    fs.rmSync(distDir, { recursive: true, force: true });
  });

  /// Tests checklist items: [1]
  it('build_production_completes', () => {
    expect(fs.existsSync(distDir)).toBe(true);
    expect(fs.existsSync(path.join(distDir, 'index.html'))).toBe(true);
    expect(fs.existsSync(assetsDir)).toBe(true);
  });

  /// Tests checklist items: [2]
  it('build_threejs_separate_chunk', () => {
    const files = fs.readdirSync(assetsDir);
    const threeChunks = files.filter((f) => f.match(/^three-.*\.js$/));
    expect(threeChunks).toHaveLength(1);

    const threeSize = fs.statSync(path.join(assetsDir, threeChunks[0])).size;
    expect(threeSize).toBeGreaterThan(100 * 1024);
    expect(threeSize).toBeLessThan(800 * 1024);

    const appChunks = files.filter((f) => f.match(/^index-.*\.js$/));
    expect(appChunks.length).toBeGreaterThan(0);
    const appSize = fs.statSync(path.join(assetsDir, appChunks[0])).size;
    expect(appSize).toBeLessThan(threeSize);
  });

  /// Tests checklist items: [3]
  it('build_index_html_exists', () => {
    const html = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');
    expect(html.length).toBeGreaterThan(0);
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toMatch(/<html\s[^>]*lang="en"/);
    expect(html).toMatch(/<script\s[^>]*type="module"/);
    expect(html).toMatch(/<link\s[^>]*rel="stylesheet"/);
  });

  /// Tests checklist items: [4]
  it('build_fonts_in_output', () => {
    const fontsDir = path.join(distDir, 'fonts');
    expect(fs.existsSync(fontsDir)).toBe(true);

    for (const font of expectedFonts) {
      const fontPath = path.join(fontsDir, font);
      expect(fs.existsSync(fontPath)).toBe(true);
      const stat = fs.statSync(fontPath);
      expect(stat.size).toBeGreaterThan(2 * 1024);
    }
  });

  /// Tests checklist items: [5]
  it('build_no_excessive_inline_styles', () => {
    const html = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');

    // No <style> blocks in production HTML
    expect(html).not.toMatch(/<style[\s>]/);

    // No excessively large inline style attributes
    const styleAttrs = [...html.matchAll(/style="([^"]*)"/g)].map((m) => m[1]);
    for (const attr of styleAttrs) {
      expect(attr.length).toBeLessThan(500);
    }

    const totalInlineStyle = styleAttrs.reduce((sum, s) => sum + s.length, 0);
    expect(totalInlineStyle).toBeLessThan(1000);
  });

  /// Tests checklist items: [1, 3]
  it('build_css_in_output', () => {
    const files = fs.readdirSync(assetsDir);
    const cssFiles = files.filter((f) => f.match(/^index-.*\.css$/));
    expect(cssFiles).toHaveLength(1);

    const cssSize = fs.statSync(path.join(assetsDir, cssFiles[0])).size;
    expect(cssSize).toBeGreaterThan(1 * 1024);
    expect(cssSize).toBeLessThan(50 * 1024);
  });

  /// Tests checklist items: [1, 2]
  it('build_app_js_in_output', () => {
    const files = fs.readdirSync(assetsDir);
    const appFiles = files.filter((f) => f.match(/^index-.*\.js$/));
    expect(appFiles).toHaveLength(1);

    const appSize = fs.statSync(path.join(assetsDir, appFiles[0])).size;
    expect(appSize).toBeGreaterThan(5 * 1024);
    expect(appSize).toBeLessThan(200 * 1024);
  });

  /// Tests checklist items: [1]
  it('build_assets_content_hashed', () => {
    const files = fs.readdirSync(assetsDir);
    const jsFiles = files.filter((f) => f.endsWith('.js'));
    const cssFiles = files.filter((f) => f.endsWith('.css'));

    for (const file of jsFiles) {
      expect(file).toMatch(/^[\w]+-[a-zA-Z0-9_-]+\.js$/);
    }
    for (const file of cssFiles) {
      expect(file).toMatch(/^[\w]+-[a-zA-Z0-9_-]+\.css$/);
    }
  });

  /// Tests checklist items: [1, 3]
  it('build_html_references_assets', () => {
    const html = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');

    // Script src references exist on disk
    const scriptSrcs = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map((m) => m[1]);
    expect(scriptSrcs.length).toBeGreaterThan(0);
    for (const src of scriptSrcs) {
      const filePath = path.join(distDir, src.replace(/^\//, ''));
      expect(fs.existsSync(filePath)).toBe(true);
    }

    // Stylesheet href references exist on disk
    const stylesheetHrefs = [...html.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g)].map((m) => m[1]);
    expect(stylesheetHrefs.length).toBeGreaterThan(0);
    for (const href of stylesheetHrefs) {
      const filePath = path.join(distDir, href.replace(/^\//, ''));
      expect(fs.existsSync(filePath)).toBe(true);
    }

    // Modulepreload references exist on disk and include three chunk
    const preloads = [...html.matchAll(/<link[^>]+rel="modulepreload"[^>]+href="([^"]+)"/g)].map((m) => m[1]);
    const threePreload = preloads.find((p) => p.includes('three'));
    expect(threePreload).toBeDefined();
    for (const href of preloads) {
      const filePath = path.join(distDir, href.replace(/^\//, ''));
      expect(fs.existsSync(filePath)).toBe(true);
    }
  });

  /// Tests checklist items: [5]
  it('build_no_inline_script_blocks', () => {
    const html = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');
    const scriptTags = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)];

    for (const [, attrs, body] of scriptTags) {
      // JSON-LD structured data scripts are allowed inline
      if (attrs.includes('application/ld+json')) continue;
      // Every other script tag should have a src attribute
      expect(attrs).toMatch(/src="/);
      // No inline JavaScript content
      expect(body.trim()).toBe('');
    }
  });

  /// Tests checklist items: [6] — Feature 8.1
  it('build_inline_script_exempts_jsonld', () => {
    const html = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');
    const scriptTags = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)];

    // Find JSON-LD script — it should have inline content
    const jsonldTag = scriptTags.find(([, attrs]) => attrs.includes('application/ld+json'));
    expect(jsonldTag).toBeDefined();
    expect(jsonldTag[2].trim().length).toBeGreaterThan(0);

    // Non-JSON-LD scripts should still have src and empty body
    const otherTags = scriptTags.filter(([, attrs]) => !attrs.includes('application/ld+json'));
    for (const [, attrs, body] of otherTags) {
      expect(attrs).toMatch(/src="/);
      expect(body.trim()).toBe('');
    }
  });

  /// Tests checklist items: [1, 2, 3, 4, 5] — Feature 8.1
  it('build_meta_tags_survive', () => {
    const html = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');

    // Description meta tag
    expect(html).toMatch(/<meta\s+name=["']description["']/);

    // Open Graph tags
    expect(html).toMatch(/<meta\s+property=["']og:title["']/);
    expect(html).toMatch(/<meta\s+property=["']og:image["']/);

    // Twitter card tag
    expect(html).toMatch(/<meta\s+name=["']twitter:card["']/);

    // Canonical link
    expect(html).toMatch(/<link\s+rel=["']canonical["']/);

    // JSON-LD structured data with valid JSON
    const jsonldMatch = html.match(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/);
    expect(jsonldMatch).not.toBeNull();
    const data = JSON.parse(jsonldMatch[1]);
    expect(data['@type']).toBe('Person');
  });

  /// Tests checklist items: [2] — Feature 8.2
  it('build_og_image_in_output', () => {
    const distOgImage = path.join(distDir, 'og-image.jpg');
    expect(fs.existsSync(distOgImage)).toBe(true);

    const srcSize = fs.statSync(path.join(projectRoot, 'public', 'og-image.jpg')).size;
    const distSize = fs.statSync(distOgImage).size;
    expect(distSize).toBe(srcSize);
  });

  /// Tests checklist items: [1, 2, 3] — Feature 8.3
  it('build_favicons_in_output', () => {
    const faviconFiles = ['favicon.svg', 'favicon.ico', 'apple-touch-icon.png'];
    for (const file of faviconFiles) {
      const distPath = path.join(distDir, file);
      expect(fs.existsSync(distPath)).toBe(true);

      const srcSize = fs.statSync(path.join(projectRoot, 'public', file)).size;
      const outSize = fs.statSync(distPath).size;
      expect(outSize).toBe(srcSize);
    }
  });

  /// Tests checklist items: [1, 2]
  it('build_bundle_sizes_reasonable', () => {
    const files = fs.readdirSync(assetsDir);

    // Total assets under 1MB
    let totalSize = 0;
    for (const file of files) {
      totalSize += fs.statSync(path.join(assetsDir, file)).size;
    }
    expect(totalSize).toBeLessThan(1024 * 1024);

    // Three.js chunk dominates JS size (> 50%)
    const jsFiles = files.filter((f) => f.endsWith('.js'));
    let totalJsSize = 0;
    let threeJsSize = 0;
    for (const file of jsFiles) {
      const size = fs.statSync(path.join(assetsDir, file)).size;
      totalJsSize += size;
      if (file.match(/^three-/)) {
        threeJsSize += size;
      }
    }
    expect(threeJsSize).toBeGreaterThan(totalJsSize * 0.5);
  });
});
