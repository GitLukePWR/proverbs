/**
 * Minimal synchronous key–value interface. The rest of the app never touches
 * `localStorage` directly, so a native store (e.g. Capacitor Preferences behind
 * an in-memory cache) or a sync layer can be dropped in here later.
 */
export interface KeyValueStore {
  readonly persistent: boolean;
  get(key: string): string | null;
  set(key: string, value: string): void;
  remove(key: string): void;
  keys(): string[];
}

export function createMemoryStore(initial: Record<string, string> = {}): KeyValueStore {
  const map = new Map(Object.entries(initial));
  return {
    persistent: false,
    get: (k) => map.get(k) ?? null,
    set: (k, v) => void map.set(k, v),
    remove: (k) => void map.delete(k),
    keys: () => [...map.keys()],
  };
}

interface WebStorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  key(index: number): string | null;
  readonly length: number;
}

/**
 * Wraps a Web Storage object. Falls back to memory if storage is unavailable
 * (private browsing modes, disabled cookies, sandboxed iframes).
 */
export function createWebStorageStore(getStorage: () => WebStorageLike | undefined): KeyValueStore {
  let storage: WebStorageLike | undefined;
  try {
    storage = getStorage();
    if (storage) {
      const probe = '__wize_probe__';
      storage.setItem(probe, '1');
      storage.removeItem(probe);
    }
  } catch {
    storage = undefined;
  }
  if (!storage) return createMemoryStore();
  const s = storage;
  return {
    persistent: true,
    get: (k) => {
      try {
        return s.getItem(k);
      } catch {
        return null;
      }
    },
    // Writes are allowed to throw (e.g. QuotaExceededError) so callers can surface failure.
    set: (k, v) => s.setItem(k, v),
    remove: (k) => s.removeItem(k),
    keys: () => {
      const out: string[] = [];
      for (let i = 0; i < s.length; i++) {
        const k = s.key(i);
        if (k !== null) out.push(k);
      }
      return out;
    },
  };
}
