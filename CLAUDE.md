# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal landing page for travisgautier.com — a luxury Three.js scene depicting a Mount Olympus open-air temple with a dual-portal mechanic. Two "ventures" (Gold = Innovation & Technology, Purple = Creative & Strategy) are revealed by holding click to orbit the camera around a central portal.

**Current state**: Working single-file prototype (`index.html`) with all CSS, HTML, and JS inline. Three.js loaded via CDN (r128).

**Planned migration**: Vite + Three.js + Vanilla JS modular build (see `IMPLEMENTATION_PLAN.md` for full breakdown).

## Build & Development

The project has not yet been scaffolded into a build system. Currently:
- Open `index.html` directly in a browser, or serve with any static server (`python -m http.server`, `npx serve`, etc.)

Once migrated to Vite (per `IMPLEMENTATION_PLAN.md`):
```bash
npm install
npm run dev      # Vite dev server
npm run build    # Production build to dist/
npm run preview  # Preview production build
```

## Architecture

### Single-File Prototype (`index.html`)

Everything lives in one file inside an IIFE (`(() => { ... })()`):

- **State object** (~line 328): Central mutable state — mouse position, scroll, hold progress, camera angle, timing
- **Camera orbit system** (~line 341): Camera orbits at `CAM_ORBIT_RADIUS=4.2` between `GOLD_ANGLE=0.25` and `PURPLE_ANGLE=PI+0.25` around `LOOK_TARGET=(0,1.2,0)`
- **GLSL noise** (~line 367): Shared simplex noise (`snoise`) injected into all shader materials via string concatenation
- **Scene construction** (~line 430–850): Materials, sky dome, cloud layers, mountains, temple floor/steps/pillars, portal frame, portal shader surfaces (A=gold, B=purple), particles, lights, fog
- **Hold mechanic** (~line 901): Hold click drives `holdProgress` 0→1 (gold→purple). Release past 0.5 commits to that side. Holding again from purple reverses back to gold. Controls camera orbit, lighting colors, sky tint, fog, UI labels
- **Animate loop** (~line 896): Single `requestAnimationFrame` loop updates hold progress, camera orbit, shader uniforms, light colors, fog, particles, and UI

### Portal Dual-Face Design

The portal has two `PlaneGeometry` surfaces facing opposite directions:
- **Surface A** (gold vortex, `z=0.001`, front-facing): warm gold noise shader
- **Surface B** (purple vortex, `z=-0.001`, back-facing, rotated `PI`): cool purple noise shader

The camera orbits to show one face or the other based on hold progress.

### Planned Module Structure

Per `IMPLEMENTATION_PLAN.md` (10 phases, 50 features with X.Y numbering), the target architecture splits into:
- `src/config/` — GPU quality tiers (`detect-gpu`), constants
- `src/scene/` — setup, environment, temple, portal, lighting
- `src/shaders/` — `.glsl` files with `vite-plugin-glsl`
- `src/interaction/` — state, cursor, controls, hold mechanic, FPS monitor
- `src/ui/` — overlay management, transition screens, fallback
- `src/animate.js` — render loop
- `src/main.js` — entry point orchestrating init
- `tests/` — mirroring `src/` structure (config, scene, shaders, interaction, ui, build, a11y)

### Key Design Constants

- Pillar ring radius: `5.2`, camera orbit radius: `4.2` (camera is inside pillar ring)
- 12 Doric-style pillars with fluting detail
- Cloud sea at `y=-3.5` and `y=-5.5`
- Portal center at `y=1.0` with gentle floating bob
- Hold speed: `1.2` per second (fill), `2.5` per second (snap on release)
- Fog: `FogExp2` density `0.008`

### Color Palette

```
--gold:         #b8942e
--gold-light:   #8b7330
--purple:       #7c52d4
--purple-light: #6b44b8
--bg:           #c8dcea (sky blue-gray)
```

### Fonts

- **Cormorant Garamond** (serif): logo, labels, headings — weights 300, 400, 600
- **Outfit** (sans-serif): body, UI hints — weights 200, 300, 400
- Currently loaded via Google Fonts CDN; plan is to self-host as woff2
