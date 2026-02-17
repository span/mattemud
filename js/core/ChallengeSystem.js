/**
 * ChallengeSystem - Hanterar utmaningar, skulder och räknedosa
 */

class ChallengeSystem {
  constructor(engine) {
    this.engine = engine;
  }

  // Shortcuts
  get player() { return this.engine.player; }
  get world() { return this.engine.world; }
  get generator() { return this.engine.generator; }
  print(text) { this.engine.print(text); }

  startChallenge() {
    const room = this.world.getRoom(this.player.currentRoom);
    if (!room || !room.challenge) {
      this.print("\nDet finns ingen gåta att lösa här.");
      return;
    }

    if (this.player.hasDebt()) {
      this.engine._pendingAction = 'solve';
      this.startDebtChallenge();
      return;
    }

    this.doStartChallenge();
  }

  doStartChallenge() {
    const room = this.world.getRoom(this.player.currentRoom);
    if (!room || !room.challenge) return;

    this.engine.currentChallenge = this.generator.generate(
      room.challenge.category,
      room.challenge.difficulty
    );

    this.print(`\n${room.challenge.description}\n`);
    this.print(`  ${this.engine.currentChallenge.question}\n`);
    this.engine.inChallengeMode = true;
    this.player.currentChallengeErrors = 0;
  }

  handleChallengeInput(answer) {
    if (!answer) {
      this.print(`(Skriv ditt svar, eller 'ge upp')`);
      return;
    }

    if (['ge upp', 'avbryt'].includes(answer)) {
      this.print("\nDu ger upp försöket...");
      this.engine.inChallengeMode = false;
      this.engine.currentChallenge = null;
      return;
    }

    if (['dosa', 'räknedosa'].includes(answer)) {
      this.useCalculatorInChallenge();
      return;
    }

    if (this.checkAnswer(answer)) {
      this.handleCorrectAnswer();
    } else {
      this.handleWrongAnswer();
    }
  }

  checkAnswer(answer) {
    if (!this.engine.currentChallenge) return false;
    return AnswerValidator.check(answer, this.engine.currentChallenge.answer);
  }

  handleCorrectAnswer() {
    const room = this.world.getRoom(this.player.currentRoom);

    let xp = GameConstants.REWARDS.DEFAULT_XP;
    let gold = GameConstants.REWARDS.DEFAULT_GOLD;

    if (room && room.monster) {
      const monster = room.monster;
      const result = this.engine.battle.addBattleCorrect(monster.requiredWins);

      if (!result.done) {
        this.print(`\n  ${boldGreen(`Rätt! ${result.current} av ${result.required} ✅`)}\n`);

        this.engine.currentChallenge = this.generator.generate(
          monster.challengeCategory,
          monster.challengeDifficulty
        );
        this.print(`    ${magenta(this.engine.currentChallenge.question)}\n`);
        this.player.currentChallengeErrors = 0;
        return;
      }

      xp = monster.rewardXp;
      gold = monster.rewardGold;
    }

    this.print(`
${Colors.GREEN}╔═══════════════════════════════════════╗
║${Colors.BOLD}${Colors.WHITE}      ⭐ BOOM! RÄTT SVAR! ⭐           ${Colors.RESET}${Colors.GREEN}║
╚═══════════════════════════════════════╝${Colors.RESET}
`);

    if (room && room.monster) {
      this.print(`  ${cyan(room.monster.defeatMessage)}\n`);
      this.world.removeMonster(this.player.currentRoom);
    } else if (room && room.challenge) {
      xp = room.challenge.rewardXp;
      gold = room.challenge.rewardGold;
      this.player.markPuzzleSolved(room.challenge.id);
      this.world.removeChallenge(this.player.currentRoom);
    }

    this.player.addGold(gold);
    const levelUp = this.player.addXp(xp);

    this.print(`  ${boldGreen(`+${xp} XP! ⚡`)}`);
    this.print(`  ${boldYellow(`+${gold} guld! 💰`)}`);

    if (levelUp) {
      this.engine.battle.showLevelUp();
    }

    this.engine._showStatusBar();
    this.engine.inChallengeMode = false;
    this.engine.currentChallenge = null;
    this.player.currentChallengeErrors = 0;

    // Visa rummet igen så spelaren vet vad de kan göra härnäst
    if (room) {
      this.print('');
      this.print(`${Colors.DIM}Du tittar dig omkring...${Colors.RESET}`);
      this.print(room.description);

      if (room.items.length > 0) {
        this.print('');
        this.print(`${Colors.YELLOW}Du ser:${Colors.RESET}`);
        for (const item of room.items) {
          this.print(`  ${Colors.GREEN}• ${item}${Colors.RESET}`);
        }
      }

      const exits = Object.keys(room.exits);
      if (exits.length > 0) {
        this.print('');
        this.print(`${Colors.CYAN}Utgångar: ${exits.join(', ')}${Colors.RESET}`);
      }
    }
  }

