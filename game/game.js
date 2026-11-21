// game.js — the game itself: clicks, markers, counter, timer, hints, win.
// Loads as an ES module from index.html. All art comes from scene.js,
// all sounds from audio.js, all difference data from differences.js.

import {
  DIFFERENCES,
  LEFT_VARIANT,
  RIGHT_VARIANT,
  PANEL_WIDTH,
  PANEL_HEIGHT,
  differenceAt,
} from './differences.js';
import { drawHarbour, drawFoundMarker, drawMissMark, drawHintRing } from './scene.js';
import { SoundFX } from './audio.js';

const TOTAL = DIFFERENCES.length;
const HINTS_START = 3;

const leftCanvas = document.getElementById('panel-left');
const rightCanvas = document.getElementById('panel-right');
const leftCtx = leftCanvas.getContext('2d');
const rightCtx = rightCanvas.getContext('2d');

const foundEl = document.getElementById('found-count');
const timerEl = document.getElementById('timer');
const hintsEl = document.getElementById('hint-count');
const missesEl = document.getElementById('miss-count');
const hintBtn = document.getElementById('hint-btn');
const restartBtn = document.getElementById('restart-btn');
const soundBtn = document.getElementById('sound-btn');
const winOverlay = document.getElementById('win-overlay');
const winTimeEl = document.getElementById('win-time');
const winMissesEl = document.getElementById('win-misses');
const againBtn = document.getElementById('again-btn');

const sfx = new SoundFX();

const state = {
  found: new Map(), // id -> timestamp when found
  misses: 0,
  hintsLeft: HINTS_START,
  startedAt: Date.now(),
  won: false,
  wonAt: 0,
  hintTarget: null, // difference id being hinted
  hintUntil: 0,
  missMarks: [], // {panel, x, y, until}
};

function formatTime(ms) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  return String(m).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
}

function render() {
  const now = Date.now();
  drawHarbour(leftCtx, LEFT_VARIANT);
  drawHarbour(rightCtx, RIGHT_VARIANT);
  // Found markers on both panels, in the order they were found.
  const ordered = [...state.found.entries()].sort((a, b) => a[1] - b[1]);
  ordered.forEach(([id, at], i) => {
    const d = DIFFERENCES.find((x) => x.id === id);
    if (!d) return;
    const age = Math.min(1, (now - at) / 180);
    const pop = 0.6 + 0.4 * age;
    for (const ctx of [leftCtx, rightCtx]) {
      ctx.save();
      ctx.translate(d.x, d.y);
      ctx.scale(pop, pop);
      ctx.translate(-d.x, -d.y);
      drawFoundMarker(ctx, d.x, d.y, i + 1);
      ctx.restore();
    }
  });
  // Hint ring, pulsing on both panels.
  if (state.hintTarget && now < state.hintUntil) {
    const d = DIFFERENCES.find((x) => x.id === state.hintTarget);
    const pulse = ((now % 700) / 700);
    if (d) {
      drawHintRing(leftCtx, d.x, d.y, pulse);
      drawHintRing(rightCtx, d.x, d.y, pulse);
    }
  } else {
    state.hintTarget = null;
  }
  // Miss marks, fading out.
  state.missMarks = state.missMarks.filter((m) => now < m.until);
  for (const m of state.missMarks) {
    const ctx = m.panel === 'left' ? leftCtx : rightCtx;
    drawMissMark(ctx, m.x, m.y, (m.until - now) / 600);
  }
  // HUD.
  foundEl.textContent = `Found ${state.found.size} / ${TOTAL}`;
  const end = state.won ? state.wonAt : now;
  timerEl.textContent = formatTime(end - state.startedAt);
  hintsEl.textContent = `Hints: ${state.hintsLeft}`;
  missesEl.textContent = `Misses: ${state.misses}`;
  hintBtn.textContent = `Hint (H) — ${state.hintsLeft} left`;
  hintBtn.disabled = state.hintsLeft <= 0 || state.won;
  requestAnimationFrame(render);
}

function panelPoint(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * PANEL_WIDTH,
    y: ((event.clientY - rect.top) / rect.height) * PANEL_HEIGHT,
  };
}

function handleClick(panel, event) {
  if (state.won) return;
  sfx.ensure();
  const p = panelPoint(panel === 'left' ? leftCanvas : rightCanvas, event);
  const d = differenceAt(p.x, p.y);
  if (d && !state.found.has(d.id)) {
    state.found.set(d.id, Date.now());
    sfx.find();
    if (state.found.size === TOTAL) {
      state.won = true;
      state.wonAt = Date.now();
      sfx.win();
      winTimeEl.textContent = formatTime(state.wonAt - state.startedAt);
      winMissesEl.textContent = String(state.misses);
      winOverlay.classList.remove('hidden');
    }
  } else if (d && state.found.has(d.id)) {
    // Clicking an already-found difference: nothing happens.
    return;
  } else {
    state.misses += 1;
    state.missMarks.push({ panel, x: p.x, y: p.y, until: Date.now() + 600 });
    sfx.miss();
  }
}

function useHint() {
  if (state.won || state.hintsLeft <= 0) return;
  const remaining = DIFFERENCES.filter((d) => !state.found.has(d.id));
  if (remaining.length === 0) return;
  const pick = remaining[Math.floor(Math.random() * remaining.length)];
  state.hintTarget = pick.id;
  state.hintUntil = Date.now() + 2000;
  state.hintsLeft -= 1;
  sfx.hint();
}

function restart() {
  state.found.clear();
  state.misses = 0;
  state.hintsLeft = HINTS_START;
  state.startedAt = Date.now();
  state.won = false;
  state.wonAt = 0;
  state.hintTarget = null;
  state.hintUntil = 0;
  state.missMarks = [];
  winOverlay.classList.add('hidden');
  sfx.click();
}

leftCanvas.addEventListener('click', (e) => handleClick('left', e));
rightCanvas.addEventListener('click', (e) => handleClick('right', e));
hintBtn.addEventListener('click', useHint);
restartBtn.addEventListener('click', restart);
againBtn.addEventListener('click', restart);
soundBtn.addEventListener('click', () => {
  sfx.muted = !sfx.muted;
  soundBtn.textContent = sfx.muted ? 'Sound: off' : 'Sound: on';
  if (!sfx.muted) sfx.click();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'h' || e.key === 'H') useHint();
  if (e.key === 'r' || e.key === 'R') restart();
  if (e.key === 'm' || e.key === 'M') soundBtn.click();
});

// Play-test hook: lets an automated driver click the exact difference spots
// and read the game state. Harmless in normal play.
window.__harbour = {
  differences: DIFFERENCES.map((d) => ({ id: d.id, x: d.x, y: d.y, r: d.r })),
  panelRect(which) {
    const c = which === 'right' ? rightCanvas : leftCanvas;
    const rect = c.getBoundingClientRect();
    return { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
  },
  state() {
    return {
      found: state.found.size,
      total: TOTAL,
      hintsLeft: state.hintsLeft,
      misses: state.misses,
      won: state.won,
    };
  },
};

render();
