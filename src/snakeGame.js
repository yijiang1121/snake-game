const VECTORS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 }
};

const OPPOSITES = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left'
};

const clampRng = (value) => {
  if (Number.isNaN(value) || value < 0) return 0;
  if (value >= 1) return 0.999999;
  return value;
};

/**
 * Encapsulates deterministic snake state transitions so we can test them.
 */
export class SnakeGame {
  constructor({ cols = 20, rows = 20, rng = Math.random } = {}) {
    this.cols = cols;
    this.rows = rows;
    this.rng = rng;
    this.highScore = 0;
    this.reset();
  }

  reset() {
    const midX = Math.floor(this.cols / 2);
    const midY = Math.floor(this.rows / 2);
    this.snake = [
      { x: midX + 1, y: midY },
      { x: midX, y: midY },
      { x: midX - 1, y: midY }
    ];
    this.direction = 'right';
    this.nextDirection = 'right';
    this.score = 0;
    this.status = 'running';
    this.food = this.spawnFood();
  }

  get state() {
    return {
      cols: this.cols,
      rows: this.rows,
      snake: this.snake.map((segment) => ({ ...segment })),
      direction: this.direction,
      status: this.status,
      food: { ...this.food },
      score: this.score,
      highScore: this.highScore
    };
  }

  changeDirection(direction) {
    if (!VECTORS[direction] || this.status === 'over') {
      return;
    }

    if (OPPOSITES[direction] === this.direction && this.snake.length > 1) {
      return;
    }

    this.nextDirection = direction;
  }

  tick() {
    if (this.status === 'over') {
      return this.state;
    }

    this.direction = this.nextDirection;
    const head = this.snake[0];
    const vector = VECTORS[this.direction];
    const nextHead = { x: head.x + vector.x, y: head.y + vector.y };

    if (isOutside(nextHead, this.cols, this.rows) || this.isOnSnake(nextHead)) {
      this.status = 'over';
      this.highScore = Math.max(this.highScore, this.score);
      return this.state;
    }

    this.snake.unshift(nextHead);
    const ateFood = nextHead.x === this.food.x && nextHead.y === this.food.y;

    if (ateFood) {
      this.score += 1;
      this.food = this.spawnFood();
    } else {
      this.snake.pop();
    }

    return this.state;
  }

  isOnSnake(position) {
    return this.snake.some((segment) => segment.x === position.x && segment.y === position.y);
  }

  spawnFood() {
    const occupied = new Set(this.snake.map((segment) => `${segment.x},${segment.y}`));
    const freeCells = [];

    for (let y = 0; y < this.rows; y += 1) {
      for (let x = 0; x < this.cols; x += 1) {
        const key = `${x},${y}`;
        if (!occupied.has(key)) {
          freeCells.push({ x, y });
        }
      }
    }

    if (freeCells.length === 0) {
      this.status = 'over';
      return { x: 0, y: 0 };
    }

    const index = Math.floor(clampRng(this.rng()) * freeCells.length);
    return freeCells[index];
  }
}

export const DIRECTIONS = Object.freeze({ ...VECTORS });

function isOutside(position, cols, rows) {
  return position.x < 0 || position.y < 0 || position.x >= cols || position.y >= rows;
}
