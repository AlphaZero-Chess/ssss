import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ==================== OPTIMIZED NEURAL MATERIAL ====================
const useNeuralMaterial = (color, isSelected = false) => {
  return useMemo(() => {
    const isWhite = color === 'white';
    const baseColor = isWhite ? '#e8e0f8' : '#060308';
    const emissiveColor = isWhite ? '#9060ff' : '#bf00ff';
    
    return new THREE.MeshPhysicalMaterial({
      color: baseColor,
      metalness: 0.9,
      roughness: 0.1,
      transmission: isWhite ? 0.3 : 0.15,
      thickness: 3,
      clearcoat: 0.8,
      emissive: emissiveColor,
      emissiveIntensity: isSelected ? 1.5 : 0.3,
      transparent: true,
      opacity: 0.95,
    });
  }, [color, isSelected]);
};

// ==================== OPTIMIZED BASE PIECE COMPONENT ====================
const BasePiece = ({ children, position, color, isSelected, onClick }) => {
  const groupRef = useRef();
  const floatOffset = useRef(Math.random() * Math.PI * 2);
  
  useFrame((state) => {
    if (groupRef.current) {
      const baseY = position[1];
      const floatAmount = isSelected ? 0.4 : 0.1;
      const speed = isSelected ? 2.5 : 0.8;
      groupRef.current.position.y = baseY + Math.sin(state.clock.elapsedTime * speed + floatOffset.current) * floatAmount;
      
      if (isSelected) {
        groupRef.current.rotation.y += 0.012;
      }
    }
  });
  
  const glowColor = color === 'white' ? '#b090ff' : '#bf00ff';
  
  return (
    <group
      ref={groupRef}
      position={position}
      onClick={onClick}
      onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { document.body.style.cursor = 'default'; }}
    >
      {children}
      
      {/* Selection ring */}
      {isSelected && (
        <mesh position={[0, 0.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.5, 0.02, 8, 32]} />
          <meshStandardMaterial
            color={glowColor}
            emissive={glowColor}
            emissiveIntensity={1.5}
            transparent
            opacity={0.8}
          />
        </mesh>
      )}
      
      {/* Glow light */}
      <pointLight
        position={[0, 0.5, 0]}
        intensity={isSelected ? 4 : 1}
        distance={isSelected ? 5 : 3}
        color={glowColor}
      />
    </group>
  );
};

// ==================== PAWN ====================
export const Pawn3D = ({ position, color, isSelected, onClick }) => {
  const material = useNeuralMaterial(color, isSelected);
  const accentColor = color === 'white' ? '#b090ff' : '#bf00ff';
  
  return (
    <BasePiece position={position} color={color} isSelected={isSelected} onClick={onClick}>
      {/* Base */}
      <mesh castShadow material={material}>
        <cylinderGeometry args={[0.24, 0.3, 0.14, 20]} />
      </mesh>
      <mesh position={[0, 0.06, 0]}>
        <torusGeometry args={[0.26, 0.012, 6, 24]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.6} />
      </mesh>
      
      {/* Body */}
      <mesh position={[0, 0.26, 0]} castShadow material={material}>
        <cylinderGeometry args={[0.15, 0.2, 0.32, 16]} />
      </mesh>
      
      {/* Head */}
      <mesh position={[0, 0.52, 0]} castShadow material={material}>
        <sphereGeometry args={[0.18, 24, 24]} />
      </mesh>
      
      {/* Inner glow */}
      <mesh position={[0, 0.52, 0]}>
        <octahedronGeometry args={[0.08, 0]} />
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={1.8}
        />
      </mesh>
    </BasePiece>
  );
};

// ==================== ROOK - MONOLITHIC OBELISK (NOT A TOWER) ====================
export const Rook3D = ({ position, color, isSelected, onClick }) => {
  const material = useNeuralMaterial(color, isSelected);
  const accentColor = color === 'white' ? '#b090ff' : '#bf00ff';
  const goldAccent = '#ffcc00';
  
  return (
    <BasePiece position={position} color={color} isSelected={isSelected} onClick={onClick}>
      {/* Base */}
      <mesh castShadow material={material}>
        <cylinderGeometry args={[0.3, 0.35, 0.14, 12]} />
      </mesh>
      <mesh position={[0, 0.06, 0]}>
        <torusGeometry args={[0.32, 0.014, 6, 20]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.7} />
      </mesh>
      
      {/* Main obelisk body - CLEAN MONOLITH, NO BATTLEMENTS */}
      <mesh position={[0, 0.42, 0]} castShadow material={material}>
        <cylinderGeometry args={[0.2, 0.26, 0.6, 12]} />
      </mesh>
      
      {/* Runic band */}
      <mesh position={[0, 0.4, 0]}>
        <torusGeometry args={[0.22, 0.012, 6, 18]} />
        <meshStandardMaterial color={goldAccent} emissive={goldAccent} emissiveIntensity={0.7} />
      </mesh>
      
      {/* Crown cap - flat neural */}
      <mesh position={[0, 0.76, 0]} castShadow material={material}>
        <cylinderGeometry args={[0.22, 0.2, 0.1, 12]} />
      </mesh>
      
      {/* Central neural core - octahedron */}
      <mesh position={[0, 0.88, 0]}>
        <octahedronGeometry args={[0.12, 0]} />
        <meshStandardMaterial
          color={goldAccent}
          emissive={goldAccent}
          emissiveIntensity={2}
          metalness={0.95}
          roughness={0.05}
        />
      </mesh>
    </BasePiece>
  );
};

