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

export function showContextLostMessage() {
  if (typeof document === 'undefined') return;
  const overlay = document.createElement('div');
  overlay.className = 'context-lost-overlay';
  overlay.innerHTML =
    '<div class="context-lost-title">Session Interrupted</div>' +
    '<p>The graphics session was paused by your device.</p>' +
    '<button class="context-lost-btn" onclick="location.reload()">Reload</button>';
  document.body.appendChild(overlay);
}

export function hideContextLostMessage() {
  if (typeof document === 'undefined') return;
  const overlay = document.querySelector('.context-lost-overlay');
  if (overlay) overlay.remove();
}
