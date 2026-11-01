# Wize usability audit

Audit of the full app (Today, Wisdom in Action, Journal, Explore, chapters, proverb pages, bookmarks, Settings, sharing and export). Findings come from code review plus a scripted probe and journey tests run in Chromium at 375×740 (phone), 820×1180 (tablet) and 1366×900 (desktop), in light and dark themes.

## Baseline measurements (before)

| Check | Result |
| --- | --- |
| Explore page height at 375px | 9,271px: search, studies, verse matches, chapters and scenarios stacked on one page |
| Scroll position after Back | Lost: the app scrolled to the top on every route change |
| Back on a directly opened proverb page | Left Wize (went to the previous website) |
| Controls under 44px | 9–16 per screen (40px icon buttons, 30–34px chips, 15–20px text links) |
| `h1` count on Today and past days | 2 |
| Light-theme helper text contrast | 3.3:1 (fails WCAG AA's 4.5:1) |
| Console errors / failed requests | None |

## Findings and fixes

### P0: critical

| # | Issue | Fix |
| --- | --- | --- |
| 1 | **Back could exit the app.** It called `history.back()` when the history length was over 1, even if the previous entry was another site. | A shared `BackLink` returns to the previous in-app screen, or to a sensible fallback (e.g. Explore → Chapters) when the page was opened directly. |
| 2 | **Small helper text failed contrast** in light mode (3.3:1), and sage labels on sage panels measured 4.35:1. | `faint` and `sage-deep` tokens darkened. They now measure ≥4.5:1 on every light surface; dark mode already passed. |
| 3 | **A failed save could be lost silently on leaving.** If storage was full, the draft stayed on screen, but closing the tab gave no warning and nothing retried. | Autosave now retries every 5s while failing, the status says so plainly, and the browser warns before the tab closes while text is unsaved. The save function is also stable, so flush-on-leave listeners aren't re-attached on every parent render. |

### P1: high impact

| # | Issue | Fix |
| --- | --- | --- |
| 4 | **Explore was one ~9,300px page**, with chapters and Wisdom in Action buried at the bottom. | Explore has a sticky segmented control (**Studies · Chapters · Scenarios · Saved**). Each section is one tap away and the active tab is clear. The tab, search and topic are kept in the URL. |
| 5 | **Scroll position lost on Back** (results, chapters, Today). | Moved to React Router's data router with `ScrollRestoration`: new screens open at the top and Back/Forward restores where you were. Search and filter changes update the URL in place with no scroll jump. |
| 6 | **Saved was a separate page** reached only from a small button. | Saved is a tab in Explore. `/saved` still works and redirects there. Bookmark toasts offer **View saved**, and removals offer **Undo**. |
| 7 | **Wisdom in Action had no browsing entry point**, and links into it landed halfway down a long study page. | New **Scenarios** tab, plus a focused scenario screen (`/wisdom/:id`) with Back, progress, and a "Next scenario" suggestion. |
| 8 | **Today was a long document with no way to jump ahead.** | Shortcuts under the date (**Wisdom in Action ↓**, **Reflect ↓**) jump to each section and show a ✓ when done. The day arrows moved onto the label row, so the proverb sits higher on screen. |
| 9 | **Touch targets under 44px** across the app. | Icon buttons, chips, buttons, back links, disclosure rows and text actions all meet 44×44px. Highlighted verses in the chapter reader are now fully tappable, replacing a 15px "Open study" link. |
| 10 | **Chapter reader:** "Back" always went to the top of Explore, and moving between chapters stacked up history. | Back returns to the Chapters tab, a chapter picker was added, and previous/next replace the history entry so Back leaves the reader in one step. |
| 11 | **Journal filters reset** after opening an entry. | Month and proverb filters are kept in the URL. The search words stay in memory for the session only: they could reveal private content, so they never enter the URL or browser history. |
| 12 | **Scenario instructions appeared after the options.** | A one-line explanation of what choosing does now sits above the options. |

### P2: refinement

| # | Issue | Fix |
| --- | --- | --- |
| 13 | Two `h1`s on Today. | The proverb card is an `h2` on Today and an `h1` on proverb pages. Every screen now has exactly one `h1`. |
| 14 | Share menu had no arrow-key navigation, and Escape lost focus. | Arrow keys, Home and End move through the menu, Tab closes it, and Escape returns focus to the Share button. |
| 15 | Inconsistent back controls ("← Explore", "← Journal", "Back"). | One `BackLink` pattern everywhere. |
| 16 | Settings icon had no active state. | Highlighted while on Settings. |
| 17 | Search fields had no clear button; the native one varied by browser. | Shared `SearchField` with a 44px **Clear search** button. |
| 18 | Daily scenario selection recomputed on every render. | Cached per date and proverb. |

## Results (after)

| Check | Result |
| --- | --- |
| Explore → Chapters page height at 375px | 960px (Scenarios 2,182px; a single scenario 1,272px) |
| Scroll restored after Back | Yes: chapter 1,743→1,743px, search results restored |
| Back on a directly opened page | Stays in Wize |
| Controls under 44px | 0 (one select renders at 43px) |
| `h1` per screen | 1 |
| Horizontal overflow at 375px | None on any screen |
| Journeys A–E (32 checks × mobile and desktop) | All pass |

## Known limitations

- The Studies tab lists all 45 studies, so it is still long when unfiltered. It is one list, not a stack of unrelated sections, and search and topic chips narrow it immediately.
- Journal search words are remembered for the current session only and reset when the app is reloaded (by design, for privacy).
- Testing was in Chromium. Safari/iOS-specific behaviour (e.g. the on-screen keyboard and `beforeunload` support) still needs checking on a real device.
