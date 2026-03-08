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

/// Tests checklist items: [2, 3, 6, 7, 8] — Feature 4.5

describe('overlay hints polish', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  /// Tests checklist items: [2, 6] — Feature 4.5
  it('unit_overlay_hints_purple_class', async () => {
    const holdFill = { style: { width: '' } };
    const labelLeft = { classList: { add: vi.fn(), remove: vi.fn() } };
    const labelRight = { classList: { add: vi.fn(), remove: vi.fn() } };
    const logo = { classList: { add: vi.fn(), remove: vi.fn() } };
    const overlayEl = {
      classList: { add: vi.fn(), remove: vi.fn(), contains: vi.fn(() => false) },
    };
    const scrollHint = { classList: { add: vi.fn(), remove: vi.fn() } };
    const holdHint = { classList: { add: vi.fn(), remove: vi.fn() } };
    const scrollLine = { classList: { add: vi.fn(), remove: vi.fn() } };

    vi.stubGlobal('document', {
      getElementById: vi.fn((id) => {
        if (id === 'holdFill') return holdFill;
        if (id === 'labelLeft') return labelLeft;
        if (id === 'labelRight') return labelRight;
        if (id === 'logo') return logo;
        if (id === 'overlay') return overlayEl;
        if (id === 'scrollHint') return scrollHint;
        if (id === 'holdHint') return holdHint;
        if (id === 'scrollLine') return scrollLine;
        return null;
      }),
      querySelectorAll: vi.fn(() => []),
    });

    const { initOverlay } = await import('../../src/ui/overlay.js');
    const { updateOverlay } = initOverlay();

    // p > 0.5 — hint elements should get .purple
    updateOverlay(0.8, false, { scroll: 0, hasEngaged: false });
    expect(scrollHint.classList.add).toHaveBeenCalledWith('purple');
    expect(holdHint.classList.add).toHaveBeenCalledWith('purple');
    expect(scrollLine.classList.add).toHaveBeenCalledWith('purple');

    // p <= 0.5 — hint elements should lose .purple
    scrollHint.classList.add.mockClear();
    holdHint.classList.add.mockClear();
    scrollLine.classList.add.mockClear();
    updateOverlay(0.3, false, { scroll: 0, hasEngaged: false });
    expect(scrollHint.classList.remove).toHaveBeenCalledWith('purple');
    expect(holdHint.classList.remove).toHaveBeenCalledWith('purple');
    expect(scrollLine.classList.remove).toHaveBeenCalledWith('purple');
  });

  /// Tests checklist items: [3, 7] — Feature 4.5
  it('unit_overlay_scroll_hint_autohide', async () => {
    const holdFill = { style: { width: '' } };
    const labelLeft = { classList: { add: vi.fn(), remove: vi.fn() } };
    const labelRight = { classList: { add: vi.fn(), remove: vi.fn() } };
    const logo = { classList: { add: vi.fn(), remove: vi.fn() } };
    const overlayEl = {
      classList: { add: vi.fn(), remove: vi.fn(), contains: vi.fn(() => false) },
    };
    const scrollHint = { classList: { add: vi.fn(), remove: vi.fn() } };
    const holdHint = { classList: { add: vi.fn(), remove: vi.fn() } };
    const scrollLine = { classList: { add: vi.fn(), remove: vi.fn() } };

    vi.stubGlobal('document', {
      getElementById: vi.fn((id) => {
        if (id === 'holdFill') return holdFill;
        if (id === 'labelLeft') return labelLeft;
        if (id === 'labelRight') return labelRight;
        if (id === 'logo') return logo;
        if (id === 'overlay') return overlayEl;
        if (id === 'scrollHint') return scrollHint;
        if (id === 'holdHint') return holdHint;
        if (id === 'scrollLine') return scrollLine;
        return null;
      }),
      querySelectorAll: vi.fn(() => []),
    });

    const { initOverlay } = await import('../../src/ui/overlay.js');
    const { updateOverlay } = initOverlay();

    // scroll = 0 — scroll hint should be visible (remove hint-hidden)
    updateOverlay(0.3, false, { scroll: 0, hasEngaged: false });
    expect(scrollHint.classList.remove).toHaveBeenCalledWith('hint-hidden');

    // scroll = 0.1 — scroll hint should be hidden (add hint-hidden)
    scrollHint.classList.add.mockClear();
    updateOverlay(0.3, false, { scroll: 0.1, hasEngaged: false });
    expect(scrollHint.classList.add).toHaveBeenCalledWith('hint-hidden');
  });

  /// Tests checklist items: [3, 8] — Feature 4.5
  it('unit_overlay_hold_hint_autohide', async () => {
    const holdFill = { style: { width: '' } };
    const labelLeft = { classList: { add: vi.fn(), remove: vi.fn() } };
    const labelRight = { classList: { add: vi.fn(), remove: vi.fn() } };
    const logo = { classList: { add: vi.fn(), remove: vi.fn() } };
    const overlayEl = {
      classList: { add: vi.fn(), remove: vi.fn(), contains: vi.fn(() => false) },
    };
    const scrollHint = { classList: { add: vi.fn(), remove: vi.fn() } };
    const holdHint = { classList: { add: vi.fn(), remove: vi.fn() } };
    const scrollLine = { classList: { add: vi.fn(), remove: vi.fn() } };

    vi.stubGlobal('document', {
      getElementById: vi.fn((id) => {
        if (id === 'holdFill') return holdFill;
        if (id === 'labelLeft') return labelLeft;
        if (id === 'labelRight') return labelRight;
        if (id === 'logo') return logo;
        if (id === 'overlay') return overlayEl;
        if (id === 'scrollHint') return scrollHint;
        if (id === 'holdHint') return holdHint;
        if (id === 'scrollLine') return scrollLine;
        return null;
      }),
      querySelectorAll: vi.fn(() => []),
    });

    const { initOverlay } = await import('../../src/ui/overlay.js');
    const { updateOverlay } = initOverlay();

    // hasEngaged = false — hold hint should be visible (remove hint-hidden)
    updateOverlay(0.3, false, { scroll: 0, hasEngaged: false });
    expect(holdHint.classList.remove).toHaveBeenCalledWith('hint-hidden');

    // hasEngaged = true — hold hint should be hidden (add hint-hidden)
    holdHint.classList.add.mockClear();
    updateOverlay(0.3, false, { scroll: 0, hasEngaged: true });
    expect(holdHint.classList.add).toHaveBeenCalledWith('hint-hidden');
  });

  /// Tests checklist items: [6] — Feature 4.5
  it('unit_overlay_backward_compat', async () => {
    const holdFill = { style: { width: '' } };
    const labelLeft = { classList: { add: vi.fn(), remove: vi.fn() } };
    const labelRight = { classList: { add: vi.fn(), remove: vi.fn() } };
    const logo = { classList: { add: vi.fn(), remove: vi.fn() } };
    const overlayEl = {
      classList: { add: vi.fn(), remove: vi.fn(), contains: vi.fn(() => false) },
    };

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

    // Calling with only 2 args (no state) should not throw
    expect(() => updateOverlay(0.5, false)).not.toThrow();
  });
});
