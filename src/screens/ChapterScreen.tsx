import { ArrowLeft, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useEffect } from 'react';
import { Link, Navigate, useParams, useSearchParams } from 'react-router';
import { studiesInChapter } from '../content/library';
import { CHAPTER_COUNT, getChapterVerses, getTranslation } from '../content/translations';
import { containsVerse, formatReference } from '../domain/reference';
import { usePreferences } from '../hooks/useStores';

export function ChapterScreen() {
  const { chapter: param } = useParams();
  const [search] = useSearchParams();
  const prefs = usePreferences();
  const chapter = Number(param);
  const target = Number(search.get('v')) || null;

  useEffect(() => {
    if (!target) return;
    const el = document.getElementById(`verse-${target}`);
    if (el) {
      el.scrollIntoView({ block: 'center', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      el.focus({ preventScroll: true });
    }
  }, [chapter, target]);

  if (!Number.isInteger(chapter) || chapter < 1 || chapter > CHAPTER_COUNT) return <Navigate to="/explore" replace />;

  const verses = getChapterVerses(prefs.translationId, chapter);
  const studies = studiesInChapter(chapter);
  const translation = getTranslation(prefs.translationId);

  return (
    <div className="mx-auto max-w-2xl animate-rise">
      <Link to="/explore" className="mb-5 inline-flex items-center gap-1.5 text-sm text-muted hover:text-forest">
        <ArrowLeft size={16} aria-hidden /> Explore
      </Link>
      <header className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-1.5">{translation.name}</p>
          <h1 className="font-serif text-[2.2rem] leading-tight tracking-[-0.015em] text-forest md:text-[2.6rem]">Proverbs {chapter}</h1>
        </div>
        <nav aria-label="Chapters" className="flex gap-1">
          {chapter > 1 && (
            <Link to={`/explore/chapter/${chapter - 1}`} className="icon-btn border border-line" aria-label={`Proverbs ${chapter - 1}`}>
              <ChevronLeft size={18} aria-hidden />
            </Link>
          )}
          {chapter < CHAPTER_COUNT && (
            <Link to={`/explore/chapter/${chapter + 1}`} className="icon-btn border border-line" aria-label={`Proverbs ${chapter + 1}`}>
              <ChevronRight size={18} aria-hidden />
            </Link>
          )}
        </nav>
      </header>

      {studies.length > 0 && (
        <aside className="mb-8 rounded-2xl bg-sage-wash/70 px-5 py-4">
          <p className="flex items-center gap-2 text-sm font-medium text-forest">
            <Sparkles size={15} aria-hidden /> Guided {studies.length === 1 ? 'study' : 'studies'} in this chapter
          </p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {studies.map((s) => (
              <li key={s.id}>
                <Link to={`/proverb/${s.id}`} className="chip border-forest/30 bg-paper text-forest">
                  {formatReference(s)}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      )}

      <ol className="space-y-1">
        {verses.map((v) => {
          const study = studies.find((s) => containsVerse(s, chapter, v.number));
          const isTarget = target === v.number;
          return (
            <li
              key={v.number}
              id={`verse-${v.number}`}
              tabIndex={-1}
              className={`rounded-xl px-3 py-2 font-serif text-[1.15rem] leading-relaxed text-ink transition-colors ${
                isTarget ? 'bg-sage-wash' : study ? 'bg-paper' : ''
              }`}
            >
              <span className="mr-2 align-[0.15em] font-sans text-[0.68rem] font-semibold text-sage-deep">{v.number}</span>
              {v.text}
              {study && study.verseStart === v.number && (
                <Link to={`/proverb/${study.id}`} className="ml-2 whitespace-nowrap font-sans text-xs font-medium text-forest underline decoration-sage underline-offset-4 hover:decoration-forest">
                  Open study
                </Link>
              )}
            </li>
          );
        })}
      </ol>

      <p className="mt-10 text-xs text-faint">{translation.attribution}</p>
    </div>
  );
}
