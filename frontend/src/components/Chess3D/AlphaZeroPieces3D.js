import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ==================== ULTRA-SOPHISTICATED NEURAL MATERIAL ====================
const useNeuralMaterial = (color, isSelected = false, isHovered = false, pieceType = 'default') => {
  return useMemo(() => {
    const isWhite = color === 'white';
    
    // Deep crystalline colors with extreme sophistication
    const baseColor = isWhite ? '#f0e8ff' : '#0a0412';
    const emissiveColor = isWhite ? '#a080ff' : '#bf00ff';
    
    return new THREE.MeshPhysicalMaterial({
      color: baseColor,
      metalness: 0.92,
      roughness: 0.05,
      transmission: isWhite ? 0.35 : 0.18,
      thickness: 3.5,
      envMapIntensity: 2.8,
      clearcoat: 1,
      clearcoatRoughness: 0.02,
      ior: 2.5,
      reflectivity: 1,
      emissive: emissiveColor,
      emissiveIntensity: isSelected ? 1.8 : isHovered ? 1 : 0.35,
      transparent: true,
      opacity: 0.97,
      sheen: 1,
      sheenRoughness: 0.12,
      sheenColor: new THREE.Color(isWhite ? '#e0d0ff' : '#ff00bf'),
      attenuationColor: new THREE.Color(isWhite ? '#d0c0ff' : '#600090'),
      attenuationDistance: 0.4,
    });
  }, [color, isSelected, isHovered]);
};

// ==================== SOPHISTICATED SECONDARY MATERIAL ====================
const useSecondaryMaterial = (color, isSelected = false) => {
  return useMemo(() => {
    const isWhite = color === 'white';
    return new THREE.MeshPhysicalMaterial({
      color: isWhite ? '#d8c8f0' : '#150828',
      metalness: 0.88,
      roughness: 0.08,
      emissive: isWhite ? '#8060d0' : '#9000c0',
      emissiveIntensity: isSelected ? 1.2 : 0.25,
      transparent: true,
      opacity: 0.95,
      clearcoat: 0.8,
    });
  }, [color, isSelected]);
};

// ==================== SELECTION AURA RING ====================
const SelectionAuraRing = ({ radius, color, emissive, speed = 0.4 }) => {
  const ringRef = useRef();
  
  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.y = state.clock.elapsedTime * speed;
      const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.3 + 0.7;
      ringRef.current.children.forEach(child => {
        if (child.material) child.material.emissiveIntensity = pulse * 1.2;
      });
    }
  });
  
  return (
    <group ref={ringRef}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.018, 10, 48]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={1}
          metalness={0.94}
          roughness={0.1}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius * 0.8, 0.01, 8, 40]} />
        <meshStandardMaterial
          color="#ffcc00"
          emissive="#ffcc00"
          emissiveIntensity={0.8}
          transparent
          opacity={0.7}
        />
      </mesh>
    </group>
  );
};

// ==================== SOPHISTICATED BASE PIECE COMPONENT ====================
const BasePiece = ({ children, position, color, isSelected, isHovered, onClick, pieceType = 'default' }) => {
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
      const pulse = Math.sin(state.clock.elapsedTime * 3.5) * 0.4 + 0.6;
      glowRef.current.intensity = isSelected ? 4 + pulse * 3 : isHovered ? 2.5 + pulse * 1.5 : 1.2 + pulse * 0.5;
    }
    
    if (secondaryGlowRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 4 + 1) * 0.4 + 0.6;
      secondaryGlowRef.current.intensity = isSelected ? 3 + pulse * 2 : isHovered ? 1.5 + pulse : 0.5 + pulse * 0.3;
    }
  });
  
  const glowColor = color === 'white' ? '#b090ff' : '#bf00ff';
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
      
      {/* Selection aura ring */}
      {isSelected && (
        <group position={[0, 0.08, 0]}>
          <SelectionAuraRing radius={0.5} color={glowColor} emissive={secondaryGlow} speed={0.6} />
        </group>
      )}
      
      {/* Hover indicator ring */}
      {isHovered && !isSelected && (
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.38, 0.012, 8, 32]} />
          <meshStandardMaterial
            color={glowColor}
            emissive={glowColor}
            emissiveIntensity={0.6}
            transparent
            opacity={0.5}
          />
        </mesh>
      )}
      
      {/* Primary glow light */}
      <pointLight
        ref={glowRef}
        position={[0, 0.5, 0]}
        intensity={isSelected ? 5 : isHovered ? 2.5 : 1.2}
        distance={isSelected ? 5 : 3.5}
        color={glowColor}
      />
      
      {/* Secondary accent glow */}
      <pointLight
        ref={secondaryGlowRef}
        position={[0, 0.8, 0]}
        intensity={isSelected ? 3 : isHovered ? 1.5 : 0.5}
        distance={isSelected ? 4 : 2.5}
        color={secondaryGlow}
      />
    </group>
  );
};

