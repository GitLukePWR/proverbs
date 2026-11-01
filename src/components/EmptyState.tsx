import type { ReactNode } from 'react';

export function EmptyState({ icon, title, children, action }: { icon: ReactNode; title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-line-strong px-6 py-14 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sage-wash text-forest">{icon}</div>
      <h2 className="mt-4 font-serif text-xl text-forest">{title}</h2>
      {children && <div className="mt-2 max-w-sm text-[0.95rem] leading-relaxed text-muted">{children}</div>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
