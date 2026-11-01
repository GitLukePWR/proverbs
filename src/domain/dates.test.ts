import { describe, expect, it } from 'vitest';
import { addDays, compareDateKeys, dayNumber, fromDateKey, isValidDateKey, toDateKey } from './dates';

describe('date keys', () => {
  it('formats the local calendar date, not the UTC date', () => {
    // 23:30 local time must stay on the same local day regardless of offset.
    const lateEvening = new Date(2026, 10, 1, 23, 30);
    expect(toDateKey(lateEvening)).toBe('2026-11-01');
    const earlyMorning = new Date(2026, 10, 1, 0, 5);
    expect(toDateKey(earlyMorning)).toBe('2026-11-01');
  });

  it('round-trips through fromDateKey', () => {
    expect(toDateKey(fromDateKey('2024-02-29'))).toBe('2024-02-29');
  });

  it('validates real calendar dates only', () => {
    expect(isValidDateKey('2026-11-01')).toBe(true);
    expect(isValidDateKey('2024-02-29')).toBe(true);
    expect(isValidDateKey('2025-02-29')).toBe(false);
    expect(isValidDateKey('2026-13-01')).toBe(false);
    expect(isValidDateKey('2026-1-1')).toBe(false);
    expect(isValidDateKey('nonsense')).toBe(false);
    expect(isValidDateKey(20261101)).toBe(false);
    expect(() => fromDateKey('bad')).toThrow();
  });

  it('adds days across month, year and leap boundaries', () => {
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(addDays('2024-03-01', -1)).toBe('2024-02-29');
    expect(addDays('2026-11-01', -365)).toBe('2025-11-01');
    expect(addDays('2026-03-29', 1)).toBe('2026-03-30'); // EU DST change
  });

  it('gives consecutive whole day numbers across DST transitions', () => {
    expect(dayNumber('1970-01-01')).toBe(0);
    expect(dayNumber('2026-03-30') - dayNumber('2026-03-29')).toBe(1);
    expect(dayNumber('2026-11-02') - dayNumber('2026-11-01')).toBe(1);
  });

  it('compares keys chronologically', () => {
    expect(compareDateKeys('2026-01-09', '2026-01-10')).toBe(-1);
    expect(compareDateKeys('2026-01-10', '2026-01-10')).toBe(0);
    expect(compareDateKeys('2027-01-01', '2026-12-31')).toBe(1);
  });
});
