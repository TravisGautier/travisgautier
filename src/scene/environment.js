import * as THREE from 'three';
import portalVert from '../shaders/portal.vert';
import skyVert from '../shaders/sky.vert';
import skyFrag from '../shaders/sky.frag';
import clouds1Frag from '../shaders/clouds1.frag';
import clouds2Frag from '../shaders/clouds2.frag';

export function createEnvironment(scene) {
  // Sky dome
  const skyGeo = new THREE.SphereGeometry(200, 64, 32);
  const skyMat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    uniforms: { uHold: { value: 0 }, uTime: { value: 0 } },
    vertexShader: skyVert,
    fragmentShader: skyFrag,
  });
  const sky = new THREE.Mesh(skyGeo, skyMat);
  scene.add(sky);

  // Cloud sea layer 1
  const cloudSeaGeo = new THREE.PlaneGeometry(300, 300, 1, 1);
  const cloudSeaMat = new THREE.ShaderMaterial({
    transparent: true, side: THREE.DoubleSide, depthWrite: false,
    uniforms: { uTime: { value: 0 }, uHold: { value: 0 } },
    vertexShader: portalVert,
    fragmentShader: clouds1Frag,
  });
  const cloudSea = new THREE.Mesh(cloudSeaGeo, cloudSeaMat);
  cloudSea.rotation.x = -Math.PI / 2;
  cloudSea.position.y = -3.5;
  scene.add(cloudSea);

  // Cloud sea layer 2
  const cloudSea2 = new THREE.Mesh(cloudSeaGeo.clone(), new THREE.ShaderMaterial({
    transparent: true, side: THREE.DoubleSide, depthWrite: false,
    uniforms: { uTime: { value: 0 }, uHold: { value: 0 } },
    vertexShader: portalVert,
    fragmentShader: clouds2Frag,
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
