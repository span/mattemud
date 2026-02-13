/**
 * GameEngine - Huvudspelmotorn
 */

class GameEngine {
  static COMMANDS = {
    'gå': 'move', 'go': 'move', 'g': 'move',
    'norr': 'north', 'n': 'north', 'north': 'north',
    'söder': 'south', 's': 'south', 'south': 'south',
    'öster': 'east', 'ö': 'east', 'east': 'east', 'e': 'east',
    'väster': 'west', 'v': 'west', 'west': 'west', 'w': 'west',
    'titta': 'look', 't': 'look', 'look': 'look',
    'ta': 'take', 'take': 'take', 'plocka': 'take',
    'inventarie': 'inventory', 'i': 'inventory', 'inv': 'inventory',
    'stats': 'stats', 'status': 'stats',
    'attack': 'attack', 'attackera': 'attack',
    'använd': 'use', 'use': 'use',
    'hjälp': 'help', 'help': 'help', 'h': 'help', '?': 'help',
    'spara': 'save', 'save': 'save',
    'ladda': 'load', 'load': 'load',
    'avsluta': 'quit', 'quit': 'quit', 'q': 'quit',
    'lös': 'solve', 'solve': 'solve',
    'dosa': 'calculator', 'räknedosa': 'calculator',
  };

  static DIRECTIONS = {
    'north': 'norr', 'n': 'norr', 'norr': 'norr',
    'south': 'söder', 's': 'söder', 'söder': 'söder',
    'east': 'öster', 'ö': 'öster', 'öster': 'öster', 'e': 'öster',
    'west': 'väster', 'v': 'väster', 'väster': 'väster', 'w': 'väster',
  };

  constructor(world, player, options = {}) {
    this.world = world;
    this.player = player;
    this.generator = new ChallengeGenerator();
    this.mathBeast = new MathBeast();
    this.running = true;

    this.currentChallenge = null;
    this.inChallengeMode = false;
    this.inDebtMode = false;
    this._pendingAction = null; // 'attack' or 'solve' - resumes after debt

    // Consolidated timer state
    this._timer = {
      id: null,
      timeLeft: 0,
      active: false,
      expired: false
    };

    this.output = options.output || console.log;
    this.onSave = options.onSave || (() => {});
    this.onLoad = options.onLoad || (() => null);
    this.onQuit = options.onQuit || (() => {});
  }

  print(text) {
    this.output(text);
  }

  start() {
    this.showRoom(true);
  }

  processCommand(command) {
    const cmd = command.trim().toLowerCase();

    if (this.mathBeast.isActive()) {
      this._handleMathBeastInput(cmd);
      return;
    }

    if (this.inDebtMode) {
      this._handleDebtInput(cmd);
      return;
    }

    if (this.inChallengeMode) {
      this._handleChallengeInput(cmd);
      return;
    }

    if (!cmd) return;

    const parts = cmd.split(/\s+/);
    const action = GameEngine.COMMANDS[parts[0]];
    const args = parts.slice(1).join(' ');

    if (!action) {
      if (GameEngine.DIRECTIONS[parts[0]]) {
        this._move(GameEngine.DIRECTIONS[parts[0]]);
        return;
      }
      this.print("\nVad sa du? Skriv 'hjälp' om du kört fast!");
      return;
    }

    switch (action) {
      case 'move': this._move(GameEngine.DIRECTIONS[args] || args); break;
      case 'north': this._move('norr'); break;
      case 'south': this._move('söder'); break;
      case 'east': this._move('öster'); break;
      case 'west': this._move('väster'); break;
      case 'look': this.showRoom(); break;
      case 'take': this._take(args); break;
      case 'inventory': this._showInventory(); break;
      case 'stats': this._showStats(); break;
      case 'attack': this._attack(); break;
      case 'use': this._useItem(args); break;
      case 'solve': this._startChallenge(); break;
      case 'help': this._showHelp(); break;
      case 'save': this._saveGame(); break;
      case 'load': this._loadGame(); break;
      case 'quit': this._quit(); break;
    }
  }

  showRoom(firstTime = false) {
    const roomId = this.player.currentRoom;
    const first = firstTime || !this.world.isVisited(roomId);
    const description = this.world.getRoomDescription(roomId, first);
    this.print(description);
    this.world.markVisited(roomId);
    this._showStatusBar();
  }

