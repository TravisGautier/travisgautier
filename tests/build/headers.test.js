import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const projectRoot = path.resolve(import.meta.dirname, '..', '..');
const headersPath = path.join(projectRoot, 'public', '_headers');

describe('caching headers', () => {
  /// Tests checklist items: [1]
  it('build_headers_file_exists', () => {
    expect(fs.existsSync(headersPath)).toBe(true);
  });

  /// Tests checklist items: [1]
  it('build_headers_html_no_cache', () => {
    const content = fs.readFileSync(headersPath, 'utf-8');

    // / path should have no-cache
    expect(content).toMatch(/^\/\s*$/m);
    expect(content).toMatch(/Cache-Control:\s*no-cache/);

    // /index.html path should also have no-cache
    expect(content).toMatch(/^\/index\.html\s*$/m);
  });

  /// Tests checklist items: [1]
  it('build_headers_assets_immutable', () => {
    const content = fs.readFileSync(headersPath, 'utf-8');

    // /assets/* block should exist with immutable caching
    expect(content).toMatch(/^\/assets\/\*\s*$/m);

    // Extract the /assets/* block and check its headers
    const assetsBlock = extractBlock(content, '/assets/*');
    expect(assetsBlock).toMatch(/max-age=31536000/);
    expect(assetsBlock).toMatch(/immutable/);
  });

  /// Tests checklist items: [1]
  it('build_headers_fonts_immutable', () => {
    const content = fs.readFileSync(headersPath, 'utf-8');

    // /fonts/* block should exist with immutable caching
    expect(content).toMatch(/^\/fonts\/\*\s*$/m);

    // Extract the /fonts/* block and check its headers
    const fontsBlock = extractBlock(content, '/fonts/*');
    expect(fontsBlock).toMatch(/max-age=31536000/);
    expect(fontsBlock).toMatch(/immutable/);
  });

  /// Tests checklist items: [1]
  it('build_headers_valid_syntax', () => {
    const content = fs.readFileSync(headersPath, 'utf-8');
    const lines = content.split('\n');

    for (const line of lines) {
      // Every line must be: blank, a comment (#...), a path (/...), or an indented header (  Key: value)
      const isBlank = line.trim() === '';
      const isComment = line.trimStart().startsWith('#');
      const isPath = /^\/\S*\s*$/.test(line);
      const isHeader = /^\s{2,}\S+:/.test(line);

      expect(
        isBlank || isComment || isPath || isHeader,
        `Invalid _headers line: "${line}"`,
      ).toBe(true);
    }
  });

  /// Tests checklist items: [1]
  it('build_headers_no_duplicate_paths', () => {
    const content = fs.readFileSync(headersPath, 'utf-8');
    const lines = content.split('\n');

    const paths = lines
      .filter((line) => /^\/\S*\s*$/.test(line))
      .map((line) => line.trim());

    const unique = new Set(paths);
    expect(unique.size).toBe(paths.length);
  });
});

/**
 * Extract the header lines belonging to a specific path block.
 */
function extractBlock(content, pathPattern) {
  const lines = content.split('\n');
  let capturing = false;
  let block = '';

  for (const line of lines) {
    if (line.trim() === pathPattern) {
      capturing = true;
      continue;
    }
    if (capturing) {
      // Indented lines belong to this block
      if (/^\s{2,}\S/.test(line)) {
        block += line + '\n';
      } else if (line.trim() === '') {
        // Blank line may separate blocks — keep going
        continue;
      } else {
        // New path block — stop
        break;
      }
    }
  }
  return block;
}
