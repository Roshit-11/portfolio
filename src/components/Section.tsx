import { useInView } from '../hooks/useInView';

interface SectionProps {
  id: string;
  kicker: string;
  title: string;
  lead?: string;
  children: React.ReactNode;
  className?: string;
}

/** Shared section wrapper: kicker + title header with scroll-reveal. */
const Section = ({ id, kicker, title, lead, children, className = '' }: SectionProps) => {
  const headRef = useInView();

  return (
    <section id={id} className={`py-20 sm:py-28 ${className}`}>
      <div className="section-shell">
        <div ref={headRef} className="reveal mb-12 sm:mb-16">
          <p className="section-kicker">
            <span aria-hidden="true">// </span>
            {kicker}
          </p>
          <h2 className="section-title">{title}</h2>
          {lead && <p className="mt-4 max-w-2xl text-lg text-slate-400">{lead}</p>}
        </div>
        {children}
      </div>
    </section>
  );
};

export default Section;
