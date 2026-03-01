uniform float uTime;
uniform float uHold;
varying vec2 vUv;
#include "noise.glsl"
void main(){
  vec2 uv = vUv * 6.0;
  float n1 = snoise(uv + uTime * 0.015) * 0.5 + 0.5;
  float n2 = snoise(uv * 2.2 - uTime * 0.02) * 0.5 + 0.5;
  float n3 = snoise(uv * 0.7 + uTime * 0.01 + 3.0) * 0.5 + 0.5;
  float n = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;
  float density = smoothstep(0.28, 0.65, n);
  float dist = length(vUv - 0.5) * 2.0;
  float edgeFade = smoothstep(1.0, 0.3, dist);
  vec3 cloudBright = mix(vec3(0.98, 0.96, 0.94), vec3(0.90, 0.86, 0.95), uHold);
  vec3 cloudShadow = mix(vec3(0.70, 0.74, 0.82), vec3(0.65, 0.58, 0.78), uHold);
  vec3 col = mix(cloudShadow, cloudBright, smoothstep(0.3, 0.7, n));
  col += vec3(0.06, 0.04, 0.02) * smoothstep(0.5, 0.8, n);
  float alpha = density * edgeFade * 0.92;
  gl_FragColor = vec4(col, alpha);
}
