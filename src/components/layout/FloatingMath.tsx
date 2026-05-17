import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Float, Text } from '@react-three/drei';

const Symbol = ({ char, position, color }: { char: string, position: [number, number, number], color: string }) => (
  <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
    <Text
      fontSize={0.5}
      color={color}
      position={position}
    >
      {char}
    </Text>
  </Float>
);

export const FloatingMath = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden h-full">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Symbol char="dy/dx" position={[-3, 2, -1]} color="#4f46e5" />
        <Symbol char="M(Link)" position={[3, -1, -2]} color="#6366f1" />
        <Symbol char="N(Link)" position={[-2, -3, 0]} color="#818cf8" />
        <Symbol char="μ" position={[2, 3, -1]} color="#4f46e5" />
        <Symbol char="∫" position={[4, 1, -2]} color="#6366f1" />
      </Canvas>
    </div>
  );
};
