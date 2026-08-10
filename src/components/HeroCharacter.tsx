import { useEffect, useRef, useState } from 'react';

interface HeroCharacterProps {
  onHover?: (hovered: boolean) => void;
  showHint?: boolean;
}

/**
 * Per-stamp trail system:
 * Each brush stroke is stored with its birth time. It stays at full opacity
 * for HOLD_FRAMES, then smoothly fades over FADE_FRAMES. This means each
 * area you hovered lingers independently and fades on its own timeline.
 */
interface BrushStamp {
  /** CSS-space x coordinate */
  x: number;
  /** CSS-space y coordinate */
  y: number;
  /** Brush radius at time of creation (CSS px) */
  r: number;
  /** Frame number when this stamp was created */
  born: number;
  /** Wobble seed snapshot for consistent shape */
  seed: number;
}

const NUM_WOBBLE_PTS = 12;
const ANGLE_STEP = (Math.PI * 2) / NUM_WOBBLE_PTS;

export default function HeroCharacter({
  onHover,
  showHint = true,
}: HeroCharacterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // On mobile/tablets, start automatic multi-directional scratch unmasking immediately on mount
  const [isIdleActive, setIsIdleActive] = useState(() => {
    return typeof window !== 'undefined' && window.innerWidth < 1024;
  });

  const idleTimerRef = useRef<number | null>(null);
  
  // State for canvas trail tracking (raw target coordinate inputs)
  const st = useRef({
    px: -999,
    py: -999,
    active: false,
  });

  // Lerped smooth coordinate references
  const lerped = useRef({
    x: -999,
    y: -999,
    lpx: -999,
    lpy: -999,
  });

  // Per-stamp trail history (each stamp fades independently)
  const stamps = useRef<BrushStamp[]>([]);

  // Global frame counter for timing
  const frameCount = useRef(0);

  // Outline trail for the glowing green ring aftereffect
  const outlineTrail = useRef<{ x: number; y: number; alpha: number }[]>([]);

  // Smooth brush radius/opacity for open/close transitions
  const brushState = useRef({ radius: 0, opacity: 0 });

  const wobbleActive = isHovered || isIdleActive;

  // Handle coordinates tracking on mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    cancelIdleAnimation();

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    st.current.px = e.clientX - rect.left;
    st.current.py = e.clientY - rect.top;
    st.current.active = true;

    setIsHovered(true);
    onHover?.(true);

    startIdleTimer();
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHover?.(true);
    cancelIdleAnimation();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onHover?.(false);
    
    st.current.active = false;
    st.current.px = -999;
    st.current.py = -999;

    startIdleTimer();
  };

  const updateTouchCoords = (e: React.TouchEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const touch = e.touches[0];
    if (!touch) return;
    st.current.px = touch.clientX - rect.left;
    st.current.py = touch.clientY - rect.top;
    st.current.active = true;
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    cancelIdleAnimation();
    setIsHovered(true);
    onHover?.(true);
    updateTouchCoords(e);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.cancelable) {
      e.preventDefault();
    }
    updateTouchCoords(e);
  };

  const handleTouchEnd = () => {
    setIsHovered(false);
    onHover?.(false);
    st.current.active = false;
    st.current.px = -999;
    st.current.py = -999;
    
    // Resume automatic multidirectional scratch loop on mobile immediately
    const isMobile = window.innerWidth < 1024;
    if (isMobile) {
      setIsIdleActive(true);
    } else {
      startIdleTimer();
    }
  };

  const startIdleTimer = () => {
    const isMobile = window.innerWidth < 1024;
    if (isMobile) {
      setIsIdleActive(true);
      return;
    }
    if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
    idleTimerRef.current = window.setTimeout(startIdleSweep, 3500);
  };

  const cancelIdleAnimation = () => {
    const isMobile = window.innerWidth < 1024;
    if (isMobile) {
      setIsIdleActive(false);
    } else {
      setIsIdleActive(false);
      if (idleTimerRef.current) {
        window.clearTimeout(idleTimerRef.current);
        idleTimerRef.current = null;
      }
    }
  };

  const startIdleSweep = () => {
    cancelIdleAnimation();
    setIsIdleActive(true);
  };

  // Canvas engine render loop
  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    
    // Scratch trail sub-canvas
    const trail = document.createElement('canvas');
    const tctx = trail.getContext('2d');
    
    // Masking composition temp canvas
    const tmp = document.createElement('canvas');
    const mctx = tmp.getContext('2d');
    
    if (!ctx || !tctx || !mctx) return;

    const real = new Image();
    real.src = '/hero/real.png';
    const helm = new Image();
    helm.src = '/hero/cartoon.png';

    // R_BRUSH is dynamic: smaller on mobile screens (34) for touch precision, 62 on laptops
    let R_BRUSH = window.innerWidth < 1024 ? 34 : 62;

    // ── Per-stamp timing (in frames at ~60fps) ──
    const HOLD_FRAMES = 45;   // ~0.75 s at full opacity
    const FADE_FRAMES = 60;   // ~1 s smooth fade
    const TOTAL_LIFE = HOLD_FRAMES + FADE_FRAMES;

    let dpr = Math.min(2, window.devicePixelRatio || 1);
    
    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = Math.round(cv.clientWidth * dpr);
      const h = Math.round(cv.clientHeight * dpr);
      [cv, trail, tmp].forEach((c) => {
        c.width = w;
        c.height = h;
      });
      R_BRUSH = window.innerWidth < 1024 ? 34 : 62;
    };
    resize();
    window.addEventListener('resize', resize);

    // Helper: draw a smooth wobbly blob using quadratic curves for silky edges
    const wobblyPath = (
      c: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      r: number,
      seed: number,
    ) => {
      // Pre-compute all wobble control points
      const pts: { x: number; y: number }[] = [];
      for (let k = 0; k < NUM_WOBBLE_PTS; k++) {
        const angle = k * ANGLE_STEP;
        const wobble =
          Math.sin(seed + k * 1.6) * (r * 0.10) +
          Math.cos(seed * 0.8 - k * 1.1) * (r * 0.05);
        const cr = r + wobble;
        pts.push({ x: cx + Math.cos(angle) * cr, y: cy + Math.sin(angle) * cr });
      }

      // Draw smooth closed curve using midpoints + quadraticCurveTo
      c.beginPath();
      const first = pts[0];
      const last = pts[pts.length - 1];
      c.moveTo((last.x + first.x) / 2, (last.y + first.y) / 2);
      for (let k = 0; k < pts.length; k++) {
        const curr = pts[k];
        const next = pts[(k + 1) % pts.length];
        c.quadraticCurveTo(curr.x, curr.y, (curr.x + next.x) / 2, (curr.y + next.y) / 2);
      }
      c.closePath();
    };

    const drawHUDOverlay = (c: CanvasRenderingContext2D, W: number, H: number, time: number) => {
      // Visor area coordinates: 33% width, 31% height
      const vx = 0.33 * W;
      const vy = 0.31 * H;
      const vw = 0.34 * W;
      const vh = 0.10 * H;

      c.save();
      
      // Screen box
      c.fillStyle = 'rgba(0, 0, 0, 0.45)';
      c.strokeStyle = 'rgba(197, 255, 59, 0.35)';
      c.lineWidth = 1.5;
      c.beginPath();
      c.roundRect ? c.roundRect(vx, vy, vw, vh, 4) : c.rect(vx, vy, vw, vh);
      c.fill();
      c.stroke();

      // Glowing text lines
      const lines = [
        { width: 0.48, top: 0.15, d: 0 },
        { width: 0.28, top: 0.35, d: 400 },
        { width: 0.38, top: 0.55, d: 800 },
        { width: 0.42, top: 0.75, d: 200 },
      ];

      lines.forEach((line) => {
        const pulse = 0.45 + 0.45 * Math.sin(time / 200 + line.d / 100);
        c.fillStyle = `rgba(197, 255, 59, ${pulse})`;
        c.shadowColor = '#C5FF3B';
        c.shadowBlur = 4;
        c.beginPath();
        c.roundRect 
          ? c.roundRect(vx + vw * 0.08, vy + vh * line.top, vw * line.width, vh * 0.08, 1) 
          : c.rect(vx + vw * 0.08, vy + vh * line.top, vw * line.width, vh * 0.08);
        c.fill();
      });

      // Scanning HUD beam line
      c.shadowBlur = 5;
      c.strokeStyle = 'rgba(197, 255, 59, 0.75)';
      const scanProgress = (time / 2200) % 1;
      // Bounce back and forth
      const scanY = vy + vh * (0.5 - 0.5 * Math.cos(scanProgress * Math.PI * 2));
      c.beginPath();
      c.moveTo(vx, scanY);
      c.lineTo(vx + vw, scanY);
      c.stroke();

      c.restore();
    };

    let rafId = 0;
    const draw = (time: number) => {
      const W = cv.width;
      const H = cv.height;
      const s = st.current;
      const lp = lerped.current;
      const frame = frameCount.current++;

      // Evaluate mobile status dynamically
      const isMobile = window.innerWidth < 1024;

      // 1. Calculate automatic Lissajous curve coordinates when idle active
      // (This traces in all directions, north/south/east/west/diagonals)
      if (isIdleActive) {
        const layoutW = cv.clientWidth;
        const layoutH = cv.clientHeight;
        const cx = layoutW * 0.5;
        const cy = layoutH * 0.5;
        // Tracing boundary limits (covers 68% width and 60% height of helmet)
        const rx = layoutW * 0.34;
        const ry = layoutH * 0.30;

        const speed = isMobile ? 0.0006 : 0.0008; // slightly slower on mobile
        const t = time * speed;
        s.px = cx + Math.sin(t * 1.4) * rx;
        s.py = cy + Math.cos(t * 1.9) * ry;
        s.active = true;
      }

      // 2. Smoothly Lerp Coordinates for mercury fluid flow easing
      const isDragging = s.active && s.px > -900;
      if (isDragging) {
        if (lp.x < -900) {
          lp.x = s.px;
          lp.y = s.py;
        } else {
          // Smooth fluid tracking velocity
          lp.x += (s.px - lp.x) * 0.10;
          lp.y += (s.py - lp.y) * 0.10;
        }
      }

      // Smoothly transition brush radius & opacity for liquid shrink/grow aftereffect
      const targetRadius = isDragging ? R_BRUSH : 0;
      const targetOpacity = isDragging ? 1 : 0;
      brushState.current.radius += (targetRadius - brushState.current.radius) * 0.15;
      brushState.current.opacity += (targetOpacity - brushState.current.opacity) * 0.15;

      const currentR = brushState.current.radius;
      const currentOp = brushState.current.opacity;

      // 3. Add new stamps along the brush path
      if (lp.x > -900 && currentR > 0.5 && isDragging) {
        setCoords({ x: lp.x, y: lp.y });

        const lx = lp.lpx < -900 ? lp.x : lp.lpx;
        const ly = lp.lpy < -900 ? lp.y : lp.lpy;
        const dist = Math.hypot(lp.x - lx, lp.y - ly);
        // Place stamps densely along the path so the reveal is continuous
        const spacing = currentR * 0.2;
        const steps = Math.max(1, Math.floor(dist / spacing));

        for (let i = 0; i <= steps; i++) {
          const t = i / steps;
          const sx = lx + (lp.x - lx) * t;
          const sy = ly + (lp.y - ly) * t;

          // Don't add if too close to the last stamp
          const arr = stamps.current;
          const last = arr[arr.length - 1];
          if (last && Math.hypot(sx - last.x, sy - last.y) < spacing * 0.5) continue;

          arr.push({
            x: sx,
            y: sy,
            r: currentR,
            born: frame,
            seed: time * 0.005,
          });
        }

        lp.lpx = lp.x;
        lp.lpy = lp.y;
      } else {
        lp.lpx = -999;
        lp.lpy = -999;
        if (!isDragging) {
          lp.x = -999;
          lp.y = -999;
        }
      }

      // 4. Rebuild the trail canvas from per-stamp history
      // Each stamp has its own lifecycle: hold → fade → die
      tctx.clearRect(0, 0, W, H);
      const alive: BrushStamp[] = [];

      for (const stamp of stamps.current) {
        const age = frame - stamp.born;
        if (age >= TOTAL_LIFE) continue; // dead stamp, skip

        // Compute per-stamp opacity
        let opacity = 1.0;
        if (age > HOLD_FRAMES) {
          // Smooth fade phase: cosine ease for silky natural dissolution
          const fadeProgress = (age - HOLD_FRAMES) / FADE_FRAMES;
          opacity = 0.5 * (1 + Math.cos(fadeProgress * Math.PI)); // cosine ease
        }

        alive.push(stamp);

        // Draw the wobbly stamp onto the trail canvas
        const bx = stamp.x * dpr;
        const by = stamp.y * dpr;
        const brushSize = stamp.r * dpr;

        tctx.save();
        wobblyPath(tctx, bx, by, brushSize, stamp.seed);
        const g = tctx.createRadialGradient(bx, by, brushSize * 0.15, bx, by, brushSize * 1.1);
        g.addColorStop(0, `rgba(255,255,255,${opacity})`);
        g.addColorStop(0.5, `rgba(255,255,255,${opacity * 0.9})`);
        g.addColorStop(0.8, `rgba(255,255,255,${opacity * 0.5})`);
        g.addColorStop(1, 'rgba(255,255,255,0)');
        tctx.fillStyle = g;
        tctx.fill();
        tctx.restore();
      }

      stamps.current = alive;

      // 5. Render composition
      ctx.clearRect(0, 0, W, H);
      if (real.complete && helm.complete && real.naturalWidth) {
        // Draw the helmet base layer (with VISOR HUD details) at the bottom
        ctx.globalCompositeOperation = 'source-over';
        ctx.drawImage(helm, 0, 0, W, H);
        drawHUDOverlay(ctx, W, H, time);

        // Erase the scratch trail area from the helmet base layer
        ctx.globalCompositeOperation = 'destination-out';
        ctx.drawImage(trail, 0, 0);

        // Prepare masked portrait layer on the temporary canvas
        mctx.clearRect(0, 0, W, H);
        mctx.globalCompositeOperation = 'source-over';
        mctx.globalAlpha = 1;
        mctx.drawImage(real, 0, 0, W, H); // Draw portrait image on tmp canvas

        // Mask the portrait to the scratch trail path
        mctx.globalCompositeOperation = 'destination-in';
        mctx.drawImage(trail, 0, 0);

        // Draw the masked portrait on top of the erased helmet base
        ctx.globalCompositeOperation = 'source-over';
        ctx.drawImage(tmp, 0, 0);

        // 6. Draw wobbly mercury glowing outline (the fluid eraser outline) directly on canvas
        if (lp.x > -900 && currentR > 0.5) {
          // Draw older history trail outlines behind the lead outline
          const history = outlineTrail.current;
          history.forEach((pt) => {
            ctx.save();
            const brushSize = currentR * dpr * (0.45 + 0.55 * pt.alpha);
            wobblyPath(ctx, pt.x * dpr, pt.y * dpr, brushSize, time * 0.005);

            ctx.strokeStyle = `rgba(197, 255, 59, ${pt.alpha * currentOp * 0.5})`; // slightly softer trailing outlines
            ctx.lineWidth = 1.8 * dpr;
            ctx.shadowColor = '#C5FF3B';
            ctx.shadowBlur = 5 * dpr * pt.alpha * currentOp;
            ctx.stroke();
            ctx.restore();
          });

          // Decay alphas of trail history
          outlineTrail.current = history
            .map((pt) => ({ ...pt, alpha: pt.alpha * 0.83 }))
            .filter((pt) => pt.alpha > 0.08);

          // Push current coordinates into history trail if cursor moved sufficiently
          // (Only track user finger/mouse movement for outline trail, not auto-idle curves)
          if (isDragging && !isIdleActive) {
            const lastPt = history[history.length - 1];
            if (!lastPt || Math.hypot(lp.x - lastPt.x, lp.y - lastPt.y) > 4) {
              history.push({ x: lp.x, y: lp.y, alpha: 1.0 });
            }
          }

          // Draw the active lead outline at the current brush tip
          ctx.save();
          wobblyPath(ctx, lp.x * dpr, lp.y * dpr, currentR * dpr, time * 0.005);
          ctx.strokeStyle = `rgba(197, 255, 59, ${currentOp})`;
          ctx.lineWidth = 2.5 * dpr;
          ctx.shadowColor = '#C5FF3B';
          ctx.shadowBlur = 8 * dpr * currentOp;
          ctx.stroke();
          ctx.restore();
        } else {
          // Empty outline history when inactive
          outlineTrail.current = [];
        }
      }

      rafId = requestAnimationFrame(draw);
    };

    // Start engine when images finish loading
    let imagesLoaded = 0;
    const onImgLoad = () => {
      imagesLoaded++;
      if (imagesLoaded === 2) {
        rafId = requestAnimationFrame(draw);
      }
    };
    real.onload = onImgLoad;
    helm.onload = onImgLoad;

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isIdleActive]);

  useEffect(() => {
    const isMobile = window.innerWidth < 1024;
    if (isMobile) {
      setIsIdleActive(true);
    } else {
      startIdleTimer();
    }
    return () => {
      cancelIdleAnimation();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Glitter configuration data (12 particles with faster scatter timelines)
  const glitters = [
    { dx: -25, dy: -35, delay: '0s', size: 12, anim: 'glitter-1' },
    { dx: 30, dy: -20, delay: '0.2s', size: 9, anim: 'glitter-2' },
    { dx: -15, dy: 30, delay: '0.4s', size: 11, anim: 'glitter-3' },
    { dx: 25, dy: 25, delay: '0.1s', size: 8, anim: 'glitter-4' },
    { dx: -35, dy: 5, delay: '0.3s', size: 10, anim: 'glitter-5' },
    { dx: 10, dy: -30, delay: '0.5s', size: 11, anim: 'glitter-6' },
    { dx: -10, dy: -45, delay: '0.15s', size: 10, anim: 'glitter-7' },
    { dx: 45, dy: 10, delay: '0.25s', size: 9, anim: 'glitter-8' },
    { dx: -40, dy: -25, delay: '0.35s', size: 11, anim: 'glitter-9' },
    { dx: 20, dy: -40, delay: '0.05s', size: 8, anim: 'glitter-10' },
    { dx: -25, dy: 40, delay: '0.45s', size: 10, anim: 'glitter-11' },
    { dx: 35, dy: 35, delay: '0.55s', size: 9, anim: 'glitter-12' },
  ];

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative w-full aspect-[432/578] select-none pointer-events-auto overflow-visible"
    >
      {/* Canvas scratch revealing pad */}
      <canvas
        ref={canvasRef}
        aria-label="Roshit — scratch reveal"
        className="w-full h-full block"
        style={{ cursor: 'none' }}
      />

      {/* Glitter floating particles */}
      {wobbleActive && glitters.map((glit, i) => (
        <span
          key={i}
          className="absolute pointer-events-none select-none text-[#C5FF3B] z-30 opacity-0"
          style={{
            left: coords.x + glit.dx,
            top: coords.y + glit.dy,
            animation: `${glit.anim} 1.1s infinite ease-out`,
            animationDelay: glit.delay,
          }}
        >
          <svg
            width={glit.size}
            height={glit.size}
            viewBox="0 0 24 24"
            fill="#C5FF3B"
            className="drop-shadow-[0_0_4px_#C5FF3B]"
          >
            <path d="M12 0L15 9L24 12L15 15L12 24L9 15L0 12L9 9Z" />
          </svg>
        </span>
      ))}

      {showHint && (
        <span
          className="pointer-events-none absolute -bottom-7 left-1/2 -translate-x-1/2 font-mono text-[11px] uppercase tracking-widest text-[#46453D] transition-opacity duration-300"
          style={{ opacity: isHovered ? 0 : 0.8 }}
        >
          hover to unmask
        </span>
      )}

      <style>{`
        @keyframes glitter-1 {
          0% { transform: translate(0,0) rotate(0deg) scale(0); opacity: 0; }
          35% { opacity: 1; }
          100% { transform: translate(-38px, -48px) rotate(120deg) scale(1.3); opacity: 0; }
        }
        @keyframes glitter-2 {
          0% { transform: translate(0,0) rotate(0deg) scale(0); opacity: 0; }
          35% { opacity: 1; }
          100% { transform: translate(48px, -32px) rotate(-90deg) scale(1.0); opacity: 0; }
        }
        @keyframes glitter-3 {
          0% { transform: translate(0,0) rotate(0deg) scale(0); opacity: 0; }
          35% { opacity: 1; }
          100% { transform: translate(-22px, 48px) rotate(180deg) scale(1.2); opacity: 0; }
        }
        @keyframes glitter-4 {
          0% { transform: translate(0,0) rotate(0deg) scale(0); opacity: 0; }
          35% { opacity: 1; }
          100% { transform: translate(38px, 38px) rotate(45deg) scale(0.9); opacity: 0; }
        }
        @keyframes glitter-5 {
          0% { transform: translate(0,0) rotate(0deg) scale(0); opacity: 0; }
          35% { opacity: 1; }
          100% { transform: translate(-52px, 12px) rotate(-45deg) scale(1.1); opacity: 0; }
        }
        @keyframes glitter-6 {
          0% { transform: translate(0,0) rotate(0deg) scale(0); opacity: 0; }
          35% { opacity: 1; }
          100% { transform: translate(16px, -48px) rotate(90deg) scale(1.2); opacity: 0; }
        }
        @keyframes glitter-7 {
          0% { transform: translate(0,0) rotate(0deg) scale(0); opacity: 0; }
          35% { opacity: 1; }
          100% { transform: translate(-16px, -58px) rotate(150deg) scale(1.1); opacity: 0; }
        }
        @keyframes glitter-8 {
          0% { transform: translate(0,0) rotate(0deg) scale(0); opacity: 0; }
          35% { opacity: 1; }
          100% { transform: translate(58px, 16px) rotate(-120deg) scale(1.0); opacity: 0; }
        }
        @keyframes glitter-9 {
          0% { transform: translate(0,0) rotate(0deg) scale(0); opacity: 0; }
          35% { opacity: 1; }
          100% { transform: translate(-58px, -38px) rotate(200deg) scale(1.2); opacity: 0; }
        }
        @keyframes glitter-10 {
          0% { transform: translate(0,0) rotate(0deg) scale(0); opacity: 0; }
          35% { opacity: 1; }
          100% { transform: translate(28px, -52px) rotate(60deg) scale(0.9); opacity: 0; }
        }
        @keyframes glitter-11 {
          0% { transform: translate(0,0) rotate(0deg) scale(0); opacity: 0; }
          35% { opacity: 1; }
          100% { transform: translate(-38px, 58px) rotate(-60deg) scale(1.1); opacity: 0; }
        }
        @keyframes glitter-12 {
          0% { transform: translate(0,0) rotate(0deg) scale(0); opacity: 0; }
          35% { opacity: 1; }
          100% { transform: translate(48px, 48px) rotate(135deg) scale(1.0); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
