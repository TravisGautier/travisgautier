# travisgautier.com — Implementation Plan

**Project**: Luxury Three.js landing page — Mount Olympus open-air temple with dual-portal mechanic
**Status**: Working prototype (single HTML file) → Production build
**Stack**: Vite + Three.js + Vanilla JS
**Target**: travisgautier.com

---

## Summary

| Phase | Name | Features | Complexity |
|---|---|---|---|
| 1 | Foundation | 6 | 2S + 3M + 1L |
| 2 | Resilience | 8 | 5S + 3M |
| 3 | Adaptive Quality | 6 | 1S + 3M + 2L |
| 4 | Portal Interaction & Transitions | 5 | 2S + 2M + 1L |
| 5 | Mobile & Touch | 5 | 2S + 2M + 1L |
| 6 | Accessibility | 4 | 2S + 1M + 1L |
| 7 | Testing Infrastructure | 4 | 2S + 1M + 1L |
| 8 | SEO, Social & Assets | 5 | 4S + 1M |
| 9 | Build, Deploy & Error Handling | 5 | 3S + 1M + 1L |
| 10 | Visual Polish | 2 | 1S + 1M |
| **Total** | | **50 features** | **23S + 17M + 10L** |

---

## Phase 1: Foundation — Scaffold and Extract

**Prerequisites**: None

### Target File Structure

```
travisgautier/
├── index.html                    # Minimal DOM shell — overlay markup only
├── vite.config.js                # GLSL plugin, build config
├── package.json
│
├── public/
│   ├── fonts/
│   │   ├── CormorantGaramond-Light.woff2
│   │   ├── CormorantGaramond-Regular.woff2
│   │   ├── CormorantGaramond-SemiBold.woff2
│   │   ├── Outfit-ExtraLight.woff2
│   │   ├── Outfit-Light.woff2
│   │   └── Outfit-Regular.woff2
│   ├── og-image.jpg              # Social sharing preview
│   └── favicon.svg
│
├── src/
│   ├── main.js                   # Entry — orchestrates init sequence
│   │
│   ├── config/
│   │   ├── quality.js            # GPU detection → tier config object
│   │   └── constants.js          # Angles, radii, dimensions, colors
│   │
│   ├── scene/
│   │   ├── setup.js              # Renderer, camera, fog, resize
│   │   ├── environment.js        # Sky dome, cloud sea, mountains, particles
│   │   ├── temple.js             # Floor, steps, pillars, architrave
│   │   ├── portal.js             # Frame geometry, shader surfaces
│   │   └── lighting.js           # Sun, hemisphere, accents, hold transitions
│   │
│   ├── shaders/
│   │   ├── noise.glsl            # Shared simplex noise functions
│   │   ├── portalGold.frag       # Gold vortex surface
│   │   ├── portalPurple.frag     # Purple vortex surface
│   │   ├── sky.vert / sky.frag   # Sky dome with sun, wispy clouds
│   │   ├── clouds.frag           # Cloud sea layer
│   │   └── portal.vert           # Shared portal vertex shader
│   │
│   ├── interaction/
│   │   ├── state.js              # Central state object (single export)
│   │   ├── cursor.js             # Custom cursor dot + trail ring
│   │   ├── controls.js           # Mouse, touch, scroll, resize bindings
│   │   ├── holdMechanic.js       # Toggle logic with halfway-commit
│   │   └── fpsMonitor.js         # Runtime frame time sampling + downgrade
│   │
│   ├── ui/
│   │   ├── overlay.js            # Label crossfade, hold bar, logo tint
│   │   └── transition.js         # Transition screen triggers + external navigation
│   │
│   └── animate.js                # Render loop — calls all update functions
│
├── styles/
│   └── main.css                  # All styles, @font-face declarations
│
└── tests/
    ├── helpers/
    │   ├── three-mocks.js        # Three.js mock utilities
    │   └── fixtures.js           # Shared test fixtures
    ├── config/
    │   ├── quality.test.js
    │   └── constants.test.js
    ├── scene/
    │   ├── setup.test.js
    │   ├── environment.test.js
    │   ├── temple.test.js
    │   ├── portal.test.js
    │   └── lighting.test.js
    ├── shaders/
    │   └── shaders.test.js
    ├── interaction/
    │   ├── state.test.js
    │   ├── holdMechanic.test.js
    │   ├── fpsMonitor.test.js
    │   ├── controls.test.js
    │   └── cursor.test.js
    ├── ui/
    │   └── overlay.test.js
    ├── accessibility/
    │   └── a11y.test.js
    ├── build/
    │   └── build.test.js
    └── integration/
        └── init.test.js
```

