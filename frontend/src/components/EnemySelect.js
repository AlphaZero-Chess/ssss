import React, { useState, useEffect } from 'react';
import { Crown, Flame, Star, Sparkles } from 'lucide-react';
import SneakyEyeTracker from './SneakyEyeTracker';
import HiddenMasterLock from './HiddenMasterLock';

const enemies = [
  {
    id: 'elegant',
    name: 'THE ELEGANT',
    subtitle: 'AlphaZero Style',
    description: 'Masterful positional play with beautiful sacrifices. Favors long-term strategic advantages.',
    traits: ['Positional Genius', 'Elegant Sacrifices', 'Strategic Depth'],
    color: '#00ffff',
    gradient: 'linear-gradient(135deg, #00ffff 0%, #0080ff 100%)',
    icon: Crown,
    difficulty: 'Master',
    openings: ['Italian Game', 'Ruy Lopez', "King's Indian"],
    style: 'Prioritizes piece activity and king safety.',
    avatar: '♚',
    skillLevel: 20,
    depth: 18,
    isHidden: false
  },
  {
    id: 'nonelegant',
    name: 'THE CRUSHER',
    subtitle: 'Aggressive Beast',
    description: 'Relentless aggression and tactical chaos. Seeks to destroy through brute force.',
    traits: ['Tactical Monster', 'Aggressive Play', 'Material Hunter'],
    color: '#ff0040',
    gradient: 'linear-gradient(135deg, #ff0040 0%, #ff8000 100%)',
    icon: Flame,
    difficulty: 'Brutal',
    openings: ['Sicilian Dragon', "King's Gambit", 'Evans Gambit'],
    style: 'Attacks relentlessly. Tactics over position.',
    avatar: '♛',
    skillLevel: 20,
    depth: 20,
    isHidden: false
  },
  {
    id: 'minia0',
    name: 'MINI ALPHA',
    subtitle: 'Rising Prodigy',
    description: 'Balanced approach combining positional understanding with tactical awareness.',
    traits: ['Balanced Style', 'Solid Defense', 'Adaptable'],
    color: '#80ff00',
    gradient: 'linear-gradient(135deg, #80ff00 0%, #00ff80 100%)',
    icon: Star,
    difficulty: 'Moderate',
    openings: ["Queen's Gambit", 'London System', 'Caro-Kann'],
    style: 'Balanced play with solid fundamentals.',
    avatar: '♞',
    skillLevel: 15,
    depth: 12,
    isHidden: false
  },
  {
    id: 'alphazero',
    name: 'ALPHAZERO',
    subtitle: 'The Pure Algorithm',
    description: 'The fearless swashbuckler. Neural intuition meets beautiful sacrifices. Initiative over material. The original that taught itself chess perfection.',
    traits: ['Neural Intuition', 'Fearless Sacrifices', 'h4-h5 Storms'],
    color: '#bf00ff',
    gradient: 'linear-gradient(135deg, #bf00ff 0%, #ff00bf 50%, #ffcc00 100%)',
    icon: Sparkles,
    difficulty: 'LEGENDARY',
    openings: ['English Opening', "King's Indian", 'Grünfeld Defense'],
    style: 'Pure neural mastery. Sacrifices for initiative. Beautiful, intuitive chess.',
    avatar: '👁',
    skillLevel: 20,
    depth: 24,
    isHidden: true,
    lore: 'Born from pure self-play, mastering chess in mere hours. Plays with deliberate purpose from the first move - as if reading from the secret notebooks of a chess god.',
    signature: 'Famous h4-h5 kingside storms, exchange sacrifices, bishop pair activation'
  }
];

