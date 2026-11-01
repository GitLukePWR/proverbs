import { Navigate, RouterProvider, createHashRouter } from 'react-router';
import { AppShell } from './components/AppShell';
import { ToastProvider } from './components/Toast';
import { ChapterScreen } from './screens/ChapterScreen';
import { ExploreScreen } from './screens/ExploreScreen';
import { JournalEntryScreen } from './screens/JournalEntryScreen';
import { JournalScreen } from './screens/JournalScreen';
import { NotFoundScreen } from './screens/NotFoundScreen';
import { ProverbScreen } from './screens/ProverbScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { TodayScreen } from './screens/TodayScreen';
import { WisdomScreen } from './screens/WisdomScreen';

/**
 * Hash-based routing (`/#/journal`) works on GitHub Pages without server
 * rewrites and inside a Capacitor WebView without configuration. A data
 * router is used so scroll position is restored on Back/Forward.
 * Journal text never appears in a URL.
 */
const router = createHashRouter([
  {
    element: <AppShell />,
    children: [
      { index: true, element: <TodayScreen /> },
      { path: 'day/:date', element: <TodayScreen /> },
      { path: 'journal', element: <JournalScreen /> },
      { path: 'journal/:id', element: <JournalEntryScreen /> },
      { path: 'explore', element: <ExploreScreen /> },
      { path: 'explore/chapter/:chapter', element: <ChapterScreen /> },
      { path: 'proverb/:id', element: <ProverbScreen /> },
      { path: 'wisdom/:id', element: <WisdomScreen /> },
      // Saved now lives inside Explore; keep the old address working.
      { path: 'saved', element: <Navigate to="/explore?tab=saved" replace /> },
      { path: 'settings', element: <SettingsScreen /> },
      { path: '*', element: <NotFoundScreen /> },
    ],
  },
]);

export function App() {
  return (
    <ToastProvider>
      <RouterProvider router={router} />
    </ToastProvider>
  );
}
