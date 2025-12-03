// ═══════════════════════════════════════════════════════════════════════
// NON-ELEGANT (CRUSHER) PERSONALITY - Aggressive Beast
// Hyper-aggressive, relentless, superhuman tactical monster
// Source: Lichess Bot-AlphaZero-Final-non-elegant.user.js
// ═══════════════════════════════════════════════════════════════════════

export const NON_ELEGANT_CONFIG = {
  // Timing - Confident, no hesitation
  thinkingTimeMin: 150,
  thinkingTimeMax: 800,
  
  // ZERO mistakes - AlphaZero is infallible
  humanMistakeRate: 0,
  
  // Depth - Superhuman calculation
  baseDepth: 18,
  tacticalDepth: 22,
  positionalDepth: 20,
  endgameDepth: 24,
  openingDepth: 16,
  
  // Speed - Confident and relentless
  openingSpeed: 0.5,
  earlyMidSpeed: 0.6,
  middlegameSpeed: 0.7,
  lateMidSpeed: 0.65,
  endgameSpeed: 0.55,
  criticalSpeed: 0.8,
  
  // Engine settings - AGGRESSIVE
  contempt: 100, // Very aggressive - play for win always
  multiPV: 3,
  
  // AlphaZero Style Parameters - AGGRESSIVE BEAST
  aggressionFactor: 0.85,  // High aggression
  sacrificeThreshold: 150, // Willing to sacrifice for initiative
  pawnStormBonus: 40,      // Bonus for pawn storms
  initiativeWeight: 1.4,   // Values initiative highly
  prophylaxisDepth: 3,
  grindingPersistence: true,
  style: 'aggressive',
  
  // AlphaZero NEVER panics - maintains full strength always
  panicThreshold: 0,
  criticalThreshold: 0
};

