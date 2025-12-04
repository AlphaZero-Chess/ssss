import React, { useRef, useMemo, memo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

// ==================== RUNE SYMBOLS - Matching HiddenMasterLock ====================
const RUNES = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ', 'ᛁ', 'ᛃ', 'ᛇ', 'ᛈ', 'ᛉ', 'ᛋ', 'ᛏ', 'ᛒ', 'ᛖ', 'ᛗ', 'ᛚ', 'ᛜ', 'ᛞ', 'ᛟ'];
const ALPHA_PURPLE = '#bf00ff';
const ALPHA_PINK = '#ff00bf';
const ALPHA_GOLD = '#ffcc00';

// ==================== SOPHISTICATED 3D PIECE COMPONENT ====================
const ChessPiece3D = memo(({ type, color, position, isSelected }) => {
  const meshRef = useRef();
  const runeRef = useRef();
  const isWhite = color === 'white';
  const baseColor = isWhite ? '#e8e0f8' : '#1a0828';
  const accentColor = isWhite ? '#a080d0' : '#bf00ff';
  const emissiveColor = isWhite ? '#6040a0' : '#bf00ff';
  const goldAccent = '#ffcc00';
  
  // Piece rune mapping
  const pieceRunes = { 'k': 'ᛟ', 'q': 'ᛞ', 'r': 'ᛏ', 'b': 'ᛒ', 'n': 'ᛖ', 'p': 'ᚠ' };
  const pieceRune = pieceRunes[type] || 'ᚨ';
  
  // Animation for selected pieces
  useFrame((state) => {
    if (meshRef.current && isSelected) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.15 + 0.2;
      meshRef.current.rotation.y += 0.015;
    }
    if (runeRef.current) {
      runeRef.current.material.emissiveIntensity = 0.5 + Math.sin(state.clock.elapsedTime * 3) * 0.3;
    }
  });
  
  // Create sophisticated rune engravings ring
  const RuneEngravingRing = ({ radius, y, count = 6 }) => (
    <group position={[0, y, 0]}>
      {Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2;
        return (
          <Text
            key={i}
            position={[Math.cos(angle) * radius, 0, Math.sin(angle) * radius]}
            rotation={[-Math.PI / 2, 0, -angle]}
            fontSize={0.06}
            color={accentColor}
            anchorX="center"
            anchorY="middle"
          >
            {RUNES[(i + type.charCodeAt(0)) % RUNES.length]}
          </Text>
        );
      })}
    </group>
  );
  
  // Sophisticated piece geometry with depth and engravings
  const getPieceGeometry = () => {
    switch (type) {
      case 'p': // Pawn - Elegant with rune engravings
        return (
          <group>
            {/* Sophisticated multi-tier base */}
            <mesh position={[0, 0.04, 0]}>
              <cylinderGeometry args={[0.28, 0.32, 0.08, 24]} />
              <meshPhysicalMaterial color={baseColor} metalness={0.9} roughness={0.1} emissive={emissiveColor} emissiveIntensity={0.2} clearcoat={0.8} />
            </mesh>
            <mesh position={[0, 0.1, 0]}>
              <torusGeometry args={[0.26, 0.02, 12, 24]} />
              <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.8} metalness={0.95} />
            </mesh>
            {/* Mid body with grooves */}
            <mesh position={[0, 0.22, 0]}>
              <cylinderGeometry args={[0.18, 0.24, 0.2, 20]} />
              <meshPhysicalMaterial color={baseColor} metalness={0.85} roughness={0.15} emissive={emissiveColor} emissiveIntensity={0.15} clearcoat={0.6} />
            </mesh>
            {/* Neck collar */}
            <mesh position={[0, 0.34, 0]}>
              <torusGeometry args={[0.14, 0.025, 10, 20]} />
              <meshStandardMaterial color={goldAccent} emissive={goldAccent} emissiveIntensity={1} metalness={0.95} />
            </mesh>
            {/* Upper body taper */}
            <mesh position={[0, 0.42, 0]}>
              <cylinderGeometry args={[0.12, 0.16, 0.16, 18]} />
              <meshPhysicalMaterial color={baseColor} metalness={0.85} roughness={0.15} emissive={emissiveColor} emissiveIntensity={0.15} clearcoat={0.6} />
            </mesh>
            {/* Orb head with inner glow */}
            <mesh position={[0, 0.56, 0]}>
              <sphereGeometry args={[0.14, 24, 24]} />
              <meshPhysicalMaterial color={baseColor} metalness={0.8} roughness={0.1} emissive={emissiveColor} emissiveIntensity={0.2} clearcoat={1} transmission={0.2} />
            </mesh>
            {/* Inner core */}
            <mesh position={[0, 0.56, 0]}>
              <octahedronGeometry args={[0.05, 0]} />
              <meshStandardMaterial ref={runeRef} color={accentColor} emissive={accentColor} emissiveIntensity={2} />
            </mesh>
            <RuneEngravingRing radius={0.26} y={0.05} count={4} />
          </group>
        );
        
      case 'r': // Rook - Monolithic obelisk with rune carvings
        return (
          <group>
            {/* Grand base with tiered steps */}
            <mesh position={[0, 0.05, 0]}>
              <cylinderGeometry args={[0.32, 0.36, 0.1, 8]} />
              <meshPhysicalMaterial color={baseColor} metalness={0.9} roughness={0.1} emissive={emissiveColor} emissiveIntensity={0.25} clearcoat={0.9} />
            </mesh>
            <mesh position={[0, 0.12, 0]}>
              <cylinderGeometry args={[0.28, 0.32, 0.08, 8]} />
              <meshPhysicalMaterial color={baseColor} metalness={0.9} roughness={0.1} emissive={emissiveColor} emissiveIntensity={0.2} clearcoat={0.8} />
            </mesh>
            {/* Rune band at base */}
            <mesh position={[0, 0.08, 0]}>
              <torusGeometry args={[0.3, 0.02, 8, 24]} />
              <meshStandardMaterial color={goldAccent} emissive={goldAccent} emissiveIntensity={1.2} metalness={0.95} />
            </mesh>
            {/* Main obelisk body - faceted */}
            <mesh position={[0, 0.42, 0]}>
              <cylinderGeometry args={[0.2, 0.26, 0.52, 8]} />
              <meshPhysicalMaterial color={baseColor} metalness={0.88} roughness={0.12} emissive={emissiveColor} emissiveIntensity={0.22} clearcoat={0.7} />
            </mesh>
            {/* Mid rune band */}
            <mesh position={[0, 0.42, 0]}>
              <torusGeometry args={[0.22, 0.018, 8, 20]} />
              <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.9} metalness={0.95} />
            </mesh>
            {/* Upper cap platform */}
            <mesh position={[0, 0.72, 0]}>
              <cylinderGeometry args={[0.22, 0.2, 0.08, 8]} />
              <meshPhysicalMaterial color={baseColor} metalness={0.9} roughness={0.1} emissive={emissiveColor} emissiveIntensity={0.25} clearcoat={0.8} />
            </mesh>
            {/* Crown band */}
            <mesh position={[0, 0.74, 0]}>
              <torusGeometry args={[0.21, 0.015, 8, 20]} />
              <meshStandardMaterial color={goldAccent} emissive={goldAccent} emissiveIntensity={1} metalness={0.95} />
            </mesh>
            {/* Neural octahedron crown */}
            <mesh position={[0, 0.86, 0]}>
              <octahedronGeometry args={[0.1, 0]} />
              <meshStandardMaterial ref={runeRef} color={goldAccent} emissive={goldAccent} emissiveIntensity={2.5} metalness={0.95} roughness={0.05} />
            </mesh>
            {/* Corner rune pillars */}
            {[0, 90, 180, 270].map((deg, i) => {
              const rad = (deg * Math.PI) / 180;
              return (
                <group key={i} position={[Math.cos(rad) * 0.18, 0.42, Math.sin(rad) * 0.18]}>
                  <mesh>
                    <boxGeometry args={[0.04, 0.5, 0.04]} />
                    <meshPhysicalMaterial color={baseColor} metalness={0.85} roughness={0.15} emissive={accentColor} emissiveIntensity={0.3} />
                  </mesh>
                </group>
              );
            })}
            <RuneEngravingRing radius={0.28} y={0.05} count={8} />
          </group>
        );
        
      case 'n': // Knight - Mystical steed with glowing eye
        return (
          <group>
            {/* Elaborate base */}
            <mesh position={[0, 0.05, 0]}>
              <cylinderGeometry args={[0.28, 0.32, 0.1, 20]} />
              <meshPhysicalMaterial color={baseColor} metalness={0.88} roughness={0.12} emissive={emissiveColor} emissiveIntensity={0.2} clearcoat={0.8} />
            </mesh>
            <mesh position={[0, 0.08, 0]}>
              <torusGeometry args={[0.27, 0.018, 10, 24]} />
              <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.9} metalness={0.95} />
            </mesh>
            {/* Body stem with detail */}
            <mesh position={[0, 0.24, 0]}>
              <cylinderGeometry args={[0.18, 0.24, 0.28, 16]} />
              <meshPhysicalMaterial color={baseColor} metalness={0.85} roughness={0.15} emissive={emissiveColor} emissiveIntensity={0.18} clearcoat={0.6} />
            </mesh>
            {/* Neck transition ring */}
            <mesh position={[0, 0.4, 0]}>
              <torusGeometry args={[0.16, 0.02, 10, 18]} />
              <meshStandardMaterial color={goldAccent} emissive={goldAccent} emissiveIntensity={1} metalness={0.95} />
            </mesh>
            {/* Horse head - sculpted */}
            <mesh position={[0, 0.52, 0.06]} rotation={[0.35, 0, 0]}>
              <boxGeometry args={[0.22, 0.32, 0.26]} />
              <meshPhysicalMaterial color={baseColor} metalness={0.85} roughness={0.15} emissive={emissiveColor} emissiveIntensity={0.18} clearcoat={0.5} />
            </mesh>
            {/* Muzzle */}
            <mesh position={[0, 0.46, 0.2]} rotation={[0.5, 0, 0]}>
              <boxGeometry args={[0.14, 0.14, 0.18]} />
              <meshPhysicalMaterial color={baseColor} metalness={0.85} roughness={0.15} emissive={emissiveColor} emissiveIntensity={0.15} />
            </mesh>
            {/* Mane crest */}
            <mesh position={[0, 0.72, -0.04]} rotation={[-0.3, 0, 0]}>
              <coneGeometry args={[0.08, 0.2, 8]} />
              <meshPhysicalMaterial color={baseColor} metalness={0.85} roughness={0.15} emissive={emissiveColor} emissiveIntensity={0.2} />
            </mesh>
            {/* Glowing neural eye */}
            <mesh position={[0, 0.58, 0.2]}>
              <sphereGeometry args={[0.055, 16, 16]} />
              <meshStandardMaterial ref={runeRef} color={isWhite ? '#00ffff' : '#ff0040'} emissive={isWhite ? '#00ffff' : '#ff0040'} emissiveIntensity={3} />
            </mesh>
            {/* Eye socket ring */}
            <mesh position={[0, 0.58, 0.19]} rotation={[0, 0, 0]}>
              <torusGeometry args={[0.065, 0.01, 8, 16]} />
              <meshStandardMaterial color={goldAccent} emissive={goldAccent} emissiveIntensity={1.5} metalness={0.95} />
            </mesh>
            <RuneEngravingRing radius={0.26} y={0.05} count={6} />
          </group>
        );
        
      case 'b': // Bishop - Mystical mitre with ethereal spire
        return (
          <group>
            {/* Grand tiered base */}
            <mesh position={[0, 0.05, 0]}>
              <cylinderGeometry args={[0.28, 0.32, 0.1, 22]} />
              <meshPhysicalMaterial color={baseColor} metalness={0.88} roughness={0.12} emissive={emissiveColor} emissiveIntensity={0.2} clearcoat={0.85} />
            </mesh>
            <mesh position={[0, 0.08, 0]}>
              <torusGeometry args={[0.27, 0.02, 10, 24]} />
              <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.9} metalness={0.95} />
            </mesh>
            {/* Column body */}
            <mesh position={[0, 0.28, 0]}>
              <cylinderGeometry args={[0.16, 0.24, 0.36, 18]} />
              <meshPhysicalMaterial color={baseColor} metalness={0.85} roughness={0.15} emissive={emissiveColor} emissiveIntensity={0.18} clearcoat={0.7} />
            </mesh>
            {/* Mid decorative ring */}
            <mesh position={[0, 0.28, 0]}>
              <torusGeometry args={[0.18, 0.015, 10, 20]} />
              <meshStandardMaterial color={goldAccent} emissive={goldAccent} emissiveIntensity={1} metalness={0.95} />
            </mesh>
            {/* Mitre dome */}
            <mesh position={[0, 0.54, 0]}>
              <sphereGeometry args={[0.18, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
              <meshPhysicalMaterial color={baseColor} metalness={0.85} roughness={0.12} emissive={emissiveColor} emissiveIntensity={0.2} clearcoat={0.8} />
            </mesh>
            {/* Mitre notch detail */}
            <mesh position={[0, 0.66, 0.08]} rotation={[0.3, 0, 0]}>
              <boxGeometry args={[0.04, 0.12, 0.04]} />
              <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={1.2} />
            </mesh>
            {/* Ethereal spire */}
            <mesh position={[0, 0.82, 0]}>
              <coneGeometry args={[0.06, 0.24, 14]} />
              <meshPhysicalMaterial color={baseColor} metalness={0.9} roughness={0.1} emissive={accentColor} emissiveIntensity={0.4} clearcoat={1} transmission={0.15} />
            </mesh>
            {/* Crown orb */}
            <mesh position={[0, 0.98, 0]}>
              <sphereGeometry args={[0.04, 14, 14]} />
              <meshStandardMaterial ref={runeRef} color={goldAccent} emissive={goldAccent} emissiveIntensity={2.5} />
            </mesh>
            <RuneEngravingRing radius={0.26} y={0.05} count={6} />
          </group>
        );
        
      case 'q': // Queen - Majestic crown with neural spires
        return (
          <group>
            {/* Royal grand base */}
            <mesh position={[0, 0.06, 0]}>
              <cylinderGeometry args={[0.32, 0.38, 0.12, 24]} />
              <meshPhysicalMaterial color={baseColor} metalness={0.92} roughness={0.08} emissive={emissiveColor} emissiveIntensity={0.25} clearcoat={0.95} />
            </mesh>
            <mesh position={[0, 0.1, 0]}>
              <torusGeometry args={[0.3, 0.025, 12, 28]} />
              <meshStandardMaterial color={goldAccent} emissive={goldAccent} emissiveIntensity={1.3} metalness={0.95} />
            </mesh>
            <mesh position={[0, 0.03, 0]}>
              <torusGeometry args={[0.35, 0.015, 10, 28]} />
              <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.7} metalness={0.95} />
            </mesh>
            {/* Elegant body */}
            <mesh position={[0, 0.3, 0]}>
              <cylinderGeometry args={[0.2, 0.28, 0.36, 20]} />
              <meshPhysicalMaterial color={baseColor} metalness={0.88} roughness={0.12} emissive={emissiveColor} emissiveIntensity={0.22} clearcoat={0.8} />
            </mesh>
            {/* Waist band */}
            <mesh position={[0, 0.3, 0]}>
              <torusGeometry args={[0.22, 0.018, 10, 24]} />
              <meshStandardMaterial color={goldAccent} emissive={goldAccent} emissiveIntensity={1} metalness={0.95} />
            </mesh>
            {/* Neck */}
            <mesh position={[0, 0.52, 0]}>
              <cylinderGeometry args={[0.22, 0.2, 0.1, 20]} />
              <meshPhysicalMaterial color={baseColor} metalness={0.88} roughness={0.12} emissive={emissiveColor} emissiveIntensity={0.22} clearcoat={0.8} />
            </mesh>
            {/* Crown base */}
            <mesh position={[0, 0.62, 0]}>
              <cylinderGeometry args={[0.24, 0.22, 0.1, 20]} />
              <meshPhysicalMaterial color={baseColor} metalness={0.9} roughness={0.1} emissive={emissiveColor} emissiveIntensity={0.25} clearcoat={0.9} />
            </mesh>
            {/* Crown band */}
            <mesh position={[0, 0.62, 0]}>
              <torusGeometry args={[0.23, 0.02, 10, 24]} />
              <meshStandardMaterial color={goldAccent} emissive={goldAccent} emissiveIntensity={1.2} metalness={0.95} />
            </mesh>
            {/* Crown spires - 8 elegant points */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
              const rad = (deg * Math.PI) / 180;
              const r = 0.14;
              return (
                <group key={i} position={[Math.cos(rad) * r, 0.72, Math.sin(rad) * r]}>
                  <mesh>
                    <coneGeometry args={[0.03, i % 2 === 0 ? 0.18 : 0.14, 8]} />
                    <meshPhysicalMaterial color={baseColor} metalness={0.9} roughness={0.1} emissive={accentColor} emissiveIntensity={0.3 + (i % 2) * 0.2} clearcoat={0.8} />
                  </mesh>
                  {i % 2 === 0 && (
                    <mesh position={[0, 0.1, 0]}>
                      <sphereGeometry args={[0.018, 10, 10]} />
                      <meshStandardMaterial color={goldAccent} emissive={goldAccent} emissiveIntensity={2} />
                    </mesh>
                  )}
                </group>
              );
            })}
            {/* Central royal orb */}
            <mesh position={[0, 0.88, 0]}>
              <sphereGeometry args={[0.1, 20, 20]} />
              <meshPhysicalMaterial color={goldAccent} metalness={0.95} roughness={0.05} emissive={goldAccent} emissiveIntensity={2.5} clearcoat={1} />
            </mesh>
            {/* Orb inner core */}
            <mesh position={[0, 0.88, 0]}>
              <octahedronGeometry args={[0.045, 0]} />
              <meshStandardMaterial ref={runeRef} color="#ffffff" emissive="#ffffff" emissiveIntensity={3} />
            </mesh>
            <RuneEngravingRing radius={0.32} y={0.04} count={8} />
          </group>
        );
        
      case 'k': // King - THE ALPHAZERO SEAL - Supreme sovereign
        return (
          <group>
            {/* Supreme grand base with seal */}
            <mesh position={[0, 0.07, 0]}>
              <cylinderGeometry args={[0.34, 0.4, 0.14, 26]} />
              <meshPhysicalMaterial color={baseColor} metalness={0.92} roughness={0.08} emissive={emissiveColor} emissiveIntensity={0.28} clearcoat={0.95} />
            </mesh>
            {/* Double rune rings */}
            <mesh position={[0, 0.12, 0]}>
              <torusGeometry args={[0.32, 0.025, 12, 30]} />
              <meshStandardMaterial color={goldAccent} emissive={goldAccent} emissiveIntensity={1.4} metalness={0.95} />
            </mesh>
            <mesh position={[0, 0.02, 0]}>
              <torusGeometry args={[0.38, 0.018, 10, 30]} />
              <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.8} metalness={0.95} />
            </mesh>
            {/* Regal body */}
            <mesh position={[0, 0.34, 0]}>
              <cylinderGeometry args={[0.22, 0.3, 0.4, 22]} />
              <meshPhysicalMaterial color={baseColor} metalness={0.9} roughness={0.1} emissive={emissiveColor} emissiveIntensity={0.24} clearcoat={0.85} />
            </mesh>
            {/* Royal waist band */}
            <mesh position={[0, 0.34, 0]}>
              <torusGeometry args={[0.24, 0.02, 12, 26]} />
              <meshStandardMaterial color={goldAccent} emissive={goldAccent} emissiveIntensity={1.1} metalness={0.95} />
            </mesh>
            {/* Neck collar */}
            <mesh position={[0, 0.58, 0]}>
              <cylinderGeometry args={[0.24, 0.22, 0.1, 22]} />
              <meshPhysicalMaterial color={baseColor} metalness={0.9} roughness={0.1} emissive={emissiveColor} emissiveIntensity={0.25} clearcoat={0.9} />
            </mesh>
            {/* Crown platform */}
            <mesh position={[0, 0.68, 0]}>
              <cylinderGeometry args={[0.22, 0.24, 0.08, 22]} />
              <meshPhysicalMaterial color={baseColor} metalness={0.92} roughness={0.08} emissive={emissiveColor} emissiveIntensity={0.28} clearcoat={0.95} />
            </mesh>
            {/* Crown band with runes */}
            <mesh position={[0, 0.68, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.2, 0.045, 14, 30]} />
              <meshPhysicalMaterial color={accentColor} metalness={0.95} roughness={0.05} emissive={accentColor} emissiveIntensity={1.2} clearcoat={0.9} />
            </mesh>
            {/* THE ALPHAZERO CROSS - Supreme sigil */}
            <group position={[0, 0.92, 0]}>
              {/* Vertical beam */}
              <mesh>
                <boxGeometry args={[0.055, 0.38, 0.055]} />
                <meshPhysicalMaterial color={goldAccent} metalness={0.95} roughness={0.05} emissive={goldAccent} emissiveIntensity={2.8} clearcoat={1} />
              </mesh>
              {/* Horizontal beam */}
              <mesh position={[0, 0.1, 0]}>
                <boxGeometry args={[0.24, 0.055, 0.055]} />
                <meshPhysicalMaterial color={goldAccent} metalness={0.95} roughness={0.05} emissive={goldAccent} emissiveIntensity={2.8} clearcoat={1} />
              </mesh>
              {/* Cross center core */}
              <mesh position={[0, 0.1, 0]}>
                <sphereGeometry args={[0.05, 16, 16]} />
                <meshStandardMaterial ref={runeRef} color="#ffffff" emissive="#ffffff" emissiveIntensity={4} />
              </mesh>
              {/* Cross tips */}
              {[[0, 0.2, 0], [0.12, 0.1, 0], [-0.12, 0.1, 0], [0, -0.02, 0]].map((pos, i) => (
                <mesh key={i} position={pos}>
                  <sphereGeometry args={[0.025, 12, 12]} />
                  <meshStandardMaterial color={goldAccent} emissive={goldAccent} emissiveIntensity={3} />
                </mesh>
              ))}
            </group>
            <RuneEngravingRing radius={0.34} y={0.04} count={12} />
          </group>
        );
        
      default:
        return (
          <mesh>
            <sphereGeometry args={[0.2, 20, 20]} />
            <meshPhysicalMaterial color={baseColor} metalness={0.8} roughness={0.2} emissive={emissiveColor} emissiveIntensity={0.2} />
          </mesh>
        );
    }
  };
  
  return (
    <group ref={meshRef} position={position}>
      {getPieceGeometry()}
      {/* Selection ring with rune marks */}
      {isSelected && (
        <group>
          <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.4, 0.5, 32]} />
            <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={1.8} transparent opacity={0.85} side={THREE.DoubleSide} />
          </mesh>
          {/* Rotating rune markers on selection */}
          {[0, 90, 180, 270].map((deg, i) => {
            const rad = (deg * Math.PI) / 180;
            return (
              <Text
                key={i}
                position={[Math.cos(rad) * 0.45, 0.05, Math.sin(rad) * 0.45]}
                rotation={[-Math.PI / 2, 0, 0]}
                fontSize={0.1}
                color="#00ff88"
                anchorX="center"
                anchorY="middle"
              >
                {RUNES[i]}
              </Text>
            );
          })}
        </group>
      )}
      {/* Piece label rune */}
      <Text
        position={[0, 0.03, 0.35]}
        rotation={[0, 0, 0]}
        fontSize={0.12}
        color={goldAccent}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.01}
        outlineColor="#000"
      >
        {pieceRune}
      </Text>
    </group>
  );
});

