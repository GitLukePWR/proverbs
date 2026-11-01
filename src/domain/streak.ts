import { addDays } from './dates';
import type { DateKey } from './types';

/**
 * The number of consecutive days, ending today (or yesterday, so the streak
 * isn't shown as broken before the user has had a chance to reflect today),
 * on which the user wrote at least one reflection.
 *
 * Deliberately gentle: there are no penalties or "streak lost" messages.
 */
export function currentStreak(activeDays: Iterable<DateKey>, today: DateKey): number {
  const days = new Set(activeDays);
  let cursor = days.has(today) ? today : addDays(today, -1);
  let count = 0;
  while (days.has(cursor)) {
    count++;
    cursor = addDays(cursor, -1);
  }
  return count;
}
