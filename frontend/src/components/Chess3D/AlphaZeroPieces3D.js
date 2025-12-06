import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Elder Futhark Runes - Sacred symbols of mastery
const RUNES = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ', 'ᛁ', 'ᛃ', 'ᛇ', 'ᛈ', 'ᛉ', 'ᛋ', 'ᛏ', 'ᛒ', 'ᛖ', 'ᛗ', 'ᛚ', 'ᛜ', 'ᛞ', 'ᛟ'];

// ==================== ULTRA-SOPHISTICATED NEURAL MATERIAL ====================
const useNeuralMaterial = (color, isSelected = false, isHovered = false, pieceType = 'default') => {
  return useMemo(() => {
    const isWhite = color === 'white';
    
    // Deep crystalline colors with extreme sophistication
    const baseColor = isWhite ? '#e8e0f8' : '#060308';
    const emissiveColor = isWhite ? '#9060ff' : '#bf00ff';
    
    return new THREE.MeshPhysicalMaterial({
      color: baseColor,
      metalness: 0.95,
      roughness: 0.02,
      transmission: isWhite ? 0.42 : 0.25,
      thickness: 4,
      envMapIntensity: 3,
      clearcoat: 1,
      clearcoatRoughness: 0.01,
      ior: 2.8,
      reflectivity: 1,
      emissive: emissiveColor,
      emissiveIntensity: isSelected ? 2 : isHovered ? 1.1 : 0.4,
      transparent: true,
      opacity: 0.98,
      sheen: 1,
      sheenRoughness: 0.15,
      sheenColor: new THREE.Color(isWhite ? '#d8c8ff' : '#ff00bf'),
      attenuationColor: new THREE.Color(isWhite ? '#c8b8ff' : '#500080'),
      attenuationDistance: 0.3,
    });
  }, [color, isSelected, isHovered]);
};

// ==================== BADASS CHAIN LINK - SEAL STYLE ====================
const SealChainLink = ({ position, rotation, scale = 1, color, glowIntensity = 1 }) => {
  const linkRef = useRef();
  
  useFrame((state) => {
    if (linkRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 4 + position[0] + position[2]) * 0.3 + 0.7;
      linkRef.current.material.emissiveIntensity = pulse * glowIntensity;
    }
  });
  
  return (
    <group position={position} rotation={rotation} scale={[scale, scale, scale]}>
      {/* Primary chain torus */}
      <mesh ref={linkRef}>
        <torusGeometry args={[0.05, 0.018, 12, 20]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.9}
          metalness={0.98}
          roughness={0.08}
        />
      </mesh>
      {/* Inner detail ring */}
      <mesh>
        <torusGeometry args={[0.035, 0.006, 8, 16]} />
        <meshStandardMaterial
          color="#ffcc00"
          emissive="#ffcc00"
          emissiveIntensity={1.2}
          transparent
          opacity={0.7}
        />
      </mesh>
    </group>
  );
};

// ==================== ULTRA-SOPHISTICATED CHAIN SYSTEM (SEAL OF THE HIDDEN MASTER) ====================
const SealChainSystem = ({ position, color, count = 8, intensity = 1.2 }) => {
  const chainsRef = useRef();
  
  const chains = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2;
      const baseLength = 0.7 + Math.random() * 0.6;
      const links = [];
      const linkCount = 8 + Math.floor(Math.random() * 5);
      
      for (let j = 0; j < linkCount; j++) {
        const t = j / linkCount;
        const r = 0.25 + t * baseLength;
        // Create spiral chain pattern
        const spiralAngle = angle + t * Math.PI * 0.5;
        links.push({
          pos: [
            Math.cos(spiralAngle) * r,
            0.18 + Math.sin(t * Math.PI) * 0.4 + Math.sin(t * Math.PI * 3) * 0.1,
            Math.sin(spiralAngle) * r
          ],
          rot: [Math.PI / 2 + t * 0.5, spiralAngle + j * 0.4, t * 0.3],
          scale: 0.75 + Math.sin(t * Math.PI) * 0.5
        });
      }
      
      return {
        angle,
        links,
        phase: Math.random() * Math.PI * 2,
        speed: 0.35 + Math.random() * 0.35
      };
    });
  }, [count]);
  
  useFrame((state) => {
    if (chainsRef.current) {
      chainsRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });
  
  const chainColor = color === 'white' ? '#a070ff' : '#bf00ff';
  const secondaryColor = color === 'white' ? '#ffcc00' : '#ff00bf';
  
  return (
    <group ref={chainsRef}>
      {chains.map((chain, i) => (
        <group key={i}>
          {chain.links.map((link, j) => (
            <SealChainLink
              key={j}
              position={link.pos}
              rotation={link.rot}
              scale={link.scale}
              color={j % 3 === 0 ? chainColor : j % 3 === 1 ? secondaryColor : '#ffcc00'}
              glowIntensity={intensity}
            />
          ))}
          {/* Chain connection energy tube */}
          {(() => {
            const points = chain.links.map(l => new THREE.Vector3(...l.pos));
            if (points.length > 2) {
              const curve = new THREE.CatmullRomCurve3(points);
              return (
                <mesh>
                  <tubeGeometry args={[curve, 32, 0.012, 8, false]} />
                  <meshStandardMaterial
                    color={chainColor}
                    emissive={chainColor}
                    emissiveIntensity={0.8}
                    transparent
                    opacity={0.45}
                  />
                </mesh>
              );
            }
            return null;
          })()}
        </group>
      ))}
      {/* Central binding seal */}
      <mesh position={[0, 0.2, 0]}>
        <octahedronGeometry args={[0.08, 0]} />
        <meshStandardMaterial
          color="#ffcc00"
          emissive="#ffcc00"
          emissiveIntensity={2.5}
        />
      </mesh>
    </group>
  );
};

