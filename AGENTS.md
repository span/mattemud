# Repository Guidelines

## Project Structure & Module Organization
- `main.py`: CLI entry point for the text adventure.
- `game/`: Core gameplay systems (`engine.py`, `world.py`, `player.py`, `colors.py`).
- `math_challenges/`: Math problem generation and Math Beast logic.
- `data/worlds.json`: Canonical world/room content for the Python game.
- `tests/`: Pytest suite for gameplay, engine behavior, ASCII formatting, and end-to-end flow.
- `mattemud-web/`: Browser version (`index.html`, `js/core/`, `css/`, `tests/test-runner.html`).
- `saves/`: Local save files (`*.json`), generated at runtime.

## Build, Test, and Development Commands
- `python3 main.py`: Start the terminal game locally.
- `pytest -q`: Run the full Python test suite.
- `pytest tests/test_engine.py -q`: Run a focused module test during iteration.
- `cd mattemud-web && python3 -m http.server 8000`: Serve the web client locally.
- Open `http://localhost:8000/tests/test-runner.html` to run browser-side JS checks.

## Coding Style & Naming Conventions
- Python: follow PEP 8 with 4-space indentation and type hints where practical.
- Naming: `snake_case` for functions/variables, `PascalCase` for classes, `UPPER_SNAKE_CASE` for constants.
- Keep command aliases and player-facing strings consistent (Swedish terms are primary in gameplay).
- JavaScript in `mattemud-web/js/`: match existing style (2-space indentation, `PascalCase` class files like `GameEngine.js`).
- Prefer small, focused modules over large multi-purpose files.

## Testing Guidelines
- Primary framework: `pytest` (`tests/test_*.py` pattern).
- Add tests with every gameplay/mechanics change, especially in `game/` and `math_challenges/`.
- Keep deterministic assertions where possible; avoid unnecessary sleep/time dependence unless testing timers.
- For web logic updates, run both Python tests and `mattemud-web/tests/test-runner.html`.

## Commit & Pull Request Guidelines
- This workspace snapshot does not include `.git` history; no project-specific commit convention could be verified here.
- Use concise, imperative commit messages (example: `Fix timer reset after Math Beast encounter`).
- Keep commits scoped to one concern and include tests with code changes.
- PRs should include: purpose, changed files/areas, test evidence (`pytest -q` output), and screenshots/GIFs for UI/web updates.
