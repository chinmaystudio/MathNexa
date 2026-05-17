import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial, Text, Float } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, ChromaticAberration } from '@react-three/postprocessing';
import * as THREE from 'three';

const MATH_SYMBOLS = ['∫', 'Σ', '∂', '∞', '∇', 'π', 'Δ', 'λ', 'Ω', 'θ', '√', '≈', '≠', '±'];

const FloatingGlyph = ({ position, color, size = 0.4 }: { position: [number, number, number], color?: string, size?: number }) => {
  const symbol = useMemo(() => MATH_SYMBOLS[Math.floor(Math.random() * MATH_SYMBOLS.length)], []);
  const mesh = useRef<THREE.Mesh>(null!);
  const { mouse } = useThree();
  const initialX = position[0];
  const initialY = position[1];
  const speed = useMemo(() => 0.2 + Math.random() * 0.5, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    // Subtle drift
    mesh.current.position.x = initialX + Math.sin(time * speed + initialX) * 1.5;
    mesh.current.position.y = initialY + Math.cos(time * speed + initialY) * 1.5;
    
    // Parallax effect from mouse
    mesh.current.position.x += mouse.x * 1.2;
    mesh.current.position.y += mouse.y * 1.2;
    
    // Rotation
    mesh.current.rotation.y = Math.sin(time * 0.5) * 0.5;
    mesh.current.rotation.z = Math.cos(time * 0.3) * 0.2;
  });

  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={2.5}>
      <Text
        {...{
          ref: mesh as any,
          fontSize: size,
          color: color || "#0055ff",
          font: "https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvL-7mveZDuzer18_5pQ.woff",
          position: position,
          fillOpacity: 0.5,
          transparent: true,
          depthTest: false
        } as any}
      >
        {symbol}
      </Text>
    </Float>
  );
};

const ParticleField = ({ color }: { color: string }) => {
  const ref = useRef<THREE.Points>(null!);
  const { mouse } = useThree();
  
  const [positions] = useMemo(() => {
    const pos = new Float32Array(4000 * 3);
    for (let i = 0; i < 4000; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return [pos];
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, mouse.y * 0.15, 0.05);
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, mouse.x * 0.15, 0.05);
    
    const positionsAttr = ref.current.geometry.attributes.position;
    for (let i = 0; i < 4000; i++) {
        const x = positionsAttr.getX(i);
        const y = positionsAttr.getY(i);
        const z = positionsAttr.getZ(i);
        positionsAttr.setZ(i, z + Math.sin(time * 0.8 + x * 0.5 + y * 0.5) * 0.015);
    }
    positionsAttr.needsUpdate = true;
  });

  return (
    <group>
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color={color}
          size={0.08}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.5}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
};

const SymbolConstellation = ({ color }: { color: string }) => {
    const glyps = useMemo(() => {
        const items = [];
        for (let i = 0; i < 60; i++) {
            items.push({
                pos: [
                    (Math.random() - 0.5) * 35,
                    (Math.random() - 0.5) * 35,
                    (Math.random() - 0.5) * 15
                ] as [number, number, number],
                size: 0.3 + Math.random() * 0.5
            });
        }
        return items;
    }, []);

    return (
        <group>
            {glyps.map((item, i) => (
                <FloatingGlyph key={i} position={item.pos} color={color} size={item.size} />
            ))}
        </group>
    );
};

export const ModernCanvas = () => {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none transition-opacity duration-1000 bg-blue-100 dark:bg-[#050515]">
      <Canvas camera={{ position: [0, 0, 12], fov: 60 }} gl={{ alpha: true }}>
        <SceneContent />
        <EffectComposer multisampling={8}>
          <Bloom 
            luminanceThreshold={0.5} 
            mipmapBlur 
            intensity={1.2} 
            radius={0.4} 
          />
          <Noise opacity={0.04} />
          <ChromaticAberration offset={new THREE.Vector2(0.001, 0.001)} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

const SceneContent = () => {
  const [isDark, setIsDark] = React.useState(true);

  React.useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const bgColor = isDark ? '#050515' : '#eff6ff';
  const particleColor = isDark ? '#3388ff' : '#0055ff';
  const symbolColor = isDark ? '#0055ff' : '#0033cc';

  return (
    <>
      <color attach="background" args={[bgColor]} />
      {isDark && <fog attach="fog" args={[bgColor, 5, 25]} />}
      <ambientLight intensity={isDark ? 0.7 : 1} />
      <pointLight position={[10, 10, 10]} intensity={isDark ? 2.5 : 0.5} color={particleColor} />
      <pointLight position={[-10, -10, -10]} intensity={isDark ? 1 : 0.2} color="#4f46e5" />
      <ParticleField color={particleColor} />
      <SymbolConstellation color={symbolColor} />
    </>
  );
};
