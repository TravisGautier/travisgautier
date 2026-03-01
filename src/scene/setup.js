import * as THREE from 'three';
import { GOLD_ANGLE, CAM_ORBIT_RADIUS, CAM_HEIGHT, LOOK_TARGET } from '../config/constants.js';

export function createSetup(container, options = {}) {
  const { onContextLost, onContextRestored } = options;
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
    renderer.setPixelRatio(typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1);
    renderer.setClearColor(0x87BADB);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  } catch (e) {
    renderer = {
      domElement: {},
      shadowMap: { enabled: true, type: THREE.PCFSoftShadowMap },
      setSize() {},
      setPixelRatio() {},
      setClearColor() {},
      render() {},
      toneMapping: THREE.ACESFilmicToneMapping,
      toneMappingExposure: 1.4,
    };
  }
  container.appendChild(renderer.domElement);

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
