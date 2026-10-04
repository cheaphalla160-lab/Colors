import React, { useState, useEffect } from 'react';
import { ActiveTab } from './types';
import { Navbar } from './components/Navbar';
import { FlashcardsView } from './components/FlashcardsView';
import { BingoGame } from './components/BingoGame';
import { PuzzleGame } from './components/PuzzleGame';
import { PkGame } from './components/PkGame';
import { PrintableWorksheets } from './components/PrintableWorksheets';
import { sound } from './utils/audio';
import { Sparkles, Music, Volume2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('cards');
  const [isBgmPlaying, setIsBgmPlaying] = useState<boolean>(false);
  const [sfxEnabled, setSfxEnabled] = useState<boolean>(true);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);

  // Auto-prompt or play cheerful BGM on first user interaction
  const handleFirstInteraction = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      // Auto start cheerful BGM softly on first click
      if (!isBgmPlaying) {
        sound.startBgm();
        setIsBgmPlaying(true);
      }
    }
  };

  useEffect(() => {
    return () => {
      sound.stopBgm();
    };
  }, []);

  return (
    <div
      onClick={handleFirstInteraction}
      className="min-h-screen flex flex-col bg-[#FFFDF7] text-slate-800"
    >
      {/* Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isBgmPlaying={isBgmPlaying}
        setIsBgmPlaying={setIsBgmPlaying}
        sfxEnabled={sfxEnabled}
        setSfxEnabled={setSfxEnabled}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        
        {/* Soft Teacher Welcome Banner on First Turn */}
        {!hasInteracted && (
          <div className="mb-6 p-4 bg-gradient-to-r from-amber-100/90 to-orange-100/90 border border-amber-300/80 rounded-2xl flex items-center justify-between text-xs sm:text-sm text-amber-900 shadow-2xs no-print animate-subtle-bounce">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">🎵</span>
              <div>
                <strong>欢迎英语老师与小朋友们！</strong> 点击页面任意按钮开启轻松欢快的课堂背景音乐与生动发音！
              </div>
            </div>
            <button
              onClick={() => {
                sound.startBgm();
                setIsBgmPlaying(true);
                setHasInteracted(true);
              }}
              className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow-xs transition-colors shrink-0"
            >
              开启音乐 🎶
            </button>
          </div>
        )}

        {/* Tab Views */}
        {activeTab === 'cards' && <FlashcardsView />}
        {activeTab === 'bingo' && <BingoGame />}
        {activeTab === 'puzzle' && <PuzzleGame />}
        {activeTab === 'pk' && <PkGame />}
        {activeTab === 'print' && <PrintableWorksheets />}

      </main>

      {/* Clean Footer adhering to Universal Frontend Design Constitution */}
      <footer className="mt-auto border-t border-amber-100/80 bg-white/60 py-6 text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-amber-900 text-sm">
              Rainbow Colors Fun Lab
            </span>
            <span>·</span>
            <span>小学英语颜色课堂游戏与备课工作台</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <span>What color is it? It's...</span>
            <span>·</span>
            <span>What colour are they? They're...</span>
            <span>·</span>
            <span>Grade 1-3 Primary English</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
