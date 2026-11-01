/**
 * Core content and user-data models for Wize.
 *
 * These types are framework-agnostic: nothing here depends on React or on
 * browser APIs, so the same models can back a future native (Capacitor) app or
 * a synchronised cloud store.
 */

export type TranslationId = 'web';

export interface Translation {
  id: TranslationId;
  name: string;
  abbreviation: string;
  /** Short licence statement shown wherever the text is displayed. */
  licence: string;
  /** Optional longer attribution / source note. */
  attribution: string;
}

/** A Bible reference within a single chapter. `verseEnd` is omitted for single verses. */
export interface ScriptureReference {
  book: 'Proverbs';
  chapter: number;
  verseStart: number;
  verseEnd?: number;
}

export type TopicId =
  | 'wisdom'
  | 'discipline'
  | 'speech'
  | 'relationships'
  | 'work'
  | 'money'
  | 'humility'
  | 'integrity'
  | 'decisions'
  | 'emotions'
  | 'faith'
  | 'justice';

export interface ReflectionPrompts {
  /** What does the proverb reveal about wisdom, character or human behaviour? */
  understand: string;
  /** Where does it touch my life right now? */
  reflect: string;
  /** What will I do differently? */
  act: string;
}

export type PromptKey = keyof ReflectionPrompts;
export const PROMPT_KEYS: readonly PromptKey[] = ['understand', 'reflect', 'act'] as const;

/**
 * Curated study material for a proverb. This is the editorial record; it does
 * not contain Scripture text, which is resolved from a translation at runtime
 * so that translations can be swapped without touching commentary.
 */
export interface ProverbStudy extends ScriptureReference {
  /** Stable identifier, e.g. `prov-3-5-6`. Never reuse or rename once shipped. */
  id: string;
  /** Plain-language explanation ("In Today's Words"). Original wording, not Scripture. */
  meaning: string;
  /** One concrete action for today ("Live It Today"). */
  practice: string;
  prompts: ReflectionPrompts;
  topics: TopicId[];
  /** Optional historical, cultural or literary context. */
  context?: string;
}

export interface Verse {
  number: number;
  text: string;
}

/** A study joined with its Scripture text in a particular translation. */
export interface Proverb extends ProverbStudy {
  reference: string;
  translationId: TranslationId;
  verses: Verse[];
  text: string;
}

/** Calendar date in the user's local timezone, formatted `YYYY-MM-DD`. */
export type DateKey = string;

export type ReflectionAnswers = Record<PromptKey, string>;

export interface JournalEntry {
  id: string;
  proverbId: string;
  /** Human-readable reference captured at the time of writing, e.g. "Proverbs 3:5–6". */
  proverbReference: string;
  /**
   * Snapshot of the Scripture and prompts the user responded to, so historic
   * entries stay meaningful even if the content library later changes.
   */
  snapshot: {
    text: string;
    translationId: TranslationId;
    prompts: ReflectionPrompts;
  };
  /** The daily-proverb date this entry belongs to, or null if journaled from Explore. */
  dailyDate: DateKey | null;
  /** Local calendar day on which the entry was started. */
  writtenOn: DateKey;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  answers: ReflectionAnswers;
  notes: string;
}

export type ReadingSize = 'standard' | 'large';

export interface Preferences {
  translationId: TranslationId;
  readingSize: ReadingSize;
}

export interface Bookmark {
  proverbId: string;
  createdAt: string;
}
