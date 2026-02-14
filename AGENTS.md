# Repository Guidelines

## Project Structure & Module Organization
- `index.html`: Entry point for the browser-based MUD game.
- `js/core/`: Core gameplay systems (`GameEngine.js`, `World.js`, `Player.js`, `ChallengeGenerator.js`, `MathBeast.js`, `colors.js`).
- `js/data/worldData.js`: Canonical world/room content.
- `js/main.js`: Terminal UI wrapper and game initialization.
- `css/style.css`: Game styling.
- `tests/test-runner.html`: Browser-side test suite.

## Build, Test, and Development Commands
- `python3 -m http.server 8000`: Serve the game locally.
- Open `http://localhost:8000` to play the game.
- Open `http://localhost:8000/tests/test-runner.html` to run browser-side JS tests.

## Coding Style & Naming Conventions
- JavaScript: 2-space indentation, `PascalCase` class files like `GameEngine.js`.
- Naming: `camelCase` for functions/variables, `PascalCase` for classes, `UPPER_SNAKE_CASE` for constants.
- Keep command aliases and player-facing strings consistent (Swedish terms are primary in gameplay).
- Prefer small, focused modules over large multi-purpose files.

## Testing Guidelines
- Primary framework: custom test runner in `tests/test-runner.html`.
- Add tests with every gameplay/mechanics change.
- Keep deterministic assertions where possible; avoid unnecessary sleep/time dependence unless testing timers.

## Commit & Pull Request Guidelines
- Use concise, imperative commit messages (example: `Fix timer reset after Math Beast encounter`).
- Keep commits scoped to one concern and include tests with code changes.
- PRs should include: purpose, changed files/areas, test evidence, and screenshots/GIFs for UI updates.