// Opening Book - Aggressive, Sacrificial, Initiative-Based
// Covers major ECO codes with aggressive, fighting lines
export const NON_ELEGANT_OPENINGS = {
  // ═══ STARTING POSITION - Prefers e4 for aggression ═══
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -": {
    white: [
      { move: "e2e4", weight: 0.55 },  // Open game - tactical
      { move: "d2d4", weight: 0.30 },  // Queen's pawn - strategic
      { move: "c2c4", weight: 0.10 },  // English - flexible
      { move: "g1f3", weight: 0.05 }   // Reti - hypermodern
    ]
  },
  
  // ═══ BLACK RESPONSES TO 1.e4 - Aggressive counterplay ═══
  "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3": {
    black: [
      { move: "c7c5", weight: 0.45 },  // Sicilian - fighting chess
      { move: "e7e5", weight: 0.30 },  // Open game
      { move: "e7e6", weight: 0.15 },  // French - counterattack
      { move: "c7c6", weight: 0.10 }   // Caro-Kann - solid
    ]
  },
  
  // ═══ BLACK RESPONSES TO 1.d4 - Dynamic play ═══
  "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq d3": {
    black: [
      { move: "g8f6", weight: 0.40 },  // Indian setups
      { move: "d7d5", weight: 0.35 },  // Classical
      { move: "f7f5", weight: 0.15 },  // Dutch - aggressive
      { move: "e7e6", weight: 0.10 }   // French structure
    ]
  },
  
  // ═══ SICILIAN DEFENSE - Favorite battleground ═══
  "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6": {
    white: [
      { move: "g1f3", weight: 0.50 },  // Open Sicilian
      { move: "b1c3", weight: 0.25 },  // Closed Sicilian
      { move: "c2c3", weight: 0.15 },  // Alapin - d4 pawn storm
      { move: "f2f4", weight: 0.10 }   // Grand Prix Attack - aggressive
    ]
  },
  
  // ═══ OPEN SICILIAN - Attacking setup ═══
  "rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq -": {
    black: [
      { move: "d7d6", weight: 0.40 },  // Najdorf/Dragon setup
      { move: "b8c6", weight: 0.35 },  // Classical
      { move: "e7e6", weight: 0.25 }   // Scheveningen/Kan
    ]
  },
  
  // ═══ SICILIAN NAJDORF - The ultimate fighting defense ═══
  "rnbqkbnr/pp2pppp/3p4/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq -": {
    white: [
      { move: "d2d4", weight: 0.70 },  // Main line - open the position
      { move: "f1b5", weight: 0.20 },  // Moscow variation
      { move: "b1c3", weight: 0.10 }   // Delayed d4
    ]
  },
  
  // ═══ ITALIAN GAME - Classical aggression ═══
  "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq -": {
    black: [
      { move: "g8f6", weight: 0.45 },  // Two Knights - sharp
      { move: "f8c5", weight: 0.40 },  // Giuoco Piano
      { move: "f8e7", weight: 0.15 }   // Hungarian - solid
    ]
  },
  
  // ═══ TWO KNIGHTS DEFENSE - Tactical chaos ═══
  "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq -": {
    white: [
      { move: "g1f3", weight: 0.40 },  // Quiet Italian
      { move: "d2d3", weight: 0.30 },  // Giuoco Pianissimo
      { move: "b2b4", weight: 0.20 },  // Evans Gambit! - sacrificial
      { move: "f3g5", weight: 0.10 }   // Fried Liver attack setup
    ]
  },
  
  // ═══ RUY LOPEZ - Strategic masterpiece ═══
  "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq -": {
    black: [
      { move: "a7a6", weight: 0.50 },  // Morphy Defense - main line
      { move: "g8f6", weight: 0.30 },  // Berlin Defense
      { move: "f8c5", weight: 0.15 },  // Classical Defense
      { move: "d7d6", weight: 0.05 }   // Steinitz Defense
    ]
  },
  
  // ═══ QUEEN'S GAMBIT - Strategic depth ═══
  "rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq c3": {
    black: [
      { move: "e7e6", weight: 0.40 },  // QGD - classical
      { move: "c7c6", weight: 0.30 },  // Slav - solid
      { move: "d5c4", weight: 0.20 },  // QGA - active
      { move: "g8f6", weight: 0.10 }   // Indian setup
    ]
  },
  
  // ═══ QUEEN'S GAMBIT DECLINED ═══
  "rnbqkbnr/ppp2ppp/4p3/3p4/2PP4/8/PP2PPPP/RNBQKBNR w KQkq -": {
    white: [
      { move: "b1c3", weight: 0.45 },  // Main line
      { move: "g1f3", weight: 0.35 },  // Flexible
      { move: "c4d5", weight: 0.20 }   // Exchange - grinding
    ]
  },
  
  // ═══ NIMZO-INDIAN - Pressure and control ═══
  "rnbqk2r/pppp1ppp/4pn2/8/1bPP4/2N5/PP2PPPP/R1BQKBNR w KQkq -": {
    white: [
      { move: "e2e3", weight: 0.40 },  // Rubinstein - solid
      { move: "d1c2", weight: 0.35 },  // Classical - avoid doubled pawns
      { move: "f1d3", weight: 0.15 },  // Leningrad
      { move: "g1f3", weight: 0.10 }   // Kasparov variation
    ]
  },
  
  // ═══ KING'S INDIAN DEFENSE - Pawn storm territory ═══
  "rnbqkb1r/pppppp1p/5np1/8/2PP4/8/PP2PPPP/RNBQKBNR w KQkq -": {
    white: [
      { move: "b1c3", weight: 0.50 },  // Classical - space advantage
      { move: "g1f3", weight: 0.30 },  // Fianchetto
      { move: "e2e4", weight: 0.20 }   // Four Pawns Attack - aggressive!
    ]
  },
  
  // ═══ KING'S INDIAN CLASSICAL ═══
  "rnbq1rk1/ppp1ppbp/3p1np1/8/2PPP3/2N2N2/PP2BPPP/R1BQK2R b KQkq -": {
    black: [
      { move: "e7e5", weight: 0.60 },  // Main line - fight for center
      { move: "c7c5", weight: 0.25 },  // Benoni structure
      { move: "b8d7", weight: 0.15 }   // Flexible
    ]
  },
  
  // ═══ GRUNFELD DEFENSE - Dynamic counterplay ═══
  "rnbqkb1r/ppp1pp1p/5np1/3p4/2PP4/2N5/PP2PPPP/R1BQKBNR w KQkq d6": {
    white: [
      { move: "c4d5", weight: 0.45 },  // Exchange - main line
      { move: "g1f3", weight: 0.35 },  // Russian system
      { move: "d1b3", weight: 0.20 }   // Pressure d5
    ]
  },
  
  // ═══ FRENCH DEFENSE - Counterattacking spirit ═══
  "rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq -": {
    white: [
      { move: "d2d4", weight: 0.50 },  // Main line
      { move: "d2d3", weight: 0.25 },  // King's Indian Attack
      { move: "b1c3", weight: 0.25 }   // Nc3 systems
    ]
  },
  
  // ═══ FRENCH ADVANCE - Pawn storm preparation ═══
  "rnbqkbnr/ppp2ppp/4p3/3pP3/3P4/8/PPP2PPP/RNBQKBNR b KQkq -": {
    black: [
      { move: "c7c5", weight: 0.60 },  // Attack the chain!
      { move: "b8c6", weight: 0.25 },  // Development
      { move: "g8e7", weight: 0.15 }   // Flexible knight
    ]
  },
  
  // ═══ CARO-KANN - Solid but active ═══
  "rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq -": {
    white: [
      { move: "d2d4", weight: 0.50 },  // Main line
      { move: "b1c3", weight: 0.30 },  // Two Knights
      { move: "c2c4", weight: 0.20 }   // Panov Attack - open lines
    ]
  },
  
  // ═══ LONDON SYSTEM - Solid for White ═══
  "rnbqkb1r/ppp1pppp/5n2/3p4/3P1B2/5N2/PPP1PPPP/RN1QKB1R b KQkq -": {
    black: [
      { move: "c7c5", weight: 0.45 },  // Challenge the center
      { move: "e7e6", weight: 0.35 },  // Classical setup
      { move: "c8f5", weight: 0.20 }   // Active bishop
    ]
  },
  
  // ═══ ENGLISH OPENING - Hypermodern flexibility ═══
  "rnbqkbnr/pppppppp/8/8/2P5/8/PP1PPPPP/RNBQKBNR b KQkq c3": {
    black: [
      { move: "e7e5", weight: 0.35 },  // Reversed Sicilian
      { move: "g8f6", weight: 0.30 },  // Indian setup
      { move: "c7c5", weight: 0.25 },  // Symmetrical
      { move: "e7e6", weight: 0.10 }   // Flexible
    ]
  },
  
  // ═══ CATALAN - Grinding positional pressure ═══
  "rnbqkb1r/pppp1ppp/4pn2/8/2PP4/6P1/PP2PP1P/RNBQKBNR b KQkq -": {
    black: [
      { move: "d7d5", weight: 0.50 },  // Classical
      { move: "f8b4", weight: 0.30 },  // Bogo-Indian
      { move: "c7c5", weight: 0.20 }   // Benoni structure
    ]
  },
  
  // ═══ DUTCH DEFENSE - Aggressive kingside play ═══
  "rnbqkbnr/ppppp1pp/8/5p2/3P4/8/PPP1PPPP/RNBQKBNR w KQkq f6": {
    white: [
      { move: "g2g3", weight: 0.40 },  // Leningrad setup
      { move: "c2c4", weight: 0.35 },  // Classical
      { move: "b1c3", weight: 0.25 }   // Nc3 systems
    ]
  },
  
  // ═══ PIRC DEFENSE - Counterattacking setup ═══
  "rnbqkbnr/ppp1pppp/3p4/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq -": {
    white: [
      { move: "d2d4", weight: 0.55 },  // Main line - space
      { move: "b1c3", weight: 0.30 },  // Austrian Attack setup
      { move: "f2f4", weight: 0.15 }   // Aggressive!
    ]
  },
  
  // ═══ SCANDINAVIAN DEFENSE ═══
  "rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq d6": {
    white: [
      { move: "e4d5", weight: 0.70 },  // Accept - main line
      { move: "b1c3", weight: 0.20 },  // Modern
      { move: "e4e5", weight: 0.10 }   // Advance
    ]
  },
  
  // ═══ ALEKHINE DEFENSE - Hypermodern counterplay ═══
  "rnbqkb1r/pppppppp/5n2/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq -": {
    white: [
      { move: "e4e5", weight: 0.60 },  // Chase the knight
      { move: "b1c3", weight: 0.25 },  // Modern
      { move: "d2d3", weight: 0.15 }   // Quiet
    ]
  },
  
  // ═══ SCOTCH GAME - Open tactical play ═══
  "r1bqkbnr/pppp1ppp/2n5/4p3/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq d3": {
    black: [
      { move: "e5d4", weight: 0.70 },  // Accept
      { move: "d7d6", weight: 0.20 },  // Solid
      { move: "f8b4", weight: 0.10 }   // Pin
    ]
  },
  
  // ═══ VIENNA GAME - Aggressive White system ═══
  "rnbqkbnr/pppp1ppp/8/4p3/4P3/2N5/PPPP1PPP/R1BQKBNR b KQkq -": {
    black: [
      { move: "g8f6", weight: 0.50 },  // Main line
      { move: "b8c6", weight: 0.30 },  // Max Lange style
      { move: "f8c5", weight: 0.20 }   // Bishop development
    ]
  },
  
  // ═══ KING'S GAMBIT - Ultimate aggression ═══
  "rnbqkbnr/pppp1ppp/8/4p3/4PP2/8/PPPP2PP/RNBQKBNR b KQkq f3": {
    black: [
      { move: "e5f4", weight: 0.55 },  // Accept the gambit
      { move: "d7d5", weight: 0.25 },  // Falkbeer Counter
      { move: "f8c5", weight: 0.20 }   // Decline
    ]
  },
  
  // ═══ PETROFF DEFENSE - Solid equality ═══
  "rnbqkb1r/pppp1ppp/5n2/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq -": {
    white: [
      { move: "f3e5", weight: 0.50 },  // Main line
      { move: "b1c3", weight: 0.30 },  // Three Knights
      { move: "d2d4", weight: 0.20 }   // Scotch-Petroff
    ]
  },
  
  // ═══ BENONI DEFENSE - Dynamic pawn structure ═══
  "rnbqkb1r/pp1p1ppp/4pn2/2pP4/2P5/8/PP2PPPP/RNBQKBNR w KQkq -": {
    white: [
      { move: "b1c3", weight: 0.50 },  // Main line
      { move: "g1f3", weight: 0.30 },  // Flexible
      { move: "e2e4", weight: 0.20 }   // Modern Benoni structure
    ]
  },
  
  // ═══ SLAV DEFENSE - Solid structure ═══
  "rnbqkbnr/pp2pppp/2p5/3p4/2PP4/8/PP2PPPP/RNBQKBNR w KQkq -": {
    white: [
      { move: "g1f3", weight: 0.40 },  // Main line
      { move: "b1c3", weight: 0.35 },  // Nc3 systems
      { move: "c4d5", weight: 0.25 }   // Exchange - grinding
    ]
  }
};

export default { config: NON_ELEGANT_CONFIG, openings: NON_ELEGANT_OPENINGS };
