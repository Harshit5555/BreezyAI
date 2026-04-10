'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function FloatingGrid() {
  const gridRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
      gridRef.current.rotation.x = -Math.PI / 4 + Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
    }
  });

  return (
    <group ref={gridRef} position={[0, -2, -8]} rotation={[-Math.PI / 4, 0, 0]}>
      <gridHelper args={[30, 30, '#1e293b', '#141821']} />
    </group>
  );
}

function AmbientParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 100;

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5;
      vel[i] = Math.random() * 0.5 + 0.2;
    }
    return [pos, vel];
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;

      for (let i = 0; i < count; i++) {
        positions[i * 3 + 1] += velocities[i] * 0.01;

        if (positions[i * 3 + 1] > 8) {
          positions[i * 3 + 1] = -8;
        }
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true;
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#f59e0b"
        transparent
        opacity={0.3}
        sizeAttenuation
      />
    </points>
  );
}

function GlowOrbs() {
  const orb1Ref = useRef<THREE.Mesh>(null);
  const orb2Ref = useRef<THREE.Mesh>(null);
  const orb3Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (orb1Ref.current) {
      orb1Ref.current.position.x = Math.sin(t * 0.3) * 5;
      orb1Ref.current.position.y = Math.cos(t * 0.4) * 3;
    }
    if (orb2Ref.current) {
      orb2Ref.current.position.x = Math.sin(t * 0.2 + 2) * 6;
      orb2Ref.current.position.y = Math.cos(t * 0.3 + 2) * 4;
    }
    if (orb3Ref.current) {
      orb3Ref.current.position.x = Math.sin(t * 0.25 + 4) * 4;
      orb3Ref.current.position.y = Math.cos(t * 0.35 + 4) * 2;
    }
  });

  return (
    <>
      <mesh ref={orb1Ref} position={[-5, 3, -10]}>
        <sphereGeometry args={[2, 16, 16]} />
        <meshBasicMaterial color="#f59e0b" transparent opacity={0.03} />
      </mesh>
      <mesh ref={orb2Ref} position={[6, -2, -12]}>
        <sphereGeometry args={[2.5, 16, 16]} />
        <meshBasicMaterial color="#ef4444" transparent opacity={0.02} />
      </mesh>
      <mesh ref={orb3Ref} position={[0, 4, -8]}>
        <sphereGeometry args={[1.5, 16, 16]} />
        <meshBasicMaterial color="#22c55e" transparent opacity={0.02} />
      </mesh>
    </>
  );
}

function Scene() {
  return (
    <>
      <FloatingGrid />
      <AmbientParticles />
      <GlowOrbs />
    </>
  );
}

export default function ReportBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }} dpr={[1, 1.5]}>
        <Scene />
      </Canvas>
    </div>
  );
}
