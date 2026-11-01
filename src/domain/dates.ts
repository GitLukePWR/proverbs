import type { DateKey } from './types';

/**
 * Date helpers that work on *local calendar dates*. A user in Sydney and a
 * user in London each see "their" 1 November proverb on their own 1 November,
 * regardless of UTC offset or daylight-saving changes.
 */

const DATE_KEY = /^(\d{4})-(\d{2})-(\d{2})$/;
const MS_PER_DAY = 86_400_000;

const pad = (n: number) => String(n).padStart(2, '0');

/** The local calendar date of `date` as `YYYY-MM-DD`. */
export function toDateKey(date: Date): DateKey {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function isValidDateKey(value: unknown): value is DateKey {
  if (typeof value !== 'string') return false;
  const m = DATE_KEY.exec(value);
  if (!m) return false;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const probe = new Date(Date.UTC(y, mo - 1, d));
  return probe.getUTCFullYear() === y && probe.getUTCMonth() === mo - 1 && probe.getUTCDate() === d;
}

/** Parse a date key into a local Date at midnight. Throws on invalid input. */
export function fromDateKey(key: DateKey): Date {
  if (!isValidDateKey(key)) throw new Error(`Invalid date key: ${key}`);
  const [y, m, d] = key.split('-').map(Number) as [number, number, number];
  return new Date(y, m - 1, d);
}

/**
 * Whole days since 1970-01-01 for a calendar date. Computed in UTC from the
 * date's components so DST transitions can never produce fractional days.
 */
export function dayNumber(key: DateKey): number {
  const [y, m, d] = key.split('-').map(Number) as [number, number, number];
  return Math.floor(Date.UTC(y, m - 1, d) / MS_PER_DAY);
}

export function addDays(key: DateKey, days: number): DateKey {
  const [y, m, d] = key.split('-').map(Number) as [number, number, number];
  const shifted = new Date(Date.UTC(y, m - 1, d + days));
  return `${shifted.getUTCFullYear()}-${pad(shifted.getUTCMonth() + 1)}-${pad(shifted.getUTCDate())}`;
}

export function compareDateKeys(a: DateKey, b: DateKey): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

export function formatLongDate(key: DateKey, locale?: string): string {
  return fromDateKey(key).toLocaleDateString(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatShortDate(key: DateKey, locale?: string): string {
  return fromDateKey(key).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatTime(iso: string, locale?: string): string {
  return new Date(iso).toLocaleTimeString(locale, { hour: 'numeric', minute: '2-digit' });
}

export function formatDateTime(iso: string, locale?: string): string {
  return new Date(iso).toLocaleString(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}
