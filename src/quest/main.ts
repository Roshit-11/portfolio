// ──────────────────────────────────────────────────────────────
//  ROSHIT QUEST — main.ts
//  DOM shell around the canvas game: intro, HUD, dialogs, quest
//  log, achievements, touch controls, CRT + mute toggles.
// ──────────────────────────────────────────────────────────────

import { isMuted, sfx, toggleMute } from './audio';
import { Game } from './game';
import type { Interactable } from './world';

const root = document.getElementById('game-root')!;

// ── Styles ────────────────────────────────────────────────────
const style = document.createElement('style');
style.textContent = `
  .q-font { font-family: 'Courier New', ui-monospace, monospace; }
  #q-canvas { position: absolute; inset: 0; }

  /* CRT overlay */
  #q-crt { position: absolute; inset: 0; pointer-events: none; z-index: 40; display: none;
    background: repeating-linear-gradient(0deg, rgba(0,0,0,0.16) 0 1px, transparent 1px 3px); }
  #q-crt::after { content:''; position:absolute; inset:0;
    background: radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.45) 100%); }
  .crt-on #q-crt { display: block; }

  /* HUD */
  #q-hud { position: absolute; top: 10px; left: 10px; z-index: 50; color: #f8fafc; }
  .q-panel { background: rgba(11,17,32,0.88); border: 2px solid #334155; border-radius: 6px;
    padding: 8px 10px; box-shadow: 0 2px 0 #0b1120; }
  #q-xpbar { width: 170px; height: 10px; background: #1e293b; border: 2px solid #334155;
    border-radius: 4px; overflow: hidden; margin-top: 4px; }
  #q-xpfill { height: 100%; width: 0%; background: linear-gradient(90deg,#22d3ee,#a78bfa);
    transition: width 0.4s; }
  #q-lvl { font-size: 12px; font-weight: bold; letter-spacing: 1px; }

  #q-quest { margin-top: 8px; font-size: 11px; line-height: 1.7; min-width: 190px; }
  #q-quest h4 { margin: 0 0 4px; font-size: 11px; color: #fbbf24; letter-spacing: 1px; }
  .q-step-done { color: #4ade80; }
  .q-step-todo { color: #94a3b8; }
  #q-quest .pct { color: #22d3ee; }
  #q-quest-body { display: none; }
  #q-quest.open #q-quest-body { display: block; }
  #q-quest-toggle { cursor: pointer; user-select: none; }

  /* top-right buttons */
  #q-btns { position: absolute; top: 10px; right: 10px; z-index: 50; display: flex; gap: 6px; }
  .q-btn { background: rgba(11,17,32,0.88); color: #e2e8f0; border: 2px solid #334155;
    border-radius: 6px; padding: 6px 10px; font-size: 12px; cursor: pointer; }
  .q-btn:hover { border-color: #22d3ee; color: #22d3ee; }

  /* interact prompt */
  #q-prompt { position: absolute; bottom: 118px; left: 50%; transform: translateX(-50%);
    z-index: 50; display: none; font-size: 13px; color: #0b1120; background: #fbbf24;
    border-radius: 6px; padding: 5px 12px; font-weight: bold; box-shadow: 0 2px 0 #92400e; }

  /* dialog */
  #q-dialog { position: absolute; left: 50%; bottom: 18px; transform: translateX(-50%);
    width: min(620px, calc(100vw - 24px)); z-index: 60; display: none; color: #e2e8f0;
    background: rgba(11,17,32,0.96); border: 3px solid #475569; border-radius: 10px;
    padding: 14px 16px 12px; box-shadow: 0 6px 24px rgba(0,0,0,0.6); }
  #q-dialog h3 { margin: 0 0 8px; font-size: 15px; color: #22d3ee; }
  #q-dialog-body { font-size: 13px; line-height: 1.65; white-space: pre-wrap; min-height: 68px; }
  #q-dialog-links { margin-top: 10px; display: flex; flex-wrap: wrap; gap: 8px; }
  #q-dialog-links a { color: #0b1120; background: #22d3ee; padding: 5px 10px; border-radius: 6px;
    font-size: 12px; font-weight: bold; text-decoration: none; }
  #q-dialog-links a:hover { background: #67e8f9; }
  #q-dialog-close { margin-top: 10px; font-size: 11px; color: #64748b; }

  /* toasts */
  #q-toasts { position: absolute; top: 64px; right: 10px; z-index: 70; display: flex;
    flex-direction: column; gap: 8px; align-items: flex-end; }
  .q-toast { background: rgba(11,17,32,0.95); border: 2px solid #fbbf24; color: #fbbf24;
    border-radius: 8px; padding: 8px 12px; font-size: 12px; max-width: 260px;
    animation: q-slide 0.3s ease-out; }
  .q-toast small { color: #cbd5e1; display: block; margin-top: 2px; }
  .q-toast.xp { border-color: #22d3ee; color: #22d3ee; }
  @keyframes q-slide { from { transform: translateX(30px); opacity: 0; } to { transform: none; opacity: 1; } }

  /* touch controls */
  #q-touch { position: absolute; inset: 0; z-index: 45; pointer-events: none; display: none; }
  @media (pointer: coarse) { #q-touch { display: block; } #q-prompt { bottom: 150px; } }
  #q-dpad { position: absolute; left: 18px; bottom: 24px; width: 130px; height: 130px; pointer-events: auto; }
  .q-dbtn { position: absolute; width: 44px; height: 44px; background: rgba(30,41,59,0.8);
    border: 2px solid #475569; border-radius: 8px; color: #cbd5e1; font-size: 18px;
    display: flex; align-items: center; justify-content: center; }
  #q-abtn { position: absolute; right: 24px; bottom: 42px; width: 62px; height: 62px;
    border-radius: 50%; background: rgba(34,211,238,0.85); color: #0b1120; font-weight: bold;
    font-size: 20px; display: flex; align-items: center; justify-content: center;
    border: 3px solid #67e8f9; pointer-events: auto; }

  /* intro */
  #q-intro { position: absolute; inset: 0; z-index: 100; background: #0b1120; display: flex;
    flex-direction: column; align-items: center; justify-content: center; gap: 18px;
    color: #e2e8f0; text-align: center; padding: 20px; }
  #q-intro h1 { font-size: clamp(26px, 6vw, 46px); margin: 0; color: #22d3ee;
    text-shadow: 3px 3px 0 #7c3aed; letter-spacing: 2px; }
  #q-intro p { max-width: 480px; font-size: 14px; line-height: 1.7; color: #94a3b8; margin: 0; }
  #q-start { background: #fbbf24; color: #0b1120; border: none; font: inherit; font-weight: bold;
    font-size: 16px; padding: 12px 30px; border-radius: 8px; cursor: pointer;
    box-shadow: 0 4px 0 #92400e; animation: q-pulse 1.4s infinite; }
  #q-start:active { transform: translateY(3px); box-shadow: 0 1px 0 #92400e; }
  @keyframes q-pulse { 50% { transform: scale(1.05); } }
  .q-keys { font-size: 12px; color: #64748b; }

  /* confetti */
  .q-confetti { position: absolute; width: 7px; height: 7px; z-index: 90; pointer-events: none;
    animation: q-fall linear forwards; }
  @keyframes q-fall { to { transform: translateY(110vh) rotate(720deg); opacity: 0.6; } }
`;
document.head.appendChild(style);

