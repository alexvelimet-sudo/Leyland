import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import Navigation from './components/Navigation';
import Home from './components/Home';
import Levels from './components/Levels';
import Flashcards from './components/Flashcards';
import Grammar from './components/Grammar';
import Chat from './components/Chat'; 
import Admin from './components/Admin'; 
import { AppView, User, Word } from './types';
import { StorageService } from './services/storageService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [user, setUser] = useState<User | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  
  // State for the active learning session
  const [sessionWords, setSessionWords] = useState<Word[]>([]);
  const [isReviewSession, setIsReviewSession] = useState(false);

  useEffect(() => {
    // Initialize user
    const u = StorageService.getCurrentUser();
    setUser(u);
  }, [currentView]); // Reload user when view changes

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center bg-white text-slate-400">Loading Leyland...</div>;
  }

  // Welcome Screen Component
  if (showWelcome) {
    return (
      <div className="min-h-screen bg-white font-sans text-slate-900 flex flex-col items-center justify-center p-8 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-60"></div>

        <div className="z-10 flex flex-col items-center text-center animate-in fade-in zoom-in duration-700">
          <div className="mb-8 relative">
            <div className="absolute inset-0 bg-blue-100 rounded-full blur-xl animate-pulse"></div>
            <span className="text-6xl animate-bounce block relative" role="img" aria-label="wave">👋</span>
          </div>
          
          <h1 className="text-3xl font-bold text-slate-800 mb-4 leading-tight">
            Privet, {user.name === 'Leyla' ? 'Potter' : user.name}!
          </h1>
          
          <p className="text-xl text-slate-500 font-medium mb-12 max-w-[240px]">
            Bu gün rus dili öyrənək?
          </p>

          <button 
            onClick={() => setShowWelcome(false)}
            className="group relative bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-blue-200 hover:bg-blue-700 hover:scale-105 transition-all duration-300 flex items-center"
          >
            <Sparkles className="mr-2" size={20} />
            Başla
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
          </button>
        </div>
      </div>
    );
  }

  const handleStartLevel = (level: number, isReplay: boolean) => {
    const words = StorageService.getWordsForLevel(level);
    if (words.length > 0) {
        setSessionWords(words);
        setIsReviewSession(isReplay);
        setCurrentView(AppView.GAME); // Switch to Game view
    }
  };

  const handleLevelComplete = () => {
      // If it's a new level (not review), update progress
      if (!isReviewSession) {
          StorageService.completeCurrentLevel();
      } else {
          // If it is a review session, track stats
          StorageService.completeReviewSession();
      }
      // Refresh user state
      setUser(StorageService.getCurrentUser());
      // Go back to Home or Levels depending on context, but let's go to Home for better flow after random review
      setCurrentView(isReviewSession ? AppView.HOME : AppView.LEARN);
  };

  const handleStartNewWords = () => {
    // Go to Levels view so user can use energy to start next level
    setCurrentView(AppView.LEARN);
  };

  const handleStartReview = () => {
    const words = StorageService.getWordsForReview(10);
    if (words.length > 0) {
        setSessionWords(words);
        setIsReviewSession(true);
        setCurrentView(AppView.GAME);
    }
  };

  const renderView = () => {
    switch (currentView) {
      case AppView.HOME:
        return <Home onStartNewWords={handleStartNewWords} onStartReview={handleStartReview} />;
      case AppView.LEARN:
        return <Levels onStartLevel={handleStartLevel} />;
      case AppView.GAME:
         return (
            <Flashcards 
                words={sessionWords} 
                onComplete={handleLevelComplete}
                isReview={isReviewSession}
            />
        );
      case AppView.GRAMMAR:
        return <Grammar />;
      case AppView.CHAT:
        return <Chat />;
      case AppView.ADMIN:
        return <Admin />;
      default:
        return <Home onStartNewWords={handleStartNewWords} onStartReview={handleStartReview} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 flex justify-center">
      <main className="w-full max-w-md bg-white min-h-screen shadow-2xl relative overflow-hidden">
        {renderView()}
        <Navigation currentView={currentView === AppView.GAME ? AppView.LEARN : currentView} setView={setCurrentView} />
      </main>
    </div>
  );
};

export default App;