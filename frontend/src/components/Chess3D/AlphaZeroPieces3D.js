import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Rune symbols for piece engravings - Elder Futhark sacred runes
const RUNES = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ', 'ᛁ', 'ᛃ', 'ᛇ', 'ᛈ', 'ᛉ', 'ᛋ', 'ᛏ', 'ᛒ', 'ᛖ', 'ᛗ', 'ᛚ', 'ᛜ', 'ᛞ', 'ᛟ'];

// ==================== ADVANCED NEURAL MATERIAL ====================
const useNeuralMaterial = (color, isSelected = false, isHovered = false, pieceType = 'default') => {
  return useMemo(() => {
    const isWhite = color === 'white';
    
    // Deep sophisticated colors - more complex
    const baseColor = isWhite ? '#e0d8f0' : '#08040c';
    const emissiveColor = isWhite ? '#8050ff' : '#bf00ff';
    
    return new THREE.MeshPhysicalMaterial({
      color: baseColor,
      metalness: 0.92,
      roughness: 0.04,
      transmission: isWhite ? 0.35 : 0.2,
      thickness: 3,
      envMapIntensity: 2.5,
      clearcoat: 1,
      clearcoatRoughness: 0.02,
      ior: 2.5,
      reflectivity: 1,
      emissive: emissiveColor,
      emissiveIntensity: isSelected ? 1.5 : isHovered ? 0.85 : 0.3,
      transparent: true,
      opacity: 0.97,
      sheen: 1,
      sheenRoughness: 0.2,
      sheenColor: new THREE.Color(isWhite ? '#d0c0ff' : '#ff00bf'),
      attenuationColor: new THREE.Color(isWhite ? '#c0b0ff' : '#400060'),
      attenuationDistance: 0.4,
    });
  }, [color, isSelected, isHovered]);
};

// ==================== COMPLEX CHAIN MESH ====================
const ChainLink = ({ position, rotation, scale = 1, color }) => {
  return (
    <group position={position} rotation={rotation} scale={[scale, scale, scale]}>
      {/* Torus link */}
      <mesh>
        <torusGeometry args={[0.04, 0.015, 8, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.8}
          metalness={0.95}
          roughness={0.1}
        />
      </mesh>
    </group>
  );
};

// ==================== SOPHISTICATED CHAIN SYSTEM ====================
const NeuralChainSystem = ({ position, color, count = 6, intensity = 1 }) => {
  const chainsRef = useRef();
  
  const chains = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2;
      const baseLength = 0.6 + Math.random() * 0.5;
      // Create multiple links per chain
      const links = [];
      const linkCount = 6 + Math.floor(Math.random() * 4);
      
      for (let j = 0; j < linkCount; j++) {
        const t = j / linkCount;
        const r = 0.2 + t * baseLength;
        links.push({
          pos: [
            Math.cos(angle) * r,
            0.15 + Math.sin(t * Math.PI) * 0.3,
            Math.sin(angle) * r
          ],
          rot: [Math.PI / 2, angle + j * 0.3, 0],
          scale: 0.8 + Math.sin(t * Math.PI) * 0.4
        });
      }
      
      return {
        angle,
        links,
        phase: Math.random() * Math.PI * 2,
        speed: 0.4 + Math.random() * 0.3
      };
    });
  }, [count]);
  
  useFrame((state) => {
    if (chainsRef.current) {
      chainsRef.current.children.forEach((chainGroup, i) => {
        const data = chains[i];
        const pulse = Math.sin(state.clock.elapsedTime * data.speed * 4 + data.phase);
        chainGroup.children.forEach((link, j) => {
          if (link.material) {
            link.material.emissiveIntensity = (0.5 + pulse * 0.4) * intensity;
          }
        });
      });
    }
  });
  
  const chainColor = color === 'white' ? '#9060ff' : '#bf00ff';
  
  return (
    <group ref={chainsRef}>
      {chains.map((chain, i) => (
        <group key={i}>
          {chain.links.map((link, j) => (
            <ChainLink
              key={j}
              position={link.pos}
              rotation={link.rot}
              scale={link.scale}
              color={chainColor}
            />
          ))}
          {/* Chain connection tube */}
          {(() => {
            const points = chain.links.map(l => new THREE.Vector3(...l.pos));
            if (points.length > 1) {
              const curve = new THREE.CatmullRomCurve3(points);
              return (
                <mesh>
                  <tubeGeometry args={[curve, 24, 0.008, 6, false]} />
                  <meshStandardMaterial
                    color={chainColor}
                    emissive={chainColor}
                    emissiveIntensity={0.6}
                    transparent
                    opacity={0.5}
                  />
                </mesh>
              );
            }
            return null;
          })()}
        </group>
      ))}
    </group>
  );
};

