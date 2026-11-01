import type { ReactNode } from 'react';
import { isEntryEmpty } from '../domain/journal';
import type { DateKey, JournalEntry, Proverb } from '../domain/types';
import { useJournalEntries } from '../hooks/useStores';
import { EntryCard } from './EntryCard';
import { ProverbCard } from './ProverbCard';
import { ReflectionJournal, type JournalPrefill } from './ReflectionJournal';
import { MeaningSection, PracticeSection, TopicLinks } from './StudySections';

interface Props {
  proverb: Proverb;
  entry: JournalEntry | undefined;
  dailyDate: DateKey | null;
  /** Remount key for the editor (changes when the date/proverb context changes). */
  editorKey: string;
  label?: string;
  intro?: ReactNode;
  /** Wisdom in Action (or other activity) shown after the study, before the journal. */
  activity?: ReactNode;
  prefill?: JournalPrefill | null;
  /** The proverb reference is the page's h1 when nothing else is. */
  cardHeading?: 'h1' | 'h2';
  /** id for the journal section, so shortcuts can jump to it. */
  journalAnchorId?: string;
}

/**
 * The full study experience: Scripture → meaning → practice → reflection.
 * One centred reading column at every size, in order: Scripture → meaning →
 * practice → activity (Wisdom in Action) → journal. Wide screens get more
 * whitespace rather than wider lines.
 */
export function ProverbStudyView({ proverb, entry, dailyDate, editorKey, label, intro, activity, prefill, cardHeading = 'h2', journalAnchorId }: Props) {
  const entries = useJournalEntries();
  const history = entries.filter((e) => e.proverbId === proverb.id && e.id !== entry?.id && !isEntryEmpty(e));

  return (
    <div className="animate-rise mx-auto max-w-[44rem]">
      {intro}
      <div className="space-y-6 md:space-y-8">
        <ProverbCard proverb={proverb} label={label} headingLevel={cardHeading} />
        <MeaningSection proverb={proverb} />
        <PracticeSection proverb={proverb} />
        <TopicLinks proverb={proverb} />
        {activity}
        <ReflectionJournal key={editorKey} proverb={proverb} entry={entry} dailyDate={dailyDate} prefill={prefill} anchorId={journalAnchorId} />

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
  );
}
