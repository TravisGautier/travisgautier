import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const projectRoot = path.resolve(import.meta.dirname, '..', '..');
const notFoundPath = path.join(projectRoot, 'public', '404.html');
const headersPath = path.join(projectRoot, 'public', '_headers');

describe('404 page', () => {
  /// Tests checklist items: [1]
  it('unit_404_file_exists', () => {
    expect(fs.existsSync(notFoundPath)).toBe(true);
    const content = fs.readFileSync(notFoundPath, 'utf-8');
    expect(content.length).toBeGreaterThan(0);
  });

  /// Tests checklist items: [1]
  it('unit_404_valid_html', () => {
    const content = fs.readFileSync(notFoundPath, 'utf-8');
    expect(content).toContain('<!DOCTYPE html>');
    expect(content).toMatch(/<html\s[^>]*lang="en"/);
    expect(content).toMatch(/<meta\s[^>]*charset=["']UTF-8["']/i);
    expect(content).toMatch(/<meta\s[^>]*name=["']viewport["']/);
  });

  /// Tests checklist items: [1]
  it('unit_404_title', () => {
    const content = fs.readFileSync(notFoundPath, 'utf-8');
    const titleMatch = content.match(/<title>([\s\S]*?)<\/title>/);
    expect(titleMatch).not.toBeNull();
    expect(titleMatch[1]).toMatch(/Page Not Found/i);
    expect(titleMatch[1]).toMatch(/Travis Gautier/i);
  });

  /// Tests checklist items: [2]
  it('unit_404_branded_fonts', () => {
    const content = fs.readFileSync(notFoundPath, 'utf-8');
    expect(content).toMatch(/@font-face\s*\{[^}]*Cormorant Garamond/s);
    expect(content).toMatch(/@font-face\s*\{[^}]*Outfit/s);
    expect(content).toMatch(/\/fonts\//);
    // All @font-face blocks should have font-display: swap
    const fontFaces = [...content.matchAll(/@font-face\s*\{[^}]*\}/gs)];
    expect(fontFaces.length).toBeGreaterThanOrEqual(2);
    for (const [block] of fontFaces) {
      expect(block).toMatch(/font-display:\s*swap/);
    }
  });

  /// Tests checklist items: [3]
  it('unit_404_brand_colors', () => {
    const content = fs.readFileSync(notFoundPath, 'utf-8');
    expect(content).toContain('#c8dcea');
    expect(content).toContain('#b8942e');
  });

  /// Tests checklist items: [4]
  it('unit_404_home_link', () => {
    const content = fs.readFileSync(notFoundPath, 'utf-8');
    expect(content).toMatch(/<a\s[^>]*href=["']\/["']/);
  });

  /// Tests checklist items: [1]
  it('unit_404_favicon', () => {
    const content = fs.readFileSync(notFoundPath, 'utf-8');
    expect(content).toMatch(/<link\s[^>]*rel=["']icon["']/);
  });

  /// Tests checklist items: [1]
  it('unit_404_self_contained', () => {
    const content = fs.readFileSync(notFoundPath, 'utf-8');
    // No external stylesheets
    expect(content).not.toMatch(/<link\s[^>]*rel=["']stylesheet["']/);
    // No script tags (all styles inline)
    expect(content).not.toMatch(/<script[\s>]/);
  });

  /// Tests checklist items: [5]
  it('unit_404_responsive', () => {
    const content = fs.readFileSync(notFoundPath, 'utf-8');
    expect(content).toMatch(/width=device-width/);
  });

  /// Tests checklist items: [6]
  it('unit_404_reduced_motion', () => {
    const content = fs.readFileSync(notFoundPath, 'utf-8');
    expect(content).toMatch(/prefers-reduced-motion/);
  });

  /// Tests checklist items: [1, 6]
  it('unit_404_semantic_html', () => {
    const content = fs.readFileSync(notFoundPath, 'utf-8');
    expect(content).toMatch(/<main[\s>]/);
    expect(content).toMatch(/<h1[\s>]/);
  });

  /// Tests checklist items: [7]
  it('unit_404_cache_header', () => {
    const content = fs.readFileSync(headersPath, 'utf-8');
    expect(content).toMatch(/^\/404\.html\s*$/m);

    // Extract the /404.html block and verify no-cache
    const lines = content.split('\n');
    let capturing = false;
    let block = '';
    for (const line of lines) {
      if (line.trim() === '/404.html') {
        capturing = true;
        continue;
      }
      if (capturing) {
        if (/^\s{2,}\S/.test(line)) {
          block += line + '\n';
        } else if (line.trim() === '') {
          continue;
        } else {
          break;
        }
      }
    }
    expect(block).toMatch(/Cache-Control:\s*no-cache/);
  });
});
