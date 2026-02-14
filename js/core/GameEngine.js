/**
 * GameEngine - Huvudspelmotorn (koordinator)
 *
 * Delegerar strid till BattleSystem och utmaningar till ChallengeSystem.
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
    this._pendingAction = null;

    this.output = options.output || console.log;
    this.onStatusUpdate = options.onStatusUpdate || (() => {});
    this.onSave = options.onSave || (() => {});
    this.onLoad = options.onLoad || (() => null);
    this.onQuit = options.onQuit || (() => {});

    this.battle = new BattleSystem(this);
    this.challenges = new ChallengeSystem(this);
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
      this.battle.handleMathBeastInput(cmd);
      return;
    }

    if (this.inDebtMode) {
      this.challenges.handleDebtInput(cmd);
      return;
    }

    if (this.inChallengeMode) {
      this.challenges.handleChallengeInput(cmd);
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
      case 'attack': this.battle.attack(); break;
      case 'use': this._useItem(args); break;
      case 'solve': this.challenges.startChallenge(); break;
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
    this.onStatusUpdate(this.player);
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
          this.print(`\nDu har redan max antal räknedosor (${GameConstants.MAX_CALCULATORS}/${GameConstants.MAX_CALCULATORS})!`);
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
    } else if (foundItem.toLowerCase().includes('trolldryck')) {
      this.player.heal(GameConstants.MAGIC_POTION_HEAL);
      this.player.removeItem(foundItem);
      this.print(`\nDu dricker ${foundItem} och återfår massor av hälsa! (HP: ${this.player.hp}/${this.player.maxHp})`);
    } else if (foundItem.toLowerCase().includes('dryck')) {
      this.player.heal(GameConstants.POTION_HEAL);
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
      this.battle.resetTimerState();
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
    this.battle.stopTimer();
    this.mathBeast = null;
    this.currentChallenge = null;
    this.inChallengeMode = false;
    this.print("\n🎮 Snygg spelning! Ses nästa gång!");
    this.running = false;
    this.onQuit();
  }
}
