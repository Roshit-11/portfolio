import { useEffect } from 'react';
import Lenis from 'lenis';
import BootLoader from './components/BootLoader';
import Header from './components/Header';
import Hero from './components/Hero';
import LiquidTransition from './components/LiquidTransition';
import GalleryStrip from './components/GalleryStrip';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Certifications from './components/Certifications';
import Contact from './components/Contact';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import { TechHighlightProvider } from './hooks/TechHighlightContext';

function App() {
  // Smooth (inertia) scrolling via Lenis — skipped for reduced-motion users.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true, wheelMultiplier: 1 });
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, []);

  useEffect(() => {
    // Easter egg for fellow devs poking around
    console.log(
      '%c$ whoami\n%cRoshit Lamichhane — nice to see you in the console. Email me: roshitlamichhane12@gmail.com',
      'color:#4f46e5;font-family:monospace;font-size:14px',
      'color:#71717a;font-family:monospace'
    );
  }, []);

  return (
    <TechHighlightProvider>
      <div className="min-h-screen">
        <CustomCursor />
        <BootLoader />
        <a
          href="#about"
          className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-2 focus:left-2 focus:bg-accent focus:text-white focus:px-4 focus:py-2 focus:rounded-lg"
        >
          Skip to content
        </a>
        <Header />
        <main>
          <Hero />
          <LiquidTransition />
          <GalleryStrip />
          <About />
          <Experience />
          <Projects />
          <Skills />
          <Certifications />
          {/* Footer viewport: on lg+ the contact panel + footer occupy exactly one screen */}
          {/* Lime frame; the dark panel is inset inside it, header floats on the top strip */}
          <div className="footer-viewport bg-[#C5FF3B] overflow-hidden lg:h-screen lg:flex lg:flex-col lg:pt-[88px] lg:px-3">
            <Contact />
            <Footer />
          </div>
        </main>
      </div>
    </TechHighlightProvider>
  );
}

export default App;
