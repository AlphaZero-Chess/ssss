import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Rune symbols for piece engravings
const RUNES = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ', 'ᛁ', 'ᛃ', 'ᛇ', 'ᛈ', 'ᛉ', 'ᛋ', 'ᛏ', 'ᛒ', 'ᛖ', 'ᛗ', 'ᛚ', 'ᛜ', 'ᛞ', 'ᛟ'];

// Advanced material with neural glow effect
const useNeuralMaterial = (color, isSelected = false, isHovered = false, pieceType = 'default') => {
  return useMemo(() => {
    const isWhite = color === 'white';
    
    // Deep sophisticated colors
    const baseColor = isWhite ? '#e8e0f8' : '#0a0818';
    const emissiveColor = isWhite ? '#9060ff' : '#bf00ff';
    const innerGlow = isWhite ? '#c0a0ff' : '#ff00bf';
    
    return new THREE.MeshPhysicalMaterial({
      color: baseColor,
      metalness: 0.85,
      roughness: 0.08,
      transmission: isWhite ? 0.3 : 0.15,
      thickness: 2,
      envMapIntensity: 2,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      ior: 2.4,
      reflectivity: 1,
      emissive: emissiveColor,
      emissiveIntensity: isSelected ? 1.2 : isHovered ? 0.7 : 0.25,
      transparent: true,
      opacity: 0.95,
      sheen: 1,
      sheenRoughness: 0.3,
      sheenColor: new THREE.Color(innerGlow),
      attenuationColor: new THREE.Color(isWhite ? '#d0c0ff' : '#3a0050'),
      attenuationDistance: 0.5,
    });
  }, [color, isSelected, isHovered]);
};

// Create rune-engraved ring geometry
const RuneRing = ({ radius, height, color, emissive }) => {
  const ringRef = useRef();
  
  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });
  
  return (
    <group ref={ringRef}>
      <mesh>
        <torusGeometry args={[radius, 0.02, 8, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={0.8}
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
};

// Neural chain links connecting to pieces
const NeuralChains = ({ position, color, count = 4 }) => {
  const chainsRef = useRef();
  
  const chains = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      angle: (i / count) * Math.PI * 2,
      length: 0.8 + Math.random() * 0.4,
      phase: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random() * 0.3
    }));
  }, [count]);
  
  useFrame((state) => {
    if (chainsRef.current) {
      chainsRef.current.children.forEach((chain, i) => {
        const data = chains[i];
        const pulse = Math.sin(state.clock.elapsedTime * data.speed * 3 + data.phase);
        chain.material.opacity = 0.4 + pulse * 0.3;
        chain.material.emissiveIntensity = 0.5 + pulse * 0.4;
      });
    }
  });
  
  const chainColor = color === 'white' ? '#9060ff' : '#bf00ff';
  
  return (
    <group ref={chainsRef}>
      {chains.map((chain, i) => {
        const startX = Math.cos(chain.angle) * 0.3;
        const startZ = Math.sin(chain.angle) * 0.3;
        const endX = Math.cos(chain.angle) * chain.length;
        const endZ = Math.sin(chain.angle) * chain.length;
        
        const points = [
          new THREE.Vector3(startX, 0.3, startZ),
          new THREE.Vector3(endX * 0.5, 0.5 + Math.sin(chain.phase) * 0.2, endZ * 0.5),
          new THREE.Vector3(endX, 0.1, endZ)
        ];
        const curve = new THREE.CatmullRomCurve3(points);
        
        return (
          <mesh key={i}>
            <tubeGeometry args={[curve, 16, 0.015, 6, false]} />
            <meshStandardMaterial
              color={chainColor}
              emissive={chainColor}
              emissiveIntensity={0.6}
              transparent
              opacity={0.6}
              metalness={0.9}
              roughness={0.3}
            />
          </mesh>
        );
      })}
    </group>
  );
};

