import { useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Certifications from './components/Certifications';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  useEffect(() => {
    // Easter egg for fellow devs poking around
    console.log(
      '%c$ whoami\n%cRoshit Lamichhane — nice to see you in the console. Try the terminal in the hero, or just email me: roshitlamichhane12@gmail.com',
      'color:#22d3ee;font-family:monospace;font-size:14px',
      'color:#94a3b8;font-family:monospace'
    );
  }, []);

  return (
    <div className="min-h-screen">
      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-2 focus:left-2 focus:bg-accent focus:text-ink-950 focus:px-4 focus:py-2 focus:rounded-lg"
      >
        Skip to content
      </a>
      <Header />
      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Certifications />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