const EnemySelect = ({ onSelect }) => {
  const [hoveredEnemy, setHoveredEnemy] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 100);
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-3 sm:p-4 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%)' }}>
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden" style={{ zIndex: 0 }}>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900" style={{ minHeight: '100vh', minWidth: '100vw' }} />
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="particle absolute rounded-full bg-white/20"
            style={{
              left: `${Math.random() * 100}%`,
              width: '2px',
              height: '2px',
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${5 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      {/* Title */}
      <div className={`relative z-10 text-center mb-6 sm:mb-10 transition-all duration-1000 ${isReady ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
        <h1 
          className="text-3xl sm:text-5xl md:text-6xl font-black tracking-wider mb-2 sm:mb-3"
          style={{ 
            fontFamily: 'Orbitron, sans-serif',
            color: '#fff',
            textShadow: '0 0 15px #ff0080, 0 0 30px #ff0080'
          }}
        >
          CHOOSE YOUR ENEMY
        </h1>
        <p className="text-gray-400 text-sm sm:text-lg tracking-widest" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
          SELECT A WORTHY OPPONENT
        </p>
      </div>

      {/* Enemy Cards */}
      <div className="relative z-10 flex flex-wrap justify-center items-start gap-4 sm:gap-6 max-w-6xl px-2">
        {enemies.map((enemy, index) => {
          const Icon = enemy.icon;
          const isHovered = hoveredEnemy === enemy.id;
          const isSelected = selectedIndex === index;
          const isHiddenMaster = enemy.isHidden;
          
          // Card content component to avoid duplication
          const CardContent = (
            <div
              key={enemy.id}
              data-testid={`enemy-card-${enemy.id}`}
              className={`relative cursor-pointer transition-all duration-500 ${isReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
              style={{ 
                transitionDelay: `${index * 100}ms`,
                transform: isHovered ? 'scale(1.03) translateY(-5px)' : isSelected ? 'scale(1.01)' : 'scale(1)',
                alignSelf: 'flex-start'
              }}
              onMouseEnter={() => setHoveredEnemy(enemy.id)}
              onMouseLeave={() => setHoveredEnemy(null)}
              onClick={() => {
                setSelectedIndex(index);
                onSelect(enemy);
              }}
            >
              {/* Special Aura for Hidden Master - positioned to not affect layout */}
              {isHiddenMaster && (
                <div 
                  className="absolute -inset-3 rounded-xl animate-pulse pointer-events-none"
                  style={{ 
                    background: 'linear-gradient(45deg, #bf00ff40, #ff00bf40, #ffcc0040, #bf00ff40)',
                    filter: 'blur(15px)',
                    animation: 'pulse 2s infinite',
                    zIndex: -1
                  }}
                />
              )}
              
              {/* Glow Effect */}
              <div 
                className="absolute -inset-1.5 rounded-xl blur-lg transition-opacity duration-500"
                style={{ 
                  background: enemy.gradient,
                  opacity: isHiddenMaster 
                    ? (isHovered ? 0.5 : isSelected ? 0.35 : 0.25)
                    : (isHovered ? 0.4 : isSelected ? 0.25 : 0)
                }}
              />
              
              {/* Card */}
              <div 
                className={`relative ${isMobile ? 'w-72' : 'w-64'} rounded-xl overflow-hidden`}
                style={{
                  background: isHiddenMaster 
                    ? 'linear-gradient(180deg, rgba(40,20,60,0.98) 0%, rgba(20,10,35,0.99) 100%)'
                    : 'linear-gradient(180deg, rgba(25,25,45,0.95) 0%, rgba(12,12,25,0.98) 100%)',
                  border: `2px solid ${isHovered || isSelected ? enemy.color : isHiddenMaster ? '#bf00ff50' : 'rgba(255,255,255,0.08)'}`,
                  boxShadow: isHiddenMaster 
                    ? (isHovered ? `0 0 30px ${enemy.color}40, 0 0 60px #bf00ff30` : '0 0 20px #bf00ff20')
                    : (isHovered ? `0 0 30px ${enemy.color}30` : 'none')
                }}
              >
                {/* Hidden Master Badge */}
                {isHiddenMaster && (
                  <div 
                    className="absolute top-0 left-0 right-0 py-1 text-center text-xs font-bold tracking-widest z-20"
                    style={{ 
                      background: 'linear-gradient(90deg, #bf00ff, #ff00bf, #ffcc00)',
                      fontFamily: 'Orbitron, sans-serif',
                      fontSize: '9px',
                      color: '#000',
                      textShadow: '0 0 5px rgba(255,255,255,0.5)'
                    }}
                  >
                    ★ HIDDEN MASTER ★
                  </div>
                )}
                
                {/* Header */}
                <div 
                  className={`relative ${isHiddenMaster ? 'h-36 sm:h-40 pt-5' : 'h-32 sm:h-36'} flex items-center justify-center overflow-hidden`}
                  style={{ background: `${enemy.gradient}15` }}
                >
                  {/* Pattern overlay */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                      backgroundImage: isHiddenMaster 
                        ? `repeating-linear-gradient(60deg, transparent, transparent 8px, ${enemy.color}20 8px, ${enemy.color}20 16px)`
                        : `repeating-linear-gradient(45deg, transparent, transparent 10px, ${enemy.color}15 10px, ${enemy.color}15 20px)`
                    }} />
                  </div>
                  
                  {/* Neural Network Effect for Hidden Master */}
                  {isHiddenMaster && (
                    <div className="absolute inset-0 overflow-hidden opacity-30">
                      {[...Array(8)].map((_, i) => (
                        <div 
                          key={i}
                          className="absolute rounded-full bg-purple-500"
                          style={{
                            width: '4px',
                            height: '4px',
                            left: `${15 + i * 10}%`,
                            top: `${20 + (i % 3) * 25}%`,
                            boxShadow: '0 0 10px #bf00ff',
                            animation: `pulse ${1 + i * 0.2}s infinite`
                          }}
                        />
                      ))}
                    </div>
                  )}
                  
                  {/* Avatar */}
                  {isHiddenMaster && enemy.avatar === '👁' ? (
                    <SneakyEyeTracker
                      size="large"
                      glowColor={enemy.color}
                      useImage={true}
                      useAlpha={true}
                      style={{
                        transform: isHovered ? 'scale(1.15)' : 'scale(1)'
                      }}
                    />
                  ) : (
                    <span 
                      className={`${isHiddenMaster ? 'text-7xl sm:text-8xl' : 'text-6xl sm:text-7xl'} transition-transform duration-500`}
                      style={{ 
                        filter: `drop-shadow(0 0 ${isHiddenMaster ? '30px' : '20px'} ${enemy.color})`,
                        transform: isHovered ? 'scale(1.15)' : 'scale(1)',
                        animation: isHiddenMaster ? 'float 3s ease-in-out infinite' : 'none'
                      }}
                    >
                      {enemy.avatar}
                    </span>
                  )}
                  
                  {/* Difficulty Badge */}
                  <div 
                    className={`absolute ${isHiddenMaster ? 'top-8' : 'top-3'} right-3 px-2 py-0.5 rounded-full text-xs font-bold tracking-wider`}
                    style={{ 
                      background: enemy.gradient,
                      fontFamily: 'Orbitron, sans-serif',
                      fontSize: isHiddenMaster ? '9px' : '10px',
                      boxShadow: isHiddenMaster ? `0 0 10px ${enemy.color}` : 'none'
                    }}
                  >
                    {enemy.difficulty.toUpperCase()}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon 
                      size={isHiddenMaster ? 20 : 18} 
                      style={{ 
                        color: enemy.color,
                        filter: isHiddenMaster ? `drop-shadow(0 0 5px ${enemy.color})` : 'none'
                      }} 
                    />
                    <h2 
                      className={`${isHiddenMaster ? 'text-xl sm:text-2xl' : 'text-lg sm:text-xl'} font-black tracking-wide`}
                      style={{ 
                        fontFamily: 'Orbitron, sans-serif',
                        color: enemy.color,
                        textShadow: isHiddenMaster ? `0 0 10px ${enemy.color}80` : 'none'
                      }}
                    >
                      {enemy.name}
                    </h2>
                  </div>
                  
                  <p 
                    className="text-xs mb-2" 
                    style={{ 
                      fontFamily: 'Rajdhani, sans-serif',
                      color: isHiddenMaster ? '#e0a0ff' : '#6b7280'
                    }}
                  >
                    {enemy.subtitle}
                  </p>
                  
                  <p className="text-gray-300 text-xs mb-3 leading-relaxed line-clamp-2" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                    {enemy.description}
                  </p>

                  {/* Traits */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {enemy.traits.slice(0, isHiddenMaster ? 3 : 2).map((trait, i) => (
                      <span 
                        key={i}
                        className="px-2 py-0.5 rounded-full font-medium"
                        style={{ 
                          background: `${enemy.color}15`,
                          color: enemy.color,
                          border: `1px solid ${enemy.color}30`,
                          fontFamily: 'Rajdhani, sans-serif',
                          fontSize: '10px',
                          boxShadow: isHiddenMaster ? `0 0 5px ${enemy.color}30` : 'none'
                        }}
                      >
                        {trait}
                      </span>
                    ))}
                  </div>

                  {/* Skill Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-400 mb-1" style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '10px' }}>
                      <span>{isHiddenMaster ? 'NEURAL POWER' : 'SKILL'}</span>
                      <span>{enemy.skillLevel}/20</span>
                    </div>
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${(enemy.skillLevel / 20) * 100}%`,
                          background: enemy.gradient,
                          boxShadow: isHiddenMaster ? `0 0 10px ${enemy.color}` : 'none'
                        }}
                      />
                    </div>
                  </div>

                  {/* Fight Button */}
                  <button
                    data-testid={`fight-btn-${enemy.id}`}
                    className="w-full py-3 rounded-lg font-bold tracking-widest text-white transition-all duration-300 hover:shadow-lg text-sm"
                    style={{ 
                      background: enemy.gradient,
                      fontFamily: 'Orbitron, sans-serif',
                      boxShadow: isHiddenMaster 
                        ? (isHovered ? `0 0 20px ${enemy.color}50, 0 0 40px #bf00ff30` : `0 0 10px ${enemy.color}30`)
                        : (isHovered ? `0 0 20px ${enemy.color}50` : 'none'),
                      color: isHiddenMaster ? '#000' : '#fff',
                      textShadow: isHiddenMaster ? 'none' : 'none'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(enemy);
                    }}
                  >
                    {isHiddenMaster ? '⚡ CHALLENGE THE MASTER' : '⚔️ ENGAGE'}
                  </button>
                </div>
              </div>
            </div>
          );
          
          // Wrap hidden master card with lock component
          if (isHiddenMaster) {
            return (
              <HiddenMasterLock key={enemy.id}>
                {CardContent}
              </HiddenMasterLock>
            );
          }
          
          return CardContent;
        })}  
      </div>

      {/* Footer */}
      <div className={`relative z-10 mt-6 sm:mt-10 text-center transition-all duration-1000 delay-500 ${isReady ? 'opacity-100' : 'opacity-0'}`}>
        <p className="text-gray-500 text-xs sm:text-sm tracking-widest" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
          POWERED BY STOCKFISH • NEURAL NETWORK ENGINE
        </p>
      </div>
    </div>
  );
};

export default EnemySelect;
