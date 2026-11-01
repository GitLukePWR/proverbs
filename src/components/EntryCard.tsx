import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router';
import { formatShortDate } from '../domain/dates';
import { entryDay, entryPreview } from '../domain/journal';
import type { JournalEntry } from '../domain/types';

export function EntryCard({ entry, compact = false }: { entry: JournalEntry; compact?: boolean }) {
  const preview = entryPreview(entry, compact ? 110 : 180);
  return (
    <Link
      to={`/journal/${encodeURIComponent(entry.id)}`}
      className="card group flex items-start gap-4 px-5 py-4 transition-colors hover:border-line-strong md:px-6"
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
          <span className="font-serif text-lg text-forest">{entry.proverbReference}</span>
          <span className="text-xs text-muted">
            <time dateTime={entryDay(entry)}>{formatShortDate(entryDay(entry))}</time>
            {entry.dailyDate ? ' · Daily' : ' · From Explore'}
          </span>
        </div>
        <p className="mt-1.5 line-clamp-2 text-[0.95rem] leading-relaxed text-ink/80">{preview || 'No text yet'}</p>
      </div>
      <ChevronRight size={18} className="mt-1.5 shrink-0 text-faint transition-transform group-hover:translate-x-0.5" aria-hidden />
    </Link>
  );
}
