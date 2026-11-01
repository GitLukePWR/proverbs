import type { Proverb } from './types';
import { getTranslationName } from './translationNames';

export interface ShareOptions {
  includeMeaning?: boolean;
  url?: string;
}

/** Text for sharing a proverb. Never includes journal content. */
export function buildShareText(proverb: Proverb, { includeMeaning = false, url }: ShareOptions = {}): string {
  const parts = [`“${proverb.text}”`, `— ${proverb.reference} (${getTranslationName(proverb.translationId)})`];
  if (includeMeaning) parts.push('', `In today’s words: ${proverb.meaning}`);
  if (url) parts.push('', `Shared from Wize · ${url}`);
  return parts.join('\n');
}
