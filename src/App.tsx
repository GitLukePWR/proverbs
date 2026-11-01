import { HashRouter, Route, Routes } from 'react-router';
import { AppShell } from './components/AppShell';
import { ToastProvider } from './components/Toast';
import { ChapterScreen } from './screens/ChapterScreen';
import { ExploreScreen } from './screens/ExploreScreen';
import { JournalEntryScreen } from './screens/JournalEntryScreen';
import { JournalScreen } from './screens/JournalScreen';
import { NotFoundScreen } from './screens/NotFoundScreen';
import { ProverbScreen } from './screens/ProverbScreen';
import { SavedScreen } from './screens/SavedScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { TodayScreen } from './screens/TodayScreen';

/**
 * Hash-based routing (`/#/journal`) works on GitHub Pages without server
 * rewrites and inside a Capacitor WebView without any configuration.
 * Journal text never appears in a URL.
 */
export function App() {
  return (
    <HashRouter>
      <ToastProvider>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<TodayScreen />} />
            <Route path="day/:date" element={<TodayScreen />} />
            <Route path="journal" element={<JournalScreen />} />
            <Route path="journal/:id" element={<JournalEntryScreen />} />
            <Route path="explore" element={<ExploreScreen />} />
            <Route path="explore/chapter/:chapter" element={<ChapterScreen />} />
            <Route path="proverb/:id" element={<ProverbScreen />} />
            <Route path="saved" element={<SavedScreen />} />
            <Route path="settings" element={<SettingsScreen />} />
            <Route path="*" element={<NotFoundScreen />} />
          </Route>
        </Routes>
      </ToastProvider>
    </HashRouter>
  );
}
