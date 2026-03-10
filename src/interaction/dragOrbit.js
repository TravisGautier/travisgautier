import {
  GOLD_ANGLE, PURPLE_ANGLE,
  MOMENTUM_DECAY_BASE, MOMENTUM_CUTOFF,
  TILT_MIN, TILT_MAX,
  SNAP_ZONE_HALF_WIDTH, SNAP_HYSTERESIS, SNAP_STRENGTH, SNAP_VELOCITY_THRESHOLD,
} from '../config/constants.js';

const TWO_PI = Math.PI * 2;

export function normalizeAngle(a) {
  return ((a % TWO_PI) + TWO_PI) % TWO_PI;
}

export function angularDistance(a, b) {
  const d = normalizeAngle(a - b);
  return d > Math.PI ? TWO_PI - d : d;
}

export function shortestAngularDiff(target, current) {
  let d = (target - current) % TWO_PI;
  if (d > Math.PI) d -= TWO_PI;
  if (d < -Math.PI) d += TWO_PI;
  return d;
}

export function computeSnapTarget(currentAngle, velocity, snappedTo) {
  const distToGold = angularDistance(currentAngle, GOLD_ANGLE);
  const distToPurple = angularDistance(currentAngle, PURPLE_ANGLE);
  const absVel = Math.abs(velocity);

  if (snappedTo === null) {
    if (distToGold < SNAP_ZONE_HALF_WIDTH && absVel < SNAP_VELOCITY_THRESHOLD) {
      return { snapTarget: GOLD_ANGLE, snappedTo: 'gold' };
    }
    if (distToPurple < SNAP_ZONE_HALF_WIDTH && absVel < SNAP_VELOCITY_THRESHOLD) {
      return { snapTarget: PURPLE_ANGLE, snappedTo: 'purple' };
    }
    return { snapTarget: null, snappedTo: null };
  }

  if (snappedTo === 'gold') {
    if (distToGold > SNAP_ZONE_HALF_WIDTH + SNAP_HYSTERESIS) {
      return { snapTarget: null, snappedTo: null };
    }
    return { snapTarget: GOLD_ANGLE, snappedTo: 'gold' };
  }

  if (snappedTo === 'purple') {
    if (distToPurple > SNAP_ZONE_HALF_WIDTH + SNAP_HYSTERESIS) {
      return { snapTarget: null, snappedTo: null };
    }
    return { snapTarget: PURPLE_ANGLE, snappedTo: 'purple' };
  }

  return { snapTarget: null, snappedTo: null };
}

export function deriveHoldProgress(currentAngle) {
  const distToGold = angularDistance(currentAngle, GOLD_ANGLE);
  const distToPurple = angularDistance(currentAngle, PURPLE_ANGLE);
  const sum = distToGold + distToPurple;
  if (sum === 0) return 0;
  return Math.max(0, Math.min(1, distToGold / sum));
}

function dampFactor(base, dt) {
  return 1 - Math.pow(base, dt);
}

export function updateDragPhysics(state, dt) {
  if (state.transitioning) return;

  if (!state.dragging) {
    const decayH = dampFactor(MOMENTUM_DECAY_BASE, dt);
    state.dragVelocity *= (1 - decayH);
    if (Math.abs(state.dragVelocity) < MOMENTUM_CUTOFF) {
      state.dragVelocity = 0;
    }

    const decayV = dampFactor(MOMENTUM_DECAY_BASE, dt);
    state.tiltVelocity *= (1 - decayV);
    if (Math.abs(state.tiltVelocity) < MOMENTUM_CUTOFF) {
      state.tiltVelocity = 0;
    }

    state.targetAngle += state.dragVelocity * dt;
    state.targetTilt += state.tiltVelocity * dt;
    state.targetTilt = Math.max(TILT_MIN, Math.min(TILT_MAX, state.targetTilt));

    const snap = computeSnapTarget(state.targetAngle, state.dragVelocity, state.snappedTo);
    state.snappedTo = snap.snappedTo;

    if (snap.snapTarget !== null) {
      const diff = shortestAngularDiff(snap.snapTarget, state.targetAngle);
      state.targetAngle += diff * SNAP_STRENGTH;
      state.dragVelocity *= 0.9;
    }
  }

  state.holdProgress = deriveHoldProgress(state.currentAngle);

  if (state.holdProgress > 0.5) {
    state.hasEngaged = true;
  }
}
