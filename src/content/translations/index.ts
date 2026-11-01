import type { Translation, TranslationId } from '../../domain/types';
import webProverbs from './web-proverbs.json';

/**
 * Translation registry. To add a translation: add its id to `TranslationId`,
 * drop a JSON file with the same `{ chapters: { [chapter]: { [verse]: text } } }`
 * shape next to this file (after confirming its licence permits redistribution),
 * and register it below.
 */

interface ChapterData {
  chapters: Record<string, Record<string, string>>;
}

export const TRANSLATIONS: Record<TranslationId, Translation & { data: ChapterData }> = {
  web: {
    id: 'web',
    name: 'World English Bible',
    abbreviation: 'WEB',
    licence: 'Public domain',
    attribution:
      'Scripture quotations are from the World English Bible (WEB), which is in the public domain. Text sourced from eBible.org.',
    data: webProverbs as ChapterData,
  },
};

export const DEFAULT_TRANSLATION_ID: TranslationId = 'web';

export function isTranslationId(value: unknown): value is TranslationId {
  return typeof value === 'string' && value in TRANSLATIONS;
}

export function getTranslation(id: TranslationId): Translation {
  const { data: _data, ...meta } = TRANSLATIONS[id];
  return meta;
}

export function listTranslations(): Translation[] {
  return (Object.keys(TRANSLATIONS) as TranslationId[]).map(getTranslation);
}

export function getVerseText(id: TranslationId, chapter: number, verse: number): string | undefined {
  return TRANSLATIONS[id].data.chapters[String(chapter)]?.[String(verse)];
}

export function getChapterVerses(id: TranslationId, chapter: number): { number: number; text: string }[] {
  const ch = TRANSLATIONS[id].data.chapters[String(chapter)];
  if (!ch) return [];
  return Object.entries(ch)
    .map(([n, text]) => ({ number: Number(n), text }))
    .sort((a, b) => a.number - b.number);
}

export const CHAPTER_COUNT = 31;
