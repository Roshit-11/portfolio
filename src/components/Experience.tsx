import { useEffect, useRef } from 'react';
import { Briefcase, ChevronRight } from 'lucide-react';
import Section from './Section';
import { experience, tenure } from '../data/portfolio';
import { useInView } from '../hooks/useInView';
import { TechPill } from './TechPill';

/* ── Floating data particles along the pipeline line ── */
const PipelineParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const resize = () => {
      cv.width = cv.clientWidth * dpr;
      cv.height = cv.clientHeight * dpr;
    };
    resize();
    window.addEventListener('resize', resize);

    // Particles: tiny green dots that flow down the line
    interface Particle { y: number; speed: number; size: number; alpha: number; }
    const particles: Particle[] = [];
    const spawnRate = 0.03; // chance per frame to spawn a new particle

    let raf = 0;
    const draw = () => {
      const W = cv.width;
      const H = cv.height;
      ctx.clearRect(0, 0, W, H);

      // Randomly spawn particles at the top
      if (Math.random() < spawnRate) {
        particles.push({
          y: 0,
          speed: 0.8 + Math.random() * 1.2,
          size: (1.5 + Math.random() * 2) * dpr,
          alpha: 0.5 + Math.random() * 0.5,
        });
      }

      // Draw and update particles
      const x = 4 * dpr; // center of the line
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.y += p.speed * dpr;

        // Fade in at top, fade out at bottom
        let opacity = p.alpha;
        if (p.y < 30 * dpr) opacity *= p.y / (30 * dpr);
        if (p.y > H - 30 * dpr) opacity *= (H - p.y) / (30 * dpr);

        if (p.y > H) {
          particles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(197, 255, 59, ${opacity})`;
        ctx.shadowColor = '#C5FF3B';
        ctx.shadowBlur = 6 * dpr;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute left-[18px] sm:left-5 top-3 bottom-3 w-2 h-[calc(100%-1.5rem)] pointer-events-none"
      aria-hidden="true"
      style={{ transform: 'translateX(-2px)' }}
    />
  );
};

const Experience = () => {
  const ref = useInView();

  return (
    <Section
      id="experience"
      title="Where I work."
      lead="Real production work — not just coursework."
      companion={{ msg: '// where I work', accent: '#4B5A16' }}
    >
      <div ref={ref} className="reveal relative">
        {/* Static pipeline line */}
        <svg
          className="absolute left-[18px] sm:left-5 top-3 bottom-3 w-2 h-[calc(100%-1.5rem)] overflow-visible pointer-events-none"
          aria-hidden="true"
        >
          <line
            x1="4"
            y1="0"
            x2="4"
            y2="100%"
            stroke="#C6C2B1"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="4"
            y1="0"
            x2="4"
            y2="100%"
            stroke="#C5FF3B"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="16 120"
            className="animate-pulse-line"
          />
        </svg>

        {/* Floating data particles */}
        <PipelineParticles />

        <div className="space-y-10">
          {experience.map((exp) => (
            <article key={exp.company} className="relative pl-16 sm:pl-24">
              {/* node centered on the line */}
              <span
                className="absolute left-[18px] sm:left-5 top-2 -translate-x-1/2 grid place-items-center w-10 h-10 rounded-full bg-surface border-2 border-accent/40 text-accent shadow-sm"
                aria-hidden="true"
              >
                <Briefcase size={16} />
              </span>

              <div className="rounded-2xl bg-[#1A1A18] text-[#E2DFD2] p-8 shadow-xl shadow-black/10">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-2">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="text-2xl font-bold text-[#E2DFD2] tracking-[-0.01em]">{exp.role}</h3>
                    <span className="text-[#C5FF3B] font-semibold text-lg">@ {exp.company}</span>
                  </div>
                  <span className="inline-flex items-center gap-2 text-xs font-medium text-[#E2DFD2]/60 bg-white/10 px-3 py-1.5 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" /> Current
                  </span>
                </div>
                <p className="font-mono text-xs text-[#E2DFD2]/50 mt-2">{tenure(exp)}</p>
                <p className="text-[#E2DFD2]/85 mt-5 text-lg leading-relaxed">{exp.summary}</p>

                <ul className="mt-5 space-y-3 bullet-stagger">
                  {exp.bullets.map((b, i) => (
                    <li key={i} className="flex gap-3 text-[#E2DFD2]/75 leading-relaxed">
                      <ChevronRight size={18} className="text-[#C5FF3B] mt-0.5 shrink-0" aria-hidden="true" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-2 mt-6">
                  {exp.tech.map((t) => (
                    <TechPill
                      key={t}
                      tech={t}
                      className="bg-white/5 border-white/10 text-[#E2DFD2] hover:bg-white/10"
                    />
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default Experience;
