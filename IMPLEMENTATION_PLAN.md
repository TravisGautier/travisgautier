# travisgautier.com — Implementation Plan

**Project**: Luxury Three.js landing page — Mount Olympus open-air temple with dual-portal mechanic
**Status**: Working prototype (single HTML file) → Production build
**Stack**: Vite + Three.js + Vanilla JS
**Target**: travisgautier.com

---

## 1. Project Scaffolding

### 1.1 Initialize

```bash
npm create vite@latest travisgautier -- --template vanilla
cd travisgautier
npm install three detect-gpu
npm install -D vite-plugin-glsl
```

### 1.2 Target File Structure

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
│   │   └── overlay.js            # Label crossfade, hold bar, logo tint
│   │
│   └── animate.js                # Render loop — calls all update functions
│
└── styles/
    └── main.css                  # All styles, @font-face declarations
```

### 1.3 Module Dependency Flow

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
  └─ animate.js          (render loop → reads/writes state, updates uniforms)
```

---

## 2. Adaptive Quality System

### 2.1 GPU Tier Detection

Use `detect-gpu` (~2KB gzipped) at startup. Combine with device heuristics.

```js
// src/config/quality.js
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

### 2.2 Tier Breakdown

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

### 2.3 Tier 0 Decision — Fallback Strategy

If `tier === 0`, consider serving a non-WebGL fallback: a beautifully designed static/CSS-only page with the same typography, colors, and brand identity. A stunning 2D page is better than a stuttery 3D one.

Possible approach: render the Three.js scene server-side or as a pre-captured screenshot, use it as a hero background image, and overlay the interactive UI on top with CSS animations for the gold/purple transition.

### 2.4 Runtime FPS Monitor

Runs during first ~2 seconds. If average frame time > 22ms (~45fps), trigger targeted downgrades on properties that can change without rebuilding geometry.

```js
// src/interaction/fpsMonitor.js
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

---

## 3. Edge Cases & Resilience

### 3.1 Tab Visibility & Clock Drift

When the user switches tabs, `requestAnimationFrame` pauses but `Clock.getDelta()` accumulates. On return, a single massive `dt` spike causes the hold progress to jump, particles to teleport, and the camera to lurch.

**Fix**: Clamp `dt` and pause on hidden.

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

### 3.2 WebGL Context Loss

Mobile browsers and some integrated GPUs reclaim WebGL context under memory pressure. Without handling, the user sees a permanent black rectangle.

```js
renderer.domElement.addEventListener('webgl-context-lost', (e) => {
  e.preventDefault();
  // Show graceful fallback — branded static state or "reload" prompt
  cancelAnimationFrame(animationId);
});

renderer.domElement.addEventListener('webgl-context-restored', () => {
  // Reinitialize renderer state, recompile shaders
  initScene();
  animate();
});
```

### 3.3 Shader Precision on Safari / iOS

Safari's WebGL implementation requires explicit precision declarations. Add to the top of every fragment shader:

```glsl
precision highp float;
```

Without this, older iOS devices produce banding in the vortex and flickering on cloud layers.

### 3.4 Floating Point Time Overflow

`uTime` increases indefinitely. After several hours, floating point precision degrades — noise functions stutter, clouds jump.

**Fix**: Wrap time with a large modulo.

```js
// In animate loop:
const wrappedTime = state.time % 10000.0;
portalMatA.uniforms.uTime.value = wrappedTime;
skyMat.uniforms.uTime.value = wrappedTime;
// ... all shader uniforms
```

### 3.5 Frame-Rate-Independent Easing

Current lerp factors (e.g., `0.14`, `0.15`) are applied per-frame, not per-second. On 144Hz displays, these run 2.4x more often than 60Hz, making the camera feel stiffer.

**Fix**: Convert to time-based exponential damping.

```js
// Instead of:
camera.position.x += (targetX - camera.position.x) * 0.15;

// Use:
const damping = 1 - Math.pow(0.00001, dt); // consistent across frame rates
camera.position.x += (targetX - camera.position.x) * damping;
```

Tune the base value (0.00001) to match desired feel. Lower = snappier.

### 3.6 Scroll: Trackpad vs Mouse Wheel

Trackpads fire high-frequency, low-delta events. Mouse wheels fire low-frequency, high-delta events. A single multiplier feels wrong on one or the other.

