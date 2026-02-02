import { SnakeGame } from './snakeGame.js';

const TICK_MS = 140;
const game = new SnakeGame({ cols: 20, rows: 20 });

const gridEl = document.getElementById('grid');
const scoreEl = document.querySelector('[data-score]');
const bestEl = document.querySelector('[data-best]');
const statusEl = document.querySelector('[data-status]');
const overlayEl = document.querySelector('[data-overlay]');
const overlayTextEl = document.querySelector('[data-overlay-text]');
const pauseBtn = document.querySelector('[data-pause]');
const restartBtn = document.querySelector('[data-restart]');
const controlButtons = document.querySelectorAll('[data-direction]');

const cells = new Map();
let tickHandle = null;
let paused = false;

function bootstrapGrid() {
  gridEl.style.setProperty('--cols', game.cols);
  const fragment = document.createDocumentFragment();
  for (let y = 0; y < game.rows; y += 1) {
    for (let x = 0; x < game.cols; x += 1) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.coord = `${x},${y}`;
      cells.set(cell.dataset.coord, cell);
      fragment.appendChild(cell);
    }
  }
  gridEl.appendChild(fragment);
}

function render(state = game.state) {
  cells.forEach((cell) => {
    cell.classList.remove('snake', 'snake-head', 'food');
  });

  state.snake.forEach((segment, index) => {
    const key = `${segment.x},${segment.y}`;
    const cell = cells.get(key);
    if (!cell) return;
    cell.classList.add('snake');
    if (index === 0) {
      cell.classList.add('snake-head');
    }
  });

  const foodCell = cells.get(`${state.food.x},${state.food.y}`);
  if (foodCell) {
    foodCell.classList.add('food');
  }

  scoreEl.textContent = state.score;
  bestEl.textContent = state.highScore;
  statusEl.textContent = state.status === 'over' ? 'Game over' : paused ? 'Paused' : 'Running';

  if (state.status === 'over') {
    overlayTextEl.textContent = `Game over · Score ${state.score}`;
    overlayEl.classList.remove('hidden');
    pauseBtn.disabled = true;
  } else {
    overlayEl.classList.add('hidden');
    pauseBtn.disabled = false;
  }
}

function runTick() {
  const state = game.tick();
  render(state);
  if (state.status === 'over') {
    stopLoop();
  }
}

function startLoop() {
  if (tickHandle || paused || game.state.status === 'over') {
    return;
  }
  tickHandle = setInterval(runTick, TICK_MS);
}

function stopLoop() {
  if (tickHandle) {
    clearInterval(tickHandle);
    tickHandle = null;
  }
}

function setPaused(next) {
  if (game.state.status === 'over') {
    paused = false;
    pauseBtn.textContent = 'Pause';
    return;
  }
  paused = next;
  pauseBtn.textContent = paused ? 'Resume' : 'Pause';
  if (paused) {
    stopLoop();
  } else {
    startLoop();
  }
  render();
}

function restartGame() {
  game.reset();
  paused = false;
  pauseBtn.textContent = 'Pause';
  overlayEl.classList.add('hidden');
  render();
  startLoop();
}

const KEYBOARD_MAP = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  w: 'up',
  W: 'up',
  s: 'down',
  S: 'down',
  a: 'left',
  A: 'left',
  d: 'right',
  D: 'right'
};

function handleDirection(direction) {
  if (!direction) return;
  game.changeDirection(direction);
}

window.addEventListener('keydown', (event) => {
  const direction = KEYBOARD_MAP[event.key];
  if (direction) {
    event.preventDefault();
    handleDirection(direction);
  }
});

controlButtons.forEach((button) => {
  const direction = button.dataset.direction;
  const handle = (event) => {
    event.preventDefault();
    handleDirection(direction);
  };
  button.addEventListener('click', handle);
  button.addEventListener('touchstart', handle, { passive: false });
});

pauseBtn.addEventListener('click', () => {
  setPaused(!paused);
});

restartBtn.addEventListener('click', () => {
  stopLoop();
  restartGame();
});

window.addEventListener('blur', () => {
  if (!paused && game.state.status !== 'over') {
    setPaused(true);
  }
});

window.addEventListener('focus', () => {
  if (paused && game.state.status !== 'over') {
    setPaused(false);
  }
});

bootstrapGrid();
render();
startLoop();
