'use client';

import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber';
import { Text, RoundedBox, Float } from '@react-three/drei';
import * as THREE from 'three';
import { RedditPost } from '@/lib/types';
import { formatRedditDate } from '@/lib/reddit';

interface CardProps {
  post: RedditPost;
  position: [number, number, number];
  rotation: [number, number, number];
  index: number;
  onHover: (id: string | null) => void;
  isHovered: boolean;
}

function Card({ post, position, rotation, index, onHover, isHovered }: CardProps) {
  const groupRef = useRef<THREE.Group>(null);
  const initialY = useRef(position[1]);

  useFrame((state) => {
    if (groupRef.current) {
      // Floating animation
      groupRef.current.position.y =
        initialY.current + Math.sin(state.clock.elapsedTime * 0.8 + index * 0.5) * 0.1;

      // Subtle rotation
      groupRef.current.rotation.y =
        rotation[1] + Math.sin(state.clock.elapsedTime * 0.5 + index) * 0.05;

      // Scale on hover
      const targetScale = isHovered ? 1.1 : 1;
      groupRef.current.scale.x = THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.1);
      groupRef.current.scale.y = THREE.MathUtils.lerp(groupRef.current.scale.y, targetScale, 0.1);
      groupRef.current.scale.z = THREE.MathUtils.lerp(groupRef.current.scale.z, targetScale, 0.1);
    }
  });

  const truncateTitle = (title: string, maxLen: number) => {
    if (title.length <= maxLen) return title;
    return title.slice(0, maxLen - 3) + '...';
  };

  const handlePointerOver = () => onHover(post.id);
  const handlePointerOut = () => onHover(null);
  const handleClick = () => {
    window.open(post.permalink, '_blank');
  };

  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
      <group
        ref={groupRef}
        position={position}
        rotation={rotation}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        {/* Card background */}
        <RoundedBox args={[3, 1.5, 0.1]} radius={0.08} smoothness={4}>
          <meshStandardMaterial
            color={isHovered ? '#334155' : '#1e293b'}
            metalness={0.1}
            roughness={0.8}
          />
        </RoundedBox>

        {/* Reddit icon / accent */}
        <mesh position={[-1.2, 0.5, 0.06]}>
          <circleGeometry args={[0.12, 32]} />
          <meshBasicMaterial color="#ff4500" />
        </mesh>

        {/* Subreddit */}
        <Text
          position={[-0.95, 0.5, 0.06]}
          fontSize={0.1}
          color="#f59e0b"
          anchorX="left"
          anchorY="middle"
          font="/fonts/inter.woff"
        >
          r/{post.subreddit}
        </Text>

        {/* Date */}
        <Text
          position={[1.35, 0.5, 0.06]}
          fontSize={0.08}
          color="#64748b"
          anchorX="right"
          anchorY="middle"
          font="/fonts/inter.woff"
        >
          {formatRedditDate(post.createdUtc)}
        </Text>

        {/* Title */}
        <Text
          position={[-1.35, 0.1, 0.06]}
          fontSize={0.12}
          color="#ffffff"
          anchorX="left"
          anchorY="middle"
          maxWidth={2.6}
          lineHeight={1.3}
          font="/fonts/inter.woff"
        >
          {truncateTitle(post.title, 60)}
        </Text>

        {/* Stats */}
        <Text
          position={[-1.35, -0.5, 0.06]}
          fontSize={0.09}
          color="#94a3b8"
          anchorX="left"
          anchorY="middle"
          font="/fonts/inter.woff"
        >
          {post.numComments} comments · {post.score} upvotes
        </Text>

        {/* Click hint on hover */}
        {isHovered && (
          <Text
            position={[1.35, -0.5, 0.06]}
            fontSize={0.08}
            color="#f59e0b"
            anchorX="right"
            anchorY="middle"
            font="/fonts/inter.woff"
          >
            Click to open →
          </Text>
        )}

        {/* Glow effect on hover */}
        {isHovered && (
          <RoundedBox args={[3.1, 1.6, 0.05]} radius={0.1} smoothness={4} position={[0, 0, -0.03]}>
            <meshBasicMaterial color="#f59e0b" transparent opacity={0.2} />
          </RoundedBox>
        )}
      </group>
    </Float>
  );
}

function Particles() {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 50;

  const [positions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6 - 2;
    }
    return [pos];
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#f59e0b" transparent opacity={0.4} sizeAttenuation />
    </points>
  );
}

function Scene({ posts }: { posts: RedditPost[] }) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Position cards in a staggered grid
  const cardPositions = useMemo(() => {
    const positions: Array<{ position: [number, number, number]; rotation: [number, number, number] }> = [];
    const displayPosts = posts.slice(0, 5);

    displayPosts.forEach((_, i) => {
      const row = Math.floor(i / 2);
      const col = i % 2;
      const x = (col - 0.5) * 3.5 + (row % 2) * 0.3;
      const y = (1 - row) * 1.8;
      const z = -row * 0.5;
      const rotY = (col - 0.5) * 0.15;

      positions.push({
        position: [x, y, z],
        rotation: [0, rotY, 0],
      });
    });

    return positions;
  }, [posts]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={0.6} />
      <pointLight position={[-5, -3, 3]} intensity={0.3} color="#ff4500" />

      <Particles />

      {posts.slice(0, 5).map((post, index) => (
        <Card
          key={post.id}
          post={post}
          position={cardPositions[index]?.position || [0, 0, 0]}
          rotation={cardPositions[index]?.rotation || [0, 0, 0]}
          index={index}
          onHover={setHoveredId}
          isHovered={hoveredId === post.id}
        />
      ))}
    </>
  );
}

interface RedditCardsProps {
  posts: RedditPost[];
}

export default function RedditCards({ posts }: RedditCardsProps) {
  if (posts.length === 0) return null;

  return (
    <div className="w-full h-[400px] bg-[#0a0e1a] rounded-2xl overflow-hidden cursor-pointer">
      <Canvas camera={{ position: [0, 0, 7], fov: 50 }} dpr={[1, 2]}>
        <Scene posts={posts} />
      </Canvas>
    </div>
  );
}