// ── DOM ───────────────────────────────────────────────────────
root.innerHTML = `
  <canvas id="q-canvas"></canvas>
  <div id="q-crt"></div>

  <div id="q-hud" class="q-font">
    <div class="q-panel">
      <div id="q-lvl">LV 1 · ROSHIT QUEST</div>
      <div id="q-xpbar"><div id="q-xpfill"></div></div>
    </div>
    <div class="q-panel" id="q-quest">
      <h4 id="q-quest-toggle">⚔ GET HIRED — <span class="pct">0%</span> ▾</h4>
      <div id="q-quest-body"></div>
    </div>
  </div>

  <div id="q-btns" class="q-font">
    <button class="q-btn" id="q-mute">${isMuted() ? '🔇' : '🔊'}</button>
    <button class="q-btn" id="q-crtbtn">CRT</button>
    <button class="q-btn" id="q-reset">↺</button>
    <a class="q-btn" href="/" style="text-decoration:none">EXIT</a>
  </div>

  <div id="q-prompt" class="q-font">E</div>

  <div id="q-dialog" class="q-font">
    <h3 id="q-dialog-title"></h3>
    <div id="q-dialog-body"></div>
    <div id="q-dialog-links"></div>
    <div id="q-dialog-close">E / ENTER / ESC to close</div>
  </div>

  <div id="q-toasts" class="q-font"></div>

  <div id="q-touch">
    <div id="q-dpad">
      <div class="q-dbtn" data-dir="up"    style="left:43px; top:0;">▲</div>
      <div class="q-dbtn" data-dir="left"  style="left:0; top:43px;">◀</div>
      <div class="q-dbtn" data-dir="right" style="right:0; top:43px;">▶</div>
      <div class="q-dbtn" data-dir="down"  style="left:43px; bottom:0;">▼</div>
    </div>
    <div id="q-abtn">E</div>
  </div>

  <div id="q-intro" class="q-font">
    <h1>ROSHIT QUEST</h1>
    <p>A tiny RPG where the island is my portfolio.
       Explore the world, play the project arcade, collect skill orbs,
       and complete the <b style="color:#fbbf24">GET HIRED</b> quest.</p>
    <button id="q-start">▶ PRESS START</button>
    <div class="q-keys">WASD / arrows to move · E to interact · touch supported</div>
    <div class="q-keys">by Roshit Lamichhane · <a href="/" style="color:#22d3ee">classic portfolio</a></div>
  </div>
`;

