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
    this.isShortcutMode = false;
    this._resizeObserver = null;
    this._resizeTimeout = null;
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
      this.container.innerHTML = '<p style="color:red;padding:20px;">Kunde inte starta terminalen</p>';
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

    if (data.startsWith('\x1b')) return;

    // Navigation shortcuts: single keypress when buffer is empty
    const NAV_KEYS = { 'n': 'n', 's': 's', 'ö': 'ö', 'v': 'v' };
    if (this.inputBuffer === '' && NAV_KEYS[data] && this.isShortcutMode) {
      this.term.write(data + '\r\n');
      if (this.onCommand) this.onCommand(data);
      return;
    }

    if (data >= ' ' && data.length === 1) {
      if (this.inputBuffer.length >= 500) return;  // Max 500 chars
      this.inputBuffer += data;
      this.term.write(data);
    }
  }

  write(text) {
    this.term.write(text.replace(/\n/g, '\r\n'));
  }

  writeLine(text) {
    this.write(text + '\n');
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
    if (trimmed.length > 0 && trimmed.length <= 20) {
      initGame(trimmed);
    } else {
      terminal.write('\n\x1b[91m  Skriv ditt namn (max 20 tecken).\x1b[0m\n');
      terminal.write('\x1b[96m  Vad heter du? \x1b[0m');
    }
  };
}

function initGame(playerName) {
  terminal.write('\n\n');

  const world = new World();
  world.loadFromData(WORLD_DATA);

  const player = new Player(playerName);

  engine = new GameEngine(world, player, {
    output: (text) => terminal.writeLine(text),
    onSave: (data) => Storage.save(data),
    onLoad: () => Storage.load(),
    onQuit: () => {
      terminal.writeLine('\n👋 Tack för att du spelade!');
      terminal.dispose();
    },
  });

  terminal.onCommand = (command) => {
    engine.processCommand(command);
    terminal.isShortcutMode = engine.running && !engine.inChallengeMode && !engine.mathBeast?.isActive();
    if (engine.running) {
      terminal.showPrompt();
    }
  };

  engine.start();
  terminal.isShortcutMode = true;
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
