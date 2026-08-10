import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Award, ExternalLink, Eye, X } from 'lucide-react';
import Section from './Section';
import { certifications, Certification } from '../data/portfolio';
import { useInView } from '../hooks/useInView';
import { ACCENTS } from '../data/accents';

const driveViewUrl = (id: string) => `https://drive.google.com/file/d/${id}/view`;
const drivePreviewUrl = (id: string) => `https://drive.google.com/file/d/${id}/preview`;

/** Lightbox embedding the certificate PDF via Google Drive's /preview endpoint. */
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

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8 bg-ink-950/80"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Certificate: ${cert.title}`}
    >
      <div
        className="bg-surface border border-line rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-b border-line">
          <div className="min-w-0">
            <h3 className="font-semibold text-ink truncate">{cert.title}</h3>
            <p className="text-xs text-muted">{cert.issuer}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {cert.driveId && (
              <a
                href={driveViewUrl(cert.driveId)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-muted hover:text-accent transition-colors px-2 py-1.5"
              >
                <ExternalLink size={14} aria-hidden="true" /> Open in Drive
              </a>
            )}
            <button
              ref={closeRef}
              onClick={onClose}
              aria-label="Close certificate preview"
              className="p-2 rounded-lg text-ink-soft hover:text-ink hover:bg-paper transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>
        {cert.driveId && (
          <iframe
            src={drivePreviewUrl(cert.driveId)}
            title={`${cert.title} certificate preview`}
            className="w-full h-[65vh] bg-paper"
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
      title="Certified & verified."
      lead="Click any card to preview the certificate without leaving the page."
      companion={{ msg: '// the receipts', accent: '#6B7D1A' }}
    >
      <div ref={ref} className="reveal-stagger grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {certifications.map((cert, i) => {
          const accent = ACCENTS[i % ACCENTS.length];
          const inner = (
            <>
              <div className="scanner-glare-effect" />
              <div className="flex items-start justify-between gap-3">
                <span
                  className="grid place-items-center w-11 h-11 rounded-xl shrink-0"
                  style={{ backgroundColor: `${accent}1a`, color: accent }}
                >
                  <Award className="w-5 h-5" aria-hidden="true" />
                </span>
                {cert.driveId ? (
                  <span className="flex items-center gap-1 text-xs font-medium text-accent">
                    <Eye size={13} aria-hidden="true" /> preview
                  </span>
                ) : cert.url ? (
                  <span className="flex items-center gap-1 text-xs font-medium text-accent">
                    <ExternalLink size={13} aria-hidden="true" /> verify
                  </span>
                ) : null}
              </div>
              <h3 className="card-title mt-4">{cert.title}</h3>
              <p className="card-body mt-1.5">{cert.issuer}</p>
            </>
          );

          const cardClass = 'group card p-6 card-interactive text-left w-full h-full';

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
