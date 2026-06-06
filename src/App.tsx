import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import type { PageType } from './components/Sidebar';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Dashboard } from './pages/Dashboard';
import { GuildManagement } from './pages/GuildManagement';
import { TaskHall } from './pages/TaskHall';
import { CrossServerWar } from './pages/CrossServerWar';
import { Headquarters } from './pages/Headquarters';
import { Market } from './pages/Market';
import { WeeklyReport } from './pages/WeeklyReport';
import { Leaderboard } from './pages/Leaderboard';
import { useGameStore } from './store/gameStore';
import { Bell, X } from 'lucide-react';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  const { notification, setNotification } = useGameStore();

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [notification, setNotification]);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'guild':
        return <GuildManagement />;
      case 'tasks':
        return <TaskHall />;
      case 'war':
        return <CrossServerWar />;
      case 'headquarters':
        return <Headquarters />;
      case 'market':
        return <Market />;
      case 'report':
        return <WeeklyReport />;
      case 'ranking':
        return <Leaderboard />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-950">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <div className="flex-1 flex flex-col min-h-screen">
        <AnnouncementBar />
        <main className="flex-1 p-6 overflow-auto relative">
          {renderPage()}
          {notification && (
            <div className="fixed top-20 right-8 z-50 animate-bounce">
              <div className="flex items-center gap-3 bg-gradient-to-r from-purple-800/90 to-purple-900/90 border border-amber-400/50 rounded-xl px-5 py-3 shadow-2xl shadow-purple-900/60 backdrop-blur-md">
                <Bell size={20} className="text-amber-400" />
                <span className="text-white font-semibold">{notification}</span>
                <button onClick={() => setNotification(null)} className="ml-2 text-gray-400 hover:text-white">
                  <X size={16} />
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
