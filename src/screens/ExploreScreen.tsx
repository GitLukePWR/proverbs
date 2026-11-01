import { Bookmark, BookOpen, ChevronRight, CircleCheck, Grid3x3, Search, Signpost, X } from 'lucide-react';
import { useMemo, type ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router';
import { services } from '../app/services';
import { EmptyState } from '../components/EmptyState';
import { ProverbListItem } from '../components/ProverbListItem';
import { SearchField } from '../components/SearchField';
import { SegmentedTabs } from '../components/SegmentedTabs';
import { useToast } from '../components/Toast';
import { STUDY_COUNT, getProverb, listProverbs, studiesInChapter } from '../content/library';
import { SCENARIO_COUNT, listScenarios } from '../content/scenarioLibrary';
import { TOPICS, topicLabel } from '../content/topics';
import { CHAPTER_COUNT, getChapterVerses } from '../content/translations';
import { type ExploreTab, parseExploreTab } from '../domain/exploreTabs';
import { parseReference } from '../domain/reference';
import { searchProverbs, searchVerses } from '../domain/search';
import type { TopicId } from '../domain/types';
import { useBookmarks, usePreferences, useScenarioProgress } from '../hooks/useStores';

const isTopic = (v: string | null): v is TopicId => !!v && TOPICS.some((t) => t.id === v);

/**
 * Explore is organised as four directly reachable sections. The active
 * section, search text and topic live in the URL, so returning from a
 * proverb (Back) restores exactly what the user was looking at.
 */
export function ExploreScreen() {
  const [params, setParams] = useSearchParams();
  const { list: bookmarks } = useBookmarks();
  const progress = useScenarioProgress();
  const tab = parseExploreTab(params.get('tab'));
  const explored = listScenarios().filter((s) => progress[s.id]).length;

  const setTab = (next: ExploreTab) => {
    const p = new URLSearchParams(params);
    if (next === 'studies') p.delete('tab');
    else p.set('tab', next);
    setParams(p, { replace: true });
  };

  const panel = (id: ExploreTab, children: ReactNode) =>
    tab === id && (
      <div id={`explore-panel-${id}`} role="tabpanel" aria-labelledby={`explore-tab-${id}`} tabIndex={-1} className="animate-rise pt-6 focus:outline-none">
        {children}
      </div>
    );

  return (
    <div className="mx-auto max-w-4xl">
      <header className="mb-4">
        <h1 className="font-serif text-[2.1rem] leading-tight tracking-[-0.015em] text-forest md:text-[2.6rem]">Explore</h1>
        <p className="mt-1 text-[0.98rem] text-muted">Find a proverb, read a chapter, or practise wisdom in real situations.</p>
      </header>

      {/* Kept in view while scrolling so any section is one tap away. */}
      <div className="sticky top-[calc(4rem+env(safe-area-inset-top))] z-20 -mx-5 bg-cream/95 px-5 py-2 backdrop-blur-sm md:mx-0 md:px-0">
        <SegmentedTabs
          label="Explore sections"
          idPrefix="explore"
          value={tab}
          onChange={setTab}
          items={[
            { id: 'studies', label: 'Studies', icon: <Search size={15} aria-hidden /> },
            { id: 'chapters', label: 'Chapters', icon: <Grid3x3 size={15} aria-hidden /> },
            { id: 'wisdom', label: 'Scenarios', icon: <Signpost size={15} aria-hidden /> },
            { id: 'saved', label: 'Saved', icon: <Bookmark size={15} aria-hidden />, badge: bookmarks.length },
          ]}
        />
      </div>

      {panel('studies', <StudiesPanel />)}
      {panel('chapters', <ChaptersPanel />)}
      {panel('wisdom', <WisdomPanel explored={explored} />)}
      {panel('saved', <SavedPanel onBrowse={() => setTab('studies')} />)}
    </div>
  );
}

/* ------------------------------------------------------------------ */

function StudiesPanel() {
  const [params, setParams] = useSearchParams();
  const prefs = usePreferences();
  const q = params.get('q') ?? '';
  const topicParam = params.get('topic');
  const topic = isTopic(topicParam) ? topicParam : null;

  const proverbs = useMemo(() => listProverbs(prefs.translationId), [prefs.translationId]);
  const results = useMemo(() => searchProverbs(proverbs, { text: q, topic }), [proverbs, q, topic]);
  const ref = q ? parseReference(q) : null;
  const allChapters = useMemo(
    () => Array.from({ length: CHAPTER_COUNT }, (_, i) => ({ chapter: i + 1, verses: getChapterVerses(prefs.translationId, i + 1) })),
    [prefs.translationId],
  );
  const verseHits = useMemo(() => (q.trim().length > 2 && !ref ? searchVerses(allChapters, q, 30) : []), [allChapters, q, ref]);

  // Search and filters update the URL in place: no history spam, no scroll jump.
  const update = (next: { q?: string; topic?: TopicId | null }) => {
    const p = new URLSearchParams(params);
    if (next.q !== undefined) (next.q ? p.set('q', next.q) : p.delete('q'));
    if (next.topic !== undefined) (next.topic ? p.set('topic', next.topic) : p.delete('topic'));
    setParams(p, { replace: true, preventScrollReset: true });
  };
  const filtering = !!(q || topic);

  return (
    <>
      <SearchField value={q} onChange={(v) => update({ q: v })} label="Search studies by reference or keyword" placeholder="Try “3:5”, “anger” or “friend”" />

      <div role="group" aria-label="Filter by topic" className="-mx-5 mt-3 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] md:mx-0 md:flex-wrap md:overflow-visible md:px-0">
        <button type="button" className="chip shrink-0" aria-pressed={!topic} onClick={() => update({ topic: null })}>
          All topics
        </button>
        {TOPICS.map((t) => (
          <button key={t.id} type="button" className="chip shrink-0" aria-pressed={topic === t.id} onClick={() => update({ topic: topic === t.id ? null : t.id })}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="mb-3 mt-5 flex min-h-11 flex-wrap items-center justify-between gap-2 px-1">
        <p className="text-sm text-muted" aria-live="polite">
          {filtering ? (
            <>
              {results.length} of {STUDY_COUNT} studies
              {topic && <> in <strong className="font-semibold text-forest">{topicLabel(topic)}</strong></>}
            </>
          ) : (
            <>{STUDY_COUNT} guided studies from across Proverbs</>
          )}
        </p>
        {filtering && (
          <button type="button" onClick={() => update({ q: '', topic: null })} className="inline-flex min-h-11 items-center gap-1 rounded-full px-2 text-sm font-medium text-forest hover:underline">
            <X size={14} aria-hidden /> Clear
          </button>
        )}
      </div>

      {ref && (
        <Link
          to={`/explore/chapter/${ref.chapter}${ref.verseStart ? `?v=${ref.verseStart}` : ''}`}
          className="mb-4 flex min-h-12 items-center justify-between gap-3 rounded-xl border border-line bg-paper px-4 py-3 text-sm font-medium text-forest hover:border-line-strong"
        >
          <span className="inline-flex items-center gap-2">
            <BookOpen size={16} aria-hidden /> Read Proverbs {ref.chapter}
            {ref.verseStart ? `:${ref.verseStart}` : ''} in full
          </span>
          <ChevronRight size={16} aria-hidden />
        </Link>
      )}

      {results.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line-strong px-6 py-10 text-center text-muted">
          <p>No guided studies match{q ? ` “${q}”` : ''}{topic ? ` in ${topicLabel(topic)}` : ''}.</p>
          {verseHits.length > 0 && <p className="mt-1 text-sm">There are matches in the full text below.</p>}
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

      {verseHits.length > 0 && (
        <section aria-labelledby="verses-heading" className="mt-10">
          <h2 id="verses-heading" className="eyebrow mb-3 px-1">
            In the full text of Proverbs
          </h2>
          <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-paper">
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
    </>
  );
}

function ChaptersPanel() {
  return (
    <section aria-labelledby="chapters-heading">
      <h2 id="chapters-heading" className="sr-only">
        Chapters
      </h2>
      <p className="mb-4 px-1 text-sm text-muted">Read any of the 31 chapters in full.</p>
      <ul className="grid grid-cols-5 gap-2 min-[400px]:grid-cols-6 sm:grid-cols-8 md:grid-cols-[repeat(11,minmax(0,1fr))]">
        {Array.from({ length: CHAPTER_COUNT }, (_, i) => i + 1).map((chapter) => {
          const studies = studiesInChapter(chapter).length;
          return (
            <li key={chapter}>
              <Link
                to={`/explore/chapter/${chapter}`}
                className="relative flex aspect-square min-h-12 items-center justify-center rounded-xl border border-line bg-paper font-serif text-lg text-forest transition-colors hover:border-forest hover:bg-sage-wash"
                aria-label={`Proverbs chapter ${chapter}${studies ? `, ${studies} guided ${studies === 1 ? 'study' : 'studies'}` : ''}`}
              >
                {chapter}
                {studies > 0 && <span aria-hidden className="absolute bottom-1.5 h-1 w-1 rounded-full bg-sage-deep" />}
              </Link>
            </li>
          );
        })}
      </ul>
      <p className="mt-4 px-1 text-xs text-faint">
        <span aria-hidden className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-sage-deep align-middle" />
        Includes a guided study
      </p>
    </section>
  );
}

function WisdomPanel({ explored }: { explored: number }) {
  const progress = useScenarioProgress();
  const prefs = usePreferences();
  return (
    <section aria-labelledby="wisdom-heading">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2 px-1">
        <h2 id="wisdom-heading" className="font-serif text-xl text-forest">
          Wisdom in Action
        </h2>
        <span className="text-sm text-muted">
          {explored} of {SCENARIO_COUNT} explored
        </span>
      </div>
      <p className="mb-5 px-1 text-sm leading-relaxed text-muted">
        Short, realistic decisions. Choose a response, see how it might play out, and connect it to Scripture. About two minutes each.
      </p>
      <ul className="grid gap-2.5 md:grid-cols-2">
        {listScenarios().map((sc) => {
          const done = !!progress[sc.id];
          const linked = getProverb(sc.proverbId, prefs.translationId);
          return (
            <li key={sc.id}>
              <Link
                to={`/wisdom/${sc.id}`}
                className="group flex min-h-[4.5rem] items-center gap-3 rounded-2xl border border-line bg-paper px-4 py-3 transition-colors hover:border-line-strong"
              >
                <span className="min-w-0 flex-1">
                  <span className="block font-medium leading-snug text-ink">{sc.title}</span>
                  <span className="mt-0.5 block text-xs text-muted">
                    {linked?.reference} · {sc.topics.slice(0, 2).map(topicLabel).join(', ')}
                  </span>
                </span>
                {done && (
                  <span className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-sage-deep">
                    <CircleCheck size={15} aria-hidden /> Explored
                  </span>
                )}
                <ChevronRight size={16} className="shrink-0 text-faint transition-transform group-hover:translate-x-0.5" aria-hidden />
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function SavedPanel({ onBrowse }: { onBrowse: () => void }) {
  const { list } = useBookmarks();
  const prefs = usePreferences();
  const toast = useToast();
  const saved = list.flatMap((b) => {
    const p = getProverb(b.proverbId, prefs.translationId);
    return p ? [p] : [];
  });

  if (saved.length === 0) {
    return (
      <EmptyState
        icon={<Bookmark size={22} />}
        title="No saved proverbs yet"
        action={
          <button type="button" onClick={onBrowse} className="btn-primary">
            Browse studies
          </button>
        }
      >
        Tap the bookmark on any proverb to keep it here.
      </EmptyState>
    );
  }

  return (
    <section aria-labelledby="saved-heading">
      <h2 id="saved-heading" className="sr-only">
        Saved proverbs
      </h2>
      <ul className="space-y-3">
        {saved.map((p) => (
          <li key={p.id}>
            <ProverbListItem
              proverb={p}
              trailing={
                <button
                  type="button"
                  className="icon-btn text-muted"
                  aria-label={`Remove ${p.reference} from saved`}
                  onClick={() => {
                    try {
                      services.bookmarks.remove(p.id);
                      toast(`${p.reference} removed`, { label: 'Undo', onClick: () => services.bookmarks.toggle(p.id) });
                    } catch {
                      toast('Couldn’t update — browser storage is unavailable');
                    }
                  }}
                >
                  <X size={18} aria-hidden />
                </button>
              }
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
