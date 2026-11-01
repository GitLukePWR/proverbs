import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect } from 'react';
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router';
import { BackLink } from '../components/BackLink';
import { studiesInChapter } from '../content/library';
import { CHAPTER_COUNT, getChapterVerses, getTranslation } from '../content/translations';
import { containsVerse, formatReference } from '../domain/reference';
import { usePreferences } from '../hooks/useStores';

export function ChapterScreen() {
  const { chapter: param } = useParams();
  const [search] = useSearchParams();
  const navigate = useNavigate();
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

  if (!Number.isInteger(chapter) || chapter < 1 || chapter > CHAPTER_COUNT) return <Navigate to="/explore?tab=chapters" replace />;

  const verses = getChapterVerses(prefs.translationId, chapter);
  const studies = studiesInChapter(chapter);
  const translation = getTranslation(prefs.translationId);
  // Moving between chapters replaces the history entry, so Back always
  // returns to wherever the reader came from (e.g. the chapter grid).
  const goTo = (n: number) => navigate(`/explore/chapter/${n}`, { replace: true });

  return (
    <div className="mx-auto max-w-2xl animate-rise">
      <BackLink fallback="/explore?tab=chapters" />
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-1.5">{translation.name}</p>
          <h1 className="font-serif text-[2.2rem] leading-tight tracking-[-0.015em] text-forest md:text-[2.6rem]">Proverbs {chapter}</h1>
        </div>
        <nav aria-label="Chapters" className="flex items-center gap-1">
          <button type="button" onClick={() => goTo(chapter - 1)} disabled={chapter <= 1} className="icon-btn border border-line disabled:opacity-35" aria-label={`Previous chapter, Proverbs ${chapter - 1}`}>
            <ChevronLeft size={18} aria-hidden />
          </button>
          <label>
            <span className="sr-only">Go to chapter</span>
            <select value={chapter} onChange={(e) => goTo(Number(e.target.value))} className="field min-h-11 w-auto rounded-full py-2 pl-4 pr-8 text-sm">
              {Array.from({ length: CHAPTER_COUNT }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  Chapter {n}
                </option>
              ))}
            </select>
          </label>
          <button type="button" onClick={() => goTo(chapter + 1)} disabled={chapter >= CHAPTER_COUNT} className="icon-btn border border-line disabled:opacity-35" aria-label={`Next chapter, Proverbs ${chapter + 1}`}>
            <ChevronRight size={18} aria-hidden />
          </button>
        </nav>
      </header>

      {studies.length > 0 && (
        <p className="mb-6 rounded-xl bg-sage-wash/70 px-4 py-3 text-sm text-forest">
          Highlighted verses have a guided study — tap one to open it.
        </p>
      )}

      <ol className="space-y-1">
        {verses.map((v) => {
          const study = studies.find((s) => containsVerse(s, chapter, v.number));
          const isTarget = target === v.number;
          const content = (
            <>
              <span className="mr-2 align-[0.15em] font-sans text-[0.68rem] font-semibold text-sage-deep">{v.number}</span>
              {v.text}
            </>
          );
          return (
            <li key={v.number} id={`verse-${v.number}`} tabIndex={-1} className="scroll-mt-28 rounded-xl focus:outline-none">
              {study ? (
                <Link
                  to={`/proverb/${study.id}`}
                  className={`group block rounded-xl border-l-2 border-sage-deep px-3 py-2.5 font-serif text-[1.15rem] leading-relaxed text-ink transition-colors hover:bg-sage-wash ${
                    isTarget ? 'bg-sage-wash' : 'bg-paper'
                  }`}
                >
                  {content}
                  {study.verseStart === v.number && (
                    <span className="mt-1.5 flex items-center gap-1 font-sans text-xs font-medium text-forest">
                      Open study: {formatReference(study)} <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" aria-hidden />
                    </span>
                  )}
                </Link>
              ) : (
                <p className={`rounded-xl px-3 py-2 font-serif text-[1.15rem] leading-relaxed text-ink ${isTarget ? 'bg-sage-wash' : ''}`}>{content}</p>
              )}
            </li>
          );
        })}
      </ol>

      <nav aria-label="Next chapter" className="mt-10 flex justify-between gap-3">
        {chapter > 1 ? (
          <button type="button" onClick={() => goTo(chapter - 1)} className="btn-quiet">
            <ChevronLeft size={16} aria-hidden /> Proverbs {chapter - 1}
          </button>
        ) : (
          <span />
        )}
        {chapter < CHAPTER_COUNT && (
          <button type="button" onClick={() => goTo(chapter + 1)} className="btn-quiet">
            Proverbs {chapter + 1} <ChevronRight size={16} aria-hidden />
          </button>
        )}
      </nav>

      <p className="mt-8 text-xs text-faint">{translation.attribution}</p>
    </div>
  );
}