### Module Dependency Flow

```
main.js
  ├─ quality.js          (async — GPU tier detection)
  ├─ state.js            (shared mutable state)
  ├─ setup.js            (renderer, camera → needs quality config)
  ├─ environment.js      (sky, clouds, mountains → needs quality config)
  ├─ temple.js           (floor, pillars → needs quality config)
  ├─ portal.js           (frame, shaders → standalone)
  ├─ lighting.js         (all lights → standalone)
  ├─ controls.js         (binds events → writes to state)
  ├─ cursor.js           (reads state.mouse → updates DOM)
  ├─ overlay.js          (reads state.holdProgress → updates DOM)
  ├─ transition.js       (reads holdProgress → triggers external nav)
  └─ animate.js          (render loop → reads/writes state, updates uniforms)
```

### Feature 1.1: Project Scaffold — M

Initialize Vite project structure. Create `src/main.js` entry point, `src/config/constants.js` with all design constants extracted from prototype (~line 341), and `src/interaction/state.js` with the central state object (~line 328). Strip `index.html` down to minimal DOM shell with overlay markup only. Verify `npm run dev` serves correctly.

**Files**: `src/main.js` (NEW), `src/config/constants.js` (NEW), `src/interaction/state.js` (NEW), `index.html` (MODIFY)

### Feature 1.2: Extract CSS — S

Move all inline `<style>` content (lines 7-272 of prototype) into `styles/main.css`. Add `@font-face` declarations for self-hosted fonts with `font-display: swap`. Remove Google Fonts `@import`. Verify all overlay styling works.

**Files**: `styles/main.css` (NEW), `index.html` (MODIFY)

### Feature 1.3: Extract JS into Modules — L

Split the IIFE into modules following the dependency flow. Create: `src/scene/setup.js` (renderer, camera, fog, resize), `src/scene/environment.js` (sky dome, clouds, mountains, particles), `src/scene/temple.js` (floor, steps, pillars, architrave), `src/scene/portal.js` (frame, shader surfaces), `src/scene/lighting.js` (all lights), `src/interaction/controls.js` (mouse/scroll events), `src/interaction/cursor.js` (custom cursor), `src/interaction/holdMechanic.js` (toggle logic), `src/ui/overlay.js` (labels, hold bar, logo), `src/animate.js` (render loop). Each module exports a factory or init function.

**Files**: All `src/scene/*.js`, `src/interaction/*.js`, `src/ui/overlay.js`, `src/animate.js` (ALL NEW)

### Feature 1.4: Extract Shaders to GLSL Files — M

Move all inline GLSL strings to separate files: `src/shaders/noise.glsl` (shared simplex from ~line 367), `src/shaders/portal.vert`, `src/shaders/portalGold.frag`, `src/shaders/portalPurple.frag`, `src/shaders/sky.vert`, `src/shaders/sky.frag`, `src/shaders/clouds.frag`. Verify `vite-plugin-glsl` resolves `#include` directives for the shared noise function.

**Files**: All `src/shaders/*` (ALL NEW)

### Feature 1.5: Self-Host Fonts — S

Download Cormorant Garamond (300, 400, 600) and Outfit (200, 300, 400) as woff2 into `public/fonts/`. Write `@font-face` declarations in `styles/main.css`. Remove Google Fonts CDN dependency.

```css
@font-face {
  font-family: 'Cormorant Garamond';
  src: url('/fonts/CormorantGaramond-Light.woff2') format('woff2');
  font-weight: 300;
  font-display: swap;
}
/* ... repeat for each weight/style */
```

**Files**: `public/fonts/*.woff2` (NEW), `styles/main.css` (MODIFY)

### Feature 1.6: Parity Verification — M

End-to-end visual and behavioral verification that the modular build matches the single-file prototype exactly. Compare camera orbit, hold mechanic, shader rendering, overlay labels, cursor behavior, and all animations. Document any intentional deviations.

**Files**: All `src/` modules (VERIFY)

---

## Phase 2: Resilience — Edge Cases and Stability

**Prerequisites**: Phase 1

### Feature 2.1: Delta Time Clamping + Visibility Handling — S

When the user switches tabs, `requestAnimationFrame` pauses but `Clock.getDelta()` accumulates. On return, a single massive `dt` spike causes hold progress to jump, particles to teleport, and the camera to lurch.

```js
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    clock.stop();
  } else {
    clock.start();
  }
});

// In animate loop:
const dt = Math.min(clock.getDelta(), 0.1);
```

**Files**: `src/animate.js` (MODIFY)

### Feature 2.2: WebGL Context Loss Recovery — M

