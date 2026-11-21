// scene.js — draws the "Harbour at Dusk" scene with plain Canvas 2D.
// One function draws a whole panel; the left and right panels share every
// stroke except the seven planted differences, so the two pictures are
// near-identical by construction. No images, no fonts from the network:
// every shape is drawn here.

import { PANEL_WIDTH, PANEL_HEIGHT } from './differences.js';

const HORIZON = 250;

function sky(ctx) {
  const g = ctx.createLinearGradient(0, 0, 0, HORIZON);
  g.addColorStop(0, '#2e3a67');
  g.addColorStop(0.55, '#7a5a8c');
  g.addColorStop(1, '#e8845c');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, PANEL_WIDTH, HORIZON);
}

function stars(ctx) {
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  const pts = [
    [60, 40], [150, 28], [230, 52], [360, 34], [430, 60],
    [510, 30], [580, 55], [200, 90], [420, 100], [90, 110],
  ];
  for (const [x, y] of pts) {
    ctx.fillRect(x, y, 2, 2);
  }
}

function clouds(ctx) {
  ctx.fillStyle = 'rgba(247,217,196,0.75)';
  const puffs = [
    [140, 70, 46, 14], [330, 55, 58, 16], [520, 92, 40, 12],
  ];
  for (const [x, y, rx, ry] of puffs) {
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

function sun(ctx) {
  const g = ctx.createRadialGradient(470, 222, 6, 470, 222, 60);
  g.addColorStop(0, 'rgba(255,214,106,0.9)');
  g.addColorStop(1, 'rgba(255,214,106,0)');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(470, 222, 60, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffd76a';
  ctx.beginPath();
  ctx.arc(470, 222, 26, 0, Math.PI * 2);
  ctx.fill();
}

function sea(ctx) {
  const g = ctx.createLinearGradient(0, HORIZON, 0, PANEL_HEIGHT);
  g.addColorStop(0, '#274b6d');
  g.addColorStop(1, '#0e2238');
  ctx.fillStyle = g;
  ctx.fillRect(0, HORIZON, PANEL_WIDTH, PANEL_HEIGHT - HORIZON);
  // Sun reflection: a broken golden streak under the sun.
  ctx.fillStyle = 'rgba(255,190,90,0.55)';
  for (let i = 0; i < 7; i++) {
    const y = HORIZON + 14 + i * 24;
    const w = 90 - i * 9;
    ctx.fillRect(470 - w / 2, y, w, 4);
  }
  // Gentle wave lines.
  ctx.strokeStyle = 'rgba(255,255,255,0.14)';
  ctx.lineWidth = 2;
  for (const [x, y, w] of [[80, 290, 70], [250, 320, 90], [420, 300, 80], [120, 380, 90], [360, 400, 100]]) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + w, y);
    ctx.stroke();
  }
}

function cottage(ctx, windowsLit) {
  // Walls and roof.
  ctx.fillStyle = '#f2d8a7';
  ctx.fillRect(55, 205, 110, 45);
  ctx.fillStyle = '#b5533c';
  ctx.beginPath();
  ctx.moveTo(48, 205);
  ctx.lineTo(110, 172);
  ctx.lineTo(172, 205);
  ctx.closePath();
  ctx.fill();
  // Chimney.
  ctx.fillStyle = '#8a4a3a';
  ctx.fillRect(140, 178, 12, 26);
  // Door.
  ctx.fillStyle = '#6b4423';
  ctx.fillRect(100, 222, 18, 28);
  // Three windows; the middle one is the planted difference.
  const wins = [66, 104, 138];
  wins.forEach((x, i) => {
    ctx.fillStyle = i < windowsLit ? '#ffd76a' : '#33415c';
    ctx.fillRect(x, 216, 16, 16);
    ctx.strokeStyle = '#6b4423';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, 216, 16, 16);
  });
}

function sailboat(ctx, flagColor) {
  // Hull.
  ctx.fillStyle = '#7a3b2e';
  ctx.beginPath();
  ctx.moveTo(288, 288);
  ctx.lineTo(392, 288);
  ctx.lineTo(372, 306);
  ctx.lineTo(308, 306);
  ctx.closePath();
  ctx.fill();
  // Mast.
  ctx.strokeStyle = '#4a2c1a';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(340, 288);
  ctx.lineTo(340, 128);
  ctx.stroke();
  // Sail.
  ctx.fillStyle = '#f5efe0';
  ctx.beginPath();
  ctx.moveTo(340, 134);
  ctx.lineTo(340, 282);
  ctx.lineTo(392, 282);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#c9b896';
  ctx.lineWidth = 2;
  ctx.stroke();
  // The flag on the mast top: red on the left, yellow on the right.
  ctx.fillStyle = flagColor;
  ctx.beginPath();
  ctx.moveTo(340, 128);
  ctx.lineTo(366, 136);
  ctx.lineTo(340, 144);
  ctx.closePath();
  ctx.fill();
}

