import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router';
import type { JournalPrefill } from '../components/ReflectionJournal';
import { WisdomInAction } from '../components/WisdomInAction';
import { getScenario, scenariosForProverb } from '../content/scenarioLibrary';
import { journalStarter } from '../domain/scenarios';
import { scrollToElement } from '../platform/scroll';
import { getProverb } from '../content/library';
import { BackLink } from '../components/BackLink';
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
  const location = useLocation();
  const [search] = useSearchParams();
  const [prefill, setPrefill] = useState<(JournalPrefill & { editorKey: string }) | null>(null);
  const editorKey = `explore-${id}-${today}`;
  const proverb = getProverb(id, prefs.translationId);

  // A specific scenario can be requested (?scenario=…); otherwise show the first linked one.
  const requestedScenario = getScenario(search.get('scenario') ?? '');
  const scenario =
    requestedScenario && requestedScenario.proverbId === id ? requestedScenario : scenariosForProverb(id)[0];
  const reflectOn = (location.state as { reflectOnScenario?: string } | null)?.reflectOnScenario;

  useEffect(() => {
    // Arriving from Today's "Reflect in your journal" for a scenario linked to this proverb.
    const target = reflectOn ? getScenario(reflectOn) : undefined;
    if (target && target.proverbId === id) {
      setPrefill({ key: 'reflect', text: journalStarter(target), nonce: Date.now(), editorKey });
      navigate({ pathname: location.pathname, search: location.search }, { replace: true, state: null, preventScrollReset: true });
    } else if (requestedScenario && !reflectOn) {
      requestAnimationFrame(() => scrollToElement(`wisdom-${requestedScenario.id}`));
    }
    // Run once per arrival.
  }, [id, reflectOn]);

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
      editorKey={editorKey}
      label="Study"
      prefill={prefill?.editorKey === editorKey ? prefill : null}
      activity={
        scenario && (
          <WisdomInAction
            key={scenario.id}
            scenario={scenario}
            proverb={proverb}
            context="study"
            onRevisitProverb={() => scrollToElement(`proverb-${proverb.id}`, { focus: true })}
            onReflect={() => setPrefill({ key: 'reflect', text: journalStarter(scenario), nonce: Date.now(), editorKey })}
          />
        )
      }
      intro={<BackLink fallback="/explore" />}
      cardHeading="h1"
    />
  );
}