Mobile browsers and some integrated GPUs reclaim WebGL context under memory pressure. Without handling, the user sees a permanent black rectangle.

```js
renderer.domElement.addEventListener('webgl-context-lost', (e) => {
  e.preventDefault();
  cancelAnimationFrame(animationId);
  // Show graceful fallback — branded static state or "reload" prompt
});

renderer.domElement.addEventListener('webgl-context-restored', () => {
  initScene();
  animate();
});
```

**Files**: `src/scene/setup.js` (MODIFY), `src/ui/overlay.js` (MODIFY)

### Feature 2.3: Shader Precision Declarations — S

Safari's WebGL implementation requires explicit precision declarations. Add to the top of every fragment shader:

```glsl
precision highp float;
```

Without this, older iOS devices produce banding in the vortex and flickering on cloud layers.

**Files**: `src/shaders/*.frag` (MODIFY)

### Feature 2.4: Time Wrapping — S

`uTime` increases indefinitely. After several hours, floating point precision degrades — noise functions stutter, clouds jump.

```js
// In animate loop:
const wrappedTime = state.time % 10000.0;
portalMatA.uniforms.uTime.value = wrappedTime;
skyMat.uniforms.uTime.value = wrappedTime;
```

**Files**: `src/animate.js` (MODIFY)

### Feature 2.5: Frame-Rate-Independent Damping — M

Current lerp factors (e.g., `0.14`, `0.15`) are applied per-frame, not per-second. On 144Hz displays, these run 2.4x more often than 60Hz, making the camera feel stiffer.

```js
// Instead of:
camera.position.x += (targetX - camera.position.x) * 0.15;

// Use:
const damping = 1 - Math.pow(0.00001, dt); // consistent across frame rates
camera.position.x += (targetX - camera.position.x) * damping;
```

Tune the base value (0.00001) to match desired feel. Lower = snappier.

**Files**: `src/animate.js` (MODIFY), `src/config/constants.js` (MODIFY)

### Feature 2.6: Scroll Zoom Bounds — S

Clamp orbit radius so the camera never clips through portal geometry or reveals cloud plane edges.

```js
const MIN_ORBIT = 2.8;  // Don't clip through portal
const MAX_ORBIT = 5.0;  // Stay inside pillar ring
const orbitRadius = Math.max(MIN_ORBIT, Math.min(MAX_ORBIT, CAM_ORBIT_RADIUS - state.scroll * 1.2));
```

**Files**: `src/interaction/controls.js` (MODIFY), `src/config/constants.js` (MODIFY)

### Feature 2.7: Trackpad vs Mouse Wheel Detection — S

Trackpads fire high-frequency, low-delta events. Mouse wheels fire low-frequency, high-delta events. A single multiplier feels wrong on one or the other.

```js
let isTrackpad = false;
window.addEventListener('wheel', (e) => {
  if (Math.abs(e.deltaY) < 10 && !Number.isInteger(e.deltaY)) {
    isTrackpad = true;
  }
  const multiplier = isTrackpad ? 0.003 : 0.0008;
  scrollTarget += e.deltaY * multiplier;
  scrollTarget = Math.max(-1.0, Math.min(1.0, scrollTarget));
}, { passive: true });
```

**Files**: `src/interaction/controls.js` (MODIFY)

### Feature 2.8: Right-Click Prevention + Memory Disposal — M

Prevent context menu and text selection on canvas. Add `dispose()` function for potential SPA navigation.

```js
container.addEventListener('contextmenu', (e) => e.preventDefault());
container.addEventListener('mousedown', (e) => e.preventDefault());

export function dispose(scene, renderer) {
  scene.traverse((obj) => {
    if (obj.geometry) obj.geometry.dispose();
    if (obj.material) {
      if (Array.isArray(obj.material)) {
        obj.material.forEach(m => m.dispose());
      } else {
        obj.material.dispose();
      }
    }
  });
  renderer.dispose();
}
```

**Files**: `src/scene/setup.js` (MODIFY), `src/interaction/controls.js` (MODIFY)

---

## Phase 3: Adaptive Quality — GPU Detection and Performance

**Prerequisites**: Phase 1

### Feature 3.1: GPU Tier Detection — M

Use `detect-gpu` (~2KB gzipped) at startup. Combine with device heuristics.

