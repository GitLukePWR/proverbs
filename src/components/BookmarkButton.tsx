import { Bookmark, BookmarkCheck } from 'lucide-react';
import { services } from '../app/services';
import { useBookmarks } from '../hooks/useStores';
import { useNavigate } from 'react-router';
import { useToast } from './Toast';

export function BookmarkButton({ proverbId, reference }: { proverbId: string; reference: string }) {
  const { ids } = useBookmarks();
  const toast = useToast();
  const navigate = useNavigate();
  const saved = ids.has(proverbId);

  const toggle = () => {
    try {
      const nowSaved = services.bookmarks.toggle(proverbId);
      if (nowSaved) toast(`${reference} saved`, { label: 'View saved', onClick: () => navigate('/explore?tab=saved') });
      else toast(`${reference} removed from saved`, { label: 'Undo', onClick: () => services.bookmarks.toggle(proverbId) });
    } catch {
      toast('Could not save — browser storage is unavailable');
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${reference} from saved` : `Save ${reference}`}
      className="icon-btn"
    >
      {saved ? (
        <BookmarkCheck size={20} strokeWidth={1.75} className="fill-sage-wash text-forest" aria-hidden />
      ) : (
        <Bookmark size={20} strokeWidth={1.75} aria-hidden />
      )}
    </button>
  );
}
