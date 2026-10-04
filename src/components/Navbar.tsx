import React from 'react';
import { ActiveTab } from '../types';
import { Volume2, VolumeX, Music, BookOpen, Grid3X3, Puzzle, Swords, Printer } from 'lucide-react';
import { sound } from '../utils/audio';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isBgmPlaying: boolean;
  setIsBgmPlaying: (playing: boolean) => void;
  sfxEnabled: boolean;
  setSfxEnabled: (enabled: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isBgmPlaying,
  setIsBgmPlaying,
  sfxEnabled,
  setSfxEnabled
}) => {
  const handleToggleBgm = () => {
    sound.playClick();
    const newState = sound.toggleBgm();
    setIsBgmPlaying(newState);
  };

  const handleToggleSfx = () => {
    const newState = !sfxEnabled;
    sound.setSfxEnabled(newState);
    setSfxEnabled(newState);
    if (newState) {
      sound.playClick();
    }
  };

  const navItems: { id: ActiveTab; label: string; enLabel: string; icon: React.ReactNode }[] = [
    { id: 'cards', label: '教学词卡', enLabel: 'Flashcards', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'bingo', label: '色彩宾果', enLabel: 'Bingo', icon: <Grid3X3 className="w-4 h-4" /> },
    { id: 'puzzle', label: '句型拼图', enLabel: 'Puzzle', icon: <Puzzle className="w-4 h-4" /> },
    { id: 'pk', label: '双人PK对决', enLabel: 'PK Game', icon: <Swords className="w-4 h-4" /> },
    { id: 'print', label: '备课打印', enLabel: 'Printables', icon: <Printer className="w-4 h-4" /> }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-amber-100 shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <a
            href="#home"
            onClick={(e) => { e.preventDefault(); setActiveTab('cards'); }}
            className="text-2xl font-bold tracking-tight text-amber-900 font-display flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <span className="inline-block text-2xl animate-subtle-bounce">🎨</span>
            <span>Rainbow Colors Fun Lab</span>
          </a>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 bg-amber-50/70 p-1.5 rounded-2xl border border-amber-200/60">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  sound.playClick();
                  setActiveTab(item.id);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/25 scale-[1.02]'
                    : 'text-amber-900/80 hover:text-amber-900 hover:bg-amber-100/60'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                <span className="text-xs opacity-75 font-normal">({item.enLabel})</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Audio & Control Actions */}
        <div className="flex items-center gap-2">
          {/* BGM Button */}
          <button
            onClick={handleToggleBgm}
            title={isBgmPlaying ? '暂停欢快背景音乐' : '播放欢快背景音乐'}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl border transition-all ${
              isBgmPlaying
                ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm shadow-emerald-500/25'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Music className={`w-4 h-4 ${isBgmPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
            <span className="hidden sm:inline">{isBgmPlaying ? '音乐中 BGM On' : '轻音乐 BGM Off'}</span>
          </button>

          {/* SFX Button */}
          <button
            onClick={handleToggleSfx}
            title={sfxEnabled ? '音效开启' : '音效静音'}
            className={`p-2 rounded-xl border transition-colors ${
              sfxEnabled
                ? 'bg-amber-100 text-amber-800 border-amber-300'
                : 'bg-slate-100 text-slate-400 border-slate-200'
            }`}
          >
            {sfxEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>

      </div>

      {/* Mobile nav bar below header for phones */}
      <div className="md:hidden flex overflow-x-auto py-2 px-3 bg-amber-50/90 border-t border-amber-100 gap-1 scrollbar-none">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              sound.playClick();
              setActiveTab(item.id);
            }}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg shrink-0 ${
              activeTab === item.id
                ? 'bg-amber-500 text-white font-semibold'
                : 'text-amber-900 bg-white/70'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </header>
  );
};
