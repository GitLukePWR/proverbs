import { useMemo, useSyncExternalStore } from 'react';
import { services } from '../app/services';
import { sortEntries } from '../domain/journal';
import type { Repository } from '../storage/repository';

export function useRepository<T>(repo: Repository<T>): T {
  return useSyncExternalStore(repo.subscribe, repo.getSnapshot, repo.getSnapshot);
}

export function useJournalEntries() {
  const data = useRepository(services.journal.repository);
  return useMemo(() => sortEntries(Object.values(data)), [data]);
}

export function usePreferences() {
  return useRepository(services.preferences.repository);
}

export function useBookmarks() {
  const list = useRepository(services.bookmarks.repository);
  const ids = useMemo(() => new Set(list.map((b) => b.proverbId)), [list]);
  return { list, ids };
}
