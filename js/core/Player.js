/**
 * Player - Spelarens tillstånd
 */

class Player {
  static XP_PER_LEVEL = [0, 100, 250, 500, 800, 1200, 1700, 2300, 3000, 4000];

  constructor(name) {
    this.name = name;
    this.level = 1;
    this.xp = 0;
    this.gold = 10;
    this.hp = 100;
    this.maxHp = 100;
    this.inventory = [];
    this.currentRoom = 'akademin_hall';
    this.solvedPuzzles = new Set();
    this.wrongAnswers = 0;
    this.currentChallengeErrors = 0;
    this.calculators = 0;
    this.calculatorDebt = [];
  }

  addXp(amount) {
    this.xp += amount;
    let leveledUp = false;

    while (this.level < Player.XP_PER_LEVEL.length) {
      const threshold = Player.XP_PER_LEVEL[this.level];
      if (this.xp >= threshold) {
        this.level++;
        this.maxHp += 10;
        this.hp = this.maxHp;
        leveledUp = true;
      } else {
        break;
      }
    }
    return leveledUp;
  }

  addGold(amount) {
    this.gold += amount;
  }

  addItem(item) {
    this.inventory.push(item);
  }

  hasItem(itemName) {
    const lower = itemName.toLowerCase();
    return this.inventory.some(item => item.toLowerCase().includes(lower));
  }

  findItem(itemName) {
    const lower = itemName.toLowerCase();
    return this.inventory.find(item => item.toLowerCase().includes(lower)) || null;
  }

  removeItem(itemName) {
    const found = this.findItem(itemName);
    if (found) {
      const idx = this.inventory.indexOf(found);
      this.inventory.splice(idx, 1);
      return true;
    }
    return false;
  }

  takeDamage(amount) {
    this.hp = Math.max(0, this.hp - amount);
    return this.hp > 0;
  }

  heal(amount) {
    this.hp = Math.min(this.hp + amount, this.maxHp);
  }

  markPuzzleSolved(puzzleId) {
    this.solvedPuzzles.add(puzzleId);
  }

  isPuzzleSolved(puzzleId) {
    return this.solvedPuzzles.has(puzzleId);
  }

  addCalculator() {
    if (this.calculators < 3) {
      this.calculators++;
      return true;
    }
    return false;
  }

  useCalculator() {
    if (this.calculators > 0) {
      this.calculators--;
      return true;
    }
    return false;
  }

  addDebt(category, difficulty) {
    this.calculatorDebt.push({ category, difficulty });
  }

  hasDebt() {
    return this.calculatorDebt.length > 0;
  }

  popDebt() {
    return this.calculatorDebt.shift() || null;
  }

  getXpTargetForNextLevel() {
    if (this.level < Player.XP_PER_LEVEL.length) {
      return Player.XP_PER_LEVEL[this.level];
    }
    return this.xp;
  }

  toJSON() {
    return {
      name: this.name,
      level: this.level,
      xp: this.xp,
      gold: this.gold,
      hp: this.hp,
      maxHp: this.maxHp,
      inventory: [...this.inventory],
      currentRoom: this.currentRoom,
      solvedPuzzles: [...this.solvedPuzzles],
      wrongAnswers: this.wrongAnswers,
      calculators: this.calculators,
      calculatorDebt: [...this.calculatorDebt],
    };
  }

  static fromJSON(data) {
    const player = new Player(data.name);
    player.level = data.level;
    player.xp = data.xp;
    player.gold = data.gold;
    player.hp = data.hp;
    player.maxHp = data.maxHp;
    player.inventory = [...data.inventory];
    player.currentRoom = data.currentRoom;
    player.solvedPuzzles = new Set(data.solvedPuzzles || []);
    player.wrongAnswers = data.wrongAnswers || 0;
    player.calculators = data.calculators || 0;
    player.calculatorDebt = [...(data.calculatorDebt || [])];
    return player;
  }
}