// ==================== RUNE RING WITH ENGRAVINGS ====================
const RuneEngravingRing = ({ radius, height, color, emissive, runeCount = 8 }) => {
  const ringRef = useRef();
  const runesRef = useRef();
  
  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
    if (runesRef.current) {
      runesRef.current.rotation.y = -state.clock.elapsedTime * 0.5;
    }
  });
  
  return (
    <group>
      <group ref={ringRef}>
        {/* Main ring */}
        <mesh>
          <torusGeometry args={[radius, 0.018, 8, 48]} />
          <meshStandardMaterial
            color={color}
            emissive={emissive}
            emissiveIntensity={0.9}
            metalness={0.95}
            roughness={0.1}
          />
        </mesh>
        
        {/* Inner detail ring */}
        <mesh>
          <torusGeometry args={[radius * 0.85, 0.008, 6, 32]} />
          <meshStandardMaterial
            color={emissive}
            emissive={emissive}
            emissiveIntensity={1.2}
            metalness={0.9}
            roughness={0.15}
            transparent
            opacity={0.8}
          />
        </mesh>
        
        {/* Outer detail ring */}
        <mesh>
          <torusGeometry args={[radius * 1.15, 0.006, 6, 32]} />
          <meshStandardMaterial
            color={emissive}
            emissive={emissive}
            emissiveIntensity={0.7}
            transparent
            opacity={0.6}
          />
        </mesh>
      </group>
      
      {/* Rune markers orbiting */}
      <group ref={runesRef}>
        {Array.from({ length: runeCount }, (_, i) => {
          const angle = (i / runeCount) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[
                Math.cos(angle) * radius,
                0,
                Math.sin(angle) * radius
              ]}
            >
              <octahedronGeometry args={[0.03, 0]} />
              <meshStandardMaterial
                color="#ffcc00"
                emissive="#ffcc00"
                emissiveIntensity={1.5}
              />
            </mesh>
          );
        })}
      </group>
    </group>
  );
};

// ==================== BASE PIECE COMPONENT ====================
const BasePiece = ({ children, position, color, isSelected, isHovered, onClick }) => {
  const groupRef = useRef();
  const floatOffset = useRef(Math.random() * Math.PI * 2);
  const glowRef = useRef();
  const secondaryGlowRef = useRef();
  
  useFrame((state) => {
    if (groupRef.current) {
      const baseY = position[1];
      const floatAmount = isSelected ? 0.5 : 0.12;
      const speed = isSelected ? 3 : 1;
      groupRef.current.position.y = baseY + Math.sin(state.clock.elapsedTime * speed + floatOffset.current) * floatAmount;
      
      if (isSelected) {
        groupRef.current.rotation.y += 0.012;
      }
    }
    
    if (glowRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 3.5) * 0.5 + 0.5;
      glowRef.current.intensity = isSelected ? 4 + pulse * 3 : isHovered ? 2.5 + pulse * 1.5 : 1.2 + pulse * 0.5;
    }
    
    if (secondaryGlowRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 4.5 + 1) * 0.5 + 0.5;
      secondaryGlowRef.current.intensity = isSelected ? 3 + pulse * 2 : isHovered ? 1.5 + pulse : 0.5 + pulse * 0.3;
    }
  });
  
  const glowColor = color === 'white' ? '#a080ff' : '#bf00ff';
  const secondaryGlow = color === 'white' ? '#ffffff' : '#ff00bf';
  const accentGlow = color === 'white' ? '#e0c0ff' : '#ff40bf';
  
  return (
    <group
      ref={groupRef}
      position={position}
      onClick={onClick}
      onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { document.body.style.cursor = 'default'; }}
    >
      {children}
      
      {/* Neural chains on selected pieces - BADASS CHAINS */}
      {isSelected && <NeuralChainSystem position={position} color={color} count={8} intensity={1.2} />}
      
      {/* Double rune ring around selected piece */}
      {isSelected && (
        <group position={[0, 0.15, 0]}>
          <RuneEngravingRing radius={0.55} height={0.02} color={glowColor} emissive={accentGlow} runeCount={12} />
        </group>
      )}
      
      {/* Hovering also shows a subtle ring */}
      {isHovered && !isSelected && (
        <group position={[0, 0.1, 0]}>
          <mesh>
            <torusGeometry args={[0.4, 0.01, 6, 24]} />
            <meshStandardMaterial
              color={glowColor}
              emissive={glowColor}
              emissiveIntensity={0.6}
              transparent
              opacity={0.5}
            />
          </mesh>
        </group>
      )}
      
      {/* Primary energy glow */}
      <pointLight
        ref={glowRef}
        position={[0, 0.5, 0]}
        intensity={isSelected ? 5 : isHovered ? 2.5 : 1.2}
        distance={isSelected ? 5 : 3}
        color={glowColor}
      />
      
      {/* Secondary accent glow */}
      <pointLight
        ref={secondaryGlowRef}
        position={[0, 0.9, 0]}
        intensity={isSelected ? 3 : isHovered ? 1.5 : 0.5}
        distance={isSelected ? 3.5 : 2}
        color={secondaryGlow}
      />
      
      {/* Base glow ring */}
      {(isSelected || isHovered) && (
        <pointLight
          position={[0, 0, 0]}
          intensity={1.5}
          distance={2}
          color={accentGlow}
        />
      )}
    </group>
  );
};