**Heuristic detection**:

```js
let isTrackpad = false;
window.addEventListener('wheel', (e) => {
  // Trackpads send pixel-precise deltas (small values, no rounding)
  if (Math.abs(e.deltaY) < 10 && !Number.isInteger(e.deltaY)) {
    isTrackpad = true;
  }
  const multiplier = isTrackpad ? 0.003 : 0.0008;
  scrollTarget += e.deltaY * multiplier;
  scrollTarget = Math.max(-1.0, Math.min(1.0, scrollTarget));
}, { passive: true });
```

### 3.7 Scroll Zoom Bounds

Clamp orbit radius so the camera never clips through portal geometry or reveals cloud plane edges.

```js
const MIN_ORBIT = 2.8;  // Don't clip through portal
const MAX_ORBIT = 5.0;  // Stay inside pillar ring
const orbitRadius = Math.max(MIN_ORBIT, Math.min(MAX_ORBIT, CAM_ORBIT_RADIUS - state.scroll * 1.2));
```

### 3.8 Right-Click and Drag Interference

Prevent context menu and accidental text selection within the canvas area.

```js
container.addEventListener('contextmenu', (e) => e.preventDefault());
container.addEventListener('mousedown', (e) => e.preventDefault());
```

### 3.9 Memory Disposal

If the experience ever mounts/unmounts (SPA navigation), Three.js resources must be explicitly freed.

```js
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

---

## 4. Touch & Mobile

### 4.1 Touch Event Mapping

Map the hold mechanic to touch events. Distinguish tap (short press) from hold (long press).

```js
let touchStartTime = 0;

