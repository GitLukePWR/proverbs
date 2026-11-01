import { type DocumentSpec, type ReadStatus, readDocument, writeDocument } from './document';
import type { KeyValueStore } from './kv';

export type Listener = () => void;

/**
 * An observable, cached view of one stored document. `getSnapshot` returns a
 * stable reference between changes, which makes it suitable for React's
 * `useSyncExternalStore` without any React dependency here.
 */
export interface Repository<T> {
  getSnapshot(): T;
  readonly readStatus: ReadStatus;
  /** Replace the value. Throws if the underlying store rejects the write. */
  commit(next: T): void;
  subscribe(listener: Listener): () => void;
  /** Re-read from storage (e.g. after another tab changed it). */
  reload(): void;
  readonly key: string;
}

export function createRepository<T>(kv: KeyValueStore, spec: DocumentSpec<T>): Repository<T> {
  let { value, status } = readDocument(kv, spec);
  const listeners = new Set<Listener>();
  const emit = () => listeners.forEach((l) => l());

  return {
    key: spec.key,
    get readStatus() {
      return status;
    },
    getSnapshot: () => value,
    commit(next) {
      writeDocument(kv, spec, next); // throws before state changes if storage fails
      value = next;
      emit();
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    reload() {
      ({ value, status } = readDocument(kv, spec));
      emit();
    },
  };
}