// ==================== PAWN - Neural Node ====================
export const Pawn3D = ({ position, color, isSelected, isHovered, onClick }) => {
  const material = useNeuralMaterial(color, isSelected, isHovered, 'pawn');
  const accentColor = color === 'white' ? '#b090ff' : '#bf00ff';
  const innerGlow = color === 'white' ? '#ffffff' : '#ff00bf';
  
  return (
    <BasePiece position={position} color={color} isSelected={isSelected} isHovered={isHovered} onClick={onClick}>
      {/* Complex base with runic engravings */}
      <mesh castShadow receiveShadow material={material}>
        <cylinderGeometry args={[0.24, 0.3, 0.14, 24]} />
      </mesh>
      
      {/* Triple rune rings on base */}
      <mesh position={[0, 0.06, 0]}>
        <torusGeometry args={[0.26, 0.012, 6, 32]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <torusGeometry args={[0.22, 0.008, 6, 24]} />
        <meshStandardMaterial color={innerGlow} emissive={innerGlow} emissiveIntensity={0.8} transparent opacity={0.7} />
      </mesh>
      
      {/* Tapered body column with groove */}
      <mesh position={[0, 0.24, 0]} castShadow material={material}>
        <cylinderGeometry args={[0.15, 0.2, 0.32, 16]} />
      </mesh>
      
      {/* Body groove ring */}
      <mesh position={[0, 0.28, 0]}>
        <torusGeometry args={[0.16, 0.008, 6, 24]} />
        <meshStandardMaterial color={innerGlow} emissive={innerGlow} emissiveIntensity={0.5} transparent opacity={0.6} />
      </mesh>
      
      {/* Neural core sphere */}
      <mesh position={[0, 0.52, 0]} castShadow material={material}>
        <sphereGeometry args={[0.18, 32, 32]} />
      </mesh>
      
      {/* Inner glowing neural core */}
      <mesh position={[0, 0.52, 0]}>
        <sphereGeometry args={[0.1, 24, 24]} />
        <meshStandardMaterial
          color={innerGlow}
          emissive={innerGlow}
          emissiveIntensity={1.5}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Outer aura */}
      <mesh position={[0, 0.52, 0]}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={0.3}
          transparent
          opacity={0.15}
        />
      </mesh>
    </BasePiece>
  );
};

