import { describe, expect, it } from 'vitest';
import { SCENARIOS } from '../content/scenarios';
import { recordSelection } from '../domain/scenarios';
import type { Scenario } from '../domain/types';
import { journalSpec } from './journalStore';
import { createMemoryStore } from './kv';
import { createScenarioProgressStore, scenarioProgressSpec } from './scenarioProgressStore';

const scenario = SCENARIOS[0] as Scenario;
const progress = () => recordSelection(undefined, scenario, 'b', new Date('2026-11-01T09:00:00Z'), '2026-11-01');

describe('scenario progress persistence', () => {
  it('survives a reload and records changed selections', () => {
    const kv = createMemoryStore();
    createScenarioProgressStore(kv).save(progress());
    const reopened = createScenarioProgressStore(kv);
    expect(reopened.get(scenario.id)?.selectedOptionId).toBe('b');

    reopened.save(recordSelection(reopened.get(scenario.id), scenario, 'c', new Date('2026-11-02T09:00:00Z'), '2026-11-02'));
    const again = createScenarioProgressStore(kv).get(scenario.id);
    expect(again?.selectedOptionId).toBe('c');
    expect(again?.completedOn).toBe('2026-11-01');
  });

  it('is stored separately and never touches journal data', () => {
    const journalRaw = JSON.stringify({ version: 1, data: {} });
    const kv = createMemoryStore({ [journalSpec.key]: journalRaw });
    createScenarioProgressStore(kv).save(progress());
    expect(kv.get(journalSpec.key)).toBe(journalRaw);
    expect(scenarioProgressSpec.key).not.toBe(journalSpec.key);
  });

  it('starts empty, and recovers from corrupt data', () => {
    expect(createScenarioProgressStore(createMemoryStore()).repository.readStatus).toBe('empty');
    const store = createScenarioProgressStore(createMemoryStore({ [scenarioProgressSpec.key]: 'not json' }));
    expect(store.repository.readStatus).toBe('recovered');
    expect(store.get(scenario.id)).toBeUndefined();
  });

  it('drops malformed records individually and repairs partial ones', () => {
    const good = progress();
    const kv = createMemoryStore({
      [scenarioProgressSpec.key]: JSON.stringify({
        version: 1,
        data: {
          good,
          badOption: { ...good, scenarioId: 'x', selectedOptionId: 'z' },
          badDate: { ...good, scenarioId: 'y', completedOn: 'yesterday' },
          partial: { scenarioId: 'sc-partial', selectedOptionId: 'a', completedOn: '2026-10-01', completedAt: '2026-10-01T08:00:00Z' },
        },
      }),
    });
    const data = createScenarioProgressStore(kv).repository.getSnapshot();
    expect(Object.keys(data).sort()).toEqual([good.scenarioId, 'sc-partial'].sort());
    expect(data['sc-partial']).toMatchObject({ viewedOptionIds: ['a'], journalPrompted: false, updatedAt: '2026-10-01T08:00:00Z' });
  });
});
