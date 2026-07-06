import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Award, ExternalLink, Eye, X } from 'lucide-react';
import Section from './Section';
import { certifications, Certification } from '../data/portfolio';
import { useInView } from '../hooks/useInView';

const driveViewUrl = (id: string) => `https://drive.google.com/file/d/${id}/view`;
const drivePreviewUrl = (id: string) => `https://drive.google.com/file/d/${id}/preview`;

/**
 * Lightbox that embeds the certificate PDF via Google Drive's /preview
 * endpoint (the only Drive URL that allows iframe embedding). The page
 * stays visible behind the overlay.
 */
const CertModal = ({ cert, onClose }: { cert: Certification; onClose: () => void }) => {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  // Portal to <body>: ancestors animated with CSS transforms would otherwise
  // become the containing block for position:fixed and misplace the overlay.
  // No backdrop-filter here: blur on a fixed overlay above a cross-origin
  // iframe triggers a Chrome compositing bug where the browser hit-tests the
  // modal at a stale position — clicks on the close button silently fall
  // through to the iframe.
  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8 bg-ink-950/90"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Certificate: ${cert.title}`}
    >
      <div
        className="bg-ink-900 border border-white/10 rounded-xl w-full max-w-3xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-b border-white/10">
          <div className="min-w-0">
            <h3 className="font-semibold text-white truncate">{cert.title}</h3>
            <p className="text-xs text-slate-500">{cert.issuer}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {cert.driveId && (
              <a
                href={driveViewUrl(cert.driveId)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-accent transition-colors px-2 py-1.5"
              >
                <ExternalLink size={14} aria-hidden="true" /> Open in Drive
              </a>
            )}
            <button
              ref={closeRef}
              onClick={onClose}
              aria-label="Close certificate preview"
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>
        {cert.driveId && (
          <iframe
            src={drivePreviewUrl(cert.driveId)}
            title={`${cert.title} certificate preview`}
            className="w-full h-[65vh] bg-ink-900"
            allow="autoplay"
          />
        )}
      </div>
    </div>,
    document.body
  );
};

const Certifications = () => {
  const [active, setActive] = useState<Certification | null>(null);
  const ref = useInView();

  return (
    <Section
      id="certifications"
      kicker="05. certifications"
      title="Certifications"
      lead="Click any card to preview the certificate without leaving the page."
    >
      <div ref={ref} className="reveal grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {certifications.map((cert) => {
          const inner = (
            <>
              <div className="flex items-start justify-between gap-3">
                <Award className="w-6 h-6 text-accent shrink-0" aria-hidden="true" />
                {cert.driveId ? (
                  <span className="flex items-center gap-1 text-xs font-mono text-slate-500 group-hover:text-accent transition-colors">
                    <Eye size={13} aria-hidden="true" /> preview
                  </span>
                ) : cert.url ? (
                  <span className="flex items-center gap-1 text-xs font-mono text-slate-500 group-hover:text-accent transition-colors">
                    <ExternalLink size={13} aria-hidden="true" /> verify
                  </span>
                ) : null}
              </div>
              <h3 className="font-semibold text-white mt-4 leading-snug">{cert.title}</h3>
              <p className="text-sm text-slate-500 mt-1.5">{cert.issuer}</p>
            </>
          );

          const cardClass =
            'group glass rounded-xl p-6 text-left w-full h-full hover:border-accent/30 hover:-translate-y-1 transition-all duration-300';

          // Drive certs open the in-page modal; Islington verified certs must
          // open in a new tab — their site blocks iframe embedding.
          return cert.driveId ? (
            <button key={cert.title} onClick={() => setActive(cert)} className={cardClass}>
              {inner}
            </button>
          ) : cert.url ? (
            <a
              key={cert.title}
              href={cert.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${cardClass} block`}
            >
              {inner}
            </a>
          ) : (
            <div key={cert.title} className={`${cardClass} cursor-default`}>
              {inner}
            </div>
          );
        })}
      </div>

      {active && <CertModal cert={active} onClose={() => setActive(null)} />}
    </Section>
  );
};

export default Certifications;
