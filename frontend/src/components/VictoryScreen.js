import React, { useState, useEffect } from 'react';
import { Trophy, Skull, Scale, RotateCcw, Swords } from 'lucide-react';
import SneakyEyeTracker from './SneakyEyeTracker';

const VictoryScreen = ({ winner, enemy, playerColor, onPlayAgain, onNewEnemy }) => {
  const [isReady, setIsReady] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setIsReady(true), 100);
    const timer2 = setTimeout(() => {
      if (winner === 'player') setShowConfetti(true);
    }, 500);
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      window.removeEventListener('resize', checkMobile);
    };
  }, [winner]);

  const getResultConfig = () => {
    switch (winner) {
      case 'player':
        return {
          title: 'VICTORY',
          subtitle: 'YOU DEFEATED YOUR OPPONENT!',
          icon: Trophy,
          gradient: 'linear-gradient(135deg, #ffd700 0%, #ff8c00 100%)',
          color: '#ffd700',
          bgGlow: 'rgba(255, 215, 0, 0.25)',
          message: 'Your strategic brilliance has prevailed!'
        };
      case 'enemy':
        return {
          title: 'DEFEAT',
          subtitle: 'YOU HAVE BEEN CONQUERED',
          icon: Skull,
          gradient: 'linear-gradient(135deg, #ff0040 0%, #8b0000 100%)',
          color: '#ff0040',
          bgGlow: 'rgba(255, 0, 64, 0.25)',
          message: 'Rise again and seek revenge!'
        };
      case 'draw':
        return {
          title: 'DRAW',
          subtitle: 'A STALEMATE HAS OCCURRED',
          icon: Scale,
          gradient: 'linear-gradient(135deg, #888888 0%, #444444 100%)',
          color: '#888888',
          bgGlow: 'rgba(136, 136, 136, 0.25)',
          message: 'Neither side could claim victory.'
        };
      default:
        return {
          title: 'GAME OVER',
          subtitle: '',
          icon: Swords,
          gradient: 'linear-gradient(135deg, #888888 0%, #444444 100%)',
          color: '#888888',
          bgGlow: 'rgba(136, 136, 136, 0.25)',
          message: ''
        };
    }
  };

  const config = getResultConfig();
  const Icon = config.icon;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-3 sm:p-4 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%)' }}>
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900" style={{ zIndex: 0, minHeight: '100vh', minWidth: '100vw' }} />
      
      {/* Animated glow effect */}
      <div 
        className="absolute inset-0 transition-opacity duration-1000"
        style={{
          background: `radial-gradient(circle at center, ${config.bgGlow} 0%, transparent 70%)`,
          opacity: isReady ? 1 : 0
        }}
      />

      {/* Confetti for victory */}
      {showConfetti && winner === 'player' && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                background: ['#ffd700', '#ff8c00', '#ff0080', '#00ffff', '#80ff00'][Math.floor(Math.random() * 5)],
                animation: `fall ${2 + Math.random() * 3}s ease-out forwards`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Main Content */}
      <div className={`relative z-10 text-center transition-all duration-1000 ${isReady ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
        {/* Icon */}
        <div 
          className={`inline-flex items-center justify-center ${isMobile ? 'w-20 h-20' : 'w-28 h-28'} rounded-full mb-6`}
          style={{
            background: config.gradient,
            boxShadow: `0 0 40px ${config.color}50, 0 0 80px ${config.color}25`,
            animation: 'pulse 2s infinite'
          }}
        >
          <Icon size={isMobile ? 40 : 56} color="#fff" />
        </div>

        {/* Title */}
        <h1 
          className={`${isMobile ? 'text-4xl' : 'text-6xl md:text-7xl'} font-black tracking-wider mb-2`}
          style={{ 
            fontFamily: 'Orbitron, sans-serif',
            background: config.gradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: `0 0 40px ${config.color}60`
          }}
        >
          {config.title}
        </h1>

        {/* Subtitle */}
        <p 
          className={`${isMobile ? 'text-sm' : 'text-lg md:text-xl'} tracking-widest mb-6`}
          style={{ 
            fontFamily: 'Rajdhani, sans-serif',
            color: config.color
          }}
        >
          {config.subtitle}
        </p>

        {/* Battle Summary */}
        <div 
          className={`max-w-md mx-auto rounded-xl ${isMobile ? 'p-5' : 'p-6'} mb-8 transition-all duration-1000 delay-300 ${isReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          style={{
            background: 'linear-gradient(180deg, rgba(25,25,45,0.9) 0%, rgba(12,12,25,0.95) 100%)',
            border: `1px solid ${config.color}30`,
            boxShadow: `0 0 30px ${config.color}15`
          }}
        >
          {/* VS Display */}
          <div className="flex items-center justify-center gap-6 mb-4">
            {/* Player */}
            <div className="text-center">
              <span className={`${isMobile ? 'text-3xl' : 'text-4xl'} block mb-1`}>
                {playerColor === 'white' ? '♔' : '♚'}
              </span>
              <p className="text-xs text-gray-400" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                YOU
              </p>
            </div>
            
            {/* VS */}
            <div 
              className="text-xl font-black"
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
                <SneakyEyeTracker
                  size="small"
                  glowColor={enemy?.color}
                  useImage={true}
                  className={`${isMobile ? 'text-3xl' : 'text-4xl'} block mb-1`}
                />
              ) : (
                <span 
                  className={`${isMobile ? 'text-3xl' : 'text-4xl'} block mb-1`}
                  style={{ filter: `drop-shadow(0 0 10px ${enemy?.color})` }}
                >
                  {enemy?.avatar}
                </span>
              )}
              <p 
                className="text-xs"
                style={{ fontFamily: 'Rajdhani, sans-serif', color: enemy?.color }}
              >
                {enemy?.name}
              </p>
            </div>
          </div>

          {/* Message */}
          <p 
            className="text-gray-300 text-sm leading-relaxed"
            style={{ fontFamily: 'Rajdhani, sans-serif' }}
          >
            {config.message}
          </p>
        </div>

        {/* Action Buttons */}
        <div className={`flex flex-wrap justify-center gap-3 transition-all duration-1000 delay-500 ${isReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <button
            data-testid="rematch-btn"
            onClick={onPlayAgain}
            className="flex items-center gap-2 px-6 py-3 rounded-lg font-bold tracking-wider transition-all duration-300 hover:scale-105 text-sm"
            style={{ 
              background: 'linear-gradient(135deg, #ff0080 0%, #7928ca 100%)',
              fontFamily: 'Orbitron, sans-serif',
              boxShadow: '0 0 25px rgba(255, 0, 128, 0.35)'
            }}
          >
            <RotateCcw size={16} />
            PLAY AGAIN
          </button>
          
          <button
            data-testid="new-enemy-btn"
            onClick={onNewEnemy}
            className="flex items-center gap-2 px-6 py-3 rounded-lg font-bold tracking-wider transition-all duration-300 hover:scale-105 bg-white/10 hover:bg-white/20 text-sm"
            style={{ fontFamily: 'Orbitron, sans-serif' }}
          >
            <Swords size={16} />
            NEW ENEMY
          </button>
        </div>
      </div>

      {/* Animation keyframes */}
      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};

export default VictoryScreen;
