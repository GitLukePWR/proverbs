import { createBookmarkStore } from '../storage/bookmarkStore';
import { createJournalStore } from '../storage/journalStore';
import { createWebStorageStore } from '../storage/kv';
import { createPreferencesStore } from '../storage/preferencesStore';
import { createScenarioProgressStore } from '../storage/scenarioProgressStore';

/**
 * Composition root: the only place that knows persistence is localStorage.
 * Swap `kv` (or the stores) here to move to native storage or a sync service.
 */
const kv = createWebStorageStore(() => (typeof window !== 'undefined' ? window.localStorage : undefined));

export const services = {
  storageIsPersistent: kv.persistent,
  journal: createJournalStore(kv),
  bookmarks: createBookmarkStore(kv),
  preferences: createPreferencesStore(kv),
  scenarioProgress: createScenarioProgressStore(kv),
};

export const storageRecoveredFromError = [services.journal, services.bookmarks, services.preferences, services.scenarioProgress].some(
  (s) => s.repository.readStatus === 'recovered',
);

// Keep multiple open tabs in step.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    for (const store of [services.journal, services.bookmarks, services.preferences, services.scenarioProgress]) {
      if (event.key === null || event.key === store.repository.key) store.repository.reload();
    }
  });
}
