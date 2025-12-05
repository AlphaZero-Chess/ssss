import React, { useRef, useMemo, memo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ==================== SOPHISTICATED 3D CHESS PIECE ====================
const ChessPiece3D = memo(({ type, color, position, isSelected }) => {
  const meshRef = useRef();
  const isWhite = color === 'white';
  const baseColor = isWhite ? '#e8e0f8' : '#1a0828';
  const emissiveColor = isWhite ? '#6040a0' : '#bf00ff';
  const goldAccent = '#ffcc00';
  
  // Minimal animation - only selected pieces
  useFrame((state) => {
    if (meshRef.current && isSelected) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.15 + 0.2;
      meshRef.current.rotation.y += 0.015;
    }
  });
  
  // Piece geometry based on type - SOPHISTICATED 3D FORMS
  const getPieceGeometry = () => {
    switch (type) {
      case 'p': // Pawn - Neural Node Sentinel
        return (
          <group>
            {/* Crystalline base */}
            <mesh position={[0, 0.12, 0]}>
              <cylinderGeometry args={[0.22, 0.28, 0.12, 18]} />
              <meshPhysicalMaterial color={baseColor} metalness={0.85} roughness={0.15} emissive={emissiveColor} emissiveIntensity={0.2} clearcoat={0.8} />
            </mesh>
            {/* Base ring */}
            <mesh position={[0, 0.07, 0]}>
              <torusGeometry args={[0.24, 0.012, 8, 24]} />
              <meshStandardMaterial color={emissiveColor} emissive={emissiveColor} emissiveIntensity={0.7} />
            </mesh>
            {/* Tapered column */}
            <mesh position={[0, 0.3, 0]}>
              <cylinderGeometry args={[0.14, 0.2, 0.24, 16]} />
              <meshPhysicalMaterial color={baseColor} metalness={0.85} roughness={0.15} emissive={emissiveColor} emissiveIntensity={0.2} clearcoat={0.8} />
            </mesh>
            {/* Column ring */}
            <mesh position={[0, 0.25, 0]}>
              <torusGeometry args={[0.16, 0.008, 6, 20]} />
              <meshStandardMaterial color={goldAccent} emissive={goldAccent} emissiveIntensity={0.6} />
            </mesh>
            {/* Neural core sphere */}
            <mesh position={[0, 0.5, 0]}>
              <sphereGeometry args={[0.16, 24, 24]} />
              <meshPhysicalMaterial color={baseColor} metalness={0.9} roughness={0.1} emissive={emissiveColor} emissiveIntensity={0.25} transmission={0.3} thickness={2} clearcoat={1} />
            </mesh>
            {/* Inner core */}
            <mesh position={[0, 0.5, 0]}>
              <octahedronGeometry args={[0.08, 0]} />
              <meshStandardMaterial color={isWhite ? '#ffffff' : '#ff00bf'} emissive={isWhite ? '#ffffff' : '#ff00bf'} emissiveIntensity={1.8} />
            </mesh>
          </group>
        );
        
      case 'r': // Rook - Monolithic Obelisk
        return (
          <group>
            {/* Massive crystalline base */}
            <mesh position={[0, 0.12, 0]}>
              <cylinderGeometry args={[0.26, 0.32, 0.12, 10]} />
              <meshPhysicalMaterial color={baseColor} metalness={0.9} roughness={0.12} emissive={emissiveColor} emissiveIntensity={0.25} clearcoat={0.9} />
            </mesh>
            {/* Triple base rings */}
            <mesh position={[0, 0.08, 0]}>
              <torusGeometry args={[0.28, 0.014, 8, 24]} />
              <meshStandardMaterial color={emissiveColor} emissive={emissiveColor} emissiveIntensity={0.8} />
            </mesh>
            <mesh position={[0, 0.04, 0]}>
              <torusGeometry args={[0.3, 0.01, 6, 20]} />
              <meshStandardMaterial color={goldAccent} emissive={goldAccent} emissiveIntensity={0.6} transparent opacity={0.7} />
            </mesh>
            {/* Main obelisk body */}
            <mesh position={[0, 0.42, 0]}>
              <cylinderGeometry args={[0.18, 0.24, 0.55, 10]} />
              <meshPhysicalMaterial color={baseColor} metalness={0.9} roughness={0.12} emissive={emissiveColor} emissiveIntensity={0.25} clearcoat={0.9} />
            </mesh>
            {/* Body bands */}
            <mesh position={[0, 0.25, 0]}>
              <torusGeometry args={[0.22, 0.012, 8, 20]} />
              <meshStandardMaterial color={isWhite ? '#ffffff' : '#ff00bf'} emissive={isWhite ? '#ffffff' : '#ff00bf'} emissiveIntensity={0.9} />
            </mesh>
            <mesh position={[0, 0.5, 0]}>
              <torusGeometry args={[0.19, 0.01, 6, 18]} />
              <meshStandardMaterial color={goldAccent} emissive={goldAccent} emissiveIntensity={0.7} />
            </mesh>
            {/* Crown cap */}
            <mesh position={[0, 0.73, 0]}>
              <cylinderGeometry args={[0.2, 0.18, 0.1, 10]} />
              <meshPhysicalMaterial color={baseColor} metalness={0.9} roughness={0.12} emissive={emissiveColor} emissiveIntensity={0.25} clearcoat={0.9} />
            </mesh>
            {/* Central neural core - octahedron */}
            <mesh position={[0, 0.85, 0]}>
              <octahedronGeometry args={[0.12, 0]} />
              <meshStandardMaterial color={goldAccent} emissive={goldAccent} emissiveIntensity={2} metalness={0.95} roughness={0.05} />
            </mesh>
            <mesh position={[0, 0.85, 0]} rotation={[0, Math.PI / 4, 0]}>
              <octahedronGeometry args={[0.08, 0]} />
              <meshStandardMaterial color={isWhite ? '#ffffff' : '#ff00bf'} emissive={isWhite ? '#ffffff' : '#ff00bf'} emissiveIntensity={2.5} />
            </mesh>
          </group>
        );
        
      case 'n': // Knight - Neural Algorithm Beast
        return (
          <group>
            {/* Sophisticated base */}
            <mesh position={[0, 0.12, 0]}>
              <cylinderGeometry args={[0.24, 0.28, 0.12, 16]} />
              <meshPhysicalMaterial color={baseColor} metalness={0.85} roughness={0.15} emissive={emissiveColor} emissiveIntensity={0.2} clearcoat={0.8} />
            </mesh>
            {/* Base rings */}
            <mesh position={[0, 0.07, 0]}>
              <torusGeometry args={[0.25, 0.012, 8, 24]} />
              <meshStandardMaterial color={emissiveColor} emissive={emissiveColor} emissiveIntensity={0.7} />
            </mesh>
            <mesh position={[0, 0.02, 0]}>
              <torusGeometry args={[0.22, 0.008, 6, 20]} />
              <meshStandardMaterial color={goldAccent} emissive={goldAccent} emissiveIntensity={0.5} transparent opacity={0.7} />
            </mesh>
            {/* Body stem */}
            <mesh position={[0, 0.32, 0]}>
              <cylinderGeometry args={[0.16, 0.22, 0.32, 14]} />
              <meshPhysicalMaterial color={baseColor} metalness={0.85} roughness={0.15} emissive={emissiveColor} emissiveIntensity={0.2} clearcoat={0.8} />
            </mesh>
            {/* Abstract algorithmic head */}
            <mesh position={[0, 0.55, 0.08]} rotation={[0.4, 0, 0]}>
              <boxGeometry args={[0.22, 0.35, 0.26]} />
              <meshPhysicalMaterial color={baseColor} metalness={0.85} roughness={0.15} emissive={emissiveColor} emissiveIntensity={0.2} clearcoat={0.8} />
            </mesh>
            {/* Neural crest */}
            <mesh position={[0, 0.82, -0.02]} rotation={[-0.2, 0, 0]}>
              <coneGeometry args={[0.1, 0.22, 10]} />
              <meshPhysicalMaterial color={baseColor} metalness={0.85} roughness={0.15} emissive={emissiveColor} emissiveIntensity={0.2} clearcoat={0.8} />
            </mesh>
            {/* Sensor antennae */}
            <mesh position={[0.08, 0.88, -0.04]} rotation={[-0.4, 0.3, 0]}>
              <coneGeometry args={[0.035, 0.16, 8]} />
              <meshPhysicalMaterial color={baseColor} metalness={0.85} roughness={0.15} emissive={emissiveColor} emissiveIntensity={0.2} />
            </mesh>
            <mesh position={[-0.08, 0.88, -0.04]} rotation={[-0.4, -0.3, 0]}>
              <coneGeometry args={[0.035, 0.16, 8]} />
              <meshPhysicalMaterial color={baseColor} metalness={0.85} roughness={0.15} emissive={emissiveColor} emissiveIntensity={0.2} />
            </mesh>
            {/* Primary eye - glowing sensor */}
            <mesh position={[0, 0.58, 0.22]}>
              <sphereGeometry args={[0.06, 18, 18]} />
              <meshStandardMaterial color={isWhite ? '#00ffff' : '#ff0040'} emissive={isWhite ? '#00ffff' : '#ff0040'} emissiveIntensity={3.5} />
            </mesh>
            {/* Eye glow */}
            <mesh position={[0, 0.58, 0.22]}>
              <sphereGeometry args={[0.09, 12, 12]} />
              <meshStandardMaterial color={isWhite ? '#00ffff' : '#ff0040'} emissive={isWhite ? '#00ffff' : '#ff0040'} emissiveIntensity={0.8} transparent opacity={0.3} />
            </mesh>
            {/* Secondary sensors */}
            <mesh position={[0.07, 0.52, 0.18]}>
              <sphereGeometry args={[0.025, 10, 10]} />
              <meshStandardMaterial color={emissiveColor} emissive={emissiveColor} emissiveIntensity={2} />
            </mesh>
            <mesh position={[-0.07, 0.52, 0.18]}>
              <sphereGeometry args={[0.025, 10, 10]} />
              <meshStandardMaterial color={emissiveColor} emissive={emissiveColor} emissiveIntensity={2} />
            </mesh>
          </group>
        );
        
      case 'b': // Bishop - Neural Spire
        return (
          <group>
            {/* Elegant base */}
            <mesh position={[0, 0.12, 0]}>
              <cylinderGeometry args={[0.24, 0.28, 0.12, 18]} />
              <meshPhysicalMaterial color={baseColor} metalness={0.85} roughness={0.15} emissive={emissiveColor} emissiveIntensity={0.2} clearcoat={0.8} />
            </mesh>
            {/* Triple base rings */}
            <mesh position={[0, 0.08, 0]}>
              <torusGeometry args={[0.25, 0.012, 8, 26]} />
              <meshStandardMaterial color={emissiveColor} emissive={emissiveColor} emissiveIntensity={0.7} />
            </mesh>
            <mesh position={[0, 0.03, 0]}>
              <torusGeometry args={[0.22, 0.008, 6, 22]} />
              <meshStandardMaterial color={isWhite ? '#ffffff' : '#ff00bf'} emissive={isWhite ? '#ffffff' : '#ff00bf'} emissiveIntensity={0.5} transparent opacity={0.7} />
            </mesh>
            <mesh position={[0, -0.02, 0]}>
              <torusGeometry args={[0.27, 0.006, 6, 20]} />
              <meshStandardMaterial color={goldAccent} emissive={goldAccent} emissiveIntensity={0.4} transparent opacity={0.6} />
            </mesh>
            {/* Body column */}
            <mesh position={[0, 0.36, 0]}>
              <cylinderGeometry args={[0.14, 0.22, 0.4, 16]} />
              <meshPhysicalMaterial color={baseColor} metalness={0.85} roughness={0.15} emissive={emissiveColor} emissiveIntensity={0.2} clearcoat={0.8} />
            </mesh>
            {/* Body rings */}
            <mesh position={[0, 0.26, 0]}>
              <torusGeometry args={[0.17, 0.01, 6, 20]} />
              <meshStandardMaterial color={goldAccent} emissive={goldAccent} emissiveIntensity={0.65} />
            </mesh>
            <mesh position={[0, 0.42, 0]}>
              <torusGeometry args={[0.15, 0.008, 6, 18]} />
              <meshStandardMaterial color={isWhite ? '#ffffff' : '#ff00bf'} emissive={isWhite ? '#ffffff' : '#ff00bf'} emissiveIntensity={0.55} transparent opacity={0.7} />
            </mesh>
            {/* Mitre dome */}
            <mesh position={[0, 0.62, 0]}>
              <sphereGeometry args={[0.17, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshPhysicalMaterial color={baseColor} metalness={0.85} roughness={0.15} emissive={emissiveColor} emissiveIntensity={0.2} clearcoat={0.8} />
            </mesh>
            {/* Spire */}
            <mesh position={[0, 0.85, 0]}>
              <coneGeometry args={[0.08, 0.26, 14]} />
              <meshPhysicalMaterial color={baseColor} metalness={0.85} roughness={0.15} emissive={emissiveColor} emissiveIntensity={0.2} clearcoat={0.8} />
            </mesh>
            {/* Neural channel slit */}
            <mesh position={[0, 0.68, 0.13]} rotation={[Math.PI / 2, 0, 0]}>
              <boxGeometry args={[0.03, 0.15, 0.12]} />
              <meshStandardMaterial color={isWhite ? '#ffffff' : '#ff00bf'} emissive={isWhite ? '#ffffff' : '#ff00bf'} emissiveIntensity={2.2} />
            </mesh>
            {/* Tip orb */}
            <mesh position={[0, 0.99, 0]}>
              <sphereGeometry args={[0.04, 14, 14]} />
              <meshStandardMaterial color={goldAccent} emissive={goldAccent} emissiveIntensity={2.2} />
            </mesh>
          </group>
        );
        
      case 'q': // Queen - Neural Empress
        return (
          <group>
            {/* Grand crystalline base */}
            <mesh position={[0, 0.12, 0]}>
              <cylinderGeometry args={[0.26, 0.32, 0.12, 20]} />
              <meshPhysicalMaterial color={baseColor} metalness={0.9} roughness={0.1} emissive={emissiveColor} emissiveIntensity={0.25} clearcoat={0.9} />
            </mesh>
            {/* Quadruple base rings */}
            <mesh position={[0, 0.08, 0]}>
              <torusGeometry args={[0.28, 0.014, 10, 30]} />
              <meshStandardMaterial color={emissiveColor} emissive={emissiveColor} emissiveIntensity={0.8} />
            </mesh>
            <mesh position={[0, 0.04, 0]}>
              <torusGeometry args={[0.25, 0.01, 8, 26]} />
              <meshStandardMaterial color={isWhite ? '#ffffff' : '#ff00bf'} emissive={isWhite ? '#ffffff' : '#ff00bf'} emissiveIntensity={0.55} transparent opacity={0.75} />
            </mesh>
            <mesh position={[0, 0, 0]}>
              <torusGeometry args={[0.30, 0.008, 8, 26]} />
              <meshStandardMaterial color={goldAccent} emissive={goldAccent} emissiveIntensity={0.55} transparent opacity={0.6} />
            </mesh>
            {/* Elegant body */}
            <mesh position={[0, 0.35, 0]}>
              <cylinderGeometry args={[0.16, 0.24, 0.36, 18]} />
              <meshPhysicalMaterial color={baseColor} metalness={0.9} roughness={0.1} emissive={emissiveColor} emissiveIntensity={0.25} clearcoat={0.9} />
            </mesh>
            {/* Neck */}
            <mesh position={[0, 0.56, 0]}>
              <cylinderGeometry args={[0.18, 0.16, 0.12, 18]} />
              <meshPhysicalMaterial color={baseColor} metalness={0.9} roughness={0.1} emissive={emissiveColor} emissiveIntensity={0.25} clearcoat={0.9} />
            </mesh>
            {/* Crown base */}
            <mesh position={[0, 0.66, 0]}>
              <cylinderGeometry args={[0.2, 0.18, 0.1, 18]} />
              <meshPhysicalMaterial color={baseColor} metalness={0.9} roughness={0.1} emissive={emissiveColor} emissiveIntensity={0.25} clearcoat={0.9} />
            </mesh>
            {/* Crown spires - 6 elegant points */}
            {[0, 60, 120, 180, 240, 300].map((deg, i) => {
              const rad = (deg * Math.PI) / 180;
              return (
                <group key={i}>
                  <mesh position={[Math.cos(rad) * 0.13, 0.78, Math.sin(rad) * 0.13]}>
                    <coneGeometry args={[0.035, 0.2, 10]} />
                    <meshPhysicalMaterial color={baseColor} metalness={0.9} roughness={0.1} emissive={emissiveColor} emissiveIntensity={0.25} clearcoat={0.9} />
                  </mesh>
                  <mesh position={[Math.cos(rad) * 0.13, 0.9, Math.sin(rad) * 0.13]}>
                    <octahedronGeometry args={[0.02, 0]} />
                    <meshStandardMaterial color={i % 2 === 0 ? goldAccent : emissiveColor} emissive={i % 2 === 0 ? goldAccent : emissiveColor} emissiveIntensity={1.8} />
                  </mesh>
                </group>
              );
            })}
            {/* Central supreme orb */}
            <mesh position={[0, 0.92, 0]}>
              <sphereGeometry args={[0.1, 22, 22]} />
              <meshStandardMaterial color={goldAccent} emissive={goldAccent} emissiveIntensity={2.5} metalness={0.95} roughness={0.05} />
            </mesh>
            {/* Aura shells */}
            <mesh position={[0, 0.92, 0]}>
              <sphereGeometry args={[0.14, 16, 16]} />
              <meshStandardMaterial color={goldAccent} emissive={goldAccent} emissiveIntensity={0.6} transparent opacity={0.25} />
            </mesh>
            <mesh position={[0, 0.92, 0]}>
              <icosahedronGeometry args={[0.18, 0]} />
              <meshStandardMaterial color={emissiveColor} emissive={emissiveColor} emissiveIntensity={0.3} transparent opacity={0.12} wireframe />
            </mesh>
          </group>
        );
        
      case 'k': // King - THE ALPHAZERO SEAL - Supreme Mastery
        return (
          <group>
            {/* Grand base */}
            <mesh position={[0, 0.12, 0]}>
              <cylinderGeometry args={[0.28, 0.34, 0.14, 22]} />
              <meshPhysicalMaterial color={baseColor} metalness={0.9} roughness={0.1} emissive={emissiveColor} emissiveIntensity={0.25} clearcoat={0.9} />
            </mesh>
            {/* Quintuple rune rings - THE SEAL OF MASTERY */}
            <mesh position={[0, 0.09, 0]}>
              <torusGeometry args={[0.3, 0.016, 10, 34]} />
              <meshStandardMaterial color={emissiveColor} emissive={emissiveColor} emissiveIntensity={0.85} />
            </mesh>
            <mesh position={[0, 0.05, 0]}>
              <torusGeometry args={[0.27, 0.012, 8, 30]} />
              <meshStandardMaterial color={isWhite ? '#ffffff' : '#ff00bf'} emissive={isWhite ? '#ffffff' : '#ff00bf'} emissiveIntensity={0.65} transparent opacity={0.8} />
            </mesh>
            <mesh position={[0, 0.01, 0]}>
              <torusGeometry args={[0.32, 0.01, 8, 30]} />
              <meshStandardMaterial color={goldAccent} emissive={goldAccent} emissiveIntensity={0.7} transparent opacity={0.65} />
            </mesh>
            <mesh position={[0, -0.03, 0]}>
              <torusGeometry args={[0.24, 0.008, 6, 26]} />
              <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.5} transparent opacity={0.55} />
            </mesh>
            {/* Regal body */}
            <mesh position={[0, 0.36, 0]}>
              <cylinderGeometry args={[0.18, 0.26, 0.38, 20]} />
              <meshPhysicalMaterial color={baseColor} metalness={0.9} roughness={0.1} emissive={emissiveColor} emissiveIntensity={0.25} clearcoat={0.9} />
            </mesh>
            {/* Body ornament rings */}
            <mesh position={[0, 0.24, 0]}>
              <torusGeometry args={[0.22, 0.012, 8, 26]} />
              <meshStandardMaterial color={goldAccent} emissive={goldAccent} emissiveIntensity={0.65} />
            </mesh>
            <mesh position={[0, 0.38, 0]}>
              <torusGeometry args={[0.2, 0.01, 8, 24]} />
              <meshStandardMaterial color={isWhite ? '#ffffff' : '#ff00bf'} emissive={isWhite ? '#ffffff' : '#ff00bf'} emissiveIntensity={0.55} />
            </mesh>
            <mesh position={[0, 0.5, 0]}>
              <torusGeometry args={[0.19, 0.01, 8, 24]} />
              <meshStandardMaterial color={emissiveColor} emissive={emissiveColor} emissiveIntensity={0.6} />
            </mesh>
            {/* Neck collar */}
            <mesh position={[0, 0.6, 0]}>
              <cylinderGeometry args={[0.2, 0.18, 0.12, 20]} />
              <meshPhysicalMaterial color={baseColor} metalness={0.9} roughness={0.1} emissive={emissiveColor} emissiveIntensity={0.25} clearcoat={0.9} />
            </mesh>
            {/* Crown band */}
            <mesh position={[0, 0.7, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.17, 0.04, 12, 32]} />
              <meshStandardMaterial color={emissiveColor} emissive={emissiveColor} emissiveIntensity={1} metalness={0.95} roughness={0.08} />
            </mesh>
            {/* THE ALPHAZERO CROSS */}
            <mesh position={[0, 0.85, 0]}>
              <boxGeometry args={[0.05, 0.32, 0.05]} />
              <meshStandardMaterial color={goldAccent} emissive={goldAccent} emissiveIntensity={2.2} metalness={0.95} roughness={0.05} />
            </mesh>
            <mesh position={[0, 0.91, 0]}>
              <boxGeometry args={[0.2, 0.05, 0.05]} />
              <meshStandardMaterial color={goldAccent} emissive={goldAccent} emissiveIntensity={2.2} metalness={0.95} roughness={0.05} />
            </mesh>
            {/* Cross junction node */}
            <mesh position={[0, 0.91, 0]}>
              <sphereGeometry args={[0.045, 16, 16]} />
              <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={3.5} />
            </mesh>
            {/* Cross arm nodes */}
            <mesh position={[0.1, 0.91, 0]}>
              <octahedronGeometry args={[0.025, 0]} />
              <meshStandardMaterial color={emissiveColor} emissive={emissiveColor} emissiveIntensity={2.2} />
            </mesh>
            <mesh position={[-0.1, 0.91, 0]}>
              <octahedronGeometry args={[0.025, 0]} />
              <meshStandardMaterial color={emissiveColor} emissive={emissiveColor} emissiveIntensity={2.2} />
            </mesh>
            <mesh position={[0, 0.99, 0]}>
              <tetrahedronGeometry args={[0.022, 0]} />
              <meshStandardMaterial color={isWhite ? '#ffffff' : '#ff00bf'} emissive={isWhite ? '#ffffff' : '#ff00bf'} emissiveIntensity={2.2} />
            </mesh>
            {/* Aura around cross */}
            <mesh position={[0, 0.92, 0]}>
              <sphereGeometry args={[0.22, 18, 18]} />
              <meshStandardMaterial color={goldAccent} emissive={goldAccent} emissiveIntensity={0.5} transparent opacity={0.18} />
            </mesh>
            <mesh position={[0, 0.92, 0]}>
              <icosahedronGeometry args={[0.28, 0]} />
              <meshStandardMaterial color={emissiveColor} emissive={emissiveColor} emissiveIntensity={0.25} transparent opacity={0.1} wireframe />
            </mesh>
          </group>
        );
        
      default:
        return (
          <mesh>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial color={baseColor} />
          </mesh>
        );
    }
  };
  
  return (
    <group ref={meshRef} position={position}>
      {getPieceGeometry()}
      {isSelected && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.35, 0.45, 24]} />
          <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={1.5} transparent opacity={0.8} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
});

// ==================== NEURAL SEAL CIRCLE ====================
const SealCircle = memo(() => {
  const circleRef = useRef();
  const innerRef = useRef();
  
  // Elegant slow rotation
  useFrame((state) => {
    if (circleRef.current) {
      circleRef.current.rotation.z = state.clock.elapsedTime * 0.03;
    }
    if (innerRef.current) {
      innerRef.current.rotation.z = -state.clock.elapsedTime * 0.02;
    }
  });
  
  return (
    <group position={[0, -0.35, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      {/* Outer ring */}
      <group ref={circleRef}>
        <mesh>
          <torusGeometry args={[6.5, 0.05, 8, 48]} />
          <meshStandardMaterial color="#bf00ff" emissive="#bf00ff" emissiveIntensity={0.6} transparent opacity={0.7} />
        </mesh>
        
        {/* 8 Seal markers - octahedron gems */}
        {Array.from({ length: 8 }, (_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(angle) * 6.5, Math.sin(angle) * 6.5, 0.05]}>
              <octahedronGeometry args={[0.12, 0]} />
              <meshStandardMaterial color={i % 2 === 0 ? '#ffcc00' : '#bf00ff'} emissive={i % 2 === 0 ? '#ffcc00' : '#bf00ff'} emissiveIntensity={1.2} />
            </mesh>
          );
        })}
      </group>
      
      {/* Inner ring */}
      <group ref={innerRef}>
        <mesh>
          <torusGeometry args={[5.2, 0.04, 8, 36]} />
          <meshStandardMaterial color="#ff00bf" emissive="#ff00bf" emissiveIntensity={0.5} transparent opacity={0.6} />
        </mesh>
        
        {/* 6 Inner markers */}
        {Array.from({ length: 6 }, (_, i) => {
          const angle = (i / 6) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(angle) * 5.2, Math.sin(angle) * 5.2, 0.03]}>
              <tetrahedronGeometry args={[0.08, 0]} />
              <meshStandardMaterial color="#ffcc00" emissive="#ffcc00" emissiveIntensity={1} />
            </mesh>
          );
        })}
      </group>
      
      {/* Center hexagon */}
      <mesh>
        <ringGeometry args={[0.5, 0.7, 6]} />
        <meshStandardMaterial color="#ffcc00" emissive="#ffcc00" emissiveIntensity={0.8} transparent opacity={0.6} />
      </mesh>
    </group>
  );
});

