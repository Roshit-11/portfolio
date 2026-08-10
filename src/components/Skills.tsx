import { Bot, Cloud, Code2, Database, Globe, LineChart } from 'lucide-react';
import Section from './Section';
import { skillGroups } from '../data/portfolio';
import { useInView } from '../hooks/useInView';
import { ACCENTS } from '../data/accents';

const GROUP_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Languages: Code2,
  'Web & Frontend': Globe,
  'Data & AI': LineChart,
  Databases: Database,
  'Cloud & Tools': Cloud,
  'Automation & CRM': Bot,
};

const Skills = () => {
  const ref = useInView();

  return (
    <Section
      id="skills"
      title="The stack I reach for."
      lead="Built through coursework, side projects, and production work at Allied Title & Escrow."
      companion={{ msg: '// my toolkit', accent: ACCENTS[5] }}
    >
      <div ref={ref} className="reveal-stagger grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {skillGroups.map((group, i) => {
          const Icon = GROUP_ICONS[group.title] ?? Code2;
          const accent = ACCENTS[i % ACCENTS.length];
          return (
            <div key={group.title} className="card p-6 card-interactive">
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="grid place-items-center w-11 h-11 rounded-xl"
                  style={{ backgroundColor: `${accent}1a`, color: accent }}
                >
                  <Icon className="w-5 h-5" />
                </span>
                <h3 className="card-title">{group.title}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <span key={skill} className="chip-outline">{skill}</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
};

export default Skills;
