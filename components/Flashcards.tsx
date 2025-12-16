import React, { useState, useEffect } from 'react';
import { Volume2, RefreshCw, CheckCircle, RotateCw, X } from 'lucide-react';
import { Word } from '../types';
import { StorageService } from '../services/storageService';

interface FlashcardsProps {
  words: Word[];
  onComplete: () => void;
  isReview: boolean;
}

const Flashcards: React.FC<FlashcardsProps> = ({ words, onComplete, isReview }) => {
  // Queue contains indices of words in the 'words' array
  const [queue, setQueue] = useState<Word[]>([]);
  // We track which words (by ID) have been successfully marked as 'Known' in this session
  const [sessionLearnedIds, setSessionLearnedIds] = useState<Set<string>>(new Set());
  
  const [isFlipped, setIsFlipped] = useState(false);
  const [exitAnim, setExitAnim] = useState<'knowing' | 'unknowing' | null>(null);
  const [finished, setFinished] = useState(false);

  // Swipe detection state
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  const minSwipeDistance = 50;

  useEffect(() => {
    startSession();
  }, [words]);

  const startSession = () => {
    if (!words || words.length === 0) return;
    setQueue([...words]); // Copy array
    setSessionLearnedIds(new Set());
    setFinished(false);
    setExitAnim(null);
    setIsFlipped(false);
  };

  const handleRate = (known: boolean) => {
    if (exitAnim || queue.length === 0) return;

    const currentWord = queue[0];

    if (known) {
      // Animation: Fly UP
      setExitAnim('knowing');
      
      // Save data locally (always mark as learned in DB)
      StorageService.saveProgress(currentWord.id);
      
      // Track session progress
      const newLearned = new Set(sessionLearnedIds);
      newLearned.add(currentWord.id);
      setSessionLearnedIds(newLearned);

      setTimeout(() => {
        // Remove from queue
        const newQueue = queue.slice(1);
        setQueue(newQueue);
        
        // Check if finished
        // Level is complete only if Queue is empty AND we have marked all input words as learned in this session
        // (If we skipped a word by pressing "Don't Know", it went to back of queue, so we must eventually clear queue)
        if (newQueue.length === 0) {
          setFinished(true);
        }
        
        setExitAnim(null);
        setIsFlipped(false);
      }, 400); 
    } else {
      // Animation: Scale Down / Go Back
      setExitAnim('unknowing');
      
      setTimeout(() => {
        // Move to end of queue to review again
        const newQueue = [...queue.slice(1), currentWord];
        setQueue(newQueue);
        
        setExitAnim(null);
        setIsFlipped(false);
      }, 400);
    }
  };

  // Audio Playback
  const playAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ru-RU';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Swipe logic
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe || isRightSwipe) {
      setIsFlipped(!isFlipped);
    }
  };

  if (finished) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-50 px-6 text-center pb-24">
        <div className="bg-green-100 p-6 rounded-full mb-6 animate-bounce">
          <CheckCircle className="text-green-600 w-16 h-16" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Əla!</h2>
        <p className="text-slate-500 mb-8">
            {isReview ? 'Təkrarı bitirdiniz.' : 'Səviyyəni uğurla keçdiniz!'}
        </p>
        <button 
          onClick={onComplete}
          className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition w-full max-w-xs"
        >
          Davam etmək
        </button>
      </div>
    );
  }

  if (queue.length === 0) {
      return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  const currentWord = queue[0];
  const progressPercent = words.length > 0 ? (sessionLearnedIds.size / words.length) * 100 : 0;

  // Animation Styles
  let cardTransformClass = "";
  if (exitAnim === 'knowing') {
    cardTransformClass = "opacity-0 -translate-y-[120%] rotate-6 transition-all duration-300 ease-in";
  } else if (exitAnim === 'unknowing') {
    cardTransformClass = "opacity-0 scale-75 translate-y-12 transition-all duration-300 ease-in";
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50 pb-24 overflow-hidden">
      {/* Top Header */}
      <div className="pt-8 px-8 pb-4 flex justify-between items-center shrink-0">
        <button onClick={onComplete} className="text-slate-400 font-bold text-sm hover:text-slate-600">Çıxış</button>
        <div className="h-2 w-32 bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          {sessionLearnedIds.size} / {words.length}
        </span>
      </div>

      {/* Card Container */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative perspective-container">
        <div 
          className={`relative w-full max-w-[280px] aspect-[3/4] group cursor-pointer ${cardTransformClass}`}
          style={{ perspective: '1000px' }}
          onClick={() => !exitAnim && setIsFlipped(!isFlipped)}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div 
            className="relative w-full h-full duration-500 transition-transform"
            style={{ 
              transformStyle: 'preserve-3d', 
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
            }}
          >
            
            {/* FRONT (Russian) */}
            <div 
              className="absolute inset-0 bg-white rounded-3xl shadow-2xl shadow-slate-200 border border-slate-100 flex flex-col items-center justify-center p-6 z-20"
              style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
            >
              <div className="flex-1 flex flex-col items-center justify-center w-full">
                <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-6 bg-slate-50 px-2 py-1 rounded-md">Russian</span>
                <h2 className="text-4xl font-bold text-slate-800 text-center mb-4 leading-tight">{currentWord.russian}</h2>
                <p className="text-sm text-slate-400 font-mono mb-6 bg-slate-50 px-3 py-1 rounded-full">{currentWord.transcription}</p>
                
                {currentWord.example_ru && (
                  <div className="w-full text-center px-2">
                     <p className="text-slate-600 text-lg italic font-serif leading-relaxed">"{currentWord.example_ru}"</p>
                  </div>
                )}
                
                <button 
                  onClick={(e) => { e.stopPropagation(); playAudio(currentWord.russian); }}
                  className="mt-8 p-3 bg-blue-50 text-blue-500 rounded-full hover:bg-blue-100 transition shadow-sm active:scale-95"
                >
                  <Volume2 size={24} />
                </button>
              </div>
              <div className="mt-auto flex items-center text-slate-300 text-xs font-medium pt-4">
                <RotateCw size={12} className="mr-2" />
                Tap to flip
              </div>
            </div>

            {/* BACK (Azerbaijani) */}
            <div 
              className="absolute inset-0 bg-white rounded-3xl shadow-2xl shadow-slate-200 border border-slate-100 flex flex-col items-center justify-center p-6 z-20"
              style={{ 
                backfaceVisibility: 'hidden', 
                WebkitBackfaceVisibility: 'hidden', 
                transform: 'rotateY(180deg)' 
              }}
            >
              <div className="flex-1 flex flex-col items-center justify-center w-full">
                <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-8 bg-slate-50 px-2 py-1 rounded-md">Azerbaijani</span>
                <h2 className="text-4xl font-bold text-slate-800 text-center mb-8">{currentWord.azerbaijani}</h2>
                
                {currentWord.example_az && (
                  <div className="w-full text-center px-2 border-t border-slate-50 pt-6">
                    <p className="text-slate-600 text-lg font-medium leading-relaxed">"{currentWord.example_az}"</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="px-8 pb-10 pt-4 shrink-0">
        <div className="grid grid-cols-2 gap-5 max-w-[320px] mx-auto">
          <button 
            disabled={!!exitAnim}
            onClick={(e) => { e.stopPropagation(); handleRate(false); }}
            className="flex flex-col items-center justify-center py-4 rounded-2xl bg-white text-red-500 font-bold border-2 border-red-50 active:scale-95 transition-all hover:bg-red-50 hover:border-red-100 shadow-sm"
          >
            <X size={28} className="mb-1" />
            <span className="text-sm">Bilmirəm</span>
          </button>
          <button 
            disabled={!!exitAnim}
            onClick={(e) => { e.stopPropagation(); handleRate(true); }}
            className="flex flex-col items-center justify-center py-4 rounded-2xl bg-blue-600 text-white font-bold border-2 border-blue-600 active:scale-95 transition-all shadow-lg shadow-blue-200 hover:bg-blue-700 hover:border-blue-700"
          >
            <CheckCircle size={28} className="mb-1" />
            <span className="text-sm">Bilirəm</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Flashcards;