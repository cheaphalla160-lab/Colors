import React, { useState } from 'react';
import { COLORS_DATA } from '../data/colorsData';
import { ColorObjectIllustration } from './ColorIcons';
import { Printer, RefreshCw, CheckCircle, FileText, Scissors } from 'lucide-react';
import { sound } from '../utils/audio';

type PrintMode = 'bingo_cards' | 'sentence_worksheet' | 'flashcard_cutouts';

export const PrintableWorksheets: React.FC = () => {
  const [printMode, setPrintMode] = useState<PrintMode>('bingo_cards');
  const [cardSeed, setCardSeed] = useState(1);

  const handlePrint = () => {
    sound.playClick();
    window.print();
  };

  const handleShuffle = () => {
    sound.playClick();
    setCardSeed(prev => prev + 1);
  };

  // Helper to generate randomized 3x3 for printed bingo
  const generateRandomGrid = (seedOffset: number) => {
    const shuffled = [...COLORS_DATA].sort(() => 0.5 - Math.sin(cardSeed * 10 + seedOffset));
    return shuffled.slice(0, 9);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner (hidden in print) */}
      <div className="no-print bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 tracking-wide uppercase">
            <span>Teacher Lesson Toolkit</span>
            <span>·</span>
            <span>Printable Classroom Materials (备课打印专区)</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight font-display mt-1">
            一键打印随堂教具与练习单
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-1 max-w-xl">
            方便老师一键导出 A4 纸张排版的随堂宾果卡、句型书写描红练习单、以及双面迷你闪卡教具！
          </p>
        </div>

        {/* Print Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-2xs">
            <button
              onClick={() => { sound.playClick(); setPrintMode('bingo_cards'); }}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                printMode === 'bingo_cards'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🎲 纸质宾果卡
            </button>
            <button
              onClick={() => { sound.playClick(); setPrintMode('sentence_worksheet'); }}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                printMode === 'sentence_worksheet'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📝 句型描红练习
            </button>
            <button
              onClick={() => { sound.playClick(); setPrintMode('flashcard_cutouts'); }}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                printMode === 'flashcard_cutouts'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ✂️ 迷你剪切闪卡
            </button>
          </div>

          <button
            onClick={handleShuffle}
            title="刷新随机排列"
            className="p-2.5 bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 rounded-xl shadow-2xs transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>立即打印 (Print A4)</span>
          </button>
        </div>
      </div>

      {/* --- PREVIEW 1: PRINTABLE BINGO CARDS (2 Cards per A4) --- */}
      {printMode === 'bingo_cards' && (
        <div className="bg-white p-8 sm:p-12 rounded-3xl border-2 border-slate-200 shadow-sm max-w-4xl mx-auto space-y-10">
          
          <div className="no-print bg-amber-50 p-4 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              已针对 A4 纸张排版优化。每页含 2 张不同排列的 3×3 宾果卡，点击右上方“立即打印”即可直接输出！
            </span>
          </div>

          {/* Card 1 */}
          <div className="border-2 border-dashed border-slate-300 p-6 rounded-3xl space-y-4">
            <div className="flex items-center justify-between border-b-2 border-slate-800 pb-3">
              <div>
                <h3 className="text-xl font-bold font-display text-slate-900">
                  🎨 Colors Bingo Card A (色彩宾果卡 A)
                </h3>
                <p className="text-xs text-slate-500">
                  Listen to teacher: "What color is it? It's..." / "What colour are they? They're..."
                </p>
              </div>
              <div className="text-right text-xs font-mono space-y-1">
                <div>Name: _________________</div>
                <div>Class: _________________</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {generateRandomGrid(1).map((item, idx) => (
                <div
                  key={idx}
                  className="aspect-square border-2 border-slate-800 rounded-2xl p-2 flex flex-col items-center justify-between text-center bg-slate-50/50"
                >
                  <span className="font-display font-bold text-sm text-slate-800">
                    {item.nameEn}
                  </span>
                  <ColorObjectIllustration
                    type={item.singular.iconType}
                    className="w-14 h-14"
                  />
                  <span className="text-[10px] text-slate-500 font-medium">
                    {item.nameZh} · {item.singular.objectNameZh}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Dotted Cut Line */}
          <div className="relative py-2 flex items-center justify-center">
            <div className="w-full border-t-2 border-dashed border-slate-300"></div>
            <span className="absolute bg-white px-3 text-xs text-slate-400 flex items-center gap-1">
              <Scissors className="w-3.5 h-3.5" /> 沿虚线裁开 (Cut Here)
            </span>
          </div>

          {/* Card 2 */}
          <div className="border-2 border-dashed border-slate-300 p-6 rounded-3xl space-y-4">
            <div className="flex items-center justify-between border-b-2 border-slate-800 pb-3">
              <div>
                <h3 className="text-xl font-bold font-display text-slate-900">
                  🎨 Colors Bingo Card B (色彩宾果卡 B)
                </h3>
                <p className="text-xs text-slate-500">
                  Listen to teacher: "What color is it? It's..." / "What colour are they? They're..."
                </p>
              </div>
              <div className="text-right text-xs font-mono space-y-1">
                <div>Name: _________________</div>
                <div>Class: _________________</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {generateRandomGrid(2).map((item, idx) => (
                <div
                  key={idx}
                  className="aspect-square border-2 border-slate-800 rounded-2xl p-2 flex flex-col items-center justify-between text-center bg-slate-50/50"
                >
                  <span className="font-display font-bold text-sm text-slate-800">
                    {item.nameEn}
                  </span>
                  <ColorObjectIllustration
                    type={item.plural.iconType}
                    isPlural={true}
                    className="w-14 h-14"
                  />
                  <span className="text-[10px] text-slate-500 font-medium">
                    {item.nameZh} · {item.plural.objectNameZh}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* --- PREVIEW 2: SENTENCE TRACING WORKSHEET --- */}
      {printMode === 'sentence_worksheet' && (
        <div className="bg-white p-8 sm:p-12 rounded-3xl border-2 border-slate-200 shadow-sm max-w-4xl mx-auto space-y-8">
          
          <div className="flex items-center justify-between border-b-2 border-slate-800 pb-4">
            <div>
              <h2 className="text-2xl font-bold font-display text-slate-900">
                Primary English Worksheet: Target Sentences (句型描红与涂色)
              </h2>
              <p className="text-xs text-slate-600">
                Read, trace the sentence, and color the pictures with correct crayons!
              </p>
            </div>
            <div className="text-right text-xs font-mono space-y-1">
              <div>Name: _______________</div>
              <div>Date: _______________</div>
              <div>Score: _______________</div>
            </div>
          </div>

          <div className="space-y-6">
            {COLORS_DATA.slice(0, 6).map((color, i) => (
              <div key={color.id} className="p-4 rounded-2xl border border-slate-300 flex items-center justify-between gap-6">
                
                {/* Number & Icon */}
                <div className="flex items-center gap-4">
                  <span className="w-7 h-7 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center font-bold text-xs text-slate-700">
                    {i + 1}
                  </span>
                  <div className="w-16 h-16 p-1 border border-slate-200 rounded-xl flex items-center justify-center">
                    <ColorObjectIllustration
                      type={i % 2 === 0 ? color.singular.iconType : color.plural.iconType}
                      isPlural={i % 2 !== 0}
                      className="w-14 h-14"
                    />
                  </div>
                </div>

                {/* Sentences with handwriting tracing */}
                <div className="flex-1 space-y-1">
                  <div className="text-xs font-semibold text-slate-500">
                    Q: {i % 2 === 0 ? color.singular.questionEn : color.plural.questionEn}
                    <span className="text-slate-400 ml-2">
                      ({i % 2 === 0 ? color.singular.questionZh : color.plural.questionZh})
                    </span>
                  </div>
                  {/* Dotted guide line for writing */}
                  <div className="text-lg font-mono tracking-wider text-slate-400 font-medium py-1 border-b border-dashed border-slate-400">
                    A: {i % 2 === 0 ? color.singular.answerEn : color.plural.answerEn}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Trace & Write: 请用手写体描红上方句子并涂色
                  </div>
                </div>

                {/* Color Box */}
                <div className="w-20 text-center">
                  <div
                    className="w-8 h-8 rounded-full border border-slate-400 mx-auto mb-1"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="text-xs font-bold text-slate-700">{color.nameEn}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center text-xs text-slate-400 border-t border-slate-200 pt-4">
            Rainbow Colors Primary English Fun Lab · Page 1
          </div>
        </div>
      )}

      {/* --- PREVIEW 3: MINI FLASHCARD CUTOUTS --- */}
      {printMode === 'flashcard_cutouts' && (
        <div className="bg-white p-8 sm:p-12 rounded-3xl border-2 border-slate-200 shadow-sm max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between border-b-2 border-slate-800 pb-3">
            <div>
              <h2 className="text-2xl font-bold font-display text-slate-900">
                ✂️ Mini Classroom Flashcard Cutouts (随堂迷你剪切词卡)
              </h2>
              <p className="text-xs text-slate-500">
                可打印在卡纸上，沿虚线剪下作为随堂快闪记忆卡或小组配对卡片使用。
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">Total: 11 Cards</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {COLORS_DATA.map((color) => (
              <div
                key={color.id}
                className="border-2 border-dashed border-slate-400 rounded-2xl p-4 flex flex-col items-center justify-between text-center space-y-2 bg-slate-50/40"
              >
                <div className="flex items-center justify-between w-full text-xs">
                  <span className="font-bold text-slate-800 font-display">{color.nameEn}</span>
                  <span className="text-slate-500">{color.nameZh}</span>
                </div>

                <div className="my-2">
                  <ColorObjectIllustration
                    type={color.singular.iconType}
                    className="w-16 h-16"
                  />
                </div>

                <div className="w-full pt-1 border-t border-slate-200 text-[10px] space-y-0.5">
                  <div className="font-bold text-slate-800">
                    {color.singular.answerEn}
                  </div>
                  <div className="text-slate-400 font-mono">
                    {color.phonetic}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
