import { useInView } from '../hooks/useInView';
import { MiniMe } from './Avatar';

interface SectionProps {
  id: string;
  title: string;
  lead?: string;
  children: React.ReactNode;
  className?: string;
  /** Optional companion guide shown beside the header. */
  companion?: { msg: string; accent?: string; dark?: boolean };
}

/** Shared section wrapper: consistent rhythm (py / header margin) + scroll-reveal + companion. */
const Section = ({ id, title, lead, children, className = '', companion }: SectionProps) => {
  const headRef = useInView();

  return (
    <section id={id} className={`relative py-24 sm:py-32 ${className}`}>
      <div className="section-shell">
        <div ref={headRef} className="reveal relative mb-14 sm:mb-16">
          <div className={companion ? 'md:max-w-[calc(100%-14rem)]' : ''}>
            <h2 className="section-title">{title}</h2>
            {lead && <p className="section-lead">{lead}</p>}
          </div>

          {companion && (
            <div className="hidden md:flex items-center gap-3 absolute right-0 top-1" aria-hidden="true">
              <span
                className={`px-4 py-2.5 rounded-2xl font-mono text-[13px] shadow-lg shadow-black/5 ${
                  companion.dark ? 'bg-ink-900 text-lime' : 'bg-surface'
                }`}
                style={companion.dark ? undefined : { color: companion.accent ?? '#4F46E5' }}
              >
                {companion.msg}
              </span>
              <span className="w-12 h-14 animate-float shrink-0">
                <MiniMe accent={companion.accent} className="w-full h-full drop-shadow" />
              </span>
            </div>
          )}
        </div>
        {children}
      </div>
    </section>
  );
};

export default Section;