// ==================== RUNE ENGRAVING RING SYSTEM ====================
const RuneEngravingRing = ({ radius, height, color, emissive, runeCount = 10, speed = 0.4 }) => {
  const ringRef = useRef();
  const runesRef = useRef();
  const innerRef = useRef();
  
  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.y = state.clock.elapsedTime * speed;
    }
    if (runesRef.current) {
      runesRef.current.rotation.y = -state.clock.elapsedTime * speed * 1.3;
    }
    if (innerRef.current) {
      innerRef.current.rotation.y = state.clock.elapsedTime * speed * 0.7;
    }
  });
  
  return (
    <group>
      {/* Main ring with runic pattern */}
      <group ref={ringRef}>
        <mesh>
          <torusGeometry args={[radius, 0.022, 12, 64]} />
          <meshStandardMaterial
            color={color}
            emissive={emissive}
            emissiveIntensity={1.1}
            metalness={0.96}
            roughness={0.08}
          />
        </mesh>
        
        {/* Inner detail ring */}
        <mesh>
          <torusGeometry args={[radius * 0.88, 0.01, 8, 48]} />
          <meshStandardMaterial
            color={emissive}
            emissive={emissive}
            emissiveIntensity={1.5}
            metalness={0.92}
            roughness={0.12}
            transparent
            opacity={0.85}
          />
        </mesh>
        
        {/* Outer detail ring */}
        <mesh>
          <torusGeometry args={[radius * 1.12, 0.008, 8, 48]} />
          <meshStandardMaterial
            color="#ffcc00"
            emissive="#ffcc00"
            emissiveIntensity={0.9}
            transparent
            opacity={0.7}
          />
        </mesh>
      </group>
      
      {/* Rune markers orbiting - octahedron gems */}
      <group ref={runesRef}>
        {Array.from({ length: runeCount }, (_, i) => {
          const angle = (i / runeCount) * Math.PI * 2;
          const isSpecial = i % 3 === 0;
          return (
            <group key={i}>
              <mesh
                position={[
                  Math.cos(angle) * radius,
                  0,
                  Math.sin(angle) * radius
                ]}
              >
                <octahedronGeometry args={[isSpecial ? 0.04 : 0.025, 0]} />
                <meshStandardMaterial
                  color={isSpecial ? '#ffcc00' : '#ff00bf'}
                  emissive={isSpecial ? '#ffcc00' : '#ff00bf'}
                  emissiveIntensity={isSpecial ? 2.2 : 1.5}
                />
              </mesh>
              {/* Connecting line to center */}
              {isSpecial && (
                <mesh>
                  <cylinderGeometry args={[0.003, 0.003, radius, 6]} />
                  <meshStandardMaterial
                    color="#ffcc00"
                    emissive="#ffcc00"
                    emissiveIntensity={0.6}
                    transparent
                    opacity={0.3}
                  />
                </mesh>
              )}
            </group>
          );
        })}
      </group>
      
      {/* Inner rotating pattern */}
      <group ref={innerRef}>
        {Array.from({ length: 4 }, (_, i) => {
          const angle = (i / 4) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[
                Math.cos(angle) * radius * 0.5,
                0,
                Math.sin(angle) * radius * 0.5
              ]}
            >
              <tetrahedronGeometry args={[0.02, 0]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={1.8}
              />
            </mesh>
          );
        })}
      </group>
    </group>
  );
};

