export function initCursor() {
  const cursorEl = typeof document !== 'undefined' ? document.getElementById('cursor') : null;
  const cursorTrail = typeof document !== 'undefined' ? document.getElementById('cursorTrail') : null;

  function updateCursor(state) {
    if (cursorEl) {
      cursorEl.style.left = state.mouse.x + 'px';
      cursorEl.style.top = state.mouse.y + 'px';
    }
    if (cursorTrail) {
      cursorTrail.style.left = state.mouse.x + 'px';
      cursorTrail.style.top = state.mouse.y + 'px';
    }
  }

  if (typeof document !== 'undefined') {
    document.querySelectorAll('[data-hover]').forEach(el => {
      el.addEventListener('mouseenter', () => cursorEl && cursorEl.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursorEl && cursorEl.classList.remove('hover'));
    });
  }

  return { updateCursor };
}
