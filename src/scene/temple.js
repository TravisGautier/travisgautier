import * as THREE from 'three';

export function createTemple(scene) {
  const marbleWhite = new THREE.MeshStandardMaterial({ color: 0xE8E0D4, metalness: 0.02, roughness: 0.45 });
  const marbleCream = new THREE.MeshStandardMaterial({ color: 0xF0E8DC, metalness: 0.02, roughness: 0.55 });
  const marbleWarm = new THREE.MeshStandardMaterial({ color: 0xD8CCBC, metalness: 0.05, roughness: 0.5 });
  const stoneFloor = new THREE.MeshStandardMaterial({ color: 0xCCC4B4, metalness: 0.02, roughness: 0.7 });
  const stoneStep = new THREE.MeshStandardMaterial({ color: 0xBEB6A6, metalness: 0.02, roughness: 0.75 });
  const ringMat = new THREE.MeshStandardMaterial({ color: 0xB8A888, metalness: 0.15, roughness: 0.45, side: THREE.DoubleSide });

  // Floor
  const floorGeo = new THREE.CylinderGeometry(6, 6.2, 0.3, 64);
  const floor = new THREE.Mesh(floorGeo, stoneFloor);
  floor.position.y = -0.15;
  floor.receiveShadow = true;
  scene.add(floor);

  // Steps
  const step1 = new THREE.Mesh(new THREE.CylinderGeometry(6.8, 7.0, 0.2, 64), stoneStep);
  step1.position.y = -0.4; step1.receiveShadow = true; scene.add(step1);

  const step2 = new THREE.Mesh(new THREE.CylinderGeometry(7.4, 7.6, 0.2, 64), stoneFloor);
  step2.position.y = -0.6; step2.receiveShadow = true; scene.add(step2);

  const step3 = new THREE.Mesh(new THREE.CylinderGeometry(8.0, 8.3, 0.25, 64), stoneStep);
  step3.position.y = -0.85; step3.receiveShadow = true; scene.add(step3);

  // Floor rings
  const floorRing = new THREE.Mesh(new THREE.RingGeometry(2.8, 3.0, 64), ringMat);
  floorRing.rotation.x = -Math.PI / 2; floorRing.position.y = 0.01; scene.add(floorRing);

  const ring2 = new THREE.Mesh(new THREE.RingGeometry(1.5, 1.55, 64), ringMat);
  ring2.rotation.x = -Math.PI / 2; ring2.position.y = 0.01; scene.add(ring2);

  // Pillars
  const pillarCount = 12;
  const pillarRadius = 5.2;

  for (let i = 0; i < pillarCount; i++) {
    const angle = (i / pillarCount) * Math.PI * 2;
    const px = Math.cos(angle) * pillarRadius;
    const pz = Math.sin(angle) * pillarRadius;

    const pillarGroup = new THREE.Group();
    pillarGroup.position.set(px, 0, pz);

    const base = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.3, 0.6), marbleCream);
    base.position.y = 0.15; base.castShadow = true; base.receiveShadow = true;
    pillarGroup.add(base);

    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.22, 3.8, 20), marbleWhite);
    shaft.position.y = 2.2; shaft.castShadow = true; shaft.receiveShadow = true;
    pillarGroup.add(shaft);

    for (let f = 0; f < 8; f++) {
      const flAngle = (f / 8) * Math.PI * 2;
      const flute = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.024, 3.7, 4), marbleWarm);
      flute.position.set(Math.cos(flAngle) * 0.19, 2.2, Math.sin(flAngle) * 0.19);
      pillarGroup.add(flute);
    }

    const echinus = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.17, 0.15, 16), marbleCream);
    echinus.position.y = 4.15; pillarGroup.add(echinus);

    const abacus = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.1, 0.6), marbleWhite);
    abacus.position.y = 4.28; pillarGroup.add(abacus);

    scene.add(pillarGroup);
  }

  // Architrave
  const archGeo = new THREE.TorusGeometry(pillarRadius, 0.14, 8, 64);
  const architrave = new THREE.Mesh(archGeo, marbleCream);
  architrave.rotation.x = Math.PI / 2;
  architrave.position.y = 4.38;
  scene.add(architrave);
}