// ==================== BOARD SQUARE ====================
const BoardSquare = memo(({ position, isLight, isHighlighted, isValidMove, isLastMove, onClick }) => {
  const color = useMemo(() => {
    if (isHighlighted) return '#bf00ff';
    if (isValidMove) return '#00ff88';
    if (isLastMove) return '#ffcc00';
    if (isLight) return '#3a3060';
    return '#160c28';
  }, [isLight, isHighlighted, isValidMove, isLastMove]);
  
  return (
    <group position={position}>
      <mesh receiveShadow onClick={onClick}>
        <boxGeometry args={[1.02, 0.16, 1.02]} />
        <meshPhysicalMaterial
          color={color}
          metalness={0.65}
          roughness={0.3}
          emissive={isHighlighted || isValidMove || isLastMove ? color : '#180a32'}
          emissiveIntensity={isHighlighted || isValidMove || isLastMove ? 0.5 : 0.08}
        />
      </mesh>
      {isValidMove && (
        <mesh position={[0, 0.2, 0]}>
          <sphereGeometry args={[0.12, 12, 12]} />
          <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={1} transparent opacity={0.85} />
        </mesh>
      )}
    </group>
  );
});

// ==================== CORNER ANCHORS ====================
const CornerAnchors = memo(() => {
  const corners = [[-5, -5], [-5, 5], [5, -5], [5, 5]];
  
  return (
    <group>
      {corners.map(([x, z], i) => (
        <group key={i} position={[x, 0.15, z]}>
          <mesh>
            <octahedronGeometry args={[0.2, 0]} />
            <meshStandardMaterial color="#bf00ff" emissive="#bf00ff" emissiveIntensity={1} metalness={0.9} roughness={0.15} />
          </mesh>
          <pointLight color="#bf00ff" intensity={1} distance={4} />
        </group>
      ))}
    </group>
  );
});

