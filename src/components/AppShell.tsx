import { BookOpen, Compass, NotebookPen, Settings, Sprout } from 'lucide-react';
import { NavLink, Outlet, ScrollRestoration, useLocation } from 'react-router';
import { useEffect } from 'react';
import { useJournalEntries, usePreferences } from '../hooks/useStores';
import { useToday } from '../hooks/useToday';
import { currentStreak } from '../domain/streak';
import { isEntryEmpty } from '../domain/journal';
import { Wordmark } from './Wordmark';
import { applyTheme } from '../platform/theme';

const NAV = [
  { to: '/', label: 'Today', icon: BookOpen, end: true },
  { to: '/journal', label: 'Journal', icon: NotebookPen, end: false },
  { to: '/explore', label: 'Explore', icon: Compass, end: false },
] as const;

function useStreak() {
  const entries = useJournalEntries();
  const today = useToday();
  const days = entries.filter((e) => !isEntryEmpty(e)).map((e) => e.writtenOn);
  return currentStreak(days, today);
}

function isTodayPath(pathname: string) {
  return pathname === '/' || pathname.startsWith('/day/');
}

export function AppShell() {
  const { pathname } = useLocation();
  const prefs = usePreferences();
  const streak = useStreak();

  useEffect(() => applyTheme(prefs.theme), [prefs.theme]);

  return (
    <div data-reading={prefs.readingSize} className="min-h-dvh bg-cream">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-forest focus:px-4 focus:py-2 focus:text-cream"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-30 border-b border-line/70 bg-cream/92 backdrop-blur-sm pt-[env(safe-area-inset-top)]">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 md:px-8">
          <Wordmark />

          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-1">
              {NAV.map(({ to, label, end }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={end}
                    className={({ isActive }) =>
                      `rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                        isActive || (to === '/' && isTodayPath(pathname))
                          ? 'bg-sage-wash text-forest'
                          : 'text-muted hover:text-forest'
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1">
            {streak > 1 && (
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium text-sage-deep"
                title={`You've reflected ${streak} days in a row`}
              >
                <Sprout size={15} aria-hidden />
                <span>
                  {streak}
                  <span className="sr-only"> days of reflection in a row</span>
                  <span aria-hidden className="hidden sm:inline"> days</span>
                </span>
              </span>
            )}
            <NavLink
              to="/settings"
              aria-label="Settings"
              className={({ isActive }) => `icon-btn ${isActive ? 'bg-sage-wash' : ''}`}
            >
              <Settings size={20} strokeWidth={1.75} aria-hidden />
            </NavLink>
          </div>
        </div>
      </header>

      {/* New screens open at the top; Back/Forward restores where you were. */}
      <ScrollRestoration />

      <main id="main" className="mx-auto max-w-6xl px-5 pb-32 pt-6 md:px-8 md:pb-20 md:pt-10">
        <Outlet />
      </main>

      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/95 backdrop-blur-sm pb-[env(safe-area-inset-bottom)] md:hidden"
      >
        <ul className="mx-auto grid max-w-md grid-cols-3">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) => {
                  const active = isActive || (to === '/' && isTodayPath(pathname));
                  return `flex flex-col items-center gap-1 py-2.5 text-[0.7rem] font-medium tracking-wide transition-colors ${
                    active ? 'text-forest' : 'text-faint hover:text-muted'
                  }`;
                }}
              >
                {({ isActive }) => {
                  const active = isActive || (to === '/' && isTodayPath(pathname));
                  return (
                    <>
                      <span
                        className={`flex h-7 w-12 items-center justify-center rounded-full transition-colors ${active ? 'bg-sage-wash' : ''}`}
                      >
                        <Icon size={19} strokeWidth={active ? 2 : 1.6} aria-hidden />
                      </span>
                      {label}
                    </>
                  );
                }}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
