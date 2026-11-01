import type { ThemePreference } from '../domain/types';

const LIGHT_BAR = '#f6f2e9';
const DARK_BAR = '#121814';
const darkQuery = () => window.matchMedia('(prefers-color-scheme: dark)');

/** The theme actually shown, resolving "system" against the device setting. */
export function resolveTheme(pref: ThemePreference): 'light' | 'dark' {
  if (pref !== 'system') return pref;
  return typeof window !== 'undefined' && darkQuery().matches ? 'dark' : 'light';
}

/**
 * Apply a theme preference to the document. "system" removes the attribute so
 * the CSS media query decides; explicit choices set `data-theme`. Returns a
 * cleanup function that stops following system changes.
 */
export function applyTheme(pref: ThemePreference): () => void {
  const root = document.documentElement;
  if (pref === 'system') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', pref);

  const updateBar = () => {
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', resolveTheme(pref) === 'dark' ? DARK_BAR : LIGHT_BAR);
  };
  updateBar();
  if (pref !== 'system') return () => {};
  const mq = darkQuery();
  mq.addEventListener('change', updateBar);
  return () => mq.removeEventListener('change', updateBar);
}
