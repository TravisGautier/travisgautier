import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const projectRoot = path.resolve(import.meta.dirname, '..', '..');
const ogImagePath = path.join(projectRoot, 'public', 'og-image.jpg');

describe('OG image — Feature 8.2', () => {
  /// Tests checklist items: [1, 2]
  it('og_image_file_exists', () => {
    expect(fs.existsSync(ogImagePath)).toBe(true);
  });

  /// Tests checklist items: [2]
  it('og_image_valid_jpeg', () => {
    const buf = fs.readFileSync(ogImagePath);
    // JPEG SOI marker: FF D8, followed by FF (start of next marker)
    expect(buf[0]).toBe(0xff);
    expect(buf[1]).toBe(0xd8);
    expect(buf[2]).toBe(0xff);
  });

  /// Tests checklist items: [1]
  it('og_image_dimensions', () => {
    const buf = fs.readFileSync(ogImagePath);
    // Scan for SOF0 (0xFFC0) or SOF2 (0xFFC2) marker to extract dimensions
    let offset = 2;
    while (offset < buf.length - 1) {
      if (buf[offset] !== 0xff) break;
      const marker = buf[offset + 1];
      // SOF0 or SOF2
      if (marker === 0xc0 || marker === 0xc2) {
        const height = buf.readUInt16BE(offset + 5);
        const width = buf.readUInt16BE(offset + 7);
        expect(width).toBe(1200);
        expect(height).toBe(630);
        return;
      }
      // Skip to next marker
      const segmentLength = buf.readUInt16BE(offset + 2);
      offset += 2 + segmentLength;
    }
    // If we get here, no SOF marker was found
    expect.fail('No SOF marker found in JPEG');
  });

  /// Tests checklist items: [2]
  it('og_image_file_size', () => {
    const stat = fs.statSync(ogImagePath);
    // Optimized JPEG: at least 20KB, at most 500KB
    expect(stat.size).toBeGreaterThan(20 * 1024);
    expect(stat.size).toBeLessThan(500 * 1024);
  });

  /// Tests checklist items: [1, 2]
  it('og_image_meta_tag_references', () => {
    const html = fs.readFileSync(path.join(projectRoot, 'index.html'), 'utf-8');

    const ogMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']*)["']/);
    expect(ogMatch).not.toBeNull();
    expect(ogMatch[1]).toMatch(/og-image\.jpg$/);

    const twMatch = html.match(/<meta\s+name=["']twitter:image["']\s+content=["']([^"']*)["']/);
    expect(twMatch).not.toBeNull();
    expect(twMatch[1]).toMatch(/og-image\.jpg$/);
  });
});
