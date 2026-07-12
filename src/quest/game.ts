// ──────────────────────────────────────────────────────────────
//  ROSHIT QUEST — game.ts
//  Hand-rolled canvas engine: tilemap, collision, camera, dialog,
//  quest/achievement/XP systems, cat NPC, konami mode.
// ──────────────────────────────────────────────────────────────

import { sfx } from './audio';
import {
  TILE,
  arcadeSprite,
  catSprites,
  doorTile,
  mailboxSprite,
  orbSprite,
  playerSprites,
  portalSprite,
  roofTile,
  shrineSprite,
  signSprite,
  tiles,
  wallTile,
  windowTile,
} from './sprites';
import {
  Interactable,
  MAP,
  MAP_H,
  MAP_W,
  ORB_COLORS,
  QUEST_STEPS,
  buildInteractables,
  buildings,
} from './world';

type Dir = 'up' | 'down' | 'left' | 'right';

export interface GameEvents {
  onDialog(item: Interactable): void;
  onXP(xp: number, level: number, gained: number): void;
  onQuestProgress(): void;
  onAchievement(name: string, desc: string): void;
  onComplete(): void;
  onPrompt(label: string | null): void;
}

const SAVE_KEY = 'roshit_quest_save_v1';

interface SaveState {
  xp: number;
  seen: string[];
  achievements: string[];
}

export class Game {
  canvas: HTMLCanvasElement;
  g: CanvasRenderingContext2D;
  scale = 3;

  // player state (pixel coords, feet-center)
  px = 25 * TILE + 8;
  py = 23 * TILE + 8;
  dir: Dir = 'down';
  moving = false;
  animTime = 0;
  frozen = false; // dialog open

  keys = new Set<string>();
  touchVec = { x: 0, y: 0 };

  solid: boolean[] = [];
  structures: { img: HTMLCanvasElement; x: number; y: number }[] = [];
  overhang: { img: HTMLCanvasElement; x: number; y: number }[] = [];
  items: Interactable[];
  seen = new Set<string>();
  achievements = new Set<string>();
  xp = 0;
  questCounts: Record<string, Set<string>> = {};
  completed = false;
  rainbow = false;

  cat = { x: 18 * TILE, y: 26 * TILE, dir: 1, timer: 0, frame: 0 };
  nearItem: Interactable | null = null;

  time = 0;
  konami: string[] = [];

  private events: GameEvents;
  private tileCache: Record<string, HTMLCanvasElement> = {};
  private stepTimer = 0;
  private raf = 0;
  private last = 0;

  constructor(canvas: HTMLCanvasElement, events: GameEvents) {
    this.canvas = canvas;
    this.g = canvas.getContext('2d')!;
    this.events = events;
    this.items = buildInteractables();

    this.buildCollision();
    this.buildStructures();
    this.load();

    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', (e) => this.keys.delete(e.key.toLowerCase()));
    window.addEventListener('resize', () => this.fit());
    this.fit();
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    window.removeEventListener('keydown', this.onKeyDown);
  }

