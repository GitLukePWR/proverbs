import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router';
import { getProverb } from '../content/library';
import { EmptyState } from '../components/EmptyState';
import { ProverbStudyView } from '../components/ProverbStudyView';
import { useJournalEntries, usePreferences } from '../hooks/useStores';
import { useToday } from '../hooks/useToday';
import { SearchX } from 'lucide-react';

export function ProverbScreen() {
  const { id = '' } = useParams();
  const prefs = usePreferences();
  const today = useToday();
  const entries = useJournalEntries();
  const navigate = useNavigate();
  const proverb = getProverb(id, prefs.translationId);

  if (!proverb) {
    return (
      <EmptyState icon={<SearchX size={22} />} title="Proverb not found" action={<Link to="/explore" className="btn-primary">Explore Proverbs</Link>}>
        This study may have been moved. Try browsing or searching instead.
      </EmptyState>
    );
  }

  // Journaling from Explore: one entry per proverb per day you write.
  const entry = entries.find((e) => e.proverbId === proverb.id && e.dailyDate === null && e.writtenOn === today);

  return (
    <ProverbStudyView
      proverb={proverb}
      entry={entry}
      dailyDate={null}
      editorKey={`explore-${proverb.id}-${today}`}
      label="Study"
      intro={
        <button type="button" onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/explore'))} className="mb-5 inline-flex items-center gap-1.5 text-sm text-muted hover:text-forest">
          <ArrowLeft size={16} aria-hidden /> Back
        </button>
      }
    />
  );
}