// ==================== PAWN - SOPHISTICATED NEURAL SENTINEL ====================
export const Pawn3D = ({ position, color, isSelected, isHovered, onClick }) => {
  const material = useNeuralMaterial(color, isSelected, isHovered, 'pawn');
  const accentColor = color === 'white' ? '#b090ff' : '#bf00ff';
  const innerGlow = color === 'white' ? '#ffffff' : '#ff00bf';
  const goldAccent = '#ffcc00';
  
  return (
    <BasePiece position={position} color={color} isSelected={isSelected} isHovered={isHovered} onClick={onClick} pieceType="pawn">
      {/* Wide circular base plate */}
      <mesh castShadow receiveShadow position={[0, 0.04, 0]} material={material}>
        <cylinderGeometry args={[0.28, 0.32, 0.08, 32]} />
      </mesh>
      
      {/* Base collar ring */}
      <mesh position={[0, 0.09, 0]}>
        <torusGeometry args={[0.26, 0.02, 12, 32]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.6} />
      </mesh>
      
      {/* Tapered stem - lower */}
      <mesh castShadow position={[0, 0.22, 0]} material={material}>
        <cylinderGeometry args={[0.18, 0.24, 0.22, 24]} />
      </mesh>
      
      {/* Mid collar */}
      <mesh position={[0, 0.35, 0]}>
        <torusGeometry args={[0.16, 0.018, 10, 28]} />
        <meshStandardMaterial color={goldAccent} emissive={goldAccent} emissiveIntensity={0.5} />
      </mesh>
      
      {/* Tapered stem - upper */}
      <mesh castShadow position={[0, 0.46, 0]} material={material}>
        <cylinderGeometry args={[0.12, 0.16, 0.2, 24]} />
      </mesh>
      
      {/* Neck collar before head */}
      <mesh position={[0, 0.58, 0]}>
        <torusGeometry args={[0.13, 0.015, 10, 26]} />
        <meshStandardMaterial color={innerGlow} emissive={innerGlow} emissiveIntensity={0.7} transparent opacity={0.8} />
      </mesh>
      
      {/* Spherical head - main */}
      <mesh castShadow position={[0, 0.72, 0]} material={material}>
        <sphereGeometry args={[0.16, 32, 32]} />
      </mesh>
      
      {/* Inner glowing core */}
      <mesh position={[0, 0.72, 0]}>
        <sphereGeometry args={[0.08, 20, 20]} />
        <meshStandardMaterial
          color={innerGlow}
          emissive={innerGlow}
          emissiveIntensity={1.5}
          transparent
          opacity={0.85}
        />
      </mesh>
      
      {/* Outer aura shell */}
      <mesh position={[0, 0.72, 0]}>
        <sphereGeometry args={[0.2, 20, 20]} />
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

// ==================== ROOK - MONOLITHIC OBELISK (NOT A TOWER) ====================
export const Rook3D = ({ position, color, isSelected, isHovered, onClick }) => {
  const material = useNeuralMaterial(color, isSelected, isHovered, 'rook');
  const accentColor = color === 'white' ? '#b090ff' : '#bf00ff';
  const secondAccent = color === 'white' ? '#ffffff' : '#ff00bf';
  const goldAccent = '#ffcc00';
  
  return (
    <BasePiece position={position} color={color} isSelected={isSelected} isHovered={isHovered} onClick={onClick} pieceType="rook">
      {/* Wide circular base */}
      <mesh castShadow receiveShadow position={[0, 0.05, 0]} material={material}>
        <cylinderGeometry args={[0.3, 0.36, 0.1, 32]} />
      </mesh>
      
      {/* Base collar ring */}
      <mesh position={[0, 0.11, 0]}>
        <torusGeometry args={[0.28, 0.022, 12, 36]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.65} />
      </mesh>
      
      {/* Main obelisk body - tapered monolith */}
      <mesh castShadow position={[0, 0.42, 0]} material={material}>
        <cylinderGeometry args={[0.2, 0.26, 0.58, 28]} />
      </mesh>
      
      {/* Body accent bands */}
      <mesh position={[0, 0.22, 0]}>
        <torusGeometry args={[0.24, 0.016, 10, 30]} />
        <meshStandardMaterial color={goldAccent} emissive={goldAccent} emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[0, 0.42, 0]}>
        <torusGeometry args={[0.21, 0.014, 10, 28]} />
        <meshStandardMaterial color={secondAccent} emissive={secondAccent} emissiveIntensity={0.55} />
      </mesh>
      <mesh position={[0, 0.58, 0]}>
        <torusGeometry args={[0.205, 0.016, 10, 28]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.6} />
      </mesh>
      
      {/* Crown cap - flat with beveled edge */}
      <mesh castShadow position={[0, 0.76, 0]} material={material}>
        <cylinderGeometry args={[0.24, 0.2, 0.1, 28]} />
      </mesh>
      
      {/* Top collar */}
      <mesh position={[0, 0.82, 0]}>
        <torusGeometry args={[0.22, 0.018, 10, 32]} />
        <meshStandardMaterial color={goldAccent} emissive={goldAccent} emissiveIntensity={0.7} />
      </mesh>
      
      {/* Central neural node on top */}
      <mesh position={[0, 0.9, 0]}>
        <sphereGeometry args={[0.1, 24, 24]} />
        <meshStandardMaterial
          color={goldAccent}
          emissive={goldAccent}
          emissiveIntensity={2}
          metalness={0.95}
          roughness={0.05}
        />
      </mesh>
      
      {/* Inner core glow */}
      <mesh position={[0, 0.9, 0]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial
          color={secondAccent}
          emissive={secondAccent}
          emissiveIntensity={2.5}
        />
      </mesh>
      
      {/* Aura shell */}
      <mesh position={[0, 0.9, 0]}>
        <sphereGeometry args={[0.14, 18, 18]} />
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

// ==================== KNIGHT - SOPHISTICATED NEURAL HORSE ====================
export const Knight3D = ({ position, color, isSelected, isHovered, onClick }) => {
  const material = useNeuralMaterial(color, isSelected, isHovered, 'knight');
  const accentColor = color === 'white' ? '#b090ff' : '#bf00ff';
  const eyeColor = color === 'white' ? '#00ffff' : '#ff0040';
  const goldAccent = '#ffcc00';
  
  return (
    <BasePiece position={position} color={color} isSelected={isSelected} isHovered={isHovered} onClick={onClick} pieceType="knight">
      {/* Wide circular base */}
      <mesh castShadow receiveShadow position={[0, 0.04, 0]} material={material}>
        <cylinderGeometry args={[0.28, 0.32, 0.08, 32]} />
      </mesh>
      
      {/* Base collar ring */}
      <mesh position={[0, 0.09, 0]}>
        <torusGeometry args={[0.26, 0.018, 12, 32]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.6} />
      </mesh>
      
      {/* Body stem */}
      <mesh castShadow position={[0, 0.24, 0]} material={material}>
        <cylinderGeometry args={[0.18, 0.24, 0.28, 24]} />
      </mesh>
      
      {/* Stem accent band */}
      <mesh position={[0, 0.32, 0]}>
        <torusGeometry args={[0.175, 0.014, 10, 28]} />
        <meshStandardMaterial color={goldAccent} emissive={goldAccent} emissiveIntensity={0.55} />
      </mesh>
      
      {/* Neck - curved upward */}
      <mesh castShadow position={[0, 0.48, 0.06]} rotation={[0.35, 0, 0]} material={material}>
        <cylinderGeometry args={[0.14, 0.17, 0.26, 20]} />
      </mesh>
      
      {/* Head base - angled block for horse profile */}
      <mesh castShadow position={[0, 0.65, 0.14]} rotation={[0.5, 0, 0]} material={material}>
        <boxGeometry args={[0.22, 0.32, 0.26]} />
      </mesh>
      
      {/* Muzzle - extended forward */}
      <mesh castShadow position={[0, 0.58, 0.28]} rotation={[0.65, 0, 0]} material={material}>
        <boxGeometry args={[0.14, 0.18, 0.16]} />
      </mesh>
      
      {/* Ears - two triangular protrusions */}
      <mesh castShadow position={[0.07, 0.82, 0.06]} rotation={[-0.2, 0.15, 0.2]} material={material}>
        <coneGeometry args={[0.04, 0.14, 8]} />
      </mesh>
      <mesh castShadow position={[-0.07, 0.82, 0.06]} rotation={[-0.2, -0.15, -0.2]} material={material}>
        <coneGeometry args={[0.04, 0.14, 8]} />
      </mesh>
      
      {/* Mane crest - flowing backward */}
      <mesh castShadow position={[0, 0.78, -0.04]} rotation={[-0.4, 0, 0]} material={material}>
        <boxGeometry args={[0.08, 0.2, 0.12]} />
      </mesh>
      
      {/* Primary eyes - glowing sensors */}
      <mesh position={[0.08, 0.68, 0.24]}>
        <sphereGeometry args={[0.035, 20, 20]} />
        <meshStandardMaterial
          color={eyeColor}
          emissive={eyeColor}
          emissiveIntensity={3}
        />
      </mesh>
      <mesh position={[-0.08, 0.68, 0.24]}>
        <sphereGeometry args={[0.035, 20, 20]} />
        <meshStandardMaterial
          color={eyeColor}
          emissive={eyeColor}
          emissiveIntensity={3}
        />
      </mesh>
      
      {/* Eye glow auras */}
      <mesh position={[0.08, 0.68, 0.24]}>
        <sphereGeometry args={[0.05, 14, 14]} />
        <meshStandardMaterial
          color={eyeColor}
          emissive={eyeColor}
          emissiveIntensity={0.8}
          transparent
          opacity={0.3}
        />
      </mesh>
      <mesh position={[-0.08, 0.68, 0.24]}>
        <sphereGeometry args={[0.05, 14, 14]} />
        <meshStandardMaterial
          color={eyeColor}
          emissive={eyeColor}
          emissiveIntensity={0.8}
          transparent
          opacity={0.3}
        />
      </mesh>
      
      {/* Nostril details */}
      <mesh position={[0.035, 0.52, 0.34]}>
        <sphereGeometry args={[0.02, 12, 12]} />
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={1.5}
        />
      </mesh>
      <mesh position={[-0.035, 0.52, 0.34]}>
        <sphereGeometry args={[0.02, 12, 12]} />
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={1.5}
        />
      </mesh>
    </BasePiece>
  );
};

// ==================== BISHOP - SOPHISTICATED NEURAL MITRE ====================
export const Bishop3D = ({ position, color, isSelected, isHovered, onClick }) => {
  const material = useNeuralMaterial(color, isSelected, isHovered, 'bishop');
  const accentColor = color === 'white' ? '#b090ff' : '#bf00ff';
  const secondAccent = color === 'white' ? '#ffffff' : '#ff00bf';
  const goldAccent = '#ffcc00';
  
  return (
    <BasePiece position={position} color={color} isSelected={isSelected} isHovered={isHovered} onClick={onClick} pieceType="bishop">
      {/* Wide circular base */}
      <mesh castShadow receiveShadow position={[0, 0.04, 0]} material={material}>
        <cylinderGeometry args={[0.28, 0.32, 0.08, 32]} />
      </mesh>
      
      {/* Base collar ring */}
      <mesh position={[0, 0.09, 0]}>
        <torusGeometry args={[0.26, 0.02, 12, 34]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.6} />
      </mesh>
      
      {/* Tapered body - lower */}
      <mesh castShadow position={[0, 0.24, 0]} material={material}>
        <cylinderGeometry args={[0.18, 0.24, 0.26, 24]} />
      </mesh>
      
      {/* Mid collar */}
      <mesh position={[0, 0.38, 0]}>
        <torusGeometry args={[0.165, 0.016, 10, 30]} />
        <meshStandardMaterial color={goldAccent} emissive={goldAccent} emissiveIntensity={0.55} />
      </mesh>
      
      {/* Tapered body - upper */}
      <mesh castShadow position={[0, 0.52, 0]} material={material}>
        <cylinderGeometry args={[0.14, 0.17, 0.26, 24]} />
      </mesh>
      
      {/* Neck collar */}
      <mesh position={[0, 0.66, 0]}>
        <torusGeometry args={[0.135, 0.015, 10, 28]} />
        <meshStandardMaterial color={secondAccent} emissive={secondAccent} emissiveIntensity={0.6} transparent opacity={0.8} />
      </mesh>
      
      {/* Mitre head - dome shape */}
      <mesh castShadow position={[0, 0.78, 0]} material={material}>
        <sphereGeometry args={[0.16, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>
      
      {/* Mitre point - cone top */}
      <mesh castShadow position={[0, 0.94, 0]} material={material}>
        <coneGeometry args={[0.12, 0.22, 20]} />
      </mesh>
      
      {/* Diagonal slit - bishop's signature */}
      <mesh position={[0, 0.84, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
        <boxGeometry args={[0.03, 0.14, 0.12]} />
        <meshStandardMaterial
          color={secondAccent}
          emissive={secondAccent}
          emissiveIntensity={2}
        />
      </mesh>
      
      {/* Tip orb */}
      <mesh position={[0, 1.06, 0]}>
        <sphereGeometry args={[0.045, 20, 20]} />
        <meshStandardMaterial
          color={goldAccent}
          emissive={goldAccent}
          emissiveIntensity={2.5}
        />
      </mesh>
      
      {/* Tip aura */}
      <mesh position={[0, 1.06, 0]}>
        <sphereGeometry args={[0.07, 14, 14]} />
        <meshStandardMaterial
          color={goldAccent}
          emissive={goldAccent}
          emissiveIntensity={0.6}
          transparent
          opacity={0.25}
        />
      </mesh>
    </BasePiece>
  );
};

// ==================== QUEEN - SOPHISTICATED NEURAL EMPRESS ====================
export const Queen3D = ({ position, color, isSelected, isHovered, onClick }) => {
  const material = useNeuralMaterial(color, isSelected, isHovered, 'queen');
  const accentColor = color === 'white' ? '#b090ff' : '#bf00ff';
  const secondAccent = color === 'white' ? '#e0c0ff' : '#ff00bf';
  const goldAccent = '#ffcc00';
  
  return (
    <BasePiece position={position} color={color} isSelected={isSelected} isHovered={isHovered} onClick={onClick} pieceType="queen">
      {/* Grand circular base */}
      <mesh castShadow receiveShadow position={[0, 0.05, 0]} material={material}>
        <cylinderGeometry args={[0.3, 0.36, 0.1, 32]} />
      </mesh>
      
      {/* Base collar ring */}
      <mesh position={[0, 0.11, 0]}>
        <torusGeometry args={[0.28, 0.022, 12, 40]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.7} />
      </mesh>
      
      {/* Tapered body - lower */}
      <mesh castShadow position={[0, 0.28, 0]} material={material}>
        <cylinderGeometry args={[0.2, 0.26, 0.3, 28]} />
      </mesh>
      
      {/* Mid collar */}
      <mesh position={[0, 0.44, 0]}>
        <torusGeometry args={[0.185, 0.018, 10, 34]} />
        <meshStandardMaterial color={goldAccent} emissive={goldAccent} emissiveIntensity={0.6} />
      </mesh>
      
      {/* Tapered body - upper */}
      <mesh castShadow position={[0, 0.58, 0]} material={material}>
        <cylinderGeometry args={[0.16, 0.19, 0.24, 28]} />
      </mesh>
      
      {/* Neck collar */}
      <mesh position={[0, 0.71, 0]}>
        <torusGeometry args={[0.155, 0.016, 10, 32]} />
        <meshStandardMaterial color={secondAccent} emissive={secondAccent} emissiveIntensity={0.55} />
      </mesh>
      
      {/* Crown base band */}
      <mesh castShadow position={[0, 0.78, 0]} material={material}>
        <cylinderGeometry args={[0.18, 0.16, 0.1, 28]} />
      </mesh>
      
      {/* 8 Crown spires */}
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const isLarge = i % 2 === 0;
        const spikeHeight = isLarge ? 0.22 : 0.16;
        return (
          <group key={i}>
            <mesh
              castShadow
              material={material}
              position={[
                Math.cos(angle) * 0.14,
                0.85 + spikeHeight / 2,
                Math.sin(angle) * 0.14
              ]}
            >
              <coneGeometry args={[isLarge ? 0.04 : 0.03, spikeHeight, 12]} />
            </mesh>
            {/* Tip gem */}
            <mesh
              position={[
                Math.cos(angle) * 0.14,
                0.86 + spikeHeight,
                Math.sin(angle) * 0.14
              ]}
            >
              <sphereGeometry args={[isLarge ? 0.025 : 0.018, 14, 14]} />
              <meshStandardMaterial
                color={i % 2 === 0 ? goldAccent : accentColor}
                emissive={i % 2 === 0 ? goldAccent : accentColor}
                emissiveIntensity={2}
              />
            </mesh>
          </group>
        );
      })}
      
      {/* Central supreme orb */}
      <mesh position={[0, 1.0, 0]}>
        <sphereGeometry args={[0.1, 28, 28]} />
        <meshStandardMaterial
          color={goldAccent}
          emissive={goldAccent}
          emissiveIntensity={2.5}
          metalness={0.96}
          roughness={0.04}
        />
      </mesh>
      
      {/* Inner orb glow */}
      <mesh position={[0, 1.0, 0]}>
        <sphereGeometry args={[0.06, 18, 18]} />
        <meshStandardMaterial
          color={secondAccent}
          emissive={secondAccent}
          emissiveIntensity={3}
        />
      </mesh>
      
      {/* Orb aura shell */}
      <mesh position={[0, 1.0, 0]}>
        <sphereGeometry args={[0.14, 20, 20]} />
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={0.5}
          transparent
          opacity={0.2}
        />
      </mesh>
    </BasePiece>
  );
};

// ==================== KING - THE ALPHAZERO SUPREME MASTERY ====================
export const King3D = ({ position, color, isSelected, isHovered, onClick }) => {
  const material = useNeuralMaterial(color, isSelected, isHovered, 'king');
  const accentColor = color === 'white' ? '#b090ff' : '#bf00ff';
  const secondAccent = color === 'white' ? '#ffffff' : '#ff00bf';
  const goldAccent = '#ffcc00';
  const crossColor = '#ffcc00';
  
  return (
    <BasePiece position={position} color={color} isSelected={isSelected} isHovered={isHovered} onClick={onClick} pieceType="king">
      {/* Grand base */}
      <mesh castShadow receiveShadow position={[0, 0.05, 0]} material={material}>
        <cylinderGeometry args={[0.32, 0.38, 0.1, 32]} />
      </mesh>
      
      {/* Base collar ring */}
      <mesh position={[0, 0.11, 0]}>
        <torusGeometry args={[0.3, 0.024, 12, 44]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.7} />
      </mesh>
      
      {/* Tapered body - lower */}
      <mesh castShadow position={[0, 0.28, 0]} material={material}>
        <cylinderGeometry args={[0.22, 0.28, 0.3, 28]} />
      </mesh>
      
      {/* Mid collar */}
      <mesh position={[0, 0.44, 0]}>
        <torusGeometry args={[0.205, 0.018, 10, 36]} />
        <meshStandardMaterial color={goldAccent} emissive={goldAccent} emissiveIntensity={0.6} />
      </mesh>
      
      {/* Tapered body - upper */}
      <mesh castShadow position={[0, 0.58, 0]} material={material}>
        <cylinderGeometry args={[0.18, 0.21, 0.24, 28]} />
      </mesh>
      
      {/* Neck collar */}
      <mesh position={[0, 0.71, 0]}>
        <torusGeometry args={[0.17, 0.016, 10, 34]} />
        <meshStandardMaterial color={secondAccent} emissive={secondAccent} emissiveIntensity={0.6} />
      </mesh>
      
      {/* Crown band */}
      <mesh castShadow position={[0, 0.78, 0]} material={material}>
        <cylinderGeometry args={[0.19, 0.17, 0.1, 28]} />
      </mesh>
      
      {/* Crown band accent */}
      <mesh position={[0, 0.78, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.175, 0.03, 14, 36]} />
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={1}
          metalness={0.96}
          roughness={0.08}
        />
      </mesh>
      
      {/* THE CROSS - King's signature */}
      <group position={[0, 0.95, 0]}>
        {/* Vertical beam */}
        <mesh castShadow>
          <boxGeometry args={[0.06, 0.35, 0.06]} />
          <meshStandardMaterial
            color={crossColor}
            emissive={crossColor}
            emissiveIntensity={2.2}
            metalness={0.96}
            roughness={0.04}
          />
        </mesh>
        {/* Horizontal beam */}
        <mesh castShadow position={[0, 0.08, 0]}>
          <boxGeometry args={[0.22, 0.06, 0.06]} />
          <meshStandardMaterial
            color={crossColor}
            emissive={crossColor}
            emissiveIntensity={2.2}
            metalness={0.96}
            roughness={0.04}
          />
        </mesh>
        
        {/* Cross junction center gem */}
        <mesh position={[0, 0.08, 0]}>
          <sphereGeometry args={[0.045, 20, 20]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={3.5}
          />
        </mesh>
        
        {/* Cross tip gems */}
        <mesh position={[0.11, 0.08, 0]}>
          <sphereGeometry args={[0.025, 14, 14]} />
          <meshStandardMaterial
            color={accentColor}
            emissive={accentColor}
            emissiveIntensity={2}
          />
        </mesh>
        <mesh position={[-0.11, 0.08, 0]}>
          <sphereGeometry args={[0.025, 14, 14]} />
          <meshStandardMaterial
            color={accentColor}
            emissive={accentColor}
            emissiveIntensity={2}
          />
        </mesh>
        <mesh position={[0, 0.175, 0]}>
          <sphereGeometry args={[0.03, 16, 16]} />
          <meshStandardMaterial
            color={secondAccent}
            emissive={secondAccent}
            emissiveIntensity={2.5}
          />
        </mesh>
      </group>
      
      {/* Cross aura */}
      <mesh position={[0, 0.98, 0]}>
        <sphereGeometry args={[0.22, 22, 22]} />
        <meshStandardMaterial
          color={crossColor}
          emissive={crossColor}
          emissiveIntensity={0.5}
          transparent
          opacity={0.18}
        />
      </mesh>
      <mesh position={[0, 0.98, 0]}>
        <sphereGeometry args={[0.28, 18, 18]} />
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
