import { BellOff, Download, HardDrive, Info, ShieldCheck, Trash2, TriangleAlert } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { services, storageRecoveredFromError } from '../app/services';
import { STUDY_COUNT } from '../content/library';
import { listTranslations } from '../content/translations';
import { PageHeader } from '../components/PageHeader';
import { useToast } from '../components/Toast';
import { toDateKey } from '../domain/dates';
import { entriesToJson, entriesToMarkdown, isEntryEmpty } from '../domain/journal';
import type { ReadingSize, TranslationId } from '../domain/types';
import { downloadFile } from '../platform/download';
import { useJournalEntries, usePreferences } from '../hooks/useStores';

function Section({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <section className="card px-5 py-5 md:px-7 md:py-6">
      <h2 className="flex items-center gap-2 font-serif text-xl text-forest">
        <span className="text-sage-deep">{icon}</span>
        {title}
      </h2>
      <div className="mt-4 space-y-4 text-[0.95rem] leading-relaxed text-muted">{children}</div>
    </section>
  );
}

export function SettingsScreen() {
  const prefs = usePreferences();
  const entries = useJournalEntries();
  const toast = useToast();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const written = entries.filter((e) => !isEntryEmpty(e));
  const translations = listTranslations();

  const updatePrefs = (patch: Parameters<typeof services.preferences.update>[0]) => {
    try {
      services.preferences.update(patch);
    } catch {
      toast('Could not save preference');
    }
  };

  const exportAs = (format: 'json' | 'md') => {
    const stamp = toDateKey(new Date());
    if (format === 'json') downloadFile(`wize-journal-${stamp}.json`, entriesToJson(written), 'application/json');
    else downloadFile(`wize-journal-${stamp}.md`, entriesToMarkdown(written), 'text/markdown');
    toast(`Exported ${written.length} ${written.length === 1 ? 'entry' : 'entries'}`);
  };

  const deleteAll = () => {
    try {
      services.journal.clear();
      setConfirmDelete(false);
      toast('All journal entries deleted');
    } catch {
      toast('Could not delete — browser storage is unavailable');
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader eyebrow="Settings" title="Settings & privacy" />

      {(storageRecoveredFromError || !services.storageIsPersistent) && (
        <div role="alert" className="mb-6 flex gap-3 rounded-2xl border border-clay/30 bg-clay/5 px-5 py-4 text-sm text-ink">
          <TriangleAlert size={18} className="mt-0.5 shrink-0 text-clay" aria-hidden />
          <p>
            {!services.storageIsPersistent
              ? 'This browser isn’t allowing Wize to store data (often due to private browsing). Anything you write will be lost when you close the tab.'
              : 'Some saved data couldn’t be read and was set aside so the app could keep working. A copy was kept in browser storage.'}
          </p>
        </div>
      )}

      <div className="space-y-5">
        <Section title="Reading" icon={<Info size={18} aria-hidden />}>
          <fieldset>
            <legend className="mb-2 text-sm font-medium text-ink">Text size</legend>
            <div className="flex gap-2">
              {(['standard', 'large'] as ReadingSize[]).map((size) => (
                <button key={size} type="button" className="chip" aria-pressed={prefs.readingSize === size} onClick={() => updatePrefs({ readingSize: size })}>
                  {size === 'standard' ? 'Standard' : 'Large'}
                </button>
              ))}
            </div>
          </fieldset>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-ink">Bible translation</span>
            <select
              className="field py-2.5"
              value={prefs.translationId}
              onChange={(e) => updatePrefs({ translationId: e.target.value as TranslationId })}
              disabled={translations.length < 2}
            >
              {translations.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.abbreviation})
                </option>
              ))}
            </select>
            <span className="mt-2 block text-xs">
              Wize uses the World English Bible, a faithful modern translation in the public domain. More translations may be added where licensing allows.
            </span>
          </label>
        </Section>

        <Section title="Your journal" icon={<HardDrive size={18} aria-hidden />}>
          <p>
            You have <strong className="font-semibold text-ink">{written.length}</strong> {written.length === 1 ? 'entry' : 'entries'}. They’re stored only in this
            browser on this device. They are not encrypted, not backed up and not synced. Clearing your browser data, or uninstalling the browser, will erase them.
          </p>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn-primary" onClick={() => exportAs('json')} disabled={written.length === 0}>
              <Download size={16} aria-hidden /> Export JSON
            </button>
            <button type="button" className="btn-quiet" onClick={() => exportAs('md')} disabled={written.length === 0}>
              <Download size={16} aria-hidden /> Export Markdown
            </button>
          </div>
          <p className="text-xs">Export regularly if your reflections matter to you. JSON is complete and machine-readable; Markdown is easy to read or print.</p>

          <div className="border-t border-line pt-4">
            {confirmDelete ? (
              <div role="alertdialog" aria-labelledby="delete-all" className="space-y-3">
                <p id="delete-all" className="text-ink">
                  Permanently delete all {written.length} journal entries from this device? Consider exporting first. This can’t be undone.
                </p>
                <div className="flex gap-2">
                  <button type="button" className="btn-quiet" onClick={() => setConfirmDelete(false)} autoFocus>
                    Cancel
                  </button>
                  <button type="button" className="btn-danger" onClick={deleteAll}>
                    Delete everything
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                className="inline-flex items-center gap-2 text-sm text-clay hover:underline disabled:opacity-50 disabled:no-underline"
                onClick={() => setConfirmDelete(true)}
                disabled={entries.length === 0}
              >
                <Trash2 size={15} aria-hidden /> Delete all journal entries
              </button>
            )}
          </div>
        </Section>

        <Section title="Privacy" icon={<ShieldCheck size={18} aria-hidden />}>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>Your reflections never leave this device. Wize has no server, no account and no analytics.</li>
            <li>Sharing a proverb only ever shares the Scripture (and, if you choose, the explanation) — never your journal.</li>
            <li>Anyone with access to this browser profile could open Wize and read your journal.</li>
          </ul>
        </Section>

        <Section title="Reminders" icon={<BellOff size={18} aria-hidden />}>
          <p>
            Daily reminders aren’t available yet. A website can’t reliably send notifications while it’s closed without extra infrastructure, so rather than offer
            something that might not work, reminders are planned for the iOS app.
          </p>
        </Section>

        <Section title="About Wize" icon={<Info size={18} aria-hidden />}>
          <p>
            Wize currently includes {STUDY_COUNT} guided studies, chosen from across the Book of Proverbs, alongside the full text of all 31 chapters. More studies
            will be added over time.
          </p>
          <p>
            Scripture quotations are from the World English Bible (WEB), which is in the public domain. The “In Today’s Words” explanations, practices and questions
            are original Wize writing — interpretation offered to help you reflect, not Scripture itself.
          </p>
          <p>
            In the WEB, “Yahweh” is the personal name of God in the Hebrew Scriptures, which many translations render as “the LORD”.
          </p>
        </Section>
      </div>
    </div>
  );
}
