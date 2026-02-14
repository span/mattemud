/**
 * BattleSystem - Hanterar monsterstrid, timer och MathBeast
 *
 * Timer-design: Monsterstrid har tidsgräns (spänning), medan
 * rumsutmaningar (ChallengeSystem) medvetet saknar timer (lugn inlärning).
 */

class BattleSystem {
  constructor(engine) {
    this.engine = engine;
    this._timer = {
      id: null,
      timeLeft: 0,
      active: false,
      expired: false
    };
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
    this.showBattleScreen(monster);

    this.engine.currentChallenge = this.generator.generate(
      monster.challengeCategory,
      monster.challengeDifficulty
    );

    // Monsterstrid har tidsgräns (spänning)
    const timerSeconds = this.getTimerSeconds();
    this.print(`    För att vinna måste du lösa detta:\n`);
    this.print(`    ${magenta(this.engine.currentChallenge.question)}\n`);
    this.print(`    ${cyan(`⏱️  Du har ${timerSeconds} sekunder på dig!`)}\n`);

    this.startTimer(timerSeconds);
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

  getTimerSeconds() {
    const level = this.player.level;
    const t = GameConstants.TIMER_SECONDS;
    if (level <= 2) return t.EASY;
    if (level <= 4) return t.MEDIUM;
    if (level <= 6) return t.HARD;
    if (level <= 8) return t.HARDER;
    return t.EXPERT;
  }

  startTimer(seconds) {
    this.stopTimer();
    this._timer.timeLeft = seconds;
    this._timer.expired = false;
    this._timer.active = true;

    const tick = () => {
      if (!this._timer.active) return;
      this._timer.timeLeft--;
      if (this._timer.timeLeft <= 0) {
        this._timer.expired = true;
        this._timer.active = false;
      } else {
        this._timer.id = setTimeout(tick, 1000);
      }
    };
    this._timer.id = setTimeout(tick, 1000);
  }

  stopTimer() {
    if (this._timer.id) {
      clearTimeout(this._timer.id);
      this._timer.id = null;
    }
    this._timer.active = false;
  }

  resetTimerState() {
    this.stopTimer();
    this._timer.expired = false;
    this._timer.timeLeft = 0;
  }

  handleMathBeastInput(answer) {
    if (!answer) {
      this.print("(Mattemonstret väntar på ditt svar...)");
      return;
    }

    const [success, message] = this.engine.mathBeast.checkAnswer(answer);
    this.print(message);

    if (success) {
      const timerSeconds = this.getTimerSeconds();
      this.startTimer(timerSeconds);
      this.print(`\n  Tillbaka till uppgiften!`);
      this.print(`  ${magenta(this.engine.currentChallenge.question)}`);
      this.print(`  ${cyan(`⏱️ Ny tid: ${timerSeconds} sekunder!`)}\n`);
      this.engine.inChallengeMode = true;
      this.player.currentChallengeErrors = 0;
    }
  }

  showLevelUp() {
    this.print(`
${Colors.YELLOW}╔═══════════════════════════════════════╗
║${Colors.BOLD}${Colors.WHITE}  🎉 LEVEL UP! DU ÄR OSTOPPBAR! 🎉    ${Colors.RESET}${Colors.YELLOW}║
║   ⬆️  Du är nu NIVÅ ${this.player.level}!               ║
║   ❤️  +10 Max HP                       ║
╚═══════════════════════════════════════╝${Colors.RESET}
`);
  }
}
