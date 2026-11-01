import { describe, expect, it } from 'vitest';
import { containsVerse, formatReference, parseReference, referenceId } from './reference';

describe('references', () => {
  it('formats single verses and ranges', () => {
    expect(formatReference({ book: 'Proverbs', chapter: 3, verseStart: 5 })).toBe('Proverbs 3:5');
    expect(formatReference({ book: 'Proverbs', chapter: 3, verseStart: 5, verseEnd: 6 })).toBe('Proverbs 3:5–6');
    expect(referenceId({ book: 'Proverbs', chapter: 3, verseStart: 5, verseEnd: 6 })).toBe('prov-3-5-6');
  });

  it('parses loose user input', () => {
    expect(parseReference('3:5')).toEqual({ chapter: 3, verseStart: 5 });
    expect(parseReference('Proverbs 3:5-6')).toEqual({ chapter: 3, verseStart: 5, verseEnd: 6 });
    expect(parseReference('prov 16')).toEqual({ chapter: 16 });
    expect(parseReference('Pr. 27.17')).toEqual({ chapter: 27, verseStart: 17 });
    expect(parseReference('32:1')).toBeNull();
    expect(parseReference('anger')).toBeNull();
  });

  it('checks verse containment', () => {
    const ref = { book: 'Proverbs' as const, chapter: 26, verseStart: 4, verseEnd: 5 };
    expect(containsVerse(ref, 26, 5)).toBe(true);
    expect(containsVerse(ref, 26, 6)).toBe(false);
    expect(containsVerse(ref, 25, 4)).toBe(false);
  });
});
