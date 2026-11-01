import { ArrowLeft, Bookmark, X } from 'lucide-react';
import { Link } from 'react-router';
import { services } from '../app/services';
import { getProverb } from '../content/library';
import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';
import { ProverbListItem } from '../components/ProverbListItem';
import { useToast } from '../components/Toast';
import { useBookmarks, usePreferences } from '../hooks/useStores';

export function SavedScreen() {
  const { list } = useBookmarks();
  const prefs = usePreferences();
  const toast = useToast();
  const saved = list.flatMap((b) => {
    const p = getProverb(b.proverbId, prefs.translationId);
    return p ? [p] : [];
  });

  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/explore" className="mb-5 inline-flex items-center gap-1.5 text-sm text-muted hover:text-forest">
        <ArrowLeft size={16} aria-hidden /> Explore
      </Link>
      <PageHeader eyebrow="Saved" title="Proverbs you’ve kept" />
      {saved.length === 0 ? (
        <EmptyState icon={<Bookmark size={22} />} title="No saved proverbs yet" action={<Link to="/explore" className="btn-primary">Explore Proverbs</Link>}>
          Tap the bookmark on any proverb to keep it here.
        </EmptyState>
      ) : (
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
                        toast('Removed from saved');
                      } catch {
                        toast('Could not update — browser storage is unavailable');
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
      )}
    </div>
  );
}
