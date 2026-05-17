import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, Text, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Bloom, Glitch, Scanline } from '@react-three/postprocessing';
import * as THREE from 'three';

const FloatingSymbol = ({ symbol, position, color }: { symbol: string, position: [number, number, number], color: string }) => {
  const mesh = useRef<THREE.Mesh>(null!);
  const { mouse } = useThree();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    mesh.current.position.y += Math.sin(time + position[0]) * 0.005;
    mesh.current.rotation.x = THREE.MathUtils.lerp(mesh.current.rotation.x, mouse.y * 0.5, 0.1);
    mesh.current.rotation.y = THREE.MathUtils.lerp(mesh.current.rotation.y, mouse.x * 0.5, 0.1);
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Text
        ref={mesh as any}
        fontSize={0.8}
        color={color}
        font="https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvL-7mveZDuzer18_5pQ.woff"
        position={position}
        maxWidth={2}
        textAlign="left"
      >
        {symbol}
      </Text>
    </Float>
  );
};

const MathematicalFlux = () => {
  const mesh = useRef<THREE.Mesh>(null!);
  const { mouse } = useThree();
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    mesh.current.rotation.x = THREE.MathUtils.lerp(mesh.current.rotation.x, mouse.y * 0.2, 0.05);
    mesh.current.rotation.y = THREE.MathUtils.lerp(mesh.current.rotation.y, mouse.x * 0.2, 0.05);
  });

  return (
    <group>
      <mesh ref={mesh}>
        <Sphere args={[1.5, 64, 64]}>
          <MeshDistortMaterial
            color="#4f46e5"
            speed={5}
            distort={0.5}
            radius={1}
            opacity={0.4}
            transparent
            emissive="#4f46e5"
            emissiveIntensity={0.5}
          />
        </Sphere>
      </mesh>

      <FloatingSymbol symbol="∫" position={[-4, 2, -1]} color="#6366f1" />
      <FloatingSymbol symbol="Σ" position={[4, -2, 0]} color="#818cf8" />
      <FloatingSymbol symbol="∂" position={[-3, -3, 1]} color="#4f46e5" />
      <FloatingSymbol symbol="∞" position={[5, 3, -2]} color="#a5b4fc" />
      <FloatingSymbol symbol="π" position={[-5, 0, -1]} color="#6366f1" />
    </group>
  );
};

export const DynamicBackground = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-60">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} />
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <pointLight position={[-10, -10, -10]} color="#4f46e5" intensity={2} />
        <spotLight position={[0, 5, 10]} angle={0.15} penumbra={1} intensity={2} />
        
        <MathematicalFlux />
        
        <EffectComposer>
          <Bloom luminanceThreshold={0.1} intensity={1} radius={0.5} />
          <Glitch 
            delay={new THREE.Vector2(3, 7)} 
            duration={new THREE.Vector2(0.1, 0.3)} 
            strength={new THREE.Vector2(0.1, 0.3)} 
            mode={0} 
            active 
            ratio={0.1}
          />
          <Scanline opacity={0.05} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};
