import * as THREE from 'three';

export const GOLD_ANGLE = 0.25;
export const PURPLE_ANGLE = Math.PI + 0.25;
export const CAM_ORBIT_RADIUS = 4.2;
export const CAM_HEIGHT = 2.0;
export const LOOK_TARGET = new THREE.Vector3(0, 1.2, 0);
export const DT_CLAMP_MAX = 0.1;
export const TIME_WRAP_PERIOD = 10000.0;
export const DAMP_ANGLE_BASE = Math.pow(1 - 0.14, 60);
export const DAMP_SCROLL_BASE = Math.pow(1 - 0.10, 60);
export const DAMP_CAM_XZ_BASE = Math.pow(1 - 0.15, 60);
export const DAMP_CAM_Y_BASE = Math.pow(1 - 0.12, 60);
export const DAMP_HOVER_BASE = Math.pow(1 - 0.05, 60);