// Base piece component with sophisticated floating animation
const BasePiece = ({ children, position, color, isSelected, isHovered, onClick }) => {
  const groupRef = useRef();
  const floatOffset = useRef(Math.random() * Math.PI * 2);
  const glowRef = useRef();
  
  useFrame((state) => {
    if (groupRef.current) {
      const baseY = position[1];
      const floatAmount = isSelected ? 0.4 : 0.15;
      const speed = isSelected ? 2.5 : 1.2;
      groupRef.current.position.y = baseY + Math.sin(state.clock.elapsedTime * speed + floatOffset.current) * floatAmount;
      
      if (isSelected) {
        groupRef.current.rotation.y += 0.015;
      }
    }
    
    if (glowRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.5 + 0.5;
      glowRef.current.intensity = isSelected ? 3 + pulse * 2 : isHovered ? 2 + pulse : 1 + pulse * 0.5;
    }
  });
  
  const glowColor = color === 'white' ? '#a080ff' : '#bf00ff';
  const secondaryGlow = color === 'white' ? '#ffffff' : '#ff00bf';
  
  return (
    <group
      ref={groupRef}
      position={position}
      onClick={onClick}
      onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { document.body.style.cursor = 'default'; }}
    >
      {children}
      
      {/* Neural chains on selected pieces */}
      {isSelected && <NeuralChains position={position} color={color} count={6} />}
      
      {/* Rune ring around selected piece */}
      {isSelected && (
        <group position={[0, 0.2, 0]}>
          <RuneRing radius={0.5} height={0.02} color={glowColor} emissive={glowColor} />
        </group>
      )}
      
      {/* Base energy glow */}
      <pointLight
        ref={glowRef}
        position={[0, 0.4, 0]}
        intensity={isSelected ? 4 : isHovered ? 2 : 1}
        distance={isSelected ? 4 : 2.5}
        color={glowColor}
      />
      
      {/* Secondary accent glow */}
      {(isSelected || isHovered) && (
        <pointLight
          position={[0, 0.8, 0]}
          intensity={1}
          distance={2}
          color={secondaryGlow}
        />
      )}
    </group>
  );
};

