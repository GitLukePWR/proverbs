import { AlertCircle, Check, Loader } from 'lucide-react';
import { formatTime } from '../domain/dates';
import type { SaveStatus } from '../hooks/useReflectionDraft';

export function SaveIndicator({ status, savedAt }: { status: SaveStatus; savedAt?: string }) {
  let content;
  if (status === 'pending') {
    content = (
      <>
        <Loader size={13} className="animate-spin motion-reduce:animate-none" aria-hidden /> Saving…
      </>
    );
  } else if (status === 'saved' && savedAt) {
    content = (
      <>
        <Check size={13} className="text-sage-deep" aria-hidden /> Saved on this device · {formatTime(savedAt)}
      </>
    );
  } else if (status === 'error') {
    content = (
      <span className="inline-flex items-center gap-1.5 text-clay">
        <AlertCircle size={13} aria-hidden /> Not saved yet — browser storage is full or blocked. Retrying; keep this tab open.
      </span>
    );
  } else {
    content = <>Autosaves as you write</>;
  }
  return (
    <p role="status" aria-live="polite" className="inline-flex items-center gap-1.5 text-xs text-muted">
      {content}
    </p>
  );
}
