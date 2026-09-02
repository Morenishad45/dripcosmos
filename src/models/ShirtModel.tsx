import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';

interface ShirtModelProps {
  scrollProgress: number; // 0 to 1
  dragRotationY: number;  // Interactive user drag rotation offset
  isUserInteracting: boolean;
}

export const ShirtModel: React.FC<ShirtModelProps> = ({
  scrollProgress,
  dragRotationY,
  isUserInteracting,
}) => {
  const shirtGroupRef = useRef<THREE.Group>(null);
  const leftSleeveRef = useRef<THREE.Group>(null);
  const rightSleeveRef = useRef<THREE.Group>(null);
  const torsoRef = useRef<THREE.Group>(null);

  // Physics velocity & inertia tracking refs
  const physicsVelocity = useRef({ y: 0, rotY: 0, sleeveAngle: 0 });
  const lastScrollProgress = useRef(scrollProgress);

  // Load high-resolution master textures built from techpack & master eagle art
  const [frontTexture, backTexture] = useLoader(TextureLoader, [
    '/textures/shirt_master_front.png',
    '/textures/shirt_master_back.png',
  ]);

  // Configure texture parameters
  useMemo(() => {
    if (frontTexture) {
      frontTexture.generateMipmaps = true;
      frontTexture.minFilter = THREE.LinearMipmapLinearFilter;
      frontTexture.magFilter = THREE.LinearFilter;
      frontTexture.colorSpace = THREE.SRGBColorSpace;
    }
    if (backTexture) {
      backTexture.generateMipmaps = true;
      backTexture.minFilter = THREE.LinearMipmapLinearFilter;
      backTexture.magFilter = THREE.LinearFilter;
      backTexture.colorSpace = THREE.SRGBColorSpace;
    }
  }, [frontTexture, backTexture]);

  // Luxury Off-White Fabric Material matching authentic 280 GSM combed cotton
  const fabricBodyMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#F2EFE0',
    roughness: 0.88,
    metalness: 0.02,
    side: THREE.DoubleSide,
  }), []);

  // Front Graphic Material
  const frontMat = useMemo(() => new THREE.MeshStandardMaterial({
    map: frontTexture,
    color: '#FFFFFF',
    roughness: 0.84,
    metalness: 0.02,
    side: THREE.FrontSide,
  }), [frontTexture]);

  // Back Graphic Material (Eagle Vision Masterpiece)
  const backMat = useMemo(() => new THREE.MeshStandardMaterial({
    map: backTexture,
    color: '#FFFFFF',
    roughness: 0.84,
    metalness: 0.02,
    side: THREE.FrontSide,
  }), [backTexture]);

  // Collar Ribbing Material
  const collarMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#ECE8DF',
    roughness: 0.90,
    metalness: 0.01,
  }), []);

  useFrame((state, delta) => {
    if (!shirtGroupRef.current || !torsoRef.current || !leftSleeveRef.current || !rightSleeveRef.current) return;

    // Calculate scroll delta velocity for inertia
    const scrollDelta = (scrollProgress - lastScrollProgress.current) / Math.max(0.01, delta);
    lastScrollProgress.current = scrollProgress;

    // Spring physics accumulator
    physicsVelocity.current.y = THREE.MathUtils.lerp(physicsVelocity.current.y, scrollDelta * 0.04, 0.1);

    // Target spatial values based on scroll unboxing milestones
    let targetY = 0.05;
    let targetZ = 0;
    let targetScaleX = 0.45;
    let targetScaleY = 0.45;
    let targetScaleZ = 0.15;
    let targetRotX = -Math.PI / 2;
    let targetRotY = 0;
    let targetRotZ = 0;

    let sleeveLeftFold = 1.35;
    let sleeveRightFold = -1.35;

    if (scrollProgress < 0.55) {
      // Resting inside box cavity (folded state)
      targetY = 0.06;
      targetZ = 0;
      targetRotX = -Math.PI / 2;
      targetRotY = 0;
      targetScaleX = 0.45;
      targetScaleY = 0.45;
      targetScaleZ = 0.15;
      sleeveLeftFold = 1.35;
      sleeveRightFold = -1.35;
    } else if (scrollProgress >= 0.55 && scrollProgress < 0.72) {
      // Emerging & rising out of box with spring inertia
      const t = (scrollProgress - 0.55) / 0.17;
      const easeT = t * t * (3 - 2 * t);

      targetY = 0.06 + easeT * 1.5 + physicsVelocity.current.y;
      targetZ = easeT * 0.4;
      targetRotX = -Math.PI / 2 + easeT * (Math.PI / 2);
      targetRotY = 0;
      targetScaleX = 0.45 + easeT * 0.3;
      targetScaleY = 0.45 + easeT * 0.35;
      targetScaleZ = 0.15 + easeT * 0.1;
      sleeveLeftFold = 1.35 - easeT * 0.6;
      sleeveRightFold = -1.35 + easeT * 0.6;
    } else if (scrollProgress >= 0.72 && scrollProgress < 0.88) {
      // Unfolding sleeves with physical momentum and settling into streetwear drape
      const t = (scrollProgress - 0.72) / 0.16;
      const easeT = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      targetY = 1.56 + easeT * 0.2;
      targetZ = 0.4 + easeT * 0.2;
      targetRotX = 0;
      targetRotY = 0;
      targetScaleX = 0.75 + easeT * 0.35;
      targetScaleY = 0.80 + easeT * 0.30;
      targetScaleZ = 0.25 + easeT * 0.05;
      sleeveLeftFold = (1 - easeT) * 0.85;
      sleeveRightFold = -(1 - easeT) * 0.85;
    } else {
      // 0.88 -> 1.00: 360 Product Hero Showcase
      const heroT = (scrollProgress - 0.88) / 0.12;
      targetY = 1.76;
      targetZ = 0.6;
      targetRotX = 0;
      targetRotY = heroT * Math.PI * 2;
      targetScaleX = 1.1;
      targetScaleY = 1.1;
      targetScaleZ = 0.3;
      sleeveLeftFold = 0;
      sleeveRightFold = 0;
    }

    // Add interactive user drag rotation with inertia
    if (scrollProgress >= 0.80) {
      targetRotY += dragRotationY;
    }

    // Real-time fabric physics: organic breathing and cloth sway
    const time = state.clock.getElapsedTime();
    const clothSway = Math.sin(time * 1.6) * 0.015;
    const clothBreathe = Math.sin(time * 2.2) * 0.008;
    const sleevePendulum = Math.cos(time * 1.6) * 0.02;

    const lerpSpeed = isUserInteracting ? 0.25 : 0.09;
    shirtGroupRef.current.position.y = THREE.MathUtils.lerp(shirtGroupRef.current.position.y, targetY + clothSway, lerpSpeed);
    shirtGroupRef.current.position.z = THREE.MathUtils.lerp(shirtGroupRef.current.position.z, targetZ, lerpSpeed);
    shirtGroupRef.current.rotation.x = THREE.MathUtils.lerp(shirtGroupRef.current.rotation.x, targetRotX, lerpSpeed);
    shirtGroupRef.current.rotation.y = THREE.MathUtils.lerp(shirtGroupRef.current.rotation.y, targetRotY, lerpSpeed);
    shirtGroupRef.current.rotation.z = THREE.MathUtils.lerp(shirtGroupRef.current.rotation.z, targetRotZ + clothSway * 0.4, lerpSpeed);

    shirtGroupRef.current.scale.x = THREE.MathUtils.lerp(shirtGroupRef.current.scale.x, targetScaleX * (1 + clothBreathe), lerpSpeed);
    shirtGroupRef.current.scale.y = THREE.MathUtils.lerp(shirtGroupRef.current.scale.y, targetScaleY, lerpSpeed);
    shirtGroupRef.current.scale.z = THREE.MathUtils.lerp(shirtGroupRef.current.scale.z, targetScaleZ, lerpSpeed);

    // Natural sleeve drape with pendulum gravity
    leftSleeveRef.current.rotation.z = THREE.MathUtils.lerp(leftSleeveRef.current.rotation.z, sleeveLeftFold + sleevePendulum, lerpSpeed);
    rightSleeveRef.current.rotation.z = THREE.MathUtils.lerp(rightSleeveRef.current.rotation.z, sleeveRightFold - sleevePendulum, lerpSpeed);
  });

  return (
    <group ref={shirtGroupRef} position={[0, 0.06, 0]}>
      {/* 1. TORSO BODY */}
      <group ref={torsoRef} position={[0, 0, 0]}>
        {/* Front Shirt Face with authentic Master Artwork */}
        <mesh position={[0, 0, 0.055]} receiveShadow castShadow>
          <planeGeometry args={[2.0, 2.3, 32, 32]} />
          <primitive object={frontMat} attach="material" />
        </mesh>

        {/* Back Shirt Face with authentic Eagle Vision Masterpiece */}
        <mesh position={[0, 0, -0.055]} rotation={[0, Math.PI, 0]} receiveShadow castShadow>
          <planeGeometry args={[2.0, 2.3, 32, 32]} />
          <primitive object={backMat} attach="material" />
        </mesh>

        {/* Inner / Edge Garment Thickness */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.98, 2.28, 0.10]} />
          <primitive object={fabricBodyMat} attach="material" />
        </mesh>

        {/* 2. REINFORCED CREW COLLAR */}
        <mesh position={[0, 1.15, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.38, 0.042, 16, 32]} />
          <primitive object={collarMat} attach="material" />
        </mesh>

        {/* 3. HEM TRIM */}
        <mesh position={[0, -1.14, 0]} castShadow>
          <boxGeometry args={[2.02, 0.045, 0.11]} />
          <primitive object={collarMat} attach="material" />
        </mesh>
      </group>

      {/* 4. LEFT SLEEVE (Angled at 32° drop shoulder) */}
      <group ref={leftSleeveRef} position={[-0.98, 0.88, 0]}>
        <group position={[-0.45, -0.25, 0]} rotation={[0, 0, 0.35]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.9, 0.7, 0.10]} />
            <primitive object={fabricBodyMat} attach="material" />
          </mesh>
          {/* Cuff Trim */}
          <mesh position={[-0.44, 0, 0]} castShadow>
            <boxGeometry args={[0.04, 0.72, 0.11]} />
            <primitive object={collarMat} attach="material" />
          </mesh>
        </group>
      </group>

      {/* 5. RIGHT SLEEVE (Angled at 32° drop shoulder) */}
      <group ref={rightSleeveRef} position={[0.98, 0.88, 0]}>
        <group position={[0.45, -0.25, 0]} rotation={[0, 0, -0.35]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.9, 0.7, 0.10]} />
            <primitive object={fabricBodyMat} attach="material" />
          </mesh>
          {/* Cuff Trim */}
          <mesh position={[0.44, 0, 0]} castShadow>
            <boxGeometry args={[0.04, 0.72, 0.11]} />
            <primitive object={collarMat} attach="material" />
          </mesh>
        </group>
      </group>
    </group>
  );
};
