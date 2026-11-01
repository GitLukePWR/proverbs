import { BookOpen, NotebookPen, Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { EmptyState } from '../components/EmptyState';
import { EntryCard } from '../components/EntryCard';
import { PageHeader } from '../components/PageHeader';
import { entryDay, filterEntries, isEntryEmpty } from '../domain/journal';
import { useJournalEntries } from '../hooks/useStores';

function monthLabel(month: string) {
  const [y, m] = month.split('-').map(Number) as [number, number];
  return new Date(y, m - 1, 1).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
}

export function JournalScreen() {
  const all = useJournalEntries();
  const entries = useMemo(() => all.filter((e) => !isEntryEmpty(e)), [all]);
  const [text, setText] = useState('');
  const [month, setMonth] = useState('');
  const [proverbId, setProverbId] = useState('');

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
        <label className="relative block">
          <span className="sr-only">Search your journal</span>
          <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-faint" aria-hidden />
          <input
            type="search"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Search your reflections"
            className="field pl-11"
            autoComplete="off"
          />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="sr-only">Filter by month</span>
            <select value={month} onChange={(e) => setMonth(e.target.value)} className="field py-2.5 text-sm">
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
            <select value={proverbId} onChange={(e) => setProverbId(e.target.value)} className="field py-2.5 text-sm">
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
              className="inline-flex items-center gap-1 text-forest hover:underline"
              onClick={() => {
                setText('');
                setMonth('');
                setProverbId('');
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
