import { cycleOrder } from './daily';
import { addDays, dayNumber } from './dates';
import type { DateKey, Scenario, ScenarioOption, ScenarioOptionId, ScenarioProgress } from './types';

/* ------------------------------------------------------------------ */
/* Daily selection                                                     */
/* ------------------------------------------------------------------ */

export interface DailyScenario {
  scenario: Scenario;
  /** True when the scenario is linked to the proverb shown that day. */
  matchesProverb: boolean;
}

/** How far back the no-repeat check looks before falling back to a raw pick. */
const LOOKBACK = 6;

/**
 * Deterministically choose the Wisdom in Action scenario for a date.
 *
 * 1. If the day's proverb has linked scenarios, use one of them (rotating by
 *    day if several exist).
 * 2. Otherwise draw from the whole library using a seeded per-cycle shuffle
 *    (the same technique as the daily proverb).
 * 3. Either way, avoid repeating the previous day's scenario when another
 *    choice exists (and, on fallback days, avoid the scenario tomorrow's
 *    proverb will use).
 *
 * `proverbForDate` supplies the proverb shown on any date, so the function
 * stays pure and testable and honours proverbs pinned by journal entries.
 */
export function selectDailyScenario(
  scenarios: readonly Scenario[],
  date: DateKey,
  proverbForDate: (date: DateKey) => string,
): DailyScenario {
  if (scenarios.length === 0) throw new Error('Cannot select from an empty scenario library');
  return pick(scenarios, date, proverbForDate, LOOKBACK);
}

function pick(
  scenarios: readonly Scenario[],
  date: DateKey,
  proverbForDate: (date: DateKey) => string,
  depth: number,
): DailyScenario {
  const day = dayNumber(date);
  const previous = depth > 0 ? pick(scenarios, addDays(date, -1), proverbForDate, depth - 1).scenario.id : undefined;

  const linked = scenarios.filter((s) => s.proverbId === proverbForDate(date));
  if (linked.length > 0) {
    const ordered = rotate(linked, day % linked.length);
    const chosen = ordered.find((s) => s.id !== previous) ?? (ordered[0] as Scenario);
    return { scenario: chosen, matchesProverb: true };
  }

  const ids = scenarios.map((s) => s.id);
  const cycle = Math.floor(day / ids.length);
  const position = day - cycle * ids.length;
  const ordered = rotate(cycleOrder(ids, cycle), position);
  // Also step around scenarios that tomorrow's proverb will claim, so a linked
  // scenario never appears the day before its own proverb.
  const tomorrowsLinked = new Set(
    scenarios.filter((s) => s.proverbId === proverbForDate(addDays(date, 1))).map((s) => s.id),
  );
  const chosenId =
    ordered.find((id) => id !== previous && !tomorrowsLinked.has(id)) ??
    ordered.find((id) => id !== previous) ??
    (ordered[0] as string);
  return { scenario: scenarios.find((s) => s.id === chosenId) as Scenario, matchesProverb: false };
}

function rotate<T>(items: readonly T[], by: number): T[] {
  return [...items.slice(by), ...items.slice(0, by)];
}

/* ------------------------------------------------------------------ */
/* Option presentation                                                 */
/* ------------------------------------------------------------------ */

function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return h >>> 0;
}

const PERMUTATIONS: readonly [number, number, number][] = [
  [0, 1, 2],
  [0, 2, 1],
  [1, 0, 2],
  [1, 2, 0],
  [2, 0, 1],
  [2, 1, 0],
];

/**
 * The order options are displayed in. Fixed per scenario (so letters never
 * change between visits) but varied across the library so the most
 * considered response is not always in the same position.
 */
export function displayOptions(scenario: Scenario): ScenarioOption[] {
  const order = PERMUTATIONS[hash(scenario.id) % PERMUTATIONS.length] as [number, number, number];
  return order.map((i) => scenario.options[i] as ScenarioOption);
}

export const optionLetter = (index: number): string => String.fromCharCode(65 + index);

/* ------------------------------------------------------------------ */
/* Answer handling                                                     */
/* ------------------------------------------------------------------ */

export function isOptionId(scenario: Scenario, id: unknown): id is ScenarioOptionId {
  return scenario.options.some((o) => o.id === id);
}

/**
 * Record (or change) the user's choice. The first completion date is kept;
 * every option the user has looked at is remembered so alternatives stay
 * open for review.
 */
export function recordSelection(
  existing: ScenarioProgress | undefined,
  scenario: Scenario,
  optionId: ScenarioOptionId,
  now: Date,
  today: DateKey,
): ScenarioProgress {
  if (!isOptionId(scenario, optionId)) throw new Error(`Unknown option ${optionId} for ${scenario.id}`);
  const iso = now.toISOString();
  return {
    scenarioId: scenario.id,
    proverbId: scenario.proverbId,
    selectedOptionId: optionId,
    viewedOptionIds: existing?.viewedOptionIds.includes(optionId)
      ? existing.viewedOptionIds
      : [...(existing?.viewedOptionIds ?? []), optionId],
    completed: true,
    completedOn: existing?.completedOn ?? today,
    completedAt: existing?.completedAt ?? iso,
    updatedAt: iso,
    journalPrompted: existing?.journalPrompted ?? false,
  };
}

/** Mark an option's feedback as viewed (when comparing alternatives). */
export function recordViewed(existing: ScenarioProgress, optionId: ScenarioOptionId, now: Date): ScenarioProgress {
  if (existing.viewedOptionIds.includes(optionId)) return existing;
  return { ...existing, viewedOptionIds: [...existing.viewedOptionIds, optionId], updatedAt: now.toISOString() };
}

export function recordJournalPrompted(existing: ScenarioProgress, now: Date): ScenarioProgress {
  return existing.journalPrompted ? existing : { ...existing, journalPrompted: true, updatedAt: now.toISOString() };
}

/* ------------------------------------------------------------------ */
/* Journal hand-off                                                    */
/* ------------------------------------------------------------------ */

/**
 * Starter text placed in the journal's "Reflect" answer, only when that
 * answer is empty. Kept short so it reads as a prompt, not as the user's words.
 */
export function journalStarter(scenario: Scenario): string {
  return `Wisdom in Action · ${scenario.title}\n${scenario.followUp}\n\n`;
}
