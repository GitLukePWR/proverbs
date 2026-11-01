import { describe, expect, it } from 'vitest';
import { STUDIES } from './studies';
import { STUDY_IDS, getProverb, listProverbs } from './library';
import { referenceId } from '../domain/reference';
import { getVerseText } from './translations';
import { TOPICS } from './topics';

describe('content library', () => {
  it('has at least 30 distinct studies', () => {
    expect(STUDIES.length).toBeGreaterThanOrEqual(30);
    expect(new Set(STUDY_IDS).size).toBe(STUDY_IDS.length);
  });

  it('uses IDs that match their references', () => {
    for (const s of STUDIES) expect(s.id).toBe(referenceId(s));
  });

  it('resolves every study to verbatim translation text', () => {
    for (const p of listProverbs()) {
      expect(p.verses.length).toBeGreaterThan(0);
      for (const v of p.verses) expect(v.text).toBe(getVerseText('web', p.chapter, v.number));
    }
  });

  it('has complete, reasonably concise study material', () => {
    const topicIds = new Set(TOPICS.map((t) => t.id));
    for (const s of STUDIES) {
      const words = s.meaning.split(/\s+/).length;
      expect(words, `${s.id} meaning length`).toBeGreaterThanOrEqual(40);
      expect(words, `${s.id} meaning length`).toBeLessThanOrEqual(110);
      expect(s.practice.length).toBeGreaterThan(20);
      expect(s.prompts.understand && s.prompts.reflect && s.prompts.act).toBeTruthy();
      expect(s.topics.length).toBeGreaterThan(0);
      for (const t of s.topics) expect(topicIds.has(t)).toBe(true);
    }
  });

  it('includes the full Book of Proverbs text', () => {
    expect(getVerseText('web', 1, 1)).toMatch(/^The proverbs of Solomon/);
    expect(getVerseText('web', 31, 31)).toBeDefined();
    expect(getProverb('prov-3-5-6')?.text).toBe(
      'Trust in Yahweh with all your heart, and don’t lean on your own understanding. In all your ways acknowledge him, and he will make your paths straight.',
    );
  });

  it('returns undefined for unknown ids', () => {
    expect(getProverb('prov-99-1')).toBeUndefined();
  });
});
