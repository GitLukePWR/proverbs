import { describe, expect, it } from 'vitest';
import { STUDY_IDS, getDailyProverbId } from '../content/library';
import { cycleOrder, selectDailyId } from './daily';
import { addDays, dayNumber } from './dates';

const ids = Array.from({ length: 30 }, (_, i) => `p${i}`);

describe('daily selection', () => {
  it('is deterministic for a given date', () => {
    expect(selectDailyId(ids, '2026-11-01')).toBe(selectDailyId(ids, '2026-11-01'));
    expect(getDailyProverbId('2026-11-01')).toBe(getDailyProverbId('2026-11-01'));
  });

  it('changes with the date', () => {
    expect(selectDailyId(ids, '2026-11-01')).not.toBe(selectDailyId(ids, '2026-11-02'));
  });

  it('shows every proverb exactly once per cycle', () => {
    const cycleStart = Math.ceil(dayNumber('2026-01-01') / ids.length) * ids.length;
    const start = addDays('1970-01-01', cycleStart);
    const seen = Array.from({ length: ids.length }, (_, i) => selectDailyId(ids, addDays(start, i)));
    expect(new Set(seen).size).toBe(ids.length);
  });

  it('never shows the same proverb on two consecutive days, including across cycles', () => {
    let prev = selectDailyId(ids, '2020-01-01');
    for (let i = 1; i < 3000; i++) {
      const next = selectDailyId(ids, addDays('2020-01-01', i));
      expect(next).not.toBe(prev);
      prev = next;
    }
  });

  it('orders cycles differently', () => {
    expect(cycleOrder(ids, 10)).not.toEqual(cycleOrder(ids, 11));
  });

  it('only selects from the library', () => {
    for (let i = 0; i < 400; i++) expect(STUDY_IDS).toContain(getDailyProverbId(addDays('2026-01-01', i)));
  });

  it('handles tiny collections and rejects empty ones', () => {
    expect(selectDailyId(['only'], '2026-11-01')).toBe('only');
    expect(() => selectDailyId([], '2026-11-01')).toThrow();
  });
});
