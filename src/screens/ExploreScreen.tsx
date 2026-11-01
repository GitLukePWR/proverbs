import { Bookmark, ChevronRight, CircleCheck, Search, Signpost, X } from 'lucide-react';
import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router';
import { STUDY_COUNT, listProverbs, studiesInChapter } from '../content/library';
import { TOPICS } from '../content/topics';
import { SCENARIO_COUNT, listScenarios } from '../content/scenarioLibrary';
import { CHAPTER_COUNT, getChapterVerses } from '../content/translations';
import { PageHeader } from '../components/PageHeader';
import { ProverbListItem } from '../components/ProverbListItem';
import { parseReference } from '../domain/reference';
import { searchProverbs, searchVerses } from '../domain/search';
import type { TopicId } from '../domain/types';
import { useBookmarks, usePreferences, useScenarioProgress } from '../hooks/useStores';

const isTopic = (v: string | null): v is TopicId => !!v && TOPICS.some((t) => t.id === v);

export function ExploreScreen() {
  const [params, setParams] = useSearchParams();
  const prefs = usePreferences();
  const { list: bookmarks } = useBookmarks();
  const scenarioProgress = useScenarioProgress();
  const q = params.get('q') ?? '';
  const topicParam = params.get('topic');
  const topic = isTopic(topicParam) ? topicParam : null;

  const proverbs = useMemo(() => listProverbs(prefs.translationId), [prefs.translationId]);
  const results = searchProverbs(proverbs, { text: q, topic });

  const allChapters = useMemo(
    () =>
      Array.from({ length: CHAPTER_COUNT }, (_, i) => ({ chapter: i + 1, verses: getChapterVerses(prefs.translationId, i + 1) })),
    [prefs.translationId],
  );
  const ref = q ? parseReference(q) : null;
  const verseHits = q.trim().length > 2 && !ref ? searchVerses(allChapters, q, 30) : [];

  const proverbById = new Map(proverbs.map((p) => [p.id, p]));
  const scenarios = listScenarios().filter((sc) => !topic || sc.topics.includes(topic));
  const exploredCount = listScenarios().filter((sc) => scenarioProgress[sc.id]).length;

  const update = (next: { q?: string; topic?: TopicId | null }) => {
    const p = new URLSearchParams(params);
    if (next.q !== undefined) (next.q ? p.set('q', next.q) : p.delete('q'));
    if (next.topic !== undefined) (next.topic ? p.set('topic', next.topic) : p.delete('topic'));
    setParams(p, { replace: true });
  };

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader eyebrow="Explore" title="Browse Proverbs">
        Wize currently offers {STUDY_COUNT} guided studies from across the book. You can also read every chapter of Proverbs in full.
      </PageHeader>

      <div className="space-y-4">
        <div className="flex gap-2">
          <label className="relative block flex-1">
            <span className="sr-only">Search by reference or keyword</span>
            <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-faint" aria-hidden />
            <input
              type="search"
              value={q}
              onChange={(e) => update({ q: e.target.value })}
              placeholder="Try “3:5”, “anger” or “friend”"
              className="field pl-11"
              autoComplete="off"
              enterKeyHint="search"
            />
          </label>
          <Link to="/saved" className="btn-quiet shrink-0 px-4" aria-label={`Saved proverbs (${bookmarks.length})`}>
            <Bookmark size={16} aria-hidden />
            <span className="hidden sm:inline">Saved</span>
            {bookmarks.length > 0 && <span className="text-xs text-muted">{bookmarks.length}</span>}
          </Link>
        </div>

        <div role="group" aria-label="Filter by topic" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 md:mx-0 md:flex-wrap md:overflow-visible md:px-0">
          <button type="button" className="chip shrink-0" aria-pressed={!topic} onClick={() => update({ topic: null })}>
            All
          </button>
          {TOPICS.map((t) => (
            <button
              key={t.id}
              type="button"
              className="chip shrink-0"
              aria-pressed={topic === t.id}
              onClick={() => update({ topic: topic === t.id ? null : t.id })}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {ref && (
        <p className="mt-6 text-sm">
          <Link to={`/explore/chapter/${ref.chapter}${ref.verseStart ? `?v=${ref.verseStart}` : ''}`} className="font-medium text-forest underline-offset-4 hover:underline">
            Read Proverbs {ref.chapter}
            {ref.verseStart ? `:${ref.verseStart}` : ''} in full →
          </Link>
        </p>
      )}

      <section aria-labelledby="studies-heading" className="mt-8">
        <div className="mb-3 flex items-baseline justify-between px-1">
          <h2 id="studies-heading" className="eyebrow">
            Guided studies
          </h2>
          <span className="text-xs text-muted" aria-live="polite">
            {results.length} of {STUDY_COUNT}
          </span>
        </div>
        {results.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line-strong px-6 py-10 text-center text-muted">
            <p>No guided studies match{q ? ` “${q}”` : ''}.</p>
            {(q || topic) && (
              <button type="button" onClick={() => update({ q: '', topic: null })} className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-forest hover:underline">
                <X size={14} aria-hidden /> Clear search
              </button>
            )}
          </div>
        ) : (
          <ul className="grid gap-3 md:grid-cols-2">
            {results.map((p) => (
              <li key={p.id}>
                <ProverbListItem proverb={p} />
              </li>
            ))}
          </ul>
        )}
      </section>

      {!q && scenarios.length > 0 && (
        <section aria-labelledby="wia-heading" className="mt-12">
          <div className="mb-3 flex items-baseline justify-between px-1">
            <h2 id="wia-heading" className="eyebrow flex items-center gap-1.5">
              <Signpost size={14} aria-hidden /> Wisdom in Action
            </h2>
            <span className="text-xs text-muted">
              {exploredCount} of {SCENARIO_COUNT} explored
            </span>
          </div>
          <p className="mb-4 px-1 text-sm text-muted">Real-life decisions to practise applying a proverb. Revisit any you’ve explored to review your choice.</p>
          <ul className="grid gap-2 md:grid-cols-2">
            {scenarios.map((sc) => {
              const done = !!scenarioProgress[sc.id];
              const linked = proverbById.get(sc.proverbId);
              return (
                <li key={sc.id}>
                  <Link
                    to={`/proverb/${sc.proverbId}?scenario=${sc.id}`}
                    className="group flex items-center gap-3 rounded-xl border border-line bg-paper px-4 py-3 transition-colors hover:border-line-strong"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium text-ink">{sc.title}</span>
                      <span className="text-xs text-muted">{linked?.reference}</span>
                    </span>
                    {done && (
                      <span className="inline-flex items-center gap-1 text-xs text-sage-deep">
                        <CircleCheck size={14} aria-hidden /> Explored
                      </span>
                    )}
                    <ChevronRight size={16} className="shrink-0 text-faint transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {verseHits.length > 0 && (
        <section aria-labelledby="verses-heading" className="mt-10">
          <h2 id="verses-heading" className="eyebrow mb-3 px-1">
            In the full text of Proverbs
          </h2>
          <ul className="divide-y divide-line rounded-2xl border border-line bg-paper">
            {verseHits.map((v) => (
              <li key={`${v.chapter}:${v.number}`}>
                <Link to={`/explore/chapter/${v.chapter}?v=${v.number}`} className="block px-5 py-3.5 hover:bg-sage-wash/50">
                  <span className="text-xs font-semibold text-sage-deep">
                    {v.chapter}:{v.number}
                  </span>
                  <span className="ml-2 font-serif text-[1.02rem] text-ink/90">{v.text}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="chapters-heading" className="mt-12">
        <h2 id="chapters-heading" className="eyebrow mb-3 px-1">
          Read by chapter
        </h2>
        <ul className="grid grid-cols-6 gap-2 sm:grid-cols-8 md:grid-cols-[repeat(16,minmax(0,1fr))]">
          {allChapters.map(({ chapter }) => {
            const studies = studiesInChapter(chapter).length;
            return (
              <li key={chapter}>
                <Link
                  to={`/explore/chapter/${chapter}`}
                  className="relative flex aspect-square items-center justify-center rounded-xl border border-line bg-paper font-serif text-lg text-forest transition-colors hover:border-forest hover:bg-sage-wash"
                  aria-label={`Proverbs chapter ${chapter}${studies ? `, ${studies} guided ${studies === 1 ? 'study' : 'studies'}` : ''}`}
                >
                  {chapter}
                  {studies > 0 && <span aria-hidden className="absolute bottom-1.5 h-1 w-1 rounded-full bg-sage" />}
                </Link>
              </li>
            );
          })}
        </ul>
        <p className="mt-3 px-1 text-xs text-faint">
          <span aria-hidden className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-sage align-middle" /> Chapter includes a guided study
        </p>
      </section>
    </div>
  );
}
