# Wize

**One proverb a day, explained in today's words, with space to reflect.**

Wize is a calm, private reading-and-journaling app built around the Book of Proverbs. Each day it presents a proverb from the public-domain World English Bible, explains it in plain modern English ("In Today's Words"), suggests one concrete action ("Live It Today"), and guides you through three reflection questions (Understand → Reflect → Act) that autosave to your device.

It is a static React app: no backend, no accounts, no analytics, no environment variables.

## Features

- **Today**: a deterministic daily proverb, its meaning, a practice, tailored reflection prompts and an autosaving journal. Step back through previous days to revisit their proverbs and entries.
- **Wisdom in Action**: a short interactive scenario on the Today screen. Read a realistic situation, choose one of three plausible responses, then see how it might play out, compare the alternatives, read the linked Scripture and an explanation of the connection, and optionally take a follow-up question into your journal. There are 20 curated scenarios; progress is saved and can be revisited from Explore.
- **Journal**: every reflection, newest first, with search, month/proverb filters, editing and deletion (with confirmation).
- **Explore**: 45 guided studies filterable by topic, search by reference (`3:5`, `prov 16`) or keyword, and the full text of all 31 chapters.
- **Saved**: bookmark any study.
- **Share**: Web Share API with clipboard fallback. Shares the Scripture text, plus the explanation if you choose. It never includes journal text.
- **Export**: download your journal as JSON (complete) or Markdown (readable).
- **Offline**: all content is bundled, and a small service worker caches the app after the first visit.
- Accessible: semantic HTML, keyboard navigation, visible focus, labelled icon buttons, reduced-motion support, mobile-first layout.

## Local development

Requires Node 20+ (CI uses 22).

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # unit tests (Vitest)
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build
```

## Deploying to GitHub Pages

The workflow in `.github/workflows/deploy.yml` tests, builds and deploys on every push to `main`.

One-time setup: in the repository go to **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**. Then push to `main` (or run the workflow manually). The site will be at `https://<user>.github.io/<repo>/`.

How static hosting is handled:

- `vite.config.ts` uses a **relative base (`./`)**, so the same build works under a project sub-path, at a domain root, or inside a native WebView. Set `BASE_PATH=/something/` at build time if you need an absolute base.
- Routing uses **hash URLs** (`/#/journal`), so deep links and refreshes work without server rewrites or a `404.html` trick.

## Architecture

```
src/
  domain/        Pure TypeScript: types, dates, daily selection, search, journal, streak, share text
  content/       Curated studies, topics, translation registry + WEB Proverbs text (JSON)
  storage/       Key–value abstraction, versioned documents, journal/bookmark/preference stores
  platform/      Browser adapters: share, download, service worker registration
  app/           Composition root (wires storage to the stores)
  hooks/         React bindings (useSyncExternalStore over the stores, autosave draft)
  components/    UI building blocks
  screens/       Routed pages
scripts/         extract-usfm.py: regenerates the Scripture JSON from eBible.org USFM
```

Key decisions:

- **Content is separate from presentation and from Scripture.** `studies.ts` holds only references plus original commentary. Verse text is looked up from the translation file at runtime, so the wording is always verbatim from the source, and adding a translation means adding one JSON file plus a registry entry.
- **Daily selection** (`domain/daily.ts`) maps the local calendar date to a day number, groups days into cycles the length of the library, and shuffles each cycle with a seeded PRNG. The same date always gives the same proverb, every study appears once per cycle, and no proverb repeats on consecutive days. Once you write an entry for a date, that entry pins the proverb, so history survives library changes.
- **Storage** goes through a tiny `KeyValueStore` interface (`storage/kv.ts`). Each document is stored as `{ version, data }`, migrated forward on read and sanitised field by field. Unreadable data is copied to a `*.unreadable-<timestamp>` key and the app carries on with defaults instead of crashing. Only `app/services.ts` knows that localStorage is in use.
- **Wisdom in Action** content lives in `content/scenarios.ts`, linked to studies by ID; Scripture is always resolved from the study library. `domain/scenarios.ts` picks the day's scenario: one linked to the day's proverb if available, otherwise one from the wider library (labelled as such), never the same scenario two days running. Options are shown in a fixed order per scenario that varies across the library, so the most considered response isn't always in the same place. Progress is a separate versioned document (`wize.scenarios`), so no migration of existing data was needed. "Reflect in your journal" starts the existing journal's *Reflect* answer with the follow-up question, only if that answer is empty.
- **Journal entries** store `proverbId`, the reference, and a snapshot of the Scripture text and prompts, so old entries stay meaningful if content changes.

## Data persistence & limitations

- Journal entries, bookmarks and preferences live in **this browser's localStorage on this device only**. They are **not encrypted, not backed up and not synced**. Clearing site data, using private browsing, or switching browser or device means losing them. Use **Settings → Export** regularly.
- Browsers cap localStorage at roughly 5 MB per site. That is years of text entries, but if a write fails the save indicator says so instead of failing silently.
- **Reminders are not implemented.** A static site can't reliably send scheduled notifications while closed, so they're deferred to the native app. The Settings page says this plainly.
- The library covers **45 guided studies**, not every proverb. All 31 chapters can be read in full, but only curated verses have explanations and prompts. The UI never presents the studies as the complete book.
- Wisdom in Action has 20 scenarios for 20 of the 45 studies. On other days a scenario from the wider library is shown and clearly labelled with its own proverb. Scenario progress, like the journal, is stored only on this device and isn't included in journal exports.
- Only one translation (WEB) ships today. The preference and registry are ready for more.

## Scripture licensing

Scripture text is the **World English Bible (WEB)**, which is in the **public domain**. It was extracted unchanged from the eBible.org USFM edition (`scripts/extract-usfm.py`; Strong's numbers and footnotes removed). The only condition its publishers ask is that the name "World English Bible" be reserved for faithful copies, which this is. The WEB renders God's personal name as "Yahweh" (many translations use "the LORD"), and the app explains this. Before adding any other translation, confirm its licence permits redistribution on a public website. Most modern translations (NIV, ESV, NLT, etc.) do not without permission.

The explanations, practices, prompts and context notes are original Wize writing and are labelled in the app as interpretation, not Scripture.

## Future iOS migration (Capacitor)

The codebase was shaped so it can be wrapped rather than rewritten:

1. `npm i @capacitor/core @capacitor/cli @capacitor/ios && npx cap init Wize com.example.wize --web-dir dist`
2. `npm run build && npx cap add ios && npx cap open ios`

The relative base and hash routing already work inside a WKWebView. Then swap the adapters rather than the app:

| Concern | Today (web) | Native replacement |
| --- | --- | --- |
| Storage | `createWebStorageStore` in `app/services.ts` | Capacitor Preferences / SQLite behind the same `KeyValueStore`, or a sync service (iCloud/accounts) |
| Sharing | `platform/share.ts` (Web Share/clipboard) | `@capacitor/share` |
| Export | `platform/download.ts` | `@capacitor/filesystem` + share sheet |
| Reminders | not offered | `@capacitor/local-notifications` |
| Privacy lock | n/a | Face ID via a biometric plugin before showing the journal |
| Widget | n/a | WidgetKit extension reusing `domain/daily.ts` logic and the content JSON |

`domain/` and `content/` have no React or browser dependencies, so they can be reused as they are (including by a future widget or server).
