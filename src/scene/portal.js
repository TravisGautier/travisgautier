import * as THREE from 'three';
import portalVert from '../shaders/portal.vert';
import portalGoldFrag from '../shaders/portalGold.frag';
import portalPurpleFrag from '../shaders/portalPurple.frag';

export function createPortal(scene) {
  const frameMat = new THREE.MeshStandardMaterial({
    color: 0x1a1a1e, metalness: 0.85, roughness: 0.2,
    emissive: 0x080808, emissiveIntensity: 0.1,
  });
  const edgeMat = new THREE.MeshStandardMaterial({
    color: 0xc9a84c, metalness: 0.95, roughness: 0.12,
    emissive: 0xc9a84c, emissiveIntensity: 0.1,
  });

  const portalGroup = new THREE.Group();
  portalGroup.position.y = 1.0;

  const W = 1.1, H = 1.5, D = 0.12, T = 0.10;

  function makeGatePillar(xPos) {
    const g = new THREE.Mesh(new THREE.BoxGeometry(T, H * 2 + T, D), frameMat);
    g.position.set(xPos, 0, 0); g.castShadow = true; portalGroup.add(g);
    const b = new THREE.Mesh(new THREE.BoxGeometry(T * 1.6, T * 0.5, D * 1.4), frameMat);
    b.position.set(xPos, -H - T * 0.5, 0); portalGroup.add(b);
  }
  makeGatePillar(-W - T / 2);
  makeGatePillar(W + T / 2);

  const kasagiW = W * 2 + T * 2 + 0.4;
  const kasagi = new THREE.Mesh(new THREE.BoxGeometry(kasagiW, T * 1.3, D + 0.06), frameMat);
  kasagi.position.set(0, H + T * 0.65, 0); kasagi.castShadow = true; portalGroup.add(kasagi);

  const capM = new THREE.Mesh(new THREE.BoxGeometry(kasagiW + 0.12, T * 0.35, D + 0.1), frameMat);
  capM.position.set(0, H + T * 1.3, 0); portalGroup.add(capM);

  const nukiM = new THREE.Mesh(new THREE.BoxGeometry(W * 2 + T * 2 + 0.1, T * 0.45, D * 0.6), frameMat);
  nukiM.position.set(0, H - T * 0.6, 0); portalGroup.add(nukiM);

  const botBar = new THREE.Mesh(new THREE.BoxGeometry(kasagiW, T * 0.4, D + 0.06), frameMat);
  botBar.position.set(0, -H - T * 0.2, 0); portalGroup.add(botBar);

  // Gold trim
  const tw = 0.006;
  const tvG = new THREE.BoxGeometry(tw, H * 2, D + 0.01);
  const tL = new THREE.Mesh(tvG, edgeMat); tL.position.set(-W, 0, 0); portalGroup.add(tL);
  const tR = new THREE.Mesh(tvG, edgeMat); tR.position.set(W, 0, 0); portalGroup.add(tR);
  const thG = new THREE.BoxGeometry(W * 2, tw, D + 0.01);
  const tTp = new THREE.Mesh(thG, edgeMat); tTp.position.set(0, H, 0); portalGroup.add(tTp);
  const tBt = new THREE.Mesh(thG, edgeMat); tBt.position.set(0, -H, 0); portalGroup.add(tBt);
  const otG = new THREE.BoxGeometry(kasagiW + 0.14, tw * 2, D + 0.12);
  const oTr = new THREE.Mesh(otG, edgeMat); oTr.position.set(0, H + T * 1.48, 0); portalGroup.add(oTr);

  // Portal Surface A (Gold)
  const surfGeo = new THREE.PlaneGeometry(W * 2, H * 2);
  const portalMatA = new THREE.ShaderMaterial({
    transparent: true, side: THREE.FrontSide, depthWrite: false,
    uniforms: { uTime: { value: 0 }, uMouse: { value: new THREE.Vector2() }, uHover: { value: 0 } },
    vertexShader: portalVert,
    fragmentShader: portalGoldFrag,
  });
  const surfA = new THREE.Mesh(surfGeo, portalMatA);
  surfA.position.z = 0.001; portalGroup.add(surfA);

  // Portal Surface B (Purple)
  const portalMatB = new THREE.ShaderMaterial({
    transparent: true, side: THREE.FrontSide, depthWrite: false,
    uniforms: { uTime: { value: 0 }, uMouse: { value: new THREE.Vector2() }, uHover: { value: 0 } },
    vertexShader: portalVert,
    fragmentShader: portalPurpleFrag,
  });
  const surfB = new THREE.Mesh(surfGeo, portalMatB);
  surfB.rotation.y = Math.PI; surfB.position.z = -0.001; portalGroup.add(surfB);

  scene.add(portalGroup);

  return { portalGroup, portalMatA, portalMatB, edgeMat };
}