  _showStatusBar() {
    const p = this.player;
    const xpTarget = p.getXpTargetForNextLevel();
    const bar = '━'.repeat(50);
    this.print(`\n${Colors.DIM}${bar}${Colors.RESET}`);
    const calcInfo = p.calculators > 0 ? `  🔢 Dosor: ${p.calculators}` : '';
    this.print(`${Colors.CYAN}⚡ XP: ${p.xp}/${xpTarget}  💰 Guld: ${p.gold}  ❤️ HP: ${p.hp}/${p.maxHp}  📊 Nivå ${p.level}${calcInfo}${Colors.RESET}`);
    this.print(`${Colors.DIM}${bar}${Colors.RESET}`);
  }

  _move(direction) {
    if (!direction) {
      this.print("\nVilken riktning? (norr, söder, öster, väster)");
      return;
    }

    const room = this.world.getRoom(this.player.currentRoom);
    if (!room) return;

    if (room.monster) {
      this.print(`\n${room.monster.name} blockerar alla utgångar!`);
      this.print("Du måste besegra monstret först! (skriv 'attack')");
      return;
    }

    if (room.challenge && room.challenge.required) {
      this.print(`\nDu måste lösa gåtan först!`);
      this.print("(skriv 'lös' för att försöka)");
      return;
    }

    if (!room.exits[direction]) {
      this.print(`\nDu kan inte gå ${direction} härifrån.`);
      const exits = Object.keys(room.exits);
      if (exits.length > 0) {
        this.print(`Möjliga riktningar: ${exits.join(', ')}`);
      }
      return;
    }

    const targetId = room.exits[direction];
    const targetRoom = this.world.getRoom(targetId);
    if (targetRoom && targetRoom.locked) {
      this.print(`\nVägen är blockerad!`);
      return;
    }

    this.player.currentRoom = targetId;
    this.showRoom(true);
  }

  _take(itemName) {
    if (!itemName) {
      this.print("\nTa vad? (t.ex. 'ta nyckel')");
      return;
    }

    const room = this.world.getRoom(this.player.currentRoom);
    if (!room) return;

    const lower = itemName.toLowerCase();
    const foundItem = room.items.find(item => item.toLowerCase().includes(lower));

    if (foundItem) {
      if (foundItem.toLowerCase().includes('räknedosa')) {
        if (this.player.addCalculator()) {
          this.world.removeItemFromRoom(this.player.currentRoom, foundItem);
          this.print(`\n🔢 Du plockar upp en räknedosa! (${this.player.calculators}/3)`);
          this.print(`${cyan("Skriv 'dosa' under en strid för att få hjälp!")}`);
        } else {
          this.print(`\nDu har redan max antal räknedosor (3/3)!`);
        }
        return;
      }
      this.world.removeItemFromRoom(this.player.currentRoom, foundItem);
      this.player.addItem(foundItem);
      this.print(`\nDu plockar upp: ${foundItem}`);
    } else {
      this.print(`\nDet finns ingen '${itemName}' här.`);
    }
  }

  _showInventory() {
    if (this.player.inventory.length === 0) {
      this.print("\n🎒 Ryggsäcken gäspar... helt tom!");
      return;
    }
    this.print(`\n╔════════════════════════════╗`);
    this.print(`║      🎒 RYGGSÄCK           ║`);
    this.print(`╠════════════════════════════╣`);
    for (const item of this.player.inventory) {
      this.print(`║  • ${item.padEnd(22)}║`);
    }
    this.print(`╚════════════════════════════╝`);
  }

  _showStats() {
    const p = this.player;
    this.print(`\n╔════════════════════════════╗`);
    this.print(`║  Nivå:  ${String(p.level).padEnd(18)} ║`);
    this.print(`║  HP:    ${`${p.hp}/${p.maxHp}`.padEnd(18)} ║`);
    this.print(`║  XP:    ${String(p.xp).padEnd(18)} ║`);
    this.print(`║  Guld:  ${String(p.gold).padEnd(18)} ║`);
    this.print(`╚════════════════════════════╝`);
  }

  _attack() {
    const room = this.world.getRoom(this.player.currentRoom);
    if (!room || !room.monster) {
      this.print("\nInga monster här just nu. Lugnt läge!");
      return;
    }

    // Kolla skuld först
    if (this.player.hasDebt()) {
      this._pendingAction = 'attack';
      this._startDebtChallenge();
      return;
    }

    this._doAttack();
  }