function lighthouse(ctx, beamOn) {
  // Tower with two red bands.
  ctx.fillStyle = '#f5efe0';
  ctx.fillRect(548, 128, 34, 122);
  ctx.fillStyle = '#c0392b';
  ctx.fillRect(548, 158, 34, 18);
  ctx.fillRect(548, 202, 34, 18);
  // Gallery and lamp room.
  ctx.fillStyle = '#33415c';
  ctx.fillRect(542, 112, 46, 16);
  ctx.fillStyle = '#ffd76a';
  ctx.fillRect(552, 96, 26, 16);
  ctx.fillStyle = '#33415c';
  ctx.fillRect(550, 90, 30, 6);
  // The beam: a warm cone shining left across the sky.
  if (beamOn) {
    const g = ctx.createLinearGradient(552, 104, 420, 150);
    g.addColorStop(0, 'rgba(255,214,106,0.55)');
    g.addColorStop(1, 'rgba(255,214,106,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(552, 100);
    ctx.lineTo(552, 118);
    ctx.lineTo(418, 178);
    ctx.lineTo(418, 132);
    ctx.closePath();
    ctx.fill();
  }
}

function gull(ctx, x, y) {
  ctx.strokeStyle = '#2c2c34';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x - 12, y);
  ctx.quadraticCurveTo(x - 4, y - 9, x, y);
  ctx.quadraticCurveTo(x + 4, y - 9, x + 12, y);
  ctx.stroke();
}

function pier(ctx, crate) {
  // Deck planks.
  ctx.fillStyle = '#8a6b46';
  ctx.fillRect(0, 336, PANEL_WIDTH, 26);
  ctx.strokeStyle = '#6b4e2e';
  ctx.lineWidth = 2;
  for (let x = 24; x < PANEL_WIDTH; x += 48) {
    ctx.beginPath();
    ctx.moveTo(x, 336);
    ctx.lineTo(x, 362);
    ctx.stroke();
  }
  // Support posts.
  ctx.fillStyle = '#5d4126';
  for (const x of [40, 180, 320, 460, 590]) {
    ctx.fillRect(x, 362, 10, 30);
  }
  // The crate at the far end of the pier.
  if (crate) {
    ctx.fillStyle = '#a9803e';
    ctx.fillRect(504, 312, 32, 24);
    ctx.strokeStyle = '#6b4e2e';
    ctx.lineWidth = 2;
    ctx.strokeRect(504, 312, 32, 24);
    ctx.beginPath();
    ctx.moveTo(504, 312);
    ctx.lineTo(536, 336);
    ctx.moveTo(536, 312);
    ctx.lineTo(504, 336);
    ctx.stroke();
  }
}

function buoy(ctx) {
  ctx.fillStyle = '#c0392b';
  ctx.beginPath();
  ctx.arc(180, 330, 12, Math.PI, 0);
  ctx.fill();
  ctx.fillStyle = '#f5efe0';
  ctx.fillRect(176, 322, 8, 8);
  ctx.fillStyle = '#c0392b';
  ctx.beginPath();
  ctx.arc(180, 330, 12, 0, Math.PI);
  ctx.fill();
}

function dinghy(ctx) {
  // Moored in the open water below the pier, clear of the deck and posts.
  ctx.fillStyle = '#3f6b4f';
  ctx.beginPath();
  ctx.moveTo(70, 384);
  ctx.lineTo(120, 384);
  ctx.lineTo(110, 396);
  ctx.lineTo(80, 396);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#2c2c34';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(95, 384);
  ctx.lineTo(95, 372);
  ctx.stroke();
}

function rocks(ctx) {
  ctx.fillStyle = '#3a3f4a';
  ctx.beginPath();
  ctx.moveTo(0, PANEL_HEIGHT);
  ctx.lineTo(0, 408);
  ctx.lineTo(70, 424);
  ctx.lineTo(96, PANEL_HEIGHT);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(PANEL_WIDTH, PANEL_HEIGHT);
  ctx.lineTo(PANEL_WIDTH, 412);
  ctx.lineTo(552, 428);
  ctx.lineTo(540, PANEL_HEIGHT);
  ctx.closePath();
  ctx.fill();
}

// Draws one whole panel. `v` is the variant (LEFT_VARIANT or RIGHT_VARIANT).
export function drawHarbour(ctx, v) {
  ctx.clearRect(0, 0, PANEL_WIDTH, PANEL_HEIGHT);
  sky(ctx);
  stars(ctx);
  clouds(ctx);
  sun(ctx);
  sea(ctx);
  cottage(ctx, v.windowsLit);
  sailboat(ctx, v.flag);
  lighthouse(ctx, v.beam);
  if (v.gull) {
    gull(ctx, 215, 78);
    gull(ctx, 250, 70);
    gull(ctx, 350, 64);
  } else {
    gull(ctx, 250, 70);
    gull(ctx, 350, 64);
  }
  if (v.buoy) buoy(ctx);
  if (v.dinghy) dinghy(ctx);
  pier(ctx, v.crate);
  rocks(ctx);
}

// A red ring marker with a number badge, drawn over a found difference.
export function drawFoundMarker(ctx, x, y, n) {
  ctx.save();
  ctx.strokeStyle = '#ff3b30';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(x, y, 26, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = '#ff3b30';
  ctx.beginPath();
  ctx.arc(x + 18, y - 18, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 15px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(String(n), x + 18, y - 17);
  ctx.restore();
}

// A small red X for a wrong click, fading with `alpha` 0..1.
export function drawMissMark(ctx, x, y, alpha) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = '#ff3b30';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(x - 10, y - 10);
  ctx.lineTo(x + 10, y + 10);
  ctx.moveTo(x + 10, y - 10);
  ctx.lineTo(x - 10, y + 10);
  ctx.stroke();
  ctx.restore();
}

// A pulsing gold ring for the hint, `pulse` 0..1 drives its size and alpha.
export function drawHintRing(ctx, x, y, pulse) {
  ctx.save();
  ctx.strokeStyle = '#ffd76a';
  ctx.lineWidth = 4;
  ctx.globalAlpha = 0.95 - pulse * 0.55;
  ctx.beginPath();
  ctx.arc(x, y, 24 + pulse * 14, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}
