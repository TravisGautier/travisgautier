import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const html = fs.readFileSync(path.resolve('index.html'), 'utf-8');

/// Tests checklist items: [1, 2, 3, 4, 5] — Feature 8.1

describe('SEO meta tags — Feature 8.1', () => {
  /// Tests checklist items: [1] — Feature 8.1
  it('seo_description_exists', () => {
    const match = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/);
    expect(match).not.toBeNull();
    expect(match[1]).toContain('Travis Gautier');
    expect(match[1].length).toBeGreaterThan(0);
  });

  /// Tests checklist items: [2] — Feature 8.1
  it('seo_og_title', () => {
    const match = html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']*)["']/);
    expect(match).not.toBeNull();
    expect(match[1]).toBe('Travis Gautier');
  });

  /// Tests checklist items: [2] — Feature 8.1
  it('seo_og_description', () => {
    const match = html.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']*)["']/);
    expect(match).not.toBeNull();
    expect(match[1]).toMatch(/Innovation/i);
    expect(match[1]).toMatch(/Creative/i);
  });

  /// Tests checklist items: [2] — Feature 8.1
  it('seo_og_image', () => {
    const match = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']*)["']/);
    expect(match).not.toBeNull();
    expect(match[1]).toMatch(/^https:\/\//);
  });

  /// Tests checklist items: [2] — Feature 8.1
  it('seo_og_url', () => {
    const match = html.match(/<meta\s+property=["']og:url["']\s+content=["']([^"']*)["']/);
    expect(match).not.toBeNull();
    expect(match[1]).toBe('https://travisgautier.com');
  });

  /// Tests checklist items: [2] — Feature 8.1
  it('seo_og_type', () => {
    const match = html.match(/<meta\s+property=["']og:type["']\s+content=["']([^"']*)["']/);
    expect(match).not.toBeNull();
    expect(match[1]).toBe('website');
  });

  /// Tests checklist items: [3] — Feature 8.1
  it('seo_twitter_card', () => {
    const match = html.match(/<meta\s+name=["']twitter:card["']\s+content=["']([^"']*)["']/);
    expect(match).not.toBeNull();
    expect(match[1]).toBe('summary_large_image');
  });

  /// Tests checklist items: [3] — Feature 8.1
  it('seo_twitter_title', () => {
    const match = html.match(/<meta\s+name=["']twitter:title["']\s+content=["']([^"']*)["']/);
    expect(match).not.toBeNull();
    expect(match[1]).toBe('Travis Gautier');
  });

  /// Tests checklist items: [3] — Feature 8.1
  it('seo_twitter_image', () => {
    const match = html.match(/<meta\s+name=["']twitter:image["']\s+content=["']([^"']*)["']/);
    expect(match).not.toBeNull();
    expect(match[1]).toMatch(/^https:\/\//);
  });

  /// Tests checklist items: [4] — Feature 8.1
  it('seo_canonical_url', () => {
    const match = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']*)["']/);
    expect(match).not.toBeNull();
    expect(match[1]).toBe('https://travisgautier.com');
  });

  /// Tests checklist items: [5] — Feature 8.1
  it('seo_jsonld_exists', () => {
    expect(html).toMatch(/<script\s+type=["']application\/ld\+json["']>/);
  });

  /// Tests checklist items: [5] — Feature 8.1
  it('seo_jsonld_valid_json', () => {
    const match = html.match(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/);
    expect(match).not.toBeNull();
    expect(() => JSON.parse(match[1])).not.toThrow();
  });

  /// Tests checklist items: [5] — Feature 8.1
  it('seo_jsonld_person_schema', () => {
    const match = html.match(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/);
    expect(match).not.toBeNull();
    const data = JSON.parse(match[1]);
    expect(data['@context']).toBe('https://schema.org');
    expect(data['@type']).toBe('Person');
    expect(data.name).toBe('Travis Gautier');
    expect(data.url).toBe('https://travisgautier.com');
  });

  /// Tests checklist items: [1, 2, 3, 4, 5] — Feature 8.1
  it('seo_meta_tags_in_head', () => {
    const headMatch = html.match(/<head>([\s\S]*?)<\/head>/);
    expect(headMatch).not.toBeNull();
    const head = headMatch[1];

    // Description meta tag in head
    expect(head).toMatch(/<meta\s+name=["']description["']/);

    // OG meta tags in head
    expect(head).toMatch(/<meta\s+property=["']og:title["']/);
    expect(head).toMatch(/<meta\s+property=["']og:description["']/);
    expect(head).toMatch(/<meta\s+property=["']og:image["']/);
    expect(head).toMatch(/<meta\s+property=["']og:url["']/);
    expect(head).toMatch(/<meta\s+property=["']og:type["']/);

    // Twitter meta tags in head
    expect(head).toMatch(/<meta\s+name=["']twitter:card["']/);
    expect(head).toMatch(/<meta\s+name=["']twitter:title["']/);
    expect(head).toMatch(/<meta\s+name=["']twitter:image["']/);

    // Canonical link in head
    expect(head).toMatch(/<link\s+rel=["']canonical["']/);

    // JSON-LD script in head
    expect(head).toMatch(/<script\s+type=["']application\/ld\+json["']>/);
  });
});
