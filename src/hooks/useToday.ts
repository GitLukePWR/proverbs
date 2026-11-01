import { useEffect, useState } from 'react';
import { toDateKey } from '../domain/dates';
import type { DateKey } from '../domain/types';

/** Today's local date key, refreshed at midnight and when the app regains focus. */
export function useToday(): DateKey {
  const [today, setToday] = useState(() => toDateKey(new Date()));
  useEffect(() => {
    const refresh = () => setToday(toDateKey(new Date()));
    const now = new Date();
    const msToMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime();
    const timer = window.setTimeout(refresh, msToMidnight + 1000);
    document.addEventListener('visibilitychange', refresh);
    window.addEventListener('focus', refresh);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('visibilitychange', refresh);
      window.removeEventListener('focus', refresh);
    };
  }, [today]);
  return today;
}
