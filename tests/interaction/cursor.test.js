import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('cursor', () => {
  let cursorEl;
  let cursorTrailEl;

  beforeEach(() => {
    vi.resetModules();
    cursorEl = { style: { left: '', top: '' }, classList: { add: vi.fn(), remove: vi.fn() } };
    cursorTrailEl = { style: { left: '', top: '' }, classList: { add: vi.fn(), remove: vi.fn() } };
    vi.stubGlobal('document', {
      getElementById: vi.fn((id) => {
        if (id === 'cursor') return cursorEl;
        if (id === 'cursorTrail') return cursorTrailEl;
        return null;
      }),
      querySelectorAll: vi.fn(() => []),
    });
  });

  /// Tests checklist items: [3] — Feature 5.4
  it('unit_updateCursor_skips_on_touch_device', async () => {
    const { initCursor } = await import('../../src/interaction/cursor.js');
    const { updateCursor } = initCursor();

    const mockState = { mouse: { x: 100, y: 200 }, isTouchDevice: true };
    updateCursor(mockState);

    expect(cursorEl.style.left).toBe('');
    expect(cursorEl.style.top).toBe('');
    expect(cursorTrailEl.style.left).toBe('');
    expect(cursorTrailEl.style.top).toBe('');
  });

  /// Tests checklist items: [3] — Feature 5.4
  it('unit_updateCursor_updates_on_mouse_device', async () => {
    const { initCursor } = await import('../../src/interaction/cursor.js');
    const { updateCursor } = initCursor();

    const mockState = { mouse: { x: 100, y: 200 }, isTouchDevice: false };
    updateCursor(mockState);

    expect(cursorEl.style.left).toBe('100px');
    expect(cursorEl.style.top).toBe('200px');
    expect(cursorTrailEl.style.left).toBe('100px');
    expect(cursorTrailEl.style.top).toBe('200px');
  });
});
