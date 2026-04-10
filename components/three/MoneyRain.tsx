'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Simple flowing lines - like a gentle current
function FlowLines() {
  const linesRef = useRef<THREE.Group>(null);
  const lineData = useRef<{ y: number; speed: number }[]>([]);

  const count = 15;

  const lines = useMemo(() => {
    const data = [];
    for (let i = 0; i < count; i++) {
      data.push({
        x: (i - count / 2) * 1.2 + (Math.random() - 0.5) * 0.5,
        initialY: 6 + Math.random() * 4,
        speed: 0.8 + Math.random() * 0.6,
        length: 2 + Math.random() * 3,
        opacity: 0.1 + Math.random() * 0.15,
      });
    }
    lineData.current = data.map(d => ({ y: d.initialY, speed: d.speed }));
    return data;
  }, []);

  useFrame((_, delta) => {
    if (linesRef.current) {
      linesRef.current.children.forEach((child, i) => {
        const line = lines[i];
        const data = lineData.current[i];

        data.y -= data.speed * delta;

        if (data.y < -8) {
          data.y = line.initialY;
        }

        child.position.y = data.y;
      });
    }
  });

  return (
    <group ref={linesRef}>
      {lines.map((line, i) => (
        <mesh key={i} position={[line.x, line.initialY, -2]}>
          <planeGeometry args={[0.02, line.length]} />
          <meshBasicMaterial
            color="#f59e0b"
            transparent
            opacity={line.opacity}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

// Subtle gradient backdrop
function Backdrop() {
  return (
    <mesh position={[0, 0, -5]}>
      <planeGeometry args={[30, 20]} />
      <meshBasicMaterial color="#1a1a1a" />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      <Backdrop />
      <FlowLines />
    </>
  );
}

export default function MoneyRain() {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 50 }}
      style={{ background: 'transparent' }}
      gl={{ alpha: true }}
    >
      <Scene />
    </Canvas>
  );
}
