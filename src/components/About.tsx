import { Bot, Code2, Database, GraduationCap } from 'lucide-react';
import Section from './Section';
import { education, profile } from '../data/portfolio';
import { useInView } from '../hooks/useInView';
import { ACCENTS } from '../data/accents';

const highlights = [
  {
    icon: Bot,
    title: 'AI & Automation',
    description:
      'AI-powered pipelines — from news summarization with LLMs to lead-research automation running in production at work.',
  },
  {
    icon: Code2,
    title: 'Full-Stack Development',
    description:
      'Web apps with Next.js, Tailwind, and Node.js on the front; Java and Python systems with real databases behind them.',
  },
  {
    icon: Database,
    title: 'Data & Databases',
    description:
      'Comfortable from ERD and UNF→3NF normalization to Oracle/MySQL, JDBC, Power BI dashboards, and NumPy.',
  },
  {
    icon: GraduationCap,
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
      title="Student by day, automation builder at work."
      lead="I like problems that start messy and end as a running system."
      companion={{ msg: '// a bit about me', accent: ACCENTS[0] }}
    >
      <div className="grid lg:grid-cols-[1.2fr,1fr] gap-12 items-start">
        <div className="space-y-5 text-ink-soft leading-relaxed text-lg">
          <p>
            I&apos;m a Computing with AI undergraduate at Islington College in Kathmandu, and since May
            2026 I&apos;ve been working with the marketing team at{' '}
            <span className="text-ink font-medium">Allied Title &amp; Escrow</span>, where I build the
            data side of outbound campaigns — scraping, validating, and enriching real estate agent
            leads, then running sequences through HubSpot.
          </p>
          <p>
            Outside work, I ship projects that scratch my own itch: a Nepali news aggregator that
            summarizes articles with an LLM every 10 minutes, a gamified platform for learning
            Tailwind CSS, and a from-scratch CRM to understand what HubSpot does under the hood.
          </p>
          <p className="text-ink font-medium">
            I care about systems that keep running after I stop watching them — automated,
            monitored, and boring in the best way.
          </p>

          {/* Quick facts */}
          <div className="card bg-paper p-6 font-mono text-sm !mt-8">
            <p className="text-muted">
              <span className="text-accent">const</span> <span className="text-ink">roshit</span> = {'{'}
            </p>
            <p className="pl-5 text-ink-soft">
              location: <span className="text-accent">&apos;{profile.location}&apos;</span>,
            </p>
            <p className="pl-5 text-ink-soft">
              degree: <span className="text-accent">&apos;B.Sc. (Hons) Computing with AI&apos;</span>,
            </p>
            <p className="pl-5 text-ink-soft">
              currentFocus: <span className="text-accent">&apos;AI · automation · data&apos;</span>,
            </p>
            <p className="pl-5 text-ink-soft">
              openTo: <span className="text-accent">&apos;internships &amp; collaborations&apos;</span>,
            </p>
            <p className="text-muted">{'};'}</p>
          </div>
        </div>

        <div ref={eduRef} className="reveal space-y-4">
          <h3 className="eyebrow text-muted">Education</h3>
          {education.map((e) => (
            <div key={e.school} className="card p-6 card-interactive">
              <div className="flex justify-between items-start gap-3 flex-wrap">
                <h4 className="card-title">{e.school}</h4>
                <span className="font-mono text-xs text-muted bg-paper px-3 py-1 rounded-full">{e.period}</span>
              </div>
              <p className="text-accent text-sm font-medium mt-1.5">{e.degree}</p>
              {e.detail && <p className="card-body mt-2">{e.detail}</p>}
            </div>
          ))}
        </div>
      </div>

      <div ref={gridRef} className="reveal-stagger grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
        {highlights.map((item, i) => {
          const accent = ACCENTS[i % ACCENTS.length];
          const Icon = item.icon;
          return (
            <div key={item.title} className="card p-6 card-interactive">
              <span
                className="grid place-items-center w-11 h-11 rounded-xl mb-4"
                style={{ backgroundColor: `${accent}1a`, color: accent }}
              >
                <Icon className="w-5 h-5" />
              </span>
              <h4 className="card-title mb-2">{item.title}</h4>
              <p className="card-body">{item.description}</p>
            </div>
          );
        })}
      </div>
    </Section>
  );
};

export default About;
