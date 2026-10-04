import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { COLORS_DATA } from '../data/colorsData';
import { ColorItem } from '../types';
import { ColorObjectIllustration } from './ColorIcons';
import { Sparkles, RotateCcw, Volume2, Trophy, CheckCircle2, Shuffle, HelpCircle } from 'lucide-react';
import { sound, speakSentence, speakWord } from '../utils/audio';

interface BingoCell {
  color: ColorItem;
  isPlural: boolean;
  isMarked: boolean;
}

export const BingoGame: React.FC = () => {
  const [gridSize, setGridSize] = useState<3 | 4>(3);
  const [grid, setGrid] = useState<BingoCell[]>([]);
  const [calledHistory, setCalledHistory] = useState<{ color: ColorItem; isPlural: boolean }[]>([]);
  const [currentCall, setCurrentCall] = useState<{ color: ColorItem; isPlural: boolean } | null>(null);
  const [hasWonBingo, setHasWonBingo] = useState(false);
  const [bingoLines, setBingoLines] = useState<number[][]>([]);
  const [streakCount, setStreakCount] = useState(0);

  // Initialize randomized Bingo Board
  const initBoard = useCallback((size: 3 | 4) => {
    sound.playClick();
    const totalCells = size * size;
    const shuffledColors = [...COLORS_DATA].sort(() => Math.random() - 0.5);
    
    // Fill cells
    const cells: BingoCell[] = [];
    for (let i = 0; i < totalCells; i++) {
      const color = shuffledColors[i % shuffledColors.length];
      const isPlural = Math.random() > 0.5;
      cells.push({
        color,
        isPlural,
        isMarked: false
      });
    }

    setGrid(cells);
    setCalledHistory([]);
    setCurrentCall(null);
    setHasWonBingo(false);
    setBingoLines([]);
    setStreakCount(0);
  }, []);

  useEffect(() => {
    initBoard(gridSize);
  }, [gridSize, initBoard]);

  // Check if grid has a completed row, column, or diagonal
  const checkBingoWin = useCallback((currentGrid: BingoCell[], size: number) => {
    const lines: number[][] = [];

    // Check rows
    for (let r = 0; r < size; r++) {
      const rowIndices: number[] = [];
      let rowAllMarked = true;
      for (let c = 0; c < size; c++) {
        const idx = r * size + c;
        rowIndices.push(idx);
        if (!currentGrid[idx]?.isMarked) {
          rowAllMarked = false;
        }
      }
      if (rowAllMarked) lines.push(rowIndices);
    }

    // Check columns
    for (let c = 0; c < size; c++) {
      const colIndices: number[] = [];
      let colAllMarked = true;
      for (let r = 0; r < size; r++) {
        const idx = r * size + c;
        colIndices.push(idx);
        if (!currentGrid[idx]?.isMarked) {
          colAllMarked = false;
        }
      }
      if (colAllMarked) lines.push(colIndices);
    }

    // Check Main Diagonal
    let diag1Marked = true;
    const diag1Indices: number[] = [];
    for (let i = 0; i < size; i++) {
      const idx = i * size + i;
      diag1Indices.push(idx);
      if (!currentGrid[idx]?.isMarked) diag1Marked = false;
    }
    if (diag1Marked) lines.push(diag1Indices);

    // Check Anti Diagonal
    let diag2Marked = true;
    const diag2Indices: number[] = [];
    for (let i = 0; i < size; i++) {
      const idx = i * size + (size - 1 - i);
      diag2Indices.push(idx);
      if (!currentGrid[idx]?.isMarked) diag2Marked = false;
    }
    if (diag2Marked) lines.push(diag2Indices);

    return lines;
  }, []);

  // Call Next Card
  const handleCallNext = () => {
    sound.playClick();
    const available = COLORS_DATA.filter(
      c => !calledHistory.some(h => h.color.id === c.id)
    );

    // If all called, allow reshuffle from all
    const pool = available.length > 0 ? available : COLORS_DATA;
    const randomColor = pool[Math.floor(Math.random() * pool.length)];
    const isPlural = Math.random() > 0.5;

    const callObj = { color: randomColor, isPlural };
    setCurrentCall(callObj);
    setCalledHistory(prev => [callObj, ...prev]);

    // Speak the question and answer
    if (isPlural) {
      speakSentence(randomColor.plural.questionEn, randomColor.plural.answerEn);
    } else {
      speakSentence(randomColor.singular.questionEn, randomColor.singular.answerEn);
    }
  };

  // Mark a cell
  const handleCellClick = (index: number) => {
    if (hasWonBingo) return;
    const cell = grid[index];
    if (!cell) return;

    // Toggle marked state
    const nextMarked = !cell.isMarked;
    const nextGrid = [...grid];
    nextGrid[index] = { ...cell, isMarked: nextMarked };
    setGrid(nextGrid);

    if (nextMarked) {
      sound.playSuccess();
      setStreakCount(prev => prev + 1);
    } else {
      sound.playClick();
    }

    // Check for Bingo
    const lines = checkBingoWin(nextGrid, gridSize);
    if (lines.length > 0) {
      setBingoLines(lines);
      setHasWonBingo(true);
      sound.playBingoFanfare();
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
      speakWord("Bingo! Super Job! You win!");
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 rounded-3xl p-6 sm:p-8 border border-emerald-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 tracking-wide uppercase">
            <span>Interactive Game 01</span>
            <span>·</span>
            <span>Classroom Bingo (色彩宾果游戏)</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight font-display mt-1">
            缤纷色彩 Bingo 大挑战
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-1 max-w-xl">
            听老师或系统发出的语音提问，找到网格中对应的颜色盖上金星图章。连成横排、竖排或对角线即可触发 <strong>BINGO</strong> 大狂欢！
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-2xs">
            <button
              onClick={() => { setGridSize(3); }}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                gridSize === 3
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              3×3 基础版
            </button>
            <button
              onClick={() => { setGridSize(4); }}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                gridSize === 4
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              4×4 进阶版
            </button>
          </div>

          <button
            onClick={() => initBoard(gridSize)}
            title="重新洗牌"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white text-slate-700 font-semibold text-xs rounded-2xl border border-slate-200 shadow-2xs hover:bg-slate-50 transition-colors"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>重新洗牌</span>
          </button>
        </div>
      </div>

      {/* Main Game Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Caller Deck & Audio Display (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 border-2 border-emerald-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg">
                📢 自动摇号读题台 Caller Stage
              </span>
              <span className="text-xs text-slate-500">
                已抽题: {calledHistory.length}
              </span>
            </div>

            {/* Current Call Display Box */}
            {currentCall ? (
              <div className="bg-gradient-to-b from-amber-50/50 to-orange-50/50 p-6 rounded-2xl border-2 border-amber-200/80 text-center space-y-4 relative overflow-hidden animate-subtle-bounce">
                <div className="flex justify-center">
                  <div
                    className="p-4 rounded-3xl shadow-sm border border-slate-200/60 bg-white"
                  >
                    <ColorObjectIllustration
                      type={currentCall.isPlural ? currentCall.color.plural.iconType : currentCall.color.singular.iconType}
                      isPlural={currentCall.isPlural}
                      className="w-28 h-28"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-semibold text-amber-700">
                    {currentCall.isPlural ? currentCall.color.plural.questionEn : currentCall.color.singular.questionEn}
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900 font-display">
                    {currentCall.isPlural ? currentCall.color.plural.answerEn : currentCall.color.singular.answerEn}
                  </div>
                  <div className="text-xs text-slate-500">
                    {currentCall.isPlural ? currentCall.color.plural.questionZh : currentCall.color.singular.questionZh}
                    {' '}{currentCall.isPlural ? currentCall.color.plural.answerZh : currentCall.color.singular.answerZh}
                  </div>
                </div>

                {/* Repeat Audio Button */}
                <button
                  onClick={() => {
                    sound.playClick();
                    if (currentCall.isPlural) {
                      speakSentence(currentCall.color.plural.questionEn, currentCall.color.plural.answerEn);
                    } else {
                      speakSentence(currentCall.color.singular.questionEn, currentCall.color.singular.answerEn);
                    }
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                >
                  <Volume2 className="w-4 h-4" /> 再听一遍发音
                </button>
              </div>
            ) : (
              <div className="py-12 px-4 text-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <div className="font-bold text-slate-700 font-display">准备好开始了吗？</div>
                <div className="text-xs text-slate-500 max-w-xs mx-auto">
                  点击下方大按钮抽取第一个颜色，或者由老师在讲台上直接报出英文！
                </div>
              </div>
            )}

            {/* Call Next Button */}
            <button
              onClick={handleCallNext}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-display font-bold text-lg rounded-2xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              <span>抽下一个颜色 (Next Call)</span>
            </button>

            {/* Call History Chips */}
            {calledHistory.length > 0 && (
              <div className="pt-2 border-t border-slate-100">
                <div className="text-xs font-semibold text-slate-400 mb-2">历史抽取记录:</div>
                <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
                  {calledHistory.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        sound.playClick();
                        speakWord(item.color.nameEn);
                      }}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-amber-100 text-xs font-medium text-slate-700 transition-colors"
                    >
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color.hex }} />
                      <span>{item.color.nameEn}</span>
                      <span className="text-[10px] text-slate-400">({item.isPlural ? '复数' : '单数'})</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Interactive Bingo Grid (7 cols) */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-xl text-slate-900">
                  你的 Bingo 卡片 (Your Bingo Board)
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                <span>已盖章: {grid.filter(c => c.isMarked).length} / {grid.length}</span>
              </div>
            </div>

            {/* Victory Celebration Card */}
            {hasWonBingo && (
              <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 text-white p-5 rounded-2xl shadow-md flex items-center justify-between animate-subtle-bounce">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <Trophy className="w-8 h-8 text-yellow-100 animate-bounce" />
                  </div>
                  <div>
                    <div className="text-xl font-extrabold font-display">B-I-N-G-O! 恭喜连线成功!</div>
                    <div className="text-xs text-amber-50">你太棒了！所有颜色发音非常准确！</div>
                  </div>
                </div>
                <button
                  onClick={() => initBoard(gridSize)}
                  className="px-4 py-2 bg-white text-amber-900 font-bold text-xs rounded-xl shadow-xs hover:bg-amber-50 transition-colors whitespace-nowrap"
                >
                  再玩一局 ↻
                </button>
              </div>
            )}

            {/* Bingo Cells Grid */}
            <div
              className={`grid gap-3 sm:gap-4 ${
                gridSize === 3 ? 'grid-cols-3' : 'grid-cols-4'
              }`}
            >
              {grid.map((cell, index) => {
                const isPartOfWinLine = bingoLines.some(line => line.includes(index));

                return (
                  <button
                    key={index}
                    onClick={() => handleCellClick(index)}
                    className={`relative aspect-square rounded-2xl p-2 sm:p-3 border-2 transition-all flex flex-col items-center justify-between cursor-pointer group ${
                      isPartOfWinLine
                        ? 'border-amber-400 bg-amber-50 ring-4 ring-amber-300 shadow-md scale-[1.02]'
                        : cell.isMarked
                        ? 'border-emerald-400 bg-emerald-50/60 shadow-xs'
                        : 'border-slate-200/90 bg-white hover:border-emerald-300 hover:shadow-xs'
                    }`}
                  >
                    {/* Top indicator: Color dot & name */}
                    <div className="w-full flex items-center justify-between text-left">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                          style={{ backgroundColor: cell.color.hex }}
                        />
                        <span className="text-xs font-bold text-slate-800 font-display truncate">
                          {cell.color.nameEn}
                        </span>
                      </div>
                    </div>

                    {/* Center illustration */}
                    <div className="my-auto py-1">
                      <ColorObjectIllustration
                        type={cell.isPlural ? cell.color.plural.iconType : cell.color.singular.iconType}
                        isPlural={cell.isPlural}
                        className={gridSize === 3 ? 'w-16 h-16 sm:w-20 sm:h-20' : 'w-12 h-12 sm:w-14 sm:h-14'}
                      />
                    </div>

                    {/* Bottom: Object label & Plural hint */}
                    <div className="w-full flex items-center justify-between text-[11px] text-slate-500 font-medium">
                      <span className="truncate">
                        {cell.isPlural ? cell.color.plural.objectNameZh : cell.color.singular.objectNameZh}
                      </span>
                      <span className="text-[10px] opacity-70">
                        {cell.isPlural ? '复数' : '单数'}
                      </span>
                    </div>

                    {/* Stamped Mark (Gold Star or Green Check) */}
                    {cell.isMarked && (
                      <div className="absolute inset-0 bg-emerald-500/15 backdrop-blur-[0.5px] rounded-2xl flex items-center justify-center pointer-events-none">
                        <div className="w-12 h-12 rounded-full bg-white text-amber-500 shadow-lg border border-amber-200 flex items-center justify-center transform -rotate-12 scale-110">
                          <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Teacher tip footer */}
            <div className="flex items-center justify-between text-xs text-slate-500 bg-slate-50 p-3 rounded-xl">
              <span>💡 课堂技巧：老师可以投影此网页让全班一起看，或让学生分组上台抢答盖章！</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
