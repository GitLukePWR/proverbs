import type { ScriptureReference } from './types';

/** "Proverbs 3:5" or "Proverbs 3:5–6" (en dash for ranges). */
export function formatReference(ref: ScriptureReference): string {
  const verses = ref.verseEnd && ref.verseEnd !== ref.verseStart ? `${ref.verseStart}–${ref.verseEnd}` : `${ref.verseStart}`;
  return `${ref.book} ${ref.chapter}:${verses}`;
}

export function referenceId(ref: ScriptureReference): string {
  const end = ref.verseEnd && ref.verseEnd !== ref.verseStart ? `-${ref.verseEnd}` : '';
  return `prov-${ref.chapter}-${ref.verseStart}${end}`;
}

export function versesOf(ref: ScriptureReference): number[] {
  const end = ref.verseEnd ?? ref.verseStart;
  const out: number[] = [];
  for (let v = ref.verseStart; v <= end; v++) out.push(v);
  return out;
}

export function containsVerse(ref: ScriptureReference, chapter: number, verse: number): boolean {
  return ref.chapter === chapter && verse >= ref.verseStart && verse <= (ref.verseEnd ?? ref.verseStart);
}

export interface ParsedReference {
  chapter: number;
  verseStart?: number;
  verseEnd?: number;
}

/**
 * Parse loose user input such as "3:5", "Prov 3:5-6", "proverbs 16", "pr 27.17".
 * Returns null when the input does not look like a reference.
 */
export function parseReference(input: string): ParsedReference | null {
  const m = /^\s*(?:(?:prov(?:erbs?)?|prv|pro|pr)\.?\s*)?(\d{1,2})(?:\s*[:.]\s*(\d{1,3})(?:\s*[-–—]\s*(\d{1,3}))?)?\s*$/i.exec(input);
  if (!m) return null;
  const chapter = Number(m[1]);
  if (chapter < 1 || chapter > 31) return null;
  const result: ParsedReference = { chapter };
  if (m[2]) result.verseStart = Number(m[2]);
  if (m[3]) result.verseEnd = Number(m[3]);
  return result;
}
