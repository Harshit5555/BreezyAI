'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

function Building({
  position,
  scale,
  color,
}: {
  position: [number, number, number];
  scale: [number, number, number];
  color: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  return (
    <Float speed={0.5} rotationIntensity={0} floatIntensity={0.3}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.6}
          emissive={color}
          emissiveIntensity={0.1}
        />
      </mesh>
    </Float>
  );
}

function CityGrid() {
  const buildings = useMemo(() => {
    const items: {
      position: [number, number, number];
      scale: [number, number, number];
      color: string;
    }[] = [];

    const colors = ['#1e293b', '#334155', '#475569', '#f59e0b'];

    for (let x = -8; x <= 8; x += 2) {
      for (let z = -8; z <= 8; z += 2) {
        const height = Math.random() * 2 + 0.5;
        const isAccent = Math.random() > 0.9;
        items.push({
          position: [x + Math.random() * 0.5, height / 2 - 3, z + Math.random() * 0.5],
          scale: [0.8 + Math.random() * 0.4, height, 0.8 + Math.random() * 0.4],
          color: isAccent ? colors[3] : colors[Math.floor(Math.random() * 3)],
        });
      }
    }
    return items;
  }, []);

  return (
    <>
      {buildings.map((building, i) => (
        <Building key={i} {...building} />
      ))}
    </>
  );
}

function ParticleField() {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 200;

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = Math.random() * 10 - 2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return geo;
  }, []);

  useFrame(() => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        positions[i * 3 + 1] += 0.01;
        if (positions[i * 3 + 1] > 8) {
          positions[i * 3 + 1] = -2;
        }
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef} geometry={geometry}>
      <pointsMaterial
        size={0.05}
        color="#f59e0b"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

function PointerTracker() {
  const { camera } = useThree();
  const targetX = useRef(0);
  const targetY = useRef(0);

  useFrame((state) => {
    targetX.current = state.pointer.x * 0.5;
    targetY.current = state.pointer.y * 0.3;

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX.current, 0.02);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY.current + 2, 0.02);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function Scene() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <CityGrid />
      <ParticleField />
      <Sparkles
        count={100}
        scale={15}
        size={2}
        speed={0.3}
        color="#f59e0b"
        opacity={0.3}
      />
    </group>
  );
}

export default function CityScene() {
  return (
    <Canvas
      camera={{ position: [0, 2, 10], fov: 60 }}
      style={{ background: 'transparent' }}
      gl={{ alpha: true, antialias: true }}
    >
      <color attach="background" args={['#0a0e1a']} />
      <fog attach="fog" args={['#0a0e1a', 5, 25]} />

      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} color="#ffffff" />
      <pointLight position={[-5, 3, 0]} intensity={0.5} color="#f59e0b" />

      <Scene />
      <PointerTracker />
    </Canvas>
  );
}
