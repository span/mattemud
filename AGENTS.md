# Repository Guidelines

## Project Overview
MatteMUD is a browser-based math adventure game (MUD) for kids aged 9–13. All gameplay text is in Swedish. The game runs entirely client-side with no build step — just static HTML/JS/CSS served over HTTP.

## Project Structure

```
mattemud/
  index.html                     Entry point, loads all scripts in order
  css/style.css                  Game styling
  js/core/colors.js              ANSI escape codes and color helpers for xterm.js
  js/core/Constants.js           GameConstants: named constants (timers, limits, rewards)
  js/core/Player.js              Player state, inventory, XP, calculator debt
  js/core/World.js               Room/World classes, room descriptions, visited tracking
  js/core/ChallengeGenerator.js  Math problem generation (addition, subtraction, multiplication, division)
  js/core/AnswerValidator.js     Shared answer checking (exact, whitespace, comma-decimal, rest-format, percent)
  js/core/MathBeast.js           MathBeast tutorial monster (appears after repeated wrong answers)
  js/core/ChallengeSystem.js     Room challenges, calculator debt, give-up logic
  js/core/BattleSystem.js        Monster battles, timer, MathBeast interaction
  js/core/GameEngine.js          Thin coordinator: command routing, movement, inventory, save/load
  js/data/worldData.js           All room/monster/challenge data (WORLD_DATA constant)
  js/main.js                     TerminalUI (xterm.js wrapper, command history), Storage, game init
  tests/test-runner.html         Browser test suite (40 tests)
```

### Script load order (matters — no bundler)
`colors → Constants → Player → World → ChallengeGenerator → AnswerValidator → MathBeast → ChallengeSystem → BattleSystem → GameEngine → worldData → main`

### Architecture
- **GameEngine** is a thin coordinator that delegates combat to **BattleSystem** and challenges/debt to **ChallengeSystem**.
- **BattleSystem** owns the timer (monster fights have time pressure; room challenges intentionally do not).
- **AnswerValidator** is shared between GameEngine and MathBeast for consistent answer checking.
- **Constants.js** centralizes magic numbers (MAX_CALCULATORS, TIMER_SECONDS, rewards, etc.).

## Development Commands
- `python3 -m http.server 8000` — serve the game locally
- Open `http://localhost:8000` to play
- Open `http://localhost:8000/tests/test-runner.html` to run the test suite

## Coding Style
- JavaScript with 2-space indentation, no build tools or transpilation
- `PascalCase` for classes and class files, `camelCase` for functions/variables, `UPPER_SNAKE_CASE` for constants
- All player-facing strings in Swedish
- Prefer small, focused modules — keep classes under ~250 lines

## Testing
- Custom test runner in `tests/test-runner.html` (open in browser)
- Add tests with every gameplay/mechanics change
- Keep assertions deterministic; avoid time-dependent tests unless testing timers

## Commit Guidelines
- Concise, imperative commit messages (e.g. `Fix timer reset after Math Beast encounter`)
- One concern per commit, include tests with code changes
