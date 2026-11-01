import { containsVerse, parseReference } from './reference';
import type { Proverb, TopicId } from './types';

export interface ProverbQuery {
  text?: string;
  topic?: TopicId | null;
  chapter?: number | null;
}

const normalise = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[’‘]/g, "'");

/**
 * Client-side search across curated studies. Input that looks like a
 * reference ("3:5", "Prov 16") matches by chapter/verse; anything else is a
 * keyword search over Scripture, explanation, practice and topics. All terms
 * must match (AND).
 */
export function searchProverbs(proverbs: readonly Proverb[], query: ProverbQuery): Proverb[] {
  let results = proverbs.filter(
    (p) => (!query.topic || p.topics.includes(query.topic)) && (!query.chapter || p.chapter === query.chapter),
  );

  const text = query.text?.trim();
  if (!text) return results;

  const ref = parseReference(text);
  if (ref) {
    return results.filter((p) =>
      ref.verseStart === undefined
        ? p.chapter === ref.chapter
        : containsVerse(p, ref.chapter, ref.verseStart) ||
          (ref.verseEnd !== undefined && p.chapter === ref.chapter && p.verseStart >= ref.verseStart && p.verseStart <= ref.verseEnd),
    );
  }

  const terms = normalise(text).split(/\s+/).filter(Boolean);
  results = results.filter((p) => {
    const haystack = normalise(
      [p.reference, p.text, p.meaning, p.practice, p.context ?? '', p.topics.join(' ')].join(' '),
    );
    return terms.every((t) => haystack.includes(t));
  });
  return results;
}

/** Keyword search over raw chapter text (for verses beyond the curated studies). */
export function searchVerses(
  chapters: readonly { chapter: number; verses: readonly { number: number; text: string }[] }[],
  text: string,
  limit = 40,
): { chapter: number; number: number; text: string }[] {
  const terms = normalise(text.trim()).split(/\s+/).filter((t) => t.length > 1);
  if (terms.length === 0) return [];
  const out: { chapter: number; number: number; text: string }[] = [];
  for (const ch of chapters) {
    for (const v of ch.verses) {
      const hay = normalise(v.text);
      if (terms.every((t) => hay.includes(t))) {
        out.push({ chapter: ch.chapter, number: v.number, text: v.text });
        if (out.length >= limit) return out;
      }
    }
  }
  return out;
}
