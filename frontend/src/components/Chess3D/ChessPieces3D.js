import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Crystal material for pieces
const useCrystalMaterial = (color, isSelected = false, isHovered = false) => {
  return useMemo(() => {
    const baseColor = color === 'white' ? '#e8e8ff' : '#1a1a2e';
    const emissiveColor = color === 'white' ? '#9090ff' : '#4a2a6a';
    
    return new THREE.MeshPhysicalMaterial({
      color: baseColor,
      metalness: 0.1,
      roughness: 0.1,
      transmission: 0.6,
      thickness: 1.5,
      envMapIntensity: 1,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      ior: 1.5,
      emissive: emissiveColor,
      emissiveIntensity: isSelected ? 0.5 : isHovered ? 0.3 : 0.1,
      transparent: true,
      opacity: 0.9,
    });
  }, [color, isSelected, isHovered]);
};

// Base piece component with floating animation
const BasePiece = ({ children, position, color, isSelected, isHovered, onClick }) => {
  const groupRef = useRef();
  const floatOffset = useRef(Math.random() * Math.PI * 2);
  
  useFrame((state) => {
    if (groupRef.current) {
      const baseY = position[1];
      const floatAmount = isSelected ? 0.3 : 0.1;
      const speed = isSelected ? 2 : 1;
      groupRef.current.position.y = baseY + Math.sin(state.clock.elapsedTime * speed + floatOffset.current) * floatAmount;
      
      if (isSelected) {
        groupRef.current.rotation.y += 0.02;
      }
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={onClick}
      onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { document.body.style.cursor = 'default'; }}
    >
      {children}
      {/* Glow effect under piece */}
      {isSelected && (
        <pointLight
          position={[0, 0.5, 0]}
          intensity={2}
          distance={3}
          color={color === 'white' ? '#9090ff' : '#bf00ff'}
        />
      )}
    </group>
  );
};

// Pawn - Simple crystal obelisk
export const Pawn3D = ({ position, color, isSelected, isHovered, onClick }) => {
  const material = useCrystalMaterial(color, isSelected, isHovered);
  
  return (
    <BasePiece position={position} color={color} isSelected={isSelected} isHovered={isHovered} onClick={onClick}>
      <mesh castShadow receiveShadow material={material}>
        <cylinderGeometry args={[0.15, 0.25, 0.15, 8]} />
      </mesh>
      <mesh position={[0, 0.2, 0]} castShadow material={material}>
        <cylinderGeometry args={[0.12, 0.15, 0.25, 8]} />
      </mesh>
      <mesh position={[0, 0.45, 0]} castShadow material={material}>
        <sphereGeometry args={[0.15, 16, 16]} />
      </mesh>
    </BasePiece>
  );
};

// Rook - Crystal tower
export const Rook3D = ({ position, color, isSelected, isHovered, onClick }) => {
  const material = useCrystalMaterial(color, isSelected, isHovered);
  
  return (
    <BasePiece position={position} color={color} isSelected={isSelected} isHovered={isHovered} onClick={onClick}>
      <mesh castShadow receiveShadow material={material}>
        <cylinderGeometry args={[0.2, 0.28, 0.15, 8]} />
      </mesh>
      <mesh position={[0, 0.25, 0]} castShadow material={material}>
        <cylinderGeometry args={[0.18, 0.2, 0.35, 8]} />
      </mesh>
      <mesh position={[0, 0.5, 0]} castShadow material={material}>
        <cylinderGeometry args={[0.22, 0.18, 0.15, 8]} />
      </mesh>
      {/* Battlements */}
      {[0, 90, 180, 270].map((angle, i) => (
        <mesh
          key={i}
          position={[
            Math.cos((angle * Math.PI) / 180) * 0.15,
            0.65,
            Math.sin((angle * Math.PI) / 180) * 0.15
          ]}
          castShadow
          material={material}
        >
          <boxGeometry args={[0.1, 0.15, 0.1]} />
        </mesh>
      ))}
    </BasePiece>
  );
};

// Knight - Crystal horse head
export const Knight3D = ({ position, color, isSelected, isHovered, onClick }) => {
  const material = useCrystalMaterial(color, isSelected, isHovered);
  
  return (
    <BasePiece position={position} color={color} isSelected={isSelected} isHovered={isHovered} onClick={onClick}>
      <mesh castShadow receiveShadow material={material}>
        <cylinderGeometry args={[0.18, 0.25, 0.15, 8]} />
      </mesh>
      <mesh position={[0, 0.2, 0]} castShadow material={material}>
        <cylinderGeometry args={[0.15, 0.18, 0.25, 8]} />
      </mesh>
      {/* Horse head shape */}
      <mesh position={[0, 0.45, 0.05]} rotation={[0.3, 0, 0]} castShadow material={material}>
        <boxGeometry args={[0.2, 0.35, 0.25]} />
      </mesh>
      {/* Ear/mane */}
      <mesh position={[0, 0.65, -0.05]} rotation={[-0.3, 0, 0]} castShadow material={material}>
        <coneGeometry args={[0.08, 0.2, 4]} />
      </mesh>
    </BasePiece>
  );
};

// Bishop - Crystal spire
export const Bishop3D = ({ position, color, isSelected, isHovered, onClick }) => {
  const material = useCrystalMaterial(color, isSelected, isHovered);
  
  return (
    <BasePiece position={position} color={color} isSelected={isSelected} isHovered={isHovered} onClick={onClick}>
      <mesh castShadow receiveShadow material={material}>
        <cylinderGeometry args={[0.18, 0.25, 0.15, 8]} />
      </mesh>
      <mesh position={[0, 0.25, 0]} castShadow material={material}>
        <cylinderGeometry args={[0.12, 0.18, 0.35, 8]} />
      </mesh>
      {/* Mitre shape */}
      <mesh position={[0, 0.55, 0]} castShadow material={material}>
        <sphereGeometry args={[0.15, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>
      <mesh position={[0, 0.7, 0]} castShadow material={material}>
        <coneGeometry args={[0.08, 0.15, 8]} />
      </mesh>
      {/* Cross slit */}
      <mesh position={[0, 0.55, 0.1]} rotation={[Math.PI / 2, 0, 0]} material={material}>
        <boxGeometry args={[0.02, 0.1, 0.15]} />
      </mesh>
    </BasePiece>
  );
};

// Queen - Crystal crown with orb
export const Queen3D = ({ position, color, isSelected, isHovered, onClick }) => {
  const material = useCrystalMaterial(color, isSelected, isHovered);
  
  return (
    <BasePiece position={position} color={color} isSelected={isSelected} isHovered={isHovered} onClick={onClick}>
      <mesh castShadow receiveShadow material={material}>
        <cylinderGeometry args={[0.2, 0.28, 0.15, 8]} />
      </mesh>
      <mesh position={[0, 0.2, 0]} castShadow material={material}>
        <cylinderGeometry args={[0.15, 0.2, 0.25, 8]} />
      </mesh>
      <mesh position={[0, 0.4, 0]} castShadow material={material}>
        <cylinderGeometry args={[0.18, 0.15, 0.15, 8]} />
      </mesh>
      {/* Crown points */}
      {[0, 72, 144, 216, 288].map((angle, i) => (
        <mesh
          key={i}
          position={[
            Math.cos((angle * Math.PI) / 180) * 0.12,
            0.6,
            Math.sin((angle * Math.PI) / 180) * 0.12
          ]}
          castShadow
          material={material}
        >
          <coneGeometry args={[0.05, 0.2, 4]} />
        </mesh>
      ))}
      {/* Crown orb */}
      <mesh position={[0, 0.75, 0]} castShadow material={material}>
        <sphereGeometry args={[0.08, 16, 16]} />
      </mesh>
    </BasePiece>
  );
};

// King - Crystal crown with cross
export const King3D = ({ position, color, isSelected, isHovered, onClick }) => {
  const material = useCrystalMaterial(color, isSelected, isHovered);
  
  return (
    <BasePiece position={position} color={color} isSelected={isSelected} isHovered={isHovered} onClick={onClick}>
      <mesh castShadow receiveShadow material={material}>
        <cylinderGeometry args={[0.22, 0.3, 0.15, 8]} />
      </mesh>
      <mesh position={[0, 0.2, 0]} castShadow material={material}>
        <cylinderGeometry args={[0.17, 0.22, 0.25, 8]} />
      </mesh>
      <mesh position={[0, 0.4, 0]} castShadow material={material}>
        <cylinderGeometry args={[0.2, 0.17, 0.15, 8]} />
      </mesh>
      {/* Crown band */}
      <mesh position={[0, 0.55, 0]} castShadow material={material}>
        <torusGeometry args={[0.15, 0.03, 8, 16]} />
      </mesh>
      {/* Cross on top */}
      <mesh position={[0, 0.7, 0]} castShadow material={material}>
        <boxGeometry args={[0.04, 0.25, 0.04]} />
      </mesh>
      <mesh position={[0, 0.75, 0]} castShadow material={material}>
        <boxGeometry args={[0.15, 0.04, 0.04]} />
      </mesh>
    </BasePiece>
  );
};

// Piece factory
export const ChessPiece3D = ({ type, color, position, isSelected, isHovered, onClick }) => {
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

export default ChessPiece3D;
