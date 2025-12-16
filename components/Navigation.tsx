import React from 'react';
import { User as UserIcon, Layers, BookOpen } from 'lucide-react';
import { AppView } from '../types';

interface NavigationProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, setView }) => {
  // Reordered: Home (Profile) -> Learn (Cards) -> Grammar
  const navItems = [
    { view: AppView.HOME, label: 'Profil', icon: UserIcon },
    { view: AppView.LEARN, label: 'Kartlar', icon: Layers },
    { view: AppView.GRAMMAR, label: 'Qrammatika', icon: BookOpen },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 safe-area-pb z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <div className="max-w-md mx-auto flex justify-around items-center h-16 px-6">
        {navItems.map((item) => {
          const isActive = currentView === item.view;
          return (
            <button
              key={item.view}
              onClick={() => setView(item.view)}
              className="flex flex-col items-center justify-center w-full h-full group"
            >
              <div className={`transition-all duration-300 ${isActive ? 'transform -translate-y-1' : ''}`}>
                <item.icon 
                  size={24} 
                  className={isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-500'} 
                  strokeWidth={isActive ? 2.5 : 2}
                  fill={isActive ? 'currentColor' : 'none'}
                  fillOpacity={0.1}
                />
              </div>
              <span className={`text-[10px] font-semibold mt-1 transition-colors ${
                isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-500'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Navigation;