import { useRef, type KeyboardEvent, type ReactNode } from 'react';

export interface TabItem<T extends string> {
  id: T;
  label: string;
  icon?: ReactNode;
  /** Optional small count shown after the label. */
  badge?: number;
}

interface Props<T extends string> {
  label: string;
  items: TabItem<T>[];
  value: T;
  onChange: (id: T) => void;
  /** Prefix for tab/panel ids so panels can reference their tab. */
  idPrefix: string;
}

/**
 * A compact segmented control with full tab semantics: arrow keys / Home /
 * End move between tabs (roving tabindex), and the selected tab is shown by
 * shape and weight, not colour alone.
 */
export function SegmentedTabs<T extends string>({ label, items, value, onChange, idPrefix }: Props<T>) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: KeyboardEvent, index: number) => {
    const last = items.length - 1;
    const next =
      e.key === 'ArrowRight' ? (index === last ? 0 : index + 1)
      : e.key === 'ArrowLeft' ? (index === 0 ? last : index - 1)
      : e.key === 'Home' ? 0
      : e.key === 'End' ? last
      : null;
    if (next === null) return;
    e.preventDefault();
    const item = items[next];
    if (!item) return;
    onChange(item.id);
    refs.current[next]?.focus();
  };

  return (
    <div role="tablist" aria-label={label} className="grid auto-cols-fr grid-flow-col gap-1 rounded-full border border-line bg-paper p-1">
      {items.map((item, index) => {
        const selected = item.id === value;
        return (
          <button
            key={item.id}
            ref={(el) => {
              refs.current[index] = el;
            }}
            id={`${idPrefix}-tab-${item.id}`}
            role="tab"
            type="button"
            aria-selected={selected}
            aria-controls={`${idPrefix}-panel-${item.id}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(item.id)}
            onKeyDown={(e) => onKeyDown(e, index)}
            className={`flex min-h-11 min-w-0 items-center justify-center gap-1.5 rounded-full px-2 text-[0.82rem] transition-colors duration-200 sm:text-sm ${
              selected ? 'bg-forest font-semibold text-cream shadow-sm' : 'font-medium text-muted hover:bg-sage-wash hover:text-forest'
            }`}
          >
            {item.icon && <span className="hidden sm:inline-flex">{item.icon}</span>}
            <span className="truncate">{item.label}</span>
            {item.badge !== undefined && item.badge > 0 && (
              <span className={`text-[0.7rem] tabular-nums ${selected ? 'text-cream/75' : 'text-faint'}`}>{item.badge}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
