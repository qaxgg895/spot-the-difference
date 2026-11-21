// differences.js — the seven planted differences of "Harbour at Dusk".
// Each difference is a circle in panel coordinates (one panel is 620 x 440).
// The left panel shows the base scene; the right panel changes exactly these
// seven things. A difference counts as found when the player clicks inside
// its circle on either panel.

export const PANEL_WIDTH = 620;
export const PANEL_HEIGHT = 440;

export const DIFFERENCES = [
  {
    id: 'beam',
    name: 'Lighthouse beam',
    hint: 'Look at the lighthouse lamp — is it shining?',
    x: 468,
    y: 152,
    r: 42,
  },
  {
    id: 'gull',
    name: 'A gull in the sky',
    hint: 'Count the birds in the sky.',
    x: 215,
    y: 78,
    r: 24,
  },
  {
    id: 'flag',
    name: 'The sailboat flag',
    hint: 'What colour is the little flag on the mast?',
    x: 322,
    y: 110,
    r: 24,
  },
  {
    id: 'window',
    name: 'A cottage window',
    hint: 'How many cottage windows are lit?',
    x: 112,
    y: 222,
    r: 20,
  },
  {
    id: 'buoy',
    name: 'The red buoy',
    hint: 'Something floats in the water on the left.',
    x: 180,
    y: 332,
    r: 26,
  },
  {
    id: 'crate',
    name: 'A crate on the pier',
    hint: 'Check the far end of the pier.',
    x: 520,
    y: 342,
    r: 28,
  },
  {
    id: 'dinghy',
    name: 'The little rowboat',
    hint: 'Is there a boat tucked under the pier?',
    x: 95,
    y: 388,
    r: 30,
  },
];

// Which panel shows which version of each difference. The left panel is the
// base scene; the right panel is the changed one.
export const LEFT_VARIANT = {
  beam: true,
  gull: true,
  flag: 'red',
  windowsLit: 3,
  buoy: true,
  crate: true,
  dinghy: true,
};

export const RIGHT_VARIANT = {
  beam: false,
  gull: false,
  flag: 'yellow',
  windowsLit: 2,
  buoy: false,
  crate: false,
  dinghy: false,
};

// Hit test: returns the difference under (x, y) in panel coordinates, or
// null. Checks the nearest circle first so overlapping zones resolve sanely.
export function differenceAt(x, y) {
  let best = null;
  let bestDist = Infinity;
  for (const d of DIFFERENCES) {
    const dist = Math.hypot(x - d.x, y - d.y);
    if (dist <= d.r && dist < bestDist) {
      best = d;
      bestDist = dist;
    }
  }
  return best;
}
