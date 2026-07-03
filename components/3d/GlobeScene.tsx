"use client";

import React, { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import * as THREE from "three";

// Helper to convert lat/lng to 3D Cartesian coordinates
function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.sin(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.cos(theta)
  );
}

function Globe() {
  const globeRef = useRef<THREE.Group>(null);

  // Creator nodes coordinates on the sphere
  const creators = [
    { lat: 40.7128, lng: -74.0060, name: "New York" },   // NY
    { lat: 34.0522, lng: -118.2437, name: "Los Angeles" }, // LA
    { lat: 51.5074, lng: -0.1278, name: "London" },      // London
    { lat: 35.6762, lng: 139.6503, name: "Tokyo" },       // Tokyo
    { lat: -33.8688, lng: 151.2093, name: "Sydney" },     // Sydney
    { lat: 1.3521, lng: 103.8198, name: "Singapore" },    // Singapore
    { lat: -23.5505, lng: -46.6333, name: "Sao Paulo" },  // Sao Paulo
  ];

  useFrame((state) => {
    if (!globeRef.current) return;
    globeRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
  });

  const radius = 2;

  // Generate connection paths (arcs) between some cities
  const paths = [
    { from: creators[0], to: creators[2] }, // NY -> London
    { from: creators[1], to: creators[3] }, // LA -> Tokyo
    { from: creators[2], to: creators[5] }, // London -> Singapore
    { from: creators[3], to: creators[4] }, // Tokyo -> Sydney
  ];

  return (
    <group ref={globeRef}>
      {/* Base Earth Sphere - semi-transparent wireframe */}
      <mesh>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial
          color="#1e1b4b"
          wireframe
          transparent
          opacity={0.15}
          metalness={0.9}
        />
      </mesh>

      {/* Solid inner core glowing */}
      <mesh>
        <sphereGeometry args={[radius * 0.95, 32, 32]} />
        <meshStandardMaterial
          color="#0f172a"
          roughness={0.8}
          metalness={0.2}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Creator Hotspots */}
      {creators.map((city, idx) => {
        const pos = latLngToVector3(city.lat, city.lng, radius);
        return (
          <group key={idx} position={pos}>
            {/* Glowing dot */}
            <mesh>
              <sphereGeometry args={[0.06, 16, 16]} />
              <meshBasicMaterial color="#06b6d4" />
            </mesh>
            {/* Pulsing ring */}
            <mesh scale={[1.5, 1.5, 1.5]}>
              <ringGeometry args={[0.06, 0.08, 16]} />
              <meshBasicMaterial color="#7c3aed" side={THREE.DoubleSide} transparent opacity={0.6} />
            </mesh>
          </group>
        );
      })}

      {/* Collaboration Connecting Lines (Curves) */}
      {paths.map((path, idx) => {
        const start = latLngToVector3(path.from.lat, path.from.lng, radius);
        const end = latLngToVector3(path.to.lat, path.to.lng, radius);
        
        // Calculate control point for curve
        const midPoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
        const distance = start.distanceTo(end);
        midPoint.normalize().multiplyScalar(radius + distance * 0.25); // pull curve outward
        
        const curve = new THREE.QuadraticBezierCurve3(start, midPoint, end);
        const points = curve.getPoints(24);
        
        return (
          <line key={idx}>
            <bufferGeometry attach="geometry" onUpdate={(self) => self.setFromPoints(points)} />
            <lineBasicMaterial attach="material" color="#7c3aed" linewidth={1.5} transparent opacity={0.6} />
          </line>
        );
      })}
    </group>
  );
}

export default function GlobeScene() {
  return (
    <div className="w-full h-[400px] relative">
      <div className="absolute inset-0 bg-gradient-to-tr from-electric-violet/5 to-cyan-accent/5 blur-3xl opacity-40 rounded-full scale-75 pointer-events-none" />
      <Suspense fallback={
        <div className="w-full h-full flex items-center justify-center text-slate-400">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-accent mr-3" />
          Loading Creator Network...
        </div>
      }>
        <Canvas camera={{ position: [0, 0, 4.5], fov: 45 }}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[5, 5, 5]} intensity={1.2} />
          <pointLight position={[-5, -5, -5]} intensity={0.3} color="#06b6d4" />
          
          <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.3}>
            <Globe />
          </Float>
          
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.8} />
        </Canvas>
      </Suspense>
    </div>
  );
}