  // ── Persistence ────────────────────────────────────────────
  private load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return;
      const s: SaveState = JSON.parse(raw);
      this.xp = s.xp || 0;
      s.seen.forEach((id) => this.seen.add(id));
      s.achievements.forEach((a) => this.achievements.add(a));
      for (const it of this.items) {
        if (it.quest && this.seen.has(it.id)) {
          (this.questCounts[it.quest] ??= new Set()).add(it.id);
        }
      }
    } catch { /* fresh start */ }
  }

  private save() {
    const s: SaveState = { xp: this.xp, seen: [...this.seen], achievements: [...this.achievements] };
    localStorage.setItem(SAVE_KEY, JSON.stringify(s));
  }

  reset() {
    localStorage.removeItem(SAVE_KEY);
    location.reload();
  }

  // ── World construction ─────────────────────────────────────
  private buildCollision() {
    this.solid = new Array(MAP_W * MAP_H).fill(false);
    for (let y = 0; y < MAP_H; y++) {
      for (let x = 0; x < MAP_W; x++) {
        const ch = MAP[y][x];
        if (ch === '#' || ch === '~') this.solid[y * MAP_W + x] = true;
      }
    }
    for (const b of buildings) {
      for (let y = b.ty; y < b.ty + b.h; y++) {
        for (let x = b.tx; x < b.tx + b.w; x++) {
          this.solid[y * MAP_W + x] = true;
        }
      }
    }
    // solid interactable props
    for (const it of this.items) {
      if (it.sprite === 'arcade' || it.sprite === 'shrine' || it.sprite === 'sign' || it.sprite === 'mailbox') {
        this.solid[it.ty * MAP_W + it.tx] = true;
      }
    }
  }

  private buildStructures() {
    for (const b of buildings) {
      const c = document.createElement('canvas');
      c.width = b.w * TILE;
      c.height = b.h * TILE;
      const g = c.getContext('2d')!;
      const roof = roofTile(b.roof, b.ridge);
      const wall = wallTile(b.wall, b.wallDark);
      const win = windowTile(b.wall);
      const roofRows = b.h - 2;
      for (let y = 0; y < b.h; y++) {
        for (let x = 0; x < b.w; x++) {
          if (y < roofRows) g.drawImage(roof, x * TILE, y * TILE);
          else g.drawImage(wall, x * TILE, y * TILE);
        }
      }
      // door + windows on the bottom wall row
      const wy = (b.h - 1) * TILE;
      g.drawImage(doorTile, b.doorX * TILE, wy);
      for (const wx of b.windows) g.drawImage(win, wx * TILE, wy);
      // roof trim
      g.fillStyle = 'rgba(0,0,0,0.25)';
      g.fillRect(0, roofRows * TILE - 2, b.w * TILE, 2);
      // label plate
      g.fillStyle = '#0b1120';
      const tw = b.label.length * 4 + 6;
      g.fillRect((b.w * TILE - tw) / 2, roofRows * TILE - 9, tw, 7);
      g.fillStyle = '#fbbf24';
      g.font = '6px monospace';
      g.textAlign = 'center';
      g.fillText(b.label.toUpperCase(), (b.w * TILE) / 2, roofRows * TILE - 3);

      this.structures.push({ img: c, x: b.tx * TILE, y: b.ty * TILE });
    }
  }

  private spriteFor(it: Interactable): HTMLCanvasElement | null {
    const key = it.sprite + (it.color ?? '');
    if (this.tileCache[key]) return this.tileCache[key];
    let s: HTMLCanvasElement | null = null;
    switch (it.sprite) {
      case 'sign': s = signSprite; break;
      case 'mailbox': s = mailboxSprite; break;
      case 'shrine': s = shrineSprite; break;
      case 'portal': s = portalSprite; break;
      case 'arcade': s = arcadeSprite(it.color || '#22d3ee'); break;
      case 'orb': {
        const [c, glow] = ORB_COLORS[Number(it.color) % ORB_COLORS.length];
        s = orbSprite(c, glow);
        break;
      }
      default: s = null;
    }
    if (s) this.tileCache[key] = s;
    return s;
  }

  // ── Input ──────────────────────────────────────────────────
  private onKeyDown = (e: KeyboardEvent) => {
    const k = e.key.toLowerCase();
    if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(k)) e.preventDefault();
    this.keys.add(k);

    // konami
    const seq = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'];
    this.konami.push(k);
    if (this.konami.length > seq.length) this.konami.shift();
    if (seq.every((s, i) => this.konami[i] === s)) {
      this.rainbow = !this.rainbow;
      this.unlock('Konami Coder', 'You know the ancient codes.');
      this.konami = [];
    }

    if (!this.frozen && (k === 'e' || k === 'enter') && this.nearItem) {
      this.interact(this.nearItem);
    }
  };

  // ── Game systems ───────────────────────────────────────────
  interact(it: Interactable) {
    const first = !this.seen.has(it.id);
    this.seen.add(it.id);
    if (first) {
      this.gainXP(it.xp);
      if (it.quest) {
        (this.questCounts[it.quest] ??= new Set()).add(it.id);
        this.events.onQuestProgress();
        this.checkQuestAchievements();
      }
      if (it.sprite === 'orb') sfx.orb();
    }
    sfx.open();
    this.unlock('Curious Mind', 'First interaction. Many more await.');
    this.frozen = true;
    this.events.onDialog(it);
    this.save();
  }

  closeDialog() {
    this.frozen = false;
    sfx.close();
  }

  gainXP(amount: number) {
    this.xp += amount;
    this.events.onXP(this.xp, this.level(), amount);
  }

  level(): number {
    return 1 + Math.floor(this.xp / 60);
  }

  questProgress(): { key: string; label: string; have: number; need: number; done: boolean }[] {
    return QUEST_STEPS.map((s) => {
      const have = Math.min(this.questCounts[s.key]?.size ?? 0, s.need);
      return { ...s, have, done: have >= s.need };
    });
  }

  completionPct(): number {
    const steps = this.questProgress();
    const done = steps.reduce((n, s) => n + s.have / s.need, 0);
    return Math.round((done / steps.length) * 100);
  }

  private checkQuestAchievements() {
    const p = Object.fromEntries(this.questProgress().map((s) => [s.key, s]));
    if (p.project?.done) this.unlock('Arcade Rat', 'Played 3 project cabinets.');
    if ((this.questCounts['skill']?.size ?? 0) >= 6) this.unlock('Botanist', 'Collected every skill orb.');
    if (p.certs?.done && p.education?.done) this.unlock('Scholar', 'Certificates and academia inspected.');
    if (p.contact?.done) this.unlock('Networker', 'Found the mailbox.');
    if (this.questProgress().every((s) => s.done) && !this.completed) {
      this.completed = true;
      this.gainXP(100);
      this.unlock('Completionist', 'GET HIRED quest 100%!');
      sfx.fanfare();
      this.events.onComplete();
    }
  }

  unlock(name: string, desc: string) {
    if (this.achievements.has(name)) return;
    this.achievements.add(name);
    sfx.achievement();
    this.events.onAchievement(name, desc);
    this.save();
  }

  // ── Physics ────────────────────────────────────────────────
  private blockedAt(px: number, py: number): boolean {
    // player hitbox: 10×8 at the feet
    const pts = [
      [px - 5, py - 2], [px + 5, py - 2],
      [px - 5, py + 5], [px + 5, py + 5],
    ];
    for (const [x, y] of pts) {
      const tx = Math.floor(x / TILE);
      const ty = Math.floor(y / TILE);
      if (tx < 0 || ty < 0 || tx >= MAP_W || ty >= MAP_H) return true;
      if (this.solid[ty * MAP_W + tx]) return true;
    }
    return false;
  }

  private update(dt: number) {
    this.time += dt;
    if (this.frozen) return;

    let vx = 0, vy = 0;
    if (this.keys.has('arrowleft') || this.keys.has('a')) vx -= 1;
    if (this.keys.has('arrowright') || this.keys.has('d')) vx += 1;
    if (this.keys.has('arrowup') || this.keys.has('w')) vy -= 1;
    if (this.keys.has('arrowdown') || this.keys.has('s')) vy += 1;
    vx += this.touchVec.x;
    vy += this.touchVec.y;

    const len = Math.hypot(vx, vy);
    this.moving = len > 0.2;
    if (this.moving) {
      vx /= len; vy /= len;
      if (Math.abs(vx) > Math.abs(vy)) this.dir = vx > 0 ? 'right' : 'left';
      else this.dir = vy > 0 ? 'down' : 'up';

      const speed = 92; // px/s
      const nx = this.px + vx * speed * dt;
      const ny = this.py + vy * speed * dt;
      if (!this.blockedAt(nx, this.py)) this.px = nx;
      if (!this.blockedAt(this.px, ny)) this.py = ny;

      this.animTime += dt;
      this.stepTimer -= dt;
      if (this.stepTimer <= 0) {
        sfx.step();
        this.stepTimer = 0.28;
      }
      this.unlock('First Steps', 'You moved. The island notices.');
    }

    // nearest interactable within reach
    let best: Interactable | null = null;
    let bestD = 26;
    for (const it of this.items) {
      if (it.collectible && this.seen.has(it.id)) continue;
      const d = Math.hypot(it.tx * TILE + 8 - this.px, it.ty * TILE + 8 - this.py);
      if (d < bestD) { bestD = d; best = it; }
    }
    if (best !== this.nearItem) {
      this.nearItem = best;
      this.events.onPrompt(best ? best.label : null);
    }

    // cat wander
    const c = this.cat;
    c.timer -= dt;
    if (c.timer <= 0) {
      c.dir = Math.random() < 0.4 ? 0 : Math.random() < 0.5 ? -1 : 1;
      c.timer = 1 + Math.random() * 2;
    }
    if (c.dir !== 0) {
      const nx = c.x + c.dir * 18 * dt;
      const tx = Math.floor((nx + 8) / TILE);
      const ty = Math.floor((c.y + 10) / TILE);
      if (tx > 12 && tx < 22 && !this.solid[ty * MAP_W + tx]) c.x = nx;
      else c.dir = -c.dir;
      c.frame += dt * 6;
    }
    // pet the cat
    if (Math.hypot(c.x + 8 - this.px, c.y + 6 - this.py) < 18 && (this.keys.has('e') || this.keys.has('enter'))) {
      if (!this.achievements.has('Cat Person')) {
        sfx.meow();
        this.unlock('Cat Person', 'You petted Pixel the cat. +10 XP');
        this.gainXP(10);
      }
    }
  }

  // ── Render ─────────────────────────────────────────────────
  private fit() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = window.innerWidth * dpr;
    this.canvas.height = window.innerHeight * dpr;
    this.canvas.style.width = '100vw';
    this.canvas.style.height = '100vh';
    // pick integer world scale so ~19 tiles fit across
    this.scale = Math.max(2, Math.round((window.innerWidth * dpr) / (TILE * 22)));
    this.g.imageSmoothingEnabled = false;
  }

  private draw() {
    const g = this.g;
    const S = this.scale;
    const vw = this.canvas.width / S;
    const vh = this.canvas.height / S;

    let camX = this.px - vw / 2;
    let camY = this.py - vh / 2;
    camX = Math.max(0, Math.min(MAP_W * TILE - vw, camX));
    camY = Math.max(0, Math.min(MAP_H * TILE - vh, camY));

    g.setTransform(S, 0, 0, S, -Math.round(camX * S) / 1, -Math.round(camY * S) / 1);
    g.imageSmoothingEnabled = false;

    // terrain
    const x0 = Math.floor(camX / TILE), x1 = Math.ceil((camX + vw) / TILE);
    const y0 = Math.floor(camY / TILE), y1 = Math.ceil((camY + vh) / TILE);
    const waterFrame = Math.floor(this.time * 2) % 2;
    for (let y = Math.max(0, y0); y < Math.min(MAP_H, y1); y++) {
      for (let x = Math.max(0, x0); x < Math.min(MAP_W, x1); x++) {
        const ch = MAP[y][x];
        let img: HTMLCanvasElement;
        switch (ch) {
          case '#': img = tiles.tree; break;
          case '~': img = tiles.water[waterFrame]; break;
          case '-': img = tiles.path; break;
          case 'f': img = tiles.flower; break;
          case ',': img = tiles.grass2; break;
          case 's': img = tiles.sand; break;
          default: img = tiles.grass;
        }
        if (ch === '#' || ch === 'f') g.drawImage(tiles.grass, x * TILE, y * TILE);
        g.drawImage(img, x * TILE, y * TILE);
      }
    }

    // buildings
    for (const s of this.structures) g.drawImage(s.img, s.x, s.y);

    // interactable props (+ bobbing orbs, glowing near item)
    for (const it of this.items) {
      if (it.collectible && this.seen.has(it.id)) continue;
      const spr = this.spriteFor(it);
      if (!spr) continue;
      const bob = it.sprite === 'orb' || it.sprite === 'portal' ? Math.sin(this.time * 3 + it.tx) * 1.5 : 0;
      g.drawImage(spr, it.tx * TILE, it.ty * TILE + bob);
      if (it === this.nearItem) {
        g.fillStyle = '#fbbf24';
        const ind = Math.sin(this.time * 6) > 0 ? 0 : 1;
        g.fillRect(it.tx * TILE + 6, it.ty * TILE - 6 + ind, 4, 4);
      }
    }

    // cat
    const catImg = catSprites[Math.floor(this.cat.frame) % 2];
    g.save();
    if (this.cat.dir < 0) {
      g.translate(this.cat.x + 16, this.cat.y);
      g.scale(-1, 1);
      g.drawImage(catImg, 0, 0);
    } else {
      g.drawImage(catImg, this.cat.x, this.cat.y);
    }
    g.restore();

    // player (with shadow)
    const frame = this.moving ? Math.floor(this.animTime * 8) % 2 : 0;
    const spr = playerSprites[this.dir][frame];
    g.fillStyle = 'rgba(0,0,0,0.3)';
    g.beginPath();
    g.ellipse(this.px, this.py + 6, 5, 2, 0, 0, 7);
    g.fill();
    g.drawImage(spr, Math.round(this.px - 6), Math.round(this.py - 10));

    // rainbow konami overlay
    if (this.rainbow) {
      g.setTransform(1, 0, 0, 1, 0, 0);
      const hue = (this.time * 60) % 360;
      g.fillStyle = `hsla(${hue}, 90%, 60%, 0.08)`;
      g.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  start() {
    const loop = (t: number) => {
      const dt = Math.min(0.05, (t - this.last) / 1000 || 0.016);
      this.last = t;
      this.update(dt);
      this.draw();
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }
}
