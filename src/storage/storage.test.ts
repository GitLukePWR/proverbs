import { describe, expect, it } from 'vitest';
import { getProverb } from '../content/library';
import { createEntry } from '../domain/journal';
import { createBookmarkStore } from './bookmarkStore';
import { readDocument } from './document';
import { createJournalStore, journalSpec } from './journalStore';
import { createMemoryStore, createWebStorageStore } from './kv';
import { createPreferencesStore } from './preferencesStore';

const proverb = getProverb('prov-3-5-6')!;
const entry = () =>
  createEntry({ proverb, dailyDate: '2026-11-01', writtenOn: '2026-11-01', now: new Date('2026-11-01T08:00:00Z'), answers: { reflect: 'Work decision' } });

describe('journal persistence', () => {
  it('saves, reloads, updates and deletes entries', () => {
    const kv = createMemoryStore();
    const store = createJournalStore(kv);
    const e = entry();
    store.save(e);

    const reopened = createJournalStore(kv); // simulates a page refresh
    expect(reopened.get(e.id)).toEqual(e);

    reopened.save({ ...e, answers: { ...e.answers, act: 'Ask for advice' }, updatedAt: '2026-11-01T09:00:00.000Z' });
    expect(createJournalStore(kv).get(e.id)?.answers.act).toBe('Ask for advice');

    reopened.remove(e.id);
    expect(createJournalStore(kv).list()).toEqual([]);
  });

  it('notifies subscribers on change', () => {
    const store = createJournalStore(createMemoryStore());
    let calls = 0;
    const unsubscribe = store.repository.subscribe(() => calls++);
    store.save(entry());
    unsubscribe();
    store.clear();
    expect(calls).toBe(1);
  });

  it('starts empty when nothing is stored', () => {
    const store = createJournalStore(createMemoryStore());
    expect(store.list()).toEqual([]);
    expect(store.repository.readStatus).toBe('empty');
  });

  it('recovers from unparseable data without crashing and keeps a backup', () => {
    const kv = createMemoryStore({ [journalSpec.key]: '{not json' });
    const store = createJournalStore(kv);
    expect(store.list()).toEqual([]);
    expect(store.repository.readStatus).toBe('recovered');
    const backup = kv.keys().find((k) => k.startsWith(`${journalSpec.key}.unreadable-`));
    expect(backup && kv.get(backup)).toBe('{not json');
  });

  it('keeps valid entries and drops malformed ones individually', () => {
    const good = entry();
    const kv = createMemoryStore({
      [journalSpec.key]: JSON.stringify({ version: 1, data: { [good.id]: good, junk: { id: 'x' }, other: 42 } }),
    });
    expect(createJournalStore(kv).list()).toEqual([good]);
  });

  it('fills in missing optional fields on otherwise-valid entries', () => {
    const kv = createMemoryStore({
      [journalSpec.key]: JSON.stringify({
        version: 1,
        data: [{ id: 'a', proverbId: 'prov-3-5-6', writtenOn: '2026-11-01', createdAt: '2026-11-01T08:00:00Z', answers: { act: 'hi' } }],
      }),
    });
    const [e] = createJournalStore(kv).list();
    expect(e?.answers).toEqual({ understand: '', reflect: '', act: 'hi' });
    expect(e?.notes).toBe('');
    expect(e?.updatedAt).toBe('2026-11-01T08:00:00Z');
    expect(e?.dailyDate).toBeNull();
  });

  it('refuses data from a newer schema version rather than misreading it', () => {
    const kv = createMemoryStore({ [journalSpec.key]: JSON.stringify({ version: 99, data: {} }) });
    expect(readDocument(kv, journalSpec).status).toBe('recovered');
  });

  it('runs migrations from older versions', () => {
    const kv = createMemoryStore({ k: JSON.stringify({ version: 1, data: ['a'] }) });
    const spec = {
      key: 'k',
      version: 2,
      defaultValue: () => [] as string[],
      sanitize: (d: unknown) => (Array.isArray(d) ? d.map(String) : []),
      migrations: { 1: (d: unknown) => [...(d as string[]), 'migrated'] },
    };
    expect(readDocument(kv, spec).value).toEqual(['a', 'migrated']);
  });

  it('does not change in-memory state when a write fails', () => {
    const kv = createMemoryStore();
    const store = createJournalStore(kv);
    kv.set = () => {
      throw new Error('QuotaExceededError');
    };
    expect(() => store.save(entry())).toThrow();
    expect(store.list()).toEqual([]);
  });
});

describe('bookmarks', () => {
  it('toggles and persists', () => {
    const kv = createMemoryStore();
    const store = createBookmarkStore(kv);
    expect(store.toggle('prov-15-1')).toBe(true);
    expect(createBookmarkStore(kv).has('prov-15-1')).toBe(true);
    expect(store.toggle('prov-15-1')).toBe(false);
    expect(createBookmarkStore(kv).has('prov-15-1')).toBe(false);
  });

  it('ignores malformed and duplicate records', () => {
    const kv = createMemoryStore({
      'wize.bookmarks': JSON.stringify({ version: 1, data: [{ proverbId: 'a' }, { proverbId: 'a' }, null, 'b', { nope: 1 }] }),
    });
    expect(createBookmarkStore(kv).repository.getSnapshot().map((b) => b.proverbId)).toEqual(['a']);
  });
});

describe('preferences', () => {
  it('falls back to defaults for invalid values', () => {
    const kv = createMemoryStore({ 'wize.preferences': JSON.stringify({ version: 1, data: { translationId: 'xyz', readingSize: 'huge' } }) });
    expect(createPreferencesStore(kv).repository.getSnapshot()).toEqual({ translationId: 'web', readingSize: 'standard' });
  });
});

describe('web storage adapter', () => {
  it('falls back to memory when storage throws', () => {
    const kv = createWebStorageStore(() => {
      throw new Error('SecurityError');
    });
    expect(kv.persistent).toBe(false);
    kv.set('a', '1');
    expect(kv.get('a')).toBe('1');
  });
});
