import { ArrowLeft } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router';

/**
 * Consistent "back" control. Returns to the previous in-app screen (restoring
 * its scroll position and filters) when there is one; if the page was opened
 * directly, it goes to `fallback` instead of leaving Wize.
 */
export function BackLink({ fallback, label = 'Back' }: { fallback: string; label?: string }) {
  const navigate = useNavigate();
  const location = useLocation();
  const hasHistory = location.key !== 'default';
  return (
    <button
      type="button"
      onClick={() => (hasHistory ? navigate(-1) : navigate(fallback))}
      className="-ml-2 mb-3 inline-flex min-h-11 items-center gap-1.5 rounded-full px-2 text-sm text-muted transition-colors hover:text-forest"
    >
      <ArrowLeft size={16} aria-hidden /> {label}
    </button>
  );
}
