import type { KeyValueStore } from './kv';

/**
 * A versioned JSON document in the key–value store.
 *
 * Stored shape: `{ "version": <n>, "data": <payload> }`. On read the payload is
 * migrated forward from older versions and then validated. Anything that
 * cannot be parsed is copied to a backup key (never silently destroyed) and
 * the default value is used, so a corrupt value can never crash the app.
 */
export interface DocumentSpec<T> {
  key: string;
  version: number;
  defaultValue: () => T;
  /** Coerce unknown data into a valid T, dropping anything unusable. */
  sanitize: (data: unknown) => T;
  /** Upgrade data written by an older schema version. */
  migrations?: Record<number, (data: unknown) => unknown>;
}

export type ReadStatus = 'ok' | 'empty' | 'recovered';

export interface ReadResult<T> {
  value: T;
  status: ReadStatus;
}

export const NAMESPACE = 'wize';

export function readDocument<T>(kv: KeyValueStore, spec: DocumentSpec<T>): ReadResult<T> {
  const raw = kv.get(spec.key);
  if (raw === null) return { value: spec.defaultValue(), status: 'empty' };

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || !('data' in parsed)) throw new Error('Missing envelope');
    const envelope = parsed as { version?: unknown; data: unknown };
    let version = typeof envelope.version === 'number' ? envelope.version : 1;
    let data = envelope.data;
    if (version > spec.version) throw new Error(`Stored version ${version} is newer than supported ${spec.version}`);
    while (version < spec.version) {
      const migrate = spec.migrations?.[version];
      if (!migrate) throw new Error(`No migration from version ${version}`);
      data = migrate(data);
      version++;
    }
    return { value: spec.sanitize(data), status: 'ok' };
  } catch {
    backupCorrupt(kv, spec.key, raw);
    return { value: spec.defaultValue(), status: 'recovered' };
  }
}

export function writeDocument<T>(kv: KeyValueStore, spec: DocumentSpec<T>, value: T): void {
  kv.set(spec.key, JSON.stringify({ version: spec.version, data: value }));
}

function backupCorrupt(kv: KeyValueStore, key: string, raw: string) {
  try {
    kv.set(`${key}.unreadable-${Date.now()}`, raw);
  } catch {
    // Storage full or unavailable: nothing more we can safely do.
  }
}

/** Small helpers for sanitizers. */
export const isObject = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
export const str = (v: unknown, fallback = ''): string => (typeof v === 'string' ? v : fallback);
