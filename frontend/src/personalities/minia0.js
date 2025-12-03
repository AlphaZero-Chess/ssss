// ═══════════════════════════════════════════════════════════════════════
// MINI-A0 PERSONALITY - Strategic Prodigy (God-Like Edition)
// Strategic depth, patience, flawless endgame, grinding ability
// Source: mini-a0.js
// ═══════════════════════════════════════════════════════════════════════

export const MINI_A0_CONFIG = {
  // Timing - Patient and precise like AlphaZero
  thinkingTimeMin: 80,
  thinkingTimeMax: 600,
  
  // NO MISTAKES - AlphaZero plays flawlessly
  humanMistakeRate: 0,
  
  // Depth - Enhanced for strategic vision and endgame precision
  baseDepth: 15,
  tacticalDepth: 17,
  positionalDepth: 16,
  endgameDepth: 20,           // FLAWLESS endgame - maximum depth
  openingDepth: 13,
  strategicDepth: 18,         // For long-term planning positions
  
  // Speed multipliers - Patient, methodical play
  openingSpeed: 0.25,
  earlyMidSpeed: 0.4,
  middlegameSpeed: 0.55,
  lateMidSpeed: 0.5,
  endgameSpeed: 0.7,          // More time for precise endgame
  criticalSpeed: 0.8,
  grindingSpeed: 0.65,        // For complex grinding positions
  
  // Engine settings - BALANCED
  contempt: 24,               // Balanced - allows strategic draws when best
  multiPV: 4,                 // Analyze top 4 moves for strategic choice
  slowMover: 90,              // Patient, methodical play
  
  // Time thresholds
  panicThreshold: 5000,
  criticalThreshold: 10000,
  
  // AlphaZero Strategic Settings - NOT passive, strategically DEEP
  aggressionFactor: 0.45,     // Strategic, not aggressive
  strategicDepthLevel: 95,    // Strategic depth (0-100)
  positionalPatience: 90,     // Patience in positional play (0-100)
  endgamePrecision: 100,      // FLAWLESS endgame precision
  resilience: 95,             // Defensive resilience
  grindingAbility: 90,        // Ability to grind out positions
  style: 'strategic',
  
  // Positional Bonuses - Superior evaluation
  pieceActivityBonus: 45,     // Active pieces over material
  pawnStructureWeight: 40,    // Long-term pawn structure
  kingSafetyWeight: 50,       // King safety evaluation
  spaceControlBonus: 35,      // Space advantage
  initiativeBonus: 30,        // Maintaining initiative
  prophylaxisBonus: 25,       // Preventing opponent plans
  
  // Draw Handling - Recognizes draws early but plays to confirm
  allowStrategicDraws: true,
  drawConfirmationMoves: 10,
  minAdvantageToPlay: 5       // Centipawns advantage to keep playing
};

