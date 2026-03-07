import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('loading', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  // ============================================================
  // loadAssets unit tests
  // ============================================================

  describe('loadAssets', () => {
    /// Tests checklist items: [3, 5] — Feature 3.5
    it('unit_loadAssets_returns_config', async () => {
      vi.stubGlobal('document', {
        fonts: { ready: Promise.resolve() },
      });

      const expectedConfig = {
        tier: 2, pixelRatio: 1.5, shadowMapSize: 1024,
        shadowsEnabled: true, particleCount: 100,
        pillarCount: 10, pillarFluting: false,
        cloudLayers: 1, skyCloudNoise: true,
      };
      const mockDetermineQuality = vi.fn().mockResolvedValue(expectedConfig);

      const { loadAssets } = await import('../../src/ui/loading.js');
      const config = await loadAssets(mockDetermineQuality);

      expect(mockDetermineQuality).toHaveBeenCalled();
      expect(config).toEqual(expectedConfig);
      expect(config.tier).toBe(2);
      expect(config).toHaveProperty('pixelRatio');
      expect(config).toHaveProperty('shadowsEnabled');
    });

    /// Tests checklist items: [3, 7] — Feature 3.5
    it('unit_loadAssets_timeout_fallback', async () => {
      vi.stubGlobal('document', {
        fonts: { ready: Promise.resolve() },
      });

      const neverResolves = () => new Promise(() => {});
      const mockDetermineQuality = vi.fn().mockImplementation(neverResolves);

      const { loadAssets } = await import('../../src/ui/loading.js');
      const config = await loadAssets(mockDetermineQuality, 50);

      expect(config.tier).toBe(0);
      expect(config.shadowsEnabled).toBe(false);
      expect(config.particleCount).toBe(0);
    }, 2000);

    /// Tests checklist items: [3] — Feature 3.5
    it('unit_loadAssets_font_error_continues', async () => {
      vi.stubGlobal('document', {
        fonts: { ready: Promise.reject(new Error('Font loading failed')) },
      });

      const expectedConfig = {
        tier: 3, pixelRatio: 2, shadowMapSize: 2048,
        shadowsEnabled: true, particleCount: 200,
        pillarCount: 12, pillarFluting: true,
        cloudLayers: 2, skyCloudNoise: true,
      };
      const mockDetermineQuality = vi.fn().mockResolvedValue(expectedConfig);

      const { loadAssets } = await import('../../src/ui/loading.js');
      const config = await loadAssets(mockDetermineQuality);

      expect(config).toEqual(expectedConfig);
    });

    /// Tests checklist items: [3] — Feature 3.5
    it('unit_loadAssets_ssr_safe', async () => {
      // No document stub — pure node env
      const expectedConfig = {
        tier: 1, pixelRatio: 1, shadowMapSize: 0,
        shadowsEnabled: false, particleCount: 50,
        pillarCount: 8, pillarFluting: false,
        cloudLayers: 1, skyCloudNoise: false,
      };
      const mockDetermineQuality = vi.fn().mockResolvedValue(expectedConfig);

      const { loadAssets } = await import('../../src/ui/loading.js');
      const config = await loadAssets(mockDetermineQuality);

      expect(config).toEqual(expectedConfig);
    });
  });

  // ============================================================
  // hideLoading unit tests
  // ============================================================

  describe('hideLoading', () => {
    /// Tests checklist items: [3, 2] — Feature 3.5
    it('unit_hideLoading_sets_opacity', async () => {
      const loadingEl = {
        style: { opacity: '1' },
        addEventListener: vi.fn(),
        remove: vi.fn(),
      };
      const bodyClassList = { add: vi.fn(), contains: vi.fn() };
      vi.stubGlobal('document', {
        getElementById: vi.fn((id) => id === 'loading' ? loadingEl : null),
        body: { classList: bodyClassList },
      });

      const { hideLoading } = await import('../../src/ui/loading.js');
      hideLoading();

      expect(loadingEl.style.opacity).toBe('0');
      expect(bodyClassList.add).toHaveBeenCalledWith('scene-ready');
    });

    /// Tests checklist items: [3] — Feature 3.5
    it('unit_hideLoading_removes_element', async () => {
      let transitionEndCallback;
      const loadingEl = {
        style: { opacity: '1' },
        addEventListener: vi.fn((event, cb) => {
          if (event === 'transitionend') transitionEndCallback = cb;
        }),
        remove: vi.fn(),
      };
      const bodyClassList = { add: vi.fn() };
      vi.stubGlobal('document', {
        getElementById: vi.fn((id) => id === 'loading' ? loadingEl : null),
        body: { classList: bodyClassList },
      });

      const { hideLoading } = await import('../../src/ui/loading.js');
      const promise = hideLoading();

      expect(transitionEndCallback).toBeDefined();
      transitionEndCallback();

      await promise;
      expect(loadingEl.remove).toHaveBeenCalled();
    });

    /// Tests checklist items: [3] — Feature 3.5
    it('unit_hideLoading_no_element_safe', async () => {
      const bodyClassList = { add: vi.fn() };
      vi.stubGlobal('document', {
        getElementById: vi.fn(() => null),
        body: { classList: bodyClassList },
      });

      const { hideLoading } = await import('../../src/ui/loading.js');
      await expect(hideLoading()).resolves.not.toThrow();
      expect(bodyClassList.add).toHaveBeenCalledWith('scene-ready');
    });

    /// Tests checklist items: [3] — Feature 3.5
    it('unit_hideLoading_ssr_safe', async () => {
      // No document stub — pure node env
      const { hideLoading } = await import('../../src/ui/loading.js');
      await expect(hideLoading()).resolves.not.toThrow();
    });
  });

  // ============================================================
  // Accessibility tests
  // ============================================================

  describe('accessibility', () => {
    /// Tests checklist items: [1] — Feature 3.5
    it('a11y_loading_screen_no_focus_trap', () => {
      const projectRoot = path.resolve(import.meta.dirname, '..', '..');
      const html = fs.readFileSync(path.join(projectRoot, 'index.html'), 'utf-8');

      const loadingMatch = html.match(/<div[^>]*id=["']loading["'][^>]*>/);
      expect(loadingMatch).not.toBeNull();
      expect(loadingMatch[0]).toMatch(/pointer-events:\s*none/);
    });
  });
});
