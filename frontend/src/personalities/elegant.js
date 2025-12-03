// ═══════════════════════════════════════════════════════════════════════
// ELEGANT PERSONALITY - AlphaZero Mastery Style
// Positional genius, elegant sacrifices, strategic depth
// Source: Lichess Bot-AlphaZero-Final-elegant.user.js
// ═══════════════════════════════════════════════════════════════════════

export const ELEGANT_CONFIG = {
  // Timing - Confident, calculated responses
  thinkingTimeMin: 150,
  thinkingTimeMax: 800,
  
  // AlphaZero NEVER makes mistakes - perfect calculation
  humanMistakeRate: 0,
  
  // Depth - Maximum strength always
  baseDepth: 18,
  tacticalDepth: 22,
  positionalDepth: 20,
  endgameDepth: 24,
  openingDepth: 16,
  
  // Speed multipliers - Consistent superhuman pace
  openingSpeed: 0.5,
  earlyMidSpeed: 0.6,
  middlegameSpeed: 0.7,
  lateMidSpeed: 0.65,
  endgameSpeed: 0.55,
  criticalSpeed: 0.8,
  
  // Engine settings
  contempt: 30,
  multiPV: 2,
  
  // Style parameters
  aggressionFactor: 0.55, // Lower - more positional
  style: 'positional',
  
  // AlphaZero NEVER panics - maintains full strength always
  panicThreshold: 0,
  criticalThreshold: 0
};

