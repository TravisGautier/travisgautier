import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const projectRoot = path.resolve(import.meta.dirname, '..', '..');

describe('modules build', () => {
  /// Tests checklist items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  it('build_modules_exist', () => {
    const modulePaths = [
      'src/scene/setup.js',
      'src/scene/environment.js',
      'src/scene/temple.js',
      'src/scene/portal.js',
      'src/scene/lighting.js',
      'src/interaction/controls.js',
      'src/interaction/cursor.js',
      'src/interaction/holdMechanic.js',
      'src/ui/overlay.js',
      'src/animate.js',
    ];

    for (const modulePath of modulePaths) {
      expect(
        fs.existsSync(path.join(projectRoot, modulePath)),
        `${modulePath} should exist`,
      ).toBe(true);
    }
  });

  /// Tests checklist items: [11]
  it('build_no_iife_in_index', () => {
    const html = fs.readFileSync(path.join(projectRoot, 'index.html'), 'utf-8');

    // Should have module script tag
    expect(html).toContain('<script type="module" src="/src/main.js">');

    // Should not have inline IIFE
    expect(html).not.toMatch(/\(\(\)\s*=>\s*\{/);

    // Should have no other script tags besides the module entry
    const scriptTags = html.match(/<script[\s>]/g) || [];
    expect(scriptTags.length).toBe(1);
  });

  /// Tests checklist items: [11]
  it('build_main_imports_all', () => {
    const mainContent = fs.readFileSync(
      path.join(projectRoot, 'src/main.js'),
      'utf-8',
    );

    const expectedImports = [
      './scene/setup.js',
      './scene/environment.js',
      './scene/temple.js',
      './scene/portal.js',
      './scene/lighting.js',
      './interaction/controls.js',
      './interaction/cursor.js',
      './ui/overlay.js',
      './animate.js',
    ];

    for (const importPath of expectedImports) {
      expect(
        mainContent,
        `main.js should import from '${importPath}'`,
      ).toContain(importPath);
    }
  });
});
