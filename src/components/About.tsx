import { Bot, Code2, Database, GraduationCap } from 'lucide-react';
import Section from './Section';
import { education, profile } from '../data/portfolio';
import { useInView } from '../hooks/useInView';

const highlights = [
  {
    icon: <Bot className="w-7 h-7 text-accent" />,
    title: 'AI & Automation',
    description:
      'Building AI-powered pipelines — from news summarization with LLMs to lead-research automation used in production at work.',
  },
  {
    icon: <Code2 className="w-7 h-7 text-accent-violet" />,
    title: 'Full-Stack Development',
    description:
      'Web apps with Next.js, Tailwind, and Node.js on the front; Java and Python systems with real databases behind them.',
  },
  {
    icon: <Database className="w-7 h-7 text-emerald-400" />,
    title: 'Data & Databases',
    description:
      'Comfortable from ERD and UNF→3NF normalization to Oracle/MySQL, JDBC, Power BI dashboards, and NumPy.',
  },
  {
    icon: <GraduationCap className="w-7 h-7 text-amber-400" />,
    title: 'Continuous Learning',
    description:
      'Four AWS Academy badges and a stack of LinkedIn Learning certs — plus an AI degree in progress.',
  },
];

const About = () => {
  const gridRef = useInView();
  const eduRef = useInView();

  return (
    <Section
      id="about"
      kicker="01. about"
      title="About Me"
      lead="Student by day, automation builder at work — I like problems that start messy and end as a running system."
    >
      <div className="grid lg:grid-cols-[1.2fr,1fr] gap-12 items-start">
        <div className="space-y-5 text-slate-400 leading-relaxed">
          <p>
            I'm a Computing with AI undergraduate at Islington College in Kathmandu, and since May
            2026 I've been working with the marketing team at{' '}
            <span className="text-slate-200">Allied Title &amp; Escrow</span>, where I build the
            data side of outbound campaigns — scraping, validating, and enriching real estate agent
            leads, then running sequences through HubSpot.
          </p>
          <p>
            Outside work, I ship projects that scratch my own itch: a Nepali news aggregator that
            summarizes articles with an LLM every 10 minutes, a gamified platform for learning
            Tailwind CSS, and a from-scratch CRM to understand what HubSpot does under the hood.
          </p>
          <p>
            I care about systems that keep running after I stop watching them — automated,
            monitored, and boring in the best way.
          </p>

          {/* Code-styled quick facts */}
          <div className="glass rounded-xl p-5 font-mono text-sm !mt-8">
            <p className="text-slate-500">
              <span className="text-accent-violet">const</span>{' '}
              <span className="text-accent-soft">roshit</span> = {'{'}
            </p>
            <p className="pl-5 text-slate-300">
              location: <span className="text-emerald-400">'{profile.location}'</span>,
            </p>
            <p className="pl-5 text-slate-300">
              degree: <span className="text-emerald-400">'B.Sc. (Hons) Computing with AI'</span>,
            </p>
            <p className="pl-5 text-slate-300">
              currentFocus: <span className="text-emerald-400">'AI · automation · data'</span>,
            </p>
            <p className="pl-5 text-slate-300">
              openTo: <span className="text-emerald-400">'internships & collaborations'</span>,
            </p>
            <p className="text-slate-500">{'};'}</p>
          </div>
        </div>

        <div ref={eduRef} className="reveal space-y-4">
          <h3 className="font-mono text-sm text-slate-500 uppercase tracking-widest">Education</h3>
          {education.map((e) => (
            <div key={e.school} className="glass rounded-xl p-5">
              <div className="flex justify-between items-start gap-3 flex-wrap">
                <h4 className="font-semibold text-white">{e.school}</h4>
                <span className="font-mono text-xs text-accent">{e.period}</span>
              </div>
              <p className="text-slate-300 text-sm mt-1">{e.degree}</p>
              {e.detail && <p className="text-slate-500 text-sm mt-2 leading-relaxed">{e.detail}</p>}
            </div>
          ))}
        </div>
      </div>

      <div ref={gridRef} className="reveal grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-14">
        {highlights.map((item) => (
          <div
            key={item.title}
            className="group glass rounded-xl p-6 hover:border-accent/30 hover:-translate-y-1.5 transition-all duration-300"
          >
            <div className="mb-4">{item.icon}</div>
            <h4 className="text-lg font-bold text-white mb-2">{item.title}</h4>
            <p className="text-sm text-slate-400 leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>
    </Section>
  );
};

export default About;
