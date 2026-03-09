import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const html = fs.readFileSync(path.resolve('index.html'), 'utf-8');
const projectRoot = path.resolve(import.meta.dirname, '..', '..');

/// Tests checklist items: [1, 2, 3, 4, 5, 6, 7, 8, 9] — Feature 8.5

describe('Social sharing previews — Feature 8.5', () => {
  // --- Platform-Specific Verification ---

  /// Tests checklist items: [6]
  it('social_facebook_og_required', () => {
    const ogTitle = html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']*)["']/);
    const ogType = html.match(/<meta\s+property=["']og:type["']\s+content=["']([^"']*)["']/);
    const ogImage = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']*)["']/);
    const ogUrl = html.match(/<meta\s+property=["']og:url["']\s+content=["']([^"']*)["']/);

    expect(ogTitle).not.toBeNull();
    expect(ogTitle[1].length).toBeGreaterThan(0);
    expect(ogType).not.toBeNull();
    expect(ogType[1].length).toBeGreaterThan(0);
    expect(ogImage).not.toBeNull();
    expect(ogImage[1].length).toBeGreaterThan(0);
    expect(ogUrl).not.toBeNull();
    expect(ogUrl[1].length).toBeGreaterThan(0);
  });

  /// Tests checklist items: [2, 4, 5]
  it('social_facebook_og_recommended', () => {
    expect(html).toMatch(/<meta\s+property=["']og:description["']\s+content=["']([^"']*)["']/);
    expect(html).toMatch(/<meta\s+property=["']og:image:width["']\s+content=["']([^"']*)["']/);
    expect(html).toMatch(/<meta\s+property=["']og:image:height["']\s+content=["']([^"']*)["']/);
    expect(html).toMatch(/<meta\s+property=["']og:site_name["']\s+content=["']([^"']*)["']/);
    expect(html).toMatch(/<meta\s+property=["']og:locale["']\s+content=["']([^"']*)["']/);
  });

  /// Tests checklist items: [1, 6]
  it('social_twitter_card_complete', () => {
    expect(html).toMatch(/<meta\s+name=["']twitter:card["']\s+content=["']([^"']*)["']/);
    expect(html).toMatch(/<meta\s+name=["']twitter:title["']\s+content=["']([^"']*)["']/);
    expect(html).toMatch(/<meta\s+name=["']twitter:description["']\s+content=["']([^"']*)["']/);
    expect(html).toMatch(/<meta\s+name=["']twitter:image["']\s+content=["']([^"']*)["']/);
  });

  /// Tests checklist items: [6]
  it('social_linkedin_compatibility', () => {
    const ogTitle = html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']*)["']/);
    const ogDesc = html.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']*)["']/);
    const ogImage = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']*)["']/);
    const ogUrl = html.match(/<meta\s+property=["']og:url["']\s+content=["']([^"']*)["']/);

    expect(ogTitle).not.toBeNull();
    expect(ogTitle[1].length).toBeGreaterThan(0);
    expect(ogDesc).not.toBeNull();
    expect(ogDesc[1].length).toBeGreaterThan(0);
    expect(ogImage).not.toBeNull();
    expect(ogImage[1].length).toBeGreaterThan(0);
    expect(ogUrl).not.toBeNull();
    expect(ogUrl[1].length).toBeGreaterThan(0);
  });

  /// Tests checklist items: [4, 6]
  it('social_slack_unfurl', () => {
    const ogSiteName = html.match(/<meta\s+property=["']og:site_name["']\s+content=["']([^"']*)["']/);
    const ogDesc = html.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']*)["']/);

    expect(ogSiteName).not.toBeNull();
    expect(ogSiteName[1].length).toBeGreaterThan(0);
    expect(ogDesc).not.toBeNull();
    expect(ogDesc[1].length).toBeGreaterThan(0);
  });

  /// Tests checklist items: [6]
  it('social_imessage_preview', () => {
    expect(html).toMatch(/<meta\s+property=["']og:title["']\s+content=["']([^"']*)["']/);
    expect(html).toMatch(/<meta\s+property=["']og:image["']\s+content=["']([^"']*)["']/);
  });

  // --- Length Limits ---

  /// Tests checklist items: [7]
  it('social_title_length_limits', () => {
    const ogTitle = html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']*)["']/);
    const twTitle = html.match(/<meta\s+name=["']twitter:title["']\s+content=["']([^"']*)["']/);

    expect(ogTitle).not.toBeNull();
    expect(ogTitle[1].length).toBeLessThanOrEqual(60);
    expect(twTitle).not.toBeNull();
    expect(twTitle[1].length).toBeLessThanOrEqual(70);
  });

  /// Tests checklist items: [7]
  it('social_description_length_limits', () => {
    const ogDesc = html.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']*)["']/);
    const twDesc = html.match(/<meta\s+name=["']twitter:description["']\s+content=["']([^"']*)["']/);

    expect(ogDesc).not.toBeNull();
    expect(ogDesc[1].length).toBeLessThanOrEqual(155);
    expect(twDesc).not.toBeNull();
    expect(twDesc[1].length).toBeLessThanOrEqual(200);
  });

  // --- URL & Image Validation ---

  /// Tests checklist items: [8]
  it('social_image_url_https', () => {
    const ogImage = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']*)["']/);
    const twImage = html.match(/<meta\s+name=["']twitter:image["']\s+content=["']([^"']*)["']/);

    expect(ogImage).not.toBeNull();
    expect(ogImage[1]).toMatch(/^https:\/\//);
    expect(twImage).not.toBeNull();
    expect(twImage[1]).toMatch(/^https:\/\//);
  });

  /// Tests checklist items: [2]
  it('social_og_image_dimensions_declared', () => {
    const width = html.match(/<meta\s+property=["']og:image:width["']\s+content=["']([^"']*)["']/);
    const height = html.match(/<meta\s+property=["']og:image:height["']\s+content=["']([^"']*)["']/);

    expect(width).not.toBeNull();
    expect(width[1]).toBe('1200');
    expect(height).not.toBeNull();
    expect(height[1]).toBe('630');
  });

  /// Tests checklist items: [2]
  it('social_og_image_dimensions_match_actual', () => {
    const width = html.match(/<meta\s+property=["']og:image:width["']\s+content=["']([^"']*)["']/);
    const height = html.match(/<meta\s+property=["']og:image:height["']\s+content=["']([^"']*)["']/);

    expect(width).not.toBeNull();
    expect(height).not.toBeNull();

    const declaredWidth = parseInt(width[1], 10);
    const declaredHeight = parseInt(height[1], 10);

    // Read actual JPEG dimensions from SOF marker
    const ogImagePath = path.join(projectRoot, 'public', 'og-image.jpg');
    const buf = fs.readFileSync(ogImagePath);
    let offset = 2;
    let actualWidth = 0;
    let actualHeight = 0;
    while (offset < buf.length - 1) {
      if (buf[offset] !== 0xff) break;
      const marker = buf[offset + 1];
      if (marker === 0xc0 || marker === 0xc2) {
        actualHeight = buf.readUInt16BE(offset + 5);
        actualWidth = buf.readUInt16BE(offset + 7);
        break;
      }
      const segmentLength = buf.readUInt16BE(offset + 2);
      offset += 2 + segmentLength;
    }

    expect(actualWidth).toBe(declaredWidth);
    expect(actualHeight).toBe(declaredHeight);
  });

  // --- Content Quality ---

  /// Tests checklist items: [3]
  it('social_og_image_alt_descriptive', () => {
    const alt = html.match(/<meta\s+property=["']og:image:alt["']\s+content=["']([^"']*)["']/);
    const title = html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']*)["']/);

    expect(alt).not.toBeNull();
    expect(alt[1].length).toBeGreaterThan(10);
    expect(alt[1]).not.toBe(title[1]);
  });

  /// Tests checklist items: [5]
  it('social_og_locale_format', () => {
    const locale = html.match(/<meta\s+property=["']og:locale["']\s+content=["']([^"']*)["']/);

    expect(locale).not.toBeNull();
    expect(locale[1]).toMatch(/^[a-z]{2}_[A-Z]{2}$/);
  });

  // --- Consistency ---

  /// Tests checklist items: [8]
  it('social_og_twitter_title_match', () => {
    const ogTitle = html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']*)["']/);
    const twTitle = html.match(/<meta\s+name=["']twitter:title["']\s+content=["']([^"']*)["']/);

    expect(ogTitle).not.toBeNull();
    expect(twTitle).not.toBeNull();
    expect(ogTitle[1]).toBe(twTitle[1]);
  });

  /// Tests checklist items: [8]
  it('social_og_twitter_image_match', () => {
    const ogImage = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']*)["']/);
    const twImage = html.match(/<meta\s+name=["']twitter:image["']\s+content=["']([^"']*)["']/);

    expect(ogImage).not.toBeNull();
    expect(twImage).not.toBeNull();
    expect(ogImage[1]).toBe(twImage[1]);
  });

  /// Tests checklist items: [1, 8]
  it('social_og_twitter_description_match', () => {
    const ogDesc = html.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']*)["']/);
    const twDesc = html.match(/<meta\s+name=["']twitter:description["']\s+content=["']([^"']*)["']/);

    expect(ogDesc).not.toBeNull();
    expect(twDesc).not.toBeNull();
    expect(ogDesc[1]).toBe(twDesc[1]);
  });

  // --- Head Section ---

  /// Tests checklist items: [9]
  it('social_all_new_tags_in_head', () => {
    const headMatch = html.match(/<head>([\s\S]*?)<\/head>/);
    expect(headMatch).not.toBeNull();
    const head = headMatch[1];

    expect(head).toMatch(/<meta\s+name=["']twitter:description["']/);
    expect(head).toMatch(/<meta\s+property=["']og:image:width["']/);
    expect(head).toMatch(/<meta\s+property=["']og:image:height["']/);
    expect(head).toMatch(/<meta\s+property=["']og:image:alt["']/);
    expect(head).toMatch(/<meta\s+property=["']og:site_name["']/);
    expect(head).toMatch(/<meta\s+property=["']og:locale["']/);
  });
});
