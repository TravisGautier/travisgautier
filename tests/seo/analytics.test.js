import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const html = fs.readFileSync(path.resolve('index.html'), 'utf-8');

/// Tests checklist items: [1, 2, 3, 4, 5] — Feature 8.4

describe('Analytics — Feature 8.4', () => {
  /// Tests checklist items: [1] — Feature 8.4
  it('analytics_beacon_script_exists', () => {
    expect(html).toMatch(/beacon\.min\.js/);
  });

  /// Tests checklist items: [2] — Feature 8.4
  it('analytics_beacon_has_defer', () => {
    const match = html.match(/<script[^>]*beacon\.min\.js[^>]*>/);
    expect(match).not.toBeNull();
    expect(match[0]).toMatch(/\bdefer\b/);
  });

  /// Tests checklist items: [1] — Feature 8.4
  it('analytics_beacon_cloudflare_domain', () => {
    const match = html.match(/<script[^>]*src=["']([^"']*)beacon\.min\.js["'][^>]*>/);
    expect(match).not.toBeNull();
    expect(match[1]).toContain('static.cloudflareinsights.com');
  });

  /// Tests checklist items: [4] — Feature 8.4
  it('analytics_beacon_has_token_attribute', () => {
    const match = html.match(/data-cf-beacon='([^']*)'/);
    expect(match).not.toBeNull();
    const json = JSON.parse(match[1]);
    expect(json).toHaveProperty('token');
    expect(json.token.length).toBeGreaterThan(0);
  });

  /// Tests checklist items: [3] — Feature 8.4
  it('analytics_beacon_in_body', () => {
    const bodyMatch = html.match(/<body>([\s\S]*?)<\/body>/);
    expect(bodyMatch).not.toBeNull();
    expect(bodyMatch[1]).toMatch(/beacon\.min\.js/);
  });

  /// Tests checklist items: [3] — Feature 8.4
  it('analytics_beacon_after_module_script', () => {
    const moduleIndex = html.indexOf('src="/src/main.js"');
    const beaconIndex = html.indexOf('beacon.min.js');
    expect(moduleIndex).toBeGreaterThan(-1);
    expect(beaconIndex).toBeGreaterThan(-1);
    expect(beaconIndex).toBeGreaterThan(moduleIndex);
  });
});
