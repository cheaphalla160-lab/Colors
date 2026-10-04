import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { COLORS_DATA } from '../data/colorsData';
import { ColorItem } from '../types';
import { ColorObjectIllustration } from './ColorIcons';
import { Sparkles, Check, ArrowRight, RotateCcw, Volume2, Beaker, HelpCircle, Star } from 'lucide-react';
import { sound, speakSentence, speakWord } from '../utils/audio';

type PuzzleMode = 'sentence' | 'mixing';

interface MixingRecipe {
  color1: ColorItem;
  color2: ColorItem;
  result: ColorItem;
  formulaEn: string;
  formulaZh: string;
}

export const PuzzleGame: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PuzzleMode>('sentence');

  // --- Mode 1: Sentence Builder Puzzle State ---
  const [levelIndex, setLevelIndex] = useState(0);
  const [isPluralLevel, setIsPluralLevel] = useState(false);
  const [currentColor, setCurrentColor] = useState<ColorItem>(COLORS_DATA[0]);
  const [targetTokens, setTargetTokens] = useState<string[]>([]);
  const [scrambledTokens, setScrambledTokens] = useState<{ id: string; text: string }[]>([]);
  const [selectedTokens, setSelectedTokens] = useState<{ id: string; text: string }[]>([]);
  const [isLevelSolved, setIsLevelSolved] = useState(false);
  const [sentenceScore, setSentenceScore] = useState(0);

  // Setup Sentence Puzzle Level
  const setupLevel = (index: number) => {
    const color = COLORS_DATA[index % COLORS_DATA.length];
    const isPlural = Math.random() > 0.5; // alternate or randomize
    setCurrentColor(color);
    setIsPluralLevel(isPlural);
    setIsLevelSolved(false);

    const prefix = isPlural ? "They're" : "It's";
    const colorWord = color.nameEn.toLowerCase();
    const correctTokens = [prefix, colorWord, '.'];
    setTargetTokens(correctTokens);

    // Create pool with correct tokens plus 2 distractor tokens
    const distractorPrefix = isPlural ? "It's" : "They're";
    const otherColors = COLORS_DATA.filter(c => c.id !== color.id);
    const distractorColor = otherColors[Math.floor(Math.random() * otherColors.length)].nameEn.toLowerCase();

    const pool = [
      ...correctTokens.map((t, idx) => ({ id: `token-${idx}-${t}`, text: t })),
      { id: `distract-1-${distractorPrefix}`, text: distractorPrefix },
      { id: `distract-2-${distractorColor}`, text: distractorColor }
    ].sort(() => Math.random() - 0.5);

    setScrambledTokens(pool);
    setSelectedTokens([]);

    // Speak the question prompt
    if (isPlural) {
      speakWord(color.plural.questionEn);
    } else {
      speakWord(color.singular.questionEn);
    }
  };

  useEffect(() => {
    setupLevel(levelIndex);
  }, [levelIndex]);

  // Handle clicking a piece in scrambled tray
  const handleSelectToken = (token: { id: string; text: string }) => {
    sound.playClick();
    setScrambledTokens(prev => prev.filter(t => t.id !== token.id));
    const nextSelected = [...selectedTokens, token];
    setSelectedTokens(nextSelected);

    // Check if sentence matches target
    if (nextSelected.length === targetTokens.length) {
      const currentSentence = nextSelected.map(t => t.text).join(' ');
      const targetSentence = targetTokens.join(' ');

      if (currentSentence.toLowerCase() === targetSentence.toLowerCase()) {
        setIsLevelSolved(true);
        setSentenceScore(prev => prev + 10);
        sound.playSuccess();
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
        const answer = isPluralLevel ? currentColor.plural.answerEn : currentColor.singular.answerEn;
        speakWord(`Great job! ${answer}`);
      } else {
        sound.playWrong();
      }
    }
  };

  // Remove a placed token
  const handleRemoveToken = (token: { id: string; text: string }) => {
    if (isLevelSolved) return;
    sound.playClick();
    setSelectedTokens(prev => prev.filter(t => t.id !== token.id));
    setScrambledTokens(prev => [...prev, token]);
  };

  // --- Mode 2: Color Mixing Lab State ---
  const recipes: MixingRecipe[] = [
    {
      color1: COLORS_DATA.find(c => c.id === 'red')!,
      color2: COLORS_DATA.find(c => c.id === 'yellow')!,
      result: COLORS_DATA.find(c => c.id === 'orange')!,
      formulaEn: "Red + Yellow = Orange",
      formulaZh: "红色 + 黄色 = 橙色"
    },
    {
      color1: COLORS_DATA.find(c => c.id === 'blue')!,
      color2: COLORS_DATA.find(c => c.id === 'yellow')!,
      result: COLORS_DATA.find(c => c.id === 'green')!,
      formulaEn: "Blue + Yellow = Green",
      formulaZh: "蓝色 + 黄色 = 绿色"
    },
    {
      color1: COLORS_DATA.find(c => c.id === 'red')!,
      color2: COLORS_DATA.find(c => c.id === 'blue')!,
      result: COLORS_DATA.find(c => c.id === 'purple')!,
      formulaEn: "Red + Blue = Purple",
      formulaZh: "红色 + 蓝色 = 紫色"
    },
    {
      color1: COLORS_DATA.find(c => c.id === 'black')!,
      color2: COLORS_DATA.find(c => c.id === 'white')!,
      result: COLORS_DATA.find(c => c.id === 'grey')!,
      formulaEn: "Black + White = Grey",
      formulaZh: "黑色 + 白色 = 灰色"
    },
    {
      color1: COLORS_DATA.find(c => c.id === 'red')!,
      color2: COLORS_DATA.find(c => c.id === 'white')!,
      result: COLORS_DATA.find(c => c.id === 'pink')!,
      formulaEn: "Red + White = Pink",
      formulaZh: "红色 + 白色 = 粉色"
    }
  ];

  const [recipeIndex, setRecipeIndex] = useState(0);
  const [selectedMixColors, setSelectedMixColors] = useState<ColorItem[]>([]);
  const [isMixSuccess, setIsMixSuccess] = useState(false);

  const currentRecipe = recipes[recipeIndex];

  const handleMixSelect = (color: ColorItem) => {
    sound.playClick();
    if (selectedMixColors.length >= 2 || isMixSuccess) return;

    const next = [...selectedMixColors, color];
    setSelectedMixColors(next);

    if (next.length === 2) {
      // Check recipe match
      const ids = [next[0].id, next[1].id].sort();
      const targetIds = [currentRecipe.color1.id, currentRecipe.color2.id].sort();

      if (ids[0] === targetIds[0] && ids[1] === targetIds[1]) {
        setIsMixSuccess(true);
        sound.playSuccess();
        confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
        speakSentence(
          `What color is it?`,
          `It's ${currentRecipe.result.nameEn.toLowerCase()}! Magic!`
        );
      } else {
        sound.playWrong();
        setTimeout(() => {
          setSelectedMixColors([]);
        }, 1200);
      }
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-amber-50 rounded-3xl p-6 sm:p-8 border border-purple-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-800 tracking-wide uppercase">
            <span>Interactive Game 02</span>
            <span>·</span>
            <span>Puzzle & Logic Fun (解谜与句型拼图)</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight font-display mt-1">
            色彩解谜与句型拼图
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-1 max-w-xl">
            拖动拼图碎片拼接完整英语句子，或进入神奇调色实验室，用原色配对解锁新颜色！
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-2xs">
          <button
            onClick={() => { sound.playClick(); setActiveTab('sentence'); }}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'sentence'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🧩 句型拼词拼图
          </button>
          <button
            onClick={() => { sound.playClick(); setActiveTab('mixing'); }}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'mixing'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🧪 魔法调色实验室
          </button>
        </div>
      </div>

      {/* Mode A: Sentence Builder Puzzle */}
      {activeTab === 'sentence' && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-purple-100 shadow-xs space-y-8">
            
            {/* Header / Score bar */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-purple-800 bg-purple-100 px-3 py-1 rounded-lg">
                  第 {levelIndex + 1} 关 / 共 {COLORS_DATA.length} 关
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  难度: {isPluralLevel ? '复数 Plural (They\'re)' : '单数 Singular (It\'s)'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-amber-500 font-bold font-display text-base">
                <Star className="w-5 h-5 fill-amber-400" />
                <span>得分: {sentenceScore}</span>
              </div>
            </div>

            {/* Stage: Target Image & Question */}
            <div className="flex flex-col items-center justify-center space-y-4 py-4">
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200/80 shadow-inner">
                <ColorObjectIllustration
                  type={isPluralLevel ? currentColor.plural.iconType : currentColor.singular.iconType}
                  isPlural={isPluralLevel}
                  className="w-32 h-32"
                />
              </div>

              {/* Question Banner */}
              <div className="text-center space-y-1">
                <div className="text-lg font-bold text-slate-900 font-display flex items-center justify-center gap-2">
                  <span>Q: {isPluralLevel ? currentColor.plural.questionEn : currentColor.singular.questionEn}</span>
                  <button
                    onClick={() => {
                      sound.playClick();
                      if (isPluralLevel) {
                        speakWord(currentColor.plural.questionEn);
                      } else {
                        speakWord(currentColor.singular.questionEn);
                      }
                    }}
                    className="p-1.5 text-purple-600 hover:text-purple-800 hover:bg-purple-100 rounded-lg transition-colors"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="text-xs text-slate-500">
                  {isPluralLevel ? currentColor.plural.questionZh : currentColor.singular.questionZh}
                  {' '}({isPluralLevel ? currentColor.plural.objectNameZh : currentColor.singular.objectNameZh})
                </div>
              </div>
            </div>

            {/* Answer Assembly Slots (The Puzzle Frame) */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-500 flex items-center justify-between">
                <span>你的答案拼图槽 (Answer Slot):</span>
                <span className="text-[11px] font-normal text-slate-400">点击下方碎片填入，点击已填入碎片可撤回</span>
              </div>

              <div className="min-h-18 p-4 bg-slate-100/80 rounded-2xl border-2 border-dashed border-purple-300 flex flex-wrap items-center gap-3">
                {selectedTokens.length === 0 ? (
                  <div className="text-slate-400 text-sm font-medium w-full text-center py-2">
                    从下方点击拼图碎片，组合出正确回答句子...
                  </div>
                ) : (
                  selectedTokens.map((token) => (
                    <button
                      key={token.id}
                      onClick={() => handleRemoveToken(token)}
                      className="px-5 py-2.5 bg-purple-600 text-white font-display font-bold text-lg rounded-xl shadow-xs hover:bg-purple-700 transition-transform active:scale-95 flex items-center gap-1.5"
                    >
                      <span>{token.text}</span>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Scrambled Word Pieces Tray */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-500">拼图词卡备选盘 (Word Pieces):</div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-center gap-3">
                {scrambledTokens.map((token) => (
                  <button
                    key={token.id}
                    onClick={() => handleSelectToken(token)}
                    disabled={isLevelSolved}
                    className="px-5 py-3 bg-white text-slate-800 font-display font-bold text-lg rounded-xl border-2 border-slate-200/90 shadow-2xs hover:border-purple-400 hover:text-purple-700 hover:shadow-xs transition-all active:scale-95"
                  >
                    {token.text}
                  </button>
                ))}
              </div>
            </div>

            {/* Success Feedback & Next Level */}
            {isLevelSolved && (
              <div className="p-5 bg-emerald-50 border-2 border-emerald-400 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-subtle-bounce">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold">
                    <Check className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold text-emerald-950 font-display text-lg">
                      太棒了！拼图成功！
                    </div>
                    <div className="text-xs text-emerald-700">
                      完整回答: {isPluralLevel ? currentColor.plural.answerEn : currentColor.singular.answerEn}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    sound.playClick();
                    setLevelIndex(prev => prev + 1);
                  }}
                  className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold font-display rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
                >
                  <span>下一题 (Next Level)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Reset current level */}
            <div className="flex justify-end">
              <button
                onClick={() => setupLevel(levelIndex)}
                className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 font-medium"
              >
                <RotateCcw className="w-3.5 h-3.5" /> 重新摆放本题拼图
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Mode B: Magic Color Mixing Lab */}
      {activeTab === 'mixing' && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-purple-100 shadow-xs space-y-8">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-lg">
                  调色任务 {recipeIndex + 1} / {recipes.length}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  目标调配: {currentRecipe.result.nameEn} ({currentRecipe.result.nameZh})
                </span>
              </div>
              <button
                onClick={() => {
                  setSelectedMixColors([]);
                  setIsMixSuccess(false);
                }}
                className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" /> 清空烧杯
              </button>
            </div>

            {/* The Magic Mixing Cauldron / Flask */}
            <div className="flex flex-col items-center justify-center py-6 bg-gradient-to-b from-slate-50 to-purple-50/40 rounded-3xl border border-purple-100">
              <div className="relative w-44 h-44 rounded-full border-4 border-dashed border-purple-300 flex items-center justify-center bg-white shadow-inner">
                {isMixSuccess ? (
                  <div className="flex flex-col items-center justify-center animate-subtle-bounce">
                    <div
                      className="w-24 h-24 rounded-full shadow-lg border-4 border-white flex items-center justify-center"
                      style={{ backgroundColor: currentRecipe.result.hex }}
                    >
                      <Sparkles className="w-10 h-10 text-white animate-spin" style={{ animationDuration: '6s' }} />
                    </div>
                    <span className="font-display font-bold text-lg text-slate-900 mt-2">
                      {currentRecipe.result.nameEn}!
                    </span>
                  </div>
                ) : selectedMixColors.length === 0 ? (
                  <div className="text-center p-4">
                    <Beaker className="w-12 h-12 text-purple-300 mx-auto mb-2" />
                    <span className="text-xs font-medium text-slate-400">
                      请在下方点选 2 种颜料放入烧杯
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {selectedMixColors.map((c, i) => (
                      <div
                        key={i}
                        className="w-14 h-14 rounded-full shadow-md border-2 border-white flex items-center justify-center font-bold text-white text-xs"
                        style={{ backgroundColor: c.hex }}
                      >
                        {c.nameEn}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Formula hint */}
              <div className="mt-4 text-center">
                <div className="text-base font-bold text-slate-800 font-display">
                  {currentRecipe.formulaZh}
                </div>
                <div className="text-xs text-slate-500 font-mono">
                  {currentRecipe.formulaEn}
                </div>
              </div>
            </div>

            {/* Color Tubes Picker Tray */}
            <div className="space-y-3">
              <div className="text-xs font-semibold text-slate-500">点选两种原色进行混合 (Click 2 colors to mix):</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {COLORS_DATA.map((color) => {
                  const isSelected = selectedMixColors.some(c => c.id === color.id);
                  return (
                    <button
                      key={color.id}
                      onClick={() => handleMixSelect(color)}
                      disabled={isSelected || isMixSuccess}
                      className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                        isSelected
                          ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-300'
                          : 'border-slate-200 bg-white hover:border-purple-300 hover:shadow-xs'
                      }`}
                    >
                      <div
                        className="w-10 h-10 rounded-full border border-black/10 shadow-inner"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="text-xs font-bold text-slate-800 font-display">
                        {color.nameEn}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Victory banner for mixing */}
            {isMixSuccess && (
              <div className="p-5 bg-amber-50 border-2 border-amber-300 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-subtle-bounce">
                <div>
                  <div className="font-bold text-amber-950 font-display text-lg">
                    ✨ 魔法调色成功！
                  </div>
                  <div className="text-xs text-amber-800">
                    What color is it? 👉 It's {currentRecipe.result.nameEn.toLowerCase()}!
                  </div>
                </div>

                <button
                  onClick={() => {
                    sound.playClick();
                    setSelectedMixColors([]);
                    setIsMixSuccess(false);
                    setRecipeIndex(prev => (prev + 1) % recipes.length);
                  }}
                  className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold font-display rounded-xl shadow-xs transition-all flex items-center gap-2"
                >
                  <span>下一个调色实验</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
};
