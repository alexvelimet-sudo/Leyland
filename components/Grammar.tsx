import React, { useState, useEffect } from 'react';
import { Check, Play, Lock } from 'lucide-react';
import { GrammarLesson } from '../types';
import { StorageService } from '../services/storageService';

const Grammar: React.FC = () => {
  const [lessons, setLessons] = useState<GrammarLesson[]>([]);
  const [activeLesson, setActiveLesson] = useState<GrammarLesson | null>(null);

  useEffect(() => {
    setLessons(StorageService.getGrammarLessons());
  }, []);

  if (activeLesson) {
    return (
      <div className="bg-white min-h-screen p-6 pb-24">
        <button 
          onClick={() => setActiveLesson(null)}
          className="text-slate-500 hover:text-slate-800 font-medium mb-6 flex items-center"
        >
          ← Back
        </button>
        <h1 className="text-3xl font-bold text-slate-900 mb-1">{activeLesson.title}</h1>
        <h2 className="text-xl text-slate-400 mb-8">{activeLesson.subtitle}</h2>
        
        <div className="prose prose-slate max-w-none text-lg leading-relaxed whitespace-pre-wrap text-slate-700">
          {activeLesson.content}
        </div>
        
        <button 
          onClick={() => setActiveLesson(null)} 
          className="mt-12 w-full bg-blue-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-200"
        >
          Mark as Complete
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-24">
      <header className="px-6 pt-8 pb-4 border-b border-slate-50">
        <h1 className="text-2xl font-bold text-slate-900">Grammar Path</h1>
        <p className="text-slate-500">Qrammatika</p>
      </header>
      
      <div className="p-6 space-y-4">
        {lessons.map((lesson) => (
          <div 
            key={lesson.id}
            onClick={() => lesson.status !== 'locked' && setActiveLesson(lesson)}
            className={`
              relative rounded-2xl p-5 border transition-all duration-200
              ${lesson.status === 'locked' ? 'bg-slate-50 border-slate-100 opacity-60 cursor-not-allowed' : 'bg-white border-slate-200 shadow-sm cursor-pointer hover:border-blue-200'}
            `}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Icon State */}
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0
                  ${lesson.status === 'completed' ? 'bg-green-100 text-green-600' : ''}
                  ${lesson.status === 'unlocked' ? 'bg-blue-100 text-blue-600' : ''}
                  ${lesson.status === 'locked' ? 'bg-slate-200 text-slate-400' : ''}
                `}>
                  {lesson.status === 'completed' && <Check size={24} strokeWidth={3} />}
                  {lesson.status === 'unlocked' && <Play size={24} fill="currentColor" />}
                  {lesson.status === 'locked' && <Lock size={20} />}
                </div>

                <div>
                  <h3 className={`font-bold text-lg ${lesson.status === 'locked' ? 'text-slate-400' : 'text-slate-900'}`}>
                    {lesson.title}
                  </h3>
                  <p className="text-sm text-slate-500">{lesson.subtitle}</p>
                </div>
              </div>

              {lesson.status === 'unlocked' && (
                <div className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  {Math.round(lesson.progress * 100)}%
                </div>
              )}
            </div>

            {/* Progress Bar for unlocked items */}
            {lesson.status === 'unlocked' && (
              <div className="mt-4 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: `${lesson.progress * 100}%` }} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Grammar;