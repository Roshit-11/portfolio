import { useState } from 'react';
import { ArrowUpRight, ExternalLink, Github, Sparkles } from 'lucide-react';
import Section from './Section';
import { projects, Project } from '../data/portfolio';
import { useInView } from '../hooks/useInView';

const CATEGORIES = ['All', 'AI & Automation', 'Web', 'Java & OOP', 'Data & IoT'] as const;

const ProjectCard = ({ project }: { project: Project }) => {
  const ref = useInView();

  return (
    <article
      ref={ref}
      className={`reveal group card p-6 card-interactive flex flex-col ${
        project.featured ? 'ring-1 ring-accent/20' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <h3 className="card-title group-hover:text-accent transition-colors">
          {project.title}
        </h3>
        {project.featured && (
          <span className="flex items-center gap-1 text-xs font-medium text-accent bg-accent-soft px-2.5 py-1 rounded-lg shrink-0">
            <Sparkles size={12} aria-hidden="true" /> featured
          </span>
        )}
      </div>

      <div className="space-y-3 text-sm leading-relaxed flex-1">
        <div>
          <span className="font-mono text-[11px] text-muted uppercase tracking-wider block mb-1">Problem</span>
          <p className="text-ink-soft">{project.problem}</p>
        </div>
        <div>
          <span className="font-mono text-[11px] text-accent uppercase tracking-wider block mb-1">Solution</span>
          <p className="text-ink-soft">{project.solution}</p>
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

      <div className="flex flex-wrap gap-2 mt-5">
        {project.tech.map((t) => (
          <span key={t} className="chip">{t}</span>
        ))}
      </div>

      <div className="flex items-center gap-4 mt-5 pt-4 border-t border-line">
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm font-medium text-ink hover:text-accent transition-colors"
          >
            <Github size={16} aria-hidden="true" /> Code
          </a>
        )}
        {project.live && (
          <a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm font-medium text-accent transition-colors"
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
            className="ml-auto text-accent opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
            aria-hidden="true"
          />
        )}
      </div>
    </article>
  );
};

const Projects = () => {
  const [filter, setFilter] = useState<(typeof CATEGORIES)[number]>('All');
  const filtered = filter === 'All' ? projects : projects.filter((p) => p.category === filter);

  return (
    <Section
      id="projects"
      title="Things I've built."
      lead="From AI pipelines running 24/7 to database-backed systems — each one taught me something different."
      className="bg-[#cfccba]"
      companion={{ msg: '// stuff I built', accent: '#5B6B23' }}
    >
      <div className="flex flex-wrap gap-2 mb-10" role="group" aria-label="Filter projects by category">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            aria-pressed={filter === cat}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors border ${
              filter === cat
                ? 'bg-ink text-paper border-ink'
                : 'bg-surface text-ink-soft border-line hover:border-accent/40'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((p) => (
          <ProjectCard key={p.title} project={p} />
        ))}
      </div>

      <p className="mt-10 text-sm text-muted font-mono">
        More on{' '}
        <a
          href="https://github.com/Roshit-11"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline"
        >
          github.com/Roshit-11 →
        </a>
      </p>
    </Section>
  );
};

export default Projects;
