import React, { useState, useEffect } from 'react';
import { ArrowLeft, Monitor, Box, Zap, Sparkles } from 'lucide-react';
import SneakyEyeTracker from './SneakyEyeTracker';

const ModeSelect = ({ enemy, playerColor, onSelectMode, onBack }) => {
  const [hoveredMode, setHoveredMode] = useState(null);
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

  const modes = [
    {
      id: '2d',
      name: 'CLASSIC 2D',
      subtitle: 'Traditional View',
      description: 'The classic chess experience with clean 2D visuals and smooth gameplay.',
      icon: Monitor,
      gradient: 'linear-gradient(135deg, #00ffff 0%, #0080ff 100%)',
      textColor: '#00ffff',
      borderColor: '#00ffff30',
      features: ['Clean Interface', 'Fast Performance', 'Classic Feel']
    },
    {
      id: '3d',
      name: '3D ARENA',
      subtitle: 'Hyper-Open World',
      description: 'Immersive 3D battlefield with fighting game vibes. Experience chess like never before!',
      icon: Box,
      gradient: 'linear-gradient(135deg, #bf00ff 0%, #ff00bf 50%, #ffcc00 100%)',
      textColor: '#bf00ff',
      borderColor: '#bf00ff50',
      features: ['3D Environment', 'Free Camera', 'Arena Effects'],
      isNew: true
    }
  ];

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-3 sm:p-4 relative overflow-hidden" 
         data-testid="mode-select-container"
         style={{ background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%)' }}>
      
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden" style={{ zIndex: 0 }}>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900" style={{ minHeight: '100vh', minWidth: '100vw' }} />
        {[...Array(20)].map((_, i) => (
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

      {/* Back Button */}
      <button
        data-testid="back-to-color-btn"
        onClick={onBack}
        className={`absolute top-4 sm:top-8 left-4 sm:left-8 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-300 hover:bg-white/10 ${isReady ? 'opacity-100' : 'opacity-0'}`}
        style={{ 
          color: enemy?.color || '#ff0080',
          fontFamily: 'Orbitron, sans-serif',
          fontSize: '12px'
        }}
      >
        <ArrowLeft size={16} />
        <span className="tracking-wider">BACK</span>
      </button>

      {/* Match Info */}
      <div className={`relative z-10 text-center mb-4 sm:mb-6 transition-all duration-700 ${isReady ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
        <p className="text-gray-500 text-xs tracking-widest mb-2" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
          BATTLE SETUP
        </p>
        <div className="flex items-center justify-center gap-4">
          {/* Player */}
          <div className="text-center">
            <span className="text-3xl">{playerColor === 'white' ? '♔' : '♚'}</span>
            <p className="text-xs text-gray-400 mt-1" style={{ fontFamily: 'Rajdhani, sans-serif' }}>YOU</p>
          </div>
          
          {/* VS */}
          <div 
            className="text-lg font-black"
            style={{ 
              fontFamily: 'Orbitron, sans-serif',
              color: '#ff0080',
              textShadow: '0 0 15px #ff0080'
            }}
          >
            VS
          </div>
          
          {/* Enemy */}
          <div className="text-center">
            {enemy?.avatar === '👁' ? (
              <SneakyEyeTracker size="small" glowColor={enemy?.color} useImage={true} />
            ) : (
              <span className="text-3xl" style={{ filter: `drop-shadow(0 0 10px ${enemy?.color})` }}>
                {enemy?.avatar}
              </span>
            )}
            <p className="text-xs mt-1" style={{ fontFamily: 'Rajdhani, sans-serif', color: enemy?.color }}>
              {enemy?.name}
            </p>
          </div>
        </div>
      </div>

      {/* Title */}
      <div className={`relative z-10 text-center mb-6 sm:mb-10 transition-all duration-700 delay-200 ${isReady ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
        <h1 
          className="text-3xl sm:text-4xl md:text-5xl font-black tracking-wider mb-2"
          style={{ 
            fontFamily: 'Orbitron, sans-serif',
            color: '#fff',
            textShadow: '0 0 15px #ff0080, 0 0 30px #ff0080'
          }}
        >
          SELECT MODE
        </h1>
        <p className="text-gray-400 text-sm tracking-widest" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
          CHOOSE YOUR BATTLEFIELD
        </p>
      </div>

      {/* Mode Cards */}
      <div className={`relative z-10 flex ${isMobile ? 'flex-col' : 'flex-row'} justify-center gap-6 sm:gap-10 max-w-3xl px-4`}>
        {modes.map((mode, index) => {
          const Icon = mode.icon;
          const isHovered = hoveredMode === mode.id;
          
          return (
            <div
              key={mode.id}
              data-testid={`mode-card-${mode.id}`}
              className={`relative cursor-pointer transition-all duration-500 ${isReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
              style={{ 
                transitionDelay: `${300 + index * 150}ms`,
                transform: isHovered ? 'scale(1.03) translateY(-5px)' : 'scale(1)'
              }}
              onMouseEnter={() => setHoveredMode(mode.id)}
              onMouseLeave={() => setHoveredMode(null)}
              onClick={() => onSelectMode(mode.id)}
            >
              {/* NEW badge for 3D */}
              {mode.isNew && (
                <div 
                  className="absolute -top-3 -right-3 z-10 px-3 py-1 rounded-full text-xs font-bold"
                  style={{ 
                    background: mode.gradient,
                    fontFamily: 'Orbitron, sans-serif',
                    fontSize: '9px',
                    animation: 'pulse 2s infinite'
                  }}
                >
                  NEW!
                </div>
              )}
              
              {/* Glow Effect */}
              <div 
                className="absolute -inset-3 rounded-2xl blur-xl transition-opacity duration-500"
                style={{ 
                  background: mode.gradient,
                  opacity: isHovered ? 0.4 : (mode.isNew ? 0.15 : 0)
                }}
              />
              
              {/* Card */}
              <div 
                className="relative w-64 sm:w-72 rounded-xl overflow-hidden transition-all duration-300"
                style={{
                  background: 'linear-gradient(180deg, rgba(25,25,45,0.95) 0%, rgba(12,12,25,0.98) 100%)',
                  border: `2px solid ${isHovered ? mode.textColor : mode.borderColor}`,
                  boxShadow: isHovered ? `0 0 30px ${mode.textColor}40` : (mode.isNew ? `0 0 15px ${mode.textColor}20` : 'none')
                }}
              >
                {/* Icon Display */}
                <div 
                  className="h-32 sm:h-40 flex items-center justify-center relative overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${mode.textColor}10 0%, transparent 100%)` }}
                >
                  {/* Background pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                      backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, ${mode.textColor}15 10px, ${mode.textColor}15 20px)`
                    }} />
                  </div>
                  
                  <Icon 
                    size={isMobile ? 60 : 80} 
                    className="transition-all duration-500"
                    style={{ 
                      color: mode.textColor,
                      filter: `drop-shadow(0 0 20px ${mode.textColor})`,
                      transform: isHovered ? 'scale(1.1) rotateY(10deg)' : 'scale(1)'
                    }}
                  />
                  
                  {/* Sparkle effect for 3D */}
                  {mode.isNew && (
                    <Sparkles 
                      className="absolute top-4 right-4 animate-pulse" 
                      size={20} 
                      style={{ color: '#ffcc00' }}
                    />
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap size={16} style={{ color: mode.textColor }} />
                    <h2 
                      className="text-lg sm:text-xl font-black tracking-wider"
                      style={{ 
                        fontFamily: 'Orbitron, sans-serif',
                        color: mode.textColor
                      }}
                    >
                      {mode.name}
                    </h2>
                  </div>
                  
                  <p 
                    className="text-xs mb-2 tracking-wider"
                    style={{ fontFamily: 'Rajdhani, sans-serif', color: '#888' }}
                  >
                    {mode.subtitle}
                  </p>
                  
                  <p 
                    className="text-xs text-gray-300 leading-relaxed mb-3"
                    style={{ fontFamily: 'Rajdhani, sans-serif' }}
                  >
                    {mode.description}
                  </p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {mode.features.map((feature, i) => (
                      <span 
                        key={i}
                        className="px-2 py-0.5 rounded-full text-xs"
                        style={{ 
                          background: `${mode.textColor}15`,
                          color: mode.textColor,
                          border: `1px solid ${mode.textColor}30`,
                          fontFamily: 'Rajdhani, sans-serif',
                          fontSize: '10px'
                        }}
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Select Button */}
                  <button
                    data-testid={`select-${mode.id}-mode-btn`}
                    className="w-full py-3 rounded-lg font-bold tracking-widest text-white transition-all duration-300 text-sm"
                    style={{ 
                      background: mode.gradient,
                      fontFamily: 'Orbitron, sans-serif',
                      boxShadow: isHovered ? `0 0 25px ${mode.textColor}50` : 'none'
                    }}
                  >
                    {mode.isNew ? '⚡ ENTER ARENA' : '▶ PLAY'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer tip */}
      <div className={`relative z-10 mt-8 text-center transition-all duration-1000 delay-700 ${isReady ? 'opacity-100' : 'opacity-0'}`}>
        <p className="text-gray-600 text-xs tracking-widest" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
          TIP: You can switch modes anytime during the game
        </p>
      </div>
    </div>
  );
};

export default ModeSelect;
