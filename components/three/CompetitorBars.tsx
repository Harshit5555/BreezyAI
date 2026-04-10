'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { PlaceDetails } from '@/lib/types';

interface BarData {
  name: string;
  hours: number;
  isUser: boolean;
  placeId: string;
  rating?: number;
}

// Camera that slowly moves through the scene
function MovingCamera() {
  const { camera } = useThree();
  const time = useRef(0);

  useFrame((_, delta) => {
    time.current += delta * 0.3;

    // Gentle orbit around the scene
    const radius = 5;
    const height = 2.5 + Math.sin(time.current * 0.5) * 0.3;
    const angle = Math.sin(time.current * 0.4) * 0.4; // Subtle left-right sway

    camera.position.x = Math.sin(angle) * radius;
    camera.position.y = height;
    camera.position.z = Math.cos(angle) * radius;

    camera.lookAt(0, 0.8, 0);
  });

  return null;
}

function Bar({
  position,
  height,
  maxHeight,
  data,
  index,
  total,
}: {
  position: [number, number, number];
  height: number;
  maxHeight: number;
  data: BarData;
  index: number;
  total: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const [animatedHeight, setAnimatedHeight] = useState(0.05);
  const targetHeight = Math.max(0.4, (height / maxHeight) * 3);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedHeight(targetHeight);
    }, index * 150 + 400);
    return () => clearTimeout(timer);
  }, [targetHeight, index]);

  useFrame((state) => {
    if (meshRef.current) {
      // Smooth height animation
      meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, animatedHeight, 0.06);
      meshRef.current.position.y = meshRef.current.scale.y / 2;
    }

    if (groupRef.current) {
      // Subtle floating motion
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8 + index * 0.5) * 0.02;
    }
  });

  const color = data.isUser ? '#ef4444' : '#22c55e';
  const emissiveIntensity = data.isUser ? 0.4 : 0.2;

  return (
    <group ref={groupRef} position={position}>
      {/* Shadow/glow on ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[0.7, 0.7]} />
        <meshBasicMaterial color={color} transparent opacity={0.15} />
      </mesh>

      {/* Main bar */}
      <mesh ref={meshRef} scale={[1, 0.05, 1]}>
        <boxGeometry args={[0.5, 1, 0.5]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={emissiveIntensity}
          metalness={0.6}
          roughness={0.2}
        />
      </mesh>

      {/* Top cap highlight */}
      <mesh position={[0, animatedHeight + 0.02, 0]}>
        <boxGeometry args={[0.52, 0.04, 0.52]} />
        <meshBasicMaterial color={color} transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

function GridFloor() {
  return (
    <group>
      {/* Main floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#111" />
      </mesh>

      {/* Grid lines */}
      {Array.from({ length: 11 }).map((_, i) => (
        <group key={i}>
          <mesh position={[i - 5, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.01, 10]} />
            <meshBasicMaterial color="#222" />
          </mesh>
          <mesh position={[0, 0, i - 5]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[10, 0.01]} />
            <meshBasicMaterial color="#222" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Scene({ business, competitors }: { business: PlaceDetails; competitors: PlaceDetails[] }) {
  const allBusinesses = useMemo(() => {
    const all: BarData[] = [
      { name: business.name, hours: business.openHoursPerWeek || 0, isUser: true, placeId: business.placeId, rating: business.rating },
      ...competitors.slice(0, 4).map((c) => ({
        name: c.name,
        hours: c.openHoursPerWeek || 0,
        isUser: false,
        placeId: c.placeId,
        rating: c.rating,
      })),
    ].sort((a, b) => b.hours - a.hours);
    return all;
  }, [business, competitors]);

  const maxHours = Math.max(...allBusinesses.map((b) => b.hours), 80);
  const total = allBusinesses.length;

  // Arrange bars in a curved arc in 3D space
  const getBarPosition = (index: number, total: number): [number, number, number] => {
    const spread = 1.2;
    const depth = 0.8;

    // Create an arc arrangement
    const t = total > 1 ? index / (total - 1) : 0.5;
    const x = (t - 0.5) * (total - 1) * spread;
    const z = -Math.pow((t - 0.5) * 2, 2) * depth; // Parabolic curve

    return [x, 0, z];
  };

  return (
    <>
      <MovingCamera />

      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 8, 5]} intensity={0.6} />
      <directionalLight position={[-3, 5, -3]} intensity={0.3} color="#f59e0b" />
      <pointLight position={[0, 4, 0]} intensity={0.4} color="#fff" />

      <GridFloor />

      {/* Bars arranged in 3D arc */}
      {allBusinesses.map((data, index) => (
        <Bar
          key={data.placeId}
          position={getBarPosition(index, total)}
          height={data.hours}
          maxHeight={maxHours}
          data={data}
          index={index}
          total={total}
        />
      ))}

      {/* Ambient fog for depth */}
      <fog attach="fog" args={['#0a0a0a', 4, 12]} />
    </>
  );
}

interface CompetitorBarsProps {
  business: PlaceDetails;
  competitors: PlaceDetails[];
}

export default function CompetitorBars({ business, competitors }: CompetitorBarsProps) {
  const allBusinesses = useMemo(() => {
    const all = [
      { ...business, isUser: true },
      ...competitors.slice(0, 4).map((c) => ({ ...c, isUser: false })),
    ].sort((a, b) => (b.openHoursPerWeek || 0) - (a.openHoursPerWeek || 0));
    return all;
  }, [business, competitors]);

  if (competitors.length === 0) return null;

  return (
    <div className="rounded-xl overflow-hidden bg-[#0a0a0a]">
      {/* 3D Chart */}
      <div className="h-[260px]">
        <Canvas dpr={[1, 2]} gl={{ antialias: true }}>
          <color attach="background" args={['#0a0a0a']} />
          <Scene business={business} competitors={competitors} />
        </Canvas>
      </div>

      {/* Labels */}
      <div className="px-4 pb-4 pt-2 bg-gradient-to-t from-zinc-900/80 to-transparent -mt-8 relative z-10">
        <div className="flex justify-center gap-3">
          {allBusinesses.map((biz) => (
            <div
              key={biz.placeId}
              className="text-center"
            >
              <div className={`text-base font-semibold ${biz.isUser ? 'text-red-400' : 'text-green-400'}`}>
                {biz.openHoursPerWeek || 0}h
              </div>
              <div className={`text-[11px] max-w-[80px] truncate ${biz.isUser ? 'text-red-300/70' : 'text-zinc-500'}`}>
                {biz.isUser ? 'You' : biz.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
