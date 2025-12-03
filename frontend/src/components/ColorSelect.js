import React, { useState, useEffect } from 'react';
import { ArrowLeft, Sword, Shield } from 'lucide-react';
import SneakyEyeTracker from './SneakyEyeTracker';

const ColorSelect = ({ enemy, onSelect, onBack }) => {
  const [hoveredColor, setHoveredColor] = useState(null);
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

  const colors = [
    {
      id: 'white',
      name: 'WHITE',
      subtitle: 'First Strike',
      description: 'Take the initiative. Strike first.',
      icon: Sword,
      gradient: 'linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%)',
      textColor: '#000',
      borderColor: '#fff',
      piece: '♔'
    },
    {
      id: 'black',
      name: 'BLACK',
      subtitle: 'Counter Attack',
      description: 'Let them come. Then crush them.',
      icon: Shield,
      gradient: 'linear-gradient(135deg, #1a1a2e 0%, #0a0a0f 100%)',
      textColor: '#fff',
      borderColor: '#444',
      piece: '♚'
    }
  ];

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-3 sm:p-4 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%)' }}>
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
        data-testid="back-to-enemies-btn"
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

      {/* Enemy Info */}
      <div className={`relative z-10 text-center mb-4 sm:mb-6 transition-all duration-700 ${isReady ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
        <p className="text-gray-500 text-xs tracking-widest mb-1" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
          OPPONENT
        </p>
        <div className="flex items-center justify-center gap-3">
          {enemy?.avatar === '👁' ? (
            <SneakyEyeTracker
              size="small"
              glowColor={enemy?.color}
              useImage={true}
            />
          ) : (
            <span className="text-3xl sm:text-4xl" style={{ filter: `drop-shadow(0 0 15px ${enemy?.color})` }}>
              {enemy?.avatar}
            </span>
          )}
          <h2 
            className="text-xl sm:text-2xl font-black tracking-wider"
            style={{ 
              fontFamily: 'Orbitron, sans-serif',
              color: enemy?.color,
              textShadow: `0 0 15px ${enemy?.color}` 
            }}
          >
            {enemy?.name}
          </h2>
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
          CHOOSE YOUR SIDE
        </h1>
        <p className="text-gray-400 text-sm tracking-widest" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
          ATTACK OR DEFEND?
        </p>
      </div>

      {/* Color Cards */}
      <div className={`relative z-10 flex ${isMobile ? 'flex-col' : 'flex-row'} justify-center gap-6 sm:gap-10 max-w-3xl px-4`}>
        {colors.map((color, index) => {
          const Icon = color.icon;
          const isHovered = hoveredColor === color.id;
          
          return (
            <div
              key={color.id}
              data-testid={`color-card-${color.id}`}
              className={`relative cursor-pointer transition-all duration-500 ${isReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
              style={{ 
                transitionDelay: `${300 + index * 100}ms`,
                transform: isHovered ? 'scale(1.03) translateY(-5px)' : 'scale(1)'
              }}
              onMouseEnter={() => setHoveredColor(color.id)}
              onMouseLeave={() => setHoveredColor(null)}
              onClick={() => onSelect(color.id)}
            >
              {/* Glow Effect */}
              <div 
                className="absolute -inset-3 rounded-2xl blur-xl transition-opacity duration-500"
                style={{ 
                  background: color.id === 'white' 
                    ? 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)'
                    : 'radial-gradient(circle, rgba(100,100,150,0.3) 0%, transparent 70%)',
                  opacity: isHovered ? 1 : 0 
                }}
              />
              
              {/* Card */}
              <div 
                className="relative w-56 sm:w-60 rounded-xl overflow-hidden transition-all duration-300"
                style={{
                  background: color.gradient,
                  border: `2px solid ${isHovered ? (color.id === 'white' ? '#fff' : '#666') : color.borderColor}`,
                  boxShadow: isHovered 
                    ? color.id === 'white' 
                      ? '0 0 40px rgba(255,255,255,0.4)' 
                      : '0 0 40px rgba(100,100,150,0.4)'
                    : 'none'
                }}
              >
                {/* Piece Display */}
                <div className="h-36 sm:h-44 flex items-center justify-center relative">
                  <span 
                    className="text-7xl sm:text-8xl transition-all duration-500"
                    style={{ 
                      color: color.id === 'white' ? '#000' : '#fff',
                      filter: isHovered 
                        ? color.id === 'white'
                          ? 'drop-shadow(0 0 30px rgba(0,0,0,0.2))'
                          : 'drop-shadow(0 0 30px rgba(255,255,255,0.4))'
                        : 'none',
                      transform: isHovered ? 'scale(1.1)' : 'scale(1)'
                    }}
                  >
                    {color.piece}
                  </span>
                </div>

                {/* Content */}
                <div 
                  className="p-4"
                  style={{ 
                    background: color.id === 'white' 
                      ? 'linear-gradient(180deg, rgba(0,0,0,0.03) 0%, rgba(0,0,0,0.08) 100%)'
                      : 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)'
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon size={18} style={{ color: color.textColor }} />
                    <h2 
                      className="text-lg font-black tracking-wider"
                      style={{ 
                        fontFamily: 'Orbitron, sans-serif',
                        color: color.textColor
                      }}
                    >
                      {color.name}
                    </h2>
                  </div>
                  
                  <p 
                    className="text-xs mb-2 tracking-wider"
                    style={{ 
                      fontFamily: 'Rajdhani, sans-serif',
                      color: color.id === 'white' ? '#666' : '#888'
                    }}
                  >
                    {color.subtitle}
                  </p>
                  
                  <p 
                    className="text-xs leading-relaxed"
                    style={{ 
                      fontFamily: 'Rajdhani, sans-serif',
                      color: color.id === 'white' ? '#444' : '#aaa'
                    }}
                  >
                    {color.description}
                  </p>

                  {/* Select Button */}
                  <button
                    data-testid={`select-${color.id}-btn`}
                    className="w-full mt-4 py-3 rounded-lg font-bold tracking-widest transition-all duration-300 text-sm"
                    style={{ 
                      background: color.id === 'white' 
                        ? 'linear-gradient(135deg, #1a1a2e 0%, #0a0a0f 100%)'
                        : 'linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%)',
                      color: color.id === 'white' ? '#fff' : '#000',
                      fontFamily: 'Orbitron, sans-serif',
                      boxShadow: isHovered 
                        ? '0 0 25px rgba(255,0,128,0.35)'
                        : 'none'
                    }}
                  >
                    SELECT
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ColorSelect;
