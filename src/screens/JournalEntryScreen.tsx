import { ArrowUpRight, FileQuestion, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { services } from '../app/services';
import { getProverb } from '../content/library';
import { getTranslation } from '../content/translations';
import { BackLink } from '../components/BackLink';
import { EmptyState } from '../components/EmptyState';
import { ReflectionJournal } from '../components/ReflectionJournal';
import { MeaningSection } from '../components/StudySections';
import { useToast } from '../components/Toast';
import { formatLongDate } from '../domain/dates';
import { entryDay } from '../domain/journal';
import type { Proverb } from '../domain/types';
import { useJournalEntries } from '../hooks/useStores';

export function JournalEntryScreen() {
  const { id = '' } = useParams();
  const entries = useJournalEntries();
  const navigate = useNavigate();
  const toast = useToast();
  const [confirming, setConfirming] = useState(false);
  const entry = entries.find((e) => e.id === id);

  if (!entry) {
    return (
      <EmptyState icon={<FileQuestion size={22} />} title="Entry not found" action={<Link to="/journal" className="btn-primary">Back to journal</Link>}>
        It may have been deleted, or it was written in a different browser.
      </EmptyState>
    );
  }

  // Prefer the live study (for the explanation); fall back to the snapshot saved with the entry.
  const live = getProverb(entry.proverbId, entry.snapshot.translationId);
  const proverb: Proverb = live
    ? { ...live, prompts: entry.snapshot.prompts }
    : {
        id: entry.proverbId,
        book: 'Proverbs',
        chapter: 0,
        verseStart: 0,
        reference: entry.proverbReference,
        translationId: entry.snapshot.translationId,
        verses: [{ number: 0, text: entry.snapshot.text }],
        text: entry.snapshot.text,
        meaning: '',
        practice: '',
        prompts: entry.snapshot.prompts,
        topics: [],
      };
  const day = entryDay(entry);

  const remove = () => {
    try {
      services.journal.remove(entry.id);
      toast('Entry deleted');
      navigate('/journal', { replace: true });
    } catch {
      toast('Could not delete — browser storage is unavailable');
    }
  };

  return (
    <div className="mx-auto max-w-3xl animate-rise">
      <BackLink fallback="/journal" label="Journal" />

      <header className="mb-6">
        <p className="eyebrow mb-1.5">{entry.dailyDate ? 'Daily reflection' : 'Reflection from Explore'}</p>
        <h1 className="font-serif text-[2rem] leading-tight tracking-[-0.015em] text-forest md:text-[2.4rem]">
          {entry.proverbReference}
        </h1>
        <p className="mt-1 text-sm text-muted">
          <time dateTime={day}>{formatLongDate(day)}</time>
        </p>
      </header>

      <div className="space-y-6">
        <figure className="card px-6 py-6 md:px-8">
          <blockquote className="scripture text-[1.3rem] text-ink md:text-[1.45rem]">{entry.snapshot.text}</blockquote>
          <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
            <span>
              {entry.proverbReference} · {getTranslation(entry.snapshot.translationId).name}
            </span>
            {live && (
              <Link
                to={entry.dailyDate ? `/day/${entry.dailyDate}` : `/proverb/${live.id}`}
                className="inline-flex min-h-11 items-center gap-1 font-medium text-forest hover:underline"
              >
                Open full study <ArrowUpRight size={14} aria-hidden />
              </Link>
            )}
          </figcaption>
        </figure>

        {live && <MeaningSection proverb={live} />}

        <ReflectionJournal key={entry.id} proverb={proverb} entry={entry} dailyDate={entry.dailyDate} prompts={entry.snapshot.prompts} />

        <div className="rounded-2xl border border-line px-5 py-4">
          {confirming ? (
            <div className="flex flex-wrap items-center justify-between gap-3" role="alertdialog" aria-labelledby="delete-confirm">
              <p id="delete-confirm" className="text-sm text-ink">
                Delete this reflection permanently? This can’t be undone.
              </p>
              <div className="flex gap-2">
                <button type="button" className="btn-quiet" onClick={() => setConfirming(false)} autoFocus>
                  Keep it
                </button>
                <button type="button" className="btn-danger" onClick={remove}>
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <button type="button" className="inline-flex min-h-11 items-center gap-2 text-sm text-clay hover:underline" onClick={() => setConfirming(true)}>
              <Trash2 size={15} aria-hidden /> Delete this entry
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
