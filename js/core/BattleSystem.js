/**
 * BattleSystem - Hanterar monsterstrid och MathBeast
 */

class BattleSystem {
  constructor(engine) {
    this.engine = engine;
    this._battleCorrect = 0;
  }

  // Shortcuts
  get player() { return this.engine.player; }
  get world() { return this.engine.world; }
  get generator() { return this.engine.generator; }
  print(text) { this.engine.print(text); }

  attack() {
    const room = this.world.getRoom(this.player.currentRoom);
    if (!room || !room.monster) {
      this.print("\nInga monster här just nu. Lugnt läge!");
      return;
    }

    if (this.player.hasDebt()) {
      this.engine._pendingAction = 'attack';
      this.engine.challenges.startDebtChallenge();
      return;
    }

    this.doAttack();
  }

  doAttack() {
    const room = this.world.getRoom(this.player.currentRoom);
    if (!room || !room.monster) return;

    const monster = room.monster;
    this._battleCorrect = 0;
    this.showBattleScreen(monster);

    this.engine.currentChallenge = this.generator.generate(
      monster.challengeCategory,
      monster.challengeDifficulty
    );

    this.print(`    Lös ${monster.requiredWins} frågor för att vinna!\n`);
    this.print(`    ${magenta(this.engine.currentChallenge.question)}\n`);

    this.engine.inChallengeMode = true;
    this.player.currentChallengeErrors = 0;
  }

  showBattleScreen(monster) {
    const name = monster.name.slice(0, 10).padEnd(10);
    this.print(`
${Colors.RED}⚔️═══════════════════════════════════════════════════════⚔️
║      🛡️  DU  🛡️          ⚔️  VS  ⚔️        👹 ${name} ║
⚔️═══════════════════════════════════════════════════════⚔️${Colors.RESET}

              ${Colors.YELLOW}💥 STRIDEN BÖRJAR! 💥${Colors.RESET}
`);
  }

  addBattleCorrect(required) {
    this._battleCorrect++;
    return { done: this._battleCorrect >= required, current: this._battleCorrect, required };
  }

  handleMathBeastInput(answer) {
    if (!answer) {
      this.print("(Mattemonstret väntar på ditt svar...)");
      return;
    }

    const [success, message] = this.engine.mathBeast.checkAnswer(answer);
    this.print(message);

    if (success) {
      this.print(`\n  Tillbaka till uppgiften!`);
      this.print(`  ${magenta(this.engine.currentChallenge.question)}\n`);
      this.engine.inChallengeMode = true;
      this.player.currentChallengeErrors = 0;
    }
  }

  showLevelUp() {
    this.print(`
${Colors.YELLOW}╔═══════════════════════════════════════╗
║${Colors.BOLD}${Colors.WHITE}  🎉 LEVEL UP! DU ÄR OSTOPPBAR! 🎉    ${Colors.RESET}${Colors.YELLOW}║
║   Du är nu NIVÅ ${this.player.level}! ⬆️                ║
║   +10 Max HP ❤️                        ║
╚═══════════════════════════════════════╝${Colors.RESET}
`);
  }
}