container.addEventListener('touchstart', (e) => {
  e.preventDefault();
  touchStartTime = performance.now();
  state.holding = true;
  // Use first touch point for position
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

### 4.2 Gyroscope Parallax (Mobile)

Replace mouse parallax with device orientation on mobile. Note: iOS 13+ requires explicit permission.

```js
function initGyroscope() {
  if (typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function') {
    // iOS — must be triggered by user gesture
    return DeviceOrientationEvent.requestPermission().then(permission => {
      if (permission === 'granted') bindGyroscope();
    });
  } else {
    bindGyroscope();
  }
}

function bindGyroscope() {
  window.addEventListener('deviceorientation', (e) => {
    // beta = front-back tilt (-180 to 180), gamma = left-right (-90 to 90)
    state.mouse.nx = (e.gamma || 0) / 45;  // normalize to -1..1
    state.mouse.ny = ((e.beta || 0) - 45) / 45; // 45° as "neutral" holding angle
  });
}
```

### 4.3 Custom Cursor

Hide entirely on touch devices. Detect with media query:

```css
@media (hover: none) and (pointer: coarse) {
  .cursor, .cursor-trail { display: none !important; }
  body { cursor: auto; }
}
```

### 4.4 Pinch-to-Zoom

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

---

## 5. Loading Sequence

### 5.1 Init Order

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

### 5.2 Loading State

Minimal HTML visible before JS executes:

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

Remove after init:

```js
const loader = document.getElementById('loading');
loader.style.opacity = '0';
setTimeout(() => loader.remove(), 800);
```

---

## 6. Accessibility

### 6.1 Reduced Motion

Respect `prefers-reduced-motion` — freeze animations, make transitions instant.

```js
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// In quality config:
if (reducedMotion) {
  config.freezeShaderTime = true;    // uTime stays fixed
  config.disableParticles = true;
  config.disablePortalBob = true;
  config.instantCameraTransition = true;  // no easing, snap to target
}
```

The hold-click mechanic still works — the camera moves to the other side, just without the smooth ease.

### 6.2 Screen Reader Support

```html
<div id="canvas-container"
     role="img"
     aria-label="Interactive 3D scene: a portal sitting inside an open-air Greek temple atop a mountain, surrounded by marble pillars and clouds below. Hold click to rotate between two ventures.">
</div>
```

### 6.3 Keyboard Navigation

Header links should be keyboard-focusable with visible focus styles:

```css
.header-link:focus-visible {
  outline: 2px solid var(--gold);
  outline-offset: 4px;
}
```

Consider adding keyboard support for the hold mechanic (e.g., hold Space to orbit).

### 6.4 Color Contrast

Verify that overlay text (labels, header, hints) maintains WCAG AA contrast against the bright 3D scene behind it. May need a subtle text-shadow or semi-transparent backdrop on the label elements to guarantee legibility across all camera positions and hold states.

---

## 7. SEO & Social Sharing

### 7.1 Meta Tags

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
```

### 7.2 OG Image

Capture a beauty shot of the scene (gold side, good camera angle) at 1200×630px. This is what appears when the link is shared on social media, Slack, iMessage, etc.

### 7.3 Structured Data

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Travis Gautier",
  "url": "https://travisgautier.com"
}
</script>
```

---

## 8. Performance & Deployment

### 8.1 Build Optimization

```js
// vite.config.js
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

Separating Three.js into its own chunk means it gets cached independently — your app code can update without re-downloading the Three.js bundle.

### 8.2 Expected Bundle Sizes (gzipped)

| Asset | Estimated Size |
|---|---|
| Three.js (tree-shaken) | ~150KB |
| App JS (scene, shaders, interaction) | ~15KB |
| CSS | ~3KB |
| Fonts (6 woff2 files) | ~60KB total |
| detect-gpu | ~2KB |
| **Total first load** | **~230KB** |

### 8.3 Caching Strategy

- `index.html` → `Cache-Control: no-cache` (deploys take effect immediately)
- JS/CSS chunks → `Cache-Control: max-age=31536000, immutable` (content-hashed filenames)
- Fonts → `Cache-Control: max-age=31536000, immutable`

### 8.4 Self-Host Fonts

Eliminates render-blocking Google Fonts DNS lookup. Download woff2 files, declare with `@font-face`:

```css
@font-face {
  font-family: 'Cormorant Garamond';
  src: url('/fonts/CormorantGaramond-Light.woff2') format('woff2');
  font-weight: 300;
  font-display: swap;
}
/* ... repeat for each weight/style */
```

`font-display: swap` prevents invisible text during load.

### 8.5 Hosting

Cloudflare Pages with custom domain is recommended:
- Global CDN, automatic HTTPS
- Git-based deploys (push to main → live)
- Free tier is more than sufficient
- Built-in headers configuration for caching

Alternatives: Vercel, Netlify (both work equally well for static sites).

---

## 9. Implementation Priority Order

### Phase 1 — Foundation
- [ ] 1. Scaffold Vite project, install dependencies
- [ ] 2. Extract CSS into `main.css`
- [ ] 3. Extract JS into module files (start with `main.js` → `animate.js` → `state.js`)
- [ ] 4. Move shaders to `.glsl` files with `vite-plugin-glsl`
- [ ] 5. Self-host fonts
- [ ] 6. Verify everything works identically to the prototype

### Phase 2 — Resilience
- [ ] 7. Add `dt` clamping and `visibilitychange` handling
- [ ] 8. Add WebGL context loss handler
- [ ] 9. Add `precision highp float` to all shaders
- [ ] 10. Add time wrapping (`% 10000.0`)
- [ ] 11. Convert lerps to frame-rate-independent damping
- [ ] 12. Add scroll zoom bounds clamping
- [ ] 13. Add trackpad vs mouse wheel detection

### Phase 3 — Adaptive Quality
- [ ] 14. Integrate `detect-gpu` and build quality config
- [ ] 15. Wire config into temple.js (pillar count, fluting)
- [ ] 16. Wire config into environment.js (cloud layers, sky noise, particles)
- [ ] 17. Wire config into setup.js (shadows, pixel ratio)
- [ ] 18. Add loading sequence with font + GPU detection
- [ ] 19. Add FPS monitor with runtime downgrade

### Phase 4 — Mobile & Touch
- [ ] 20. Add touch event mapping for hold mechanic
- [ ] 21. Add pinch-to-zoom
- [ ] 22. Add gyroscope parallax with iOS permission handling
- [ ] 23. Hide custom cursor on touch devices
- [ ] 24. Test on real devices (iOS Safari, Android Chrome)

### Phase 5 — Polish & Deploy
- [ ] 25. Add `prefers-reduced-motion` support
- [ ] 26. Add screen reader attributes and keyboard focus styles
- [ ] 27. Add meta tags, OG image, structured data
- [ ] 28. Configure Vite build with chunk splitting
- [ ] 29. Deploy to Cloudflare Pages
- [ ] 30. Test social sharing previews (Facebook, Twitter, Slack, iMessage)
