import type { ReactNode } from 'react';
import { isEntryEmpty } from '../domain/journal';
import type { DateKey, JournalEntry, Proverb } from '../domain/types';
import { useJournalEntries } from '../hooks/useStores';
import { EntryCard } from './EntryCard';
import { ProverbCard } from './ProverbCard';
import { ReflectionJournal } from './ReflectionJournal';
import { MeaningSection, PracticeSection, TopicLinks } from './StudySections';

interface Props {
  proverb: Proverb;
  entry: JournalEntry | undefined;
  dailyDate: DateKey | null;
  /** Remount key for the editor (changes when the date/proverb context changes). */
  editorKey: string;
  label?: string;
  intro?: ReactNode;
}

/**
 * The full study experience: Scripture → meaning → practice → reflection.
 * Single column on mobile; on wide screens the reading stays on the left while
 * the journal sits alongside it.
 */
export function ProverbStudyView({ proverb, entry, dailyDate, editorKey, label, intro }: Props) {
  const entries = useJournalEntries();
  const history = entries.filter((e) => e.proverbId === proverb.id && e.id !== entry?.id && !isEntryEmpty(e));

  return (
    <div className="animate-rise">
      {intro}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-10">
        <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <ProverbCard proverb={proverb} label={label} />
          <MeaningSection proverb={proverb} />
          <PracticeSection proverb={proverb} />
          <TopicLinks proverb={proverb} />
        </div>

        <div className="space-y-6">
          <ReflectionJournal key={editorKey} proverb={proverb} entry={entry} dailyDate={dailyDate} />

          {history.length > 0 && (
            <section aria-labelledby={`history-${proverb.id}`}>
              <h2 id={`history-${proverb.id}`} className="eyebrow mb-3 px-1">
                Your earlier reflections on {proverb.reference}
              </h2>
              <ul className="space-y-3">
                {history.map((e) => (
                  <li key={e.id}>
                    <EntryCard entry={e} compact />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
