import React from 'react';
import { ArrowDown, Github, Linkedin, Mail } from 'lucide-react';

const Hero = () => {
  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1089438/pexels-photo-1089438.jpeg')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/50 to-blue-900/80"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="block">Hello, I'm</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-orange-400">
                Roshit Lamichhane
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-blue-100 font-light max-w-2xl mx-auto">
              Passionate Web Development Enthusiast & AI Student
            </p>
          </div>

          <p className="text-lg text-blue-200 max-w-3xl mx-auto leading-relaxed">
            Continuously expanding my skills in HTML, CSS, JavaScript, and responsive web design. 
            Currently exploring the fascinating world of AI and Machine Learning while building innovative projects.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
            <button 
              onClick={scrollToAbout}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Explore My Work
            </button>
            
            <div className="flex space-x-4">
              <a
                href="https://www.linkedin.com/in/roshit-lamichhane-a5382053"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 transform hover:scale-110 backdrop-blur-sm"
              >
                <Linkedin size={24} />
              </a>
              <a
                href="mailto:roshitlamichhane12@gmail.com"
                className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 transform hover:scale-110 backdrop-blur-sm"
              >
                <Mail size={24} />
              </a>
            </div>
          </div>
        </div>

        <button
          onClick={scrollToAbout}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
        >
          <ArrowDown size={32} className="text-blue-300" />
        </button>
      </div>
    </section>
  );
};

export default Hero;