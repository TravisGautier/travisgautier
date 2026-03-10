import * as THREE from 'three';

export const GOLD_ANGLE = 0.25;
export const PURPLE_ANGLE = Math.PI + 0.25;
export const CAM_ORBIT_RADIUS = 4.2;
export const MIN_ORBIT_RADIUS = 2.8;
export const MAX_ORBIT_RADIUS = 5.0;
export const CAM_HEIGHT = 2.0;
export const LOOK_TARGET = new THREE.Vector3(0, 1.2, 0);
export const DT_CLAMP_MAX = 0.1;
export const TIME_WRAP_PERIOD = 10000.0;
export const DAMP_ANGLE_BASE = Math.pow(1 - 0.14, 60);
export const DAMP_SCROLL_BASE = Math.pow(1 - 0.10, 60);
export const DAMP_CAM_XZ_BASE = Math.pow(1 - 0.15, 60);
export const DAMP_CAM_Y_BASE = Math.pow(1 - 0.12, 60);
export const DAMP_HOVER_BASE = Math.pow(1 - 0.05, 60);
export const SCROLL_MULT_TRACKPAD = 0.003;
export const SCROLL_MULT_WHEEL = 0.0008;
export const PINCH_ZOOM_MULT = 0.005;
export const FPS_SAMPLE_COUNT = 120;
export const FPS_THRESHOLD = 0.022;
export const FPS_DOWNGRADE_PIXEL_RATIO_DROP = 0.5;
export const RAYCAST_THROTTLE_MS = 50;
export const GYRO_GAMMA_DIVISOR = 45;
export const GYRO_BETA_OFFSET = 45;
export const GYRO_BETA_DIVISOR = 45;
export const DRAG_SENSITIVITY = 0.005;
export const TOUCH_DRAG_SENSITIVITY = 0.008;
export const TILT_SENSITIVITY = 0.003;
export const TILT_MIN = -0.55;
export const TILT_MAX = 0.55;
export const MOMENTUM_DECAY_BASE = Math.pow(1 - 0.05, 60);
export const MOMENTUM_CUTOFF = 0.0001;
export const DAMP_TILT_BASE = Math.pow(1 - 0.14, 60);
export const SNAP_ZONE_HALF_WIDTH = 0.30;
export const SNAP_HYSTERESIS = 0.08;
export const SNAP_STRENGTH = 0.04;
export const SNAP_VELOCITY_THRESHOLD = 0.3;
export const TRANSITION_DWELL_TIME = 0.5;
export const TRANSITION_NAV_DELAY = 1500;
export const NAV_LINKS = {
  contact: {
    label: 'Contact',
    href: 'mailto:travis@travisgautier.com',
  },
};
export const VENTURES = {
  gold: {
    name: 'Innovation & Technology',
    subtitle: 'Entering experience\u2026',
    url: '/ventures/gold',
    transitionId: 'transitionA',
  },
  purple: {
    name: 'Creative & Strategy',
    subtitle: 'Entering experience\u2026',
    url: '/ventures/purple',
    transitionId: 'transitionB',
  },
};
