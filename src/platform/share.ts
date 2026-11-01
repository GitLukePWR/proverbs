/**
 * Sharing adapter. Uses the Web Share API where available and falls back to
 * the clipboard. A native build can swap this file for Capacitor's Share plugin.
 */
export type ShareOutcome = 'shared' | 'copied' | 'cancelled' | 'unavailable';

export async function shareText(payload: { title: string; text: string }): Promise<ShareOutcome> {
  const nav = typeof navigator !== 'undefined' ? navigator : undefined;
  if (nav?.share) {
    try {
      await nav.share(payload);
      return 'shared';
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return 'cancelled';
      // Otherwise fall through to clipboard.
    }
  }
  return (await copyText(payload.text)) ? 'copied' : 'unavailable';
}

export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through
  }
  try {
    const el = document.createElement('textarea');
    el.value = text;
    el.setAttribute('readonly', '');
    el.style.position = 'fixed';
    el.style.opacity = '0';
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand('copy');
    el.remove();
    return ok;
  } catch {
    return false;
  }
}

/** Public URL of the app (without the hash route), for share messages. */
export function appUrl(): string | undefined {
  if (typeof location === 'undefined' || !/^https?:$/.test(location.protocol)) return undefined;
  return `${location.origin}${location.pathname}`;
}
