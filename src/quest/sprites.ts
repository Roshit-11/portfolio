// ──────────────────────────────────────────────────────────────
//  ROSHIT QUEST — sprites.ts
//  Procedural pixel art. Every sprite is a string grid + palette,
//  rasterized once to an offscreen canvas. Zero image assets.
// ──────────────────────────────────────────────────────────────

export const TILE = 16;

export function makeSprite(rows: string[], palette: Record<string, string>): HTMLCanvasElement {
  const h = rows.length;
  const w = rows[0].length;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const g = c.getContext('2d')!;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const ch = rows[y][x];
      if (ch === ' ' || ch === '.') continue;
      g.fillStyle = palette[ch] ?? '#f0f';
      g.fillRect(x, y, 1, 1);
    }
  }
  return c;
}

// ── Player (12×16, 4 directions × 2 walk frames) ─────────────
// s=skin h=hair j=jacket t=tshirt p=pants b=boots o=outline e=eye
const P = {
  s: '#e8b88a', h: '#2b2018', j: '#155e75', t: '#22d3ee', p: '#334155',
  b: '#1e293b', o: '#0b1120', e: '#0b1120', w: '#f8fafc',
};

const playerDown = (step: 0 | 1) => makeSprite([
  '..hhhhhhhh..',
  '.hhhhhhhhhh.',
  '.hhsssssshh.',
  '.hsssssssss.',
  '..sesssess..',
  '..ssssssss..',
  '...ssssss...',
  '..jjjtjjjj..',
  '.jjjjttjjjj.',
  '.sjjjttjjjs.',
  '.sjjjjjjjjs.',
  '..jjjjjjjj..',
  '...pppppp...',
  step ? '...ppp.pp...' : '...pp.ppp...',
  step ? '...bb...bb..' : '..bb...bb...',
  step ? '...bb...bb..' : '..bb...bb...',
], P);

const playerUp = (step: 0 | 1) => makeSprite([
  '..hhhhhhhh..',
  '.hhhhhhhhhh.',
  '.hhhhhhhhhh.',
  '.hhhhhhhhhh.',
  '..hhhhhhhh..',
  '..sshhhhss..',
  '...ssssss...',
  '..jjjjjjjj..',
  '.jjjjjjjjjj.',
  '.sjjjjjjjjs.',
  '.sjjjjjjjjs.',
  '..jjjjjjjj..',
  '...pppppp...',
  step ? '...ppp.pp...' : '...pp.ppp...',
  step ? '...bb...bb..' : '..bb...bb...',
  step ? '...bb...bb..' : '..bb...bb...',
], P);

const playerSide = (step: 0 | 1, flip: boolean) => {
  const rows = [
    '..hhhhhhh...',
    '.hhhhhhhhh..',
    '.hhsssssh...',
    '.hssssssh...',
    '..sesss.....',
    '..ssssss....',
    '...sssss....',
    '..jjjjjjj...',
    '..jjjjjjjj..',
    '..sjjjjjjs..',
    '..sjjjjjjs..',
    '...jjjjjj...',
    '...ppppp....',
    step ? '...pp..pp...' : '....pppp....',
    step ? '..bb....bb..' : '....bbbb....',
    step ? '..bb....bb..' : '....bb.bb...',
  ];
  const c = makeSprite(rows, P);
  if (!flip) return c;
  const f = document.createElement('canvas');
  f.width = c.width; f.height = c.height;
  const g = f.getContext('2d')!;
  g.translate(c.width, 0); g.scale(-1, 1);
  g.drawImage(c, 0, 0);
  return f;
};

export const playerSprites = {
  down: [playerDown(0), playerDown(1)],
  up: [playerUp(0), playerUp(1)],
  left: [playerSide(0, false), playerSide(1, false)],
  right: [playerSide(0, true), playerSide(1, true)],
};

// ── Cat NPC (16×12, 2 frames) ────────────────────────────────
const CAT = { f: '#f59e0b', d: '#b45309', e: '#0b1120', w: '#fef3c7', p: '#fda4af' };
export const catSprites = [
  makeSprite([
    '.f..f...........',
    '.ff.ff..........',
    '.ffffff.........',
    '.fefeff.....d...',
    '.ffffwf....dd...',
    '..ffff....dd....',
    '..fffffffff.....',
    '..fffffffff.....',
    '..ffffffff......',
    '..f..f..f.f.....',
    '..f..f..f.f.....',
    '................',
  ], CAT),
  makeSprite([
    '.f..f...........',
    '.ff.ff.......d..',
    '.ffffff......d..',
    '.fefeff.....d...',
    '.ffffwf....d....',
    '..ffff....d.....',
    '..fffffffff.....',
    '..fffffffff.....',
    '..ffffffff......',
    '...f..f..ff.....',
    '..f...f...f.....',
    '................',
  ], CAT),
];

