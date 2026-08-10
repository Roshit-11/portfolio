import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Download, ExternalLink, X } from 'lucide-react';
import { profile } from '../data/portfolio';

const resumeViewUrl = `https://drive.google.com/file/d/${profile.resumeDriveId}/view`;
const resumePreviewUrl = `https://drive.google.com/file/d/${profile.resumeDriveId}/preview`;
const resumeDownloadUrl = `https://drive.google.com/uc?export=download&id=${profile.resumeDriveId}`;

/** Lightbox embedding the resume PDF via Google Drive's /preview endpoint. */
const ResumeModal = ({ onClose }: { onClose: () => void }) => {
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
      aria-label="Resume preview"
    >
      <div
        className="bg-surface border border-line rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-b border-line">
          <div className="min-w-0">
            <h3 className="font-semibold text-ink truncate">Resume</h3>
            <p className="text-xs text-muted">{profile.name}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={resumeDownloadUrl}
              className="flex items-center gap-1.5 text-xs text-muted hover:text-accent transition-colors px-2 py-1.5"
            >
              <Download size={14} aria-hidden="true" /> Download
            </a>
            <a
              href={resumeViewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-muted hover:text-accent transition-colors px-2 py-1.5"
            >
              <ExternalLink size={14} aria-hidden="true" /> Open in Drive
            </a>
            <button
              ref={closeRef}
              onClick={onClose}
              aria-label="Close resume preview"
              className="p-2 rounded-lg text-ink-soft hover:text-ink hover:bg-paper transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>
        <iframe
          src={resumePreviewUrl}
          title="Resume preview"
          className="w-full h-[65vh] bg-paper"
          allow="autoplay"
        />
      </div>
    </div>,
    document.body
  );
};

export default ResumeModal;
