import type { TranslationId } from './types';

/** Display names for translation IDs, kept here so domain code needs no content imports. */
const NAMES: Record<TranslationId, string> = { web: 'WEB' };

export const getTranslationName = (id: TranslationId): string => NAMES[id] ?? id.toUpperCase();
