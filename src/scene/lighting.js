import * as THREE from 'three';

export function createLighting(scene) {
  const ambient = new THREE.AmbientLight(0xFFF5E6, 0.7);
  scene.add(ambient);

  const hemiLight = new THREE.HemisphereLight(0x87BADB, 0xD4C4A8, 0.6);
  scene.add(hemiLight);

  const sunLight = new THREE.DirectionalLight(0xFFF0D4, 1.8);
  sunLight.position.set(12, 20, -10);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 2048;
  sunLight.shadow.mapSize.height = 2048;
  sunLight.shadow.camera.near = 0.5;
  sunLight.shadow.camera.far = 50;
  sunLight.shadow.camera.left = -12;
  sunLight.shadow.camera.right = 12;
  sunLight.shadow.camera.top = 12;
  sunLight.shadow.camera.bottom = -6;
  sunLight.shadow.bias = -0.001;
  scene.add(sunLight);

  const fillLight = new THREE.DirectionalLight(0xC8D8F0, 0.4);
  fillLight.position.set(-8, 10, 8);
  scene.add(fillLight);

  const goldLight = new THREE.PointLight(0xc9a84c, 2.5, 12);
  goldLight.position.set(0, 2.5, 3);
  goldLight.castShadow = true;
  scene.add(goldLight);

  const purpleLight = new THREE.PointLight(0x9b6dff, 1.5, 12);
  purpleLight.position.set(0, 2.5, -3);
  scene.add(purpleLight);

  const pillarLight1 = new THREE.PointLight(0xFFE8C4, 0.5, 8);
  pillarLight1.position.set(5, 3, 0);
  scene.add(pillarLight1);

  const pillarLight2 = new THREE.PointLight(0xFFE8C4, 0.5, 8);
  pillarLight2.position.set(-5, 3, 0);
  scene.add(pillarLight2);

  const groundGlow = new THREE.PointLight(0xc9a84c, 0.8, 4);
  groundGlow.position.set(0, 0.1, 0);
  scene.add(groundGlow);

  return { goldLight, purpleLight, groundGlow, pillarLight1, pillarLight2, hemiLight };
}
