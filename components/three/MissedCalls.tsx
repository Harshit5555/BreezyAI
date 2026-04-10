'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface CallParticle {
  id: number;
  startPos: THREE.Vector3;
  targetPos: THREE.Vector3;
  progress: number;
  speed: number;
  isMissed: boolean;
  delay: number;
}

function Phone({ position, isRinging }: { position: [number, number, number]; isRinging: boolean }) {
  const phoneRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (phoneRef.current && isRinging) {
      phoneRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 20) * 0.1;
    }
  });

  return (
    <group ref={phoneRef} position={position}>
      {/* Phone body */}
      <mesh>
        <boxGeometry args={[0.4, 0.8, 0.08]} />
        <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Screen */}
      <mesh position={[0, 0.05, 0.045]}>
        <boxGeometry args={[0.32, 0.55, 0.01]} />
        <meshBasicMaterial color={isRinging ? '#22c55e' : '#0f172a'} />
      </mesh>
      {/* Glow when ringing */}
      {isRinging && (
        <pointLight position={[0, 0, 0.2]} intensity={0.5} color="#22c55e" distance={2} />
      )}
    </group>
  );
}

function CallStream({ missedPercent, monthlySearches }: { missedPercent: number; monthlySearches: number }) {
  const [particles, setParticles] = useState<CallParticle[]>([]);
  const particlesRef = useRef<THREE.Points>(null);
  const lastSpawnRef = useRef(0);

  // Generate particle positions for rendering
  const positions = useMemo(() => new Float32Array(50 * 3), []);
  const colors = useMemo(() => new Float32Array(50 * 3), []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Spawn new particles
    if (time - lastSpawnRef.current > 0.3) {
      lastSpawnRef.current = time;
      const isMissed = Math.random() < missedPercent / 100;

      setParticles(prev => {
        const newParticles = [...prev];
        if (newParticles.length > 40) newParticles.shift();

        newParticles.push({
          id: Date.now(),
          startPos: new THREE.Vector3(-4 + Math.random() * 2, Math.random() * 2 - 1, Math.random() - 0.5),
          targetPos: new THREE.Vector3(0, 0, 0),
          progress: 0,
          speed: 0.015 + Math.random() * 0.01,
          isMissed,
          delay: 0,
        });

        return newParticles;
      });
    }

    // Update particles
    setParticles(prev =>
      prev.map(p => ({
        ...p,
        progress: Math.min(p.progress + p.speed, 1),
      })).filter(p => p.progress < 1)
    );

    // Update buffer
    if (particlesRef.current) {
      particles.forEach((p, i) => {
        if (i >= 50) return;

        const pos = new THREE.Vector3().lerpVectors(p.startPos, p.targetPos, p.progress);

        // Add curve to path
        pos.y += Math.sin(p.progress * Math.PI) * 0.5;

        // If missed, veer off at the end
        if (p.isMissed && p.progress > 0.7) {
          const missProgress = (p.progress - 0.7) / 0.3;
          pos.x += missProgress * 2;
          pos.y -= missProgress * 1.5;
        }

        positions[i * 3] = pos.x;
        positions[i * 3 + 1] = pos.y;
        positions[i * 3 + 2] = pos.z;

        // Color: green for answered, red for missed
        if (p.isMissed) {
          colors[i * 3] = 0.94;     // R
          colors[i * 3 + 1] = 0.27; // G
          colors[i * 3 + 2] = 0.27; // B
        } else {
          colors[i * 3] = 0.13;
          colors[i * 3 + 1] = 0.77;
          colors[i * 3 + 2] = 0.37;
        }
      });

      particlesRef.current.geometry.attributes.position.needsUpdate = true;
      particlesRef.current.geometry.attributes.color.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.15} vertexColors transparent opacity={0.8} sizeAttenuation />
    </points>
  );
}

function Scene({ missedPercent, monthlySearches }: { missedPercent: number; monthlySearches: number }) {
  const [ringState, setRingState] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setRingState(prev => !prev);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[3, 3, 3]} intensity={0.6} />

      {/* Phone in center */}
      <Phone position={[0, 0, 0]} isRinging={ringState} />

      {/* Call stream */}
      <CallStream missedPercent={missedPercent} monthlySearches={monthlySearches} />

      {/* Labels */}
      <Html position={[-3, 1.5, 0]} center>
        <div className="text-center text-white text-sm font-medium whitespace-nowrap">
          <span className="text-zinc-400">~{monthlySearches.toLocaleString()}</span>
          <br />
          <span className="text-xs text-zinc-500">monthly searches</span>
        </div>
      </Html>

      <Html position={[2.5, -1, 0]} center>
        <div className="text-center whitespace-nowrap">
          <span className="text-red-500 text-lg font-bold">{missedPercent}%</span>
          <br />
          <span className="text-xs text-zinc-500">missed while closed</span>
        </div>
      </Html>
    </>
  );
}

interface MissedCallsProps {
  missedPercent: number;
  monthlySearches: number;
}

export default function MissedCalls({ missedPercent, monthlySearches }: MissedCallsProps) {
  return (
    <div className="w-full h-[300px] bg-[#0a0e1a] rounded-2xl overflow-hidden border border-zinc-800/50">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }} dpr={[1, 2]}>
        <Scene missedPercent={missedPercent} monthlySearches={monthlySearches} />
      </Canvas>
    </div>
  );
}
