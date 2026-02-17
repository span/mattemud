/**
 * World - Spelvärlden
 */

class Room {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.firstVisitText = data.first_visit_text || null;
    this.exits = data.exits || {};
    this.items = [...(data.items || [])];
    this.asciiArt = data.ascii_art || null;
    this.locked = data.locked || false;
    this.lockMessage = data.lock_message || null;

    this.monster = data.monster ? {
      id: data.monster.id,
      name: data.monster.name,
      description: data.monster.description,
      asciiArt: data.monster.ascii_art || null,
      challengeCategory: data.monster.challenge_category,
      challengeDifficulty: data.monster.challenge_difficulty,
      rewardXp: data.monster.reward_xp,
      rewardGold: data.monster.reward_gold,
      defeatMessage: data.monster.defeat_message,
      requiredWins: data.monster.required_wins || 3,
    } : null;

    this.challenge = data.challenge ? {
      id: data.challenge.id,
      category: data.challenge.category,
      difficulty: data.challenge.difficulty,
      description: data.challenge.description,
      rewardXp: data.challenge.reward_xp,
      rewardGold: data.challenge.reward_gold,
      required: data.challenge.required || false,
    } : null;
  }
}

class World {
  static DIR_SHORTCUTS = {
    'norr': 'n', 'söder': 's', 'öster': 'ö', 'väster': 'v'
  };

  constructor() {
    this.rooms = new Map();
    this.visitedRooms = new Set();
  }

  loadFromData(data) {
    this.rooms.clear();
    for (const roomData of data.rooms) {
      const room = new Room(roomData);
      this.rooms.set(room.id, room);
    }
  }

  getRoom(roomId) {
    return this.rooms.get(roomId) || null;
  }

  isVisited(roomId) {
    return this.visitedRooms.has(roomId);
  }

  markVisited(roomId) {
    this.visitedRooms.add(roomId);
  }

  getRoomDescription(roomId, firstTime = false) {
    const room = this.getRoom(roomId);
    if (!room) return 'Du befinner dig ingenstans... konstigt.';

    const lines = [];

    lines.push('');
    lines.push(`${Colors.BOLD}${Colors.CYAN}═══════════════════════════════════════════════════${Colors.RESET}`);
    lines.push(`${Colors.BOLD}${Colors.WHITE}  ${room.name}${Colors.RESET}`);
    lines.push(`${Colors.BOLD}${Colors.CYAN}═══════════════════════════════════════════════════${Colors.RESET}`);
    lines.push('');

    if (room.asciiArt) {
      lines.push(`${Colors.DIM}${room.asciiArt}${Colors.RESET}`);
      lines.push('');
    }

    lines.push(room.description);

    if (firstTime && room.firstVisitText) {
      lines.push('');
      lines.push(`${Colors.YELLOW}${room.firstVisitText}${Colors.RESET}`);
    }

    if (room.monster) {
      lines.push('');
      lines.push(`${Colors.RED}${Colors.BOLD}${room.monster.name} blockerar vägen! ⚠️${Colors.RESET}`);
      lines.push(`${Colors.RED}"${room.monster.description}"${Colors.RESET}`);
      lines.push(`${Colors.DIM}(Skriv ${Colors.RESET}${Colors.BOLD}'attack'${Colors.RESET}${Colors.DIM} för att slåss)${Colors.RESET}`);
    }

    if (room.challenge) {
      lines.push('');
      lines.push(`${Colors.MAGENTA}${room.challenge.description} 📜${Colors.RESET}`);
      lines.push(`${Colors.DIM}(Skriv ${Colors.RESET}${Colors.BOLD}'lös'${Colors.RESET}${Colors.DIM} för att försöka)${Colors.RESET}`);
    }

    if (room.items.length > 0) {
      lines.push('');
      lines.push(`${Colors.YELLOW}Du ser:${Colors.RESET}`);
      for (const item of room.items) {
        lines.push(`  ${Colors.GREEN}• ${item}${Colors.RESET}`);
      }
    }

    const exits = Object.keys(room.exits);
    if (exits.length > 0) {
      lines.push('');
      const showShortcuts = room.id.startsWith('akademin_');
      const exitLabels = showShortcuts
        ? exits.map(e => `${e} (${World.DIR_SHORTCUTS[e]})`)
        : exits;
      lines.push(`${Colors.CYAN}Utgångar: ${exitLabels.join(', ')}${Colors.RESET}`);
    }

    return lines.join('\n');
  }

  removeItemFromRoom(roomId, itemName) {
    const room = this.getRoom(roomId);
    if (!room) return false;

    const lower = itemName.toLowerCase();
    const idx = room.items.findIndex(item => item.toLowerCase().includes(lower));
    if (idx !== -1) {
      room.items.splice(idx, 1);
      return true;
    }
    return false;
  }

  removeMonster(roomId) {
    const room = this.getRoom(roomId);
    if (room) room.monster = null;
  }

  removeChallenge(roomId) {
    const room = this.getRoom(roomId);
    if (room) room.challenge = null;
  }

  unlockRoom(roomId) {
    const room = this.getRoom(roomId);
    if (room) room.locked = false;
  }
}
