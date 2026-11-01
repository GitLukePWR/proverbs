import { ArrowUpRight, BookOpen, Check, ChevronDown, CircleCheck, Compass, PenLine, Signpost } from 'lucide-react';
import { useId, useRef } from 'react';
import { services } from '../app/services';
import { getTranslation } from '../content/translations';
import { formatShortDate, toDateKey } from '../domain/dates';
import { displayOptions, optionLetter, recordJournalPrompted, recordSelection, recordViewed } from '../domain/scenarios';
import type { Proverb, Scenario, ScenarioOptionId } from '../domain/types';
import { useScenarioProgress } from '../hooks/useStores';
import { useToast } from './Toast';

export type ScenarioContext =
  /** On Today, linked to the proverb shown that day. */
  | 'today'
  /** On Today, but drawn from the wider library (linked to a different proverb). */
  | 'today-other'
  /** On a proverb's own study page. */
  | 'study';

interface Props {
  scenario: Scenario;
  /** The proverb the scenario is linked to, resolved in the user's translation. */
  proverb: Proverb;
  context: ScenarioContext;
  /** Whether "today" wording applies (false when looking back at a past date). */
  isToday?: boolean;
  onRevisitProverb: () => void;
  onReflect: () => void;
}

/**
 * Wisdom in Action: situation → decision → consequences → Scripture →
 * optional reflection. Progress is saved as soon as an option is chosen and
 * can be changed at any time; alternatives stay open for review.
 */