// ==================== SOPHISTICATED BASE PIECE COMPONENT ====================
const BasePiece = ({ children, position, color, isSelected, isHovered, onClick, pieceType = 'default' }) => {
  const groupRef = useRef();
  const floatOffset = useRef(Math.random() * Math.PI * 2);
  const glowRef = useRef();
  const secondaryGlowRef = useRef();
  const tertiaryGlowRef = useRef();
  
  useFrame((state) => {
    if (groupRef.current) {
      const baseY = position[1];
      const floatAmount = isSelected ? 0.6 : 0.15;
      const speed = isSelected ? 3.5 : 1.2;
      groupRef.current.position.y = baseY + Math.sin(state.clock.elapsedTime * speed + floatOffset.current) * floatAmount;
      
      if (isSelected) {
        groupRef.current.rotation.y += 0.015;
      }
    }
    
    if (glowRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 4) * 0.5 + 0.5;
      glowRef.current.intensity = isSelected ? 5 + pulse * 4 : isHovered ? 3 + pulse * 2 : 1.5 + pulse * 0.6;
    }
    
    if (secondaryGlowRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 5 + 1) * 0.5 + 0.5;
      secondaryGlowRef.current.intensity = isSelected ? 4 + pulse * 2.5 : isHovered ? 2 + pulse * 1.2 : 0.7 + pulse * 0.4;
    }
    
    if (tertiaryGlowRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 6 + 2) * 0.5 + 0.5;
      tertiaryGlowRef.current.intensity = isSelected ? 2.5 + pulse * 1.5 : isHovered ? 1 + pulse * 0.6 : 0.3 + pulse * 0.2;
    }
  });
  
  const glowColor = color === 'white' ? '#b090ff' : '#bf00ff';
  const secondaryGlow = color === 'white' ? '#ffffff' : '#ff00bf';
  const tertiaryGlow = color === 'white' ? '#e0c0ff' : '#ff40bf';
  const goldGlow = '#ffcc00';
  
  return (
    <group
      ref={groupRef}
      position={position}
      onClick={onClick}
      onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { document.body.style.cursor = 'default'; }}
    >
      {children}
      
      {/* BADASS SEAL CHAINS on selected pieces */}
      {isSelected && <SealChainSystem position={position} color={color} count={10} intensity={1.5} />}
      
      {/* Triple rune rings around selected piece - THE SEAL */}
      {isSelected && (
        <group position={[0, 0.2, 0]}>
          <RuneEngravingRing radius={0.65} height={0.02} color={glowColor} emissive={tertiaryGlow} runeCount={14} speed={0.5} />
          <group position={[0, 0.06, 0]}>
            <RuneEngravingRing radius={0.52} height={0.015} color={secondaryGlow} emissive={goldGlow} runeCount={10} speed={-0.4} />
          </group>
          <group position={[0, 0.12, 0]}>
            <RuneEngravingRing radius={0.4} height={0.01} color={goldGlow} emissive={glowColor} runeCount={6} speed={0.6} />
          </group>
        </group>
      )}
      
      {/* Hovering shows subtle seal effect */}
      {isHovered && !isSelected && (
        <group position={[0, 0.12, 0]}>
          <mesh>
            <torusGeometry args={[0.48, 0.015, 8, 36]} />
            <meshStandardMaterial
              color={glowColor}
              emissive={glowColor}
              emissiveIntensity={0.8}
              transparent
              opacity={0.55}
            />
          </mesh>
          <mesh>
            <torusGeometry args={[0.38, 0.008, 6, 28]} />
            <meshStandardMaterial
              color={goldGlow}
              emissive={goldGlow}
              emissiveIntensity={0.6}
              transparent
              opacity={0.4}
            />
          </mesh>
        </group>
      )}
      
      {/* Primary neural glow */}
      <pointLight
        ref={glowRef}
        position={[0, 0.6, 0]}
        intensity={isSelected ? 6 : isHovered ? 3 : 1.5}
        distance={isSelected ? 6 : 4}
        color={glowColor}
      />
      
      {/* Secondary accent glow */}
      <pointLight
        ref={secondaryGlowRef}
        position={[0, 1, 0]}
        intensity={isSelected ? 4 : isHovered ? 2 : 0.7}
        distance={isSelected ? 4.5 : 2.5}
        color={secondaryGlow}
      />
      
      {/* Tertiary base glow */}
      <pointLight
        ref={tertiaryGlowRef}
        position={[0, 0, 0]}
        intensity={isSelected ? 2.5 : isHovered ? 1 : 0.3}
        distance={2.5}
        color={goldGlow}
      />
    </group>
  );
};

