// ──────────────────────────────────────────────────────────────
//  ROSHIT QUEST — world.ts
//  The island map + every interactable, generated from the same
//  data file the portfolio site uses (src/data/portfolio.ts).
// ──────────────────────────────────────────────────────────────

import {
  certifications,
  education,
  experience,
  profile,
  projects,
  skillGroups,
  tenure,
} from '../data/portfolio';

export interface DialogLink {
  label: string;
  url: string;
}

export interface DialogSpec {
  title: string;
  icon?: string;
  lines: string[];
  links?: DialogLink[];
}

export interface Interactable {
  id: string;
  tx: number; // tile coords
  ty: number;
  sprite: 'sign' | 'mailbox' | 'orb' | 'arcade' | 'shrine' | 'door' | 'portal' | 'none';
  color?: string;
  label: string;
  dialog: DialogSpec;
  xp: number;
  quest?: string; // quest checklist key
  collectible?: boolean; // disappears after interaction (orbs)
}

export interface Building {
  tx: number;
  ty: number;
  w: number; // tiles
  h: number; // wall+roof rows total
  roof: string;
  ridge: string;
  wall: string;
  wallDark: string;
  doorX: number; // tile offset of door within building
  windows: number[];
  label: string;
}

// ── Terrain (52 × 40) ────────────────────────────────────────
// # tree  . grass  , grass2  - path  ~ water  f flower  s sand
const MAP_STR = `
####################################################
####..........#####......................######~~###
##..............###......................####~~~~##
##...ff...........................ff......##~~~~~##
#...ffff.......,,......................,,...#~~~~##
#....ff........,,..........................s~~~~~##
#...........................................s~~~~##
#.....,,......................,,............s~~~###
#.............................,,...........#s~~###
##...................--...................##ss~~###
##f..................--......................s~####
#ff.......---------------------------.......s~~####
#f........-..........--.............-......s~~~####
#.........-..........--.............-......#~~#####
#..flf....-..........--.............-.......s~#####
#..fff....-..........--.............-........s#####
#...f.....-..........--.............-........######
#.........-..........--.............-...,,...######
#..,,.....-..........--.............-........######
#.........----------------------------------.######
#.........-..........--.............-......-.######
#..f..f...-..........--.............-......-.######
#..ff.....-..........--.............-......-.######
#..ffff...-..........--......,,.....-......-.######
#...ff....-..........--.............-......-.######
#..fff....-..........--.............-......-.######
#...f.....-...........-.............-......-.######
#.........-...........-.............-......-.######
##........-...........-.............-......-.######
##....................-....................-.######
##.,,.................-......,,............-.######
##....................-....................-.######
###...................-..................###.######
###...##..............-.................##...######
##...####.............-.................#..s~~#####
##....##...............................##.s~~~~####
##.......................ff...........###s~~~~~####
###......................ff...........##~~~~~~#####
####.................................###~~~~~######
#####...........................t.o.####~~~~~######
####################################################
`;

// Normalize rows: hand-typed ASCII maps drift in width — pad with trees.
const rawRows = MAP_STR.trim().split('\n');
export const MAP_W = Math.max(...rawRows.map((r) => r.length));
export const MAP: string[] = rawRows.map((r) => r.padEnd(MAP_W, '#'));
export const MAP_H = MAP.length;

// ── Buildings ────────────────────────────────────────────────
export const buildings: Building[] = [
  { tx: 11, ty: 4, w: 7, h: 6, roof: '#b91c1c', ridge: '#7f1d1d', wall: '#d6c9a8', wallDark: '#a89a76', doorX: 3, windows: [1, 5], label: "Roshit's House" },
  { tx: 30, ty: 3, w: 8, h: 8, roof: '#155e75', ridge: '#0e7490', wall: '#94a3b8', wallDark: '#64748b', doorX: 3, windows: [1, 6], label: 'Career Tower' },
  { tx: 3, ty: 30, w: 7, h: 6, roof: '#6d28d9', ridge: '#4c1d95', wall: '#c4b5fd', wallDark: '#8b7bd8', doorX: 3, windows: [1, 5], label: 'The Academy' },
];

