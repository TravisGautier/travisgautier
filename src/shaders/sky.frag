uniform float uHold;
uniform float uTime;
varying vec3 vPos;
varying vec2 vUv;
#include "noise.glsl"
void main(){
  float h = normalize(vPos).y;
  vec3 zenith = vec3(0.30, 0.52, 0.85); vec3 horizon = vec3(0.72, 0.82, 0.92); vec3 sunHorizon = vec3(0.92, 0.85, 0.70);
  vec3 zenithP = vec3(0.28, 0.25, 0.65); vec3 horizonP = vec3(0.60, 0.55, 0.78); vec3 sunHorizonP = vec3(0.75, 0.60, 0.80);
  vec3 z = mix(zenith, zenithP, uHold); vec3 hr = mix(horizon, horizonP, uHold); vec3 sh = mix(sunHorizon, sunHorizonP, uHold);
  vec3 col = mix(sh, hr, smoothstep(-0.05, 0.15, h)); col = mix(col, z, smoothstep(0.15, 0.65, h));
  vec3 sunDir = normalize(vec3(0.6, 0.45, -0.5));
  float sunDot = max(dot(normalize(vPos), sunDir), 0.0);
  float sunGlow = pow(sunDot, 48.0) * 2.0; float sunHalo = pow(sunDot, 6.0) * 0.35;
  vec3 sunCol = mix(vec3(1.0, 0.95, 0.80), vec3(0.85, 0.70, 0.95), uHold);
  col += sunCol * (sunGlow + sunHalo);
  float cloudH = smoothstep(0.08, 0.45, h) * smoothstep(0.8, 0.4, h);
  vec2 cloudUV = vPos.xz * 0.008;
  float c1 = snoise(cloudUV + uTime * 0.005) * 0.5 + 0.5;
  float c2 = snoise(cloudUV * 2.3 - uTime * 0.008) * 0.5 + 0.5;
  float cloud = smoothstep(0.38, 0.72, c1 * c2) * cloudH * 0.35;
  col = mix(col, vec3(1.0, 0.98, 0.96), cloud);
  gl_FragColor = vec4(col, 1.0);
}
