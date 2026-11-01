import { ChevronDown, Footprints, Lightbulb } from 'lucide-react';
import { Link } from 'react-router';
import { topicLabel } from '../content/topics';
import type { Proverb } from '../domain/types';

export function MeaningSection({ proverb }: { proverb: Proverb }) {
  return (
    <section aria-labelledby={`meaning-${proverb.id}`} className="px-1">
      <div className="flex items-center gap-2">
        <Lightbulb size={16} className="text-sage-deep" aria-hidden />
        <h2 id={`meaning-${proverb.id}`} className="eyebrow">
          In Today’s Words
        </h2>
      </div>
      <p className="prose-body mt-3 text-ink/90 text-pretty">{proverb.meaning}</p>
      <p className="mt-3 text-xs text-faint">A modern explanation written for Wize — interpretation, not Scripture.</p>
      {proverb.context && (
        <details className="group mt-4 border-t border-line pt-3">
          <summary className="flex cursor-pointer list-none items-center gap-1.5 text-sm font-medium text-forest [&::-webkit-details-marker]:hidden">
            <ChevronDown size={16} className="transition-transform duration-300 group-open:rotate-180" aria-hidden />
            Background
          </summary>
          <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{proverb.context}</p>
        </details>
      )}
    </section>
  );
}

export function PracticeSection({ proverb }: { proverb: Proverb }) {
  return (
    <section aria-labelledby={`practice-${proverb.id}`} className="rounded-2xl bg-forest px-6 py-6 text-cream md:px-8">
      <div className="flex items-center gap-2">
        <Footprints size={16} className="text-sage" aria-hidden />
        <h2 id={`practice-${proverb.id}`} className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-sage">
          Live It Today
        </h2>
      </div>
      <p className="mt-3 font-serif text-[1.2rem] leading-snug text-pretty md:text-[1.3rem]">{proverb.practice}</p>
    </section>
  );
}

export function TopicLinks({ proverb }: { proverb: Proverb }) {
  return (
    <ul className="flex flex-wrap gap-2 px-1" aria-label="Topics">
      {proverb.topics.map((t) => (
        <li key={t}>
          <Link to={`/explore?topic=${t}`} className="chip text-xs">
            {topicLabel(t)}
          </Link>
        </li>
      ))}
    </ul>
  );
}
