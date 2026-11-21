// main.ts — hands the game in for make.fun's spot-the-difference bounty.
// It copies game/ and screenshots/ from this repository to the output
// directory and writes dossier.json with buildDossier from
// vendor/makefun-game.ts. Standard library only, no network, deterministic:
// two runs write the same bytes.

import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const repoRoot = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR || '/output';

mkdirSync(outDir, { recursive: true });
cpSync(join(repoRoot, 'game'), join(outDir, 'game'), { recursive: true });
cpSync(join(repoRoot, 'screenshots'), join(outDir, 'screenshots'), { recursive: true });

const dossier = buildDossier(outDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
});
writeFileSync(join(outDir, 'dossier.json'), dossier);

// Self-check: the hand-in is only good if the dossier reads back and the
// game page landed in the output. Fail loudly instead of handing in a
// half-written directory — the grader runs this program twice and both
// runs must write the same bytes.
const written = JSON.parse(readFileSync(join(outDir, 'dossier.json'), 'utf8'));
if (written.schema !== 'makefun/dossier/v1') {
  throw new Error(`dossier.json has unexpected schema ${written.schema}`);
}
if (!existsSync(join(outDir, 'game', 'index.html'))) {
  throw new Error('game/index.html missing from output');
}
if (!existsSync(join(outDir, 'screenshots'))) {
  throw new Error('screenshots/ missing from output');
}

console.log(`wrote ${outDir}/dossier.json (${dossier.length} bytes)`);
