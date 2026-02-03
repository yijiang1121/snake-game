import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

test('electron main process loads the local index.html', () => {
  const mainPath = path.join(projectRoot, 'electron', 'main.cjs');
  const source = fs.readFileSync(mainPath, 'utf8');

  assert.match(source, /indexPath\s*=\s*path\.join\([^)]*index\.html[^)]*\)/);
  assert.match(source, /loadFile\(\s*indexPath\s*\)/);
  assert.match(source, /contextIsolation:\s*true/);
  assert.match(source, /nodeIntegration:\s*false/);
  assert.match(source, /sandbox:\s*true/);
});

test('package.json wires electron scripts and dependency', () => {
  const pkgPath = path.join(projectRoot, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

  assert.equal(pkg.main, 'electron/main.cjs');
  assert.equal(pkg.scripts?.start, 'electron electron/main.cjs');
  assert.equal(pkg.scripts?.['build:mac'], 'electron-builder --mac --dir');
  assert.ok(pkg.devDependencies?.electron);
  assert.ok(pkg.devDependencies?.['electron-builder']);

  assert.equal(pkg.build?.directories?.output, 'dist');
  assert.equal(pkg.build?.mac?.target?.[0], 'dir');
  assert.ok(pkg.build?.files?.includes('index.html'));
  assert.ok(pkg.build?.files?.includes('styles.css'));
  assert.ok(pkg.build?.files?.includes('src/**/*'));
  assert.ok(pkg.build?.files?.includes('electron/**/*'));
});