  handleWrongAnswer() {
    this.player.currentChallengeErrors++;
    this.player.wrongAnswers++;

    this.print(`\n  ${boldRed('Nope! ❌')}`);

    if (this.engine.mathBeast.shouldAppear(this.player.currentChallengeErrors)) {
      const message = this.engine.mathBeast.appear(this.engine.currentChallenge);
      this.print(message);
      this.engine.inChallengeMode = false;
    } else {
      this.print(`  ${yellow('Kom igen, du fixar detta!')}`);
      if (this.engine.currentChallenge && this.engine.currentChallenge.hint) {
        this.print(`  ${cyan('Ledtråd:')} ${this.engine.currentChallenge.hint}`);
      }
      this.print(`\n  ${magenta(this.engine.currentChallenge.question)}\n`);
    }
  }

  useCalculatorInChallenge() {
    if (this.player.calculators <= 0) {
      this.print(`\n  ${yellow('Du har inga räknedosor!')}`);
      this.print(`  ${magenta(this.engine.currentChallenge.question)}\n`);
      return;
    }

    const challenge = this.engine.currentChallenge;
    this.player.useCalculator();
    this.player.addDebt(challenge.category, challenge.difficulty);

    this.print(`
${Colors.CYAN}╔═══════════════════════════════════════╗
║   🔢 RÄKNEDOSAN PIPER OCH BLINKAR!   ║
╚═══════════════════════════════════════╝${Colors.RESET}

  ${cyan(`Svaret är: ${Colors.BOLD}${challenge.answer}${Colors.RESET}`)}

  ${yellow(`Du har ${this.player.calculators} räknedos${this.player.calculators === 1 ? 'a' : 'or'} kvar. ⚠️`)}
  ${yellow('Du måste lösa ett liknande tal själv nästa gång!')}
`);

    this.handleCorrectAnswer();
  }

  startDebtChallenge() {
    const debt = this.player.calculatorDebt[0];
    this.engine.currentChallenge = this.generator.generate(debt.category, debt.difficulty);

    this.print(`
${Colors.YELLOW}╔═══════════════════════════════════════╗
║  📝 RÄKNEDOSANS SKULD!                ║
║  Du måste lösa detta själv först!     ║
╚═══════════════════════════════════════╝${Colors.RESET}

  ${yellow('Du använde räknedosan förra gången. Nu är det din tur!')}

  ${magenta(this.engine.currentChallenge.question)}
`);

    this.engine.inDebtMode = true;
    this.player.currentChallengeErrors = 0;
  }

  handleDebtInput(answer) {
    if (!answer) {
      this.print(`(Skriv ditt svar - du kan INTE använda räknedosan här!)`);
      return;
    }

    if (['ge upp', 'avbryt'].includes(answer)) {
      this.print(`\n  ${yellow('Du kan inte ge upp en skuld! Försök igen.')}`);
      this.print(`\n  ${magenta(this.engine.currentChallenge.question)}\n`);
      return;
    }

    if (['dosa', 'räknedosa'].includes(answer)) {
      this.print(`\n  ${red('Nej! Du måste klara detta UTAN räknedosa!')}`);
      this.print(`\n  ${magenta(this.engine.currentChallenge.question)}\n`);
      return;
    }

    if (this.checkAnswer(answer)) {
      this.player.popDebt();
      this.engine.inDebtMode = false;

      this.print(`
${Colors.GREEN}╔═══════════════════════════════════════╗
║${Colors.BOLD}${Colors.WHITE}      ⭐ RÄTT! Skulden är betald! ⭐    ${Colors.RESET}${Colors.GREEN}║
╚═══════════════════════════════════════╝${Colors.RESET}
`);

      this.player.addXp(GameConstants.REWARDS.DEBT_XP);
      this.print(`  ${boldGreen('+10 XP! ⚡')}\n`);

      this._resumePendingAction();
    } else {
      this.player.currentChallengeErrors++;

      if (this.player.currentChallengeErrors >= GameConstants.MAX_DEBT_ATTEMPTS) {
        this.player.popDebt();
        this.engine.inDebtMode = false;

        this.print(`\n  ${yellow('Oj, det var ett tufft tal! Svaret var:')} ${boldGreen(this.engine.currentChallenge.answer)}`);
        this.print(`  ${cyan('Skulden är struken. Du fixar det nästa gång!')}\n`);

        this._resumePendingAction();
        return;
      }

      this.print(`\n  ${boldRed('Fel! ❌')} Försök igen!`);
      if (this.engine.currentChallenge.hint) {
        this.print(`  ${cyan('Ledtråd:')} ${this.engine.currentChallenge.hint}`);
      }
      this.print(`\n  ${magenta(this.engine.currentChallenge.question)}\n`);
    }
  }

  _resumePendingAction() {
    if (this.engine._pendingAction === 'attack') {
      this.engine._pendingAction = null;
      this.engine.battle.doAttack();
    } else if (this.engine._pendingAction === 'solve') {
      this.engine._pendingAction = null;
      this.doStartChallenge();
    } else {
      this.engine._pendingAction = null;
    }
  }
}