// ==================== PAWN - Neural Node ====================
export const Pawn3D = ({ position, color, isSelected, isHovered, onClick }) => {
  const material = useNeuralMaterial(color, isSelected, isHovered, 'pawn');
  const accentColor = color === 'white' ? '#b090ff' : '#bf00ff';
  
  return (
    <BasePiece position={position} color={color} isSelected={isSelected} isHovered={isHovered} onClick={onClick}>
      {/* Base platform with rune engravings */}
      <mesh castShadow receiveShadow material={material}>
        <cylinderGeometry args={[0.22, 0.28, 0.12, 16]} />
      </mesh>
      
      {/* Rune ring on base */}
      <mesh position={[0, 0.06, 0]}>
        <torusGeometry args={[0.24, 0.015, 8, 24]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.5} />
      </mesh>
      
      {/* Body column */}
      <mesh position={[0, 0.22, 0]} castShadow material={material}>
        <cylinderGeometry args={[0.14, 0.18, 0.28, 12]} />
      </mesh>
      
      {/* Neural core sphere */}
      <mesh position={[0, 0.48, 0]} castShadow material={material}>
        <sphereGeometry args={[0.16, 24, 24]} />
      </mesh>
      
      {/* Inner glow sphere */}
      <mesh position={[0, 0.48, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={1.2}
          transparent
          opacity={0.8}
        />
      </mesh>
    </BasePiece>
  );
};

// ==================== ROOK - Monolithic Obelisk (NO TOWER) ====================
export const Rook3D = ({ position, color, isSelected, isHovered, onClick }) => {
  const material = useNeuralMaterial(color, isSelected, isHovered, 'rook');
  const accentColor = color === 'white' ? '#b090ff' : '#bf00ff';
  const secondAccent = color === 'white' ? '#ffffff' : '#ff00bf';
  
  return (
    <BasePiece position={position} color={color} isSelected={isSelected} isHovered={isHovered} onClick={onClick}>
      {/* Massive base with chain anchors */}
      <mesh castShadow receiveShadow material={material}>
        <cylinderGeometry args={[0.28, 0.32, 0.12, 8]} />
      </mesh>
      
      {/* Base rune ring */}
      <mesh position={[0, 0.06, 0]}>
        <torusGeometry args={[0.29, 0.018, 8, 16]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.6} />
      </mesh>
      
      {/* Main obelisk body - clean, no battlements */}
      <mesh position={[0, 0.35, 0]} castShadow material={material}>
        <cylinderGeometry args={[0.18, 0.24, 0.55, 8]} />
      </mesh>
      
      {/* Runic band middle */}
      <mesh position={[0, 0.35, 0]}>
        <torusGeometry args={[0.195, 0.02, 8, 16]} />
        <meshStandardMaterial color={secondAccent} emissive={secondAccent} emissiveIntensity={0.7} />
      </mesh>
      
      {/* Crown - Flat neural cap (NOT battlements/tower) */}
      <mesh position={[0, 0.65, 0]} castShadow material={material}>
        <cylinderGeometry args={[0.2, 0.18, 0.08, 8]} />
      </mesh>
      
      {/* Central neural core */}
      <mesh position={[0, 0.72, 0]}>
        <octahedronGeometry args={[0.1, 0]} />
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={1.5}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
    </BasePiece>
  );
};

// ==================== KNIGHT - Neural Serpent/Algorithm ====================
export const Knight3D = ({ position, color, isSelected, isHovered, onClick }) => {
  const material = useNeuralMaterial(color, isSelected, isHovered, 'knight');
  const accentColor = color === 'white' ? '#b090ff' : '#bf00ff';
  
  return (
    <BasePiece position={position} color={color} isSelected={isSelected} isHovered={isHovered} onClick={onClick}>
      {/* Base */}
      <mesh castShadow receiveShadow material={material}>
        <cylinderGeometry args={[0.24, 0.28, 0.12, 12]} />
      </mesh>
      
      <mesh position={[0, 0.06, 0]}>
        <torusGeometry args={[0.25, 0.015, 8, 24]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.5} />
      </mesh>
      
      {/* Body stem */}
      <mesh position={[0, 0.25, 0]} castShadow material={material}>
        <cylinderGeometry args={[0.16, 0.2, 0.3, 12]} />
      </mesh>
      
      {/* Abstract algorithmic head shape */}
      <mesh position={[0, 0.48, 0.06]} rotation={[0.35, 0, 0]} castShadow material={material}>
        <boxGeometry args={[0.22, 0.32, 0.26]} />
      </mesh>
      
      {/* Neural antenna/ears */}
      <mesh position={[0.06, 0.7, -0.02]} rotation={[-0.3, 0.2, 0]} castShadow material={material}>
        <coneGeometry args={[0.05, 0.18, 6]} />
      </mesh>
      <mesh position={[-0.06, 0.7, -0.02]} rotation={[-0.3, -0.2, 0]} castShadow material={material}>
        <coneGeometry args={[0.05, 0.18, 6]} />
      </mesh>
      
      {/* Glowing eye */}
      <mesh position={[0, 0.52, 0.18]}>
        <sphereGeometry args={[0.05, 16, 16]} />
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
  
  return (
    <BasePiece position={position} color={color} isSelected={isSelected} isHovered={isHovered} onClick={onClick}>
      {/* Base */}
      <mesh castShadow receiveShadow material={material}>
        <cylinderGeometry args={[0.24, 0.28, 0.12, 12]} />
      </mesh>
      
      <mesh position={[0, 0.06, 0]}>
        <torusGeometry args={[0.25, 0.015, 8, 24]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.5} />
      </mesh>
      
      {/* Body column */}
      <mesh position={[0, 0.3, 0]} castShadow material={material}>
        <cylinderGeometry args={[0.14, 0.2, 0.4, 12]} />
      </mesh>
      
      {/* Mitre shape - elegant curve */}
      <mesh position={[0, 0.58, 0]} castShadow material={material}>
        <sphereGeometry args={[0.16, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>
      
      {/* Spire top */}
      <mesh position={[0, 0.74, 0]} castShadow material={material}>
        <coneGeometry args={[0.08, 0.2, 12]} />
      </mesh>
      
      {/* Neural slit/channel */}
      <mesh position={[0, 0.6, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
        <boxGeometry args={[0.025, 0.15, 0.12]} />
        <meshStandardMaterial
          color={secondAccent}
          emissive={secondAccent}
          emissiveIntensity={1.5}
        />
      </mesh>
    </BasePiece>
  );
};

// ==================== QUEEN - Neural Empress ====================
export const Queen3D = ({ position, color, isSelected, isHovered, onClick }) => {
  const material = useNeuralMaterial(color, isSelected, isHovered, 'queen');
  const accentColor = color === 'white' ? '#b090ff' : '#bf00ff';
  const secondAccent = color === 'white' ? '#ffcc00' : '#ffcc00';
  
  return (
    <BasePiece position={position} color={color} isSelected={isSelected} isHovered={isHovered} onClick={onClick}>
      {/* Grand base */}
      <mesh castShadow receiveShadow material={material}>
        <cylinderGeometry args={[0.26, 0.32, 0.12, 16]} />
      </mesh>
      
      <mesh position={[0, 0.06, 0]}>
        <torusGeometry args={[0.28, 0.018, 8, 32]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.6} />
      </mesh>
      
      {/* Body elegant curve */}
      <mesh position={[0, 0.25, 0]} castShadow material={material}>
        <cylinderGeometry args={[0.16, 0.22, 0.3, 16]} />
      </mesh>
      
      {/* Neck */}
      <mesh position={[0, 0.45, 0]} castShadow material={material}>
        <cylinderGeometry args={[0.18, 0.16, 0.12, 16]} />
      </mesh>
      
      {/* Crown base */}
      <mesh position={[0, 0.55, 0]} castShadow material={material}>
        <cylinderGeometry args={[0.2, 0.18, 0.08, 16]} />
      </mesh>
      
      {/* Neural crown points - 5 elegant spires */}
      {[0, 72, 144, 216, 288].map((angle, i) => (
        <mesh
          key={i}
          position={[
            Math.cos((angle * Math.PI) / 180) * 0.13,
            0.68,
            Math.sin((angle * Math.PI) / 180) * 0.13
          ]}
          castShadow
          material={material}
        >
          <coneGeometry args={[0.04, 0.18, 6]} />
        </mesh>
      ))}
      
      {/* Central orb - neural core */}
      <mesh position={[0, 0.8, 0]}>
        <sphereGeometry args={[0.08, 24, 24]} />
        <meshStandardMaterial
          color={secondAccent}
          emissive={secondAccent}
          emissiveIntensity={2}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      
      {/* Outer glow ring */}
      <mesh position={[0, 0.8, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial
          color={secondAccent}
          emissive={secondAccent}
          emissiveIntensity={0.5}
          transparent
          opacity={0.3}
        />
      </mesh>
    </BasePiece>
  );
};

// ==================== KING - The AlphaZero Seal ====================
export const King3D = ({ position, color, isSelected, isHovered, onClick }) => {
  const material = useNeuralMaterial(color, isSelected, isHovered, 'king');
  const accentColor = color === 'white' ? '#b090ff' : '#bf00ff';
  const secondAccent = color === 'white' ? '#ffcc00' : '#ff00bf';
  const crossColor = '#ffcc00';
  
  return (
    <BasePiece position={position} color={color} isSelected={isSelected} isHovered={isHovered} onClick={onClick}>
      {/* Grand base with chain engravings */}
      <mesh castShadow receiveShadow material={material}>
        <cylinderGeometry args={[0.28, 0.34, 0.14, 16]} />
      </mesh>
      
      {/* Double rune rings on base */}
      <mesh position={[0, 0.05, 0]}>
        <torusGeometry args={[0.3, 0.02, 8, 32]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.7} />
      </mesh>
      <mesh position={[0, 0.09, 0]}>
        <torusGeometry args={[0.26, 0.015, 8, 32]} />
        <meshStandardMaterial color={secondAccent} emissive={secondAccent} emissiveIntensity={0.5} />
      </mesh>
      
      {/* Body - regal form */}
      <mesh position={[0, 0.28, 0]} castShadow material={material}>
        <cylinderGeometry args={[0.18, 0.24, 0.32, 16]} />
      </mesh>
      
      {/* Neck band */}
      <mesh position={[0, 0.48, 0]} castShadow material={material}>
        <cylinderGeometry args={[0.2, 0.18, 0.1, 16]} />
      </mesh>
      
      {/* Crown band with rune engravings */}
      <mesh position={[0, 0.58, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.16, 0.035, 8, 24]} />
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={0.8}
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>
      
      {/* The AlphaZero Cross - Neural Symbol */}
      <group position={[0, 0.72, 0]}>
        {/* Vertical beam */}
        <mesh castShadow>
          <boxGeometry args={[0.05, 0.28, 0.05]} />
          <meshStandardMaterial
            color={crossColor}
            emissive={crossColor}
            emissiveIntensity={1.5}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
        {/* Horizontal beam */}
        <mesh position={[0, 0.06, 0]} castShadow>
          <boxGeometry args={[0.18, 0.05, 0.05]} />
          <meshStandardMaterial
            color={crossColor}
            emissive={crossColor}
            emissiveIntensity={1.5}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      </group>
      
      {/* Neural aura around cross */}
      <mesh position={[0, 0.75, 0]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial
          color={crossColor}
          emissive={crossColor}
          emissiveIntensity={0.4}
          transparent
          opacity={0.2}
        />
      </mesh>
    </BasePiece>
  );
};

// Piece factory
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
