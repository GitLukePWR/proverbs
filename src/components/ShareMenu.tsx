import { Share } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { buildShareText } from '../domain/share';
import type { Proverb } from '../domain/types';
import { appUrl, shareText } from '../platform/share';
import { useToast } from './Toast';

/** Share a proverb (optionally with its modern meaning). Journal text is never included. */
export function ShareMenu({ proverb }: { proverb: Proverb }) {
  const [open, setOpen] = useState(false);
  const toast = useToast();
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const firstItemRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    firstItemRef.current?.focus();
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const share = async (includeMeaning: boolean) => {
    setOpen(false);
    const outcome = await shareText({
      title: proverb.reference,
      text: buildShareText(proverb, { includeMeaning, url: appUrl() }),
    });
    if (outcome === 'copied') toast('Copied to clipboard');
    if (outcome === 'unavailable') toast('Sharing isn’t available in this browser');
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        className="icon-btn"
        aria-label={`Share ${proverb.reference}`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((o) => !o)}
      >
        <Share size={19} strokeWidth={1.75} aria-hidden />
      </button>
      {open && (
        <div
          id={menuId}
          role="menu"
          className="animate-rise absolute right-0 top-11 z-20 w-60 overflow-hidden rounded-2xl border border-line bg-paper p-1.5 shadow-[0_16px_40px_-20px_rgba(29,39,33,0.35)]"
        >
          <button ref={firstItemRef} role="menuitem" type="button" onClick={() => share(false)} className="w-full rounded-xl px-3 py-2.5 text-left text-sm text-ink hover:bg-sage-wash focus-visible:bg-sage-wash">
            Share verse
            <span className="block text-xs text-muted">Reference and Scripture text</span>
          </button>
          <button role="menuitem" type="button" onClick={() => share(true)} className="w-full rounded-xl px-3 py-2.5 text-left text-sm text-ink hover:bg-sage-wash focus-visible:bg-sage-wash">
            Share with meaning
            <span className="block text-xs text-muted">Adds the “In Today’s Words” summary</span>
          </button>
          <p className="px-3 pb-1.5 pt-1 text-[0.7rem] leading-snug text-faint">Your journal is never included.</p>
        </div>
      )}
    </div>
  );
}
