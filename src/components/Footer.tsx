import { profile } from '../data/portfolio';

/** The lime band below the panel — sits directly on the frame colour. */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#C5FF3B] lg:bg-transparent text-black px-4 sm:px-6 py-3 lg:py-[clamp(0.45rem,1.5vh,0.8rem)] z-20 lg:shrink-0">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 font-sans uppercase tracking-wide text-[10px] lg:text-[11px]">
        <p>
          <span className="font-black">© {currentYear} {profile.name}.</span>{' '}
          <span className="font-medium">All rights reserved</span>
        </p>

        <div className="flex items-center gap-2.5 sm:gap-4 font-black">
          <span>Designed &amp; built with care</span>
          <span className="text-black/35">·</span>
          <span>React · TS · Tailwind</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