```js
import { getGPUTier } from 'detect-gpu';

export async function determineQuality() {
  const gpu = await getGPUTier();
  const dpr = window.devicePixelRatio || 1;
  const mobile = /Mobi|Android/i.test(navigator.userAgent);
  const smallScreen = window.innerWidth < 768;

  let tier = gpu.tier; // 0–3
  if (mobile && tier > 1) tier = 1;
  if (smallScreen && tier > 2) tier = 2;

  return {
    tier,
    pixelRatio:     [1, 1, 1.5, Math.min(dpr, 2)][tier],
    shadowMapSize:  [0, 0, 1024, 2048][tier],
    shadowsEnabled: tier >= 2,
    particleCount:  [0, 50, 100, 200][tier],
    pillarCount:    [6, 8, 10, 12][tier],
    pillarFluting:  tier >= 3,
    cloudLayers:    [0, 1, 1, 2][tier],
    skyCloudNoise:  tier >= 2,
  };
}
```

**Tier Breakdown:**

| Feature | Tier 0 (Weak Mobile) | Tier 1 (Low-end) | Tier 2 (Mid-range) | Tier 3 (High-end) |
|---|---|---|---|---|
| Pixel ratio | 1 | 1 | 1.5 | min(dpr, 2) |
| Shadows | Off | Off | 1024px | 2048px |
| Particles | 0 | 50 | 100 | 200 |
| Pillar count | 6 | 8 | 10 | 12 |
| Pillar fluting | No | No | No | Yes (8 ridges) |
| Cloud layers | 0 (static color) | 1 | 1 | 2 |
| Sky cloud noise | No (gradient only) | No | Yes | Yes |
| Camera parallax | Gyroscope | Gyroscope | Mouse | Mouse |
| Custom cursor | Hidden | Hidden | Visible | Visible |

**Files**: `src/config/quality.js` (NEW)

### Feature 3.2: Wire Quality into Temple — M

Temple module reads quality config to decide pillar count (6/8/10/12) and whether to include fluting geometry. Pillar ring radius stays constant regardless of count.

**Files**: `src/scene/temple.js` (MODIFY)

### Feature 3.3: Wire Quality into Environment — M

Environment module reads quality config for cloud layer count (0/1/2), sky cloud noise toggle, particle count (0/50/100/200). Tier 0 gets a static gradient sky.

**Files**: `src/scene/environment.js` (MODIFY)

### Feature 3.4: Wire Quality into Renderer Setup — S

Setup module reads quality config for pixel ratio, shadow map enabling/size, and tone mapping.

**Files**: `src/scene/setup.js` (MODIFY)

### Feature 3.5: Loading Sequence — L

```
1. Show branded loading state (logo in system font, centered, minimal)
2. Kick off parallel:
   a. Font loading        → document.fonts.ready
   b. GPU tier detection  → determineQuality()
3. Both resolve → build quality config
4. Initialize Three.js scene with config
5. Compile shaders (render 1 frame offscreen to force GPU compilation)
6. Crossfade: loading state → full experience (opacity transition, ~800ms)
7. Start animate loop
8. Begin FPS monitoring (first 120 frames)
```

Loading state HTML:

```html
<div id="loading" style="
  position: fixed; inset: 0; z-index: 1000;
  display: flex; align-items: center; justify-content: center;
  background: #c8dcea;
  transition: opacity 0.8s ease;
">
  <span style="
    font-family: Georgia, serif;
    font-size: 1.2rem;
    letter-spacing: 0.35em;
    text-transform: uppercase;
    color: #3d3225;
  ">Travis Gautier</span>
</div>
```

**Files**: `src/main.js` (MODIFY), `index.html` (MODIFY), `src/ui/overlay.js` (MODIFY)

### Feature 3.6: FPS Monitor with Runtime Downgrade — L

Runs during first ~2 seconds. If average frame time > 22ms (~45fps), trigger targeted downgrades.

```js
export function createFPSMonitor(onDowngrade) {
  const samples = [];
  let settled = false;

  return function sample(dt) {
    if (settled) return;
    samples.push(dt);
    if (samples.length >= 120) {
      const avg = samples.reduce((a, b) => a + b) / samples.length;
      if (avg > 0.022) onDowngrade();
      settled = true;
    }
  };
}
```

**Runtime-adjustable knobs** (no geometry rebuild required):
- `renderer.setPixelRatio()` — drop by 0.5
- `renderer.shadowMap.enabled` — toggle off
- `particleMat.visible` — hide particles
- Shader uniforms — disable cloud noise via flag

**Not adjustable at runtime** (structural, decided at init only):
- Pillar count and fluting geometry
- Number of cloud plane meshes
- Sky dome shader complexity

**Files**: `src/interaction/fpsMonitor.js` (NEW), `src/animate.js` (MODIFY)

---

## Phase 4: Portal Interaction and Transitions

**Prerequisites**: Phase 1

### Feature 4.1: Portal Raycasting + Hover Detection — M