// ── Terrain tiles (16×16), painted with light noise ──────────
function tileCanvas(paint: (g: CanvasRenderingContext2D) => void): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = TILE; c.height = TILE;
  paint(c.getContext('2d')!);
  return c;
}

// deterministic pseudo-random for stable noise
function prand(seed: number) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

function noisy(base: string, specks: string[], count: number, seed: number) {
  return tileCanvas((g) => {
    g.fillStyle = base;
    g.fillRect(0, 0, TILE, TILE);
    const r = prand(seed);
    for (let i = 0; i < count; i++) {
      g.fillStyle = specks[i % specks.length];
      g.fillRect((r() * TILE) | 0, (r() * TILE) | 0, 1, 1);
    }
  });
}

export const tiles = {
  grass: noisy('#2f6b3a', ['#3a7d46', '#265c31', '#4f9e5c'], 26, 7),
  grass2: noisy('#2c6537', ['#3a7d46', '#245830'], 18, 13),
  path: noisy('#b08d57', ['#c9a36b', '#9a7a49', '#87683c'], 20, 5),
  sand: noisy('#d9c07e', ['#e6d194', '#c4ab68'], 16, 9),
  floor: noisy('#8a6f4d', ['#96795a', '#7d6242'], 12, 11),

  water: [
    tileCanvas((g) => {
      g.fillStyle = '#1d4ed8'; g.fillRect(0, 0, TILE, TILE);
      g.fillStyle = '#3b82f6';
      g.fillRect(2, 3, 5, 1); g.fillRect(9, 8, 5, 1); g.fillRect(4, 13, 4, 1);
    }),
    tileCanvas((g) => {
      g.fillStyle = '#1d4ed8'; g.fillRect(0, 0, TILE, TILE);
      g.fillStyle = '#3b82f6';
      g.fillRect(4, 4, 5, 1); g.fillRect(7, 10, 5, 1); g.fillRect(2, 14, 4, 1);
    }),
  ],

  tree: tileCanvas((g) => {
    g.fillStyle = '#2f6b3a'; g.fillRect(0, 0, TILE, TILE);
    g.fillStyle = '#14532d';
    g.beginPath(); g.arc(8, 6, 6, 0, 7); g.fill();
    g.fillStyle = '#166534';
    g.beginPath(); g.arc(5, 8, 4, 0, 7); g.fill();
    g.beginPath(); g.arc(11, 8, 4, 0, 7); g.fill();
    g.fillStyle = '#78350f'; g.fillRect(7, 11, 3, 5);
  }),

  flower: tileCanvas((g) => {
    g.drawImage(noisy('#2f6b3a', ['#3a7d46'], 12, 21), 0, 0);
    const dots: [number, number, string][] = [[3, 4, '#f472b6'], [11, 6, '#fbbf24'], [6, 11, '#f8fafc'], [13, 12, '#f472b6']];
    for (const [x, y, col] of dots) {
      g.fillStyle = col; g.fillRect(x, y, 2, 2);
      g.fillStyle = '#fde68a'; g.fillRect(x, y, 1, 1);
    }
  }),

  wallStone: tileCanvas((g) => {
    g.fillStyle = '#64748b'; g.fillRect(0, 0, TILE, TILE);
    g.fillStyle = '#475569';
    g.fillRect(0, 0, TILE, 1); g.fillRect(0, 5, TILE, 1); g.fillRect(0, 10, TILE, 1); g.fillRect(0, 15, TILE, 1);
    g.fillRect(4, 1, 1, 4); g.fillRect(11, 1, 1, 4); g.fillRect(7, 6, 1, 4); g.fillRect(2, 11, 1, 4); g.fillRect(13, 11, 1, 4);
    g.fillStyle = '#94a3b8'; g.fillRect(1, 1, 3, 1); g.fillRect(8, 6, 3, 1);
  }),
};

export function roofTile(color: string, ridge: string): HTMLCanvasElement {
  return tileCanvas((g) => {
    g.fillStyle = color; g.fillRect(0, 0, TILE, TILE);
    g.fillStyle = ridge;
    g.fillRect(0, 3, TILE, 1); g.fillRect(0, 9, TILE, 1); g.fillRect(0, 15, TILE, 1);
  });
}

export function wallTile(color: string, dark: string): HTMLCanvasElement {
  return tileCanvas((g) => {
    g.fillStyle = color; g.fillRect(0, 0, TILE, TILE);
    g.fillStyle = dark; g.fillRect(0, 14, TILE, 2);
  });
}

