import React, { useEffect, useState } from 'react';
import { Lock, CheckCircle2, Zap, Play } from 'lucide-react';
import { User } from '../types';
import { StorageService } from '../services/storageService';

interface LevelsProps {
  onStartLevel: (level: number, isReplay: boolean) => void;
}

const Levels: React.FC<LevelsProps> = ({ onStartLevel }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(StorageService.getCurrentUser());
  }, []);

  if (!user) return null;

  // Calculate total levels based on total words (10 words per level)
  const totalLevels = Math.ceil(user.totalWords / 10);
  const levels = Array.from({ length: totalLevels }, (_, i) => i + 1);

  return (
    <div className="bg-white min-h-screen font-sans flex flex-col h-full pb-24">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-slate-100">
        <header className="flex justify-between items-center px-6 pt-6 pb-4">
          <div>
              <h1 className="text-2xl font-bold text-slate-900">Səviyyələr</h1>
              <p className="text-slate-500 text-sm">Enerjini istifadə et və öyrən</p>
          </div>
          
          {/* Energy Widget */}
          <div className="flex items-center space-x-1 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
              <Zap className="text-blue-500 fill-blue-500" size={18} />
              <span className="font-bold text-blue-600 text-sm">{user.dailyEnergy}/2</span>
          </div>
        </header>
      </div>

      {/* Levels List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {levels.map((level) => {
            const isPassed = level < user.currentLevel;
            const isCurrent = level === user.currentLevel;
            const isLocked = level > user.currentLevel;

            return (
                <div 
                    key={level}
                    className={`
                        relative w-full rounded-3xl p-6 border-2 transition-all duration-300
                        ${isPassed 
                            ? 'bg-green-50 border-green-200 cursor-pointer hover:bg-green-100' 
                            : isCurrent 
                                ? 'bg-white border-blue-500 shadow-xl shadow-blue-100 scale-105 my-4 z-10'
                                : 'bg-slate-50 border-slate-100 opacity-60'
                        }
                    `}
                    onClick={() => {
                        if (isPassed) onStartLevel(level, true);
                    }}
                >
                    <div className="flex justify-between items-center">
                        <div>
                            <span className={`text-xs font-bold uppercase tracking-widest ${isPassed ? 'text-green-600' : isCurrent ? 'text-blue-500' : 'text-slate-400'}`}>
                                Səviyyə {level}
                            </span>
                            <h3 className={`text-xl font-bold mt-1 ${isLocked ? 'text-slate-400' : 'text-slate-800'}`}>
                                {isPassed ? 'Tamamlandı' : `10 Yeni Söz`}
                            </h3>
                        </div>

                        <div className={`
                            w-12 h-12 rounded-full flex items-center justify-center
                            ${isPassed ? 'bg-green-200 text-green-700' : isCurrent ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-400'}
                        `}>
                            {isPassed && <CheckCircle2 size={24} />}
                            {isCurrent && <Play size={24} fill="currentColor" />}
                            {isLocked && <Lock size={20} />}
                        </div>
                    </div>

                    {/* Current Level Action Area */}
                    {isCurrent && (
                        <div className="mt-6 pt-6 border-t border-slate-100">
                            {user.dailyEnergy > 0 ? (
                                <button 
                                    onClick={() => onStartLevel(level, false)}
                                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center"
                                >
                                    <Zap size={18} className="mr-2 fill-yellow-300 text-yellow-300" />
                                    Başla (-1 Enerji)
                                </button>
                            ) : (
                                <div className="text-center">
                                    <p className="text-slate-500 text-sm mb-2">Enerji bitdi. Sabah gəl!</p>
                                    <button disabled className="w-full bg-slate-200 text-slate-400 py-3 rounded-xl font-bold cursor-not-allowed">
                                        Gözlənilir...
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                    
                    {/* Replay Hint */}
                    {isPassed && (
                         <div className="mt-2 text-[10px] text-green-600 font-medium">
                             Təkrar etmək üçün toxun
                         </div>
                    )}
                </div>
            );
        })}
        
        <div className="text-center py-8 text-slate-400 text-sm">
            Daha çox səviyyə tezliklə...
        </div>
      </div>
    </div>
  );
};

export default Levels;