// ==================== ROOK - Monolithic Obelisk (NO TOWER/CASTLE) ====================
export const Rook3D = ({ position, color, isSelected, isHovered, onClick }) => {
  const material = useNeuralMaterial(color, isSelected, isHovered, 'rook');
  const accentColor = color === 'white' ? '#b090ff' : '#bf00ff';
  const secondAccent = color === 'white' ? '#ffffff' : '#ff00bf';
  const goldAccent = '#ffcc00';
  
  return (
    <BasePiece position={position} color={color} isSelected={isSelected} isHovered={isHovered} onClick={onClick}>
      {/* Massive base with chain anchor engravings */}
      <mesh castShadow receiveShadow material={material}>
        <cylinderGeometry args={[0.3, 0.36, 0.14, 12]} />
      </mesh>
      
      {/* Quadruple base rings - like a seal */}
      <mesh position={[0, 0.06, 0]}>
        <torusGeometry args={[0.32, 0.015, 8, 24]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.7} />
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <torusGeometry args={[0.28, 0.01, 6, 20]} />
        <meshStandardMaterial color={secondAccent} emissive={secondAccent} emissiveIntensity={0.5} transparent opacity={0.7} />
      </mesh>
      <mesh position={[0, -0.02, 0]}>
        <torusGeometry args={[0.34, 0.008, 6, 20]} />
        <meshStandardMaterial color={goldAccent} emissive={goldAccent} emissiveIntensity={0.6} transparent opacity={0.5} />
      </mesh>
      
      {/* Main obelisk body - CLEAN, NO BATTLEMENTS */}
      <mesh position={[0, 0.38, 0]} castShadow material={material}>
        <cylinderGeometry args={[0.2, 0.26, 0.6, 12]} />
      </mesh>
      
      {/* Runic bands on body */}
      <mesh position={[0, 0.25, 0]}>
        <torusGeometry args={[0.24, 0.015, 8, 20]} />
        <meshStandardMaterial color={secondAccent} emissive={secondAccent} emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[0, 0.45, 0]}>
        <torusGeometry args={[0.205, 0.012, 8, 20]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.7} />
      </mesh>
      
      {/* Crown - Flat neural cap */}
      <mesh position={[0, 0.7, 0]} castShadow material={material}>
        <cylinderGeometry args={[0.22, 0.2, 0.1, 12]} />
      </mesh>
      
      {/* Central neural core - octahedron */}
      <mesh position={[0, 0.8, 0]}>
        <octahedronGeometry args={[0.12, 0]} />
        <meshStandardMaterial
          color={goldAccent}
          emissive={goldAccent}
          emissiveIntensity={1.8}
          metalness={0.95}
          roughness={0.05}
        />
      </mesh>
      
      {/* Octahedron glow aura */}
      <mesh position={[0, 0.8, 0]}>
        <octahedronGeometry args={[0.16, 0]} />
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={0.4}
          transparent
          opacity={0.2}
        />
      </mesh>
    </BasePiece>
  );
};

// ==================== KNIGHT - Neural Algorithm Beast ====================
export const Knight3D = ({ position, color, isSelected, isHovered, onClick }) => {
  const material = useNeuralMaterial(color, isSelected, isHovered, 'knight');
  const accentColor = color === 'white' ? '#b090ff' : '#bf00ff';
  const eyeColor = color === 'white' ? '#00ffff' : '#ff0040';
  
  return (
    <BasePiece position={position} color={color} isSelected={isSelected} isHovered={isHovered} onClick={onClick}>
      {/* Base */}
      <mesh castShadow receiveShadow material={material}>
        <cylinderGeometry args={[0.26, 0.3, 0.14, 16]} />
      </mesh>
      
      <mesh position={[0, 0.06, 0]}>
        <torusGeometry args={[0.27, 0.012, 8, 28]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.6} />
      </mesh>
      
      {/* Body stem */}
      <mesh position={[0, 0.28, 0]} castShadow material={material}>
        <cylinderGeometry args={[0.17, 0.22, 0.35, 14]} />
      </mesh>
      
      {/* Abstract algorithmic head - faceted */}
      <mesh position={[0, 0.55, 0.08]} rotation={[0.4, 0, 0]} castShadow material={material}>
        <boxGeometry args={[0.24, 0.36, 0.28]} />
      </mesh>
      
      {/* Neural crest */}
      <mesh position={[0, 0.78, -0.02]} rotation={[-0.2, 0, 0]} castShadow material={material}>
        <coneGeometry args={[0.1, 0.22, 8]} />
      </mesh>
      
      {/* Sensor antennae - neural receivers */}
      <mesh position={[0.08, 0.82, -0.04]} rotation={[-0.4, 0.3, 0]} castShadow material={material}>
        <coneGeometry args={[0.04, 0.18, 6]} />
      </mesh>
      <mesh position={[-0.08, 0.82, -0.04]} rotation={[-0.4, -0.3, 0]} castShadow material={material}>
        <coneGeometry args={[0.04, 0.18, 6]} />
      </mesh>
      
      {/* Primary eye - glowing sensor */}
      <mesh position={[0, 0.58, 0.2]}>
        <sphereGeometry args={[0.06, 20, 20]} />
        <meshStandardMaterial
          color={eyeColor}
          emissive={eyeColor}
          emissiveIntensity={3}
        />
      </mesh>
      
      {/* Secondary eyes */}
      <mesh position={[0.08, 0.52, 0.18]}>
        <sphereGeometry args={[0.025, 12, 12]} />
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={2}
        />
      </mesh>
      <mesh position={[-0.08, 0.52, 0.18]}>
        <sphereGeometry args={[0.025, 12, 12]} />
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={2}
        />
      </mesh>
    </BasePiece>
  );
};

