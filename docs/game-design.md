# Classic Snake – Game Design Brief
*Author: Codex (GPT-5) · Repo: `snake-game` · Date: February 2, 2026*

## 1. Vision & Pillars
Deliver a timeless Snake experience that feels immediate, readable, and responsive inside a single-page web app. The build must stay dependency-light, deterministic, and keyboard-first while providing mobile-friendly controls.

**Pillars**
- *Deterministic logic* – pure state transitions in `SnakeGame` enable straightforward tests and debugging.
- *Minimalist UI* – single grid, HUD, overlay, and controls live in one stylesheet.
- *Inclusive input* – arrow keys, WASD, tap buttons, and auto-pause for focus changes.

| Metric | Target | Rationale |
| --- | --- | --- |
| Perceived responsiveness | ~60 FPS feel via 140 ms ticks | Keeps motion lively without overwhelming casual players. |
| Dependencies | Zero runtime packages | Matches repo scope and enables static hosting anywhere. |

## 2. Core Loop
Four deterministic phases run each tick:
1. **Input** – queue direction changes unless reversing into the snake.
2. **Advance** – promote next direction, move head, shift body.
3. **Collide** – detect walls/self; end run and freeze loop if triggered.
4. **Resolve** – grow and score when food matches head, otherwise trim tail.

Every tick returns a snapshot consumed directly by the renderer, so DOM updates always reflect authoritative state.

## 3. Board, Speed & Progression
| Setting | Value | Rationale |
| --- | --- | --- |
| Grid Size | 20 × 20 cells | Balances open space with quick difficulty ramp as the snake lengthens. |
| Tick Interval | 140 ms | Fast enough to feel lively while remaining readable on touch devices. |
| Initial Body | 3 segments | Provides maneuverability yet shows growth immediately. |
| Food RNG | Clamped `Math.random()` | Guarantees spawns stay on-grid and avoid snake tiles. |

These knobs live inside `SnakeGame`, making difficulty tuning centralized and testable.

## 4. Systems Architecture
### 4.1 State Engine (`src/snakeGame.js`)
- Stores snake array, food position, direction queue, score, status, and best score.
- `tick()` mutates internal arrays but exposes a cloned snapshot to presenters.
- Collision helpers keep logic tiny and deterministic; RNG injection enables repeatable tests.

### 4.2 Presenter (`src/main.js`)
- Bootstraps DOM grid once, keeping references in a `Map` for O(1) lookups.
- Keyboard handler maps Arrow keys and WASD; tap buttons emit the same direction events.
- Pause/Resume toggle the interval without destroying game state; overlay communicates end-state.
- Window blur auto-pauses; focus resumes to protect players from background losses.

### 4.3 Persistence
Session-only best score is stored in memory; extendable to `localStorage` if requirements expand.

## 5. Controls & UX
- **Keyboard**: Arrow keys & WASD prevent reversal into the snake body within one tick.
- **On-screen D-Pad**: Touch-friendly buttons mirror keyboard events with `touchstart` preventing scroll.
- **Auto Pause**: Window blur triggers pause; focus resumes automatically.
- **HUD**: Score, Best, Status, Pause, and Restart; overlay reinforces end state with a restart CTA.

## 6. Visual Language
Styling relies on a single `styles.css` file:
- Soft blues and warm oranges differentiate snake vs. food with accessible contrast.
- Grid squares use the padding-top trick for perfect ratios and subtle gradients for depth.
- Overlay uses translucent navy with centered text to spotlight the restart action.

## 7. Quality Plan
### Automated Tests (`tests/logic.test.js`)
- Movement & default direction progression.
- Reverse-direction guard to avoid instant self-collisions.
- Growth & scoring when food aligns with next head cell.
- Wall-collision detection and status updates.
- Deterministic food placement via stubbed RNG.

### Manual Checklist
- Play with keyboard and tap controls; confirm latency-free steering.
- Toggle Pause/Resume while in motion and after blur/focus events.
- Trigger wall and self collisions; overlay + best-score update must appear.
- Verify food never overlaps the snake or spawns outside the grid.
