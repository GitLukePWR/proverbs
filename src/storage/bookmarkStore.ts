import type { Bookmark } from '../domain/types';
import { NAMESPACE, type DocumentSpec, isObject, str } from './document';
import type { KeyValueStore } from './kv';
import { createRepository, type Repository } from './repository';

export const bookmarksSpec: DocumentSpec<Bookmark[]> = {
  key: `${NAMESPACE}.bookmarks`,
  version: 1,
  defaultValue: () => [],
  sanitize(data) {
    if (!Array.isArray(data)) return [];
    const seen = new Set<string>();
    const out: Bookmark[] = [];
    for (const item of data) {
      if (!isObject(item)) continue;
      const proverbId = str(item.proverbId);
      if (!proverbId || seen.has(proverbId)) continue;
      seen.add(proverbId);
      out.push({ proverbId, createdAt: str(item.createdAt, new Date(0).toISOString()) });
    }
    return out;
  },
};

export interface BookmarkStore {
  repository: Repository<Bookmark[]>;
  has(proverbId: string): boolean;
  /** Returns true if the proverb is bookmarked after the toggle. */
  toggle(proverbId: string, now?: Date): boolean;
  remove(proverbId: string): void;
}

export function createBookmarkStore(kv: KeyValueStore): BookmarkStore {
  const repository = createRepository(kv, bookmarksSpec);
  const has = (id: string) => repository.getSnapshot().some((b) => b.proverbId === id);
  const remove = (id: string) => repository.commit(repository.getSnapshot().filter((b) => b.proverbId !== id));
  return {
    repository,
    has,
    remove,
    toggle(id, now = new Date()) {
      if (has(id)) {
        remove(id);
        return false;
      }
      repository.commit([{ proverbId: id, createdAt: now.toISOString() }, ...repository.getSnapshot()]);
      return true;
    },
  };
}
