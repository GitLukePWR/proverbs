import { Lock, PenLine } from 'lucide-react';
import { useEffect, useId, useRef } from 'react';
import { formatDateTime } from '../domain/dates';
import { PROMPT_LABELS } from '../domain/journal';
import type { DateKey, JournalEntry, PromptKey, Proverb, ReflectionPrompts } from '../domain/types';
import { PROMPT_KEYS } from '../domain/types';
import { useReflectionDraft } from '../hooks/useReflectionDraft';
import { AutoTextarea } from './AutoTextarea';
import { SaveIndicator } from './SaveIndicator';
import { useToast } from './Toast';

/** A request to start an answer with some text. Applied only if that answer is empty. */
export interface JournalPrefill {
  key: PromptKey;
  text: string;
  /** Changes for each new request, so repeated clicks re-focus the field. */
  nonce: number;
}

interface Props {
  proverb: Proverb;
  entry: JournalEntry | undefined;
  dailyDate: DateKey | null;
  /** Prompts to show; defaults to the proverb's. Past entries pass their snapshot. */
  prompts?: ReflectionPrompts;
  title?: string;
  prefill?: JournalPrefill | null;
  anchorId?: string;
}

/**
 * Guided reflection: the three prompts, each with its own answer field, plus
 * free notes. Autosaves to the device. Remount (via `key`) to switch entries.
 */
export function ReflectionJournal({ proverb, entry, dailyDate, prompts = proverb.prompts, title = 'Your Reflection', prefill, anchorId }: Props) {
  const draft = useReflectionDraft({ proverb, entry, dailyDate });
  const baseId = useId();
  const toast = useToast();
  const sectionRef = useRef<HTMLElement>(null);
  const answersRef = useRef(draft.answers);
  answersRef.current = draft.answers;
  const { setAnswer } = draft;

  // Start the requested answer with the given text, but never overwrite what
  // the user has already written. Either way, bring them to the field.
  useEffect(() => {
    if (!prefill) return;
    const existing = answersRef.current[prefill.key];
    const applied = !existing.trim();
    if (applied) setAnswer(prefill.key, prefill.text);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    sectionRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    const field = document.getElementById(`${baseId}-${prefill.key}`) as HTMLTextAreaElement | null;
    window.setTimeout(() => {
      if (!field) return;
      field.focus({ preventScroll: true });
      const end = field.value.length;
      field.setSelectionRange(end, end);
    }, reduce ? 0 : 350);
    if (!applied) toast('Your existing reflection was kept as it is');
    // Only react to new requests.
  }, [prefill?.nonce]);

  return (
    <section ref={sectionRef} id={anchorId} aria-labelledby={`${baseId}-title`} className="card scroll-mt-24 px-5 py-6 md:px-8 md:py-8">
      <header className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        <div>
          <div className="flex items-center gap-2">
            <PenLine size={16} className="text-sage-deep" aria-hidden />
            <h2 id={`${baseId}-title`} className="eyebrow">
              {title}
            </h2>
          </div>
          <p className="mt-2 font-serif text-xl text-forest md:text-[1.4rem]">Sit with it for a few minutes.</p>
        </div>
        <SaveIndicator status={draft.status} savedAt={draft.savedAt} />
      </header>

      <ol className="mt-7 space-y-7">
        {PROMPT_KEYS.map((key, index) => {
          const fieldId = `${baseId}-${key}`;
          return (
            <li key={key}>
              <label htmlFor={fieldId} className="block">
                <span className="flex items-baseline gap-2">
                  <span className="font-serif text-sm italic text-sage-deep" aria-hidden>
                    {index + 1}.
                  </span>
                  <span className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted">{PROMPT_LABELS[key]}</span>
                </span>
                <span className="mt-1.5 block text-[1.02rem] leading-snug text-ink text-pretty">{prompts[key]}</span>
              </label>
              <AutoTextarea
                id={fieldId}
                rows={3}
                value={draft.answers[key]}
                onChange={(e) => draft.setAnswer(key, e.target.value)}
                onBlur={draft.flush}
                placeholder="Write freely…"
                className="field mt-3 min-h-[6.5rem] resize-none leading-relaxed"
              />
            </li>
          );
        })}
        <li>
          <label htmlFor={`${baseId}-notes`} className="block">
            <span className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted">Anything else</span>
            <span className="mt-1.5 block text-[0.95rem] text-muted">A prayer, a reminder, or whatever is on your mind. Optional.</span>
          </label>
          <AutoTextarea
            id={`${baseId}-notes`}
            rows={2}
            value={draft.notes}
            onChange={(e) => draft.setNotes(e.target.value)}
            onBlur={draft.flush}
            placeholder="Notes"
            className="field mt-3 min-h-[4.5rem] resize-none leading-relaxed"
          />
        </li>
      </ol>

      <footer className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-4 text-xs text-faint">
        <span className="inline-flex items-center gap-1.5">
          <Lock size={12} aria-hidden /> Private to this device
        </span>
        {draft.createdAt && (
          <span>
            Started {formatDateTime(draft.createdAt)}
            {draft.savedAt && draft.savedAt !== draft.createdAt && <> · edited {formatDateTime(draft.savedAt)}</>}
          </span>
        )}
      </footer>
    </section>
  );
}
