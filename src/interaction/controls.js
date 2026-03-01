export function initControls(state, camera, renderer) {
  let scrollTarget = 0;

  if (typeof document !== 'undefined') {
    document.addEventListener('mousemove', (e) => {
      state.mouse.x = e.clientX;
      state.mouse.y = e.clientY;
      state.mouse.nx = (e.clientX / window.innerWidth) * 2 - 1;
      state.mouse.ny = -(e.clientY / window.innerHeight) * 2 + 1;
    });
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('mousedown', (e) => {
      if (e.button === 0) { state.holding = true; }
    });
    window.addEventListener('mouseup', () => { state.holding = false; });
    window.addEventListener('mouseleave', () => { state.holding = false; });

    window.addEventListener('wheel', (e) => {
      scrollTarget += e.deltaY * 0.0008;
      scrollTarget = Math.max(-1.0, Math.min(1.0, scrollTarget));
    });

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  return { getScrollTarget: () => scrollTarget };
}