export function WisdomInAction({ scenario, proverb, context, isToday = true, onRevisitProverb, onReflect }: Props) {
  const progressMap = useScenarioProgress();
  const progress = progressMap[scenario.id];
  const toast = useToast();
  const baseId = useId();
  const revealRef = useRef<HTMLDivElement>(null);
  const options = displayOptions(scenario);
  const selected = progress?.selectedOptionId;
  const selectedIndex = options.findIndex((o) => o.id === selected);
  const selectedOption = options[selectedIndex];
  const translation = getTranslation(proverb.translationId);

  const save = (update: () => Parameters<typeof services.scenarioProgress.save>[0]) => {
    try {
      services.scenarioProgress.save(update());
      return true;
    } catch {
      toast('Couldn’t save your progress — browser storage is unavailable');
      return false;
    }
  };

  const choose = (id: ScenarioOptionId) => {
    if (id === selected) return;
    const first = !progress;
    const now = new Date();
    if (save(() => recordSelection(progress, scenario, id, now, toDateKey(now))) && first) {
      // Bring the newly revealed consequences into view without a jarring jump.
      requestAnimationFrame(() => {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        revealRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest' });
      });
    }
  };

  const markViewed = (id: ScenarioOptionId, open: boolean) => {
    if (open && progress && !progress.viewedOptionIds.includes(id)) save(() => recordViewed(progress, id, new Date()));
  };

  const reflect = () => {
    if (progress) save(() => recordJournalPrompted(progress, new Date()));
    onReflect();
  };

  const intro =
    context === 'study'
      ? 'Explore how this wisdom applies to a real-life decision.'
      : `Explore how ${isToday ? 'today’s' : 'this day’s'} wisdom applies to real-life decisions.`;

  return (
    <section id={`wisdom-${scenario.id}`} aria-labelledby={`${baseId}-title`} className="card scroll-mt-24 overflow-hidden">
      <header className="px-5 pt-6 md:px-8 md:pt-7">
        <div className="flex items-center gap-2">
          <Signpost size={16} className="text-sage-deep" aria-hidden />
          <h2 id={`${baseId}-title`} className="eyebrow">
            Wisdom in Action
          </h2>
          {progress && (
            <span className="ml-auto inline-flex items-center gap-1 text-xs text-sage-deep">
              <CircleCheck size={14} aria-hidden /> Explored
            </span>
          )}
        </div>
        <p className="mt-2 text-[0.98rem] leading-relaxed text-muted">{intro}</p>
        {context === 'today-other' && (
          <p className="mt-3 flex gap-2 rounded-xl border border-line bg-cream/60 px-3.5 py-2.5 text-sm text-muted">
            <Compass size={16} className="mt-0.5 shrink-0 text-sage-deep" aria-hidden />
            <span>
              {isToday ? 'Today’s' : 'This day’s'} proverb doesn’t have a scenario yet, so this one draws on{' '}
              <strong className="font-semibold text-forest">{proverb.reference}</strong>.
            </span>
          </p>
        )}
      </header>

      {/* Stage 1: the situation */}
      <div className="mx-3 mt-5 rounded-2xl bg-sage-wash/70 px-5 py-6 md:mx-5 md:px-7">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-sage-deep">
          The situation <span aria-hidden>·</span> <span className="normal-case tracking-normal">{proverb.reference}</span>
        </p>
        <h3 className="mt-2 font-serif text-[1.45rem] leading-tight text-forest md:text-[1.6rem]">{scenario.title}</h3>
        <p className="prose-body mt-3 text-ink/90 text-pretty">{scenario.situation}</p>
        <p className="mt-4 font-serif text-lg italic text-forest" id={`${baseId}-question`}>
          {scenario.question}
        </p>
      </div>

      {/* Stage 2: make a decision */}
      <div className="px-3 pt-4 md:px-5">
        <ul role="group" aria-labelledby={`${baseId}-question`} className="space-y-2.5">
          {options.map((option, index) => {
            const isSelected = option.id === selected;
            return (
              <li key={option.id}>
                <button
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => choose(option.id)}
                  className={`group flex w-full items-start gap-4 rounded-2xl border px-4 py-4 text-left transition-colors duration-200 md:px-5 ${
                    isSelected
                      ? 'border-forest bg-paper shadow-[inset_0_0_0_1px_var(--color-forest)]'
                      : 'border-line bg-paper hover:border-line-strong hover:bg-cream/50'
                  }`}
                >
                  <span
                    aria-hidden
                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border font-serif text-[0.95rem] transition-colors ${
                      isSelected ? 'border-forest bg-forest text-cream' : 'border-line-strong text-forest group-hover:border-forest'
                    }`}
                  >
                    {isSelected ? <Check size={15} strokeWidth={2.5} /> : optionLetter(index)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="sr-only">Option {optionLetter(index)}: </span>
                    <span className="block font-medium leading-snug text-ink">{option.label}</span>
                    <span className="mt-1 block text-[0.93rem] leading-relaxed text-muted">{option.detail}</span>
                    {isSelected && <span className="mt-2 inline-block text-xs font-medium text-sage-deep">Your choice</span>}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        {!selectedOption && <p className="px-2 pb-6 pt-3 text-xs text-faint">Choose the response closest to what you’d really do. You can change it later.</p>}
      </div>

      {/* Stages 3–5 are revealed only after a choice is made. */}
      <div ref={revealRef} aria-live="polite" className="scroll-mt-24">
        {selectedOption && progress && (
          <div key={selectedOption.id} className="animate-rise space-y-7 px-5 pb-7 pt-6 md:px-8">
            {/* Stage 3: consequences */}
            <section aria-labelledby={`${baseId}-outcome`}>
              <h3 id={`${baseId}-outcome`} className="eyebrow">
                How this might play out
              </h3>
              <p className="mt-1 text-sm font-medium text-forest">
                {optionLetter(selectedIndex)}. {selectedOption.label}
              </p>
              <p className="prose-body mt-3 border-l-2 border-sage pl-4 text-ink/90 text-pretty">{selectedOption.feedback}</p>
            </section>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-ink">Compare the other responses</h3>
              {options.map((option, index) =>
                option.id === selectedOption.id ? null : (
                  <details
                    key={option.id}
                    className="group rounded-xl border border-line bg-cream/40"
                    onToggle={(e) => markViewed(option.id, (e.currentTarget as HTMLDetailsElement).open)}
                  >
                    <summary className="flex cursor-pointer list-none items-start gap-3 px-4 py-3 text-[0.95rem] text-ink [&::-webkit-details-marker]:hidden">
                      <span className="mt-0.5 font-serif text-sage-deep" aria-hidden>
                        {optionLetter(index)}.
                      </span>
                      <span className="flex-1">
                        <span className="sr-only">Option {optionLetter(index)}: </span>
                        {option.label}
                      </span>
                      <ChevronDown size={16} className="mt-1 shrink-0 text-faint transition-transform duration-300 group-open:rotate-180" aria-hidden />
                    </summary>
                    <p className="px-4 pb-4 pl-10 text-[0.95rem] leading-relaxed text-muted">{option.feedback}</p>
                  </details>
                ),
              )}
              <p className="text-xs text-faint">Changed your mind? Choose a different response above — your journal won’t be affected.</p>
            </div>

            <section aria-labelledby={`${baseId}-wiser`} className="rounded-2xl bg-forest px-5 py-5 text-cream md:px-6">
              <h3 id={`${baseId}-wiser`} className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-sage">
                A wiser way through
              </h3>
              <p className="mt-2.5 text-[1.02rem] leading-relaxed text-cream/95 text-pretty">{scenario.wiserPath}</p>
            </section>

            {/* Stage 4: connect to Scripture */}
            <section aria-labelledby={`${baseId}-scripture`}>
              <h3 id={`${baseId}-scripture`} className="eyebrow">
                In Scripture
              </h3>
              <figure className="mt-3 rounded-2xl border border-line bg-paper px-5 py-5">
                <blockquote className="font-serif text-[1.2rem] leading-relaxed text-ink">
                  {proverb.verses.map((v, i) => (
                    <span key={v.number}>
                      {proverb.verses.length > 1 && (
                        <sup className="mr-1 font-sans text-[0.55em] font-semibold text-sage-deep">{v.number}</sup>
                      )}
                      {v.text}
                      {i < proverb.verses.length - 1 ? ' ' : ''}
                    </span>
                  ))}
                </blockquote>
                <figcaption className="mt-3 text-xs text-muted">
                  <span className="font-medium text-forest">{proverb.reference}</span> · {translation.name}
                </figcaption>
              </figure>
              <p className="mt-4 text-[0.98rem] leading-relaxed text-ink/85">{scenario.connection}</p>
              <p className="mt-2 text-xs text-faint">Scenario and commentary written for Wize. The Scripture above is the biblical text.</p>
            </section>

            {/* Stage 5: optional reflection */}
            <section aria-labelledby={`${baseId}-further`} className="rounded-2xl border border-dashed border-line-strong px-5 py-4">
              <h3 id={`${baseId}-further`} className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted">
                Take it further <span className="font-normal normal-case tracking-normal">· optional</span>
              </h3>
              <p className="mt-1.5 font-serif text-[1.1rem] leading-snug text-forest">{scenario.followUp}</p>
            </section>

            {/* Completion */}
            <div className="flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="flex items-center gap-2 font-serif text-xl text-forest">
                  <CircleCheck size={20} className="text-sage-deep" aria-hidden /> Wisdom explored
                </p>
                <p className="mt-0.5 text-xs text-muted">
                  First explored {formatShortDate(progress.completedOn)}
                  {progress.journalPrompted && ' · taken to your journal'}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" className="btn-quiet" onClick={onRevisitProverb}>
                  <BookOpen size={16} aria-hidden /> Revisit the proverb
                  {context === 'today-other' && <ArrowUpRight size={14} aria-hidden />}
                </button>
                <button type="button" className="btn-primary" onClick={reflect}>
                  <PenLine size={16} aria-hidden /> Reflect in your journal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
