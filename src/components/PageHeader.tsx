import type { ReactNode } from 'react';

export function PageHeader({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: ReactNode }) {
  return (
    <header className="mb-8 md:mb-10">
      {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
      <h1 className="font-serif text-[2.1rem] leading-tight tracking-[-0.015em] text-forest md:text-[2.6rem]">{title}</h1>
      {children && <div className="mt-3 max-w-xl text-[1rem] leading-relaxed text-muted">{children}</div>}
    </header>
  );
}