// Opening Book - AlphaZero Signature Repertoire (All ECO Codes)
// Aggressive, Initiative-Based, Pawn Storm Ready
export const ELEGANT_OPENINGS = {
  // === STARTING POSITION (A00-E99) ===
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -": {
    white: [
      { move: "e2e4", weight: 0.55 },
      { move: "d2d4", weight: 0.35 },
      { move: "c2c4", weight: 0.07 },
      { move: "g1f3", weight: 0.03 }
    ]
  },
  
  // === SICILIAN DEFENSE (B20-B99) ===
  "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3": {
    black: [
      { move: "c7c5", weight: 0.55 },
      { move: "e7e5", weight: 0.25 },
      { move: "e7e6", weight: 0.12 },
      { move: "c7c6", weight: 0.08 }
    ]
  },
  "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6": {
    white: [
      { move: "g1f3", weight: 0.50 },
      { move: "b1c3", weight: 0.25 },
      { move: "c2c3", weight: 0.15 },
      { move: "f2f4", weight: 0.10 }
    ]
  },
  "rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq -": {
    black: [
      { move: "d7d6", weight: 0.40 },
      { move: "b8c6", weight: 0.30 },
      { move: "e7e6", weight: 0.20 },
      { move: "g8f6", weight: 0.10 }
    ]
  },
  
  // === QUEEN'S PAWN OPENINGS (D00-D99, E00-E99) ===
  "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq d3": {
    black: [
      { move: "g8f6", weight: 0.45 },
      { move: "d7d5", weight: 0.35 },
      { move: "e7e6", weight: 0.12 },
      { move: "f7f5", weight: 0.08 }
    ]
  },
  "rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq c3": {
    black: [
      { move: "e7e6", weight: 0.40 },
      { move: "c7c6", weight: 0.30 },
      { move: "d5c4", weight: 0.18 },
      { move: "g8f6", weight: 0.12 }
    ]
  },
  
  // === KING'S INDIAN DEFENSE (E60-E99) ===
  "rnbqkbnr/pppppppp/8/8/2P5/8/PP1PPPPP/RNBQKBNR b KQkq c3": {
    black: [
      { move: "g8f6", weight: 0.50 },
      { move: "e7e5", weight: 0.25 },
      { move: "c7c5", weight: 0.15 },
      { move: "e7e6", weight: 0.10 }
    ]
  },
  "rnbqkb1r/pppppppp/5n2/8/2PP4/8/PP2PPPP/RNBQKBNR b KQkq d3": {
    black: [
      { move: "g7g6", weight: 0.45 },
      { move: "e7e6", weight: 0.35 },
      { move: "c7c5", weight: 0.12 },
      { move: "d7d5", weight: 0.08 }
    ]
  },
  
  // === ITALIAN GAME (C50-C54) ===
  "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq -": {
    black: [
      { move: "g8f6", weight: 0.45 },
      { move: "f8c5", weight: 0.40 },
      { move: "f8e7", weight: 0.10 },
      { move: "d7d6", weight: 0.05 }
    ]
  },
  
  // === RUY LOPEZ (C60-C99) ===
  "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq -": {
    black: [
      { move: "a7a6", weight: 0.50 },
      { move: "g8f6", weight: 0.30 },
      { move: "f8c5", weight: 0.12 },
      { move: "d7d6", weight: 0.08 }
    ]
  },
  
  // === FRENCH DEFENSE (C00-C19) ===
  "rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq -": {
    white: [
      { move: "d2d4", weight: 0.60 },
      { move: "b1c3", weight: 0.25 },
      { move: "d2d3", weight: 0.10 },
      { move: "g1f3", weight: 0.05 }
    ]
  },
  
  // === CARO-KANN (B10-B19) ===
  "rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq -": {
    white: [
      { move: "d2d4", weight: 0.55 },
      { move: "b1c3", weight: 0.25 },
      { move: "c2c4", weight: 0.12 },
      { move: "g1f3", weight: 0.08 }
    ]
  },
  
  // === LONDON SYSTEM (D00) ===
  "rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w KQkq d6": {
    white: [
      { move: "c2c4", weight: 0.45 },
      { move: "g1f3", weight: 0.30 },
      { move: "c1f4", weight: 0.15 },
      { move: "b1c3", weight: 0.10 }
    ]
  },
  
  // === NIMZO-INDIAN (E20-E59) ===
  "rnbqkb1r/pppp1ppp/4pn2/8/2PP4/2N5/PP2PPPP/R1BQKBNR b KQkq -": {
    black: [
      { move: "f8b4", weight: 0.55 },
      { move: "f8e7", weight: 0.25 },
      { move: "d7d5", weight: 0.12 },
      { move: "c7c5", weight: 0.08 }
    ]
  },
  
  // === SCOTCH GAME (C44-C45) ===
  "r1bqkbnr/pppp1ppp/2n5/4p3/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq d3": {
    black: [
      { move: "e5d4", weight: 0.60 },
      { move: "d7d6", weight: 0.25 },
      { move: "f8c5", weight: 0.10 },
      { move: "g8f6", weight: 0.05 }
    ]
  },
  
  // === ENGLISH OPENING (A10-A39) ===
  "rnbqkbnr/pppp1ppp/8/4p3/2P5/8/PP1PPPPP/RNBQKBNR w KQkq e6": {
    white: [
      { move: "b1c3", weight: 0.45 },
      { move: "g2g3", weight: 0.30 },
      { move: "g1f3", weight: 0.15 },
      { move: "d2d3", weight: 0.10 }
    ]
  },
  
  // === CATALAN (E00-E09) ===
  "rnbqkb1r/pppp1ppp/4pn2/8/2PP4/6P1/PP2PP1P/RNBQKBNR b KQkq -": {
    black: [
      { move: "d7d5", weight: 0.50 },
      { move: "f8b4", weight: 0.25 },
      { move: "c7c5", weight: 0.15 },
      { move: "d7d6", weight: 0.10 }
    ]
  },
  
  // === GRUNFELD DEFENSE (D70-D99) ===
  "rnbqkb1r/ppp1pppp/5n2/3p4/2PP4/2N5/PP2PPPP/R1BQKBNR w KQkq d6": {
    white: [
      { move: "c4d5", weight: 0.45 },
      { move: "g1f3", weight: 0.30 },
      { move: "c1f4", weight: 0.15 },
      { move: "d4d5", weight: 0.10 }
    ]
  },
  
  // === ADVANCED MIDDLEGAME ===
  "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq -": {
    white: [
      { move: "d2d3", weight: 0.40 },
      { move: "b1c3", weight: 0.30 },
      { move: "c2c3", weight: 0.20 },
      { move: "d2d4", weight: 0.10 }
    ]
  },
  
  // === DRAGON SICILIAN (B70-B79) ===
  "rnbqkb1r/pp2pp1p/3p1np1/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq -": {
    white: [
      { move: "f2f3", weight: 0.40 },
      { move: "c1e3", weight: 0.35 },
      { move: "f1c4", weight: 0.15 },
      { move: "f1e2", weight: 0.10 }
    ]
  },
  
  // === NAJDORF SICILIAN (B90-B99) ===
  "rnbqkb1r/1p2pppp/p2p1n2/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq -": {
    white: [
      { move: "c1e3", weight: 0.35 },
      { move: "f1e2", weight: 0.30 },
      { move: "f2f3", weight: 0.20 },
      { move: "c1g5", weight: 0.15 }
    ]
  }
};

export default { config: ELEGANT_CONFIG, openings: ELEGANT_OPENINGS };