// Opening Book - Strategic Repertoire
// Unconventional, strategically deep lines - AlphaZero's signature style
export const MINI_A0_OPENINGS = {
  // Starting position - AlphaZero's versatile openings
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -": {
    white: [
      { move: "e2e4", weight: 0.45 },  // King's pawn - classical
      { move: "d2d4", weight: 0.40 },  // Queen's pawn - strategic depth
      { move: "c2c4", weight: 0.10 },  // English - positional mastery
      { move: "g1f3", weight: 0.05 }   // Reti - hypermodern flexibility
    ]
  },
  // After 1.e4 - Black plays strategically
  "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3": {
    black: [
      { move: "c7c5", weight: 0.35 },  // Sicilian - fighting chess
      { move: "e7e5", weight: 0.30 },  // Open game - classical
      { move: "e7e6", weight: 0.20 },  // French - strategic complexity
      { move: "c7c6", weight: 0.15 }   // Caro-Kann - solid structure
    ]
  },
  // After 1.d4 - Black plays with strategic depth
  "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq d3": {
    black: [
      { move: "g8f6", weight: 0.40 },  // Indian systems - flexible
      { move: "d7d5", weight: 0.35 },  // Classical - principled
      { move: "e7e6", weight: 0.15 },  // Queen's Indian prep
      { move: "g7g6", weight: 0.10 }   // King's Indian - dynamic
    ]
  },
  // Sicilian - White plays strategically
  "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6": {
    white: [
      { move: "g1f3", weight: 0.55 },  // Open Sicilian - main line
      { move: "b1c3", weight: 0.25 },  // Closed - strategic squeeze
      { move: "c2c3", weight: 0.15 },  // Alapin - solid structure
      { move: "d2d4", weight: 0.05 }   // Smith-Morra - initiative
    ]
  },
  // Italian Game position - Strategic development
  "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq -": {
    black: [
      { move: "f8c5", weight: 0.45 },  // Giuoco Piano - classical
      { move: "g8f6", weight: 0.40 },  // Two Knights - active
      { move: "f8e7", weight: 0.15 }   // Hungarian - solid
    ]
  },
  // Queen's Gambit - Strategic handling
  "rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq c3": {
    black: [
      { move: "e7e6", weight: 0.40 },  // QGD - classical fortress
      { move: "c7c6", weight: 0.35 },  // Slav - solid structure
      { move: "d5c4", weight: 0.15 },  // QGA - active play
      { move: "c7c5", weight: 0.10 }   // Tarrasch - dynamic
    ]
  },
  // King's Gambit - Strategic response
  "rnbqkbnr/pppp1ppp/8/4p3/4PP2/8/PPPP2PP/RNBQKBNR b KQkq f3": {
    black: [
      { move: "e5f4", weight: 0.40 },  // Accept - play for advantage
      { move: "d7d5", weight: 0.35 },  // Falkbeer - central counter
      { move: "f8c5", weight: 0.25 }   // Decline - solid development
    ]
  },
  // Evans Gambit position - Strategic evaluation
  "r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq -": {
    white: [
      { move: "c2c3", weight: 0.45 },  // Italian - strategic buildup
      { move: "b2b4", weight: 0.35 },  // Evans Gambit - initiative
      { move: "d2d3", weight: 0.20 }   // Slow Italian - long-term
    ]
  },
  // Ruy Lopez - Patient approach
  "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq -": {
    black: [
      { move: "a7a6", weight: 0.45 },  // Morphy Defense - main line
      { move: "g8f6", weight: 0.35 },  // Berlin - solid endgame
      { move: "d7d6", weight: 0.20 }   // Steinitz - fortress
    ]
  },
  // Scandinavian accepted
  "rnbqkbnr/ppp1pppp/8/3P4/8/8/PPPP1PPP/RNBQKBNR b KQkq -": {
    black: [
      { move: "d8d5", weight: 0.50 },  // Main line - active queen
      { move: "g8f6", weight: 0.50 }   // Modern - development first
    ]
  },
  // French Defense - Strategic pressure
  "rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq -": {
    white: [
      { move: "d2d4", weight: 0.65 },  // Main line - space advantage
      { move: "d2d3", weight: 0.20 },  // King's Indian Attack
      { move: "b1c3", weight: 0.15 }   // Development - flexible
    ]
  },
  // Caro-Kann - Strategic approach
  "rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq -": {
    white: [
      { move: "d2d4", weight: 0.55 },  // Classical - principled
      { move: "b1c3", weight: 0.25 },  // Two Knights - development
      { move: "c2c4", weight: 0.20 }   // Panov - dynamic structure
    ]
  },
  // London System - Patient buildup
  "rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w KQkq d6": {
    white: [
      { move: "c1f4", weight: 0.40 },  // London - solid system
      { move: "g1f3", weight: 0.35 },  // Classical development
      { move: "c2c4", weight: 0.25 }   // Queen's Gambit - main line
    ]
  },
  // King's Indian Defense setup
  "rnbqkb1r/pppppp1p/5np1/8/2PP4/8/PP2PPPP/RNBQKBNR w KQkq -": {
    white: [
      { move: "b1c3", weight: 0.50 },  // Main line - classical
      { move: "g1f3", weight: 0.35 },  // Flexible - Fianchetto option
      { move: "e2e4", weight: 0.15 }   // Four Pawns - ambitious
    ]
  },
  // Nimzo-Indian position
  "rnbqk2r/pppp1ppp/4pn2/8/1bPP4/2N5/PP2PPPP/R1BQKBNR w KQkq -": {
    white: [
      { move: "e2e3", weight: 0.40 },  // Rubinstein - solid
      { move: "d1c2", weight: 0.35 },  // Classical - avoid doubled pawns
      { move: "c1g5", weight: 0.25 }   // Leningrad - active play
    ]
  }
};

export default { config: MINI_A0_CONFIG, openings: MINI_A0_OPENINGS };
