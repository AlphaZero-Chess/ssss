// ═══════════════════════════════════════════════════════════════════════
// THE PURE ALPHAZERO - Hidden Master Personality
// The Original Algorithm - Fearless, Intuitive, Beautiful Chess
// Based on deep research of real AlphaZero's playing characteristics
// ═══════════════════════════════════════════════════════════════════════
// 
// AUTHENTIC ALPHAZERO CHARACTERISTICS:
// - Fearless swashbuckling style with elegant sacrifices
// - Neural intuition over brute-force calculation
// - Famous h4-h5 pawn storms on kingside
// - Exchange sacrifices (Rook for minor piece) for positional dominance
// - Bishop pair activation through pawn sacrifices
// - Initiative and piece activity valued over material
// - Consistent purpose from first move - plays with deliberate style
// - Convergent on deep strategic truths through self-play
// ═══════════════════════════════════════════════════════════════════════

export const ALPHAZERO_CONFIG = {
  // Timing - Confident, deliberate, with neural network "intuition"
  // AlphaZero evaluates ~80,000 positions/sec vs Stockfish's 70 million
  // But makes better decisions through pattern recognition
  thinkingTimeMin: 200,
  thinkingTimeMax: 1000,
  
  // FLAWLESS - The original algorithm never errs
  humanMistakeRate: 0,
  
  // Depth - Maximum neural-guided calculation
  baseDepth: 20,
  tacticalDepth: 24,
  positionalDepth: 22,
  endgameDepth: 26,
  openingDepth: 18,
  strategicDepth: 24,
  
  // Speed multipliers - Deliberate, purposeful play
  openingSpeed: 0.4,         // Theory-aware but creative
  earlyMidSpeed: 0.5,        // Building pressure
  middlegameSpeed: 0.65,     // Peak intuition phase
  lateMidSpeed: 0.6,         // Transitional precision
  endgameSpeed: 0.8,         // Flawless technique
  criticalSpeed: 0.75,       // Never panics
  sacrificeSpeed: 0.55,      // Calculated boldness
  
  // Engine settings - INITIATIVE-FOCUSED
  contempt: 50,              // Plays for win but knows when to draw
  multiPV: 3,                // Considers alternatives
  slowMover: 85,             // Patient but purposeful
  
  // Time thresholds - Unshakeable confidence
  panicThreshold: 0,         // AlphaZero NEVER panics
  criticalThreshold: 0,      // Maintains strength always
  
  // ═══ THE AUTHENTIC ALPHAZERO STYLE PARAMETERS ═══
  
  // Core Philosophy: Initiative > Material
  aggressionFactor: 0.70,           // Aggressive but controlled
  initiativeWeight: 1.8,            // HIGHLY values initiative
  pieceActivityBonus: 60,           // Active pieces over material
  
  // Famous Sacrifice Tendencies
  sacrificeThreshold: 100,          // Willing to sacrifice for compensation
  exchangeSacrificeBonus: 45,       // Rook for minor piece when advantageous
  pawnSacrificeBonus: 35,           // Pawns for initiative
  
  // The Legendary h4-h5 Pawn Storms
  pawnStormBonus: 55,               // Famous kingside storms
  kingsideAttackWeight: 1.5,        // Kingside aggression
  
  // Bishop Pair Mastery
  bishopPairBonus: 40,              // Highly values bishop pair
  longDiagonalControl: 35,          // Diagonal domination
  
  // Positional Understanding
  pawnStructureWeight: 45,          // Long-term structure evaluation
  kingSafetyWeight: 55,             // King safety paramount
  spaceControlBonus: 40,            // Space advantage
  prophylaxisBonus: 35,             // Preventing opponent plans
  centralControlBonus: 40,          // Central domination
  
  // Dynamic Play
  mobilityWeight: 50,               // Piece mobility crucial
  coordinationBonus: 45,            // Piece harmony
  pressureBonus: 40,                // Constant pressure
  
  // Strategic Depth
  strategicDepthLevel: 100,         // Maximum strategic vision
  positionalPatience: 85,           // Patient building
  endgamePrecision: 100,            // Flawless endgame
  resilience: 95,                   // Defensive strength
  grindingAbility: 90,              // Can grind out wins
  
  // Neural Network "Intuition"
  intuitionFactor: 100,             // Maximum pattern recognition
  creativityBonus: 50,              // Novel ideas
  
  style: 'neural-intuitive',
  
  // Draw Handling - Will draw when appropriate but fights
  allowStrategicDraws: true,
  drawConfirmationMoves: 15,
  minAdvantageToPlay: 3
};

