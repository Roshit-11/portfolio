import { Bot, Cloud, Code2, Database, Globe, LineChart } from 'lucide-react';
import Section from './Section';
import { skillGroups } from '../data/portfolio';
import { useInView } from '../hooks/useInView';

const GROUP_ICONS: Record<string, React.ReactNode> = {
  Languages: <Code2 className="w-6 h-6 text-accent" />,
  'Web & Frontend': <Globe className="w-6 h-6 text-accent-violet" />,
  'Data & AI': <LineChart className="w-6 h-6 text-emerald-400" />,
  Databases: <Database className="w-6 h-6 text-amber-400" />,
  'Cloud & Tools': <Cloud className="w-6 h-6 text-sky-400" />,
  'Automation & CRM': <Bot className="w-6 h-6 text-rose-400" />,
};

const Skills = () => {
  const ref = useInView();

  return (
    <Section
      id="skills"
      kicker="04. skills"
      title="Tech I Work With"
      lead="Built through coursework, side projects, and production work at Allied Title & Escrow."
    >
      <div ref={ref} className="reveal grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {skillGroups.map((group) => (
          <div
            key={group.title}
            className="glass rounded-xl p-6 hover:border-accent/25 hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-4">
              {GROUP_ICONS[group.title]}
              <h3 className="font-bold text-white">{group.title}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {group.skills.map((skill) => (
                <span key={skill} className="chip">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
};

export default Skills;
