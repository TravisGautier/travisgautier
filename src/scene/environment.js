import * as THREE from 'three';

const noiseGLSL = `
  vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec2 mod289(vec2 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec3 permute(vec3 x){return mod289(((x*34.0)+1.0)*x);}
  float snoise(vec2 v){
    const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
    vec2 i=floor(v+dot(v,C.yy));vec2 x0=v-i+dot(i,C.xx);
    vec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);
    vec4 x12=x0.xyxy+C.xxzz;x12.xy-=i1;i=mod289(i);
    vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));
    vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0);
    m=m*m;m=m*m;
    vec3 x=2.0*fract(p*C.www)-1.0;vec3 h=abs(x)-0.5;
    vec3 ox=floor(x+0.5);vec3 a0=x-ox;
    m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);
    vec3 g;g.x=a0.x*x0.x+h.x*x0.y;g.yz=a0.yz*x12.xz+h.yz*x12.yw;
    return 130.0*dot(m,g);
  }
`;

export function createEnvironment(scene) {
  // Sky dome
  const skyGeo = new THREE.SphereGeometry(200, 64, 32);
  const skyMat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    uniforms: { uHold: { value: 0 }, uTime: { value: 0 } },
    vertexShader: `varying vec3 vPos; varying vec2 vUv; void main(){ vPos=position; vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
    fragmentShader: `
      uniform float uHold; uniform float uTime; varying vec3 vPos; varying vec2 vUv;
      ${noiseGLSL}
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
    `
  });
  const sky = new THREE.Mesh(skyGeo, skyMat);
  scene.add(sky);

  // Cloud sea layer 1
  const cloudSeaGeo = new THREE.PlaneGeometry(300, 300, 1, 1);
  const cloudSeaMat = new THREE.ShaderMaterial({
    transparent: true, side: THREE.DoubleSide, depthWrite: false,
    uniforms: { uTime: { value: 0 }, uHold: { value: 0 } },
    vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
    fragmentShader: `
      uniform float uTime; uniform float uHold; varying vec2 vUv;
      ${noiseGLSL}
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
    `
  });
  const cloudSea = new THREE.Mesh(cloudSeaGeo, cloudSeaMat);
  cloudSea.rotation.x = -Math.PI / 2;
  cloudSea.position.y = -3.5;
  scene.add(cloudSea);

  // Cloud sea layer 2
  const cloudSea2 = new THREE.Mesh(cloudSeaGeo.clone(), new THREE.ShaderMaterial({
    transparent: true, side: THREE.DoubleSide, depthWrite: false,
    uniforms: { uTime: { value: 0 }, uHold: { value: 0 } },
    vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
    fragmentShader: `
      uniform float uTime; uniform float uHold; varying vec2 vUv;
      ${noiseGLSL}
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
    `
  }));
  cloudSea2.rotation.x = -Math.PI / 2;
  cloudSea2.position.y = -5.5;
  scene.add(cloudSea2);

  // Mountains
  const mtMat = new THREE.MeshStandardMaterial({ color: 0x8090A4, roughness: 0.85, metalness: 0.0 });
  const mtGeo = new THREE.ConeGeometry(18, 14, 6);
  [
    { p: [-35, -12, -50], s: [1.2, 0.8, 1.4] },
    { p: [40, -14, -55], s: [1.5, 0.9, 1.2] },
    { p: [8, -15, -65], s: [2.0, 1.1, 1.5] },
    { p: [-20, -13, -60], s: [1.1, 0.7, 1.3] },
    { p: [55, -16, -70], s: [1.8, 1.0, 1.6] },
  ].forEach(m => {
    const mt = new THREE.Mesh(mtGeo, mtMat);
    mt.position.set(...m.p); mt.scale.set(...m.s);
    scene.add(mt);
  });

  // Snow caps
  const snowMat = new THREE.MeshStandardMaterial({ color: 0xE8E4E0, roughness: 0.6, metalness: 0.0 });
  const snowGeo = new THREE.ConeGeometry(6, 3, 6);
  [
    { p: [-35, -3.8, -50], s: [1.2, 0.8, 1.4] },
    { p: [40, -5, -55], s: [1.5, 0.9, 1.2] },
    { p: [8, -5.5, -65], s: [2.0, 1.1, 1.5] },
  ].forEach(m => {
    const s = new THREE.Mesh(snowGeo, snowMat);
    s.position.set(...m.p); s.scale.set(...m.s);
    scene.add(s);
  });

  // Particles
  const particleCount = 200;
  const particleGeo = new THREE.BufferGeometry();
  const particlePos = new Float32Array(particleCount * 3);
  const particleSpeeds = [];
  for (let i = 0; i < particleCount; i++) {
    particlePos[i * 3] = (Math.random() - 0.5) * 16;
    particlePos[i * 3 + 1] = Math.random() * 8 - 1;
    particlePos[i * 3 + 2] = (Math.random() - 0.5) * 16;
    particleSpeeds.push(0.002 + Math.random() * 0.006);
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0xFFF8E0, size: 0.035, transparent: true, opacity: 0.5, depthWrite: false,
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  return { skyMat, cloudSeaMat, cloudSea2, particles, particleSpeeds, particleMat };
}
