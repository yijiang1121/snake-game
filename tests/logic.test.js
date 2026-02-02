import test from 'node:test';
import assert from 'node:assert/strict';

import { SnakeGame } from '../src/snakeGame.js';

test('snake moves right by default each tick', () => {
  const game = new SnakeGame({ cols: 6, rows: 6, rng: () => 0.5 });
  const initialHead = game.state.snake[0];
  const initialLength = game.state.snake.length;

  game.tick();
  const nextHead = game.state.snake[0];

  assert.equal(nextHead.x, initialHead.x + 1);
  assert.equal(nextHead.y, initialHead.y);
  assert.equal(game.state.snake.length, initialLength);
});

test('cannot reverse direction directly into itself', () => {
  const game = new SnakeGame({ cols: 6, rows: 6, rng: () => 0.5 });
  game.changeDirection('left');
  game.tick();
  assert.equal(game.state.direction, 'right');
});

test('eating food increases length and score', () => {
  const game = new SnakeGame({ cols: 6, rows: 6, rng: () => 0.1 });
  const head = game.state.snake[0];
  game.food = { x: head.x + 1, y: head.y };

  const beforeLength = game.state.snake.length;
  game.tick();

  assert.equal(game.state.score, 1);
  assert.equal(game.state.snake.length, beforeLength + 1);
});

test('colliding with wall ends the game', () => {
  const game = new SnakeGame({ cols: 4, rows: 4, rng: () => 0.1 });
  // Move enough times to hit the right wall
  for (let i = 0; i < 5; i += 1) {
    game.tick();
  }
  assert.equal(game.state.status, 'over');
});

test('food spawning relies on deterministic rng value', () => {
  let calls = 0;
  const stubRng = () => {
    calls += 1;
    return 0.99;
  };
  const game = new SnakeGame({ cols: 5, rows: 5, rng: stubRng });
  const cells = game.state.rows * game.state.cols - game.state.snake.length;
  assert.equal(calls, 1, 'spawnFood called once during reset');
  game.food = { x: game.state.snake[0].x + 1, y: game.state.snake[0].y };
  game.tick();
  assert.equal(game.state.score, 1);
  assert.equal(calls, 2, 'spawnFood called again after eating');
  // Ensure food is within board bounds even with rng close to 1
  assert.ok(game.state.food.x < game.cols);
  assert.ok(game.state.food.y < game.rows);
});