export const doorTile = tileCanvas((g) => {
  g.fillStyle = '#d6c9a8'; g.fillRect(0, 0, TILE, TILE);
  g.fillStyle = '#78350f'; g.fillRect(3, 3, 10, 13);
  g.fillStyle = '#92400e'; g.fillRect(4, 4, 8, 12);
  g.fillStyle = '#fbbf24'; g.fillRect(10, 9, 1, 2);
});

export const windowTile = (wall: string) => tileCanvas((g) => {
  g.fillStyle = wall; g.fillRect(0, 0, TILE, TILE);
  g.fillStyle = '#0b1120'; g.fillRect(3, 4, 10, 8);
  g.fillStyle = '#38bdf8'; g.fillRect(4, 5, 8, 6);
  g.fillStyle = '#bae6fd'; g.fillRect(4, 5, 3, 2);
});

// ── Objects ──────────────────────────────────────────────────
export const signSprite = makeSprite([
  '................',
  '.oooooooooooo...',
  '.owwwwwwwwwwo...',
  '.owllwlwlwllo...',
  '.owwwwwwwwwwo...',
  '.owlwlwllwwlo...',
  '.owwwwwwwwwwo...',
  '.oooooooooooo...',
  '......oo........',
  '......oo........',
  '......oo........',
  '......oo........',
  '................',
  '................',
  '................',
  '................',
], { o: '#78350f', w: '#d6a35c', l: '#8a5a2b' });

export const mailboxSprite = makeSprite([
  '................',
  '................',
  '...rrrrrrrrr....',
  '..rrrrrrrrrrr...',
  '..rwwrrrrrrrr...',
  '..rwwrrrrrrrr...',
  '..rrrrrrrrrrr...',
  '...rrrrrrrrr....',
  '......pp........',
  '......pp........',
  '......pp........',
  '......pp........',
  '......pp........',
  '.....pppp.......',
  '................',
  '................',
], { r: '#dc2626', w: '#f8fafc', p: '#78350f' });

export function orbSprite(color: string, glow: string): HTMLCanvasElement {
  return makeSprite([
    '................',
    '................',
    '.....gggg.......',
    '....gccccg......',
    '...gccwwccg.....',
    '...gccwwccg.....',
    '...gccccccg.....',
    '...gccccccg.....',
    '....gccccg......',
    '.....gggg.......',
    '......ss........',
    '.....ssss.......',
    '................',
    '................',
    '................',
    '................',
  ], { c: color, g: glow, w: '#f8fafc', s: '#334155' });
}

export function arcadeSprite(accent: string): HTMLCanvasElement {
  return makeSprite([
    '..aaaaaaaaaaaa..',
    '.aaaaaaaaaaaaaa.',
    '.aabbbbbbbbbbaa.',
    '.aabsssssssbbaa.',
    '.aabsttttssbbaa.',
    '.aabssssssbbbaa.',
    '.aabbbbbbbbbbaa.',
    '.aaaaaaaaaaaaaa.',
    '.aadddddddddaaa.',
    '.aadrdrdrdrdaaa.',
    '.aadddddddddaaa.',
    '.aaaaaaaaaaaaaa.',
    '.aa..........aa.',
    '.aa..........aa.',
    '.aaa........aaa.',
    '................',
  ], { a: '#1e293b', b: '#0b1120', s: accent, t: '#f8fafc', d: '#334155', r: '#f472b6' });
}

export const shrineSprite = makeSprite([
  '................',
  '......gggg......',
  '.....gwwwwg.....',
  '.....gwwwwg.....',
  '......gggg......',
  '....ssssssss....',
  '...ssssssssss...',
  '....ssssssss....',
  '.....ssssss.....',
  '.....ssssss.....',
  '.....ssssss.....',
  '....ssssssss....',
  '...ssssssssss...',
  '..ssssssssssss..',
  '................',
  '................',
], { s: '#94a3b8', g: '#fbbf24', w: '#fef9c3' });

export const portalSprite = makeSprite([
  '.....pppppp.....',
  '...pppccccppp...',
  '..ppccccccccpp..',
  '..pcccwwwwcccp..',
  '.ppccwwccwwccpp.',
  '.pccwwccccwwccp.',
  '.pccwcccccwwccp.',
  '.pccwccccccwccp.',
  '.pccwwccccwwccp.',
  '.ppccwwwwwwccpp.',
  '..pccccccccccp..',
  '..ppccccccccpp..',
  '...pppccccppp...',
  '.....pppppp.....',
  '................',
  '................',
], { p: '#7c3aed', c: '#a78bfa', w: '#f8fafc' });
