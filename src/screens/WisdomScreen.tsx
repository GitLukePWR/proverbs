import { ChevronRight, SearchX } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router';
import { BackLink } from '../components/BackLink';
import { EmptyState } from '../components/EmptyState';
import { WisdomInAction } from '../components/WisdomInAction';
import { getProverb } from '../content/library';
import { getScenario, listScenarios } from '../content/scenarioLibrary';
import { usePreferences, useScenarioProgress } from '../hooks/useStores';

/**
 * A single Wisdom in Action scenario, opened from Explore → Scenarios.
 * Focused on the activity itself; the full study and journal are one tap away.
 */
export function WisdomScreen() {
  const { id = '' } = useParams();
  const prefs = usePreferences();
  const progress = useScenarioProgress();
  const navigate = useNavigate();
  const scenario = getScenario(id);
  const proverb = scenario && getProverb(scenario.proverbId, prefs.translationId);

  if (!scenario || !proverb) {
    return (
      <EmptyState icon={<SearchX size={22} />} title="Scenario not found" action={<Link to="/explore?tab=wisdom" className="btn-primary">All scenarios</Link>}>
        It may have been renamed. Browse the full list instead.
      </EmptyState>
    );
  }

  // Suggest the next scenario not yet explored, so browsing doesn't dead-end.
  const all = listScenarios();
  const index = all.findIndex((s) => s.id === scenario.id);
  const ordered = [...all.slice(index + 1), ...all.slice(0, index)];
  const next = ordered.find((s) => !progress[s.id]) ?? ordered[0];

  return (
    <div className="mx-auto max-w-[44rem] animate-rise">
      <BackLink fallback="/explore?tab=wisdom" />
      <WisdomInAction
        key={scenario.id}
        scenario={scenario}
        proverb={proverb}
        context="library"
        headingLevel="h1"
        onRevisitProverb={() => navigate(`/proverb/${proverb.id}`)}
        onReflect={() => navigate(`/proverb/${proverb.id}`, { state: { reflectOnScenario: scenario.id } })}
      />
      {next && next.id !== scenario.id && progress[scenario.id] && (
        <Link
          to={`/wisdom/${next.id}`}
          replace
          className="mt-4 flex min-h-14 items-center justify-between gap-3 rounded-2xl border border-line bg-paper px-5 py-3 transition-colors hover:border-line-strong"
        >
          <span>
            <span className="block text-xs text-muted">Next scenario</span>
            <span className="font-medium text-ink">{next.title}</span>
          </span>
          <ChevronRight size={18} className="text-faint" aria-hidden />
        </Link>
      )}
    </div>
  );
}