The prototype has a `uHover` shader uniform but raycasting is never implemented. Portal surfaces should react to mouse proximity.

Instantiate `THREE.Raycaster`. On `mousemove` (throttled), cast a ray from the camera through the mouse position. Test intersection against portal surface A and B meshes. Set `state.hoverPortal = true` when intersecting, driving the existing `uHover` uniform to make the portal vortex react with the edge effect already coded in the shaders.

**Files**: `src/interaction/controls.js` (MODIFY), `src/scene/portal.js` (MODIFY — export surface meshes for raycast targets)

### Feature 4.2: Transition Screen Triggers + External Navigation — L

The prototype has HTML for transition screens ("Entering experience...") but no JavaScript triggers them. Wire the hold mechanic completion to these screens.

When `holdProgress` reaches 1.0 (fully committed to a side) and the user has held for a minimum dwell time (e.g., 0.5s after arrival), trigger the corresponding transition screen by adding the `.active` class. The transition screen fades in over 800ms. After a configurable delay (1.5s), navigate to the external venture URL.

Configure venture URLs in `src/config/constants.js`:

```js
export const VENTURES = {
  gold: {
    name: 'Venture Alpha',
    subtitle: 'Innovation & Technology',
    url: 'https://venture-alpha.example.com', // placeholder
  },
  purple: {
    name: 'Venture Omega',
    subtitle: 'Creative & Strategy',
    url: 'https://venture-omega.example.com', // placeholder
  },
};
```

**Files**: `src/interaction/holdMechanic.js` (MODIFY), `src/ui/overlay.js` (MODIFY), `src/ui/transition.js` (NEW)

### Feature 4.3: Header Navigation Placeholders — S

The "About" and "Contact" header links are `href="#"` placeholders. Replace with polished landing-page-appropriate navigation. Decide on final link items and behaviors (mailto for Contact, appropriate About destination). Style appropriately for a luxury landing page.

**Files**: `index.html` (MODIFY), `styles/main.css` (MODIFY)

### Feature 4.4: Keyboard Support for Hold Mechanic — S

Add Space key as an alternative trigger for the hold mechanic (hold Space to orbit). Add Escape to dismiss modals/overlays. Ensure all interactive elements are reachable via Tab.

**Files**: `src/interaction/controls.js` (MODIFY)

### Feature 4.5: Scroll Hint and Hold Hint Polish — M

Polish the bottom-bar hint text and interaction indicators. Ensure the scroll hint line animation and hold progress bar feel luxury-smooth. Verify they work across both gold and purple states.

**Files**: `src/ui/overlay.js` (MODIFY), `styles/main.css` (MODIFY)

---

## Phase 5: Mobile and Touch

**Prerequisites**: Phase 1, Phase 4

### Feature 5.1: Touch Event Mapping for Hold — M

Map touch events to the hold mechanic. Distinguish tap from hold.

```js
let touchStartTime = 0;

container.addEventListener('touchstart', (e) => {
  e.preventDefault();
  touchStartTime = performance.now();
  state.holding = true;
  const t = e.touches[0];
  state.mouse.nx = (t.clientX / window.innerWidth) * 2 - 1;
  state.mouse.ny = -(t.clientY / window.innerHeight) * 2 + 1;
}, { passive: false });

container.addEventListener('touchmove', (e) => {
  const t = e.touches[0];
  state.mouse.nx = (t.clientX / window.innerWidth) * 2 - 1;
  state.mouse.ny = -(t.clientY / window.innerHeight) * 2 + 1;
}, { passive: true });

container.addEventListener('touchend', () => {
  state.holding = false;
}, { passive: true });
```

**Files**: `src/interaction/controls.js` (MODIFY)

### Feature 5.2: Pinch-to-Zoom — S

Map pinch gestures to the scroll zoom mechanic on touch devices.

```js
let lastPinchDist = 0;

container.addEventListener('touchmove', (e) => {
  if (e.touches.length === 2) {
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (lastPinchDist > 0) {
      const delta = (lastPinchDist - dist) * 0.005;
      scrollTarget = Math.max(-1.0, Math.min(1.0, scrollTarget + delta));
    }
    lastPinchDist = dist;
  }
}, { passive: true });

container.addEventListener('touchend', () => { lastPinchDist = 0; });
```

**Files**: `src/interaction/controls.js` (MODIFY)

### Feature 5.3: Gyroscope Parallax + iOS Permissions — M

Replace mouse parallax with device orientation on mobile. iOS 13+ requires explicit permission.