// ==================== PAWN - NEURAL NODE SENTINEL ====================
export const Pawn3D = ({ position, color, isSelected, isHovered, onClick }) => {
  const material = useNeuralMaterial(color, isSelected, isHovered, 'pawn');
  const accentColor = color === 'white' ? '#b090ff' : '#bf00ff';
  const innerGlow = color === 'white' ? '#ffffff' : '#ff00bf';
  const goldAccent = '#ffcc00';
  
  return (
    <BasePiece position={position} color={color} isSelected={isSelected} isHovered={isHovered} onClick={onClick} pieceType="pawn">
      {/* Complex crystalline base */}
      <mesh castShadow receiveShadow material={material}>
        <cylinderGeometry args={[0.26, 0.32, 0.16, 28]} />
      </mesh>
      
      {/* Quadruple rune rings on base */}
      <mesh position={[0, 0.07, 0]}>
        <torusGeometry args={[0.28, 0.014, 8, 36]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.75} />
      </mesh>
      <mesh position={[0, 0.03, 0]}>
        <torusGeometry args={[0.24, 0.01, 6, 28]} />
        <meshStandardMaterial color={innerGlow} emissive={innerGlow} emissiveIntensity={0.9} transparent opacity={0.75} />
      </mesh>
      <mesh position={[0, -0.01, 0]}>
        <torusGeometry args={[0.30, 0.008, 6, 28]} />
        <meshStandardMaterial color={goldAccent} emissive={goldAccent} emissiveIntensity={0.6} transparent opacity={0.55} />
      </mesh>
      
      {/* Tapered neural column */}
      <mesh position={[0, 0.28, 0]} castShadow material={material}>
        <cylinderGeometry args={[0.17, 0.22, 0.36, 20]} />
      </mesh>
      
      {/* Column groove rings */}
      <mesh position={[0, 0.2, 0]}>
        <torusGeometry args={[0.19, 0.008, 6, 24]} />
        <meshStandardMaterial color={goldAccent} emissive={goldAccent} emissiveIntensity={0.65} transparent opacity={0.6} />
      </mesh>
      <mesh position={[0, 0.32, 0]}>
        <torusGeometry args={[0.175, 0.008, 6, 24]} />
        <meshStandardMaterial color={innerGlow} emissive={innerGlow} emissiveIntensity={0.6} transparent opacity={0.65} />
      </mesh>
      
      {/* Neural core sphere - crystalline */}
      <mesh position={[0, 0.56, 0]} castShadow material={material}>
        <sphereGeometry args={[0.2, 36, 36]} />
      </mesh>
      
      {/* Inner glowing neural core - octahedron */}
      <mesh position={[0, 0.56, 0]}>
        <octahedronGeometry args={[0.1, 0]} />
        <meshStandardMaterial
          color={innerGlow}
          emissive={innerGlow}
          emissiveIntensity={2}
          transparent
          opacity={0.92}
        />
      </mesh>
      
      {/* Outer aura shells */}
      <mesh position={[0, 0.56, 0]}>
        <sphereGeometry args={[0.25, 20, 20]} />
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={0.35}
          transparent
          opacity={0.18}
        />
      </mesh>
      <mesh position={[0, 0.56, 0]}>
        <icosahedronGeometry args={[0.28, 0]} />
        <meshStandardMaterial
          color={goldAccent}
          emissive={goldAccent}
          emissiveIntensity={0.25}
          transparent
          opacity={0.12}
          wireframe
        />
      </mesh>
    </BasePiece>
  );
};

// ==================== ROOK - MONOLITHIC OBELISK (NO TOWER/CASTLE) ====================
export const Rook3D = ({ position, color, isSelected, isHovered, onClick }) => {
  const material = useNeuralMaterial(color, isSelected, isHovered, 'rook');
  const accentColor = color === 'white' ? '#b090ff' : '#bf00ff';
  const secondAccent = color === 'white' ? '#ffffff' : '#ff00bf';
  const goldAccent = '#ffcc00';
  const cyanAccent = '#00ffff';
  
  return (
    <BasePiece position={position} color={color} isSelected={isSelected} isHovered={isHovered} onClick={onClick} pieceType="rook">
      {/* Massive crystalline base - 12 sided */}
      <mesh castShadow receiveShadow material={material}>
        <cylinderGeometry args={[0.32, 0.38, 0.16, 12]} />
      </mesh>
      
      {/* Quintuple base rings - THE SEAL */}
      <mesh position={[0, 0.07, 0]}>
        <torusGeometry args={[0.34, 0.018, 10, 28]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[0, 0.03, 0]}>
        <torusGeometry args={[0.30, 0.012, 8, 24]} />
        <meshStandardMaterial color={secondAccent} emissive={secondAccent} emissiveIntensity={0.6} transparent opacity={0.75} />
      </mesh>
      <mesh position={[0, -0.01, 0]}>
        <torusGeometry args={[0.36, 0.01, 8, 24]} />
        <meshStandardMaterial color={goldAccent} emissive={goldAccent} emissiveIntensity={0.7} transparent opacity={0.6} />
      </mesh>
      <mesh position={[0, -0.05, 0]}>
        <torusGeometry args={[0.26, 0.008, 6, 20]} />
        <meshStandardMaterial color={cyanAccent} emissive={cyanAccent} emissiveIntensity={0.5} transparent opacity={0.5} />
      </mesh>
      
      {/* Main obelisk body - CLEAN MONOLITH */}
      <mesh position={[0, 0.42, 0]} castShadow material={material}>
        <cylinderGeometry args={[0.22, 0.28, 0.65, 12]} />
      </mesh>
      
      {/* Triple runic bands on body */}
      <mesh position={[0, 0.22, 0]}>
        <torusGeometry args={[0.26, 0.016, 10, 24]} />
        <meshStandardMaterial color={secondAccent} emissive={secondAccent} emissiveIntensity={0.9} />
      </mesh>
      <mesh position={[0, 0.42, 0]}>
        <torusGeometry args={[0.23, 0.012, 8, 22]} />
        <meshStandardMaterial color={goldAccent} emissive={goldAccent} emissiveIntensity={0.75} />
      </mesh>
      <mesh position={[0, 0.58, 0]}>
        <torusGeometry args={[0.225, 0.014, 10, 24]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.8} />
      </mesh>
      
      {/* Crown cap - flat neural */}
      <mesh position={[0, 0.78, 0]} castShadow material={material}>
        <cylinderGeometry args={[0.24, 0.22, 0.12, 12]} />
      </mesh>
      
      {/* Central neural core - double octahedron */}
      <mesh position={[0, 0.9, 0]}>
        <octahedronGeometry args={[0.14, 0]} />
        <meshStandardMaterial
          color={goldAccent}
          emissive={goldAccent}
          emissiveIntensity={2.2}
          metalness={0.97}
          roughness={0.03}
        />
      </mesh>
      <mesh position={[0, 0.9, 0]} rotation={[0, Math.PI / 4, 0]}>
        <octahedronGeometry args={[0.1, 0]} />
        <meshStandardMaterial
          color={secondAccent}
          emissive={secondAccent}
          emissiveIntensity={3}
        />
      </mesh>
      
      {/* Octahedron aura layers */}
      <mesh position={[0, 0.9, 0]}>
        <octahedronGeometry args={[0.18, 0]} />
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={0.5}
          transparent
          opacity={0.22}
        />
      </mesh>
      <mesh position={[0, 0.9, 0]}>
        <icosahedronGeometry args={[0.22, 0]} />
        <meshStandardMaterial
          color={goldAccent}
          emissive={goldAccent}
          emissiveIntensity={0.3}
          transparent
          opacity={0.15}
          wireframe
        />
      </mesh>
    </BasePiece>
  );
};

