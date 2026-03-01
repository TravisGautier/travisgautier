uniform float uTime;
uniform float uHold;
varying vec2 vUv;
#include "noise.glsl"
void main(){
  vec2 uv = vUv * 4.0 + 10.0;
  float n1 = snoise(uv + uTime * 0.01) * 0.5 + 0.5;
  float n2 = snoise(uv * 1.8 - uTime * 0.015 + 5.0) * 0.5 + 0.5;
  float n = n1 * 0.6 + n2 * 0.4;
  float density = smoothstep(0.32, 0.7, n);
  float dist = length(vUv - 0.5) * 2.0;
  float edgeFade = smoothstep(1.0, 0.4, dist);
  vec3 col = mix(
    mix(vec3(0.65, 0.70, 0.80), vec3(0.58, 0.52, 0.72), uHold),
    mix(vec3(0.90, 0.88, 0.86), vec3(0.82, 0.78, 0.88), uHold),
    smoothstep(0.3, 0.7, n)
  );
  float alpha = density * edgeFade * 0.7;
  gl_FragColor = vec4(col, alpha);
}
