import React, { useEffect, useState } from 'react';
import { Volume2 } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

export const AnnouncementBar: React.FC = () => {
  const { serverAnnouncements } = useGameStore();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % serverAnnouncements.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [serverAnnouncements.length]);

  return (
    <div className="bg-gradient-to-r from-amber-900/40 via-purple-900/40 to-amber-900/40 border-b border-amber-600/30 px-6 py-2 flex items-center gap-3">
      <Volume2 size={18} className="text-amber-400 flex-shrink-0" />
      <div className="overflow-hidden flex-1">
        <p
          key={currentIndex}
          className="text-amber-200 text-sm truncate animate-pulse"
        >
          {serverAnnouncements[currentIndex]}
        </p>
      </div>
    </div>
  );
};