// ═══════════════════════════════════════════════════════════════════════
// OPENING BOOK - AlphaZero's Authentic Repertoire
// Based on actual AlphaZero game preferences from research:
// - English Opening (1.c4) - Favorite weapon
// - Queen's Gambit systems - Strategic depth
// - King's Indian/Grünfeld setups - Pawn storm preparation
// - h4-h5 attacking plans in all structures
// ═══════════════════════════════════════════════════════════════════════

export const ALPHAZERO_OPENINGS = {
  // ═══ STARTING POSITION - The Algorithm's First Choice ═══
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -": {
    white: [
      { move: "d2d4", weight: 0.40 },  // Queen's pawn - strategic depth
      { move: "c2c4", weight: 0.30 },  // English Opening - AlphaZero's weapon
      { move: "e2e4", weight: 0.20 },  // King's pawn - tactical potential
      { move: "g1f3", weight: 0.10 }   // Reti - hypermodern flexibility
    ]
  },
  
  // ═══ ENGLISH OPENING SYSTEMS - AlphaZero's Specialty ═══
  "rnbqkbnr/pppppppp/8/8/2P5/8/PP1PPPPP/RNBQKBNR b KQkq c3": {
    black: [
      { move: "e7e5", weight: 0.35 },  // Reversed Sicilian
      { move: "g8f6", weight: 0.30 },  // Indian setup
      { move: "c7c5", weight: 0.20 },  // Symmetrical English
      { move: "e7e6", weight: 0.15 }   // Flexible
    ]
  },
  
  // English vs e5 - AlphaZero's pawn storm preparation
  "rnbqkbnr/pppp1ppp/8/4p3/2P5/8/PP1PPPPP/RNBQKBNR w KQkq e6": {
    white: [
      { move: "b1c3", weight: 0.40 },  // Main line - prepare d3, g3, Bg2
      { move: "g2g3", weight: 0.35 },  // Fianchetto - diagonal control
      { move: "g1f3", weight: 0.20 },  // Development
      { move: "d2d3", weight: 0.05 }   // Closed system
    ]
  },
  
  // ═══ BLACK RESPONSES TO 1.e4 ═══
  "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3": {
    black: [
      { move: "c7c5", weight: 0.40 },  // Sicilian - fighting chess
      { move: "e7e5", weight: 0.30 },  // Open game - classical
      { move: "c7c6", weight: 0.15 },  // Caro-Kann - solid structure
      { move: "e7e6", weight: 0.15 }   // French - counterplay
    ]
  },
  
  // ═══ BLACK RESPONSES TO 1.d4 - The Indian Systems ═══
  "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq d3": {
    black: [
      { move: "g8f6", weight: 0.45 },  // Indian systems - flexible, strategic
      { move: "d7d5", weight: 0.30 },  // Classical - principled
      { move: "g7g6", weight: 0.15 },  // Modern/KID setup
      { move: "f7f5", weight: 0.10 }   // Dutch - aggressive
    ]
  },
  
  // ═══ QUEEN'S GAMBIT - AlphaZero's Strategic Mastery ═══
  "rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq c3": {
    black: [
      { move: "e7e6", weight: 0.40 },  // QGD - AlphaZero's favorite defense
      { move: "c7c6", weight: 0.30 },  // Slav - solid pawn structure
      { move: "d5c4", weight: 0.15 },  // QGA - active piece play
      { move: "g8f6", weight: 0.15 }   // Indian setup
    ]
  },
  
  // QGD Main Line - Deep strategic play
  "rnbqkbnr/ppp2ppp/4p3/3p4/2PP4/8/PP2PPPP/RNBQKBNR w KQkq -": {
    white: [
      { move: "b1c3", weight: 0.40 },  // Main line - development
      { move: "g1f3", weight: 0.35 },  // Flexible approach
      { move: "c4d5", weight: 0.15 },  // Exchange - grinding
      { move: "c1g5", weight: 0.10 }   // Early pin
    ]
  },
  
  // ═══ KING'S INDIAN DEFENSE - H4-H5 STORM TERRITORY ═══
  "rnbqkb1r/pppppp1p/5np1/8/2PP4/8/PP2PPPP/RNBQKBNR w KQkq -": {
    white: [
      { move: "b1c3", weight: 0.45 },  // Classical - pawn storm prep
      { move: "g1f3", weight: 0.30 },  // Fianchetto system
      { move: "e2e4", weight: 0.20 },  // Four Pawns - aggressive!
      { move: "g2g3", weight: 0.05 }   // Fianchetto
    ]
  },
  
  // KID Classical - The pawn storm begins
  "rnbq1rk1/ppp1ppbp/3p1np1/8/2PPP3/2N2N2/PP2BPPP/R1BQK2R w KQ -": {
    white: [
      { move: "e1g1", weight: 0.45 },  // Castle then h4!
      { move: "h2h4", weight: 0.35 },  // THE FAMOUS H4-H5 STORM
      { move: "c1e3", weight: 0.15 },  // Development
      { move: "d1d2", weight: 0.05 }   // Queenside plan
    ]
  },
  
  // KID h4 Attack - AlphaZero's signature
  "rnbq1rk1/ppp1ppbp/3p1np1/8/2PPP2P/2N2N2/PP2BPP1/R1BQK2R b KQ h3": {
    black: [
      { move: "e7e5", weight: 0.50 },  // Counter in center
      { move: "c7c5", weight: 0.25 },  // Queenside play
      { move: "b8c6", weight: 0.15 },  // Development
      { move: "a7a6", weight: 0.10 }   // Prepare b5
    ]
  },
  
  // ═══ GRÜNFELD DEFENSE - Dynamic Counterplay ═══
  "rnbqkb1r/ppp1pp1p/5np1/3p4/2PP4/2N5/PP2PPPP/R1BQKBNR w KQkq d6": {
    white: [
      { move: "c4d5", weight: 0.40 },  // Exchange - AlphaZero's choice
      { move: "g1f3", weight: 0.30 },  // Russian system
      { move: "c1f4", weight: 0.15 },  // Early development
      { move: "d1b3", weight: 0.15 }   // Pressure d5
    ]
  },
  
  // Grünfeld Exchange - Strategic grinding
  "rnbqkb1r/ppp1pp1p/6p1/3n4/3P4/2N5/PP2PPPP/R1BQKBNR w KQkq -": {
    white: [
      { move: "e2e4", weight: 0.50 },  // Central domination
      { move: "g1f3", weight: 0.30 },  // Development
      { move: "c1c4", weight: 0.20 }   // Bishop activity
    ]
  },
  
  // ═══ SICILIAN DEFENSE SYSTEMS ═══
  "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6": {
    white: [
      { move: "g1f3", weight: 0.45 },  // Open Sicilian
      { move: "b1c3", weight: 0.25 },  // Closed - positional
      { move: "c2c3", weight: 0.20 },  // Alapin - solid structure
      { move: "f2f4", weight: 0.10 }   // Grand Prix - aggressive
    ]
  },
  
  // Open Sicilian - Fighting chess
  "rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq -": {
    black: [
      { move: "d7d6", weight: 0.40 },  // Najdorf/Dragon setup
      { move: "b8c6", weight: 0.30 },  // Classical
      { move: "e7e6", weight: 0.25 },  // Scheveningen
      { move: "g8f6", weight: 0.05 }   // Hyperaccelerated
    ]
  },
  
  // Dragon Sicilian - h4-h5 attack
  "rnbqkb1r/pp2pp1p/3p1np1/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq -": {
    white: [
      { move: "f2f3", weight: 0.35 },  // Yugoslav Attack prep
      { move: "c1e3", weight: 0.35 },  // Yugoslav Attack
      { move: "f1c4", weight: 0.20 },  // Classical
      { move: "f1e2", weight: 0.10 }   // Quiet
    ]
  },
  
  // Yugoslav Attack - The storm
  "rnbqkb1r/pp2pp1p/3p1np1/8/3NP3/2N1B3/PPP2PPP/R2QKB1R b KQkq -": {
    black: [
      { move: "f8g7", weight: 0.50 },  // Fianchetto
      { move: "b8c6", weight: 0.30 },  // Development
      { move: "e8g8", weight: 0.20 }   // Castle
    ]
  },
  
  // ═══ ITALIAN GAME - Elegant Classical Play ═══
  "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq -": {
    black: [
      { move: "g8f6", weight: 0.45 },  // Two Knights - sharp
      { move: "f8c5", weight: 0.40 },  // Giuoco Piano
      { move: "d7d6", weight: 0.15 }   // Solid
    ]
  },
  
  // Giuoco Piano
  "r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq -": {
    white: [
      { move: "c2c3", weight: 0.45 },  // Italian - central play
      { move: "d2d3", weight: 0.30 },  // Slow Italian
      { move: "b2b4", weight: 0.25 }   // Evans Gambit! - Sacrifice
    ]
  },
  
  // ═══ RUY LOPEZ - Strategic Depth ═══
  "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq -": {
    black: [
      { move: "a7a6", weight: 0.45 },  // Morphy Defense
      { move: "g8f6", weight: 0.35 },  // Berlin - solid
      { move: "f8c5", weight: 0.15 },  // Classical
      { move: "d7d6", weight: 0.05 }   // Steinitz
    ]
  },
  
  // Berlin Defense - AlphaZero respects this
  "r1bqkb1r/pppp1ppp/2n2n2/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq -": {
    white: [
      { move: "e1g1", weight: 0.50 },  // Castle - strategic
      { move: "d2d3", weight: 0.30 },  // Slow buildup
      { move: "f3e5", weight: 0.20 }   // Berlin endgame
    ]
  },
  
  // ═══ NIMZO-INDIAN - Pressure and Control ═══
  "rnbqk2r/pppp1ppp/4pn2/8/1bPP4/2N5/PP2PPPP/R1BQKBNR w KQkq -": {
    white: [
      { move: "e2e3", weight: 0.40 },  // Rubinstein - solid
      { move: "d1c2", weight: 0.35 },  // Classical
      { move: "c1g5", weight: 0.15 },  // Leningrad
      { move: "g1f3", weight: 0.10 }   // Kasparov
    ]
  },
  
  // ═══ CATALAN - Grinding Positional Pressure ═══
  "rnbqkb1r/pppp1ppp/4pn2/8/2PP4/6P1/PP2PP1P/RNBQKBNR b KQkq -": {
    black: [
      { move: "d7d5", weight: 0.50 },  // Classical
      { move: "f8b4", weight: 0.25 },  // Bogo-Indian
      { move: "c7c5", weight: 0.15 },  // Benoni
      { move: "d7d6", weight: 0.10 }   // King's Indian
    ]
  },
  
  // ═══ LONDON SYSTEM - Solid Development ═══
  "rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w KQkq d6": {
    white: [
      { move: "c1f4", weight: 0.35 },  // London - solid
      { move: "c2c4", weight: 0.35 },  // Queen's Gambit
      { move: "g1f3", weight: 0.20 },  // Development
      { move: "b1c3", weight: 0.10 }   // Flexible
    ]
  },
  
  // ═══ FRENCH DEFENSE - Controlled Aggression ═══
  "rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq -": {
    white: [
      { move: "d2d4", weight: 0.55 },  // Main line - space
      { move: "d2d3", weight: 0.25 },  // King's Indian Attack
      { move: "b1c3", weight: 0.20 }   // Nc3 systems
    ]
  },
  
  // French Advance - Pawn chain play
  "rnbqkbnr/ppp2ppp/4p3/3pP3/3P4/8/PPP2PPP/RNBQKBNR b KQkq -": {
    black: [
      { move: "c7c5", weight: 0.55 },  // Attack the chain!
      { move: "b8c6", weight: 0.25 },  // Development
      { move: "g8e7", weight: 0.20 }   // Flexible knight
    ]
  },
  
  // ═══ CARO-KANN - Solid Structure ═══
  "rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq -": {
    white: [
      { move: "d2d4", weight: 0.50 },  // Classical
      { move: "b1c3", weight: 0.30 },  // Two Knights
      { move: "c2c4", weight: 0.20 }   // Panov Attack
    ]
  },
  
  // ═══ SCOTCH GAME - Open Tactical Play ═══
  "r1bqkbnr/pppp1ppp/2n5/4p3/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq d3": {
    black: [
      { move: "e5d4", weight: 0.65 },  // Accept
      { move: "d7d6", weight: 0.20 },  // Solid
      { move: "g8f6", weight: 0.15 }   // Development
    ]
  },
  
  // ═══ KING'S GAMBIT - Ultimate Sacrifice ═══
  "rnbqkbnr/pppp1ppp/8/4p3/4PP2/8/PPPP2PP/RNBQKBNR b KQkq f3": {
    black: [
      { move: "e5f4", weight: 0.50 },  // Accept - play for advantage
      { move: "d7d5", weight: 0.30 },  // Falkbeer Counter
      { move: "f8c5", weight: 0.20 }   // Decline - solid
    ]
  },
  
  // ═══ BENONI DEFENSE - Dynamic Pawn Structure ═══
  "rnbqkb1r/pp1p1ppp/4pn2/2pP4/2P5/8/PP2PPPP/RNBQKBNR w KQkq -": {
    white: [
      { move: "b1c3", weight: 0.45 },  // Main line
      { move: "g1f3", weight: 0.35 },  // Flexible
      { move: "e2e4", weight: 0.20 }   // Modern Benoni
    ]
  },
  
  // ═══ SLAV DEFENSE - Solid Structure ═══
  "rnbqkbnr/pp2pppp/2p5/3p4/2PP4/8/PP2PPPP/RNBQKBNR w KQkq -": {
    white: [
      { move: "g1f3", weight: 0.40 },  // Main line
      { move: "b1c3", weight: 0.35 },  // Nc3 systems
      { move: "c4d5", weight: 0.25 }   // Exchange - grinding
    ]
  },
  
  // ═══ DUTCH DEFENSE - Aggressive Kingside ═══
  "rnbqkbnr/ppppp1pp/8/5p2/3P4/8/PPP1PPPP/RNBQKBNR w KQkq f6": {
    white: [
      { move: "g2g3", weight: 0.40 },  // Leningrad system
      { move: "c2c4", weight: 0.35 },  // Classical
      { move: "b1c3", weight: 0.25 }   // Nc3 systems
    ]
  },
  
  // ═══ ADVANCED MIDDLEGAME STRUCTURES ═══
  
  // Isolated Queen Pawn - AlphaZero loves piece activity here
  "r1bqkb1r/pp3ppp/2n1pn2/3p4/3P4/2N2N2/PP2PPPP/R1BQKB1R w KQkq -": {
    white: [
      { move: "c1g5", weight: 0.40 },  // Pin and pressure
      { move: "e2e3", weight: 0.35 },  // Solid
      { move: "f1d3", weight: 0.25 }   // Active development
    ]
  }
};

export default { config: ALPHAZERO_CONFIG, openings: ALPHAZERO_OPENINGS };