```js
function initGyroscope() {
  if (typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function') {
    return DeviceOrientationEvent.requestPermission().then(permission => {
      if (permission === 'granted') bindGyroscope();
    });
  } else {
    bindGyroscope();
  }
}

function bindGyroscope() {
  window.addEventListener('deviceorientation', (e) => {
    state.mouse.nx = (e.gamma || 0) / 45;
    state.mouse.ny = ((e.beta || 0) - 45) / 45;
  });
}
```

**Files**: `src/interaction/controls.js` (MODIFY)

### Feature 5.4: Custom Cursor Hiding on Touch — S

Hide cursor elements on touch devices via media query and programmatic detection.

```css
@media (hover: none) and (pointer: coarse) {
  .cursor, .cursor-trail { display: none !important; }
  body { cursor: auto; }
}
```

Also detect programmatically on first `touchstart` and set `state.isTouchDevice`.

**Files**: `src/interaction/cursor.js` (MODIFY), `styles/main.css` (MODIFY)

### Feature 5.5: Device Testing + Responsive Fixes — L

Test on real devices (iOS Safari, Android Chrome, tablet). Fix responsive layout issues in overlay (padding, font sizes, label positioning at small viewports). Verify touch hold, pinch zoom, and gyroscope work end-to-end.

**Files**: `styles/main.css` (MODIFY), `src/interaction/controls.js` (MODIFY)

---

## Phase 6: Accessibility

**Prerequisites**: Phase 1, Phase 4

### Feature 6.1: Reduced Motion Support — M

Respect `prefers-reduced-motion` — freeze animations, make transitions instant.

```js
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (reducedMotion) {
  config.freezeShaderTime = true;    // uTime stays fixed
  config.disableParticles = true;
  config.disablePortalBob = true;
  config.instantCameraTransition = true;  // no easing, snap to target
}
```

The hold mechanic still works — the camera moves to the other side, just without smooth ease.

**Files**: `src/config/quality.js` (MODIFY), `src/animate.js` (MODIFY)

### Feature 6.2: Screen Reader + ARIA Attributes — S

```html
<div id="canvas-container"
     role="img"
     aria-label="Interactive 3D scene: a portal sitting inside an open-air Greek temple atop a mountain, surrounded by marble pillars and clouds below. Hold click to rotate between two ventures.">
</div>
```

Add `aria-live="polite"` region for venture label announcements. Add `aria-hidden="true"` to decorative elements.

**Files**: `index.html` (MODIFY)

### Feature 6.3: Keyboard Navigation + Focus Styles — S

Header links and interactive elements must be keyboard-focusable with visible focus styles.

```css
.header-link:focus-visible {
  outline: 2px solid var(--gold);
  outline-offset: 4px;
}
```

Add skip-to-content link for screen readers. Ensure Tab order is logical.

**Files**: `styles/main.css` (MODIFY), `index.html` (MODIFY)

### Feature 6.4: Color Contrast Verification + Fixes — L

Audit all overlay text against the 3D scene background for WCAG AA contrast (4.5:1 for normal text, 3:1 for large text). May need subtle `text-shadow` or semi-transparent backdrop on label elements. Test across both gold and purple hold states.

**Files**: `styles/main.css` (MODIFY)

---

## Phase 7: Testing Infrastructure

**Prerequisites**: Phase 1

### Feature 7.1: Test Infrastructure + Three.js Mocks — M

Create test directory structure mirroring `src/`. Set up Three.js mock utilities (mock WebGLRenderer, Scene, Camera, Clock). Configure vitest with `jsdom` environment for DOM-dependent tests. Create shared test fixtures (`createMockQualityConfig`, `createMockState`).

**Files**: `tests/helpers/three-mocks.js` (NEW), `tests/helpers/fixtures.js` (NEW), `vite.config.js` (MODIFY)

### Feature 7.2: Unit Tests for Pure Logic — L

Write unit tests for all pure functions: hold mechanic state transitions, FPS monitor sampling, damping calculations, time wrapping, scroll clamping, quality config generation, constants validation, trackpad detection heuristic. Target: every function in `src/config/` and `src/interaction/` that does not require a DOM or WebGL context.

**Files**: `tests/config/quality.test.js` (NEW), `tests/config/constants.test.js` (NEW), `tests/interaction/holdMechanic.test.js` (NEW), `tests/interaction/fpsMonitor.test.js` (NEW), `tests/interaction/controls.test.js` (NEW)

### Feature 7.3: Shader Validation Tests — S

Validate GLSL files at the file content level (not GPU execution). Check: precision declarations present in all `.frag` files, required uniforms declared (`uTime`, `uMouse`, `uHover`, `uHold`), noise function import present where needed, all expected shader files exist.

