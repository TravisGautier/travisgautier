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
      querySelectorAll: vi.fn(() => []),
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

  /// Tests checklist items: [6] — Feature 4.3
  it('int_overlay_header_links_purple', async () => {
    const holdFill = { style: { width: '' } };
    const labelLeft = { classList: { add: vi.fn(), remove: vi.fn() } };
    const labelRight = { classList: { add: vi.fn(), remove: vi.fn() } };
    const logo = { classList: { add: vi.fn(), remove: vi.fn() } };
    const overlayEl = {
      classList: { add: vi.fn(), remove: vi.fn(), contains: vi.fn(() => false) },
    };
    const headerLink1 = { classList: { add: vi.fn(), remove: vi.fn() } };
    const headerLink2 = { classList: { add: vi.fn(), remove: vi.fn() } };

    vi.stubGlobal('document', {
      getElementById: vi.fn((id) => {
        if (id === 'holdFill') return holdFill;
        if (id === 'labelLeft') return labelLeft;
        if (id === 'labelRight') return labelRight;
        if (id === 'logo') return logo;
        if (id === 'overlay') return overlayEl;
        return null;
      }),
      querySelectorAll: vi.fn(() => [headerLink1, headerLink2]),
    });

    const { initOverlay } = await import('../../src/ui/overlay.js');
    const { updateOverlay } = initOverlay();

    // p > 0.5 — header links should get .purple
    updateOverlay(0.8, false);
    expect(headerLink1.classList.add).toHaveBeenCalledWith('purple');
    expect(headerLink2.classList.add).toHaveBeenCalledWith('purple');

    // p <= 0.5 — header links should lose .purple
    headerLink1.classList.add.mockClear();
    headerLink2.classList.add.mockClear();
    updateOverlay(0.3, false);
    expect(headerLink1.classList.remove).toHaveBeenCalledWith('purple');
    expect(headerLink2.classList.remove).toHaveBeenCalledWith('purple');
  });
});
