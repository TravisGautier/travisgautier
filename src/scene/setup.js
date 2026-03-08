import * as THREE from 'three';
import { GOLD_ANGLE, CAM_ORBIT_RADIUS, CAM_HEIGHT, LOOK_TARGET } from '../config/constants.js';

export function createSetup(container, options = {}) {
  const { onContextLost, onContextRestored, config } = options;
  const scene = new THREE.Scene();
  scene.background = null;
  scene.fog = new THREE.FogExp2(0xC0D4E4, 0.008);

  const w = typeof window !== 'undefined' ? window.innerWidth : 800;
  const h = typeof window !== 'undefined' ? window.innerHeight : 600;

  const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 500);
  camera.position.set(
    Math.sin(GOLD_ANGLE) * CAM_ORBIT_RADIUS,
    CAM_HEIGHT,
    Math.cos(GOLD_ANGLE) * CAM_ORBIT_RADIUS
  );
  camera.lookAt(LOOK_TARGET);

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(config?.pixelRatio ?? (typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1));
    renderer.setClearColor(0x87BADB);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;
    renderer.shadowMap.enabled = config?.shadowsEnabled ?? true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  } catch (e) {
    renderer = {
      domElement: (() => { const attrs = {}; return { setAttribute(k, v) { attrs[k] = v; }, getAttribute(k) { return attrs[k] ?? null; } }; })(),
      shadowMap: { enabled: config?.shadowsEnabled ?? true, type: THREE.PCFSoftShadowMap },
      setSize() {},
      getPixelRatio() { return 1; },
      setPixelRatio() {},
      setClearColor() {},
      render() {},
      toneMapping: THREE.ACESFilmicToneMapping,
      toneMappingExposure: 1.4,
    };
  }
  container.appendChild(renderer.domElement);
  if (typeof renderer.domElement.setAttribute === 'function') {
    renderer.domElement.setAttribute('aria-hidden', 'true');
  }

  if (typeof renderer.domElement.addEventListener === 'function') {
    renderer.domElement.addEventListener('webglcontextlost', (e) => {
      e.preventDefault();
      onContextLost?.();
    });
    renderer.domElement.addEventListener('webglcontextrestored', () => {
      onContextRestored?.();
    });
  }

  return { scene, camera, renderer };
}

export function dispose(scene, renderer) {
  scene.traverse((obj) => {
    if (obj.geometry) obj.geometry.dispose();
    if (obj.material) {
      if (Array.isArray(obj.material)) {
        obj.material.forEach((m) => m.dispose());
      } else {
        obj.material.dispose();
      }
    }
  });
  renderer.dispose();
  if (typeof renderer.forceContextLoss === 'function') {
    renderer.forceContextLoss();
  }
}
