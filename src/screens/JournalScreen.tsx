import { BookOpen, NotebookPen, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { EmptyState } from '../components/EmptyState';
import { EntryCard } from '../components/EntryCard';
import { PageHeader } from '../components/PageHeader';
import { SearchField } from '../components/SearchField';
import { entryDay, filterEntries, isEntryEmpty } from '../domain/journal';
import { useJournalEntries } from '../hooks/useStores';

function monthLabel(month: string) {
  const [y, m] = month.split('-').map(Number) as [number, number];
  return new Date(y, m - 1, 1).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
}

/** Session-only memory of the journal search (not persisted, not in the URL). */
let rememberedQuery = '';

export function JournalScreen() {
  const all = useJournalEntries();
  const entries = useMemo(() => all.filter((e) => !isEntryEmpty(e)), [all]);
  // Month/proverb filters live in the URL so they survive opening an entry and
  // coming back. Search words can reveal private content, so they are kept in
  // memory for this session only — never in the URL or browser history.
  const [params, setParams] = useSearchParams();
  const [text, setTextState] = useState(rememberedQuery);
  const setText = (v: string) => {
    rememberedQuery = v;
    setTextState(v);
  };
  const month = params.get('month') ?? '';
  const proverbId = params.get('proverb') ?? '';
  const setFilter = (key: 'month' | 'proverb', value: string) => {
    const p = new URLSearchParams(params);
    if (value) p.set(key, value);
    else p.delete(key);
    setParams(p, { replace: true, preventScrollReset: true });
  };

  const months = useMemo(() => [...new Set(entries.map((e) => entryDay(e).slice(0, 7)))], [entries]);
  const references = useMemo(() => {
    const map = new Map<string, string>();
    for (const e of entries) map.set(e.proverbId, e.proverbReference);
    return [...map].sort((a, b) => a[1].localeCompare(b[1], undefined, { numeric: true }));
  }, [entries]);

  const results = filterEntries(entries, { text, month: month || null, proverbId: proverbId || null });
  const filtering = !!(text || month || proverbId);

  if (entries.length === 0) {
    return (
      <>
        <PageHeader eyebrow="Journal" title="Your reflections" />
        <EmptyState
          icon={<NotebookPen size={22} />}
          title="Nothing written yet"
          action={
            <Link to="/" className="btn-primary">
              <BookOpen size={16} aria-hidden /> Read today’s proverb
            </Link>
          }
        >
          Each day’s proverb comes with three short questions. Your answers will collect here, private to this device.
        </EmptyState>
      </>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader eyebrow="Journal" title="Your reflections">
        {entries.length} {entries.length === 1 ? 'entry' : 'entries'}, stored privately on this device.
      </PageHeader>

      <div className="mb-6 space-y-3">
        <SearchField value={text} onChange={setText} label="Search your journal" placeholder="Search your reflections" />
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="sr-only">Filter by month</span>
            <select value={month} onChange={(e) => setFilter('month', e.target.value)} className="field min-h-11 py-2.5 text-sm">
              <option value="">All dates</option>
              {months.map((m) => (
                <option key={m} value={m}>
                  {monthLabel(m)}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="sr-only">Filter by proverb</span>
            <select value={proverbId} onChange={(e) => setFilter('proverb', e.target.value)} className="field min-h-11 py-2.5 text-sm">
              <option value="">All proverbs</option>
              {references.map(([id, ref]) => (
                <option key={id} value={id}>
                  {ref}
                </option>
              ))}
            </select>
          </label>
        </div>
        {filtering && (
          <div className="flex items-center justify-between text-sm text-muted">
            <span aria-live="polite">
              {results.length} {results.length === 1 ? 'match' : 'matches'}
            </span>
            <button
              type="button"
              className="inline-flex min-h-11 items-center gap-1 rounded-full px-2 text-forest hover:underline"
              onClick={() => {
                setText('');
                setParams(new URLSearchParams(), { replace: true, preventScrollReset: true });
              }}
            >
              <X size={14} aria-hidden /> Clear filters
            </button>
          </div>
        )}
      </div>

      {results.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-line-strong px-6 py-10 text-center text-muted">
          No reflections match those filters.
        </p>
      ) : (
        <ul className="space-y-3">
          {results.map((e) => (
            <li key={e.id}>
              <EntryCard entry={e} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