// ==================== KNIGHT ====================
export const Knight3D = ({ position, color, isSelected, onClick }) => {
  const material = useNeuralMaterial(color, isSelected);
  const accentColor = color === 'white' ? '#b090ff' : '#bf00ff';
  const eyeColor = color === 'white' ? '#00ffff' : '#ff0040';
  
  return (
    <BasePiece position={position} color={color} isSelected={isSelected} onClick={onClick}>
      {/* Base */}
      <mesh castShadow material={material}>
        <cylinderGeometry args={[0.26, 0.3, 0.14, 16]} />
      </mesh>
      <mesh position={[0, 0.06, 0]}>
        <torusGeometry args={[0.27, 0.012, 6, 22]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.6} />
      </mesh>
      
      {/* Body stem */}
      <mesh position={[0, 0.3, 0]} castShadow material={material}>
        <cylinderGeometry args={[0.17, 0.22, 0.36, 14]} />
      </mesh>
      
      {/* Head */}
      <mesh position={[0, 0.58, 0.08]} rotation={[0.4, 0, 0]} castShadow material={material}>
        <boxGeometry args={[0.24, 0.36, 0.28]} />
      </mesh>
      
      {/* Crest */}
      <mesh position={[0, 0.84, -0.02]} rotation={[-0.2, 0, 0]} castShadow material={material}>
        <coneGeometry args={[0.1, 0.22, 8]} />
      </mesh>
      
      {/* Eye */}
      <mesh position={[0, 0.6, 0.22]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial
          color={eyeColor}
          emissive={eyeColor}
          emissiveIntensity={3}
        />
      </mesh>
    </BasePiece>
  );
};

// ==================== BISHOP ====================
export const Bishop3D = ({ position, color, isSelected, onClick }) => {
  const material = useNeuralMaterial(color, isSelected);
  const accentColor = color === 'white' ? '#b090ff' : '#bf00ff';
  const goldAccent = '#ffcc00';
  
  return (
    <BasePiece position={position} color={color} isSelected={isSelected} onClick={onClick}>
      {/* Base */}
      <mesh castShadow material={material}>
        <cylinderGeometry args={[0.26, 0.3, 0.14, 18]} />
      </mesh>
      <mesh position={[0, 0.06, 0]}>
        <torusGeometry args={[0.27, 0.012, 6, 24]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.6} />
      </mesh>
      
      {/* Body column */}
      <mesh position={[0, 0.34, 0]} castShadow material={material}>
        <cylinderGeometry args={[0.15, 0.22, 0.44, 16]} />
      </mesh>
      
      {/* Mitre dome */}
      <mesh position={[0, 0.64, 0]} castShadow material={material}>
        <sphereGeometry args={[0.18, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>
      
      {/* Spire */}
      <mesh position={[0, 0.88, 0]} castShadow material={material}>
        <coneGeometry args={[0.08, 0.25, 14]} />
      </mesh>
      
      {/* Tip orb */}
      <mesh position={[0, 1.02, 0]}>
        <sphereGeometry args={[0.04, 14, 14]} />
        <meshStandardMaterial
          color={goldAccent}
          emissive={goldAccent}
          emissiveIntensity={2.2}
        />
      </mesh>
    </BasePiece>
  );
};

// ==================== QUEEN ====================
export const Queen3D = ({ position, color, isSelected, onClick }) => {
  const material = useNeuralMaterial(color, isSelected);
  const accentColor = color === 'white' ? '#b090ff' : '#bf00ff';
  const goldAccent = '#ffcc00';
  
  return (
    <BasePiece position={position} color={color} isSelected={isSelected} onClick={onClick}>
      {/* Grand base */}
      <mesh castShadow material={material}>
        <cylinderGeometry args={[0.28, 0.34, 0.14, 20]} />
      </mesh>
      <mesh position={[0, 0.06, 0]}>
        <torusGeometry args={[0.3, 0.014, 6, 28]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.7} />
      </mesh>
      
      {/* Body */}
      <mesh position={[0, 0.3, 0]} castShadow material={material}>
        <cylinderGeometry args={[0.18, 0.24, 0.36, 18]} />
      </mesh>
      
      {/* Neck */}
      <mesh position={[0, 0.52, 0]} castShadow material={material}>
        <cylinderGeometry args={[0.2, 0.18, 0.12, 18]} />
      </mesh>
      
      {/* Crown base */}
      <mesh position={[0, 0.64, 0]} castShadow material={material}>
        <cylinderGeometry args={[0.22, 0.2, 0.1, 18]} />
      </mesh>
      
      {/* Crown spires */}
      {Array.from({ length: 6 }, (_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * 0.14, 0.78, Math.sin(angle) * 0.14]}
            castShadow
            material={material}
          >
            <coneGeometry args={[0.035, 0.2, 8]} />
          </mesh>
        );
      })}
      
      {/* Central orb */}
      <mesh position={[0, 0.92, 0]}>
        <sphereGeometry args={[0.1, 20, 20]} />
        <meshStandardMaterial
          color={goldAccent}
          emissive={goldAccent}
          emissiveIntensity={2.5}
          metalness={0.95}
          roughness={0.05}
        />
      </mesh>
    </BasePiece>
  );
};

