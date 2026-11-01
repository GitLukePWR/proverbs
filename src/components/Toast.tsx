import { Check } from 'lucide-react';
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';

interface ToastAction {
  label: string;
  onClick: () => void;
}

interface ToastState {
  id: number;
  message: string;
  action?: ToastAction;
}

type ShowToast = (message: string, action?: ToastAction) => void;

const ToastContext = createContext<ShowToast>(() => {});

/**
 * One calm notification at a time, announced politely to screen readers.
 * An optional action (e.g. Undo) keeps the toast up a little longer.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const timer = useRef<number | undefined>(undefined);

  const show = useCallback<ShowToast>((message, action) => {
    window.clearTimeout(timer.current);
    setToast({ id: Date.now(), message, action });
    timer.current = window.setTimeout(() => setToast(null), action ? 6000 : 2800);
  }, []);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div
        aria-live="polite"
        role="status"
        className="pointer-events-none fixed inset-x-0 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-50 flex justify-center px-4 md:bottom-8"
      >
        {toast && (
          <div
            key={toast.id}
            className="animate-rise pointer-events-auto flex min-h-11 items-center gap-2 rounded-full bg-forest py-1.5 pl-4 pr-1.5 text-sm text-cream shadow-[0_8px_24px_-12px_rgba(0,0,0,0.5)]"
          >
            <Check size={16} aria-hidden className="shrink-0 text-sage" />
            <span className={toast.action ? '' : 'pr-2.5'}>{toast.message}</span>
            {toast.action && (
              <button
                type="button"
                onClick={() => {
                  toast.action?.onClick();
                  setToast(null);
                }}
                className="min-h-9 rounded-full px-3 font-semibold text-sage underline-offset-4 hover:underline"
              >
                {toast.action.label}
              </button>
            )}
          </div>
        )}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
