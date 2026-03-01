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

const portalVert = `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`;

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
    fragmentShader: `
      uniform float uTime; uniform vec2 uMouse; uniform float uHover; varying vec2 vUv;
      ${noiseGLSL}
      void main(){
        vec2 uv=vUv; vec2 c=uv-0.5;
        float f1=snoise(vec2(uv.x*3.0,uv.y*2.0-uTime*0.4))*0.6;
        float f2=snoise(vec2(uv.x*5.0+1.0,uv.y*3.0-uTime*0.55))*0.35;
        float f3=snoise(vec2(uv.x*1.5,uv.y*1.2-uTime*0.25+3.0))*0.4;
        vec2 mOff=c-uMouse*0.25;float mD=length(mOff);
        float mE=smoothstep(0.5,0.0,mD)*uHover*0.35;
        float n=f1+f2+f3+mE;
        vec3 deep=vec3(0.12,0.08,0.02);vec3 mid=vec3(0.65,0.45,0.12);
        vec3 bright=vec3(0.92,0.78,0.42);vec3 hot=vec3(1.0,0.95,0.75);
        vec3 col=mix(deep,mid,smoothstep(-0.4,0.2,n));
        col=mix(col,bright,smoothstep(0.1,0.6,n));
        col+=hot*smoothstep(0.55,0.9,n)*0.45;
        float eX=smoothstep(0.0,0.06,uv.x)*smoothstep(1.0,0.94,uv.x);
        float eY=smoothstep(0.0,0.06,uv.y)*smoothstep(1.0,0.94,uv.y);
        float edge=eX*eY;
        col+=vec3(0.78,0.55,0.15)*(1.0-edge)*0.5;
        float pulse=0.75+0.25*sin(uTime*0.6);
        float alpha=edge*(0.55+0.35*abs(n))*pulse+uHover*0.15*edge;
        gl_FragColor=vec4(col,alpha);
      }
    `
  });
  const surfA = new THREE.Mesh(surfGeo, portalMatA);
  surfA.position.z = 0.001; portalGroup.add(surfA);

  // Portal Surface B (Purple)
  const portalMatB = new THREE.ShaderMaterial({
    transparent: true, side: THREE.FrontSide, depthWrite: false,
    uniforms: { uTime: { value: 0 }, uMouse: { value: new THREE.Vector2() }, uHover: { value: 0 } },
    vertexShader: portalVert,
    fragmentShader: `
      uniform float uTime; uniform vec2 uMouse; uniform float uHover; varying vec2 vUv;
      ${noiseGLSL}
      void main(){
        vec2 uv=vUv; vec2 c=uv-0.5;
        float f1=snoise(vec2(uv.x*2.5+uTime*0.18,uv.y*3.0-uTime*0.35));
        float f2=snoise(vec2(uv.x*4.0-uTime*0.22,uv.y*2.5+uTime*0.4))*0.5;
        float f3=snoise(vec2(uv.x*1.3+5.0,uv.y*1.8+uTime*0.2))*0.4;
        vec2 mOff=c-uMouse*0.25;float mD=length(mOff);
        float mE=smoothstep(0.5,0.0,mD)*uHover*0.35;
        float n=(f1+f2+f3)*0.55+mE;
        vec3 deep=vec3(0.06,0.02,0.14);vec3 mid=vec3(0.38,0.18,0.65);
        vec3 bright=vec3(0.62,0.42,0.95);vec3 hot=vec3(0.82,0.68,1.0);
        vec3 col=mix(deep,mid,smoothstep(-0.4,0.2,n));
        col=mix(col,bright,smoothstep(0.15,0.6,n));
        col+=hot*smoothstep(0.5,0.85,n)*0.45;
        float eX=smoothstep(0.0,0.06,uv.x)*smoothstep(1.0,0.94,uv.x);
        float eY=smoothstep(0.0,0.06,uv.y)*smoothstep(1.0,0.94,uv.y);
        float edge=eX*eY;
        col+=vec3(0.35,0.15,0.6)*(1.0-edge)*0.5;
        float pulse=0.75+0.25*sin(uTime*0.5+1.5);
        float alpha=edge*(0.55+0.35*abs(n))*pulse+uHover*0.15*edge;
        gl_FragColor=vec4(col,alpha);
      }
    `
  });
  const surfB = new THREE.Mesh(surfGeo, portalMatB);
  surfB.rotation.y = Math.PI; surfB.position.z = -0.001; portalGroup.add(surfB);

  scene.add(portalGroup);

  return { portalGroup, portalMatA, portalMatB, edgeMat };
}
