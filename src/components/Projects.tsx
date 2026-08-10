import { useState, useRef } from 'react';
import { Sparkles, Github, ExternalLink, ArrowUpRight } from 'lucide-react';
import Section from './Section';
import { projects, Project } from '../data/portfolio';
import { useInView } from '../hooks/useInView';
import { TechPill } from './TechPill';

const CATEGORIES = ['All', 'AI & Automation', 'Web', 'Java & OOP', 'Data & IoT'] as const;

// 3D Tilt & Backlit Glow Card for Featured Projects
const FeaturedProjectCard = ({ project }: { project: Project }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5
    setTilt({ x, y });

    // Update coordinates for spotlight glow effect
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    card.style.setProperty('--x', `${px}px`);
    card.style.setProperty('--y', `${py}px`);
  };

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  const cardStyle = hovered
    ? {
        transform: `perspective(1000px) rotateY(${tilt.x * 12}deg) rotateX(${-tilt.y * 12}deg) scale3d(1.02, 1.02, 1.02)`,
        transition: 'transform 0.1s ease-out, box-shadow 0.1s ease-out',
      }
    : {
        transform: 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)',
        transition: 'transform 0.4s ease-out, box-shadow 0.4s ease-out',
      };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={cardStyle}
      className="group relative card bg-surface border border-line rounded-2xl p-8 flex flex-col justify-between shadow-xl shadow-black/10 select-none cursor-pointer"
    >
      {/* Backlit spotlight glow */}
      <div
        className="absolute inset-[-1.5px] rounded-2xl bg-[radial-gradient(circle_at_var(--x)_var(--y),rgba(197,255,59,0.55)_0%,transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none -z-10"
        style={{ content: '""' }}
      />

      <div>
        <div className="flex items-start justify-between gap-3 mb-5">
          <h3 className="text-xl font-extrabold text-ink group-hover:text-accent transition-colors">
            {project.title}
          </h3>
          <span className="flex items-center gap-1.5 text-xs font-semibold text-[#4B5A16] bg-[#C5FF3B]/30 px-3 py-1 rounded-full shrink-0">
            <Sparkles size={12} aria-hidden="true" /> featured
          </span>
        </div>

        <div className="space-y-4 text-sm leading-relaxed mb-6">
          <div>
            <span className="font-mono text-[10px] text-muted uppercase tracking-wider block mb-1">Problem</span>
            <p className="text-ink-soft">{project.problem}</p>
          </div>
          <div>
            <span className="font-mono text-[10px] text-accent uppercase tracking-wider block mb-1">Solution</span>
            <p className="text-ink-soft">{project.problem === project.solution ? project.problem : project.solution}</p>
          </div>
          <ul className="text-muted space-y-1.5 pt-1">
            {project.features.map((f, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-accent" aria-hidden="true">▸</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.tech.map((t) => (
            <TechPill key={t} tech={t} />
          ))}
        </div>

        <div className="flex items-center gap-4 pt-4 border-t border-line">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm font-semibold text-ink hover:text-accent transition-colors"
            >
              <Github size={16} aria-hidden="true" /> Code
            </a>
          )}
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm font-semibold text-accent transition-colors"
            >
              <ExternalLink size={16} aria-hidden="true" /> Live demo
            </a>
          )}
          {!project.github && !project.live && project.note && (
            <span className="text-xs text-muted font-mono">{project.note}</span>
          )}
          {(project.github || project.live) && (
            <ArrowUpRight
              size={18}
              className="ml-auto text-accent opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
              aria-hidden="true"
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Curtain Reveal Card for Archive
const ArchiveProjectCard = ({ project }: { project: Project }) => {
  return (
    <article className="archive-card group card bg-surface border border-line rounded-2xl p-6 flex flex-col justify-between shadow-md hover:shadow-lg transition-shadow duration-300">
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <h3 className="font-extrabold text-lg text-ink group-hover:text-accent transition-colors">
            {project.title}
          </h3>
          {(project.github || project.live) && (
            <span className="text-muted group-hover:text-accent transition-colors">
              <ArrowUpRight
                size={18}
                className="transform group-hover:rotate-45 transition-transform duration-300 ease-out"
                aria-hidden="true"
              />
            </span>
          )}
        </div>
        <p className="text-sm text-ink-soft leading-relaxed mb-4">{project.problem}</p>
        <p className="text-xs text-muted leading-relaxed italic mb-4">Solution: {project.solution}</p>
      </div>

      <div>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tech.map((t) => (
            <TechPill key={t} tech={t} />
          ))}
        </div>

        <div className="flex items-center gap-4 pt-3 border-t border-line text-xs font-mono text-muted">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors"
            >
              Code
            </a>
          )}
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors"
            >
              Live Demo
            </a>
          )}
          {!project.github && !project.live && project.note && (
            <span>{project.note}</span>
          )}
        </div>
      </div>
    </article>
  );
};

const Projects = () => {
  const [filter, setFilter] = useState<(typeof CATEGORIES)[number]>('All');
  
  // Separate featured and archive projects
  const featuredList = projects.filter((p) => p.featured);
  const archiveList = projects.filter((p) => !p.featured);
  
  // Apply filter to archive list
  const filteredArchive = filter === 'All' ? archiveList : archiveList.filter((p) => p.category === filter);
  
  // Stagger reveal ref for archive grid
  const archiveGridRef = useInView<HTMLDivElement>();

  return (
    <Section
      id="projects"
      title="Things I've built."
      lead="From AI pipelines running 24/7 to database-backed systems — each one taught me something different."
      className="dark-section bg-[#1A1A18] text-[#E2DFD2]"
      companion={{ msg: '// stuff I built', accent: '#C5FF3B', dark: true }}
    >
      {/* Featured Grid */}
      <div className="mb-14">
        <h4 className="font-mono text-xs uppercase tracking-widest text-[#E2DFD2]/40 mb-6">
          Featured Developments
        </h4>
        <div className="grid md:grid-cols-2 gap-8">
          {featuredList.map((p) => (
            <FeaturedProjectCard key={p.title} project={p} />
          ))}
        </div>
      </div>

      {/* Archive Grid Header & Filter */}
      <div className="mt-20 border-t border-white/10 pt-14 mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h4 className="font-mono text-xs uppercase tracking-widest text-[#E2DFD2]/40 mb-2">
            Project Archive
          </h4>
          <p className="text-sm text-[#E2DFD2]/60">
            A comprehensive list of systems, academic work, and tools.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter project archive by category">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              aria-pressed={filter === cat}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 border ${
                filter === cat
                  ? 'bg-[#C5FF3B] text-[#1A1A18] border-[#C5FF3B] shadow-[0_0_12px_rgba(197,255,59,0.5)]'
                  : 'bg-white/5 text-[#E2DFD2]/80 border-white/10 hover:border-[#C5FF3B]/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Curtain Revealed Archive Grid */}
      <div
        ref={archiveGridRef}
        className="archive-grid reveal grid md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredArchive.map((p) => (
          <ArchiveProjectCard key={p.title} project={p} />
        ))}
      </div>

      <p className="mt-14 text-sm text-[#E2DFD2]/50 font-mono">
        More on{' '}
        <a
          href="https://github.com/Roshit-11"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#C5FF3B] hover:underline"
        >
          github.com/Roshit-11 →
        </a>
      </p>
    </Section>
  );
};

export default Projects;
