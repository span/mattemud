/**
 * ANSI escape codes för xterm.js
 */

const Colors = {
  RESET: '\x1b[0m',
  BOLD: '\x1b[1m',
  DIM: '\x1b[2m',

  RED: '\x1b[91m',
  GREEN: '\x1b[92m',
  YELLOW: '\x1b[93m',
  BLUE: '\x1b[94m',
  MAGENTA: '\x1b[95m',
  CYAN: '\x1b[96m',
  WHITE: '\x1b[97m',

  BG_RED: '\x1b[41m',
  BG_GREEN: '\x1b[42m',
};

const red = (text) => `${Colors.RED}${text}${Colors.RESET}`;
const green = (text) => `${Colors.GREEN}${text}${Colors.RESET}`;
const yellow = (text) => `${Colors.YELLOW}${text}${Colors.RESET}`;
const blue = (text) => `${Colors.BLUE}${text}${Colors.RESET}`;
const magenta = (text) => `${Colors.MAGENTA}${text}${Colors.RESET}`;
const cyan = (text) => `${Colors.CYAN}${text}${Colors.RESET}`;
const boldRed = (text) => `${Colors.BOLD}${Colors.RED}${text}${Colors.RESET}`;
const boldGreen = (text) => `${Colors.BOLD}${Colors.GREEN}${text}${Colors.RESET}`;
const boldYellow = (text) => `${Colors.BOLD}${Colors.YELLOW}${text}${Colors.RESET}`;
