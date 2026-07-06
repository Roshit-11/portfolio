import { useState } from 'react';
import { ExternalLink, Github, Sparkles } from 'lucide-react';
import Section from './Section';
import { projects, Project } from '../data/portfolio';
import { useInView } from '../hooks/useInView';

const CATEGORIES = ['All', 'AI & Automation', 'Web', 'Java & OOP', 'Data & IoT'] as const;

const ProjectCard = ({ project }: { project: Project }) => {
  const ref = useInView();

  return (
    <article
      ref={ref}
      className={`reveal group glass rounded-xl p-6 sm:p-7 flex flex-col hover:border-accent/30 hover:-translate-y-1.5 transition-all duration-300 ${
        project.featured ? 'ring-1 ring-accent/20' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <h3 className="text-xl font-bold text-white group-hover:text-accent-soft transition-colors">
          {project.title}
        </h3>
        <div className="flex items-center gap-1 shrink-0">
          {project.featured && (
            <span className="flex items-center gap-1 text-xs font-mono text-accent bg-accent/10 border border-accent/25 px-2 py-1 rounded-md">
              <Sparkles size={12} aria-hidden="true" /> featured
            </span>
          )}
        </div>
      </div>

      <div className="space-y-3 text-sm leading-relaxed flex-1">
        <p className="text-slate-400">
          <span className="font-mono text-xs text-accent-violet uppercase tracking-wider block mb-1">
            Problem
          </span>
          {project.problem}
        </p>
        <p className="text-slate-400">
          <span className="font-mono text-xs text-accent uppercase tracking-wider block mb-1">
            Solution
          </span>
          {project.solution}
        </p>
        <ul className="text-slate-500 space-y-1.5 pt-1">
          {project.features.map((f, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-accent" aria-hidden="true">
                ▸
              </span>
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap gap-2 mt-5">
        {project.tech.map((t) => (
          <span key={t} className="chip">
            {t}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-4 mt-5 pt-4 border-t border-white/5">
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-slate-300 hover:text-accent transition-colors"
          >
            <Github size={16} aria-hidden="true" /> Code
          </a>
        )}
        {project.live && (
          <a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-slate-300 hover:text-accent transition-colors"
          >
            <ExternalLink size={16} aria-hidden="true" /> Live demo
          </a>
        )}
        {!project.github && !project.live && project.note && (
          <span className="text-xs text-slate-500 font-mono">{project.note}</span>
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
      kicker="03. projects"
      title="Things I've Built"
      lead="From AI pipelines running 24/7 to database-backed desktop systems — each one taught me something different."
    >
      <div className="flex flex-wrap gap-2 mb-10" role="group" aria-label="Filter projects by category">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            aria-pressed={filter === cat}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
              filter === cat
                ? 'bg-accent/15 text-accent border-accent/40'
                : 'text-slate-400 border-white/10 hover:text-slate-200 hover:border-white/25'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {filtered.map((p) => (
          <ProjectCard key={p.title} project={p} />
        ))}
      </div>

      <p className="mt-10 text-center text-sm text-slate-500 font-mono">
        More on{' '}
        <a
          href="https://github.com/Roshit-11"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline"
        >
          github.com/Roshit-11
        </a>
      </p>
    </Section>
  );
};

export default Projects;
