import { useEffect, useRef, useState } from 'react';
import { profile, projects, skillGroups, experience, tenure } from '../data/portfolio';

interface Line {
  text: string;
  kind: 'cmd' | 'out' | 'accent';
}

const HELP = [
  'whoami        who is this guy?',
  'projects      list featured work',
  'skills        tech I work with',
  'experience    where I work',
  'contact       reach me',
  'sudo hire-me  (try it)',
  'clear         clean the screen',
];

function run(cmd: string): Line[] {
  const c = cmd.trim().toLowerCase();
  switch (c) {
    case '':
      return [];
    case 'help':
      return HELP.map((t) => ({ text: t, kind: 'out' }));
    case 'whoami':
      return [
        { text: profile.name, kind: 'accent' },
        { text: profile.role + ' — ' + profile.location, kind: 'out' },
      ];
    case 'projects':
      return projects
        .filter((p) => p.featured)
        .concat(projects.filter((p) => !p.featured).slice(0, 3))
        .map((p) => ({ text: `▸ ${p.title} — ${p.tech.slice(0, 3).join(', ')}`, kind: 'out' }));
    case 'skills':
      return skillGroups.map((g) => ({
        text: `${g.title}: ${g.skills.join(', ')}`,
        kind: 'out',
      }));
    case 'experience':
      return experience.map((e) => ({
        text: `${e.role} @ ${e.company} · ${tenure(e)}`,
        kind: 'out',
      }));
    case 'contact':
      return [
        { text: `email: ${profile.email}`, kind: 'out' },
        { text: `github: ${profile.github}`, kind: 'out' },
        { text: `linkedin: ${profile.linkedin}`, kind: 'out' },
      ];
    case 'sudo hire-me':
    case 'hire-me':
      window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent("Let's work together")}`;
      return [{ text: 'Permission granted. Opening mail client…', kind: 'accent' }];
    case 'ls':
      return [{ text: 'about/  experience/  projects/  skills/  certifications/  contact/', kind: 'out' }];
    case 'clear':
      return [{ text: '\x00clear', kind: 'out' }];
    default:
      return [{ text: `command not found: ${c} — try 'help'`, kind: 'out' }];
  }
}

/** Interactive fake terminal — the portfolio's gamified easter egg. */
const Terminal = () => {
  const [lines, setLines] = useState<Line[]>([
    { text: "Welcome to roshit.sh — type 'help' to explore", kind: 'accent' },
  ]);
  const [input, setInput] = useState('');
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [lines]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const out = run(input);
    if (out.length === 1 && out[0].text === '\x00clear') {
      setLines([]);
    } else {
      const echo: Line = { text: `$ ${input}`, kind: 'cmd' };
      setLines((prev) => [...prev, echo, ...out].slice(-40));
    }
    setInput('');
  };

  return (
    <div
      className="glass rounded-xl overflow-hidden shadow-2xl shadow-accent/5 text-left"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/10 bg-white/[0.03]">
        <span className="h-3 w-3 rounded-full bg-red-500/80" aria-hidden="true" />
        <span className="h-3 w-3 rounded-full bg-yellow-500/80" aria-hidden="true" />
        <span className="h-3 w-3 rounded-full bg-green-500/80" aria-hidden="true" />
        <span className="ml-2 font-mono text-xs text-slate-400">roshit@portfolio — zsh</span>
      </div>
      <div ref={bodyRef} className="h-48 overflow-y-auto px-4 py-3 font-mono text-[13px] leading-relaxed">
        {lines.map((l, i) => (
          <p
            key={i}
            className={
              l.kind === 'cmd'
                ? 'text-slate-200'
                : l.kind === 'accent'
                  ? 'text-accent-soft'
                  : 'text-slate-400 whitespace-pre-wrap'
            }
          >
            {l.text}
          </p>
        ))}
        <form onSubmit={submit} className="flex items-center gap-2">
          <span className="text-accent" aria-hidden="true">
            $
          </span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent text-slate-100 outline-none caret-accent"
            aria-label="Terminal input — type help to explore"
            autoComplete="off"
            spellCheck={false}
          />
        </form>
      </div>
    </div>
  );
};

export default Terminal;
