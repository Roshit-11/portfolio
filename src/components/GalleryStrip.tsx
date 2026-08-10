import { useEffect, useRef, useState } from 'react';
import { useScrollProgress } from '../hooks/useScrollProgress';
import { useMediaQuery } from '../hooks/useMediaQuery';

const photos = [
  { src: '/gallery/1.jpg', kicker: 'NEW BANESWOR · 01:47', title: 'Shipping in the dark.' },
  { src: '/gallery/2.jpg', kicker: 'HOME LAB · build night', title: 'Where side-projects live.' },
  { src: '/gallery/3.jpg', kicker: 'OFF HOURS · 64 squares', title: 'A few moves ahead.' },
  { src: '/gallery/4.jpg', kicker: 'THE STUDY · the books', title: 'Read it, then code it.' },
  { src: '/gallery/5.jpg', kicker: 'LATE SESSION · lo-fi', title: 'Paper first, keys second.' },
  { src: '/gallery/6.jpg', kicker: 'DEEP WORK · 23:48', title: 'The quiet part of the job.' },
  { src: '/gallery/7.jpg', kicker: 'THE CAFÉ · 18:38', title: 'One more query.' },
  { src: '/gallery/8.jpg', kicker: 'EXAM WEEK · four screens', title: 'All of it, at once.' },
];

const Quote = () => (
  <div className="max-w-2xl">
    <h2 className="font-serif text-3xl sm:text-5xl leading-[1.15] text-[#EDEBE4]">
      It doesn&apos;t matter where you start. It&apos;s{' '}
      <em className="text-lime not-italic font-semibold italic">how you build</em> from there.
    </h2>
    <svg viewBox="0 0 180 70" className="w-40 h-16 mt-5" aria-hidden="true">
      <path
        d="M6 46 C 26 8, 40 8, 44 40 C 47 60, 58 20, 70 34 C 80 44, 86 18, 100 30 C 112 40, 120 22, 138 36 C 150 45, 168 30, 176 22"
        fill="none"
        stroke="#C6F24E"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
    </svg>
  </div>
);

const Figure = ({ p }: { p: (typeof photos)[number] }) => (
  <figure className="shrink-0 w-[260px] sm:w-[300px]">
    <p className="text-[11px] tracking-[0.18em] font-bold text-[#b9b6ab] uppercase mb-3">{p.kicker}</p>
    <img
      src={p.src}
      alt={p.title}
      loading="lazy"
      className="w-full h-[300px] sm:h-[380px] object-cover rounded grayscale"
    />
    <figcaption className="font-serif text-xl sm:text-2xl text-[#EDEBE4] mt-4">{p.title}</figcaption>
  </figure>
);

const GalleryStrip = () => {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const { ref, progress: p } = useScrollProgress<HTMLElement>();
  const rowRef = useRef<HTMLDivElement>(null);
  const [maxTranslate, setMaxTranslate] = useState(0);

  useEffect(() => {
    const measure = () => {
      const row = rowRef.current;
      if (!row) return;
      setMaxTranslate(Math.max(0, row.scrollWidth - window.innerWidth + 96));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [isDesktop]);

  /* Mobile: native horizontal scroll */
  if (!isDesktop) {
    return (
      <section aria-label="Field notes gallery" className="bg-taupe py-16">
        <div className="section-shell mb-8">
          <Quote />
        </div>
        <div className="flex gap-5 overflow-x-auto px-4 pb-4 snap-x">
          {photos.map((ph) => (
            <div key={ph.src} className="snap-start"><Figure p={ph} /></div>
          ))}
        </div>
      </section>
    );
  }

  /* Desktop: scroll-linked horizontal slide */
  return (
    <section ref={ref} aria-label="Field notes gallery" className="bg-taupe relative" style={{ height: '200vh' }}>
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">
        <div className="section-shell w-full">
          <div className="mb-10"><Quote /></div>
        </div>
        <div
          ref={rowRef}
          className="flex gap-10 pl-[max(1rem,calc((100vw-72rem)/2+2rem))] will-change-transform"
          style={{ transform: `translateX(-${p * maxTranslate}px)` }}
        >
          {photos.map((ph) => (
            <Figure key={ph.src} p={ph} />
          ))}
        </div>
        <div className="section-shell w-full mt-10 flex items-center gap-3">
          <div className="flex gap-1.5" aria-hidden="true">
            {photos.slice(0, 5).map((_, i) => (
              <span
                key={i}
                className="h-2 rounded-full bg-white/25 transition-all"
                style={{
                  width: Math.abs(p * 4 - i) < 0.5 ? 26 : 8,
                  background: Math.abs(p * 4 - i) < 0.5 ? '#C6F24E' : undefined,
                }}
              />
            ))}
          </div>
          <span className="font-mono text-xs text-white/40">scroll — the strip slides through</span>
        </div>
      </div>
    </section>
  );
};

export default GalleryStrip;
