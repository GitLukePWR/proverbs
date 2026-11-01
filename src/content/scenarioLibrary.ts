import { selectDailyScenario, type DailyScenario } from '../domain/scenarios';
import type { DateKey, Scenario } from '../domain/types';
import { getDailyProverbId } from './library';
import { SCENARIOS } from './scenarios';

const byId = new Map(SCENARIOS.map((s) => [s.id, s]));

export const SCENARIO_COUNT = SCENARIOS.length;

export const getScenario = (id: string): Scenario | undefined => byId.get(id);

export const listScenarios = (): readonly Scenario[] => SCENARIOS;

export const scenariosForProverb = (proverbId: string): Scenario[] => SCENARIOS.filter((s) => s.proverbId === proverbId);

/**
 * The scenario for a Today-screen date. `shownProverbId` is the proverb
 * actually displayed (which may be pinned by an existing journal entry).
 */
export function getDailyScenario(date: DateKey, shownProverbId: string): DailyScenario {
  return selectDailyScenario(SCENARIOS, date, (d) => (d === date ? shownProverbId : getDailyProverbId(d)));
}
