import { Link } from 'react-router';

/** The Wize wordmark: an italic serif W with a small sage "seed" for the dot. */
export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <Link
      to="/"
      aria-label="Wize — go to today"
      className={`group inline-flex items-baseline font-serif text-[1.65rem] leading-none tracking-[-0.02em] text-forest ${className}`}
    >
      <span className="italic font-medium" style={{ fontVariationSettings: "'opsz' 72" }}>
        W
      </span>
      <span className="font-normal" style={{ fontVariationSettings: "'opsz' 72" }}>
        ize
      </span>
      <span
        aria-hidden
        className="ml-[3px] inline-block h-[6px] w-[6px] translate-y-[-1px] rounded-full bg-sage transition-transform duration-500 ease-calm group-hover:scale-125"
      />
    </Link>
  );
}