// ==================== KING - THE ALPHAZERO SEAL ====================
export const King3D = ({ position, color, isSelected, onClick }) => {
  const material = useNeuralMaterial(color, isSelected);
  const accentColor = color === 'white' ? '#b090ff' : '#bf00ff';
  const goldAccent = '#ffcc00';
  
  return (
    <BasePiece position={position} color={color} isSelected={isSelected} onClick={onClick}>
      {/* Grand base with seal */}
      <mesh castShadow material={material}>
        <cylinderGeometry args={[0.3, 0.38, 0.16, 22]} />
      </mesh>
      <mesh position={[0, 0.07, 0]}>
        <torusGeometry args={[0.33, 0.016, 8, 30]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <torusGeometry args={[0.36, 0.01, 6, 26]} />
        <meshStandardMaterial color={goldAccent} emissive={goldAccent} emissiveIntensity={0.6} transparent opacity={0.7} />
      </mesh>
      
      {/* Regal body */}
      <mesh position={[0, 0.34, 0]} castShadow material={material}>
        <cylinderGeometry args={[0.2, 0.26, 0.38, 18]} />
      </mesh>
      
      {/* Body ring */}
      <mesh position={[0, 0.35, 0]}>
        <torusGeometry args={[0.22, 0.012, 6, 24]} />
        <meshStandardMaterial color={goldAccent} emissive={goldAccent} emissiveIntensity={0.65} />
      </mesh>
      
      {/* Neck collar */}
      <mesh position={[0, 0.58, 0]} castShadow material={material}>
        <cylinderGeometry args={[0.22, 0.2, 0.12, 18]} />
      </mesh>
      
      {/* Crown band */}
      <mesh position={[0, 0.68, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.18, 0.04, 12, 28]} />
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={1}
          metalness={0.95}
          roughness={0.1}
        />
      </mesh>
      
      {/* THE ALPHAZERO CROSS */}
      <group position={[0, 0.88, 0]}>
        {/* Vertical beam */}
        <mesh castShadow>
          <boxGeometry args={[0.06, 0.35, 0.06]} />
          <meshStandardMaterial
            color={goldAccent}
            emissive={goldAccent}
            emissiveIntensity={2.2}
            metalness={0.95}
            roughness={0.05}
          />
        </mesh>
        {/* Horizontal beam */}
        <mesh position={[0, 0.08, 0]} castShadow>
          <boxGeometry args={[0.22, 0.06, 0.06]} />
          <meshStandardMaterial
            color={goldAccent}
            emissive={goldAccent}
            emissiveIntensity={2.2}
            metalness={0.95}
            roughness={0.05}
          />
        </mesh>
        
        {/* Cross junction orb */}
        <mesh position={[0, 0.08, 0]}>
          <sphereGeometry args={[0.045, 14, 14]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={3.5}
          />
        </mesh>
      </group>
    </BasePiece>
  );
};

// ==================== PIECE FACTORY ====================
export const AlphaZeroPiece3DOptimized = ({ type, color, position, isSelected, onClick, playerColor }) => {
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
  
  // When playing as Black, pieces need to counter-rotate to face the player
  const pieceRotation = playerColor === 'black' ? [0, Math.PI, 0] : [0, 0, 0];
  
  return (
    <group rotation={pieceRotation}>
      <PieceComponent
        position={position}
        color={color}
        isSelected={isSelected}
        onClick={onClick}
      />
    </group>
  );
};

export default AlphaZeroPiece3DOptimized;
