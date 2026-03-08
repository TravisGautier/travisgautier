export function initOverlay() {
  const holdFill = typeof document !== 'undefined' ? document.getElementById('holdFill') : null;
  const labelLeft = typeof document !== 'undefined' ? document.getElementById('labelLeft') : null;
  const labelRight = typeof document !== 'undefined' ? document.getElementById('labelRight') : null;
  const logo = typeof document !== 'undefined' ? document.getElementById('logo') : null;
  const overlay = typeof document !== 'undefined' ? document.getElementById('overlay') : null;
  const headerLinks = typeof document !== 'undefined' ? document.querySelectorAll('.header-link') : [];
  const scrollHint = typeof document !== 'undefined' ? document.getElementById('scrollHint') : null;
  const holdHint = typeof document !== 'undefined' ? document.getElementById('holdHint') : null;
  const scrollLine = typeof document !== 'undefined' ? document.getElementById('scrollLine') : null;
  const ventureAnnouncer = typeof document !== 'undefined' ? document.getElementById('venture-announcer') : null;
  let lastAnnouncedSide = null;

  function updateOverlay(p, transitioning, state) {
    if (holdFill) holdFill.style.width = (p * 100) + '%';
    const currentSide = p > 0.5 ? 'purple' : 'gold';
    if (ventureAnnouncer && currentSide !== lastAnnouncedSide) {
      ventureAnnouncer.textContent = currentSide === 'purple'
        ? 'Now showing Venture Omega: Creative & Strategy'
        : 'Now showing Venture Alpha: Innovation & Technology';
      lastAnnouncedSide = currentSide;
    }
    if (p > 0.5) {
      if (labelLeft) labelLeft.classList.add('hidden');
      if (labelRight) labelRight.classList.add('visible');
      if (logo) logo.classList.add('purple');
      headerLinks.forEach(link => link.classList.add('purple'));
      if (scrollHint) scrollHint.classList.add('purple');
      if (holdHint) holdHint.classList.add('purple');
      if (scrollLine) scrollLine.classList.add('purple');
    } else {
      if (labelLeft) labelLeft.classList.remove('hidden');
      if (labelRight) labelRight.classList.remove('visible');
      if (logo) logo.classList.remove('purple');
      headerLinks.forEach(link => link.classList.remove('purple'));
      if (scrollHint) scrollHint.classList.remove('purple');
      if (holdHint) holdHint.classList.remove('purple');
      if (scrollLine) scrollLine.classList.remove('purple');
    }
    if (state) {
      if (scrollHint) {
        if (state.scroll > 0) {
          scrollHint.classList.add('hint-hidden');
        } else {
          scrollHint.classList.remove('hint-hidden');
        }
      }
      if (holdHint) {
        if (state.hasEngaged) {
          holdHint.classList.add('hint-hidden');
        } else {
          holdHint.classList.remove('hint-hidden');
        }
      }
    }
    if (overlay) {
      if (transitioning) {
        overlay.classList.add('fading');
      } else {
        overlay.classList.remove('fading');
      }
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
