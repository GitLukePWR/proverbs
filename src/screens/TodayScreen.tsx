import { ChevronLeft, ChevronRight, CircleCheck, CircleDashed } from 'lucide-react';
import { useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router';
import { getDailyProverbId, getProverb } from '../content/library';
import { ProverbStudyView } from '../components/ProverbStudyView';
import type { JournalPrefill } from '../components/ReflectionJournal';
import { WisdomInAction } from '../components/WisdomInAction';
import { getDailyScenario } from '../content/scenarioLibrary';
import { journalStarter } from '../domain/scenarios';
import { scrollToElement } from '../platform/scroll';
import { addDays, compareDateKeys, formatLongDate, isValidDateKey } from '../domain/dates';
import { isEntryEmpty } from '../domain/journal';
import { useJournalEntries, usePreferences } from '../hooks/useStores';
import { useToday } from '../hooks/useToday';

export function TodayScreen() {
  const params = useParams();
  const today = useToday();
  const prefs = usePreferences();
  const entries = useJournalEntries();
  const navigate = useNavigate();
  // Prefill requests are tied to the editor they were made for, so moving to
  // another day never carries one across.
  const [prefill, setPrefill] = useState<(JournalPrefill & { editorKey: string }) | null>(null);

  const requested = params.date;
  if (requested !== undefined && (!isValidDateKey(requested) || compareDateKeys(requested, today) > 0)) {
    return <Navigate to="/" replace />;
  }
  if (requested === today) return <Navigate to="/" replace />;

  const date = requested ?? today;
  const isToday = date === today;

  // An existing entry pins the proverb for that date, so history stays intact
  // even if the library (and therefore the daily rotation) changes later.
  const dayEntry = entries.find((e) => e.dailyDate === date && getProverb(e.proverbId));
  const proverbId = dayEntry?.proverbId ?? getDailyProverbId(date);
  const proverb = getProverb(proverbId, prefs.translationId);
  if (!proverb) return null; // unreachable: daily IDs come from the library

  const editorKey = `daily-${date}-${proverb.id}`;
  const { scenario, matchesProverb } = getDailyScenario(date, proverb.id);
  const scenarioProverb = matchesProverb ? proverb : getProverb(scenario.proverbId, prefs.translationId);

  const activity = scenarioProverb && (
    <WisdomInAction
      key={scenario.id}
      scenario={scenario}
      proverb={scenarioProverb}
      context={matchesProverb ? 'today' : 'today-other'}
      isToday={isToday}
      onRevisitProverb={() =>
        matchesProverb ? scrollToElement(`proverb-${proverb.id}`, { focus: true }) : navigate(`/proverb/${scenario.proverbId}`)
      }
      onReflect={() =>
        matchesProverb
          ? setPrefill({ key: 'reflect', text: journalStarter(scenario), nonce: Date.now(), editorKey })
          : navigate(`/proverb/${scenario.proverbId}`, { state: { reflectOnScenario: scenario.id } })
      }
    />
  );

  const reflected = !!dayEntry && !isEntryEmpty(dayEntry);
  const previous = addDays(date, -1);
  const next = addDays(date, 1);
  const nextHref = next === today ? '/' : `/day/${next}`;

  const intro = (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4 md:mb-8">
      <div>
        <p className="eyebrow mb-1.5">{isToday ? 'Today' : 'Looking back'}</p>
        <h1 className="font-serif text-[1.9rem] leading-tight tracking-[-0.015em] text-forest md:text-[2.4rem]">
          <time dateTime={date}>{formatLongDate(date)}</time>
        </h1>
        <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted">
          {reflected ? (
            <>
              <CircleCheck size={15} className="text-sage-deep" aria-hidden /> You’ve reflected on {isToday ? 'today’s' : 'this'} proverb
            </>
          ) : (
            <>
              <CircleDashed size={15} aria-hidden /> {isToday ? 'Not yet reflected on today' : 'No reflection for this day'}
            </>
          )}
        </p>
      </div>
      <nav aria-label="Change day" className="flex items-center gap-1">
        <Link to={`/day/${previous}`} className="icon-btn border border-line" aria-label={`Previous day, ${formatLongDate(previous)}`}>
          <ChevronLeft size={18} aria-hidden />
        </Link>
        {!isToday && (
          <Link to="/" className="btn-quiet h-10">
            Today
          </Link>
        )}
        {isToday ? (
          <span className="icon-btn border border-line opacity-35" aria-hidden>
            <ChevronRight size={18} />
          </span>
        ) : (
          <Link to={nextHref} className="icon-btn border border-line" aria-label={`Next day, ${formatLongDate(next)}`}>
            <ChevronRight size={18} aria-hidden />
          </Link>
        )}
      </nav>
    </div>
  );

  return (
    <ProverbStudyView
      proverb={proverb}
      entry={dayEntry}
      dailyDate={date}
      editorKey={editorKey}
      activity={activity}
      prefill={prefill?.editorKey === editorKey ? prefill : null}
      label={isToday ? 'Proverb of the day' : 'Proverb for this day'}
      intro={intro}
    />
  );
}
