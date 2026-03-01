export function initOverlay() {
  const holdFill = typeof document !== 'undefined' ? document.getElementById('holdFill') : null;
  const labelLeft = typeof document !== 'undefined' ? document.getElementById('labelLeft') : null;
  const labelRight = typeof document !== 'undefined' ? document.getElementById('labelRight') : null;
  const logo = typeof document !== 'undefined' ? document.getElementById('logo') : null;

  function updateOverlay(p) {
    if (holdFill) holdFill.style.width = (p * 100) + '%';
    if (p > 0.5) {
      if (labelLeft) labelLeft.classList.add('hidden');
      if (labelRight) labelRight.classList.add('visible');
      if (logo) logo.classList.add('purple');
    } else {
      if (labelLeft) labelLeft.classList.remove('hidden');
      if (labelRight) labelRight.classList.remove('visible');
      if (logo) logo.classList.remove('purple');
    }
  }

  return { updateOverlay };
}
