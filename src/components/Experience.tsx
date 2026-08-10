import { Briefcase, ChevronRight } from 'lucide-react';
import Section from './Section';
import { experience, tenure } from '../data/portfolio';
import { useInView } from '../hooks/useInView';

const Experience = () => {
  const ref = useInView();

  return (
    <Section
      id="experience"
      title="Where I work."
      lead="Real production work — not just coursework."
      companion={{ msg: '// where I work', accent: '#4B5A16' }}
    >
      <div ref={ref} className="reveal relative">
        {/* vertical timeline line */}
        <div className="absolute left-[18px] sm:left-5 top-3 bottom-3 w-0.5 bg-line" aria-hidden="true" />

        <div className="space-y-10">
          {experience.map((exp) => (
            <article key={exp.company} className="relative pl-16 sm:pl-24">
              {/* node centered on the line */}
              <span
                className="absolute left-[18px] sm:left-5 top-2 -translate-x-1/2 grid place-items-center w-10 h-10 rounded-full bg-surface border-2 border-accent/40 text-accent shadow-sm"
                aria-hidden="true"
              >
                <Briefcase size={16} />
              </span>

              <div className="rounded-2xl bg-taupe text-paper p-8 shadow-xl shadow-black/10">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-2">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="text-2xl font-bold text-paper tracking-[-0.01em]">{exp.role}</h3>
                    <span className="text-lime font-semibold text-lg">@ {exp.company}</span>
                  </div>
                  <span className="inline-flex items-center gap-2 text-xs font-medium text-paper/60 bg-white/10 px-3 py-1.5 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" /> Current
                  </span>
                </div>
                <p className="font-mono text-xs text-paper/50 mt-2">{tenure(exp)}</p>
                <p className="text-paper/85 mt-5 text-lg leading-relaxed">{exp.summary}</p>

                <ul className="mt-5 space-y-3">
                  {exp.bullets.map((b, i) => (
                    <li key={i} className="flex gap-3 text-paper/75 leading-relaxed">
                      <ChevronRight size={18} className="text-lime mt-0.5 shrink-0" aria-hidden="true" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-2 mt-6">
                  {exp.tech.map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white/10 text-paper border border-white/10"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default Experience;
