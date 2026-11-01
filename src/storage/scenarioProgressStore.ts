import { isValidDateKey } from '../domain/dates';
import type { ScenarioOptionId, ScenarioProgress } from '../domain/types';
import { SCENARIO_OPTION_IDS } from '../domain/types';
import { NAMESPACE, type DocumentSpec, isObject, str } from './document';
import type { KeyValueStore } from './kv';
import { createRepository, type Repository } from './repository';

type ProgressData = Record<string, ScenarioProgress>;

const isOption = (v: unknown): v is ScenarioOptionId => SCENARIO_OPTION_IDS.includes(v as ScenarioOptionId);

function sanitizeProgress(raw: unknown): ScenarioProgress | null {
  if (!isObject(raw)) return null;
  const scenarioId = str(raw.scenarioId);
  const completedAt = str(raw.completedAt);
  if (!scenarioId || !isOption(raw.selectedOptionId) || !isValidDateKey(raw.completedOn) || Number.isNaN(Date.parse(completedAt))) {
    return null;
  }
  const viewed = Array.isArray(raw.viewedOptionIds) ? raw.viewedOptionIds.filter(isOption) : [];
  const updatedAt = str(raw.updatedAt, completedAt);
  return {
    scenarioId,
    proverbId: str(raw.proverbId),
    selectedOptionId: raw.selectedOptionId,
    viewedOptionIds: [...new Set(viewed.includes(raw.selectedOptionId) ? viewed : [...viewed, raw.selectedOptionId])],
    completed: true,
    completedOn: raw.completedOn,
    completedAt,
    updatedAt: Number.isNaN(Date.parse(updatedAt)) ? completedAt : updatedAt,
    journalPrompted: raw.journalPrompted === true,
  };
}

/**
 * Wisdom in Action progress lives in its own versioned document, so adding
 * the feature required no change (or migration) to existing journal data.
 */
export const scenarioProgressSpec: DocumentSpec<ProgressData> = {
  key: `${NAMESPACE}.scenarios`,
  version: 1,
  defaultValue: () => ({}),
  sanitize(data) {
    const out: ProgressData = {};
    const items = Array.isArray(data) ? data : isObject(data) ? Object.values(data) : [];
    for (const item of items) {
      const p = sanitizeProgress(item);
      if (p) out[p.scenarioId] = p;
    }
    return out;
  },
};

export interface ScenarioProgressStore {
  repository: Repository<ProgressData>;
  get(scenarioId: string): ScenarioProgress | undefined;
  save(progress: ScenarioProgress): void;
  clear(): void;
}

export function createScenarioProgressStore(kv: KeyValueStore): ScenarioProgressStore {
  const repository = createRepository(kv, scenarioProgressSpec);
  return {
    repository,
    get: (id) => repository.getSnapshot()[id],
    save: (p) => repository.commit({ ...repository.getSnapshot(), [p.scenarioId]: p }),
    clear: () => repository.commit({}),
  };
}
