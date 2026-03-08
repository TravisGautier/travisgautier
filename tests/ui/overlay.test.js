import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

/// Tests checklist items: [5] — Feature 4.2

describe('overlay transition fading', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  /// Tests checklist items: [5] — Feature 4.2
  it('int_transition_overlay_fading', async () => {
    const overlayEl = {
      classList: { add: vi.fn(), remove: vi.fn(), contains: vi.fn(() => false) },
    };
    const holdFill = { style: { width: '' } };
    const labelLeft = { classList: { add: vi.fn(), remove: vi.fn() } };
    const labelRight = { classList: { add: vi.fn(), remove: vi.fn() } };
    const logo = { classList: { add: vi.fn(), remove: vi.fn() } };

    vi.stubGlobal('document', {
      getElementById: vi.fn((id) => {
        if (id === 'holdFill') return holdFill;
        if (id === 'labelLeft') return labelLeft;
        if (id === 'labelRight') return labelRight;
        if (id === 'logo') return logo;
        if (id === 'overlay') return overlayEl;
        return null;
      }),
    });

    const { initOverlay } = await import('../../src/ui/overlay.js');
    const { updateOverlay } = initOverlay();

    // Call with transitioning=true — overlay should get .fading class
    updateOverlay(1.0, true);
    expect(overlayEl.classList.add).toHaveBeenCalledWith('fading');

    // Call with transitioning=false — .fading class should be removed
    overlayEl.classList.add.mockClear();
    updateOverlay(1.0, false);
    expect(overlayEl.classList.remove).toHaveBeenCalledWith('fading');
  });
});