**Files**: `tests/shaders/shaders.test.js` (NEW)

### Feature 7.4: Build Output Tests — S

Verify production build completes, Three.js lands in a separate chunk, `index.html` exists in output, fonts are present in output, no excessively large inline styles.

**Files**: `tests/build/build.test.js` (NEW)

---

## Phase 8: SEO, Social, and Assets

**Prerequisites**: Phase 1

### Feature 8.1: Meta Tags + Structured Data — S

```html
<meta name="description" content="Travis Gautier — Innovation, Technology, Creative Strategy">

<!-- Open Graph -->
<meta property="og:title" content="Travis Gautier">
<meta property="og:description" content="Innovation & Technology | Creative & Strategy">
<meta property="og:image" content="https://travisgautier.com/og-image.jpg">
<meta property="og:url" content="https://travisgautier.com">
<meta property="og:type" content="website">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Travis Gautier">
<meta name="twitter:image" content="https://travisgautier.com/og-image.jpg">

<!-- Structured Data -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Travis Gautier",
  "url": "https://travisgautier.com"
}
</script>
```

**Files**: `index.html` (MODIFY)

### Feature 8.2: OG Image Creation — S

Capture a beauty shot of the gold-side scene at 1200x630px. Save as `public/og-image.jpg`. Document the capture process (camera angle, hold state, screenshot method) so it can be regenerated after visual changes.

**Files**: `public/og-image.jpg` (NEW)

### Feature 8.3: Favicon Design — S

Create `public/favicon.svg` — a minimal, brandable icon. Also generate `public/favicon.ico` for legacy browser support and add Apple touch icon.

**Files**: `public/favicon.svg` (NEW), `public/favicon.ico` (NEW), `index.html` (MODIFY)

### Feature 8.4: Analytics Integration — S

Add lightweight, privacy-respecting analytics. If Cloudflare Pages: use Cloudflare Web Analytics (free, no JS needed). No cookie banner required for privacy-first options.

**Files**: `index.html` (MODIFY)

### Feature 8.5: Social Sharing Verification — M

Test OG image rendering on Facebook Sharing Debugger, Twitter Card Validator, LinkedIn Post Inspector, Slack link unfurl, and iMessage link preview. Fix any issues with dimensions, text truncation, or missing fields.

**Files**: `index.html` (VERIFY/MODIFY)

---

## Phase 9: Build, Deploy, and Error Handling

**Prerequisites**: All previous phases

### Feature 9.1: Vite Build Configuration Finalized — S

```js
import glsl from 'vite-plugin-glsl';

export default {
  plugins: [glsl()],
  build: {
    target: 'es2020',
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
        }
      }
    }
  }
};
```

Separating Three.js into its own chunk means it gets cached independently. Expected sizes:

| Asset | Estimated Size |
|---|---|
| Three.js (tree-shaken) | ~150KB |
| App JS (scene, shaders, interaction) | ~15KB |
| CSS | ~3KB |
| Fonts (6 woff2 files) | ~60KB total |
| detect-gpu | ~2KB |
| **Total first load** | **~230KB** |

**Files**: `vite.config.js` (MODIFY)

### Feature 9.2: Caching Headers — S

- `index.html` → `Cache-Control: no-cache` (deploys take effect immediately)
- JS/CSS chunks → `Cache-Control: max-age=31536000, immutable` (content-hashed filenames)
- Fonts → `Cache-Control: max-age=31536000, immutable`

**Files**: `public/_headers` (NEW), `index.html` (MODIFY)

### Feature 9.3: Branded 404 Page — M

Create a branded 404 page that matches the site's visual identity (same fonts, colors, background). For Cloudflare Pages: `public/404.html`. Include a link back to the main experience. Style as a "lost in the clouds" theme.

**Files**: `public/404.html` (NEW)

### Feature 9.4: Tier 0 Static Fallback — L

If `tier === 0`, serve a non-WebGL fallback: a pre-captured hero screenshot of the 3D scene as a background image, with the same overlay UI on top, and CSS animations for the gold/purple color transition. A stunning 2D page is better than a stuttery 3D one.

**Files**: `src/ui/fallback.js` (NEW), `public/fallback-hero.jpg` (NEW), `styles/main.css` (MODIFY)

### Feature 9.5: Deploy to Cloudflare Pages — S

Connect repository to Cloudflare Pages. Configure: build command (`npm run build`), output directory (`dist/`), custom domain (`travisgautier.com`). Verify HTTPS, headers, and caching. Run Lighthouse audit.

Alternatives: Vercel, Netlify (both work equally well for static sites).

**Files**: Configuration only

---

## Phase 10: Visual Polish

