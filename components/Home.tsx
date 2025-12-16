import React, { useEffect, useState } from 'react';
import { Flame, CheckCircle2, Circle, BookOpen, RotateCcw } from 'lucide-react';
import { User } from '../types';
import { StorageService } from '../services/storageService';

interface HomeProps {
  onStartNewWords: () => void;
  onStartReview: () => void;
}

const CircularProgress: React.FC<{ value: number; total: number }> = ({ value, total }) => {
  const radius = 60;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const percentage = Math.min((value / total) * 100, 100);
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center relative">
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Səviyyə A1</h3>
      <div className="relative flex items-center justify-center">
        <svg
          height={radius * 2}
          width={radius * 2}
          className="transform -rotate-90"
        >
          <circle
            stroke="#e2e8f0"
            strokeWidth={stroke}
            fill="transparent"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            stroke="#3b82f6"
            strokeWidth={stroke}
            strokeLinecap="round"
            fill="transparent"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            style={{ strokeDasharray: circumference + ' ' + circumference, strokeDashoffset }}
          />
        </svg>
        <div className="absolute text-center">
          <span className="text-3xl font-bold text-slate-800 block">{value}</span>
          <span className="text-xs text-slate-400 font-medium">/ {total} söz</span>
        </div>
      </div>
    </div>
  );
};

const Home: React.FC<HomeProps> = ({ onStartNewWords, onStartReview }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(StorageService.getCurrentUser());
  }, []);

  if (!user) return null;

  const showReviewGoal = user.wordsLearned >= 10;
  const dailyTarget = 10;
  const isDailyTargetReached = user.dailyNewWords >= dailyTarget;
  const isReviewDone = user.dailyReviewCount > 0; // Simple logic: if done at least once

  return (
    <div className="bg-white min-h-screen font-sans flex flex-col h-full">
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto pb-28">
        {/* Header */}
        <header className="flex justify-between items-center px-6 pt-8 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-xl">
              👋
            </div>
            <h1 className="text-xl font-bold text-slate-900">Salam, {user.name}!</h1>
          </div>
        </header>

        <div className="px-6 space-y-6">
          {/* Level Indicator Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col items-center">
            <CircularProgress value={user.wordsLearned} total={user.totalWords} />
          </div>

          {/* Streak Widget */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-orange-100 p-2.5 rounded-xl">
                <Flame className="text-orange-500 fill-orange-500" size={24} />
              </div>
              <div>
                <p className="font-bold text-slate-800 text-lg">{user.streak} gün seriya!</p>
                <p className="text-xs text-slate-500">
                   {isDailyTargetReached 
                     ? "Əlasınız! Plan yerinə yetirildi."
                     : "Günlük planı tamamla."}
                </p>
              </div>
            </div>
          </div>

          {/* Daily Goals */}
          <div className="bg-slate-50 rounded-3xl p-6">
            <h3 className="font-bold text-slate-900 mb-4">Günün Planı</h3>
            <div className="space-y-3">
              {/* New Words Goal */}
              <div className={`flex items-center p-3 rounded-xl border shadow-sm transition-all ${isDailyTargetReached ? 'bg-white border-slate-100 opacity-50' : 'bg-white border-blue-100'}`}>
                {isDailyTargetReached ? (
                   <CheckCircle2 className="text-green-500 mr-3" size={24} fill="#dcfce7" />
                ) : (
                   <Circle className="text-slate-300 mr-3" size={24} />
                )}
                <div className="flex-1">
                   <span className={`text-sm font-medium ${isDailyTargetReached ? 'text-slate-600 line-through' : 'text-slate-800'}`}>
                     {dailyTarget} yeni söz öyrən
                   </span>
                   <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-blue-500 h-full rounded-full transition-all" style={{ width: `${(user.dailyNewWords / dailyTarget) * 100}%` }}></div>
                   </div>
                   <div className="text-[10px] text-slate-400 mt-1 text-right">{user.dailyNewWords}/{dailyTarget}</div>
                </div>
              </div>

              {/* Review Goal (Conditional) */}
              {showReviewGoal && (
                <div className={`flex items-center p-3 rounded-xl border shadow-sm transition-all ${isReviewDone ? 'bg-white border-slate-100 opacity-50' : 'bg-white border-slate-100'}`}>
                  {isReviewDone ? (
                      <CheckCircle2 className="text-green-500 mr-3" size={24} fill="#dcfce7" />
                  ) : (
                      <Circle className="text-slate-300 mr-3" size={24} />
                  )}
                  <span className={`text-sm font-medium ${isReviewDone ? 'text-slate-600 line-through' : 'text-slate-800'}`}>
                    Köhnə sözləri təkrarla
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons - Moved here (Not fixed anymore) */}
          <div className="flex flex-col gap-3 pt-2 pb-6">
            <button 
              onClick={onStartNewWords}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center"
            >
              <BookOpen className="mr-2" size={20} />
              Təzə sözlər öyrənmək
            </button>
            
            {showReviewGoal && (
              <button 
                onClick={onStartReview}
                className="w-full bg-white text-slate-700 py-4 rounded-2xl font-bold text-lg border-2 border-slate-200 hover:bg-slate-50 active:scale-95 transition-all flex items-center justify-center"
              >
                <RotateCcw className="mr-2" size={20} />
                Təkrarlamaq
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;