const $ = (id: string) => document.getElementById(id)!;
const canvas = $('q-canvas') as HTMLCanvasElement;

// ── Toasts ────────────────────────────────────────────────────
function toast(html: string, cls = '') {
  const el = document.createElement('div');
  el.className = `q-toast ${cls}`;
  el.innerHTML = html;
  $('q-toasts').appendChild(el);
  setTimeout(() => {
    el.style.transition = 'opacity 0.4s';
    el.style.opacity = '0';
    setTimeout(() => el.remove(), 400);
  }, 3200);
}

// ── Dialog ────────────────────────────────────────────────────
let typeTimer: number | undefined;
let currentGame: Game | null = null;

function openDialog(it: Interactable) {
  const d = $('q-dialog');
  $('q-dialog-title').textContent = `${it.dialog.icon ?? '•'} ${it.dialog.title}`;
  const body = $('q-dialog-body');
  const links = $('q-dialog-links');
  links.innerHTML = '';
  for (const l of it.dialog.links ?? []) {
    const a = document.createElement('a');
    a.href = l.url;
    if (!l.url.startsWith('/') && !l.url.startsWith('mailto:')) {
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    }
    a.textContent = l.label;
    links.appendChild(a);
  }
  d.style.display = 'block';

  // typewriter
  const full = it.dialog.lines.join('\n');
  let i = 0;
  body.textContent = '';
  clearInterval(typeTimer);
  typeTimer = window.setInterval(() => {
    i += 3;
    body.textContent = full.slice(0, i);
    if (i % 15 < 3) sfx.talk();
    if (i >= full.length) clearInterval(typeTimer);
  }, 16);
}

function closeDialog() {
  clearInterval(typeTimer);
  $('q-dialog').style.display = 'none';
  currentGame?.closeDialog();
}

window.addEventListener('keydown', (e) => {
  const k = e.key.toLowerCase();
  if ($('q-dialog').style.display === 'block' && (k === 'e' || k === 'enter' || k === 'escape')) {
    e.stopPropagation();
    closeDialog();
  }
}, true);

// ── Quest log ────────────────────────────────────────────────
function renderQuest(game: Game) {
  const steps = game.questProgress();
  $('q-quest-body').innerHTML = steps
    .map((s) => `<div class="${s.done ? 'q-step-done' : 'q-step-todo'}">${s.done ? '☑' : '☐'} ${s.label}${s.need > 1 ? ` (${s.have}/${s.need})` : ''}</div>`)
    .join('');
  ($('q-quest').querySelector('.pct') as HTMLElement).textContent = `${game.completionPct()}%`;
}

