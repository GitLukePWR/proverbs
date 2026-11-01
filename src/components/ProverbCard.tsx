import { getTranslation } from '../content/translations';
import type { Proverb } from '../domain/types';
import { BookmarkButton } from './BookmarkButton';
import { ShareMenu } from './ShareMenu';

interface Props {
  proverb: Proverb;
  /** Small label above the reference, e.g. the formatted date. */
  label?: string;
  headingLevel?: 'h1' | 'h2';
}

export function ProverbCard({ proverb, label, headingLevel = 'h2' }: Props) {
  const translation = getTranslation(proverb.translationId);
  const Heading = headingLevel;
  const showVerseNumbers = proverb.verses.length > 1;

  return (
    <article id={`proverb-${proverb.id}`} className="card relative scroll-mt-24 overflow-hidden px-6 pb-6 pt-6 md:px-9 md:pb-8 md:pt-8" aria-labelledby={`ref-${proverb.id}`}>
      <div className="relative flex items-start justify-between gap-3">
        <div>
          {label && <p className="eyebrow mb-2">{label}</p>}
          <Heading id={`ref-${proverb.id}`} className="font-serif text-xl font-medium tracking-[-0.01em] text-forest md:text-2xl">
            {proverb.reference}
          </Heading>
        </div>
        <div className="-mr-2 -mt-1 flex items-center">
          <BookmarkButton proverbId={proverb.id} reference={proverb.reference} />
          <ShareMenu proverb={proverb} />
        </div>
      </div>

      <blockquote className="relative mt-5 md:mt-7">
        <p className="scripture text-ink text-pretty">
          {proverb.verses.map((v, i) => (
            <span key={v.number}>
              {showVerseNumbers && (
                <sup className="mr-1 align-super font-sans text-[0.55em] font-semibold text-sage-deep">{v.number}</sup>
              )}
              {v.text}
              {i < proverb.verses.length - 1 ? ' ' : ''}
            </span>
          ))}
        </p>
        <footer className="mt-5 flex flex-wrap items-center gap-x-2 text-xs text-muted">
          <span className="font-medium text-forest">{translation.name}</span>
          <span aria-hidden>·</span>
          <span>{translation.licence}</span>
        </footer>
      </blockquote>
    </article>
  );
}
