"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { useTheme } from "next-themes";
import * as THREE from "three";

// Neuron particle system with connections
function Neurons({ count = 400, theme = "dark" }) {
  const neuronsRef = useRef<THREE.Group>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  
  // Theme-based colors
  const isLight = theme === "light";
  const particleColor = isLight ? "#1a202c" : "#00d4ff"; // Dark Gray vs Cyan
  const emissiveColor = isLight ? "#000000" : "#00a8cc"; // Black vs Teal
  const lineColorBase = isLight ? [0, 0, 0] : [1, 1, 1]; // Pure Black vs Pure White
  
  const neurons = useMemo(() => {
    const temp = [];
    // Generate particles in a brain shape (approximate)
    for (let i = 0; i < count; i++) {
        // Distribute between two hemispheres
        const hemisphere = Math.random() > 0.5 ? 1 : -1;
        
        // Brain-like volume
        const phi = Math.random() * Math.PI;
        const theta = Math.random() * Math.PI;
        
        const rBase = 2.5;
        const rVar = Math.random() * 0.5;
        const gap = 0.2;
        
        let x = (rBase + rVar) * Math.sin(phi) * Math.cos(theta);
        let y = (rBase + rVar) * Math.sin(phi) * Math.sin(theta);
        let z = (rBase + rVar) * Math.cos(phi);
        
        x *= 1.2;
        y *= 0.8;
        z *= 1.4;
        
        x = Math.abs(x) * hemisphere + (gap * hemisphere);

        temp.push({
            baseX: x,
            baseY: y,
            baseZ: z,
            size: 0.03 + Math.random() * 0.08,
            pulseOffset: Math.random() * Math.PI * 2,
        });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    if (!neuronsRef.current) return;
    
    const time = state.clock.getElapsedTime();
    
    // Update neuron positions (Static/Pulsing only)
    neuronsRef.current.children.forEach((neuron, i) => {
      const data = neurons[i];
      neuron.position.set(data.baseX, data.baseY, data.baseZ);
      
      const pulse = Math.sin(time * 2 + data.pulseOffset) * 0.3 + 1;
      neuron.scale.setScalar(data.size * pulse);
    });
    
    // Update connection lines
    if (linesRef.current) {
      const positions = linesRef.current.geometry.attributes.position.array as Float32Array;
      const colors = linesRef.current.geometry.attributes.color.array as Float32Array;
      let lineIndex = 0;
      
      for (let i = 0; i < neurons.length; i++) {
        const neuronA = neuronsRef.current.children[i];
        
        for (let j = i + 1; j < neurons.length; j++) {
          const neuronB = neuronsRef.current.children[j];
          const distance = neuronA.position.distanceTo(neuronB.position);
          
          if (distance < 1.5 && lineIndex < positions.length / 3) {
            positions[lineIndex * 3] = neuronA.position.x;
            positions[lineIndex * 3 + 1] = neuronA.position.y;
            positions[lineIndex * 3 + 2] = neuronA.position.z;
            
            positions[lineIndex * 3 + 3] = neuronB.position.x;
            positions[lineIndex * 3 + 4] = neuronB.position.y;
            positions[lineIndex * 3 + 5] = neuronB.position.z;
            
            const opacity = 1 - (distance / 1.5);
            const opacityFactor = isLight ? 0.6 : 0.4; 
            
            colors[lineIndex * 3] = lineColorBase[0];
            colors[lineIndex * 3 + 1] = lineColorBase[1];
            colors[lineIndex * 3 + 2] = lineColorBase[2];
            colors[lineIndex * 3 + 3] = opacity * opacityFactor;
            
            colors[lineIndex * 3 + 6] = lineColorBase[0];
            colors[lineIndex * 3 + 7] = lineColorBase[1];
            colors[lineIndex * 3 + 8] = lineColorBase[2];
            colors[lineIndex * 3 + 9] = opacity * opacityFactor;
            
            lineIndex += 2;
          }
        }
      }
      
      linesRef.current.geometry.attributes.position.needsUpdate = true;
      linesRef.current.geometry.attributes.color.needsUpdate = true;
    }
  });

  const lineGeometry = useMemo(() => {
    const maxConnections = count * 20;
    const positions = new Float32Array(maxConnections * 6);
    const colors = new Float32Array(maxConnections * 8);
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 4));
    
    return geometry;
  }, [count]);

  return (
    <group scale={[1.4, 1.4, 1.4]} position={[0, 0, 0]}>
      <lineSegments ref={linesRef} geometry={lineGeometry}>
        <lineBasicMaterial vertexColors transparent opacity={0.5} />
      </lineSegments>
      
      <group ref={neuronsRef}>
        {neurons.map((neuron, i) => (
          <mesh key={i} position={[neuron.baseX, neuron.baseY, neuron.baseZ]}>
            <sphereGeometry args={[neuron.size, 8, 8]} />
            <meshPhongMaterial 
              color={particleColor}
              emissive={emissiveColor}
              emissiveIntensity={isLight ? 1 : 2}
              shininess={100}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// Rotating wrapper for the main content
function Particles({ count = 100, theme = "dark" }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const [dummy] = useState(() => new THREE.Object3D());
  const isLight = theme === "light";
  const color = isLight ? "#1a202c" : "#00d4ff";
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
        const t = Math.random() * 100;
        const factor = 20 + Math.random() * 100;
        const speed = 0.01 + Math.random() / 200;
        const xFactor = -50 + Math.random() * 100;
        const yFactor = -50 + Math.random() * 100;
        const zFactor = -50 + Math.random() * 100;
        temp.push({ t, factor, speed, xFactor, yFactor, zFactor });
    }
    return temp;
  }, [count]);

  useFrame(() => {
    if (!mesh.current) return;
    particles.forEach((particle, i) => {
      const { factor, speed, xFactor, yFactor, zFactor } = particle;
      const t = particle.t += speed / 2;
      const s = Math.cos(t);
      
      dummy.position.set(
        xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
        yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
        zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
      );
      dummy.scale.set(s, s, s);
      dummy.rotation.set(s * 5, s * 5, s * 5);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <dodecahedronGeometry args={[0.05, 0]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} />
    </instancedMesh>
  );
}

// Black stars for light mode
function BlackStars() {
  const count = 1500;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 50 + Math.random() * 50;
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.3} color="#000000" transparent opacity={0.4} sizeAttenuation />
    </points>
  );
}

// Rotating wrapper for the main content
function RotatingGroup({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (groupRef.current) {
      // Use time for smooth, frame-independent rotation
      // 0.05 is a slow, elegant speed
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    }
  });
  return <group ref={groupRef}>{children}</group>;
}

// Main canvas component
export default function BrainCanvas() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = mounted ? (resolvedTheme || theme) : "dark";
  const isLight = currentTheme === "light";

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden transition-colors duration-500">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 40 }}
        className="bg-transparent"
        gl={{ 
          antialias: false,
          powerPreference: 'high-performance',
          alpha: true
        }}
      >
        <color attach="background" args={[isLight ? '#ffffff' : '#000000']} />
        <fog attach="fog" args={[isLight ? '#ffffff' : '#000000', 5, 25]} />
        
        <ambientLight intensity={isLight ? 0.8 : 0.2} />
        <pointLight position={[5, 5, 5]} intensity={1.5} color={isLight ? "#94a3b8" : "#00d4ff"} />
        <pointLight position={[-5, -5, -5]} intensity={1.5} color={isLight ? "#cbd5e1" : "#00ff9d"} />
        
        <RotatingGroup>
          <Neurons count={300} theme={currentTheme} /> 
          <Particles count={40} theme={currentTheme} />
        </RotatingGroup>

        {isLight ? (
            <BlackStars />
        ) : (
          <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
        )}
      </Canvas>
      
      <div className={`absolute inset-0 pointer-events-none ${isLight ? 'bg-[radial-gradient(circle_at_center,transparent_0%,rgba(255,255,255,0.4)_100%)]' : 'bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]'}`} />
    </div>
  );
}