// ── Dialog builders from real portfolio data ─────────────────
const short = (s: string, n = 120) => (s.length > n ? s.slice(0, n - 1) + '…' : s);

function projectDialog(p: (typeof projects)[number]): DialogSpec {
  const links: DialogLink[] = [];
  if (p.github) links.push({ label: '⌨ Source Code', url: p.github });
  if (p.live) links.push({ label: '▶ Live Demo', url: p.live });
  return {
    title: p.title,
    icon: '🕹',
    lines: [
      `PROBLEM  ${short(p.problem)}`,
      `SOLUTION ${short(p.solution)}`,
      `STACK    ${p.tech.join(' · ')}`,
      ...(p.note ? [p.note] : []),
    ],
    links,
  };
}

const ORB_COLORS: [string, string][] = [
  ['#22d3ee', '#67e8f9'],
  ['#a78bfa', '#c4b5fd'],
  ['#34d399', '#6ee7b7'],
  ['#fbbf24', '#fde68a'],
  ['#f472b6', '#f9a8d4'],
  ['#38bdf8', '#7dd3fc'],
];

// ── Interactables ────────────────────────────────────────────
export function buildInteractables(): Interactable[] {
  const items: Interactable[] = [];

  // Welcome sign at spawn
  items.push({
    id: 'sign-welcome', tx: 25, ty: 21, sprite: 'sign', label: 'Read',
    xp: 5,
    dialog: {
      title: 'Welcome to Roshit Quest!', icon: '🗺',
      lines: [
        'This island IS the portfolio. Explore it.',
        '← ↑ ↓ → / WASD to walk · E or ENTER to interact',
        'NORTH: Roshit\'s house & Career Tower',
        'WEST: Skill Garden & Academy · EAST: Project Arcade',
        'Finish the GET HIRED quest (top-left checklist).',
      ],
    },
  });

  // About — house door dialog
  items.push({
    id: 'about', tx: 14, ty: 9, sprite: 'none', label: 'Knock',
    xp: 20, quest: 'about',
    dialog: {
      title: 'Roshit Lamichhane', icon: '👋',
      lines: [
        profile.role + ' — ' + profile.location,
        'B.Sc. (Hons) Computing with AI @ Islington College.',
        'Automates marketing data pipelines at Allied Title',
        '& Escrow. Ships AI tools, bots and full-stack apps.',
        'Likes systems that keep running after he stops watching.',
      ],
      links: [{ label: '🌐 Classic Portfolio', url: '/' }],
    },
  });

  // Experience — tower door
  const exp = experience[0];
  items.push({
    id: 'experience', tx: 33, ty: 11, sprite: 'none', label: 'Enter',
    xp: 25, quest: 'experience',
    dialog: {
      title: `${exp.role} @ ${exp.company}`, icon: '💼',
      lines: [
        tenure(exp),
        exp.summary,
        ...exp.bullets.slice(0, 3).map((b) => '• ' + short(b, 90)),
        'STACK ' + exp.tech.join(' · '),
      ],
    },
  });

  // Education — academy door
  items.push({
    id: 'education', tx: 6, ty: 36, sprite: 'none', label: 'Enter',
    xp: 20, quest: 'education',
    dialog: {
      title: 'The Academy', icon: '🎓',
      lines: education.flatMap((e) => [
        `${e.school} (${e.period})`,
        '• ' + e.degree + (e.detail ? ` — ${short(e.detail, 70)}` : ''),
      ]),
    },
  });

  // Projects — arcade cabinets, east plaza (3 × 3)
  const ARCADE_ORIGIN = { x: 39, y: 13 };
  projects.forEach((p, i) => {
    const col = i % 2;
    const row = (i / 2) | 0;
    items.push({
      id: `project-${i}`,
      tx: ARCADE_ORIGIN.x + col * 3,
      ty: ARCADE_ORIGIN.y + row * 3,
      sprite: 'arcade',
      color: ['#22d3ee', '#a78bfa', '#34d399', '#fbbf24', '#f472b6', '#38bdf8', '#fb923c', '#4ade80', '#e879f9'][i % 9],
      label: 'Play',
      xp: 15, quest: 'project',
      dialog: projectDialog(p),
    });
  });

  // Skills — garden orbs, west side
  const ORB_SPOTS: [number, number][] = [[4, 13], [7, 16], [4, 20], [8, 22], [5, 25], [8, 27]];
  skillGroups.forEach((g, i) => {
    const [tx, ty] = ORB_SPOTS[i % ORB_SPOTS.length];
    items.push({
      id: `skill-${i}`, tx, ty, sprite: 'orb',
      color: String(i),
      label: 'Collect',
      xp: 15, quest: 'skill', collectible: true,
      dialog: {
        title: `Skill Orb: ${g.title}`, icon: '🔮',
        lines: [g.skills.join(' · '), '+15 XP — orb absorbed!'],
      },
    });
  });

  // Certifications — three shrines, south-center
  const certGroups: { name: string; certs: typeof certifications }[] = [
    { name: 'AWS Academy', certs: certifications.filter((c) => c.issuer === 'AWS Academy') },
    { name: 'LinkedIn Learning', certs: certifications.filter((c) => c.issuer === 'LinkedIn Learning') },
    { name: 'Islington College', certs: certifications.filter((c) => c.issuer === 'Islington College') },
  ];
  const SHRINE_SPOTS: [number, number][] = [[27, 33], [30, 34], [33, 33]];
  certGroups.forEach((grp, i) => {
    const [tx, ty] = SHRINE_SPOTS[i];
    items.push({
      id: `certs-${i}`, tx, ty, sprite: 'shrine', label: 'Pray',
      xp: 15, quest: 'certs',
      dialog: {
        title: `Shrine of ${grp.name}`, icon: '🏅',
        lines: grp.certs.map((c) => '• ' + c.title),
        links: grp.certs
          .filter((c) => c.driveId || c.url)
          .slice(0, 4)
          .map((c) => ({
            label: '📜 ' + short(c.title.replace(/^AWS Academy — /, ''), 26),
            url: c.driveId ? `https://drive.google.com/file/d/${c.driveId}/view` : c.url!,
          })),
      },
    });
  });

  // Contact — mailbox near pond
  items.push({
    id: 'contact', tx: 44, ty: 29, sprite: 'mailbox', label: 'Open',
    xp: 20, quest: 'contact',
    dialog: {
      title: 'Contact Roshit', icon: '📮',
      lines: [
        'Open to internships, junior roles and collabs.',
        profile.email,
        'Kathmandu, Nepal (UTC+5:45)',
      ],
      links: [
        { label: '✉ Email', url: `mailto:${profile.email}` },
        { label: '⌨ GitHub', url: profile.github },
        { label: '💼 LinkedIn', url: profile.linkedin },
      ],
    },
  });

  // Portal back to the classic site
  items.push({
    id: 'portal', tx: 23, ty: 19, sprite: 'portal', label: 'Enter Portal',
    xp: 5,
    dialog: {
      title: 'Portal to the Classic Portfolio', icon: '🌀',
      lines: ['Leave the island and visit the professional site?'],
      links: [{ label: '🌐 Take me there', url: '/' }],
    },
  });

  return items;
}

export const QUEST_STEPS: { key: string; label: string; need: number }[] = [
  { key: 'about', label: 'Meet Roshit', need: 1 },
  { key: 'experience', label: 'Visit Career Tower', need: 1 },
  { key: 'project', label: 'Play 3 arcade projects', need: 3 },
  { key: 'skill', label: 'Collect 4 skill orbs', need: 4 },
  { key: 'education', label: 'Enter the Academy', need: 1 },
  { key: 'certs', label: 'Pray at a cert shrine', need: 1 },
  { key: 'contact', label: 'Check the mailbox', need: 1 },
];

export { ORB_COLORS };
