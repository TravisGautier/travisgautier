import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const projectRoot = path.resolve(import.meta.dirname, '..', '..');

describe('scaffold', () => {
  /// Tests checklist items: [4]
  it('build_module_entry', () => {
    const html = fs.readFileSync(path.join(projectRoot, 'index.html'), 'utf-8');

    // Should have module script tag pointing to src/main.js
    expect(html).toContain('<script type="module" src="/src/main.js">');

    // Should NOT have CDN script tag for three.js
    expect(html).not.toMatch(/cdnjs\.cloudflare\.com.*three/);

    // Should NOT have inline IIFE script block
    expect(html).not.toMatch(/\(\(\)\s*=>\s*\{/);
  });

  /// Tests checklist items: [1, 2, 3]
  it('build_file_structure', () => {
    expect(fs.existsSync(path.join(projectRoot, 'src/main.js'))).toBe(true);
    expect(fs.existsSync(path.join(projectRoot, 'src/config/constants.js'))).toBe(true);
    expect(fs.existsSync(path.join(projectRoot, 'src/interaction/state.js'))).toBe(true);
  });
});
