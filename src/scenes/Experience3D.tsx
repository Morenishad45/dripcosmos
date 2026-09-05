import React, { useRef, useMemo, Suspense } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import { BoxModel } from '../models/BoxModel';

interface Experience3DProps {
  scrollProgress: number;
  dragRotationY: number;
  isUserInteracting: boolean;
}

// Micro cosmic floating dust particles
const CosmicParticles: React.FC<{ count?: number }> = ({ count = 90 }) => {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = Math.random() * 8 - 1;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 14;
    }
    return [pos];
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.getElapsedTime() * 0.15;
    pointsRef.current.rotation.y = time * 0.2;
    pointsRef.current.rotation.x = Math.sin(time * 0.3) * 0.05;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#D4AF37"
        transparent
        opacity={0.35}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// Camera Controller Choreographing the cinematic unboxing trajectory
const CameraController: React.FC<{ scrollProgress: number }> = ({ scrollProgress }) => {
  const lookTarget = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state) => {
    const cam = state.camera;
    const targetCamPos = new THREE.Vector3(0, 2.6, 5.0);
    const targetLook = new THREE.Vector3(0, 0, 0);

    // Responsive aspect ratio compensation for mobile devices (portrait screens)
    const aspect = state.viewport.aspect;
    const mobileZoomFactor = aspect < 1.0 ? Math.min(1.35, 0.95 / aspect) : 1.0;

    if (scrollProgress < 0.15) {
      // SHOT 01: Wide closed-box 3/4 hero
      const t = scrollProgress / 0.15;
      targetCamPos.set(0, (2.6 - t * 0.2) * (1 + (mobileZoomFactor - 1) * 0.25), (5.0 - t * 0.4) * mobileZoomFactor);
      targetLook.set(0, 0, 0);
    } else if (scrollProgress >= 0.15 && scrollProgress < 0.40) {
      // SHOT 02: Camera rises and angles as lid opens
      const t = (scrollProgress - 0.15) / 0.25;
      targetCamPos.set(0, (2.4 + t * 0.9) * (1 + (mobileZoomFactor - 1) * 0.25), (4.6 - t * 0.8) * mobileZoomFactor);
      targetLook.set(0, t * 0.25, 0);
    } else if (scrollProgress >= 0.40 && scrollProgress < 0.65) {
      // SHOT 03: Looks directly into box as tissue reveals
      const t = (scrollProgress - 0.40) / 0.25;
      targetCamPos.set(0, (3.3 + t * 0.2) * (1 + (mobileZoomFactor - 1) * 0.25), (3.8 - t * 0.4) * mobileZoomFactor);
      targetLook.set(0, 0.25, 0);
    } else {
      // SHOT 04: Smoothly recedes as editorial content flows
      const t = Math.min(1, (scrollProgress - 0.65) / 0.35);
      targetCamPos.set(0, (3.5 - t * 0.8) * (1 + (mobileZoomFactor - 1) * 0.25), (3.4 + t * 1.5) * mobileZoomFactor);
      targetLook.set(0, 0.25 - t * 0.4, 0);
    }

    // Smooth camera lerp
    cam.position.lerp(targetCamPos, 0.08);
    lookTarget.current.lerp(targetLook, 0.08);
    cam.lookAt(lookTarget.current);
  });

  return null;
};

// Dynamic Studio Lighting Rig
const StudioLighting: React.FC<{ scrollProgress: number }> = ({ scrollProgress }) => {
  const warmEagleLightRef = useRef<THREE.DirectionalLight>(null);
  const isSmallScreen = typeof window !== 'undefined' && window.innerWidth < 768;

  useFrame(() => {
    if (warmEagleLightRef.current) {
      let warmIntensity = 0.3;
      if (scrollProgress >= 0.35 && scrollProgress <= 0.70) {
        warmIntensity = 1.4;
      }
      warmEagleLightRef.current.intensity = THREE.MathUtils.lerp(
        warmEagleLightRef.current.intensity,
        warmIntensity,
        0.08
      );
    }
  });

  return (
    <>
      <ambientLight intensity={0.7} color="#FAF8F5" />
      <directionalLight
        position={[4, 7, 5]}
        intensity={1.5}
        color="#FFFFFF"
        castShadow
        shadow-mapSize={isSmallScreen ? [1024, 1024] : [2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={20}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
        shadow-bias={-0.0001}
      />
      <directionalLight position={[-4, 3, 3]} intensity={0.6} color="#E8E5DD" />
      <directionalLight position={[0, 6, -5]} intensity={0.8} color="#D4D0C5" />
      <directionalLight
        ref={warmEagleLightRef}
        position={[0, 2, -3]}
        intensity={0.3}
        color="#E5A93C"
      />
    </>
  );
};

// Responsive Box Scene Container: Scales the 3D model smaller on mobile screens only & supports drag rotation
const ResponsiveBoxScene: React.FC<{ scrollProgress: number; dragRotationY: number }> = ({ scrollProgress, dragRotationY }) => {
  const { viewport } = useThree();
  const aspect = viewport.aspect;
  
  // Mobile check: On desktop/laptop/tablet aspect >= 1 (scale 1.0); on mobile portrait screens aspect < 1.0 (scale gracefully down to ~0.58-0.68)
  const isMobile = aspect < 1.0;
  const mobileScale = isMobile ? Math.max(0.58, Math.min(0.70, aspect * 0.88)) : 1.0;

  return (
    <>
      <group
        scale={mobileScale}
        position={[0, isMobile ? 0.08 : 0, 0]}
        rotation-y={dragRotationY}
      >
        <Suspense fallback={null}>
          <BoxModel scrollProgress={scrollProgress} />
        </Suspense>
      </group>

      <ContactShadows
        position={[0, -0.78 * (isMobile ? mobileScale : 1.0), 0]}
        opacity={0.7}
        scale={isMobile ? 6.0 : 8}
        blur={2.4}
        far={3.5}
        color="#000000"
      />
    </>
  );
};

export const Experience3D: React.FC<Experience3DProps> = ({
  scrollProgress,
  dragRotationY,
}) => {
  return (
    <div className="canvas-container">
      <Canvas
        shadows
        camera={{ position: [0, 2.6, 5.0], fov: 42, near: 0.1, far: 30 }}
        dpr={typeof window !== 'undefined' ? (window.innerWidth < 768 ? [1, 1.6] : [1, 2]) : [1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
        }}
      >
        <CameraController scrollProgress={scrollProgress} />
        <StudioLighting scrollProgress={scrollProgress} />
        <CosmicParticles />
        <ResponsiveBoxScene
          scrollProgress={scrollProgress}
          dragRotationY={dragRotationY}
        />
      </Canvas>
    </div>
  );
};

export default Experience3D;