**Prerequisites**: Phases 1-6

### Feature 10.1: Particle + Fog + Light Animation Polish — M

Fine-tune particle behavior (color shift with hold, subtle attraction toward portal), refine fog density curves, adjust light intensity animation curves. Subjective quality pass.

**Files**: `src/scene/environment.js` (MODIFY), `src/scene/lighting.js` (MODIFY), `src/animate.js` (MODIFY)

### Feature 10.2: Loading-to-Scene Crossfade Polish — S

Polish the loading-to-scene transition. Ensure the crossfade feels luxury-smooth. Verify the loading state branding matches the final scene's aesthetic.

**Files**: `src/main.js` (MODIFY), `src/ui/overlay.js` (MODIFY)

---

## Implementation Priority Order

### Phase 1 — Foundation
- [x] 1.1. Scaffold Vite project structure, create entry point + constants + state
- [x] 1.2. Extract CSS into `styles/main.css`
- [ ] 1.3. Extract JS into module files
- [ ] 1.4. Move shaders to `.glsl` files with `vite-plugin-glsl`
- [ ] 1.5. Self-host fonts
- [ ] 1.6. Verify parity with prototype

### Phase 2 — Resilience
- [ ] 2.1. Add dt clamping and `visibilitychange` handling
- [ ] 2.2. Add WebGL context loss handler
- [ ] 2.3. Add `precision highp float` to all fragment shaders
- [ ] 2.4. Add time wrapping (`% 10000.0`)
- [ ] 2.5. Convert lerps to frame-rate-independent damping
- [ ] 2.6. Add scroll zoom bounds clamping
- [ ] 2.7. Add trackpad vs mouse wheel detection
- [ ] 2.8. Add right-click prevention + memory disposal

### Phase 3 — Adaptive Quality
- [ ] 3.1. Integrate `detect-gpu` and build quality config
- [ ] 3.2. Wire config into `temple.js` (pillar count, fluting)
- [ ] 3.3. Wire config into `environment.js` (cloud layers, sky noise, particles)
- [ ] 3.4. Wire config into `setup.js` (shadows, pixel ratio)
- [ ] 3.5. Add loading sequence with font + GPU detection
- [ ] 3.6. Add FPS monitor with runtime downgrade

### Phase 4 — Portal Interaction & Transitions
- [ ] 4.1. Add portal raycasting + hover detection
- [ ] 4.2. Wire transition screen triggers + external navigation
- [ ] 4.3. Polish header navigation placeholders
- [ ] 4.4. Add keyboard support for hold mechanic
- [ ] 4.5. Polish scroll/hold hint indicators

### Phase 5 — Mobile & Touch
- [ ] 5.1. Add touch event mapping for hold mechanic
- [ ] 5.2. Add pinch-to-zoom
- [ ] 5.3. Add gyroscope parallax with iOS permission handling
- [ ] 5.4. Hide custom cursor on touch devices
- [ ] 5.5. Test on real devices + responsive fixes

### Phase 6 — Accessibility
- [ ] 6.1. Add `prefers-reduced-motion` support
- [ ] 6.2. Add screen reader attributes and ARIA
- [ ] 6.3. Add keyboard navigation + focus styles
- [ ] 6.4. Verify + fix color contrast (WCAG AA)

### Phase 7 — Testing Infrastructure
- [ ] 7.1. Set up test infra + Three.js mocks
- [ ] 7.2. Write unit tests for pure logic
- [ ] 7.3. Write shader validation tests
- [ ] 7.4. Write build output tests

### Phase 8 — SEO, Social & Assets
- [ ] 8.1. Add meta tags + structured data
- [ ] 8.2. Create OG image
- [ ] 8.3. Design + add favicon
- [ ] 8.4. Integrate analytics
- [ ] 8.5. Verify social sharing previews

### Phase 9 — Build, Deploy & Error Handling
- [ ] 9.1. Finalize Vite build configuration
- [ ] 9.2. Configure caching headers
- [ ] 9.3. Create branded 404 page
- [ ] 9.4. Build Tier 0 static fallback
- [ ] 9.5. Deploy to Cloudflare Pages

### Phase 10 — Visual Polish
- [ ] 10.1. Polish particle + fog + light animations
- [ ] 10.2. Polish loading-to-scene crossfade

---

## Execution Notes

- **Phase 7 (Testing)** should begin immediately after Phase 1 and run in parallel with Phases 2-6.
- **Phase 4** is the most important new phase — it completes the core user journey.
- **Phases 2, 3, 5, 6** can proceed somewhat in parallel after Phase 1.
- **Phase 9** must be last (deployment requires all features stable).
