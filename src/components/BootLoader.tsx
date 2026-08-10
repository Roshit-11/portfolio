import { useEffect, useState } from 'react';

const LINES = [
  '> booting roshit.dev',
  '> loading modules ............ ok',
  '> mounting portfolio ......... ok',
  '> ready_',
];

/**
 * Full-screen terminal-boot loader shown on first load of the session, then it
 * wipes up to reveal the page. Skips on reduced-motion and on repeat navigations.
 */
const BootLoader = () => {
  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined') return false;
    if (sessionStorage.getItem('booted')) return false;
    return true;
  });
  const [shownLines, setShownLines] = useState(0);
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (!visible) return;
    document.body.style.overflow = 'hidden';

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timers: number[] = [];

    if (reduce) {
      setShownLines(LINES.length);
      setProgress(100);
      timers.push(window.setTimeout(finish, 600));
    } else {
      LINES.forEach((_, i) => {
        timers.push(window.setTimeout(() => setShownLines(i + 1), 380 * (i + 1)));
      });
      const total = 380 * LINES.length + 500;
      let p = 0;
      const iv = window.setInterval(() => {
        p = Math.min(100, p + 4);
        setProgress(p);
        if (p >= 100) window.clearInterval(iv);
      }, total / 26);
      timers.push(iv);
      timers.push(window.setTimeout(finish, total + 250));
    }

    function finish() {
      setLeaving(true);
      window.setTimeout(() => {
        sessionStorage.setItem('booted', '1');
        document.body.style.overflow = '';
        setVisible(false);
      }, 650);
    }

    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      document.body.style.overflow = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[90] bg-ink-950 flex items-center justify-center transition-transform duration-[650ms] ease-[cubic-bezier(0.7,0,0.3,1)] ${
        leaving ? '-translate-y-full' : 'translate-y-0'
      }`}
      aria-hidden="true"
    >
      <div className="w-[min(90vw,520px)] px-6">
        <div className="font-mono text-[15px] sm:text-base leading-relaxed">
          {LINES.slice(0, shownLines).map((line, i) => (
            <p key={i} className={i === LINES.length - 1 ? 'text-lime' : 'text-white/70'}>
              {line}
              {i === shownLines - 1 && <span className="animate-blink text-lime">▍</span>}
            </p>
          ))}
        </div>
        <div className="mt-6 h-0.5 w-full bg-white/10 overflow-hidden rounded-full">
          <div className="h-full bg-lime transition-[width] duration-150 ease-linear" style={{ width: `${progress}%` }} />
        </div>
        <p className="mt-2 font-mono text-[11px] text-white/40 tabular-nums">{progress}%</p>
      </div>
    </div>
  );
};

export default BootLoader;