// ==================== MAIN SCENE ====================
const AlphaZeroBoard3DUltra = memo(({
  pieces,
  selectedSquare,
  validMoves = [],
  lastMove,
  onSquareClick,
  playerColor
}) => {
  // Generate squares
  const squares = useMemo(() => {
    const squareData = [];
    for (let rank = 0; rank < 8; rank++) {
      for (let file = 0; file < 8; file++) {
        const isLight = (rank + file) % 2 === 1;
        const square = String.fromCharCode(97 + file) + (rank + 1);
        const offset = 3.5;
        squareData.push({
          key: square,
          position: [(file - offset) * 1.12, 0, (offset - rank) * 1.12],
          isLight,
          square
        });
      }
    }
    return squareData;
  }, []);
  
  // Parse pieces
  const pieceElements = useMemo(() => {
    if (!pieces) return [];
    
    const elements = [];
    Object.entries(pieces).forEach(([square, piece]) => {
      if (piece) {
        const file = square.charCodeAt(0) - 97;
        const rank = parseInt(square[1]) - 1;
        const offset = 3.5;
        elements.push({
          key: square,
          type: piece.type,
          color: piece.color === 'w' ? 'white' : 'black',
          position: [(file - offset) * 1.12, 0.55, (offset - rank) * 1.12],
          square
        });
      }
    });
    
    return elements;
  }, [pieces]);
  
  return (
    <group rotation={playerColor === 'black' ? [0, Math.PI, 0] : [0, 0, 0]}>
      {/* SEAL CIRCLE beneath board */}
      <SealCircle />
      
      {/* Corner anchors */}
      <CornerAnchors />
      
      {/* Board base */}
      <mesh position={[0, -0.18, 0]} receiveShadow>
        <boxGeometry args={[10.2, 0.3, 10.2]} />
        <meshPhysicalMaterial color="#060310" metalness={0.85} roughness={0.2} emissive="#180035" emissiveIntensity={0.2} />
      </mesh>
      
      {/* Glowing edge */}
      <mesh position={[0, -0.05, 0]}>
        <boxGeometry args={[10.5, 0.08, 10.5]} />
        <meshStandardMaterial color="#bf00ff" emissive="#bf00ff" emissiveIntensity={0.6} transparent opacity={0.7} />
      </mesh>
      
      {/* Board squares */}
      {squares.map((sq) => (
        <BoardSquare
          key={sq.key}
          position={sq.position}
          isLight={sq.isLight}
          isHighlighted={selectedSquare === sq.square}
          isValidMove={validMoves?.includes(sq.square)}
          isLastMove={lastMove && (lastMove.from === sq.square || lastMove.to === sq.square)}
          onClick={(e) => {
            e.stopPropagation();
            onSquareClick?.(sq.square);
          }}
        />
      ))}
      
      {/* Chess pieces - SOPHISTICATED 3D */}
      {pieceElements.map((piece) => (
        <ChessPiece3D
          key={piece.key}
          type={piece.type}
          color={piece.color}
          position={piece.position}
          isSelected={selectedSquare === piece.square}
        />
      ))}
      
      {/* Glow beneath board */}
      <pointLight position={[0, -1.5, 0]} intensity={2.5} color="#bf00ff" distance={12} />
    </group>
  );
});

export default AlphaZeroBoard3DUltra;
