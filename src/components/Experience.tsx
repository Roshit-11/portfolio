import { Briefcase, ChevronRight } from 'lucide-react';
import Section from './Section';
import { experience, tenure } from '../data/portfolio';
import { useInView } from '../hooks/useInView';

const Experience = () => {
  const ref = useInView();

  return (
    <Section
      id="experience"
      kicker="02. experience"
      title="Where I Work"
      lead="Real production work — not just coursework."
    >
      <div ref={ref} className="reveal relative pl-6 sm:pl-8 border-l border-white/10 space-y-10">
        {experience.map((exp) => (
          <article key={exp.company} className="relative">
            <span
              className="absolute -left-[31px] sm:-left-[39px] top-1 grid place-items-center w-10 h-10 rounded-full bg-ink-900 border border-accent/40 text-accent"
              aria-hidden="true"
            >
              <Briefcase size={16} />
            </span>

            <div className="glass rounded-xl p-6 sm:p-8 hover:border-accent/25 transition-colors">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h3 className="text-xl font-bold text-white">{exp.role}</h3>
                <span className="text-accent font-semibold">@ {exp.company}</span>
              </div>
              <p className="font-mono text-xs text-slate-500 mt-1">{tenure(exp)}</p>
              <p className="text-slate-400 mt-4">{exp.summary}</p>

              <ul className="mt-4 space-y-2.5">
                {exp.bullets.map((b, i) => (
                  <li key={i} className="flex gap-2.5 text-sm text-slate-400 leading-relaxed">
                    <ChevronRight size={16} className="text-accent mt-0.5 shrink-0" aria-hidden="true" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-2 mt-5">
                {exp.tech.map((t) => (
                  <span key={t} className="chip">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
};

export default Experience;
