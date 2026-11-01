import { Search, X } from 'lucide-react';
import { useRef } from 'react';

/** Search input with a visible label (for screen readers), icon and a clear button. */
export function SearchField({
  value,
  onChange,
  label,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className="relative">
      <label>
        <span className="sr-only">{label}</span>
        <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-faint" aria-hidden />
        <input
          ref={ref}
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="field min-h-12 pl-11 pr-12 [&::-webkit-search-cancel-button]:hidden"
          autoComplete="off"
          enterKeyHint="search"
        />
      </label>
      {value && (
        <button
          type="button"
          onClick={() => {
            onChange('');
            ref.current?.focus();
          }}
          aria-label="Clear search"
          className="absolute right-1 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-muted hover:text-forest"
        >
          <X size={18} aria-hidden />
        </button>
      )}
    </div>
  );
}
