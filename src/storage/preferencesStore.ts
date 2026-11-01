import { DEFAULT_TRANSLATION_ID, isTranslationId } from '../content/translations';
import type { Preferences } from '../domain/types';
import { NAMESPACE, type DocumentSpec, isObject } from './document';
import type { KeyValueStore } from './kv';
import { createRepository, type Repository } from './repository';

export const DEFAULT_PREFERENCES: Preferences = { translationId: DEFAULT_TRANSLATION_ID, readingSize: 'standard', theme: 'system' };

export const preferencesSpec: DocumentSpec<Preferences> = {
  key: `${NAMESPACE}.preferences`,
  version: 1,
  defaultValue: () => ({ ...DEFAULT_PREFERENCES }),
  sanitize(data) {
    const d = isObject(data) ? data : {};
    return {
      translationId: isTranslationId(d.translationId) ? d.translationId : DEFAULT_PREFERENCES.translationId,
      readingSize: d.readingSize === 'large' ? 'large' : 'standard',
      // Added after v1 shipped: older documents simply lack it and get the default,
      // so no schema version bump or migration is needed.
      theme: d.theme === 'light' || d.theme === 'dark' ? d.theme : 'system',
    };
  },
};

export interface PreferencesStore {
  repository: Repository<Preferences>;
  update(patch: Partial<Preferences>): void;
}

export function createPreferencesStore(kv: KeyValueStore): PreferencesStore {
  const repository = createRepository(kv, preferencesSpec);
  return {
    repository,
    update: (patch) => repository.commit({ ...repository.getSnapshot(), ...patch }),
  };
}
