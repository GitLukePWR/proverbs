import { describe, expect, it } from 'vitest';
import { getProverb } from '../content/library';
import { createEntry, entriesToJson, entriesToMarkdown, entryPreview, filterEntries, isEntryEmpty, sortEntries } from './journal';
import { currentStreak } from './streak';
import { buildShareText } from './share';

const proverb = getProverb('prov-15-1')!;
const now = new Date('2026-11-01T09:00:00Z');

describe('journal entries', () => {
  it('captures a snapshot of the proverb so history survives content changes', () => {
    const e = createEntry({ proverb, dailyDate: '2026-11-01', writtenOn: '2026-11-01', now });
    expect(e.proverbId).toBe('prov-15-1');
    expect(e.proverbReference).toBe('Proverbs 15:1');
    expect(e.snapshot.text).toBe(proverb.text);
    expect(e.snapshot.prompts).toEqual(proverb.prompts);
    expect(e.createdAt).toBe(now.toISOString());
    expect(isEntryEmpty(e)).toBe(true);
  });

  it('builds previews and detects content', () => {
    const e = createEntry({ proverb, dailyDate: null, writtenOn: '2026-11-01', now, answers: { reflect: 'A tense meeting at work.' }, notes: 'Pray first.' });
    expect(isEntryEmpty(e)).toBe(false);
    expect(entryPreview(e)).toBe('A tense meeting at work. · Pray first.');
    expect(entryPreview({ ...e, notes: 'x'.repeat(300) }, 50).length).toBeLessThanOrEqual(50);
  });

  it('sorts newest first and filters', () => {
    const a = createEntry({ proverb, dailyDate: '2026-10-01', writtenOn: '2026-10-01', now, answers: { act: 'listen more' } });
    const b = createEntry({ proverb: getProverb('prov-27-17')!, dailyDate: null, writtenOn: '2026-10-20', now, answers: { act: 'call Sam' } });
    expect(sortEntries([a, b]).map((e) => e.id)).toEqual([b.id, a.id]);
    expect(filterEntries([a, b], { text: 'listen' })).toEqual([a]);
    expect(filterEntries([a, b], { proverbId: 'prov-27-17' })).toEqual([b]);
    expect(filterEntries([a, b], { month: '2026-10' })).toHaveLength(2);
  });

  it('exports JSON and Markdown', () => {
    const e = createEntry({ proverb, dailyDate: '2026-11-01', writtenOn: '2026-11-01', now, answers: { understand: 'Softness has power.' } });
    const json = JSON.parse(entriesToJson([e]));
    expect(json.entries[0].answers.understand).toBe('Softness has power.');
    const md = entriesToMarkdown([e]);
    expect(md).toContain('## Proverbs 15:1');
    expect(md).toContain('Softness has power.');
    expect(md).not.toContain('**Reflect');
  });
});

describe('streak', () => {
  it('counts consecutive days ending today or yesterday', () => {
    expect(currentStreak([], '2026-11-01')).toBe(0);
    expect(currentStreak(['2026-11-01', '2026-10-31', '2026-10-30'], '2026-11-01')).toBe(3);
    expect(currentStreak(['2026-10-31', '2026-10-30'], '2026-11-01')).toBe(2);
    expect(currentStreak(['2026-10-29'], '2026-11-01')).toBe(0);
    expect(currentStreak(['2026-11-01', '2026-11-01', '2026-10-30'], '2026-11-01')).toBe(1);
  });
});

describe('share text', () => {
  it('includes Scripture and reference, and the meaning only when asked', () => {
    const plain = buildShareText(proverb);
    expect(plain).toContain(proverb.text);
    expect(plain).toContain('Proverbs 15:1 (WEB)');
    expect(plain).not.toContain(proverb.meaning);
    expect(buildShareText(proverb, { includeMeaning: true })).toContain(proverb.meaning);
  });
});
