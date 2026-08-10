import { useEffect, useRef, useState } from 'react';
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

/* ── Live-typing terminal code block ── */
const CODE_LINES = [
  { text: 'const ', cls: 'text-accent' },
  { text: 'roshit', cls: 'text-ink' },
  { text: ' = {', cls: 'text-muted' },
  { text: '\n' },
  { text: '  location: ', cls: 'text-ink-soft' },
  { text: `'${profile.location}'`, cls: 'text-accent' },
  { text: ',', cls: 'text-ink-soft' },
  { text: '\n' },
  { text: '  degree: ', cls: 'text-ink-soft' },
  { text: "'B.Sc. (Hons) Computing with AI'", cls: 'text-accent' },
  { text: ',', cls: 'text-ink-soft' },
  { text: '\n' },
  { text: '  currentFocus: ', cls: 'text-ink-soft' },
  { text: "'AI · automation · data'", cls: 'text-accent' },
  { text: ',', cls: 'text-ink-soft' },
  { text: '\n' },
  { text: '  openTo: ', cls: 'text-ink-soft' },
  { text: "'internships & collaborations'", cls: 'text-accent' },
  { text: ',', cls: 'text-ink-soft' },
  { text: '\n' },
  { text: '};', cls: 'text-muted' },
];

const TypingCodeBlock = () => {
  const [displayed, setDisplayed] = useState<{ text: string; cls?: string }[]>([]);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [done, setDone] = useState(false);
  const blockRef = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    // Blink the cursor
    const blink = setInterval(() => setCursorVisible((v) => !v), 530);
    return () => clearInterval(blink);
  }, []);

  useEffect(() => {
    const el = blockRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          typeOut();
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const typeOut = async () => {
    const all: { text: string; cls?: string }[] = [];

    for (const segment of CODE_LINES) {
      if (segment.text === '\n') {
        all.push({ text: '\n' });
        setDisplayed([...all]);
        await delay(80);
        continue;
      }

      for (let i = 0; i < segment.text.length; i++) {
        // Group 2-3 chars at a time for speed
        const chunk = segment.text.slice(i, i + 2);
        i += chunk.length - 1;

        const lastEntry = all[all.length - 1];
        if (lastEntry && lastEntry.cls === segment.cls && lastEntry.text !== '\n') {
          lastEntry.text += chunk;
        } else {
          all.push({ text: chunk, cls: segment.cls });
        }
        setDisplayed([...all]);
        await delay(25 + Math.random() * 30);
      }
    }
    setDone(true);
  };

  const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

  return (
    <div ref={blockRef} className="card bg-paper p-6 font-mono text-sm !mt-8 relative overflow-hidden">
      {/* Terminal dots */}
      <div className="flex items-center gap-1.5 mb-3">
        <span className="w-3 h-3 rounded-full bg-red-400/60" />
        <span className="w-3 h-3 rounded-full bg-yellow-400/60" />
        <span className="w-3 h-3 rounded-full bg-green-400/60" />
      </div>
      <pre className="whitespace-pre-wrap leading-relaxed">
        {displayed.map((seg, i) =>
          seg.text === '\n' ? (
            <br key={i} />
          ) : (
            <span key={i} className={seg.cls}>
              {seg.text}
            </span>
          )
        )}
        {!done && (
          <span
            className="inline-block w-[2px] h-[1em] bg-accent ml-[1px] align-text-bottom"
            style={{ opacity: cursorVisible ? 1 : 0 }}
          />
        )}
      </pre>
    </div>
  );
};

/* ── Magnetic Tilt Highlight Card ── */
const HighlightCard = ({
  item,
  accent,
}: {
  item: (typeof highlights)[number];
  accent: string;
}) => {
  const Icon = item.icon;
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x, y });
    el.style.setProperty('--x', `${e.clientX - rect.left}px`);
    el.style.setProperty('--y', `${e.clientY - rect.top}px`);
  };

  const cardStyle = hovered
    ? {
        transform: `perspective(800px) rotateY(${tilt.x * 10}deg) rotateX(${-tilt.y * 10}deg) scale3d(1.03, 1.03, 1.03)`,
        transition: 'transform 0.1s ease-out',
      }
    : {
        transform: 'perspective(800px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)',
        transition: 'transform 0.4s ease-out',
      };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setTilt({ x: 0, y: 0 }); }}
      style={cardStyle}
      className="group relative card p-6 cursor-pointer select-none"
    >
      {/* Backlit spotlight glow */}
      <div
        className="absolute inset-[-1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none -z-10"
        style={{
          background: `radial-gradient(circle at var(--x, 50%) var(--y, 50%), ${accent}55 0%, transparent 60%)`,
        }}
      />
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
};

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

          {/* Typing code block */}
          <TypingCodeBlock />
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
        {highlights.map((item, i) => (
          <HighlightCard key={item.title} item={item} accent={ACCENTS[i % ACCENTS.length]} />
        ))}
      </div>
    </Section>
  );
};

export default About;
