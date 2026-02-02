# snake-game

Classic Snake implementation using vanilla JS modules and a lightweight static server.

## Run locally

```bash
npm install  # no deps, but keeps scripts available
npm run dev  # serves at http://localhost:5173
```

Open the URL and you will land on the only page, which hosts the Snake board.

## Tests

```bash
npm test
```

This runs deterministic unit tests for the `SnakeGame` logic (movement, growth, collisions, food placement).

## Manual verification checklist

- Confirm keyboard controls (arrow keys / WASD) steer the snake without reversing into itself.
- Try the on-screen buttons (tap/click) to ensure mobile-friendly controls respond.
- Hit Pause/Resume and make sure the snake halts and resumes without skipping or ending.
- Run into a wall or the snake’s body; overlay should show score, and Restart should reset the board immediately.
- After eating food, verify score increments and snake length grows, and food never spawns on the snake or outside the grid.

Have fun!
