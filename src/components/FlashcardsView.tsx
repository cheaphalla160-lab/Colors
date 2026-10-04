import React, { useState } from 'react';
import { COLORS_DATA } from '../data/colorsData';
import { ColorItem } from '../types';
import { ColorObjectIllustration } from './ColorIcons';
import { Volume2, Sparkles, Lightbulb, PlayCircle, Snail } from 'lucide-react';
import { speakSentence, speakWord, sound } from '../utils/audio';

export const FlashcardsView: React.FC = () => {
  const [mode, setMode] = useState<'singular' | 'plural'>('singular');
  const [selectedColor, setSelectedColor] = useState<ColorItem>(COLORS_DATA[0]);
  const [filterType, setFilterType] = useState<'all' | 'warm' | 'cool' | 'neutral'>('all');

  const warmColors = ['red', 'orange', 'yellow', 'pink'];
  const coolColors = ['green', 'blue', 'purple'];
  const neutralColors = ['brown', 'black', 'white', 'grey'];

  const filteredColors = COLORS_DATA.filter(c => {
    if (filterType === 'warm') return warmColors.includes(c.id);
    if (filterType === 'cool') return coolColors.includes(c.id);
    if (filterType === 'neutral') return neutralColors.includes(c.id);
    return true;
  });

  const handlePlayVoice = (color: ColorItem, isSlow: boolean = false) => {
    sound.playClick();
    const rate = isSlow ? 0.72 : 0.95;
    if (mode === 'singular') {
      speakSentence(color.singular.questionEn, color.singular.answerEn, rate);
    } else {
      speakSentence(color.plural.questionEn, color.plural.answerEn, rate);
    }
  };

  const handleCardClick = (color: ColorItem) => {
    setSelectedColor(color);
    handlePlayVoice(color);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Hero / Concept Banner */}
      <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-rose-50 rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-xs relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 tracking-wide uppercase">
            <span>Primary English Lesson Plan</span>
            <span>·</span>
            <span>Unit: Colors (颜色)</span>
            <span>·</span>
            <span>Grade 1-3</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight font-display">
            互动词卡与核心句型
          </h1>

          <p className="text-base sm:text-lg text-slate-700 font-medium">
            本课重点带孩子们掌握 11 种常见颜色单词，以及单复数核心疑问与回答句型：
          </p>

          {/* Grammar Target Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div
              onClick={() => { sound.playClick(); setMode('singular'); }}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                mode === 'singular'
                  ? 'bg-white border-amber-500 shadow-md shadow-amber-500/10 scale-[1.01]'
                  : 'bg-white/60 border-amber-100 hover:border-amber-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                  单数句型 Singular (单个物体)
                </span>
                {mode === 'singular' && (
                  <span className="text-xs font-semibold text-amber-600 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> 教学模式
                  </span>
                )}
              </div>
              <div className="text-lg font-bold text-slate-900 font-display">
                What color is it?
              </div>
              <div className="text-sm text-slate-600">它是什么颜色？</div>
              <div className="mt-2 text-base font-bold text-amber-700 font-display">
                👉 It's + [颜色]. <span className="text-sm font-normal text-slate-600">(它是……)</span>
              </div>
            </div>

            <div
              onClick={() => { sound.playClick(); setMode('plural'); }}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                mode === 'plural'
                  ? 'bg-white border-sky-500 shadow-md shadow-sky-500/10 scale-[1.01]'
                  : 'bg-white/60 border-sky-100 hover:border-sky-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded-md">
                  复数句型 Plural (多个物体)
                </span>
                {mode === 'plural' && (
                  <span className="text-xs font-semibold text-sky-600 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> 教学模式
                  </span>
                )}
              </div>
              <div className="text-lg font-bold text-slate-900 font-display">
                What colour are they?
              </div>
              <div className="text-sm text-slate-600">它们是什么颜色？</div>
              <div className="mt-2 text-base font-bold text-sky-700 font-display">
                👉 They're + [颜色]. <span className="text-sm font-normal text-slate-600">(它们是……)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Controls & Category Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">分类筛选:</span>
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
            {[
              { id: 'all', label: '全部 (11色)' },
              { id: 'warm', label: '暖色调 Warm' },
              { id: 'cool', label: '冷色调 Cool' },
              { id: 'neutral', label: '中性色 Neutral' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => { sound.playClick(); setFilterType(f.id as typeof filterType); }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  filterType === f.id
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Global Pronunciation Helpers */}
        <div className="flex items-center gap-3 text-xs text-slate-600">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            点击卡片即刻发音
          </span>
          <span>·</span>
          <span>支持标准音标与慢速跟读</span>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredColors.map((color) => {
          const isSelected = selectedColor.id === color.id;
          const currentData = mode === 'singular' ? color.singular : color.plural;

          return (
            <div
              key={color.id}
              onClick={() => handleCardClick(color)}
              className={`group relative rounded-3xl p-5 border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between hover:-translate-y-1 shadow-xs hover:shadow-md ${
                isSelected
                  ? 'border-amber-400 bg-white ring-4 ring-amber-200/50'
                  : 'border-slate-200/80 bg-white hover:border-amber-300'
              }`}
            >
              {/* Card Top: Color Badge & Phonetic */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-5 h-5 rounded-full shadow-inner border border-black/10"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="font-display font-bold text-xl text-slate-900">
                    {color.nameEn}
                  </span>
                  <span className="text-sm font-semibold text-slate-500">
                    {color.nameZh}
                  </span>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  {color.phonetic}
                </span>
              </div>

              {/* Card Center: Cute Illustration */}
              <div className="my-4 py-4 flex flex-col items-center justify-center bg-slate-50/70 rounded-2xl border border-slate-100/80 group-hover:bg-amber-50/40 transition-colors">
                <div className="transition-transform group-hover:scale-105 duration-200">
                  <ColorObjectIllustration
                    type={currentData.iconType}
                    isPlural={mode === 'plural'}
                    className="w-24 h-24 drop-shadow-sm"
                  />
                </div>
                <div className="mt-2 text-xs font-semibold text-slate-600">
                  {currentData.objectNameEn} ({currentData.objectNameZh})
                </div>
              </div>

              {/* Card Bottom: Target Dialogue */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="text-xs font-semibold text-slate-500">
                  Q: {currentData.questionEn}
                </div>
                <div className="text-sm font-bold text-slate-900 font-display flex items-center justify-between">
                  <span>A: {currentData.answerEn}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayVoice(color);
                    }}
                    title="朗读对话"
                    className="p-1.5 text-amber-600 hover:text-amber-800 hover:bg-amber-100 rounded-lg transition-colors"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-xs text-slate-500">
                  {currentData.questionZh} {currentData.answerZh}
                </div>
              </div>

              {/* Quick Actions (Slow speak & word sound) */}
              <div className="mt-3 pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    sound.playClick();
                    speakWord(color.nameEn, 0.85);
                  }}
                  className="text-amber-700 hover:underline flex items-center gap-1 font-medium"
                >
                  <PlayCircle className="w-3.5 h-3.5" /> 读单词
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayVoice(color, true);
                  }}
                  className="text-slate-600 hover:text-amber-700 flex items-center gap-1 font-medium"
                >
                  <Snail className="w-3.5 h-3.5" /> 慢速整句
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Classroom Teaching Assistant Section (备课锦囊) */}
      <div className="bg-amber-50/50 rounded-3xl p-6 sm:p-8 border border-amber-200/80 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500 text-white rounded-2xl shadow-sm">
            <Lightbulb className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-display">
              老师备课锦囊 · 课堂趣味活动设计指南
            </h2>
            <p className="text-sm text-slate-600">
              专为小学 1-3 年级英语课堂设计的 3 个轻量互动教学游戏
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Game 1 */}
          <div className="bg-white p-5 rounded-2xl border border-amber-200/60 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                游戏 1 · TPR 身体律动
              </span>
              <span className="text-xs text-slate-400">耗时 3-5 分钟</span>
            </div>
            <h3 className="font-bold text-slate-900 font-display">
              Touch the Color (指认身边颜色)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              老师举起词卡提问：“What color is it? It's blue!” 学生必须在 5 秒内用手指触碰教室里或书包里蓝色的物品，大声复述：“It's blue!” 训练听觉敏锐度与口语反应。
            </p>
          </div>

          {/* Game 2 */}
          <div className="bg-white p-5 rounded-2xl border border-amber-200/60 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                游戏 2 · 节奏说唱
              </span>
              <span className="text-xs text-slate-400">耗时 5 分钟</span>
            </div>
            <h3 className="font-bold text-slate-900 font-display">
              Sing & Chant (彩虹拍手歌)
            </h3>
            <div className="text-xs font-mono bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-700">
              Red, yellow, green and blue,<br />
              What color is it? Tell me true!<br />
              It's red, it's blue, it's green for you!
            </div>
            <p className="text-xs text-slate-600">
              老师与全班击掌打节拍，齐声练读，强化语音语调记忆。
            </p>
          </div>

          {/* Game 3 */}
          <div className="bg-white p-5 rounded-2xl border border-amber-200/60 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-md">
                教学难点 · 单复数突破
              </span>
              <span className="text-xs text-slate-400">语法点拔</span>
            </div>
            <h3 className="font-bold text-slate-900 font-display">
              It's vs They're 对比小口诀
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>一个物体问“is it”，回答“It's”</strong>；<br />
              <strong>两个以上问“are they”，回答“They're”</strong>！<br />
              配合本网页的<span className="text-sky-600 font-semibold">【双人PK对决】</span>和<span className="text-amber-600 font-semibold">【句型拼图】</span>，让孩子们在闯关中自然形成语感。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
