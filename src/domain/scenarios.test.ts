import { describe, expect, it } from 'vitest';
import { getDailyProverbId, getProverb } from '../content/library';
import { SCENARIOS } from '../content/scenarios';
import { getDailyScenario } from '../content/scenarioLibrary';
import { TOPICS } from '../content/topics';
import { addDays } from './dates';
import {
  displayOptions,
  journalStarter,
  recordJournalPrompted,
  recordSelection,
  recordViewed,
  selectDailyScenario,
} from './scenarios';
import type { Scenario } from './types';

const words = (s: string) => s.trim().split(/\s+/).length;

describe('scenario library', () => {
  it('has at least 15 scenarios with unique, stable IDs', () => {
    expect(SCENARIOS.length).toBeGreaterThanOrEqual(15);
    expect(new Set(SCENARIOS.map((s) => s.id)).size).toBe(SCENARIOS.length);
    for (const s of SCENARIOS) expect(s.id).toMatch(/^sc-[a-z0-9-]+$/);
  });

  it('links every scenario to a proverb that exists in the library', () => {
    for (const s of SCENARIOS) expect(getProverb(s.proverbId), `${s.id} → ${s.proverbId}`).toBeDefined();
  });

  it('gives every scenario three distinct, complete options', () => {
    const topicIds = new Set(TOPICS.map((t) => t.id));
    for (const s of SCENARIOS) {
      expect(s.options.map((o) => o.id).sort()).toEqual(['a', 'b', 'c']);
      for (const o of s.options) {
        expect(o.label && o.detail).toBeTruthy();
        expect(words(o.feedback), `${s.id}/${o.id} feedback`).toBeGreaterThanOrEqual(35);
        expect(words(o.feedback), `${s.id}/${o.id} feedback`).toBeLessThanOrEqual(100);
        expect(o.feedback).not.toMatch(/\b(correct answer|wrong answer|incorrect)\b/i);
      }
      expect(words(s.situation)).toBeLessThanOrEqual(50);
      expect(words(s.wiserPath)).toBeLessThanOrEqual(100);
      expect(s.connection && s.followUp && s.question).toBeTruthy();
      expect(s.alignedOptionId === null || ['a', 'b', 'c'].includes(s.alignedOptionId)).toBe(true);
      for (const t of s.topics) expect(topicIds.has(t)).toBe(true);
    }
  });

  it('covers a broad range of topics and includes context-dependent scenarios', () => {
    const topics = new Set(SCENARIOS.flatMap((s) => s.topics));
    for (const t of ['work', 'money', 'speech', 'relationships', 'emotions', 'humility', 'integrity', 'decisions'] as const) {
      expect(topics.has(t), t).toBe(true);
    }
    expect(SCENARIOS.some((s) => s.alignedOptionId === null)).toBe(true);
  });

  it('displays options in a stable order that varies across the library', () => {
    const positions = new Set<number>();
    for (const s of SCENARIOS) {
      const shown = displayOptions(s);
      expect(shown.map((o) => o.id).sort()).toEqual(['a', 'b', 'c']);
      expect(displayOptions(s)).toEqual(shown);
      if (s.alignedOptionId) positions.add(shown.findIndex((o) => o.id === s.alignedOptionId));
    }
    expect(positions.size).toBe(3);
  });
});

describe('daily scenario selection', () => {
  it('is deterministic for a date', () => {
    const a = getDailyScenario('2026-11-01', getDailyProverbId('2026-11-01'));
    const b = getDailyScenario('2026-11-01', getDailyProverbId('2026-11-01'));
    expect(a).toEqual(b);
  });

  it('prefers a scenario linked to the day’s proverb', () => {
    for (const s of SCENARIOS) {
      const result = getDailyScenario('2026-11-01', s.proverbId);
      expect(result.matchesProverb).toBe(true);
      expect(result.scenario.proverbId).toBe(s.proverbId);
    }
  });

  it('falls back to the wider library, flagged as not matching, when the proverb has no scenario', () => {
    const unlinked = 'prov-4-23';
    expect(SCENARIOS.some((s) => s.proverbId === unlinked)).toBe(false);
    const result = getDailyScenario('2026-11-01', unlinked);
    expect(result.matchesProverb).toBe(false);
    expect(SCENARIOS).toContain(result.scenario);
  });

  it('never repeats a scenario on consecutive days across several years', () => {
    let prev = getDailyScenario('2024-01-01', getDailyProverbId('2024-01-01')).scenario.id;
    for (let i = 1; i < 1500; i++) {
      const date = addDays('2024-01-01', i);
      const next = getDailyScenario(date, getDailyProverbId(date)).scenario.id;
      expect(next, date).not.toBe(prev);
      prev = next;
    }
  });

  it('uses a good spread of the library', () => {
    const seen = new Set<string>();
    for (let i = 0; i < 365; i++) {
      const date = addDays('2026-01-01', i);
      seen.add(getDailyScenario(date, getDailyProverbId(date)).scenario.id);
    }
    expect(seen.size).toBe(SCENARIOS.length);
  });

  it('rotates between several scenarios linked to the same proverb', () => {
    const base = SCENARIOS[0] as Scenario;
    const twin: Scenario = { ...base, id: 'sc-twin' };
    const lib = [base, twin];
    const ids = new Set(Array.from({ length: 6 }, (_, i) => selectDailyScenario(lib, addDays('2026-11-01', i), () => base.proverbId).scenario.id));
    expect(ids).toEqual(new Set([base.id, 'sc-twin']));
  });

  it('rejects an empty library', () => {
    expect(() => selectDailyScenario([], '2026-11-01', () => 'x')).toThrow();
  });
});

describe('answer handling', () => {
  const scenario = SCENARIOS[0] as Scenario;
  const t1 = new Date('2026-11-01T09:00:00Z');
  const t2 = new Date('2026-11-03T10:00:00Z');

  it('records a first selection as completed today', () => {
    const p = recordSelection(undefined, scenario, 'b', t1, '2026-11-01');
    expect(p).toMatchObject({
      scenarioId: scenario.id,
      proverbId: scenario.proverbId,
      selectedOptionId: 'b',
      viewedOptionIds: ['b'],
      completed: true,
      completedOn: '2026-11-01',
      completedAt: t1.toISOString(),
      journalPrompted: false,
    });
  });

  it('lets the user change their mind without losing the original completion date', () => {
    const first = recordSelection(undefined, scenario, 'b', t1, '2026-11-01');
    const changed = recordSelection(first, scenario, 'a', t2, '2026-11-03');
    expect(changed.selectedOptionId).toBe('a');
    expect(changed.viewedOptionIds).toEqual(['b', 'a']);
    expect(changed.completedOn).toBe('2026-11-01');
    expect(changed.completedAt).toBe(t1.toISOString());
    expect(changed.updatedAt).toBe(t2.toISOString());
  });

  it('tracks alternatives viewed and the journal hand-off', () => {
    const p = recordSelection(undefined, scenario, 'b', t1, '2026-11-01');
    const viewed = recordViewed(recordViewed(p, 'c', t2), 'c', t2);
    expect(viewed.viewedOptionIds).toEqual(['b', 'c']);
    expect(recordJournalPrompted(viewed, t2).journalPrompted).toBe(true);
  });

  it('rejects unknown options', () => {
    expect(() => recordSelection(undefined, scenario, 'z' as never, t1, '2026-11-01')).toThrow();
  });

  it('builds a short journal starter from the follow-up question', () => {
    const text = journalStarter(scenario);
    expect(text).toContain(scenario.followUp);
    expect(text.endsWith('\n\n')).toBe(true);
  });
});