// ==================== KNIGHT - NEURAL ALGORITHM BEAST ====================
export const Knight3D = ({ position, color, isSelected, isHovered, onClick }) => {
  const material = useNeuralMaterial(color, isSelected, isHovered, 'knight');
  const accentColor = color === 'white' ? '#b090ff' : '#bf00ff';
  const eyeColor = color === 'white' ? '#00ffff' : '#ff0040';
  const goldAccent = '#ffcc00';
  const secondAccent = color === 'white' ? '#ffffff' : '#ff00bf';
  
  return (
    <BasePiece position={position} color={color} isSelected={isSelected} isHovered={isHovered} onClick={onClick} pieceType="knight">
      {/* Sophisticated base */}
      <mesh castShadow receiveShadow material={material}>
        <cylinderGeometry args={[0.28, 0.32, 0.16, 20]} />
      </mesh>
      
      {/* Base rings */}
      <mesh position={[0, 0.07, 0]}>
        <torusGeometry args={[0.29, 0.014, 10, 32]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.7} />
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <torusGeometry args={[0.25, 0.01, 8, 28]} />
        <meshStandardMaterial color={goldAccent} emissive={goldAccent} emissiveIntensity={0.55} transparent opacity={0.7} />
      </mesh>
      
      {/* Body stem */}
      <mesh position={[0, 0.32, 0]} castShadow material={material}>
        <cylinderGeometry args={[0.19, 0.24, 0.4, 18]} />
      </mesh>
      
      {/* Abstract algorithmic head - complex faceted */}
      <mesh position={[0, 0.6, 0.1]} rotation={[0.45, 0, 0]} castShadow material={material}>
        <boxGeometry args={[0.26, 0.4, 0.32]} />
      </mesh>
      
      {/* Neural crest - double cone */}
      <mesh position={[0, 0.88, -0.02]} rotation={[-0.22, 0, 0]} castShadow material={material}>
        <coneGeometry args={[0.12, 0.26, 10]} />
      </mesh>
      <mesh position={[0, 0.78, -0.06]} rotation={[0.2, 0, 0]} castShadow material={material}>
        <coneGeometry args={[0.06, 0.12, 8]} />
      </mesh>
      
      {/* Sensor antennae - neural receivers */}
      <mesh position={[0.1, 0.92, -0.04]} rotation={[-0.45, 0.35, 0]} castShadow material={material}>
        <coneGeometry args={[0.045, 0.2, 8]} />
      </mesh>
      <mesh position={[-0.1, 0.92, -0.04]} rotation={[-0.45, -0.35, 0]} castShadow material={material}>
        <coneGeometry args={[0.045, 0.2, 8]} />
      </mesh>
      
      {/* Primary eye - glowing sensor core */}
      <mesh position={[0, 0.62, 0.24]}>
        <sphereGeometry args={[0.07, 24, 24]} />
        <meshStandardMaterial
          color={eyeColor}
          emissive={eyeColor}
          emissiveIntensity={4}
        />
      </mesh>
      {/* Eye glow aura */}
      <mesh position={[0, 0.62, 0.24]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial
          color={eyeColor}
          emissive={eyeColor}
          emissiveIntensity={1}
          transparent
          opacity={0.3}
        />
      </mesh>
      
      {/* Secondary sensor eyes */}
      <mesh position={[0.09, 0.55, 0.2]}>
        <sphereGeometry args={[0.03, 14, 14]} />
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={2.5}
        />
      </mesh>
      <mesh position={[-0.09, 0.55, 0.2]}>
        <sphereGeometry args={[0.03, 14, 14]} />
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={2.5}
        />
      </mesh>
      
      {/* Muzzle detail */}
      <mesh position={[0, 0.48, 0.22]}>
        <boxGeometry args={[0.08, 0.04, 0.06]} />
        <meshStandardMaterial
          color={goldAccent}
          emissive={goldAccent}
          emissiveIntensity={1.2}
        />
      </mesh>
    </BasePiece>
  );
};

// ==================== BISHOP - NEURAL SPIRE ====================
export const Bishop3D = ({ position, color, isSelected, isHovered, onClick }) => {
  const material = useNeuralMaterial(color, isSelected, isHovered, 'bishop');
  const accentColor = color === 'white' ? '#b090ff' : '#bf00ff';
  const secondAccent = color === 'white' ? '#ffffff' : '#ff00bf';
  const goldAccent = '#ffcc00';
  
  return (
    <BasePiece position={position} color={color} isSelected={isSelected} isHovered={isHovered} onClick={onClick} pieceType="bishop">
      {/* Elegant base */}
      <mesh castShadow receiveShadow material={material}>
        <cylinderGeometry args={[0.28, 0.32, 0.16, 22]} />
      </mesh>
      
      {/* Triple base rings */}
      <mesh position={[0, 0.07, 0]}>
        <torusGeometry args={[0.29, 0.014, 10, 34]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.7} />
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <torusGeometry args={[0.25, 0.01, 8, 28]} />
        <meshStandardMaterial color={secondAccent} emissive={secondAccent} emissiveIntensity={0.55} transparent opacity={0.75} />
      </mesh>
      <mesh position={[0, -0.02, 0]}>
        <torusGeometry args={[0.30, 0.008, 6, 26]} />
        <meshStandardMaterial color={goldAccent} emissive={goldAccent} emissiveIntensity={0.5} transparent opacity={0.6} />
      </mesh>
      
      {/* Body column */}
      <mesh position={[0, 0.36, 0]} castShadow material={material}>
        <cylinderGeometry args={[0.17, 0.24, 0.5, 20]} />
      </mesh>
      
      {/* Body groove rings */}
      <mesh position={[0, 0.25, 0]}>
        <torusGeometry args={[0.2, 0.012, 8, 26]} />
        <meshStandardMaterial color={goldAccent} emissive={goldAccent} emissiveIntensity={0.7} />
      </mesh>
      <mesh position={[0, 0.42, 0]}>
        <torusGeometry args={[0.175, 0.01, 8, 24]} />
        <meshStandardMaterial color={secondAccent} emissive={secondAccent} emissiveIntensity={0.6} transparent opacity={0.7} />
      </mesh>
      
      {/* Mitre dome - crystalline */}
      <mesh position={[0, 0.68, 0]} castShadow material={material}>
        <sphereGeometry args={[0.2, 36, 36, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>
      
      {/* Spire with detail */}
      <mesh position={[0, 0.92, 0]} castShadow material={material}>
        <coneGeometry args={[0.1, 0.3, 18]} />
      </mesh>
      
      {/* Neural channel slit - glowing */}
      <mesh position={[0, 0.74, 0.15]} rotation={[Math.PI / 2, 0, 0]}>
        <boxGeometry args={[0.035, 0.18, 0.16]} />
        <meshStandardMaterial
          color={secondAccent}
          emissive={secondAccent}
          emissiveIntensity={2.5}
        />
      </mesh>
      
      {/* Tip orb with aura */}
      <mesh position={[0, 1.08, 0]}>
        <sphereGeometry args={[0.05, 20, 20]} />
        <meshStandardMaterial
          color={goldAccent}
          emissive={goldAccent}
          emissiveIntensity={2.5}
        />
      </mesh>
      <mesh position={[0, 1.08, 0]}>
        <sphereGeometry args={[0.08, 12, 12]} />
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

// ==================== QUEEN - NEURAL EMPRESS ====================
export const Queen3D = ({ position, color, isSelected, isHovered, onClick }) => {
  const material = useNeuralMaterial(color, isSelected, isHovered, 'queen');
  const accentColor = color === 'white' ? '#b090ff' : '#bf00ff';
  const secondAccent = color === 'white' ? '#e0c0ff' : '#ff00bf';
  const goldAccent = '#ffcc00';
  const cyanAccent = '#00ffff';
  
  return (
    <BasePiece position={position} color={color} isSelected={isSelected} isHovered={isHovered} onClick={onClick} pieceType="queen">
      {/* Grand crystalline base */}
      <mesh castShadow receiveShadow material={material}>
        <cylinderGeometry args={[0.3, 0.36, 0.16, 24]} />
      </mesh>
      
      {/* Quadruple base rings */}
      <mesh position={[0, 0.07, 0]}>
        <torusGeometry args={[0.32, 0.016, 10, 40]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[0, 0.03, 0]}>
        <torusGeometry args={[0.28, 0.012, 8, 32]} />
        <meshStandardMaterial color={secondAccent} emissive={secondAccent} emissiveIntensity={0.6} transparent opacity={0.75} />
      </mesh>
      <mesh position={[0, -0.01, 0]}>
        <torusGeometry args={[0.34, 0.01, 8, 32]} />
        <meshStandardMaterial color={goldAccent} emissive={goldAccent} emissiveIntensity={0.6} transparent opacity={0.6} />
      </mesh>
      <mesh position={[0, -0.05, 0]}>
        <torusGeometry args={[0.24, 0.008, 6, 28]} />
        <meshStandardMaterial color={cyanAccent} emissive={cyanAccent} emissiveIntensity={0.4} transparent opacity={0.5} />
      </mesh>
      
      {/* Elegant body */}
      <mesh position={[0, 0.32, 0]} castShadow material={material}>
        <cylinderGeometry args={[0.2, 0.26, 0.4, 24]} />
      </mesh>
      
      {/* Neck */}
      <mesh position={[0, 0.56, 0]} castShadow material={material}>
        <cylinderGeometry args={[0.22, 0.2, 0.14, 24]} />
      </mesh>
      
      {/* Crown base */}
      <mesh position={[0, 0.68, 0]} castShadow material={material}>
        <cylinderGeometry args={[0.24, 0.22, 0.12, 24]} />
      </mesh>
      
      {/* Neural crown spires - 8 elegant points */}
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <group key={i}>
            <mesh
              position={[
                Math.cos(angle) * 0.16,
                0.82,
                Math.sin(angle) * 0.16
              ]}
              castShadow
              material={material}
            >
              <coneGeometry args={[0.04, 0.24, 10]} />
            </mesh>
            {/* Tip gems */}
            <mesh
              position={[
                Math.cos(angle) * 0.16,
                0.96,
                Math.sin(angle) * 0.16
              ]}
            >
              <octahedronGeometry args={[0.025, 0]} />
              <meshStandardMaterial
                color={i % 2 === 0 ? goldAccent : accentColor}
                emissive={i % 2 === 0 ? goldAccent : accentColor}
                emissiveIntensity={2}
              />
            </mesh>
          </group>
        );
      })}
      
      {/* Central neural orb - supreme */}
      <mesh position={[0, 0.98, 0]}>
        <sphereGeometry args={[0.12, 32, 32]} />
        <meshStandardMaterial
          color={goldAccent}
          emissive={goldAccent}
          emissiveIntensity={3}
          metalness={0.97}
          roughness={0.03}
        />
      </mesh>
      
      {/* Triple aura shells */}
      <mesh position={[0, 0.98, 0]}>
        <sphereGeometry args={[0.16, 24, 24]} />
        <meshStandardMaterial
          color={goldAccent}
          emissive={goldAccent}
          emissiveIntensity={0.7}
          transparent
          opacity={0.28}
        />
      </mesh>
      <mesh position={[0, 0.98, 0]}>
        <sphereGeometry args={[0.2, 20, 20]} />
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={0.4}
          transparent
          opacity={0.15}
        />
      </mesh>
      <mesh position={[0, 0.98, 0]}>
        <icosahedronGeometry args={[0.24, 0]} />
        <meshStandardMaterial
          color={secondAccent}
          emissive={secondAccent}
          emissiveIntensity={0.25}
          transparent
          opacity={0.1}
          wireframe
        />
      </mesh>
    </BasePiece>
  );
};

// ==================== KING - THE ALPHAZERO SEAL - SUPREME MASTERY ====================
export const King3D = ({ position, color, isSelected, isHovered, onClick }) => {
  const material = useNeuralMaterial(color, isSelected, isHovered, 'king');
  const accentColor = color === 'white' ? '#b090ff' : '#bf00ff';
  const secondAccent = color === 'white' ? '#ffffff' : '#ff00bf';
  const goldAccent = '#ffcc00';
  const crossColor = '#ffcc00';
  const cyanAccent = '#00ffff';
  
  return (
    <BasePiece position={position} color={color} isSelected={isSelected} isHovered={isHovered} onClick={onClick} pieceType="king">
      {/* Grand base with seal engravings */}
      <mesh castShadow receiveShadow material={material}>
        <cylinderGeometry args={[0.32, 0.4, 0.18, 28]} />
      </mesh>
      
      {/* Quintuple rune rings - THE SEAL OF MASTERY */}
      <mesh position={[0, 0.08, 0]}>
        <torusGeometry args={[0.35, 0.02, 12, 44]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.9} />
      </mesh>
      <mesh position={[0, 0.04, 0]}>
        <torusGeometry args={[0.31, 0.014, 10, 36]} />
        <meshStandardMaterial color={secondAccent} emissive={secondAccent} emissiveIntensity={0.7} transparent opacity={0.85} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[0.38, 0.012, 8, 36]} />
        <meshStandardMaterial color={goldAccent} emissive={goldAccent} emissiveIntensity={0.8} transparent opacity={0.7} />
      </mesh>
      <mesh position={[0, -0.04, 0]}>
        <torusGeometry args={[0.27, 0.01, 8, 32]} />
        <meshStandardMaterial color={cyanAccent} emissive={cyanAccent} emissiveIntensity={0.55} transparent opacity={0.6} />
      </mesh>
      <mesh position={[0, -0.08, 0]}>
        <torusGeometry args={[0.42, 0.008, 6, 32]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.45} transparent opacity={0.5} />
      </mesh>
      
      {/* Regal body */}
      <mesh position={[0, 0.36, 0]} castShadow material={material}>
        <cylinderGeometry args={[0.22, 0.28, 0.42, 24]} />
      </mesh>
      
      {/* Body ornament rings */}
      <mesh position={[0, 0.22, 0]}>
        <torusGeometry args={[0.25, 0.014, 10, 32]} />
        <meshStandardMaterial color={goldAccent} emissive={goldAccent} emissiveIntensity={0.7} />
      </mesh>
      <mesh position={[0, 0.35, 0]}>
        <torusGeometry args={[0.23, 0.012, 10, 30]} />
        <meshStandardMaterial color={secondAccent} emissive={secondAccent} emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[0, 0.48, 0]}>
        <torusGeometry args={[0.225, 0.012, 10, 30]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.65} />
      </mesh>
      
      {/* Neck collar */}
      <mesh position={[0, 0.62, 0]} castShadow material={material}>
        <cylinderGeometry args={[0.24, 0.22, 0.14, 24]} />
      </mesh>
      
      {/* Crown band with runic engravings */}
      <mesh position={[0, 0.72, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.2, 0.05, 16, 40]} />
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={1.2}
          metalness={0.97}
          roughness={0.08}
        />
      </mesh>
      
      {/* THE ALPHAZERO CROSS - Neural Symbol of Supreme Mastery */}
      <group position={[0, 0.92, 0]}>
        {/* Vertical beam - crystalline */}
        <mesh castShadow>
          <boxGeometry args={[0.07, 0.4, 0.07]} />
          <meshStandardMaterial
            color={crossColor}
            emissive={crossColor}
            emissiveIntensity={2.5}
            metalness={0.97}
            roughness={0.03}
          />
        </mesh>
        {/* Horizontal beam */}
        <mesh position={[0, 0.1, 0]} castShadow>
          <boxGeometry args={[0.26, 0.07, 0.07]} />
          <meshStandardMaterial
            color={crossColor}
            emissive={crossColor}
            emissiveIntensity={2.5}
            metalness={0.97}
            roughness={0.03}
          />
        </mesh>
        
        {/* Cross junction orbs - NEURAL NODES */}
        <mesh position={[0, 0.1, 0]}>
          <sphereGeometry args={[0.055, 20, 20]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={4}
          />
        </mesh>
        <mesh position={[0.13, 0.1, 0]}>
          <octahedronGeometry args={[0.03, 0]} />
          <meshStandardMaterial
            color={accentColor}
            emissive={accentColor}
            emissiveIntensity={2.5}
          />
        </mesh>
        <mesh position={[-0.13, 0.1, 0]}>
          <octahedronGeometry args={[0.03, 0]} />
          <meshStandardMaterial
            color={accentColor}
            emissive={accentColor}
            emissiveIntensity={2.5}
          />
        </mesh>
        <mesh position={[0, 0.2, 0]}>
          <tetrahedronGeometry args={[0.028, 0]} />
          <meshStandardMaterial
            color={secondAccent}
            emissive={secondAccent}
            emissiveIntensity={2.5}
          />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <tetrahedronGeometry args={[0.025, 0]} />
          <meshStandardMaterial
            color={cyanAccent}
            emissive={cyanAccent}
            emissiveIntensity={2}
          />
        </mesh>
      </group>
      
      {/* Neural aura around cross - THE SEAL GLOW */}
      <mesh position={[0, 0.95, 0]}>
        <sphereGeometry args={[0.26, 24, 24]} />
        <meshStandardMaterial
          color={crossColor}
          emissive={crossColor}
          emissiveIntensity={0.6}
          transparent
          opacity={0.2}
        />
      </mesh>
      <mesh position={[0, 0.95, 0]}>
        <sphereGeometry args={[0.32, 20, 20]} />
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={0.35}
          transparent
          opacity={0.12}
        />
      </mesh>
      <mesh position={[0, 0.95, 0]}>
        <icosahedronGeometry args={[0.38, 0]} />
        <meshStandardMaterial
          color={secondAccent}
          emissive={secondAccent}
          emissiveIntensity={0.2}
          transparent
          opacity={0.08}
          wireframe
        />
      </mesh>
    </BasePiece>
  );
};

// ==================== PIECE FACTORY ====================
export const AlphaZeroPiece3D = ({ type, color, position, isSelected, isHovered, onClick, playerColor }) => {
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
  
  // When playing as Black, the board rotates 180°, so pieces need to counter-rotate
  // to face the player correctly
  const pieceRotation = playerColor === 'black' ? [0, Math.PI, 0] : [0, 0, 0];
  
  return (
    <group rotation={pieceRotation}>
      <PieceComponent
        position={position}
        color={color}
        isSelected={isSelected}
        isHovered={isHovered}
        onClick={onClick}
      />
    </group>
  );
};

export default AlphaZeroPiece3D;
