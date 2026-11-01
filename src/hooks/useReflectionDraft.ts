import { useCallback, useEffect, useRef, useState } from 'react';
import { services } from '../app/services';
import { toDateKey } from '../domain/dates';
import { EMPTY_ANSWERS, createEntry, isEntryEmpty } from '../domain/journal';
import type { DateKey, JournalEntry, Proverb, PromptKey, ReflectionAnswers } from '../domain/types';

export type SaveStatus = 'idle' | 'pending' | 'saved' | 'error';

const AUTOSAVE_DELAY_MS = 600;

interface Options {
  proverb: Proverb;
  /** Existing entry to edit, if any. */
  entry: JournalEntry | undefined;
  /** Daily date this reflection belongs to (null when journaling from Explore). */
  dailyDate: DateKey | null;
}

/**
 * Local editing state for one reflection, autosaved to the journal store.
 *
 * - Nothing is stored until the user writes something.
 * - Edits are debounced, then flushed immediately on unmount, tab hide or page unload.
 * - Clearing every field keeps the (now empty) entry; deletion is always explicit.
 */
export function useReflectionDraft({ proverb, entry, dailyDate }: Options) {
  const [answers, setAnswers] = useState<ReflectionAnswers>(entry?.answers ?? EMPTY_ANSWERS);
  const [notes, setNotes] = useState(entry?.notes ?? '');
  const [status, setStatus] = useState<SaveStatus>(entry ? 'saved' : 'idle');
  const [savedAt, setSavedAt] = useState<string | undefined>(entry?.updatedAt);
  const [createdAt, setCreatedAt] = useState<string | undefined>(entry?.createdAt);

  const entryIdRef = useRef<string | undefined>(entry?.id);
  const draftRef = useRef({ answers, notes });
  const dirtyRef = useRef(false);
  const timerRef = useRef<number | undefined>(undefined);

  const persist = useCallback(() => {
    window.clearTimeout(timerRef.current);
    if (!dirtyRef.current) return;
    dirtyRef.current = false;
    const draft = draftRef.current;
    const existing = entryIdRef.current ? services.journal.get(entryIdRef.current) : undefined;
    // The entry was deleted elsewhere (e.g. the delete button): never resurrect it.
    if (entryIdRef.current && !existing) return;

    try {
      // Don't create a record until there's something to keep. Existing entries
      // that are cleared are kept (empty) rather than silently deleted; empty
      // entries are hidden from the journal and can be removed explicitly.
      if (!existing && isEntryEmpty(draft)) {
        setStatus('idle');
        return;
      }
      const now = new Date();
      const next: JournalEntry = existing
        ? { ...existing, answers: { ...draft.answers }, notes: draft.notes, updatedAt: now.toISOString() }
        : createEntry({ proverb, dailyDate, writtenOn: toDateKey(now), now, answers: draft.answers, notes: draft.notes });
      services.journal.save(next);
      entryIdRef.current = next.id;
      setSavedAt(next.updatedAt);
      setCreatedAt(next.createdAt);
      setStatus('saved');
    } catch {
      dirtyRef.current = true; // keep the draft so a later edit can retry
      setStatus('error');
    }
  }, [proverb, dailyDate]);

  const schedule = useCallback(() => {
    dirtyRef.current = true;
    setStatus('pending');
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(persist, AUTOSAVE_DELAY_MS);
  }, [persist]);

  const setAnswer = useCallback(
    (key: PromptKey, value: string) => {
      setAnswers((prev) => {
        const next = { ...prev, [key]: value };
        draftRef.current = { ...draftRef.current, answers: next };
        return next;
      });
      schedule();
    },
    [schedule],
  );

  const updateNotes = useCallback(
    (value: string) => {
      setNotes(value);
      draftRef.current = { ...draftRef.current, notes: value };
      schedule();
    },
    [schedule],
  );

  // Flush on unmount and when the page is hidden or closed.
  useEffect(() => {
    const flush = () => persist();
    const onVisibility = () => document.visibilityState === 'hidden' && flush();
    window.addEventListener('pagehide', flush);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('pagehide', flush);
      document.removeEventListener('visibilitychange', onVisibility);
      flush();
    };
  }, [persist]);

  return { answers, notes, status, savedAt, createdAt, setAnswer, setNotes: updateNotes, flush: persist };
}
