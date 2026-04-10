'use client';

import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox, Text, Float } from '@react-three/drei';
import * as THREE from 'three';

function Phone() {
  const phoneRef = useRef<THREE.Group>(null);
  const [ringPhase, setRingPhase] = useState(0);

  useFrame((state) => {
    if (phoneRef.current) {
      // Vibrate/shake effect during ring
      const time = state.clock.elapsedTime;
      const ringIntensity = Math.sin(time * 30) * 0.02;
      const phase = Math.floor(time * 2) % 4;

      if (phase < 2) {
        phoneRef.current.rotation.z = ringIntensity;
        phoneRef.current.position.x = Math.sin(time * 30) * 0.02;
      } else {
        phoneRef.current.rotation.z = THREE.MathUtils.lerp(phoneRef.current.rotation.z, 0, 0.1);
        phoneRef.current.position.x = THREE.MathUtils.lerp(phoneRef.current.position.x, 0, 0.1);
      }

      setRingPhase(phase);
    }
  });

  return (
    <group ref={phoneRef}>
      {/* Phone body */}
      <RoundedBox args={[0.8, 1.6, 0.08]} radius={0.08} smoothness={4}>
        <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
      </RoundedBox>

      {/* Screen */}
      <RoundedBox args={[0.7, 1.4, 0.01]} radius={0.05} smoothness={4} position={[0, 0, 0.045]}>
        <meshStandardMaterial
          color={ringPhase < 2 ? '#22c55e' : '#1e293b'}
          emissive={ringPhase < 2 ? '#22c55e' : '#000000'}
          emissiveIntensity={ringPhase < 2 ? 0.5 : 0}
        />
      </RoundedBox>

      {/* Call icon on screen */}
      {ringPhase < 2 && (
        <Float speed={5} rotationIntensity={0} floatIntensity={0.1}>
          <mesh position={[0, 0.2, 0.06]}>
            <circleGeometry args={[0.15, 32]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.3} />
          </mesh>
        </Float>
      )}

      {/* Camera/notch */}
      <mesh position={[0, 0.65, 0.045]}>
        <circleGeometry args={[0.03, 16]} />
        <meshStandardMaterial color="#0a0e1a" />
      </mesh>
    </group>
  );
}

function RingWaves() {
  const wavesRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (wavesRef.current) {
      wavesRef.current.children.forEach((child, index) => {
        const mesh = child as THREE.Mesh;
        const scale = 1 + Math.sin(state.clock.elapsedTime * 3 - index * 0.5) * 0.3;
        mesh.scale.setScalar(scale);
        const material = mesh.material as THREE.MeshStandardMaterial;
        material.opacity = 0.3 - index * 0.08;
      });
    }
  });

  return (
    <group ref={wavesRef} position={[0, 0, -0.1]}>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} scale={1 + i * 0.3}>
          <ringGeometry args={[0.9 + i * 0.2, 1 + i * 0.2, 32]} />
          <meshStandardMaterial
            color="#f59e0b"
            transparent
            opacity={0.3 - i * 0.08}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

function MissedLabel({ show }: { show: boolean }) {
  if (!show) return null;

  return (
    <Float speed={2} rotationIntensity={0} floatIntensity={0.5}>
      <group position={[0, 1.2, 0]}>
        <RoundedBox args={[1.2, 0.4, 0.05]} radius={0.05}>
          <meshStandardMaterial color="#ef4444" />
        </RoundedBox>
        <Text
          position={[0, 0, 0.03]}
          fontSize={0.15}
          color="white"
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter-bold.woff"
        >
          MISSED CALL
        </Text>
      </group>
    </Float>
  );
}

function Scene() {
  const [showMissed, setShowMissed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowMissed(true), 4000);
    const resetTimer = setInterval(() => {
      setShowMissed(false);
      setTimeout(() => setShowMissed(true), 4000);
    }, 8000);

    return () => {
      clearTimeout(timer);
      clearInterval(resetTimer);
    };
  }, []);

  return (
    <>
      <Phone />
      <RingWaves />
      <MissedLabel show={showMissed} />
    </>
  );
}

export default function PhoneRinging() {
  return (
    <Canvas camera={{ position: [0, 0, 3], fov: 50 }} style={{ background: 'transparent' }}>
      <color attach="background" args={['#0a0e1a']} />

      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
      <pointLight position={[-5, -5, 5]} intensity={0.5} color="#f59e0b" />

      <Scene />
    </Canvas>
  );
}
