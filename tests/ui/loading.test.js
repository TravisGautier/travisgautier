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

    /// Tests checklist items: [3] — Feature 10.2
    it('unit_hideLoading_timeout_fallback', async () => {
      vi.useFakeTimers();

      const loadingEl = {
        style: { opacity: '1' },
        addEventListener: vi.fn(), // never fires transitionend
        remove: vi.fn(),
      };
      const bodyClassList = { add: vi.fn() };
      vi.stubGlobal('document', {
        getElementById: vi.fn((id) => id === 'loading' ? loadingEl : null),
        body: { classList: bodyClassList },
      });

      const { hideLoading } = await import('../../src/ui/loading.js');
      const promise = hideLoading();

      // Advance past the 3s timeout fallback
      await vi.advanceTimersByTimeAsync(3000);
      await promise;

      expect(loadingEl.style.opacity).toBe('0');
      expect(bodyClassList.add).toHaveBeenCalledWith('scene-ready');
      expect(loadingEl.remove).toHaveBeenCalledTimes(1);

      vi.useRealTimers();
    });

    /// Tests checklist items: [3] — Feature 10.2
    it('unit_hideLoading_no_double_remove', async () => {
      const transitionEndCallbacks = [];
      const loadingEl = {
        style: { opacity: '1' },
        addEventListener: vi.fn((event, cb) => {
          if (event === 'transitionend') transitionEndCallbacks.push(cb);
        }),
        remove: vi.fn(),
      };
      const bodyClassList = { add: vi.fn() };
      vi.stubGlobal('document', {
        getElementById: vi.fn((id) => id === 'loading' ? loadingEl : null),
        body: { classList: bodyClassList },
      });

      const { hideLoading } = await import('../../src/ui/loading.js');

      // Call hideLoading twice (simulating double-call race)
      hideLoading();
      hideLoading();

      // Fire all registered transitionend callbacks
      for (const cb of transitionEndCallbacks) cb();

      // A settled guard should prevent double removal
      expect(loadingEl.remove).toHaveBeenCalledTimes(1);
    });

    /// Tests checklist items: [3] — Feature 10.2
    it('unit_hideLoading_transitionend_before_timeout', async () => {
      vi.useFakeTimers();

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

      // transitionend fires immediately
      transitionEndCallback();
      await promise;

      // Advance past 3s — timeout should have been set and should be a no-op
      await vi.advanceTimersByTimeAsync(3000);

      expect(loadingEl.remove).toHaveBeenCalledTimes(1);

      // Verify a setTimeout was registered (timeout safety exists)
      const setTimeoutCalls = vi.getTimerCount();
      // The implementation should have registered a setTimeout for fallback
      // Current impl has no setTimeout, so this verifies timeout safety was added
      expect(loadingEl.addEventListener).toHaveBeenCalledWith('transitionend', expect.any(Function));
      // Check that hideLoading function body uses setTimeout as a safety net
      const loadingSrc = (await import('fs')).readFileSync(
        (await import('path')).resolve(import.meta.dirname, '../../src/ui/loading.js'), 'utf-8'
      );
      const hideLoadingBody = loadingSrc.slice(loadingSrc.indexOf('function hideLoading'));
      expect(hideLoadingBody).toContain('setTimeout');

      vi.useRealTimers();
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

    /// Tests checklist items: [4] — Feature 10.2
    it('a11y_loading_screen_typography', () => {
      const projectRoot = path.resolve(import.meta.dirname, '..', '..');
      const html = fs.readFileSync(path.join(projectRoot, 'index.html'), 'utf-8');

      const loadingMatch = html.match(/<div[^>]*id=["']loading["'][^>]*>/);
      expect(loadingMatch).not.toBeNull();
      const loadingTag = loadingMatch[0];

      expect(loadingTag).toMatch(/Cormorant Garamond/);
      expect(loadingTag).toMatch(/letter-spacing:\s*0\.35em/);
      expect(loadingTag).toMatch(/text-transform:\s*uppercase/);
      expect(loadingTag).toMatch(/font-weight:\s*300/);
    });
  });

  // ============================================================
  // Integration tests
  // ============================================================

  describe('integration', () => {
    /// Tests checklist items: [1, 2] — Feature 10.2
    it('int_main_calls_hideLoading_for_normal_path', () => {
      const projectRoot = path.resolve(import.meta.dirname, '..', '..');
      const mainSrc = fs.readFileSync(path.join(projectRoot, 'src/main.js'), 'utf-8');

      // hideLoading() should appear at least twice — once in fallback, once in normal path
      const matches = mainSrc.match(/hideLoading\s*\(/g) || [];
      expect(matches.length).toBeGreaterThanOrEqual(2);
    });
  });
});