  _doAttack() {
    const room = this.world.getRoom(this.player.currentRoom);
    if (!room || !room.monster) return;

    const monster = room.monster;
    this._showBattleScreen(monster);

    this.currentChallenge = this.generator.generate(
      monster.challengeCategory,
      monster.challengeDifficulty
    );

    const timerSeconds = this._getTimerSeconds();
    this.print(`    För att vinna måste du lösa detta:\n`);
    this.print(`    ${magenta(this.currentChallenge.question)}\n`);
    this.print(`    ${cyan(`⏱️  Du har ${timerSeconds} sekunder på dig!`)}\n`);

    this._startTimer(timerSeconds);
    this.inChallengeMode = true;
    this.player.currentChallengeErrors = 0;
  }

  _showBattleScreen(monster) {
    const name = monster.name.slice(0, 10).padEnd(10);
    this.print(`
${Colors.RED}⚔️═══════════════════════════════════════════════════════⚔️
║      🛡️  DU  🛡️          ⚔️  VS  ⚔️        👹 ${name} ║
⚔️═══════════════════════════════════════════════════════⚔️${Colors.RESET}

              ${Colors.YELLOW}💥 STRIDEN BÖRJAR! 💥${Colors.RESET}
`);
  }

  _getTimerSeconds() {
    const level = this.player.level;
    if (level <= 2) return 45;
    if (level <= 4) return 40;
    if (level <= 6) return 35;
    if (level <= 8) return 30;
    return 25;
  }

