import { useEffect, useRef, useState } from 'react';

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const R = 96; // scratch brush radius (CSS px)
const FADE = 0.045; // trail fade per frame (higher = fades faster)

/**
 * Hero centerpiece — a canvas "scratch pad". The helmet avatar shows by default
 * (with live visor code). Moving the cursor scratches an organic, fading trail
 * that reveals the real face beneath and cuts a matching hole in the helmet
 * (no helmet behind the revealed part). The scratch LINGERS and fades, so a fast
 * swipe uncovers a larger streak that stays briefly — like a scratch card. A
 * self-playing sweep drifts left↔right when idle. On scroll it fades to a faint
 * real ghost + neon signature.
 */
export default function HeroCharacter({
  p = 0,
  onHover,
  showHint = true,
}: {
  p?: number;
  onHover?: (hovered: boolean) => void;
  showHint?: boolean;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hoveredRef = useRef(false);
  const st = useRef({ px: -999, py: -999, lpx: -999, lpy: -999, active: false, dir: 1 });
  const [active, setActive] = useState(false);

  const setGlow = (mx: number, my: number) => {
    const el = wrapRef.current;
    if (!el) return;
    el.style.setProperty('--mx', `${mx}px`);
    el.style.setProperty('--my', `${my}px`);
  };
  const move = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    st.current.px = x;
    st.current.py = y;
    st.current.active = true;
    setGlow(x, y);
  };
  const enter = (e: React.MouseEvent<HTMLDivElement>) => {
    hoveredRef.current = true;
    setActive(true);
    onHover?.(true);
    move(e);
  };
  const leave = () => {
    hoveredRef.current = false;
    setActive(false);
    onHover?.(false);
    st.current.active = false;
    st.current.px = -999;
    st.current.py = -999;
    st.current.lpx = -999;
    st.current.lpy = -999;
  };

  /* ---- canvas engine (render loop + trail + auto demo) ---- */
  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    const trail = document.createElement('canvas');
    const tctx = trail.getContext('2d');
    const tmp = document.createElement('canvas');
    const mctx = tmp.getContext('2d');
    if (!ctx || !tctx || !mctx) return;

    const real = new Image();
    real.src = '/hero/real.png';
    const helm = new Image();
    helm.src = '/hero/cartoon.png';

    let dpr = Math.min(2, window.devicePixelRatio || 1);
    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = Math.round(cv.clientWidth * dpr);
      const h = Math.round(cv.clientHeight * dpr);
      [cv, trail, tmp].forEach((c) => {
        c.width = w;
        c.height = h;
      });
    };
    resize();
    window.addEventListener('resize', resize);

    const drawCode = (c: CanvasRenderingContext2D, W: number, H: number, time: number) => {
      const lines = [
        [0.34, 0.315, 0.16],
        [0.52, 0.315, 0.09],
        [0.34, 0.35, 0.11],
        [0.47, 0.35, 0.13],
        [0.34, 0.385, 0.14],
      ];
      lines.forEach(([lx, ly, lw], i) => {
        const a = 0.35 + 0.35 * Math.sin(time / 320 + i * 1.3);
        c.fillStyle = i % 2 ? `rgba(138,154,59,${a})` : `rgba(198,242,78,${a})`;
        c.fillRect(lx * W, ly * H, lw * W, 0.012 * H);
      });
      // scan line
      const sy = (0.31 + 0.12 * ((time / 1400) % 1)) * H;
      c.fillStyle = 'rgba(198,242,78,0.5)';
      c.fillRect(0.33 * W, sy, 0.34 * W, 0.006 * H);
    };

    let raf = 0;
    const draw = (time: number) => {
      const W = cv.width;
      const H = cv.height;
      const s = st.current;

      // fade the scratch trail
      tctx.globalCompositeOperation = 'destination-out';
      tctx.fillStyle = `rgba(0,0,0,${FADE})`;
      tctx.fillRect(0, 0, W, H);
      tctx.globalCompositeOperation = 'source-over';

      // add scratch along the movement segment (so fast swipes streak)
      if (s.active && s.px > -900) {
        const x = s.px * dpr;
        const y = s.py * dpr;
        const lx = (s.lpx < -900 ? s.px : s.lpx) * dpr;
        const ly = (s.lpy < -900 ? s.py : s.lpy) * dpr;
        const dist = Math.hypot(x - lx, y - ly);
        const steps = Math.max(1, Math.floor(dist / (R * dpr * 0.5)));
        for (let i = 0; i <= steps; i++) {
          const t = i / steps;
          const bx = lx + (x - lx) * t;
          const by = ly + (y - ly) * t;
          const g = tctx.createRadialGradient(bx, by, 0, bx, by, R * dpr);
          g.addColorStop(0, 'rgba(255,255,255,1)');
          g.addColorStop(0.65, 'rgba(255,255,255,0.95)');
          g.addColorStop(1, 'rgba(255,255,255,0)');
          tctx.fillStyle = g;
          tctx.beginPath();
          tctx.arc(bx, by, R * dpr, 0, Math.PI * 2);
          tctx.fill();
        }
      }
      s.lpx = s.px;
      s.lpy = s.py;

      // render: real base, then helmet-with-holes on top
      ctx.clearRect(0, 0, W, H);
      if (real.complete && helm.complete && real.naturalWidth) {
        ctx.drawImage(real, 0, 0, W, H);
        mctx.clearRect(0, 0, W, H);
        mctx.globalCompositeOperation = 'source-over';
        mctx.drawImage(helm, 0, 0, W, H);
        drawCode(mctx, W, H, time);
        mctx.globalCompositeOperation = 'destination-out';
        mctx.drawImage(trail, 0, 0);
        mctx.globalCompositeOperation = 'source-over';
        ctx.drawImage(tmp, 0, 0);
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    /* auto demo: sweep the scratch left↔right when idle */
    let demoRaf = 0;
    let demoTimer = 0;
    let cancelled = false;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const schedule = () => {
      demoTimer = window.setTimeout(runDemo, 4200);
    };
    const runDemo = () => {
      if (cancelled || !cv) return;
      if (hoveredRef.current) return schedule();
      const w = cv.clientWidth;
      const h = cv.clientHeight;
      const dir = st.current.dir;
      st.current.dir = -dir;
      const x0 = dir > 0 ? w * 0.18 : w * 0.82;
      const x1 = dir > 0 ? w * 0.82 : w * 0.18;
      const cy = h * 0.34;
      const dur = 2600;
      const start = performance.now();
      setActive(true);
      st.current.active = true;
      const step = (t: number) => {
        if (cancelled || hoveredRef.current) {
          st.current.active = false;
          setActive(false);
          return schedule();
        }
        const k = Math.min(1, (t - start) / dur);
        const ease = 0.5 - 0.5 * Math.cos(k * Math.PI);
        const mx = x0 + (x1 - x0) * ease;
        const my = cy + Math.sin(k * Math.PI * 2) * 10;
        st.current.px = mx;
        st.current.py = my;
        st.current.active = true;
        setGlow(mx, my);
        if (k < 1) demoRaf = requestAnimationFrame(step);
        else {
          st.current.active = false;
          st.current.px = -999;
          st.current.py = -999;
          setActive(false);
          schedule();
        }
      };
      demoRaf = requestAnimationFrame(step);
    };
    if (!reduce) schedule();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      cancelAnimationFrame(demoRaf);
      clearTimeout(demoTimer);
      window.removeEventListener('resize', resize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cartoonOp = clamp(1 - p / 0.5);
  const ghostOp = clamp((p - 0.25) / 0.5) * 0.16;
  const sigOp = clamp((p - 0.55) / 0.35);
  const hintOp = active ? 0 : clamp(1 - p * 3);

  return (
    <div
      ref={wrapRef}
      onMouseMove={move}
      onMouseEnter={enter}
      onMouseLeave={leave}
      className={`hero-reveal relative w-full select-none ${active ? 'is-hover' : ''}`}
      style={{ aspectRatio: '432 / 578' }}
    >
      {/* faint real ghost on scroll (behind the canvas) */}
      <img src="/hero/real.png" alt="" aria-hidden="true" draggable={false} style={{ opacity: ghostOp }} className="absolute inset-0 w-full h-full object-contain grayscale" />

      {/* scratch-pad canvas (helmet + revealed face) */}
      <canvas
        ref={canvasRef}
        aria-label="Roshit — hover to reveal"
        style={{ opacity: cartoonOp, transition: 'opacity 0.35s ease', filter: 'drop-shadow(0 24px 30px rgba(20,20,25,0.35))' }}
        className="absolute inset-0 w-full h-full"
      />

      {/* soft cursor glow */}
      <span className="hero-glow2" aria-hidden="true" />

      {/* neon signature */}
      <img
        src="/hero/signature.png"
        alt=""
        aria-hidden="true"
        draggable={false}
        style={{ opacity: sigOp, filter: 'drop-shadow(0 0 10px rgba(198,242,78,0.7))' }}
        className="absolute left-1/2 -translate-x-1/2 bottom-6 w-36 pointer-events-none"
      />

      {showHint && (
        <span
          className="pointer-events-none absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[11px] text-muted"
          style={{ opacity: hintOp, transition: 'opacity 0.3s ease' }}
        >
          hover to unmask
        </span>
      )}
    </div>
  );
}