// ==================== SOPHISTICATED SEAL CIRCLE - AlphaZero Sigil ====================
const SealCircle = memo(() => {
  const outerRef = useRef();
  const innerRef = useRef();
  const coreRef = useRef();
  
  // Multi-layer rotation
  useFrame((state) => {
    if (outerRef.current) outerRef.current.rotation.z = state.clock.elapsedTime * 0.025;
    if (innerRef.current) innerRef.current.rotation.z = -state.clock.elapsedTime * 0.035;
    if (coreRef.current) coreRef.current.rotation.z = state.clock.elapsedTime * 0.05;
  });
  
  return (
    <group position={[0, -0.4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      {/* Outer seal ring with runes */}
      <group ref={outerRef}>
        <mesh>
          <torusGeometry args={[7, 0.06, 12, 64]} />
          <meshStandardMaterial color={ALPHA_PURPLE} emissive={ALPHA_PURPLE} emissiveIntensity={0.7} transparent opacity={0.8} />
        </mesh>
        <mesh>
          <torusGeometry args={[6.8, 0.03, 8, 64]} />
          <meshStandardMaterial color={ALPHA_GOLD} emissive={ALPHA_GOLD} emissiveIntensity={0.9} transparent opacity={0.6} />
        </mesh>
        {/* 12 Outer rune markers */}
        {Array.from({ length: 12 }, (_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          return (
            <group key={`outer-${i}`}>
              <mesh position={[Math.cos(angle) * 7, Math.sin(angle) * 7, 0.08]}>
                <octahedronGeometry args={[0.15, 0]} />
                <meshStandardMaterial color={i % 3 === 0 ? ALPHA_GOLD : i % 3 === 1 ? ALPHA_PURPLE : ALPHA_PINK} emissive={i % 3 === 0 ? ALPHA_GOLD : i % 3 === 1 ? ALPHA_PURPLE : ALPHA_PINK} emissiveIntensity={1.5} />
              </mesh>
              <Text
                position={[Math.cos(angle) * 6.5, Math.sin(angle) * 6.5, 0.03]}
                rotation={[0, 0, -angle + Math.PI / 2]}
                fontSize={0.25}
                color={ALPHA_GOLD}
                anchorX="center"
                anchorY="middle"
              >
                {RUNES[i]}
              </Text>
            </group>
          );
        })}
      </group>
      
      {/* Middle seal ring */}
      <group ref={innerRef}>
        <mesh>
          <torusGeometry args={[5.5, 0.05, 10, 52]} />
          <meshStandardMaterial color={ALPHA_PINK} emissive={ALPHA_PINK} emissiveIntensity={0.6} transparent opacity={0.7} />
        </mesh>
        {/* 8 Middle rune markers */}
        {Array.from({ length: 8 }, (_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          return (
            <group key={`mid-${i}`}>
              <mesh position={[Math.cos(angle) * 5.5, Math.sin(angle) * 5.5, 0.06]}>
                <boxGeometry args={[0.2, 0.2, 0.08]} />
                <meshStandardMaterial color={i % 2 === 0 ? ALPHA_PURPLE : ALPHA_GOLD} emissive={i % 2 === 0 ? ALPHA_PURPLE : ALPHA_GOLD} emissiveIntensity={1.2} metalness={0.9} />
              </mesh>
              <Text
                position={[Math.cos(angle) * 5.1, Math.sin(angle) * 5.1, 0.03]}
                rotation={[0, 0, -angle + Math.PI / 2]}
                fontSize={0.2}
                color={ALPHA_PURPLE}
                anchorX="center"
                anchorY="middle"
              >
                {RUNES[(i + 12) % RUNES.length]}
              </Text>
            </group>
          );
        })}
      </group>
      
      {/* Inner core seal */}
      <group ref={coreRef}>
        <mesh>
          <torusGeometry args={[4, 0.04, 8, 40]} />
          <meshStandardMaterial color={ALPHA_GOLD} emissive={ALPHA_GOLD} emissiveIntensity={0.8} transparent opacity={0.65} />
        </mesh>
        {/* 6 Inner markers */}
        {Array.from({ length: 6 }, (_, i) => {
          const angle = (i / 6) * Math.PI * 2;
          return (
            <Text
              key={`inner-${i}`}
              position={[Math.cos(angle) * 3.8, Math.sin(angle) * 3.8, 0.02]}
              rotation={[0, 0, -angle + Math.PI / 2]}
              fontSize={0.18}
              color={ALPHA_PINK}
              anchorX="center"
              anchorY="middle"
            >
              {RUNES[(i + 18) % RUNES.length]}
            </Text>
          );
        })}
      </group>
      
      {/* Center hexagram */}
      <mesh>
        <ringGeometry args={[0.6, 0.9, 6]} />
        <meshStandardMaterial color={ALPHA_GOLD} emissive={ALPHA_GOLD} emissiveIntensity={1} transparent opacity={0.7} />
      </mesh>
      <mesh>
        <ringGeometry args={[0.3, 0.5, 6]} />
        <meshStandardMaterial color={ALPHA_PURPLE} emissive={ALPHA_PURPLE} emissiveIntensity={0.9} transparent opacity={0.6} />
      </mesh>
    </group>
  );
});

// ==================== SOPHISTICATED BADASS CHAIN SYSTEM ====================
// Symmetrically placed chains with purpose - like basketball court lines wrapping the board
const BadassChainSystem = memo(() => {
  const chainGroupRef = useRef();
  
  // Subtle chain animation
  useFrame((state) => {
    if (chainGroupRef.current) {
      chainGroupRef.current.children.forEach((child, i) => {
        if (child.position) {
          child.position.y = 0.08 + Math.sin(state.clock.elapsedTime * 2 + i * 0.2) * 0.02;
        }
      });
    }
  });
  
  // Chain link component with rune engraving
  const ChainLink = ({ position, rotation = [0, 0, 0], runeIndex, isSpecial = false }) => (
    <group position={position} rotation={rotation}>
      {/* Main link torus */}
      <mesh>
        <torusGeometry args={[0.08, 0.025, 8, 16]} />
        <meshPhysicalMaterial 
          color={isSpecial ? ALPHA_GOLD : "#3a2a5a"} 
          metalness={0.95} 
          roughness={0.1} 
          emissive={isSpecial ? ALPHA_GOLD : ALPHA_PURPLE} 
          emissiveIntensity={isSpecial ? 1.2 : 0.5}
          clearcoat={0.8}
        />
      </mesh>
      {/* Rune engraving on link */}
      <Text
        position={[0, 0, 0.035]}
        fontSize={0.04}
        color={isSpecial ? "#ffffff" : ALPHA_GOLD}
        anchorX="center"
        anchorY="middle"
      >
        {RUNES[runeIndex % RUNES.length]}
      </Text>
      {/* Electric arc effect on special links */}
      {isSpecial && (
        <pointLight color={ALPHA_GOLD} intensity={0.5} distance={1} />
      )}
    </group>
  );
  
  // Generate chain links along a path
  const generateChain = (startPos, endPos, count, rotationAxis = 'x', specialInterval = 4) => {
    const links = [];
    for (let i = 0; i < count; i++) {
      const t = i / (count - 1);
      const pos = [
        startPos[0] + (endPos[0] - startPos[0]) * t,
        0.08,
        startPos[2] + (endPos[2] - startPos[2]) * t
      ];
      const isSpecial = i % specialInterval === 0;
      const rotation = rotationAxis === 'x' ? [0, 0, 0] : [0, Math.PI / 2, 0];
      links.push(
        <ChainLink
          key={`${startPos.join('-')}-${i}`}
          position={pos}
          rotation={rotation}
          runeIndex={i}
          isSpecial={isSpecial}
        />
      );
    }
    return links;
  };
  
  const boardSize = 5.2;
  const chainCount = 16;
  
  return (
    <group ref={chainGroupRef}>
      {/* ═══ OUTER RECTANGULAR FRAME - Basketball court boundary ═══ */}
      {/* Top chain */}
      {generateChain([-boardSize, 0, -boardSize], [boardSize, 0, -boardSize], chainCount, 'x', 4)}
      {/* Bottom chain */}
      {generateChain([-boardSize, 0, boardSize], [boardSize, 0, boardSize], chainCount, 'x', 4)}
      {/* Left chain */}
      {generateChain([-boardSize, 0, -boardSize], [-boardSize, 0, boardSize], chainCount, 'z', 4)}
      {/* Right chain */}
      {generateChain([boardSize, 0, -boardSize], [boardSize, 0, boardSize], chainCount, 'z', 4)}
      
      {/* ═══ INNER RECTANGULAR FRAME - Second boundary ═══ */}
      {generateChain([-boardSize * 0.75, 0, -boardSize * 0.75], [boardSize * 0.75, 0, -boardSize * 0.75], 12, 'x', 3)}
      {generateChain([-boardSize * 0.75, 0, boardSize * 0.75], [boardSize * 0.75, 0, boardSize * 0.75], 12, 'x', 3)}
      {generateChain([-boardSize * 0.75, 0, -boardSize * 0.75], [-boardSize * 0.75, 0, boardSize * 0.75], 12, 'z', 3)}
      {generateChain([boardSize * 0.75, 0, -boardSize * 0.75], [boardSize * 0.75, 0, boardSize * 0.75], 12, 'z', 3)}
      
      {/* ═══ DIAGONAL CORNER CHAINS - Basketball court corner arcs ═══ */}
      {/* Top-Left to center direction */}
      {generateChain([-boardSize, 0, -boardSize], [-boardSize * 0.5, 0, -boardSize * 0.5], 8, 'x', 2)}
      {/* Top-Right to center direction */}
      {generateChain([boardSize, 0, -boardSize], [boardSize * 0.5, 0, -boardSize * 0.5], 8, 'x', 2)}
      {/* Bottom-Left to center direction */}
      {generateChain([-boardSize, 0, boardSize], [-boardSize * 0.5, 0, boardSize * 0.5], 8, 'x', 2)}
      {/* Bottom-Right to center direction */}
      {generateChain([boardSize, 0, boardSize], [boardSize * 0.5, 0, boardSize * 0.5], 8, 'x', 2)}
      
      {/* ═══ CROSS CHAINS THROUGH CENTER - Main axes ═══ */}
      {/* Horizontal center chain */}
      {generateChain([-boardSize, 0, 0], [boardSize, 0, 0], 18, 'x', 3)}
      {/* Vertical center chain */}
      {generateChain([0, 0, -boardSize], [0, 0, boardSize], 18, 'z', 3)}
      
      {/* ═══ CORNER ANCHOR PILLARS with chains ═══ */}
      {[[-boardSize, -boardSize], [-boardSize, boardSize], [boardSize, -boardSize], [boardSize, boardSize]].map(([x, z], i) => (
        <group key={`corner-${i}`} position={[x, 0, z]}>
          {/* Corner pillar */}
          <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.15, 0.2, 0.4, 8]} />
            <meshPhysicalMaterial color="#2a1850" metalness={0.9} roughness={0.15} emissive={ALPHA_PURPLE} emissiveIntensity={0.6} />
          </mesh>
          {/* Corner crystal */}
          <mesh position={[0, 0.5, 0]}>
            <octahedronGeometry args={[0.15, 0]} />
            <meshStandardMaterial color={ALPHA_GOLD} emissive={ALPHA_GOLD} emissiveIntensity={2} metalness={0.95} />
          </mesh>
          {/* Corner rune */}
          <Text
            position={[0, 0.2, 0.22]}
            fontSize={0.12}
            color={ALPHA_GOLD}
            anchorX="center"
            anchorY="middle"
          >
            {RUNES[i * 6]}
          </Text>
          <pointLight color={ALPHA_PURPLE} intensity={1.5} distance={4} />
        </group>
      ))}
      
      {/* ═══ MID-EDGE ANCHOR POINTS ═══ */}
      {[[0, -boardSize], [0, boardSize], [-boardSize, 0], [boardSize, 0]].map(([x, z], i) => (
        <group key={`mid-${i}`} position={[x, 0, z]}>
          <mesh position={[0, 0.12, 0]}>
            <boxGeometry args={[0.2, 0.24, 0.2]} />
            <meshPhysicalMaterial color="#2a1850" metalness={0.9} roughness={0.15} emissive={ALPHA_PINK} emissiveIntensity={0.5} />
          </mesh>
          <mesh position={[0, 0.28, 0]}>
            <sphereGeometry args={[0.08, 12, 12]} />
            <meshStandardMaterial color={ALPHA_PINK} emissive={ALPHA_PINK} emissiveIntensity={1.5} />
          </mesh>
          <Text
            position={[0, 0.12, 0.12]}
            fontSize={0.08}
            color={ALPHA_GOLD}
            anchorX="center"
            anchorY="middle"
          >
            {RUNES[(i + 3) * 4]}
          </Text>
        </group>
      ))}
      
      {/* ═══ CIRCULAR CHAIN RING - Like basketball center circle ═══ */}
      {Array.from({ length: 24 }, (_, i) => {
        const angle = (i / 24) * Math.PI * 2;
        const radius = 3.2;
        return (
          <ChainLink
            key={`circle-${i}`}
            position={[Math.cos(angle) * radius, 0.06, Math.sin(angle) * radius]}
            rotation={[0, -angle, 0]}
            runeIndex={i}
            isSpecial={i % 6 === 0}
          />
        );
      })}
      
      {/* ═══ INNER CIRCULAR CHAIN RING ═══ */}
      {Array.from({ length: 16 }, (_, i) => {
        const angle = (i / 16) * Math.PI * 2;
        const radius = 2;
        return (
          <ChainLink
            key={`inner-circle-${i}`}
            position={[Math.cos(angle) * radius, 0.05, Math.sin(angle) * radius]}
            rotation={[0, -angle, 0]}
            runeIndex={i + 8}
            isSpecial={i % 4 === 0}
          />
        );
      })}
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

// ==================== SOPHISTICATED CORNER ANCHORS ====================
const CornerAnchors = memo(() => {
  const cornersRef = useRef([]);
  
  useFrame((state) => {
    cornersRef.current.forEach((ref, i) => {
      if (ref) {
        ref.rotation.y = state.clock.elapsedTime * 0.5 + i * Math.PI / 2;
      }
    });
  });
  
  const corners = [[-5.5, -5.5], [-5.5, 5.5], [5.5, -5.5], [5.5, 5.5]];
  const cornerRunes = ['ᛟ', 'ᛞ', 'ᛜ', 'ᛚ'];
  
  return (
    <group>
      {corners.map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          {/* Base pillar */}
          <mesh position={[0, 0.15, 0]}>
            <cylinderGeometry args={[0.18, 0.24, 0.3, 8]} />
            <meshPhysicalMaterial color="#1a0a3a" metalness={0.92} roughness={0.1} emissive={ALPHA_PURPLE} emissiveIntensity={0.4} clearcoat={0.8} />
          </mesh>
          {/* Rune band */}
          <mesh position={[0, 0.15, 0]}>
            <torusGeometry args={[0.2, 0.025, 8, 16]} />
            <meshStandardMaterial color={ALPHA_GOLD} emissive={ALPHA_GOLD} emissiveIntensity={1.2} metalness={0.95} />
          </mesh>
          {/* Floating crystal */}
          <group ref={el => cornersRef.current[i] = el} position={[0, 0.45, 0]}>
            <mesh>
              <octahedronGeometry args={[0.18, 0]} />
              <meshPhysicalMaterial color={ALPHA_PURPLE} metalness={0.9} roughness={0.05} emissive={ALPHA_PURPLE} emissiveIntensity={1.5} transmission={0.3} clearcoat={1} />
            </mesh>
            {/* Inner core */}
            <mesh>
              <octahedronGeometry args={[0.08, 0]} />
              <meshStandardMaterial color={ALPHA_GOLD} emissive={ALPHA_GOLD} emissiveIntensity={2.5} />
            </mesh>
          </group>
          {/* Rune inscription */}
          <Text
            position={[0, 0.15, 0.25]}
            fontSize={0.15}
            color={ALPHA_GOLD}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.01}
            outlineColor="#000"
          >
            {cornerRunes[i]}
          </Text>
          {/* Corner glow */}
          <pointLight color={ALPHA_PURPLE} intensity={2} distance={5} />
          <pointLight color={ALPHA_GOLD} intensity={0.8} distance={3} position={[0, 0.5, 0]} />
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
      {/* SOPHISTICATED SEAL CIRCLE beneath board */}
      <SealCircle />
      
      {/* BADASS CHAIN SYSTEM - Symmetrically placed */}
      <BadassChainSystem />
      
      {/* Corner anchors with floating crystals */}
      <CornerAnchors />
      
      {/* Board base - multi-layered */}
      <mesh position={[0, -0.2, 0]} receiveShadow>
        <boxGeometry args={[10.5, 0.35, 10.5]} />
        <meshPhysicalMaterial color="#060310" metalness={0.88} roughness={0.15} emissive="#180035" emissiveIntensity={0.25} clearcoat={0.7} />
      </mesh>
      <mesh position={[0, -0.04, 0]}>
        <boxGeometry args={[10.2, 0.06, 10.2]} />
        <meshPhysicalMaterial color="#0a0520" metalness={0.9} roughness={0.1} emissive="#200050" emissiveIntensity={0.3} />
      </mesh>
      
      {/* Glowing edge trim */}
      <mesh position={[0, -0.02, 0]}>
        <boxGeometry args={[10.6, 0.04, 10.6]} />
        <meshStandardMaterial color={ALPHA_PURPLE} emissive={ALPHA_PURPLE} emissiveIntensity={0.8} transparent opacity={0.75} />
      </mesh>
      <mesh position={[0, -0.02, 0]}>
        <boxGeometry args={[10.8, 0.02, 10.8]} />
        <meshStandardMaterial color={ALPHA_GOLD} emissive={ALPHA_GOLD} emissiveIntensity={0.6} transparent opacity={0.5} />
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
      
      {/* Chess pieces - Sophisticated 3D */}
      {pieceElements.map((piece) => (
        <ChessPiece3D
          key={piece.key}
          type={piece.type}
          color={piece.color}
          position={piece.position}
          isSelected={selectedSquare === piece.square}
        />
      ))}
      
      {/* Center board glow */}
      <pointLight position={[0, -1.5, 0]} intensity={3} color={ALPHA_PURPLE} distance={14} />
      <pointLight position={[0, 3, 0]} intensity={1.5} color={ALPHA_GOLD} distance={12} />
    </group>
  );
});

export default AlphaZeroBoard3DUltra;
