import React, { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Box, MeshWobbleMaterial, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

const Glyph = () => {
  const mesh = useRef<THREE.Mesh>(null!);
  const { mouse } = useThree();
  
  useFrame((state) => {
    mesh.current.rotation.y = THREE.MathUtils.lerp(mesh.current.rotation.y, mouse.x * 2, 0.1);
    mesh.current.rotation.x = THREE.MathUtils.lerp(mesh.current.rotation.x, -mouse.y * 2, 0.1);
  });

  return (
    <Float speed={5} rotationIntensity={2} floatIntensity={2}>
      <mesh ref={mesh}>
        <Box args={[1, 1, 1]}>
          <MeshWobbleMaterial
            color="#0055ff"
            speed={2}
            factor={0.8}
            opacity={0.9}
            transparent
            emissive="#0055ff"
            emissiveIntensity={0.2}
          />
        </Box>
      </mesh>
    </Float>
  );
};

export const SidebarGlyph = () => {
  return (
    <div className="w-10 h-10 relative">
      <Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
        <PerspectiveCamera makeDefault position={[0, 0, 3]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} />
        <Glyph />
      </Canvas>
    </div>
  );
};
