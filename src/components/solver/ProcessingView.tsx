import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float, MeshWobbleMaterial } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import * as THREE from 'three';

export const ProcessingView = () => {
  return (
    <div className="h-64 w-full">
      <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={2} />
        <pointLight position={[-10, -10, -10]} color="#4f46e5" intensity={2} />
        
        <Float speed={5} rotationIntensity={2} floatIntensity={2}>
          <Sphere args={[1, 128, 128]}>
            <MeshDistortMaterial
              color="#4f46e5"
              speed={10}
              distort={0.7}
              radius={1}
              emissive="#6366f1"
              emissiveIntensity={2}
            />
          </Sphere>
        </Float>

        <EffectComposer>
          <Bloom luminanceThreshold={0} intensity={2} radius={0.8} />
          <ChromaticAberration offset={new THREE.Vector2(0.005, 0.005)} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};