// ==================== BISHOP - Neural Spire ====================
export const Bishop3D = ({ position, color, isSelected, isHovered, onClick }) => {
  const material = useNeuralMaterial(color, isSelected, isHovered, 'bishop');
  const accentColor = color === 'white' ? '#b090ff' : '#bf00ff';
  const secondAccent = color === 'white' ? '#ffffff' : '#ff00bf';
  const goldAccent = '#ffcc00';
  
  return (
    <BasePiece position={position} color={color} isSelected={isSelected} isHovered={isHovered} onClick={onClick}>
      {/* Base */}
      <mesh castShadow receiveShadow material={material}>
        <cylinderGeometry args={[0.26, 0.3, 0.14, 18]} />
      </mesh>
      
      <mesh position={[0, 0.06, 0]}>
        <torusGeometry args={[0.27, 0.012, 8, 30]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <torusGeometry args={[0.23, 0.008, 6, 24]} />
        <meshStandardMaterial color={secondAccent} emissive={secondAccent} emissiveIntensity={0.5} transparent opacity={0.7} />
      </mesh>
      
      {/* Body column */}
      <mesh position={[0, 0.32, 0]} castShadow material={material}>
        <cylinderGeometry args={[0.15, 0.22, 0.45, 16]} />
      </mesh>
      
      {/* Body ring */}
      <mesh position={[0, 0.35, 0]}>
        <torusGeometry args={[0.17, 0.01, 6, 24]} />
        <meshStandardMaterial color={goldAccent} emissive={goldAccent} emissiveIntensity={0.6} />
      </mesh>
      
      {/* Mitre dome */}
      <mesh position={[0, 0.62, 0]} castShadow material={material}>
        <sphereGeometry args={[0.18, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>
      
      {/* Spire */}
      <mesh position={[0, 0.82, 0]} castShadow material={material}>
        <coneGeometry args={[0.09, 0.25, 14]} />
      </mesh>
      
      {/* Neural channel slit */}
      <mesh position={[0, 0.68, 0.13]} rotation={[Math.PI / 2, 0, 0]}>
        <boxGeometry args={[0.03, 0.16, 0.14]} />
        <meshStandardMaterial
          color={secondAccent}
          emissive={secondAccent}
          emissiveIntensity={2}
        />
      </mesh>
      
      {/* Tip orb */}
      <mesh position={[0, 0.97, 0]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial
          color={goldAccent}
          emissive={goldAccent}
          emissiveIntensity={2}
        />
      </mesh>
    </BasePiece>
  );
};

// ==================== QUEEN - Neural Empress ====================
export const Queen3D = ({ position, color, isSelected, isHovered, onClick }) => {
  const material = useNeuralMaterial(color, isSelected, isHovered, 'queen');
  const accentColor = color === 'white' ? '#b090ff' : '#bf00ff';
  const secondAccent = color === 'white' ? '#e0c0ff' : '#ff00bf';
  const goldAccent = '#ffcc00';
  
  return (
    <BasePiece position={position} color={color} isSelected={isSelected} isHovered={isHovered} onClick={onClick}>
      {/* Grand base */}
      <mesh castShadow receiveShadow material={material}>
        <cylinderGeometry args={[0.28, 0.34, 0.14, 20]} />
      </mesh>
      
      {/* Triple base rings */}
      <mesh position={[0, 0.06, 0]}>
        <torusGeometry args={[0.3, 0.015, 8, 36]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.7} />
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <torusGeometry args={[0.26, 0.01, 6, 28]} />
        <meshStandardMaterial color={secondAccent} emissive={secondAccent} emissiveIntensity={0.5} transparent opacity={0.7} />
      </mesh>
      <mesh position={[0, -0.02, 0]}>
        <torusGeometry args={[0.32, 0.008, 6, 28]} />
        <meshStandardMaterial color={goldAccent} emissive={goldAccent} emissiveIntensity={0.5} transparent opacity={0.5} />
      </mesh>
      
      {/* Elegant body */}
      <mesh position={[0, 0.28, 0]} castShadow material={material}>
        <cylinderGeometry args={[0.18, 0.24, 0.35, 20]} />
      </mesh>
      
      {/* Neck */}
      <mesh position={[0, 0.5, 0]} castShadow material={material}>
        <cylinderGeometry args={[0.2, 0.18, 0.12, 20]} />
      </mesh>
      
      {/* Crown base */}
      <mesh position={[0, 0.6, 0]} castShadow material={material}>
        <cylinderGeometry args={[0.22, 0.2, 0.1, 20]} />
      </mesh>
      
      {/* Neural crown spires - 7 elegant points */}
      {[0, 51.4, 102.8, 154.3, 205.7, 257.1, 308.5].map((angle, i) => (
        <mesh
          key={i}
          position={[
            Math.cos((angle * Math.PI) / 180) * 0.14,
            0.74,
            Math.sin((angle * Math.PI) / 180) * 0.14
          ]}
          castShadow
          material={material}
        >
          <coneGeometry args={[0.035, 0.2, 8]} />
        </mesh>
      ))}
      
      {/* Central neural orb */}
      <mesh position={[0, 0.88, 0]}>
        <sphereGeometry args={[0.1, 28, 28]} />
        <meshStandardMaterial
          color={goldAccent}
          emissive={goldAccent}
          emissiveIntensity={2.5}
          metalness={0.95}
          roughness={0.05}
        />
      </mesh>
      
      {/* Double aura glow */}
      <mesh position={[0, 0.88, 0]}>
        <sphereGeometry args={[0.14, 20, 20]} />
        <meshStandardMaterial
          color={goldAccent}
          emissive={goldAccent}
          emissiveIntensity={0.6}
          transparent
          opacity={0.25}
        />
      </mesh>
      <mesh position={[0, 0.88, 0]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={0.3}
          transparent
          opacity={0.12}
        />
      </mesh>
    </BasePiece>
  );
};

// ==================== KING - THE ALPHAZERO SEAL ====================
export const King3D = ({ position, color, isSelected, isHovered, onClick }) => {
  const material = useNeuralMaterial(color, isSelected, isHovered, 'king');
  const accentColor = color === 'white' ? '#b090ff' : '#bf00ff';
  const secondAccent = color === 'white' ? '#ffffff' : '#ff00bf';
  const goldAccent = '#ffcc00';
  const crossColor = '#ffcc00';
  
  return (
    <BasePiece position={position} color={color} isSelected={isSelected} isHovered={isHovered} onClick={onClick}>
      {/* Grand base with chain anchor patterns */}
      <mesh castShadow receiveShadow material={material}>
        <cylinderGeometry args={[0.3, 0.38, 0.16, 24]} />
      </mesh>
      
      {/* Quadruple rune rings - THE SEAL */}
      <mesh position={[0, 0.07, 0]}>
        <torusGeometry args={[0.33, 0.018, 8, 40]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[0, 0.03, 0]}>
        <torusGeometry args={[0.29, 0.012, 6, 32]} />
        <meshStandardMaterial color={secondAccent} emissive={secondAccent} emissiveIntensity={0.6} transparent opacity={0.8} />
      </mesh>
      <mesh position={[0, -0.01, 0]}>
        <torusGeometry args={[0.36, 0.01, 6, 32]} />
        <meshStandardMaterial color={goldAccent} emissive={goldAccent} emissiveIntensity={0.7} transparent opacity={0.6} />
      </mesh>
      <mesh position={[0, -0.05, 0]}>
        <torusGeometry args={[0.25, 0.008, 6, 28]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.5} transparent opacity={0.5} />
      </mesh>
      
      {/* Regal body */}
      <mesh position={[0, 0.32, 0]} castShadow material={material}>
        <cylinderGeometry args={[0.2, 0.26, 0.38, 20]} />
      </mesh>
      
      {/* Body ornament rings */}
      <mesh position={[0, 0.22, 0]}>
        <torusGeometry args={[0.23, 0.012, 8, 28]} />
        <meshStandardMaterial color={goldAccent} emissive={goldAccent} emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[0, 0.38, 0]}>
        <torusGeometry args={[0.21, 0.01, 8, 28]} />
        <meshStandardMaterial color={secondAccent} emissive={secondAccent} emissiveIntensity={0.5} />
      </mesh>
      
      {/* Neck collar */}
      <mesh position={[0, 0.54, 0]} castShadow material={material}>
        <cylinderGeometry args={[0.22, 0.2, 0.12, 20]} />
      </mesh>
      
      {/* Crown band with rune engravings */}
      <mesh position={[0, 0.64, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.18, 0.04, 12, 32]} />
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={1}
          metalness={0.95}
          roughness={0.1}
        />
      </mesh>
      
      {/* THE ALPHAZERO CROSS - Neural Symbol of Mastery */}
      <group position={[0, 0.82, 0]}>
        {/* Vertical beam */}
        <mesh castShadow>
          <boxGeometry args={[0.06, 0.34, 0.06]} />
          <meshStandardMaterial
            color={crossColor}
            emissive={crossColor}
            emissiveIntensity={2}
            metalness={0.95}
            roughness={0.05}
          />
        </mesh>
        {/* Horizontal beam */}
        <mesh position={[0, 0.08, 0]} castShadow>
          <boxGeometry args={[0.22, 0.06, 0.06]} />
          <meshStandardMaterial
            color={crossColor}
            emissive={crossColor}
            emissiveIntensity={2}
            metalness={0.95}
            roughness={0.05}
          />
        </mesh>
        
        {/* Cross junction orbs */}
        <mesh position={[0, 0.08, 0]}>
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={3}
          />
        </mesh>
        <mesh position={[0.11, 0.08, 0]}>
          <sphereGeometry args={[0.025, 12, 12]} />
          <meshStandardMaterial
            color={accentColor}
            emissive={accentColor}
            emissiveIntensity={2}
          />
        </mesh>
        <mesh position={[-0.11, 0.08, 0]}>
          <sphereGeometry args={[0.025, 12, 12]} />
          <meshStandardMaterial
            color={accentColor}
            emissive={accentColor}
            emissiveIntensity={2}
          />
        </mesh>
        <mesh position={[0, 0.17, 0]}>
          <sphereGeometry args={[0.025, 12, 12]} />
          <meshStandardMaterial
            color={secondAccent}
            emissive={secondAccent}
            emissiveIntensity={2}
          />
        </mesh>
      </group>
      
      {/* Neural aura around cross */}
      <mesh position={[0, 0.85, 0]}>
        <sphereGeometry args={[0.22, 20, 20]} />
        <meshStandardMaterial
          color={crossColor}
          emissive={crossColor}
          emissiveIntensity={0.5}
          transparent
          opacity={0.18}
        />
      </mesh>
      <mesh position={[0, 0.85, 0]}>
        <sphereGeometry args={[0.28, 16, 16]} />
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={0.3}
          transparent
          opacity={0.1}
        />
      </mesh>
    </BasePiece>
  );
};

// ==================== PIECE FACTORY ====================
export const AlphaZeroPiece3D = ({ type, color, position, isSelected, isHovered, onClick }) => {
  const pieceComponents = {
    p: Pawn3D,
    r: Rook3D,
    n: Knight3D,
    b: Bishop3D,
    q: Queen3D,
    k: King3D,
  };
  
  const PieceComponent = pieceComponents[type.toLowerCase()];
  
  if (!PieceComponent) return null;
  
  return (
    <PieceComponent
      position={position}
      color={color}
      isSelected={isSelected}
      isHovered={isHovered}
      onClick={onClick}
    />
  );
};

export default AlphaZeroPiece3D;
