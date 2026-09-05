import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';

interface BoxModelProps {
  scrollProgress: number; // 0 to 1
}

export const BoxModel: React.FC<BoxModelProps> = ({ scrollProgress }) => {
  const lidHingeRef = useRef<THREE.Group>(null);
  const tissueTopHingeRef = useRef<THREE.Group>(null);
  const tissueBottomHingeRef = useRef<THREE.Group>(null);
  const topMeshRef = useRef<THREE.Mesh>(null);
  const bottomMeshRef = useRef<THREE.Mesh>(null);
  const boxGroupRef = useRef<THREE.Group>(null);

  // Load authentic packaging photo textures including the new high-res tissue flap photos
  const [outerLidTex, innerLidTex, tissueTopTex, tissueBottomTex] = useLoader(TextureLoader, [
    '/textures/box_lid_photo.jpg',
    '/textures/box_inner_lid_photo.jpg',
    '/textures/tissue_flap_top.jpg',
    '/textures/tissue_flap_bottom.jpg',
  ]);

  // Configure texture parameters for crisp rendering
  useMemo(() => {
    [outerLidTex, innerLidTex, tissueTopTex, tissueBottomTex].forEach((tex) => {
      if (tex) {
        tex.generateMipmaps = true;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.colorSpace = THREE.SRGBColorSpace;
      }
    });
  }, [outerLidTex, innerLidTex, tissueTopTex, tissueBottomTex]);

  // Cardboard base material matching authentic off-white packaging
  const cardboardBaseMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#ECEAE4',
    roughness: 0.88,
    metalness: 0.02,
  }), []);

  const innerCavityMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#DFDDD6',
    roughness: 0.92,
    metalness: 0.01,
  }), []);

  // Outer lid material
  const outerLidMat = useMemo(() => new THREE.MeshStandardMaterial({
    map: outerLidTex,
    roughness: 0.82,
    metalness: 0.02,
  }), [outerLidTex]);

  // Inner lid material (with quote & constellation)
  const innerLidMat = useMemo(() => new THREE.MeshStandardMaterial({
    map: innerLidTex,
    roughness: 0.84,
    metalness: 0.02,
  }), [innerLidTex]);

  // Top horizontal tissue flap material
  const tissueTopMat = useMemo(() => new THREE.MeshStandardMaterial({
    map: tissueTopTex,
    roughness: 0.90,
    metalness: 0.02,
    transparent: true,
    opacity: 0.96,
    side: THREE.DoubleSide,
  }), [tissueTopTex]);

  // Bottom horizontal tissue flap material (with Limited Edition seal)
  const tissueBottomMat = useMemo(() => new THREE.MeshStandardMaterial({
    map: tissueBottomTex,
    roughness: 0.90,
    metalness: 0.02,
    transparent: true,
    opacity: 0.96,
    side: THREE.DoubleSide,
  }), [tissueBottomTex]);

  // Box Dimensions: Width 3.6, Height 0.65, Depth 2.5
  const boxWidth = 3.6;
  const boxHeight = 0.65;
  const boxDepth = 2.5;
  const wallThickness = 0.07;
  const flapDepth = (boxDepth - 0.2) / 2 + 0.12; // 1.27m per flap for authentic center overlap

  // Store original vertex coordinates for physical wave calculations
  const topGeo = useMemo(() => new THREE.PlaneGeometry(boxWidth - 0.22, flapDepth, 32, 32), [boxWidth, flapDepth]);
  const bottomGeo = useMemo(() => new THREE.PlaneGeometry(boxWidth - 0.22, flapDepth, 32, 32), [boxWidth, flapDepth]);

  const topOriginalZ = useMemo(() => {
    const arr = new Float32Array(topGeo.attributes.position.count);
    return arr;
  }, [topGeo]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // 1. Lid Open Animation with Physical Spring Easing (Scroll 0.06 -> 0.32)
    if (lidHingeRef.current) {
      let targetLidAngle = 0;
      if (scrollProgress >= 0.06 && scrollProgress <= 0.32) {
        const t = (scrollProgress - 0.06) / 0.26;
        const easeT = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        targetLidAngle = -easeT * (Math.PI * 0.64);
      } else if (scrollProgress > 0.32) {
        targetLidAngle = -(Math.PI * 0.64);
      }
      lidHingeRef.current.rotation.x = THREE.MathUtils.lerp(lidHingeRef.current.rotation.x, targetLidAngle, 0.15);
    }

    // 2. Physical Tissue Paper Opening with dynamic cloth/paper wave deformation (Scroll 0.24 -> 0.52)
    if (tissueTopHingeRef.current && tissueBottomHingeRef.current) {
      let tOpening = 0;
      let tissueOpacity = 0.96;

      if (scrollProgress >= 0.24 && scrollProgress <= 0.52) {
        tOpening = (scrollProgress - 0.24) / 0.28;
      } else if (scrollProgress > 0.52 && scrollProgress <= 0.66) {
        tOpening = 1.0;
        const fadeT = (scrollProgress - 0.52) / 0.14;
        tissueOpacity = Math.max(0.1, 0.96 - fadeT * 0.86);
      } else if (scrollProgress > 0.66) {
        tOpening = 1.0;
        tissueOpacity = 0.1;
      }

      // Smooth elastic easing for physical paper unfolding
      const easePaper = tOpening < 0.5
        ? 2 * tOpening * tOpening
        : -1 + (4 - 2 * tOpening) * tOpening;

      // Air turbulence flutter during dynamic peel
      const turbulence = Math.sin(time * 5.5) * 0.035 * tOpening * (1 - tOpening * 0.75);

      // Rotational Hinge Target (Top folds backward, Bottom folds forward)
      const targetTopAngle = -easePaper * (Math.PI * 0.55) - turbulence;
      const targetBottomAngle = easePaper * (Math.PI * 0.55) + turbulence;

      tissueTopHingeRef.current.rotation.x = THREE.MathUtils.lerp(tissueTopHingeRef.current.rotation.x, targetTopAngle, 0.14);
      tissueBottomHingeRef.current.rotation.x = THREE.MathUtils.lerp(tissueBottomHingeRef.current.rotation.x, targetBottomAngle, 0.14);

      // Real-time Vertex Crinkling & Paper Curl Deformation
      if (topMeshRef.current && bottomMeshRef.current && tOpening > 0.01 && tOpening < 0.99) {
        const topPos = topMeshRef.current.geometry.attributes.position;
        const botPos = bottomMeshRef.current.geometry.attributes.position;
        const curlFactor = Math.sin(tOpening * Math.PI) * 0.12;

        for (let i = 0; i < topPos.count; i++) {
          const vx = topPos.getX(i);
          const vy = topPos.getY(i);
          // Distance from hinge (normalized 0 to 1)
          const distNorm = (vy + flapDepth / 2) / flapDepth;
          
          // Paper crinkle waves + edge curl
          const crinkle = Math.sin(vx * 6.0 + time * 4.0) * Math.cos(vy * 5.0 + time * 3.0) * 0.02 * tOpening;
          const curl = Math.pow(distNorm, 2) * curlFactor;
          
          topPos.setZ(i, curl + crinkle);
          botPos.setZ(i, curl - crinkle);
        }
        topPos.needsUpdate = true;
        botPos.needsUpdate = true;
      }

      tissueTopMat.opacity = THREE.MathUtils.lerp(tissueTopMat.opacity, tissueOpacity, 0.1);
      tissueBottomMat.opacity = THREE.MathUtils.lerp(tissueBottomMat.opacity, tissueOpacity, 0.1);
    }

    // 3. Box group subtle sink into black gradient veil (Scroll 0.36 -> 0.65)
    if (boxGroupRef.current) {
      let boxY = 0;
      let boxScale = 1;
      if (scrollProgress > 0.36) {
        const t = Math.min(1, (scrollProgress - 0.36) / 0.29);
        boxY = -t * 3.0;
        boxScale = 1 - t * 0.42;
      }
      boxGroupRef.current.position.y = THREE.MathUtils.lerp(boxGroupRef.current.position.y, boxY, 0.1);
      boxGroupRef.current.scale.setScalar(THREE.MathUtils.lerp(boxGroupRef.current.scale.x, boxScale, 0.1));
    }
  });

  return (
    <group ref={boxGroupRef} position={[0, -0.35, 0]}>
      {/* 1. BOTTOM TRAY & WALLS */}
      {/* Floor */}
      <mesh position={[0, -boxHeight / 2 + wallThickness / 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[boxWidth, wallThickness, boxDepth]} />
        <primitive object={cardboardBaseMat} attach="material" />
      </mesh>

      {/* Front Wall */}
      <mesh position={[0, 0, boxDepth / 2 - wallThickness / 2]} receiveShadow castShadow>
        <boxGeometry args={[boxWidth, boxHeight, wallThickness]} />
        <primitive object={cardboardBaseMat} attach="material" />
      </mesh>

      {/* Back Wall */}
      <mesh position={[0, 0, -boxDepth / 2 + wallThickness / 2]} receiveShadow castShadow>
        <boxGeometry args={[boxWidth, boxHeight, wallThickness]} />
        <primitive object={cardboardBaseMat} attach="material" />
      </mesh>

      {/* Left Wall */}
      <mesh position={[-boxWidth / 2 + wallThickness / 2, 0, 0]} receiveShadow castShadow>
        <boxGeometry args={[wallThickness, boxHeight, boxDepth - wallThickness * 2]} />
        <primitive object={cardboardBaseMat} attach="material" />
      </mesh>

      {/* Right Wall */}
      <mesh position={[boxWidth / 2 - wallThickness / 2, 0, 0]} receiveShadow castShadow>
        <boxGeometry args={[wallThickness, boxHeight, boxDepth - wallThickness * 2]} />
        <primitive object={cardboardBaseMat} attach="material" />
      </mesh>

      {/* Inner Cavity Bed */}
      <mesh position={[0, -boxHeight / 2 + wallThickness + 0.04, 0]} receiveShadow>
        <boxGeometry args={[boxWidth - wallThickness * 2 - 0.02, 0.06, boxDepth - wallThickness * 2 - 0.02]} />
        <primitive object={innerCavityMat} attach="material" />
      </mesh>

      {/* 2. ARTICULATED BOX LID WITH BACK HINGE */}
      <group ref={lidHingeRef} position={[0, boxHeight / 2, -boxDepth / 2]}>
        <group position={[0, wallThickness / 2, boxDepth / 2]}>
          {/* Outer Lid Face (Top with Authentic Packaging Photo) */}
          <mesh position={[0, wallThickness / 2 + 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow castShadow>
            <planeGeometry args={[boxWidth + 0.04, boxDepth + 0.04]} />
            <primitive object={outerLidMat} attach="material" />
          </mesh>

          {/* Inner Lid Face (Bottom with Authentic Manifesto & Star Photo) */}
          <mesh position={[0, -wallThickness / 2 - 0.002, 0]} rotation={[Math.PI / 2, 0, Math.PI]} receiveShadow>
            <planeGeometry args={[boxWidth + 0.03, boxDepth + 0.03]} />
            <primitive object={innerLidMat} attach="material" />
          </mesh>

          {/* Lid Solid Core */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[boxWidth + 0.04, wallThickness, boxDepth + 0.04]} />
            <primitive object={cardboardBaseMat} attach="material" />
          </mesh>

          {/* Lid Rims / Lip */}
          <mesh position={[0, -0.05, boxDepth / 2 + 0.015]} castShadow>
            <boxGeometry args={[boxWidth + 0.05, 0.10, wallThickness]} />
            <primitive object={cardboardBaseMat} attach="material" />
          </mesh>
          <mesh position={[-boxWidth / 2 - 0.015, -0.05, 0]} castShadow>
            <boxGeometry args={[wallThickness, 0.10, boxDepth + 0.05]} />
            <primitive object={cardboardBaseMat} attach="material" />
          </mesh>
          <mesh position={[boxWidth / 2 + 0.015, -0.05, 0]} castShadow>
            <boxGeometry args={[wallThickness, 0.10, boxDepth + 0.05]} />
            <primitive object={cardboardBaseMat} attach="material" />
          </mesh>
        </group>
      </group>

      {/* 3. PHYSICAL HORIZONTAL SEAM TISSUE PACKAGING (Top & Bottom Flaps with High-Res Textures & Wave Deformation) */}
      {/* Top Flap: Hinged along the back wall, folds backward */}
      <group ref={tissueTopHingeRef} position={[0, 0.27, -boxDepth / 2 + wallThickness + 0.02]}>
        <mesh ref={topMeshRef} position={[0, 0, flapDepth / 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow geometry={topGeo}>
          <primitive object={tissueTopMat} attach="material" />
        </mesh>
      </group>

      {/* Bottom Flap: Hinged along the front wall, folds forward (overlaps top flap at center seam) */}
      <group ref={tissueBottomHingeRef} position={[0, 0.275, boxDepth / 2 - wallThickness - 0.02]}>
        <mesh ref={bottomMeshRef} position={[0, 0, -flapDepth / 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow geometry={bottomGeo}>
          <primitive object={tissueBottomMat} attach="material" />
        </mesh>
      </group>
    </group>
  );
};
