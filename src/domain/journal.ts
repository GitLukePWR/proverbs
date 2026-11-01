import { formatLongDate, formatDateTime } from './dates';
import { getTranslationName } from './translationNames';
import type { DateKey, JournalEntry, Proverb, ReflectionAnswers } from './types';
import { PROMPT_KEYS } from './types';

export const EMPTY_ANSWERS: ReflectionAnswers = { understand: '', reflect: '', act: '' };

export const PROMPT_LABELS: Record<keyof ReflectionAnswers, string> = {
  understand: 'Understand',
  reflect: 'Reflect',
  act: 'Act',
};

export function createId(prefix = 'je'): string {
  const random =
    typeof globalThis.crypto?.randomUUID === 'function'
      ? globalThis.crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  return `${prefix}_${random}`;
}

export interface NewEntryInput {
  proverb: Proverb;
  dailyDate: DateKey | null;
  writtenOn: DateKey;
  now: Date;
  answers?: Partial<ReflectionAnswers>;
  notes?: string;
}

export function createEntry({ proverb, dailyDate, writtenOn, now, answers, notes }: NewEntryInput): JournalEntry {
  const iso = now.toISOString();
  return {
    id: createId(),
    proverbId: proverb.id,
    proverbReference: proverb.reference,
    snapshot: { text: proverb.text, translationId: proverb.translationId, prompts: { ...proverb.prompts } },
    dailyDate,
    writtenOn,
    createdAt: iso,
    updatedAt: iso,
    answers: { ...EMPTY_ANSWERS, ...answers },
    notes: notes ?? '',
  };
}

export function isEntryEmpty(entry: Pick<JournalEntry, 'answers' | 'notes'>): boolean {
  return PROMPT_KEYS.every((k) => !entry.answers[k].trim()) && !entry.notes.trim();
}

export function entryPreview(entry: JournalEntry, maxLength = 160): string {
  const text = [...PROMPT_KEYS.map((k) => entry.answers[k]), entry.notes]
    .map((s) => s.trim())
    .filter(Boolean)
    .join(' · ')
    .replace(/\s+/g, ' ');
  return text.length > maxLength ? `${text.slice(0, maxLength - 1).trimEnd()}…` : text;
}

/** Newest first, by the day it belongs to, then by last edit. */
export function sortEntries(entries: readonly JournalEntry[]): JournalEntry[] {
  return [...entries].sort((a, b) => {
    const dayA = a.dailyDate ?? a.writtenOn;
    const dayB = b.dailyDate ?? b.writtenOn;
    if (dayA !== dayB) return dayA < dayB ? 1 : -1;
    return a.updatedAt < b.updatedAt ? 1 : a.updatedAt > b.updatedAt ? -1 : 0;
  });
}

export function entryDay(entry: JournalEntry): DateKey {
  return entry.dailyDate ?? entry.writtenOn;
}

export interface EntryFilter {
  text?: string;
  proverbId?: string | null;
  month?: string | null; // YYYY-MM
}

export function filterEntries(entries: readonly JournalEntry[], filter: EntryFilter): JournalEntry[] {
  const terms = (filter.text ?? '').toLowerCase().split(/\s+/).filter(Boolean);
  return entries.filter((e) => {
    if (filter.proverbId && e.proverbId !== filter.proverbId) return false;
    if (filter.month && !entryDay(e).startsWith(filter.month)) return false;
    if (terms.length === 0) return true;
    const hay = [e.proverbReference, e.snapshot.text, ...PROMPT_KEYS.map((k) => e.answers[k]), e.notes]
      .join(' ')
      .toLowerCase();
    return terms.every((t) => hay.includes(t));
  });
}

export function entriesToMarkdown(entries: readonly JournalEntry[]): string {
  const lines: string[] = ['# Wize journal', '', `Exported ${new Date().toISOString()}`, ''];
  for (const e of sortEntries(entries)) {
    lines.push(`## ${e.proverbReference} — ${formatLongDate(entryDay(e), 'en-GB')}`, '');
    lines.push(`> ${e.snapshot.text}`, `> — ${e.proverbReference} (${getTranslationName(e.snapshot.translationId)})`, '');
    for (const k of PROMPT_KEYS) {
      if (!e.answers[k].trim()) continue;
      lines.push(`**${PROMPT_LABELS[k]}: ${e.snapshot.prompts[k]}**`, '', e.answers[k].trim(), '');
    }
    if (e.notes.trim()) lines.push('**Notes**', '', e.notes.trim(), '');
    lines.push(`_Last edited ${formatDateTime(e.updatedAt, 'en-GB')}_`, '', '---', '');
  }
  return lines.join('\n');
}

export function entriesToJson(entries: readonly JournalEntry[]): string {
  return JSON.stringify(
    { app: 'wize', kind: 'journal-export', version: 1, exportedAt: new Date().toISOString(), entries: sortEntries(entries) },
    null,
    2,
  );
}
