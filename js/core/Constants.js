/**
 * GameConstants - Namngivna konstanter för hela spelet
 */

const GameConstants = {
  MAX_CALCULATORS: 3,
  MAX_DEBT_ATTEMPTS: 5,
  MATHBEAST_APPEAR_AFTER: 2,
  MATHBEAST_MAX_ATTEMPTS: 3,

  // Timer (sekunder) per spelarnivå
  TIMER_SECONDS: {
    EASY: 45,    // level 1-2
    MEDIUM: 40,  // level 3-4
    HARD: 35,    // level 5-6
    HARDER: 30,  // level 7-8
    EXPERT: 25,  // level 9+
  },

  // Belöningar
  REWARDS: {
    DEFAULT_XP: 25,
    DEFAULT_GOLD: 10,
    DEBT_XP: 10,
    LEVEL_UP_HP: 10,
  },

  // Dryck-healing
  POTION_HEAL: 50,
  MAGIC_POTION_HEAL: 100,

  // UI
  MAX_INPUT_LENGTH: 500,
  MAX_HISTORY_LENGTH: 50,
  MAX_NAME_LENGTH: 20,
};
