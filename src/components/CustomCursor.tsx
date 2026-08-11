import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<'default' | 'hover' | 'drag' | 'view'>('default');
  const [visible, setVisible] = useState(false);
  const mouseRef = useRef({ x: 0, y: 0 });
  const posRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Skip on devices without fine pointers (touch devices) or if prefers-reduced-motion is active
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Apply global style to hide native cursor
    const style = document.createElement('style');
    style.innerHTML = `
      a, button, input, textarea, select, [role="button"], [data-cursor] {
        cursor: none !important;
      }
      body {
        cursor: none !important;
      }
    `;
    document.head.appendChild(style);

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      if (!visible) setVisible(true);

      // Element under cursor check
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Inside the contact lightbox the cursor stays the small lime dot — the
      // large hover blob covers the fields you're trying to type into.
      if (target.closest('.contact-modal-panel')) {
        setMode('default');
        return;
      }

      const interactive = target.closest('a, button, input, textarea, select, [role="button"], .card-interactive');
      const dragEl = target.closest('[data-cursor="drag"]');
      const viewEl = target.closest('[data-cursor="view"]');

      if (dragEl) {
        setMode('drag');
      } else if (viewEl || (interactive && (interactive.tagName === 'A' || interactive.getAttribute('onClick')))) {
        setMode('view');
      } else if (interactive) {
        setMode('hover');
      } else {
        setMode('default');
      }
    };

    const onMouseLeave = () => {
      setVisible(false);
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);

    let rafId = 0;
    const updatePosition = () => {
      const pos = posRef.current;
      const mouse = mouseRef.current;

      // Lerping for smooth movement inertia
      pos.x += (mouse.x - pos.x) * 0.16;
      pos.y += (mouse.y - pos.y) * 0.16;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(calc(${pos.x}px - 50%), calc(${pos.y}px - 50%), 0)`;
      }
      rafId = requestAnimationFrame(updatePosition);
    };
    rafId = requestAnimationFrame(updatePosition);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(rafId);
      document.head.removeChild(style);
    };
  }, [visible]);

  if (!visible) return null;

  // Render different cursor states
  const getCursorContent = () => {
    switch (mode) {
      case 'drag':
        return (
          <div className="w-16 h-16 rounded-full bg-[#C5FF3B] text-[#1A1A18] font-mono text-xs font-black flex items-center justify-center tracking-wider border border-[#C5FF3B] shadow-lg animate-[pulse_1.5s_infinite]">
            DRAG
          </div>
        );
      case 'view':
        return (
          <div className="w-16 h-16 rounded-full bg-[#C5FF3B] text-[#1A1A18] font-mono text-xs font-black flex items-center justify-center tracking-wider border border-[#C5FF3B] shadow-lg animate-[pulse_1.5s_infinite]">
            VIEW
          </div>
        );
      case 'hover':
        return (
          <div className="w-10 h-10 rounded-full bg-white mix-blend-difference scale-110 transition-all duration-300" />
        );
      default:
        return (
          <div className="w-4 h-4 rounded-full bg-[#C5FF3B] mix-blend-difference transition-all duration-300" />
        );
    }
  };

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999] will-change-transform"
      style={{ backfaceVisibility: 'hidden' }}
    >
      {getCursorContent()}
    </div>
  );
}
