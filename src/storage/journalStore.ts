import { isValidDateKey } from '../domain/dates';
import { isTranslationId } from '../content/translations';
import type { JournalEntry, ReflectionPrompts } from '../domain/types';
import { NAMESPACE, type DocumentSpec, isObject, str } from './document';
import type { KeyValueStore } from './kv';
import { createRepository, type Repository } from './repository';

type JournalData = Record<string, JournalEntry>;

function sanitizeEntry(raw: unknown): JournalEntry | null {
  if (!isObject(raw)) return null;
  const id = str(raw.id);
  const proverbId = str(raw.proverbId);
  const writtenOn = raw.writtenOn;
  const createdAt = str(raw.createdAt);
  if (!id || !proverbId || !isValidDateKey(writtenOn) || Number.isNaN(Date.parse(createdAt))) return null;

  const answers = isObject(raw.answers) ? raw.answers : {};
  const snapshot = isObject(raw.snapshot) ? raw.snapshot : {};
  const prompts = isObject(snapshot.prompts) ? snapshot.prompts : {};
  const updatedAt = str(raw.updatedAt, createdAt);

  return {
    id,
    proverbId,
    proverbReference: str(raw.proverbReference, proverbId),
    snapshot: {
      text: str(snapshot.text),
      translationId: isTranslationId(snapshot.translationId) ? snapshot.translationId : 'web',
      prompts: {
        understand: str(prompts.understand),
        reflect: str(prompts.reflect),
        act: str(prompts.act),
      } satisfies ReflectionPrompts,
    },
    dailyDate: isValidDateKey(raw.dailyDate) ? raw.dailyDate : null,
    writtenOn,
    createdAt,
    updatedAt: Number.isNaN(Date.parse(updatedAt)) ? createdAt : updatedAt,
    answers: { understand: str(answers.understand), reflect: str(answers.reflect), act: str(answers.act) },
    notes: str(raw.notes),
  };
}

export const journalSpec: DocumentSpec<JournalData> = {
  key: `${NAMESPACE}.journal`,
  version: 1,
  defaultValue: () => ({}),
  sanitize(data) {
    const out: JournalData = {};
    const items = Array.isArray(data) ? data : isObject(data) ? Object.values(data) : [];
    for (const item of items) {
      const entry = sanitizeEntry(item);
      if (entry) out[entry.id] = entry; // invalid entries are skipped individually
    }
    return out;
  },
};

export interface JournalStore {
  repository: Repository<JournalData>;
  list(): JournalEntry[];
  get(id: string): JournalEntry | undefined;
  save(entry: JournalEntry): void;
  remove(id: string): void;
  clear(): void;
}

export function createJournalStore(kv: KeyValueStore): JournalStore {
  const repository = createRepository(kv, journalSpec);
  return {
    repository,
    list: () => Object.values(repository.getSnapshot()),
    get: (id) => repository.getSnapshot()[id],
    save(entry) {
      repository.commit({ ...repository.getSnapshot(), [entry.id]: entry });
    },
    remove(id) {
      const { [id]: _removed, ...rest } = repository.getSnapshot();
      repository.commit(rest);
    },
    clear() {
      repository.commit({});
    },
  };
}
