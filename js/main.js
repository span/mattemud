/**
 * MatteMUD - Main
 */

// Storage
const Storage = {
  SAVE_KEY: 'mattemud_save',

  save(playerData) {
    try {
      localStorage.setItem(this.SAVE_KEY, JSON.stringify(playerData));
      return true;
    } catch (e) {
      console.error('Save failed:', e);
      return false;
    }
  },

  load() {
    try {
      const data = localStorage.getItem(this.SAVE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Load failed:', e);
      return null;
    }
  }
};

// Terminal wrapper
class TerminalUI {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.term = null;
    this.fitAddon = null;
    this.inputBuffer = '';
    this.onCommand = null;
    this._resizeObserver = null;
    this._resizeTimeout = null;
    this._history = [];
    this._historyIndex = -1;
    this._savedInput = '';
  }

  init() {
    try {
      this.term = new Terminal({
        cursorBlink: true,
        fontSize: 17,
        fontFamily: "'Cascadia Code', 'Fira Code', 'Courier New', monospace",
        theme: {
          background: '#0a0a0a',
          foreground: '#00ff88',
          cursor: '#00ff88',
        },
        scrollback: 1000,
        convertEol: true,
      });

      this.fitAddon = new FitAddon.FitAddon();
      this.term.loadAddon(this.fitAddon);
      this.term.open(this.container);
      this.fitAddon.fit();

      this.term.onData(data => this._handleInput(data));

      // Debounced resize with ResizeObserver
      this._resizeObserver = new ResizeObserver(() => {
        clearTimeout(this._resizeTimeout);
        this._resizeTimeout = setTimeout(() => this.fitAddon.fit(), 150);
      });
      this._resizeObserver.observe(this.container);

      this.term.focus();
    } catch (e) {
      console.error('Terminal init failed:', e);
      const errorEl = document.createElement('p');
      errorEl.style.cssText = 'color:red;padding:20px;';
      errorEl.textContent = 'Kunde inte starta terminalen';
      this.container.replaceChildren(errorEl);
    }
  }

  dispose() {
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = null;
    }
    if (this._resizeTimeout) {
      clearTimeout(this._resizeTimeout);
      this._resizeTimeout = null;
    }
    if (this.term) {
      this.term.dispose();
      this.term = null;
    }
  }

  _handleInput(data) {
    if (data === '\r') {
      this.term.write('\r\n');
      const command = this.inputBuffer;
      this.inputBuffer = '';
      if (command.trim()) {
        this._history.push(command);
        if (this._history.length > GameConstants.MAX_HISTORY_LENGTH) {
          this._history.shift();
        }
      }
      this._historyIndex = -1;
      this._savedInput = '';
      if (this.onCommand) this.onCommand(command);
      return;
    }

    if (data === '\x7f' || data === '\b') {
      if (this.inputBuffer.length > 0) {
        this.inputBuffer = this.inputBuffer.slice(0, -1);
        this.term.write('\b \b');
      }
      return;
    }

    if (data === '\x03') {
      this.inputBuffer = '';
      this.term.write('^C\r\n> ');
      return;
    }

    // Piltangenter (upp/ner) för kommandohistorik
    if (data === '\x1b[A') {
      this._navigateHistory(1);
      return;
    }
    if (data === '\x1b[B') {
      this._navigateHistory(-1);
      return;
    }

    // Ignorera övriga escape-sekvenser
    if (data.startsWith('\x1b')) return;

    if (data >= ' ' && data.length === 1) {
      if (this.inputBuffer.length >= GameConstants.MAX_INPUT_LENGTH) return;
      this.inputBuffer += data;
      this.term.write(data);
    }
  }

  _navigateHistory(direction) {
    if (this._history.length === 0) return;

    if (this._historyIndex === -1 && direction === 1) {
      this._savedInput = this.inputBuffer;
      this._historyIndex = this._history.length - 1;
    } else if (direction === 1 && this._historyIndex > 0) {
      this._historyIndex--;
    } else if (direction === -1) {
      if (this._historyIndex === this._history.length - 1 || this._historyIndex === -1) {
        this._replaceInput(this._savedInput);
        this._historyIndex = -1;
        return;
      }
      this._historyIndex++;
    } else {
      return;
    }

    if (this._historyIndex >= 0 && this._historyIndex < this._history.length) {
      this._replaceInput(this._history[this._historyIndex]);
    }
  }

  _replaceInput(newText) {
    // Radera nuvarande input från terminalen
    for (let i = 0; i < this.inputBuffer.length; i++) {
      this.term.write('\b \b');
    }
    this.inputBuffer = newText;
    this.term.write(newText);
  }

  write(text) {
    this.term.write(text.replace(/\n/g, '\r\n'));
  }

  writeLine(text) {
    const cols = this.term ? this.term.cols : 80;
    this.write(this._wordWrap(text, cols) + '\n');
  }

  // Radbryt text vid ordgränser, ignorera ANSI-koder vid breddmätning
  _wordWrap(text, cols) {
    return text.split('\n').map(line => this._wrapLine(line, cols)).join('\n');
  }

  _wrapLine(line, cols) {
    // Mät synlig längd (utan ANSI-koder)
    const visLen = (s) => s.replace(/\x1b\[[0-9;]*m/g, '').length;

    if (visLen(line) <= cols) return line;

    // Dela vid ordgränser men behåll ANSI-koder intakta
    const tokens = line.match(/(\x1b\[[0-9;]*m)|(\S+)|(\s+)/g) || [];
    const lines = [];
    let current = '';
    let currentLen = 0;

    for (const token of tokens) {
      const tokenVisLen = visLen(token);

      // ANSI-koder tar ingen plats
      if (tokenVisLen === 0) {
        current += token;
        continue;
      }

      // Whitespace
      if (/^\s+$/.test(token)) {
        if (currentLen + tokenVisLen <= cols) {
          current += token;
          currentLen += tokenVisLen;
        }
        continue;
      }

      // Ord som inte ryms på raden
      if (currentLen + tokenVisLen > cols) {
        if (currentLen > 0) {
          lines.push(current);
          current = '';
          currentLen = 0;
        }
        // Riktigt långa ord som inte ryms alls — låt terminalen bryta dem
        if (tokenVisLen > cols) {
          current += token;
          currentLen += tokenVisLen;
          continue;
        }
      }

      current += token;
      currentLen += tokenVisLen;
    }

    if (current) lines.push(current);
    return lines.join('\n');
  }

  showPrompt() {
    this.term.write('\r\n> ');
  }

  focus() {
    this.term.focus();
  }
}

// Game initialization
let terminal;
let engine;

function startGame() {
  terminal = new TerminalUI('terminal');
  terminal.init();

  // Show welcome and ask for name
  showWelcome();
  terminal.write('\x1b[96m\n  Vad heter du, äventyrare? \x1b[0m');

  terminal.onCommand = (name) => {
    const trimmed = name.trim();
    if (trimmed.length > 0 && trimmed.length <= GameConstants.MAX_NAME_LENGTH) {
      initGame(trimmed);
    } else {
      terminal.write(`\n\x1b[91m  Skriv ditt namn (max ${GameConstants.MAX_NAME_LENGTH} tecken).\x1b[0m\n`);
      terminal.write('\x1b[96m  Vad heter du? \x1b[0m');
    }
  };
}

function initGame(playerName) {
  terminal.write('\n\n');

  const world = new World();
  world.loadFromData(WORLD_DATA);

  const player = new Player(playerName);

  const statusBar = document.getElementById('status-bar');

  engine = new GameEngine(world, player, {
    output: (text) => terminal.writeLine(text),
    onStatusUpdate: (p) => {
      const xpTarget = p.getXpTargetForNextLevel();
      const calcInfo = p.calculators > 0 ? `<span class="stat">🔢 Dosor: ${p.calculators}</span>` : '';
      statusBar.innerHTML =
        `<span class="stat">📊 Nivå ${p.level}</span>` +
        `<span class="stat">❤️ HP: ${p.hp}/${p.maxHp}</span>` +
        `<span class="stat">⚡ XP: ${p.xp}/${xpTarget}</span>` +
        `<span class="stat">💰 Guld: ${p.gold}</span>` +
        calcInfo;
      statusBar.style.display = 'block';
    },
    onSave: (data) => Storage.save(data),
    onLoad: () => Storage.load(),
    onQuit: () => {
      terminal.writeLine('\n👋 Tack för att du spelade!');
      terminal.dispose();
    },
  });

  terminal.onCommand = (command) => {
    engine.processCommand(command);
    if (engine.running) {
      terminal.showPrompt();
    }
  };

  engine.start();
  terminal.showPrompt();
}

function showWelcome() {
  terminal.write(`
\x1b[92m╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   \x1b[93m███╗   ███╗ █████╗ ████████╗████████╗███████╗\x1b[92m            ║
║   \x1b[93m████╗ ████║██╔══██╗╚══██╔══╝╚══██╔══╝██╔════╝\x1b[92m            ║
║   \x1b[93m██╔████╔██║███████║   ██║      ██║   █████╗\x1b[92m              ║
║   \x1b[93m██║╚██╔╝██║██╔══██║   ██║      ██║   ██╔══╝\x1b[92m              ║
║   \x1b[93m██║ ╚═╝ ██║██║  ██║   ██║      ██║   ███████╗\x1b[92m            ║
║   \x1b[93m╚═╝     ╚═╝╚═╝  ╚═╝   ╚═╝      ╚═╝   ╚══════╝\x1b[92m            ║
║                                                           ║
║   \x1b[96m███╗   ███╗██╗   ██╗██████╗\x1b[92m                              ║
║   \x1b[96m████╗ ████║██║   ██║██╔══██╗\x1b[92m                             ║
║   \x1b[96m██╔████╔██║██║   ██║██║  ██║\x1b[92m                             ║
║   \x1b[96m██║╚██╔╝██║██║   ██║██║  ██║\x1b[92m                             ║
║   \x1b[96m██║ ╚═╝ ██║╚██████╔╝██████╔╝\x1b[92m                             ║
║   \x1b[96m╚═╝     ╚═╝ ╚═════╝ ╚═════╝\x1b[92m                              ║
║                                                           ║
║   \x1b[97mMatematikäventyret i Räkneriket                         \x1b[92m║
║   \x1b[97mSkriv 'hjälp' för att se alla kommandon                 \x1b[92m║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝\x1b[0m
`);
}

// Start when DOM is ready
document.addEventListener('DOMContentLoaded', startGame);