  _startTimer(seconds) {
    this._stopTimer();  // Always clear any existing timer first
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

  _stopTimer() {
    if (this._timer.id) {
      clearTimeout(this._timer.id);
      this._timer.id = null;
    }
    this._timer.active = false;
  }

  _resetTimerState() {
    this._stopTimer();
    this._timer.expired = false;
    this._timer.timeLeft = 0;
  }

  _startChallenge() {
    const room = this.world.getRoom(this.player.currentRoom);
    if (!room || !room.challenge) {
      this.print("\nDet finns ingen gåta att lösa här.");
      return;
    }

    // Kolla skuld först
    if (this.player.hasDebt()) {
      this._pendingAction = 'solve';
      this._startDebtChallenge();
      return;
    }

    this._doStartChallenge();
  }

  _doStartChallenge() {
    const room = this.world.getRoom(this.player.currentRoom);
    if (!room || !room.challenge) return;

    this.currentChallenge = this.generator.generate(
      room.challenge.category,
      room.challenge.difficulty
    );

    this._resetTimerState();
    this.print(`\n${room.challenge.description}\n`);
    this.print(`  ${this.currentChallenge.question}\n`);
    this.inChallengeMode = true;
    this.player.currentChallengeErrors = 0;
  }

  _handleChallengeInput(answer) {
    if (this._timer.active && this._timer.expired) {
      this.print(`\n${boldRed('⏱️  TIDEN RANN UT!')}`);
      this._resetTimerState();
      this._handleWrongAnswer();
      return;
    }

    if (!answer) {
      const timerMsg = this._timer.active ? ` ${cyan(`⏱️ ${this._timer.timeLeft}s kvar`)}` : '';
      this.print(`(Skriv ditt svar, eller 'ge upp')${timerMsg}`);
      return;
    }

    if (['ge upp', 'avbryt'].includes(answer)) {
      this.print("\nDu ger upp försöket...");
      this._resetTimerState();
      this.inChallengeMode = false;
      this.currentChallenge = null;
      return;
    }

    if (['dosa', 'räknedosa'].includes(answer)) {
      this._useCalculatorInChallenge();
      return;
    }

    if (this._checkAnswer(answer)) {
      this._resetTimerState();
      this._handleCorrectAnswer();
    } else {
      this._handleWrongAnswer();
    }
  }

  _checkAnswer(answer) {
    if (!this.currentChallenge) return false;

    const clean = answer.trim().toLowerCase();
    const correct = this.currentChallenge.answer.toLowerCase();

    if (clean === correct) return true;
    if (clean.replace(/\s/g, '') === correct.replace(/\s/g, '')) return true;
    if (correct.endsWith('%') && clean.replace('%', '') === correct.slice(0, -1)) return true;
    if (correct.includes('rest')) {
      if (clean.replace(',', '').replace(/\s/g, '') === correct.replace(/\s/g, '')) return true;
    }

    const numeric = clean.replace(',', '.');
    if (numeric === correct) return true;
    try {
      if (parseFloat(numeric) === parseFloat(correct)) return true;
    } catch {}

    return false;
  }

  _handleCorrectAnswer() {
    const room = this.world.getRoom(this.player.currentRoom);

    this.print(`
${Colors.GREEN}╔═══════════════════════════════════════╗
║${Colors.BOLD}${Colors.WHITE}      ⭐ BOOM! RÄTT SVAR! ⭐           ${Colors.RESET}${Colors.GREEN}║
╚═══════════════════════════════════════╝${Colors.RESET}
`);

    // Default values ensure xp/gold are always defined
    let xp = 25;
    let gold = 10;

    if (room && room.monster) {
      xp = room.monster.rewardXp;
      gold = room.monster.rewardGold;
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

    this.print(`  ${boldGreen(`⚡ +${xp} XP!`)}`);
    this.print(`  ${boldYellow(`💰 +${gold} guld!`)}`);

    if (levelUp) {
      this._showLevelUp();
    }

    this._showStatusBar();
    this.inChallengeMode = false;
    this.currentChallenge = null;
    this.player.currentChallengeErrors = 0;
  }

  _handleWrongAnswer() {
    this.player.currentChallengeErrors++;
    this.player.wrongAnswers++;

    this.print(`\n  ${boldRed('❌ Nope!')}`);

    if (this.mathBeast.shouldAppear(this.player.currentChallengeErrors)) {
      this._stopTimer();
      const message = this.mathBeast.appear(this.currentChallenge);
      this.print(message);
      this.inChallengeMode = false;
    } else {
      const timerMsg = this._timer.active ? ` ${cyan(`⏱️ ${this._timer.timeLeft}s kvar`)}` : '';
      this.print(`  ${yellow('Kom igen, du fixar detta!')}${timerMsg}`);
      if (this.currentChallenge && this.currentChallenge.hint) {
        this.print(`  ${cyan('Ledtråd:')} ${this.currentChallenge.hint}`);
      }
      this.print(`\n  ${magenta(this.currentChallenge.question)}\n`);
    }
  }

  _useCalculatorInChallenge() {
    if (this.player.calculators <= 0) {
      this.print(`\n  ${yellow('Du har inga räknedosor!')}`);
      this.print(`  ${magenta(this.currentChallenge.question)}\n`);
      return;
    }

    const challenge = this.currentChallenge;
    this.player.useCalculator();
    this.player.addDebt(challenge.category, challenge.difficulty);

    this.print(`
${Colors.CYAN}╔═══════════════════════════════════════╗
║   🔢 RÄKNEDOSAN PIPER OCH BLINKAR!   ║
╚═══════════════════════════════════════╝${Colors.RESET}

  ${cyan(`Svaret är: ${Colors.BOLD}${challenge.answer}${Colors.RESET}`)}

  ${yellow(`⚠️  Du har ${this.player.calculators} räknedos${this.player.calculators === 1 ? 'a' : 'or'} kvar.`)}
  ${yellow('Du måste lösa ett liknande tal själv nästa gång!')}
`);

    this._resetTimerState();
    this._handleCorrectAnswer();
  }

  _startDebtChallenge() {
    const debt = this.player.calculatorDebt[0]; // Peek, don't pop yet
    this.currentChallenge = this.generator.generate(debt.category, debt.difficulty);

    this.print(`
${Colors.YELLOW}╔═══════════════════════════════════════╗
║  📝 RÄKNEDOSANS SKULD!                ║
║  Du måste lösa detta själv först!     ║
╚═══════════════════════════════════════╝${Colors.RESET}

  ${yellow('Du använde räknedosan förra gången. Nu är det din tur!')}

  ${magenta(this.currentChallenge.question)}
`);

    this.inDebtMode = true;
    this.player.currentChallengeErrors = 0;
  }

  _handleDebtInput(answer) {
    if (!answer) {
      this.print(`(Skriv ditt svar - du kan INTE använda räknedosan här!)`);
      return;
    }

    if (['ge upp', 'avbryt'].includes(answer)) {
      this.print(`\n  ${yellow('Du kan inte ge upp en skuld! Försök igen.')}`);
      this.print(`\n  ${magenta(this.currentChallenge.question)}\n`);
      return;
    }

    if (['dosa', 'räknedosa'].includes(answer)) {
      this.print(`\n  ${red('Nej! Du måste klara detta UTAN räknedosa!')}`);
      this.print(`\n  ${magenta(this.currentChallenge.question)}\n`);
      return;
    }

    if (this._checkAnswer(answer)) {
      this.player.popDebt();
      this.inDebtMode = false;

      this.print(`
${Colors.GREEN}╔═══════════════════════════════════════╗
║${Colors.BOLD}${Colors.WHITE}      ⭐ RÄTT! Skulden är betald! ⭐    ${Colors.RESET}${Colors.GREEN}║
╚═══════════════════════════════════════╝${Colors.RESET}
`);

      this.player.addXp(10);
      this.print(`  ${boldGreen('⚡ +10 XP!')}\n`);

      // Kör den väntande handlingen
      if (this._pendingAction === 'attack') {
        this._pendingAction = null;
        this._doAttack();
      } else if (this._pendingAction === 'solve') {
        this._pendingAction = null;
        this._doStartChallenge();
      } else {
        this._pendingAction = null;
      }
    } else {
      this.player.currentChallengeErrors++;
      this.print(`\n  ${boldRed('❌ Fel!')} Försök igen!`);
      if (this.currentChallenge.hint) {
        this.print(`  ${cyan('Ledtråd:')} ${this.currentChallenge.hint}`);
      }
      this.print(`\n  ${magenta(this.currentChallenge.question)}\n`);
    }
  }

  _handleMathBeastInput(answer) {
    if (!answer) {
      this.print("(Mattemonstret väntar på ditt svar...)");
      return;
    }

    const [success, message] = this.mathBeast.checkAnswer(answer);
    this.print(message);

    if (success) {
      const timerSeconds = this._getTimerSeconds();
      this._startTimer(timerSeconds);
      this.print(`\n  Tillbaka till uppgiften!`);
      this.print(`  ${magenta(this.currentChallenge.question)}`);
      this.print(`  ${cyan(`⏱️ Ny tid: ${timerSeconds} sekunder!`)}\n`);
      this.inChallengeMode = true;
      this.player.currentChallengeErrors = 0;
    }
  }

  _showLevelUp() {
    this.print(`
${Colors.YELLOW}╔═══════════════════════════════════════╗
║${Colors.BOLD}${Colors.WHITE}  🎉 LEVEL UP! DU ÄR OSTOPPBAR! 🎉    ${Colors.RESET}${Colors.YELLOW}║
║   ⬆️  Du är nu NIVÅ ${this.player.level}!               ║
║   ❤️  +10 Max HP                       ║
╚═══════════════════════════════════════╝${Colors.RESET}
`);
  }

  _useItem(itemName) {
    if (!itemName) {
      this.print("\nAnvänd vad?");
      return;
    }

    const foundItem = this.player.findItem(itemName);
    if (!foundItem) {
      this.print(`\nDu har ingen '${itemName}'.`);
      return;
    }

    const room = this.world.getRoom(this.player.currentRoom);

    if (foundItem.toLowerCase().includes('nyckel')) {
      for (const [direction, targetId] of Object.entries(room.exits)) {
        const target = this.world.getRoom(targetId);
        if (target && target.locked) {
          this.world.unlockRoom(targetId);
          this.player.removeItem(foundItem);
          this.print(`\nDu använder ${foundItem} och låser upp vägen ${direction}!`);
          return;
        }
      }
      this.print("\nDet finns ingenting att låsa upp här.");
    } else if (foundItem.toLowerCase().includes('dryck')) {
      this.player.heal(50);
      this.player.removeItem(foundItem);
      this.print(`\nDu dricker ${foundItem} och återfår hälsa! (HP: ${this.player.hp}/${this.player.maxHp})`);
    } else {
      this.print(`\nDu vet inte hur du ska använda ${foundItem} här.`);
    }
  }

  _showHelp() {
    this.print(`
╔═══════════════════════════════════════════════════╗
║              DINA SUPERKOMMANDON                  ║
╠═══════════════════════════════════════════════════╣
║  RÖRELSE: gå [riktning], n/s/ö/v                  ║
║  UTFORSKA: titta, ta [föremål]                    ║
║  STRID: attack, lös, dosa                           ║
║  STATUS: stats, inventarie                        ║
║  SPEL: spara, ladda, hjälp, avsluta               ║
╚═══════════════════════════════════════════════════╝
`);
  }

  _saveGame() {
    this.onSave(this.player.toJSON());
    this.print(`\n💾 Spel sparat!`);
  }

  _loadGame() {
    const data = this.onLoad();
    if (data) {
      this.player = Player.fromJSON(data);
      this._resetTimerState();
      this.inChallengeMode = false;
      this.currentChallenge = null;
      this.mathBeast = new MathBeast();
      this.print(`\n📂 Laddat spel: ${this.player.name}`);
      this.showRoom();
    } else {
      this.print("\n❌ Inga sparade spel hittades.");
    }
  }

  _quit() {
    this._stopTimer();
    this.mathBeast = null;
    this.currentChallenge = null;
    this.inChallengeMode = false;
    this.print("\n🎮 Snygg spelning! Ses nästa gång!");
    this.running = false;
    this.onQuit();
  }
}
