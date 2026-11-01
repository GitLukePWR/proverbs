import { describe, expect, it } from 'vitest';
import { listProverbs } from '../content/library';
import { searchProverbs, searchVerses } from './search';
import { getChapterVerses } from '../content/translations';

const all = listProverbs();

describe('searchProverbs', () => {
  it('finds by exact reference and by a verse inside a range', () => {
    expect(searchProverbs(all, { text: '3:5' }).map((p) => p.id)).toEqual(['prov-3-5-6']);
    expect(searchProverbs(all, { text: 'Proverbs 3:6' }).map((p) => p.id)).toEqual(['prov-3-5-6']);
  });

  it('finds by chapter', () => {
    const ids = searchProverbs(all, { text: 'prov 16' }).map((p) => p.id);
    expect(ids).toEqual(expect.arrayContaining(['prov-16-3', 'prov-16-9', 'prov-16-18', 'prov-16-32']));
    expect(ids.every((id) => id.startsWith('prov-16-'))).toBe(true);
  });

  it('matches keywords across text and explanation, case-insensitively', () => {
    expect(searchProverbs(all, { text: 'IRON' }).map((p) => p.id)).toContain('prov-27-17');
    expect(searchProverbs(all, { text: 'gentle answer' }).map((p) => p.id)).toContain('prov-15-1');
    expect(searchProverbs(all, { text: 'zzzz' })).toEqual([]);
  });

  it('filters by topic', () => {
    const money = searchProverbs(all, { topic: 'money' });
    expect(money.length).toBeGreaterThan(0);
    expect(money.every((p) => p.topics.includes('money'))).toBe(true);
  });
});

describe('searchVerses', () => {
  it('searches the full text', () => {
    const chapters = [{ chapter: 26, verses: getChapterVerses('web', 26) }];
    expect(searchVerses(chapters, 'dog vomit')).toEqual([expect.objectContaining({ chapter: 26, number: 11 })]);
  });
});
