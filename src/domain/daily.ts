import { dayNumber } from './dates';
import type { DateKey } from './types';

/**
 * Deterministic daily selection.
 *
 * Days are grouped into cycles the length of the collection. Within a cycle
 * every proverb appears exactly once, in an order shuffled by a seed derived
 * from the cycle number — so the same date always yields the same proverb, no
 * proverb repeats until all have been shown, and each cycle feels fresh.
 *
 * The only input is the ordered list of IDs: adding new proverbs to the end of
 * the library changes future selections, but past journal entries keep their
 * own `proverbId`, so history is never lost.
 */

/** Small, fast, well-distributed 32-bit PRNG. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296;
  };
}

const BASE_SEED = 0x57_49_5a_45; // "WIZE"

function shuffledCycle<T>(items: readonly T[], cycle: number): T[] {
  const random = mulberry32(BASE_SEED ^ Math.imul(cycle + 1, 0x9e3779b1));
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j] as T, out[i] as T];
  }
  return out;
}

/** The order of IDs for a given cycle, guaranteeing no repeat across a cycle boundary. */
export function cycleOrder<T>(items: readonly T[], cycle: number): T[] {
  const order = shuffledCycle(items, cycle);
  if (items.length > 2) {
    // Swapping only the first two positions never changes a cycle's last item,
    // so this check needs only the previous cycle's raw shuffle (no recursion).
    const previousLast = shuffledCycle(items, cycle - 1).at(-1);
    if (order[0] === previousLast) [order[0], order[1]] = [order[1] as T, order[0] as T];
  }
  return order;
}

export function selectDailyId(ids: readonly string[], date: DateKey): string {
  if (ids.length === 0) throw new Error('Cannot select a daily proverb from an empty collection');
  const day = dayNumber(date);
  const cycle = Math.floor(day / ids.length);
  const position = day - cycle * ids.length;
  return cycleOrder(ids, cycle)[position] as string;
}
