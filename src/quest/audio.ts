// ──────────────────────────────────────────────────────────────
//  ROSHIT QUEST — audio.ts
//  Tiny WebAudio chiptune blips. No files, no libraries.
// ──────────────────────────────────────────────────────────────

let ctx: AudioContext | null = null;
let muted = localStorage.getItem('quest_muted') === '1';

function ac(): AudioContext | null {
  if (muted) return null;
  if (!ctx) {
    try {
      ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch {
      return null;
    }
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function blip(freq: number, dur: number, type: OscillatorType = 'square', vol = 0.04, when = 0) {
  const a = ac();
  if (!a) return;
  const t = a.currentTime + when;
  const osc = a.createOscillator();
  const gain = a.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(vol, t);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(gain).connect(a.destination);
  osc.start(t);
  osc.stop(t + dur);
}

export const sfx = {
  step() { blip(160 + Math.random() * 30, 0.05, 'triangle', 0.015); },
  talk() { blip(520, 0.04, 'square', 0.02); },
  open() { blip(392, 0.08); blip(523, 0.1, 'square', 0.04, 0.07); },
  close() { blip(523, 0.06); blip(392, 0.08, 'square', 0.03, 0.05); },
  orb() { blip(659, 0.08); blip(880, 0.1, 'square', 0.04, 0.08); blip(1175, 0.14, 'square', 0.04, 0.16); },
  achievement() {
    [523, 659, 784, 1047].forEach((f, i) => blip(f, 0.12, 'square', 0.045, i * 0.09));
  },
  fanfare() {
    [523, 523, 659, 784, 1047, 784, 1047].forEach((f, i) => blip(f, 0.16, 'square', 0.05, i * 0.12));
  },
  meow() { blip(740, 0.09, 'sawtooth', 0.03); blip(620, 0.12, 'sawtooth', 0.025, 0.08); },
  bump() { blip(110, 0.05, 'sawtooth', 0.02); },
};

export function toggleMute(): boolean {
  muted = !muted;
  localStorage.setItem('quest_muted', muted ? '1' : '0');
  return muted;
}

export function isMuted(): boolean {
  return muted;
}
