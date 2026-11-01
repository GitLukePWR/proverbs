import { Check } from 'lucide-react';
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';

interface ToastState {
  id: number;
  message: string;
}

const ToastContext = createContext<(message: string) => void>(() => {});

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const timer = useRef<number | undefined>(undefined);

  const show = useCallback((message: string) => {
    window.clearTimeout(timer.current);
    setToast({ id: Date.now(), message });
    timer.current = window.setTimeout(() => setToast(null), 2800);
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
            className="animate-rise flex items-center gap-2 rounded-full bg-forest px-4 py-2.5 text-sm text-cream shadow-[0_8px_24px_-12px_rgba(29,39,33,0.5)]"
          >
            <Check size={16} aria-hidden className="text-sage" />
            {toast.message}
          </div>
        )}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
