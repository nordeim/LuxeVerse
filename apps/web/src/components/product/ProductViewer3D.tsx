"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Html, Environment } from "@react-three/drei";
import type * as THREE from "three";
import { cn } from "@luxeverse/utils";

export interface Annotation {
  position: [number, number, number];
  label: string;
  content: string;
}

export interface ProductViewer3DProps {
  modelUrl: string;
  annotations?: Annotation[];
  className?: string;
}

function Model({ url, annotations }: { url: string; annotations?: Annotation[] }) {
  const { scene } = useGLTF(url);
  const ref = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.1;
    void state;
  });

  return (
    <group ref={ref}>
      <primitive object={scene} />
      {annotations?.map((a, i) => (
        <Html key={i} position={a.position} center distanceFactor={10}>
          <div className="rounded-lg bg-obsidian-950/80 px-3 py-1.5 text-xs text-metallic-champagne backdrop-blur-md whitespace-nowrap">
            <span className="font-medium">{a.label}</span>
          </div>
        </Html>
      ))}
    </group>
  );
}

export function ProductViewer3D({ modelUrl, annotations, className }: ProductViewer3DProps) {
  return (
    <div className={cn("relative aspect-square w-full overflow-hidden rounded-xl bg-obsidian-100", className)}>
      <Suspense fallback={<div className="absolute inset-0 flex items-center justify-center text-sm text-obsidian-500">Loading 3D Model...</div>}>
        <Canvas camera={{ position: [0, 0, 4], fov: 45 }} gl={{ antialias: true, alpha: false }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <Environment preset="studio" />
          <Model url={modelUrl} annotations={annotations} />
          <OrbitControls enableZoom={false} autoRotate={false} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 1.5} />
        </Canvas>
      </Suspense>
    </div>
  );
}