function renderXP(game: Game) {
  const lvl = game.level();
  const into = game.xp % 60;
  $('q-lvl').textContent = `LV ${lvl} · ${game.xp} XP`;
  $('q-xpfill').style.width = `${(into / 60) * 100}%`;
}

// ── Confetti ─────────────────────────────────────────────────
function confetti() {
  const colors = ['#22d3ee', '#a78bfa', '#fbbf24', '#4ade80', '#f472b6'];
  for (let i = 0; i < 90; i++) {
    const c = document.createElement('div');
    c.className = 'q-confetti';
    c.style.left = Math.random() * 100 + 'vw';
    c.style.top = '-10px';
    c.style.background = colors[i % colors.length];
    c.style.animationDuration = 2.5 + Math.random() * 2 + 's';
    c.style.animationDelay = Math.random() * 0.8 + 's';
    root.appendChild(c);
    setTimeout(() => c.remove(), 6000);
  }
}

// ── Boot ─────────────────────────────────────────────────────
const game = new Game(canvas, {
  onDialog: openDialog,
  onXP: (_xp, _lvl, gained) => {
    renderXP(game);
    if (gained > 0) toast(`+${gained} XP`, 'xp');
  },
  onQuestProgress: () => renderQuest(game),
  onAchievement: (name, desc) => toast(`🏆 ${name}<small>${desc}</small>`),
  onComplete: () => {
    confetti();
    setTimeout(() => {
      openDialog({
        id: '__complete', tx: 0, ty: 0, sprite: 'none', label: '', xp: 0,
        dialog: {
          title: 'QUEST COMPLETE — you found a solid engineer!', icon: '🏆',
          lines: [
            'You explored the whole island. That is 100% of the',
            'GET HIRED quest. The logical next step:',
            'hire the guy who built this.',
          ],
          links: [
            { label: '✉ Email Roshit', url: 'mailto:roshitlamichhane12@gmail.com' },
            { label: '🌐 Classic Portfolio', url: '/' },
          ],
        },
      } as Interactable);
      game.frozen = true;
    }, 900);
  },
  onPrompt: (label) => {
    const p = $('q-prompt');
    if (label) {
      p.textContent = `E · ${label}`;
      p.style.display = 'block';
    } else {
      p.style.display = 'none';
    }
  },
});
currentGame = game;
(window as any).__game = game; // debugging hook

renderQuest(game);
renderXP(game);

// buttons
$('q-mute').onclick = () => { $('q-mute').textContent = toggleMute() ? '🔇' : '🔊'; };
$('q-crtbtn').onclick = () => root.classList.toggle('crt-on');
$('q-reset').onclick = () => { if (confirm('Reset all quest progress?')) game.reset(); };
$('q-quest-toggle').onclick = () => $('q-quest').classList.toggle('open');
$('q-quest').classList.add('open');

// touch controls
for (const btn of document.querySelectorAll<HTMLElement>('.q-dbtn')) {
  const dir = btn.dataset.dir!;
  const set = (on: boolean) => {
    if (dir === 'up') game.touchVec.y = on ? -1 : 0;
    if (dir === 'down') game.touchVec.y = on ? 1 : 0;
    if (dir === 'left') game.touchVec.x = on ? -1 : 0;
    if (dir === 'right') game.touchVec.x = on ? 1 : 0;
  };
  btn.addEventListener('touchstart', (e) => { e.preventDefault(); set(true); }, { passive: false });
  btn.addEventListener('touchend', (e) => { e.preventDefault(); set(false); }, { passive: false });
}
$('q-abtn').addEventListener('touchstart', (e) => {
  e.preventDefault();
  if ($('q-dialog').style.display === 'block') closeDialog();
  else if (game.nearItem) game.interact(game.nearItem);
}, { passive: false });

// start
$('q-start').onclick = () => {
  $('q-intro').style.display = 'none';
  sfx.fanfare();
  game.start();
};
