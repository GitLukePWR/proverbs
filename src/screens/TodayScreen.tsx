import { ArrowDown, ChevronLeft, ChevronRight, CircleCheck, PenLine, Signpost } from 'lucide-react';
import { useState, type ReactNode } from 'react';
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
import { useJournalEntries, usePreferences, useScenarioProgress } from '../hooks/useStores';
import { useToday } from '../hooks/useToday';

const scenarioCache = new Map<string, ReturnType<typeof getDailyScenario>>();
/** Selection is pure, so cache it rather than recomputing on every render. */
function getDailyScenarioMemo(date: string, proverbId: string) {
  const key = `${date}|${proverbId}`;
  let hit = scenarioCache.get(key);
  if (!hit) {
    hit = getDailyScenario(date, proverbId);
    scenarioCache.set(key, hit);
  }
  return hit;
}

export function TodayScreen() {
  const params = useParams();
  const today = useToday();
  const prefs = usePreferences();
  const entries = useJournalEntries();
  const navigate = useNavigate();
  const scenarioProgress = useScenarioProgress();
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
  const { scenario, matchesProverb } = getDailyScenarioMemo(date, proverb.id);
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
    <div className="mb-6 md:mb-8">
      <div className="flex items-center justify-between gap-3">
        <p className="eyebrow">{isToday ? 'Today' : 'Looking back'}</p>
        <nav aria-label="Change day" className="-mr-1 flex items-center gap-1">
          <Link to={`/day/${previous}`} className="icon-btn" aria-label={`Previous day, ${formatLongDate(previous)}`}>
            <ChevronLeft size={20} aria-hidden />
          </Link>
          {!isToday && (
            <Link to="/" className="btn-quiet">
              Today
            </Link>
          )}
          {isToday ? (
            <span className="icon-btn opacity-30" aria-hidden>
              <ChevronRight size={20} />
            </span>
          ) : (
            <Link to={nextHref} className="icon-btn" aria-label={`Next day, ${formatLongDate(next)}`}>
              <ChevronRight size={20} aria-hidden />
            </Link>
          )}
        </nav>
      </div>
      <h1 className="font-serif text-[1.9rem] leading-tight tracking-[-0.015em] text-forest md:text-[2.4rem]">
        <time dateTime={date}>{formatLongDate(date)}</time>
      </h1>
      {/* Shortcuts double as the day's completion status. */}
      <nav aria-label="On this page" className="mt-4 flex gap-2">
        <Shortcut
          target={`wisdom-${scenario.id}`}
          icon={<Signpost size={16} aria-hidden />}
          label="Wisdom in Action"
          done={!!scenarioProgress[scenario.id]}
          doneLabel="explored"
        />
        <Shortcut
          target="today-journal"
          icon={reflected ? <CircleCheck size={16} className="text-sage-deep" aria-hidden /> : <PenLine size={16} aria-hidden />}
          label={reflected ? 'Reflected' : 'Reflect'}
          done={reflected}
          doneLabel={isToday ? 'written today' : 'written'}
          hideCheck={reflected}
        />
      </nav>
    </div>
  );

  return (
    <ProverbStudyView
      proverb={proverb}
      entry={dayEntry}
      dailyDate={date}
      editorKey={editorKey}
      journalAnchorId="today-journal"
      activity={activity}
      prefill={prefill?.editorKey === editorKey ? prefill : null}
      label={isToday ? 'Proverb of the day' : 'Proverb for this day'}
      intro={intro}
    />
  );
}

/** Jump link to a section further down the page, showing whether it's done. */
function Shortcut({ target, icon, label, done, doneLabel, hideCheck = false }: { target: string; icon: ReactNode; label: string; done: boolean; doneLabel: string; hideCheck?: boolean }) {
  return (
    <button
      type="button"
      onClick={() => scrollToElement(target)}
      aria-label={done ? `${label}, ${doneLabel}` : `Jump to ${label}`}
      className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full border border-line bg-paper px-3 text-sm font-medium text-forest transition-colors hover:border-line-strong hover:bg-sage-wash/60 sm:flex-none sm:px-4"
    >
      {icon}
      <span className="truncate">{label}</span>
      {done ? (
        !hideCheck && <CircleCheck size={15} className="text-sage-deep" aria-hidden />
      ) : (
        <ArrowDown size={14} className="text-faint" aria-hidden />
      )}
    </button>
  );
}
