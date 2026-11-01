import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router';
import { topicLabel } from '../content/topics';
import type { Proverb } from '../domain/types';

export function ProverbListItem({ proverb, trailing }: { proverb: Proverb; trailing?: React.ReactNode }) {
  return (
    <div className="card group flex items-stretch transition-colors hover:border-line-strong">
      <Link to={`/proverb/${proverb.id}`} className="flex min-w-0 flex-1 items-start gap-4 rounded-2xl px-5 py-4 md:px-6">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-serif text-lg text-forest">{proverb.reference}</span>
            <span className="text-xs text-faint">{proverb.topics.slice(0, 3).map(topicLabel).join(' · ')}</span>
          </div>
          <p className="mt-1.5 line-clamp-2 font-serif text-[1.02rem] leading-relaxed text-ink/85">{proverb.text}</p>
        </div>
        <ChevronRight size={18} className="mt-1.5 shrink-0 text-faint transition-transform group-hover:translate-x-0.5" aria-hidden />
      </Link>
      {trailing && <div className="flex items-center pr-3">{trailing}</div>}
    </div>
  );
}
