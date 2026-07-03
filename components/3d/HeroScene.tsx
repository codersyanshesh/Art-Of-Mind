"use client";

import React, { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

// 3D Book Component
function Book3D({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.3;
    meshRef.current.rotation.x = Math.cos(state.clock.getElapsedTime() * 0.3) * 0.1;
  });

  return (
    <mesh ref={meshRef} position={position}>
      {/* Book Cover */}
      <boxGeometry args={[1.5, 2.2, 0.2]} />
      <meshStandardMaterial color="#6d28d9" roughness={0.3} metalness={0.8} />
      {/* Pages edge */}
      <mesh position={[0.74, 0, 0]}>
        <boxGeometry args={[0.02, 2.1, 0.18]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.9} />
      </mesh>
    </mesh>
  );
}

// 3D Film Reel Component
function FilmReel3D({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.z = state.clock.getElapsedTime() * 0.4;
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Outer Cylinder ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1, 1, 0.3, 32, 1, true]} />
        <meshStandardMaterial color="#0891b2" roughness={0.2} metalness={0.9} side={THREE.DoubleSide} />
      </mesh>
      {/* Center hub */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.35, 16]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.9} />
      </mesh>
      {/* Film spokes */}
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh
          key={i}
          rotation={[0, 0, (i * Math.PI) / 3]}
          position={[0, 0, 0]}
        >
          <boxGeometry args={[1.8, 0.1, 0.1]} />
          <meshStandardMaterial color="#0891b2" metalness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

// 3D Holographic Sphere
function SoundWave3D({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.8, 64, 64]} />
      <MeshDistortMaterial
        color="#c084fc"
        roughness={0.1}
        metalness={1.0}
        distort={0.4}
        speed={2}
      />
    </mesh>
  );
}

export default function HeroScene() {
  return (
    <div className="w-full h-[500px] md:h-[600px] relative">
      {/* Glowing background behind canvas */}
      <div className="absolute inset-0 bg-gradient-to-r from-electric-violet/10 to-cyan-accent/10 blur-3xl opacity-60 rounded-full scale-75 pointer-events-none" />
      
      <Suspense fallback={
        <div className="w-full h-full flex items-center justify-center text-slate-400">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-electric-violet mr-3" />
          Loading 3D Workspace...
        </div>
      }>
        <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} />
          <pointLight position={[-10, -10, -5]} intensity={0.5} color="#7c3aed" />
          <pointLight position={[0, 5, 0]} intensity={1} color="#06b6d4" />

          <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
            <Book3D position={[-1.8, 1, 0]} />
          </Float>

          <Float speed={2} rotationIntensity={0.8} floatIntensity={1.2}>
            <FilmReel3D position={[1.8, -0.5, 0.5]} />
          </Float>

          <Float speed={1.7} rotationIntensity={0.6} floatIntensity={0.8}>
            <SoundWave3D position={[0.5, 1.5, -1]} />
          </Float>

          {/* Glowing central cube or orb */}
          <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.5}>
            <mesh position={[0, -0.8, -0.5]} rotation={[0.5, 0.5, 0.5]}>
              <octahedronGeometry args={[0.9]} />
              <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.1} />
            </mesh>
          </Float>

          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
        </Canvas>
      </Suspense>
    </div>
  );
}
