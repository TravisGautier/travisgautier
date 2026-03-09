import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const projectRoot = path.resolve(import.meta.dirname, '..', '..');

describe('deployment readiness', () => {
  /// Tests checklist items: 1
  it('build_deploy_wrangler_config_exists', () => {
    const wranglerPath = path.join(projectRoot, 'wrangler.toml');
    expect(fs.existsSync(wranglerPath)).toBe(true);

    const content = fs.readFileSync(wranglerPath, 'utf-8');

    // Must identify the project name
    expect(content).toMatch(/name\s*=\s*"/);

    // Build command
    expect(content).toContain('npm run build');

    // Output directory
    expect(content).toContain('dist');

    // Compatibility date
    expect(content).toMatch(/compatibility_date\s*=\s*"\d{4}-\d{2}-\d{2}"/);
  });

  /// Tests checklist items: 2
  it('build_deploy_package_has_deploy_script', () => {
    const pkgPath = path.join(projectRoot, 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

    expect(pkg.scripts).toHaveProperty('deploy');
    expect(pkg.scripts.deploy).toContain('wrangler');
    expect(pkg.scripts.deploy).toContain('pages');
    expect(pkg.scripts.deploy).toContain('dist');
  });

  /// Tests checklist items: 5
  it('build_deploy_all_public_assets_present', () => {
    const publicDir = path.join(projectRoot, 'public');

    expect(fs.existsSync(path.join(publicDir, '404.html'))).toBe(true);
    expect(fs.existsSync(path.join(publicDir, '_headers'))).toBe(true);
    expect(fs.existsSync(path.join(publicDir, 'favicon.svg'))).toBe(true);
    expect(fs.existsSync(path.join(publicDir, 'favicon.ico'))).toBe(true);
    expect(fs.existsSync(path.join(publicDir, 'apple-touch-icon.png'))).toBe(true);
    expect(fs.existsSync(path.join(publicDir, 'og-image.jpg'))).toBe(true);
    expect(fs.existsSync(path.join(publicDir, 'fallback-hero.jpg'))).toBe(true);

    // Fonts directory with woff2 files
    const fontsDir = path.join(publicDir, 'fonts');
    expect(fs.existsSync(fontsDir)).toBe(true);
    const fontFiles = fs.readdirSync(fontsDir).filter(f => f.endsWith('.woff2'));
    expect(fontFiles.length).toBeGreaterThan(0);
  });

  /// Tests checklist items: 3
  it('build_deploy_analytics_beacon_configured', () => {
    const html = fs.readFileSync(path.join(projectRoot, 'index.html'), 'utf-8');

    // Script tag referencing Cloudflare Web Analytics
    expect(html).toContain('cloudflareinsights.com/beacon.min.js');

    // Script has defer attribute
    expect(html).toMatch(/<script[^>]*defer[^>]*cloudflareinsights/);

    // Script has data-cf-beacon with token field
    expect(html).toMatch(/data-cf-beacon\s*=\s*'[^']*"token"\s*:/);
  });

  /// Tests checklist items: 6
  it('build_deploy_canonical_url_set', () => {
    const html = fs.readFileSync(path.join(projectRoot, 'index.html'), 'utf-8');

    expect(html).toMatch(/<link\s+rel\s*=\s*"canonical"\s+href\s*=\s*"https:\/\/travisgautier\.com"/);
  });

  /// Tests checklist items: 6
  it('build_deploy_production_domain_in_meta', () => {
    const html = fs.readFileSync(path.join(projectRoot, 'index.html'), 'utf-8');

    // og:url must reference production domain
    expect(html).toMatch(/<meta\s+property\s*=\s*"og:url"\s+content\s*=\s*"https:\/\/travisgautier\.com"/);

    // og:image must reference production domain
    expect(html).toMatch(/<meta\s+property\s*=\s*"og:image"\s+content\s*=\s*"https:\/\/travisgautier\.com/);
  });
});
