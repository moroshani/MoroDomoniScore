import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useGame } from './context/GameContext';
import { Auth } from './components/Auth';
import { AppHeader } from './components/AppHeader';
import { PageHintsModal } from './components/PageHintsModal';
import { PlayPage } from './pages/PlayPage';
import { ConnectivityBanner } from './components/ConnectivityBanner';
import { UpdateBanner } from './components/UpdateBanner';
import { ToastContainer } from './components/ToastContainer';
import { useToast } from './context/ToastContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { GameScreen } from './types';

const ProfilePage = lazy(() => import('./pages/ProfilePage').then((module) => ({ default: module.ProfilePage })));
const SettingsPage = lazy(() => import('./pages/SettingsPage').then((module) => ({ default: module.SettingsPage })));
const AccessPage = lazy(() => import('./pages/AccessPage').then((module) => ({ default: module.AccessPage })));

function App() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const { theme, toggleTheme, gameScreen } = useGame();
  const [isHintsOpen, setIsHintsOpen] = useState(false);
  const location = useLocation();
  const { pushToast } = useToast();
  const [exitArmed, setExitArmed] = useState(false);
  const showHeader = isAuthenticated;
  const compactHeader = location.pathname === '/' && gameScreen === GameScreen.Scoring;

  useEffect(() => {
    setExitArmed(false);
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname !== '/') return;
    const onPopState = () => {
      if (!exitArmed) {
        setExitArmed(true);
        pushToast('برای خروج دوباره برگردید.', 'info', 2000);
        window.history.pushState({ exitGuard: true }, '', window.location.href);
        window.setTimeout(() => setExitArmed(false), 2000);
      }
    };
    window.history.pushState({ exitGuard: true }, '', window.location.href);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [location.pathname, exitArmed, pushToast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary"></div>
        <p className="mt-4 text-lg text-text-secondary-light dark:text-text-secondary-dark">بارگذاری جلسه...</p>
      </div>
    );
  }

  const guarded = (element: React.ReactNode) => (isAuthenticated ? element : <Auth />);

  return (
    <ErrorBoundary>
      <div className="min-h-screen w-full font-sans antialiased relative">
        {showHeader && (
          <AppHeader
            isAuthenticated={isAuthenticated}
            userName={user?.name}
            userAvatar={user?.avatar || null}
            onLogout={logout}
            theme={theme}
            toggleTheme={toggleTheme}
            onOpenHints={() => setIsHintsOpen(true)}
            compact={compactHeader}
          />
        )}

        <ConnectivityBanner />
        <UpdateBanner />

        <main className="min-h-screen flex flex-col items-center justify-start p-3 sm:p-4 lg:p-8 pb-[calc(1rem+env(safe-area-inset-bottom))]">
          <Suspense
            fallback={(
              <div className="min-h-[40vh] flex flex-col items-center justify-center text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary"></div>
                <p className="mt-4 text-lg text-text-secondary-light dark:text-text-secondary-dark">در حال بارگذاری...</p>
              </div>
            )}
          >
            <Routes>
              <Route path="/" element={isAuthenticated ? <PlayPage /> : <Navigate to="/access" replace />} />
              <Route path="/profile" element={guarded(<ProfilePage />)} />
              <Route path="/settings" element={guarded(<SettingsPage />)} />
              <Route path="/auth" element={isAuthenticated ? <Navigate to="/" replace /> : <Auth />} />
              <Route path="/access" element={<AccessPage />} />
              <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/access"} replace />} />
            </Routes>
          </Suspense>
        </main>

        <PageHintsModal isOpen={isHintsOpen} onClose={() => setIsHintsOpen(false)} />
        <ToastContainer />
      </div>
    </ErrorBoundary>
  );
}

export default App;
