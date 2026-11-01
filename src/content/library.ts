import { selectDailyId } from '../domain/daily';
import { formatReference, versesOf } from '../domain/reference';
import type { DateKey, Proverb, ProverbStudy, TranslationId } from '../domain/types';
import { STUDIES } from './studies';
import { DEFAULT_TRANSLATION_ID, getVerseText } from './translations';

/**
 * Read-only access to the content library. UI code should use these functions
 * rather than importing raw data, so the source could later move to a
 * downloadable or remote content pack without touching screens.
 */

export function resolveStudy(study: ProverbStudy, translationId: TranslationId = DEFAULT_TRANSLATION_ID): Proverb {
  const verses = versesOf(study).map((number) => {
    const text = getVerseText(translationId, study.chapter, number);
    if (text === undefined) {
      throw new Error(`Missing ${translationId} text for Proverbs ${study.chapter}:${number} (${study.id})`);
    }
    return { number, text };
  });
  return {
    ...study,
    reference: formatReference(study),
    translationId,
    verses,
    text: verses.map((v) => v.text).join(' '),
  };
}

const studyById = new Map(STUDIES.map((s) => [s.id, s]));

export const STUDY_IDS: readonly string[] = STUDIES.map((s) => s.id);

export function getProverb(id: string, translationId?: TranslationId): Proverb | undefined {
  const study = studyById.get(id);
  return study ? resolveStudy(study, translationId) : undefined;
}

export function listProverbs(translationId?: TranslationId): Proverb[] {
  return STUDIES.map((s) => resolveStudy(s, translationId)).sort(
    (a, b) => a.chapter - b.chapter || a.verseStart - b.verseStart,
  );
}

export function getDailyProverbId(date: DateKey): string {
  return selectDailyId(STUDY_IDS, date);
}

/** Studies that include the given chapter (for highlighting in the chapter reader). */
export function studiesInChapter(chapter: number): ProverbStudy[] {
  return STUDIES.filter((s) => s.chapter === chapter).sort((a, b) => a.verseStart - b.verseStart);
}

export const STUDY_COUNT = STUDIES.length;
