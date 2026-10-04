import React, { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { COLORS_DATA } from '../data/colorsData';
import { ColorItem } from '../types';
import { ColorObjectIllustration } from './ColorIcons';
import { Swords, Trophy, RotateCcw, Volume2, Flame, Bot, Users, Play, Crown } from 'lucide-react';
import { sound, speakWord, speakSentence } from '../utils/audio';

interface Question {
  color: ColorItem;
  isPlural: boolean;
  choices: ColorItem[];
}

export const PkGame: React.FC = () => {
  const [gameMode, setGameMode] = useState<'pvp' | 'bot'>('pvp');
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'round_result' | 'game_over'>('ready');
  
  const [totalRounds] = useState(8);
  const [currentRound, setCurrentRound] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);

  // Scores and streaks
  const [redScore, setRedScore] = useState(0);
  const [blueScore, setBlueScore] = useState(0);
  const [redStreak, setRedStreak] = useState(0);
  const [blueStreak, setBlueStreak] = useState(0);

  // Round Winner indicator
  const [roundWinner, setRoundWinner] = useState<'red' | 'blue' | 'timeout' | null>(null);
  const [timeLeft, setTimeLeft] = useState(10);

  const timerRef = useRef<number | null>(null);
  const botTimeoutRef = useRef<number | null>(null);

  // Generate a randomized question
  const generateQuestion = useCallback((): Question => {
    const targetColor = COLORS_DATA[Math.floor(Math.random() * COLORS_DATA.length)];
    const isPlural = Math.random() > 0.5;

    // Pick 3 random distractor colors
    const distractors = COLORS_DATA
      .filter(c => c.id !== targetColor.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    const choices = [targetColor, ...distractors].sort(() => Math.random() - 0.5);

    return {
      color: targetColor,
      isPlural,
      choices
    };
  }, []);

  // Start new round
  const startRound = useCallback((roundNum: number) => {
    setCurrentRound(roundNum);
    const q = generateQuestion();
    setCurrentQuestion(q);
    setRoundWinner(null);
    setTimeLeft(10);
    setGameState('playing');

    // Speak Question prompt
    if (q.isPlural) {
      speakSentence(q.color.plural.questionEn, "");
    } else {
      speakSentence(q.color.singular.questionEn, "");
    }

    // Bot AI logic if bot mode is active
    if (gameMode === 'bot') {
      // Bot has a reaction time between 1.8s and 4.2s, 85% accuracy
      const reactionTime = 1800 + Math.random() * 2200;
      botTimeoutRef.current = window.setTimeout(() => {
        const isCorrect = Math.random() < 0.85;
        const chosen = isCorrect
          ? q.color
          : q.choices.find(c => c.id !== q.color.id) || q.choices[0];
        handleAnswer('blue', chosen);
      }, reactionTime);
    }
  }, [generateQuestion, gameMode]);

  // Start entire match
  const handleStartMatch = () => {
    sound.playClick();
    setRedScore(0);
    setBlueScore(0);
    setRedStreak(0);
    setBlueStreak(0);
    startRound(1);
  };

  // Timer loop
  useEffect(() => {
    if (gameState !== 'playing') {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = window.setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleRoundTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (botTimeoutRef.current) clearTimeout(botTimeoutRef.current);
    };
  }, [gameState]);

  const handleRoundTimeout = () => {
    setRoundWinner('timeout');
    setGameState('round_result');
    sound.playWrong();
    proceedToNext();
  };

  // Answer handler
  const handleAnswer = (team: 'red' | 'blue', chosen: ColorItem) => {
    if (gameState !== 'playing' || !currentQuestion) return;

    if (botTimeoutRef.current) clearTimeout(botTimeoutRef.current);

    const isCorrect = chosen.id === currentQuestion.color.id;

    if (isCorrect) {
      sound.playSuccess();
      setRoundWinner(team);
      setGameState('round_result');

      const speedBonus = timeLeft * 10;
      const basePoints = 100 + speedBonus;

      if (team === 'red') {
        const nextStreak = redStreak + 1;
        setRedStreak(nextStreak);
        setBlueStreak(0);
        const streakBonus = nextStreak > 1 ? 30 * nextStreak : 0;
        setRedScore(prev => prev + basePoints + streakBonus);
      } else {
        const nextStreak = blueStreak + 1;
        setBlueStreak(nextStreak);
        setRedStreak(0);
        const streakBonus = nextStreak > 1 ? 30 * nextStreak : 0;
        setBlueScore(prev => prev + basePoints + streakBonus);
      }

      // Speak answer confirmation
      const answer = currentQuestion.isPlural
        ? currentQuestion.color.plural.answerEn
        : currentQuestion.color.singular.answerEn;
      speakWord(`Correct! ${answer}`);

      proceedToNext();
    } else {
      // Wrong answer
      sound.playWrong();
      if (team === 'red') {
        setRedScore(prev => Math.max(0, prev - 30));
        setRedStreak(0);
      } else {
        setBlueScore(prev => Math.max(0, prev - 30));
        setBlueStreak(0);
      }
    }
  };

  // Progress to next round or end game
  const proceedToNext = () => {
    setTimeout(() => {
      if (currentRound >= totalRounds) {
        setGameState('game_over');
        sound.playBingoFanfare();
        confetti({ particleCount: 150, spread: 90, origin: { y: 0.5 } });
      } else {
        startRound(currentRound + 1);
      }
    }, 2000);
  };

  // Keyboard shortcut listener for high-speed classroom competition
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing' || !currentQuestion) return;

      // Red Team keys: 1, 2, 3, 4 (or A, S, D, F)
      const redKeyMap: { [key: string]: number } = {
        '1': 0, '2': 1, '3': 2, '4': 3,
        'a': 0, 's': 1, 'd': 2, 'f': 3,
        'A': 0, 'S': 1, 'D': 2, 'F': 3
      };

      // Blue Team keys: 7, 8, 9, 0 (or J, K, L, ;)
      const blueKeyMap: { [key: string]: number } = {
        '7': 0, '8': 1, '9': 2, '0': 3,
        'j': 0, 'k': 1, 'l': 2, ';': 3,
        'J': 0, 'K': 1, 'L': 2
      };

      if (redKeyMap[e.key] !== undefined) {
        const idx = redKeyMap[e.key];
        if (currentQuestion.choices[idx]) {
          handleAnswer('red', currentQuestion.choices[idx]);
        }
      } else if (gameMode === 'pvp' && blueKeyMap[e.key] !== undefined) {
        const idx = blueKeyMap[e.key];
        if (currentQuestion.choices[idx]) {
          handleAnswer('blue', currentQuestion.choices[idx]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, currentQuestion, gameMode]);

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-red-50 via-amber-50 to-sky-50 rounded-3xl p-6 sm:p-8 border border-red-200/70 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-800 tracking-wide uppercase">
            <span>Interactive Game 03</span>
            <span>·</span>
            <span>Classroom Duel (红蓝抢答擂台)</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight font-display mt-1">
            双人红蓝色彩大PK
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-1 max-w-xl">
            听屏幕发问抢先按下正确答案！支持两位学生同台触屏抢答，或单人挑战聪明小恐龙机器人！
          </p>
        </div>

        {/* Game Mode Selector */}
        <div className="flex items-center gap-3">
          <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-2xs">
            <button
              onClick={() => { sound.playClick(); setGameMode('pvp'); }}
              disabled={gameState === 'playing'}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                gameMode === 'pvp'
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>双人对战 (PvP)</span>
            </button>
            <button
              onClick={() => { sound.playClick(); setGameMode('bot'); }}
              disabled={gameState === 'playing'}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                gameMode === 'bot'
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>人机挑战 (vs Bot)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Game Stage */}
      {gameState === 'ready' && (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border-2 border-slate-200 text-center space-y-6 shadow-xs">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-rose-500/20 animate-subtle-bounce">
            <Swords className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
              准备好开始红蓝大对决了吗？
            </h2>
            <p className="text-slate-600 text-sm max-w-md mx-auto">
              共 <strong>{totalRounds}</strong> 轮对决。根据图画和语音判断：单数用 <strong>It's</strong>，复数用 <strong>They're</strong>！
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto text-xs text-left bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <span className="font-bold text-rose-600 block mb-1">🔴 红队快捷键:</span>
              <span className="font-mono text-slate-500">按键 A, S, D, F 或 1, 2, 3, 4</span>
            </div>
            <div>
              <span className="font-bold text-sky-600 block mb-1">🔵 蓝队快捷键:</span>
              <span className="font-mono text-slate-500">按键 J, K, L, ; 或 7, 8, 9, 0</span>
            </div>
          </div>

          <button
            onClick={handleStartMatch}
            className="px-10 py-4 bg-gradient-to-r from-rose-600 to-orange-500 hover:from-rose-700 hover:to-orange-600 text-white font-display font-bold text-xl rounded-2xl shadow-md shadow-rose-500/20 active:scale-95 transition-all inline-flex items-center gap-2"
          >
            <Play className="w-6 h-6 fill-white" />
            <span>开启对战 (Start Battle)</span>
          </button>
        </div>
      )}

      {(gameState === 'playing' || gameState === 'round_result') && currentQuestion && (
        <div className="space-y-6">
          
          {/* Top Battle HUD: Scoreboards & Timer */}
          <div className="grid grid-cols-12 gap-4 items-center">
            {/* Red Team Score Header */}
            <div className="col-span-4 bg-rose-50 border-2 border-rose-200 rounded-3xl p-4 flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center font-bold text-lg">
                  🔴
                </div>
                <div>
                  <div className="text-xs font-bold text-rose-900">红队 Team Red</div>
                  <div className="text-2xl font-extrabold text-rose-600 font-display">
                    {redScore}
                  </div>
                </div>
              </div>
              {redStreak > 1 && (
                <div className="flex items-center gap-1 bg-rose-200/80 text-rose-900 px-2 py-0.5 rounded-lg text-xs font-bold">
                  <Flame className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
                  <span>{redStreak}连胜</span>
                </div>
              )}
            </div>

            {/* Center Stage Info & Timer */}
            <div className="col-span-4 text-center space-y-1">
              <div className="text-xs font-bold text-slate-400">
                ROUND {currentRound} / {totalRounds}
              </div>
              <div className="text-3xl font-extrabold text-slate-800 font-display">
                ⏱️ {timeLeft}s
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full transition-all duration-1000 ease-linear rounded-full"
                  style={{ width: `${(timeLeft / 10) * 100}%` }}
                />
              </div>
            </div>

            {/* Blue Team Score Header */}
            <div className="col-span-4 bg-sky-50 border-2 border-sky-200 rounded-3xl p-4 flex items-center justify-between shadow-2xs">
              {blueStreak > 1 && (
                <div className="flex items-center gap-1 bg-sky-200/80 text-sky-900 px-2 py-0.5 rounded-lg text-xs font-bold">
                  <Flame className="w-3.5 h-3.5 text-sky-600 fill-sky-600" />
                  <span>{blueStreak}连胜</span>
                </div>
              )}
              <div className="flex items-center gap-3 ml-auto text-right">
                <div>
                  <div className="text-xs font-bold text-sky-900">
                    {gameMode === 'bot' ? '恐龙机器人 Dino Bot' : '蓝队 Team Blue'}
                  </div>
                  <div className="text-2xl font-extrabold text-sky-600 font-display">
                    {blueScore}
                  </div>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-sky-500 text-white flex items-center justify-center font-bold text-lg">
                  🔵
                </div>
              </div>
            </div>
          </div>

          {/* Center Stage: The Question Object & Prompt */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-xs text-center space-y-4 relative">
            
            {/* Round Result Ribbon */}
            {roundWinner && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 animate-subtle-bounce">
                {roundWinner === 'red' && (
                  <div className="bg-rose-500 text-white font-bold px-6 py-2 rounded-full shadow-lg text-sm flex items-center gap-2">
                    <Trophy className="w-4 h-4" /> 红队抢答成功 +得分！
                  </div>
                )}
                {roundWinner === 'blue' && (
                  <div className="bg-sky-500 text-white font-bold px-6 py-2 rounded-full shadow-lg text-sm flex items-center gap-2">
                    <Trophy className="w-4 h-4" /> 蓝队抢答成功 +得分！
                  </div>
                )}
                {roundWinner === 'timeout' && (
                  <div className="bg-slate-700 text-white font-bold px-6 py-2 rounded-full shadow-lg text-sm">
                    时间到！两队均未得分
                  </div>
                )}
              </div>
            )}

            {/* Illustration */}
            <div className="flex justify-center py-2">
              <div className="p-4 bg-slate-50 rounded-3xl border border-slate-100 shadow-inner">
                <ColorObjectIllustration
                  type={currentQuestion.isPlural ? currentQuestion.color.plural.iconType : currentQuestion.color.singular.iconType}
                  isPlural={currentQuestion.isPlural}
                  className="w-32 h-32"
                />
              </div>
            </div>

            {/* Spoken Question */}
            <div className="space-y-1">
              <div className="text-2xl font-extrabold text-slate-900 font-display flex items-center justify-center gap-2">
                <span>{currentQuestion.isPlural ? currentQuestion.color.plural.questionEn : currentQuestion.color.singular.questionEn}</span>
                <button
                  onClick={() => {
                    sound.playClick();
                    if (currentQuestion.isPlural) {
                      speakWord(currentQuestion.color.plural.questionEn);
                    } else {
                      speakWord(currentQuestion.color.singular.questionEn);
                    }
                  }}
                  className="p-1.5 text-amber-600 hover:text-amber-800 hover:bg-amber-100 rounded-lg transition-colors"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>
              <div className="text-xs text-slate-500">
                {currentQuestion.isPlural ? currentQuestion.color.plural.questionZh : currentQuestion.color.singular.questionZh}
                {' '}({currentQuestion.isPlural ? currentQuestion.color.plural.objectNameZh : currentQuestion.color.singular.objectNameZh})
              </div>
            </div>
          </div>

          {/* Dual Action Playfields (Red Left vs Blue Right) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Red Team Choices (Left) */}
            <div className="bg-rose-50/50 p-5 rounded-3xl border-2 border-rose-200/80 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-rose-800 mb-2">
                <span>🔴 红队操作区 (Team Red)</span>
                <span className="text-[11px] text-rose-500 font-normal">按 A, S, D, F 或点击</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {currentQuestion.choices.map((choice, idx) => (
                  <button
                    key={choice.id}
                    onClick={() => handleAnswer('red', choice)}
                    disabled={gameState !== 'playing'}
                    className="p-4 bg-white hover:bg-rose-100 active:scale-95 border-2 border-rose-200 hover:border-rose-400 rounded-2xl shadow-xs transition-all flex flex-col items-center gap-1.5 group cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: choice.hex }} />
                      <span className="font-display font-bold text-base text-slate-900 group-hover:text-rose-700">
                        {choice.nameEn}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 font-medium">
                      {choice.nameZh}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Blue Team Choices (Right) */}
            <div className="bg-sky-50/50 p-5 rounded-3xl border-2 border-sky-200/80 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-sky-800 mb-2">
                <span>🔵 蓝队操作区 (Team Blue)</span>
                <span className="text-[11px] text-sky-500 font-normal">
                  {gameMode === 'bot' ? '机器人自动抢答中' : '按 J, K, L, ; 或点击'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {currentQuestion.choices.map((choice, idx) => (
                  <button
                    key={choice.id}
                    onClick={() => handleAnswer('blue', choice)}
                    disabled={gameState !== 'playing' || gameMode === 'bot'}
                    className={`p-4 bg-white border-2 rounded-2xl shadow-xs transition-all flex flex-col items-center gap-1.5 group ${
                      gameMode === 'bot'
                        ? 'opacity-80 border-sky-200 cursor-not-allowed'
                        : 'hover:bg-sky-100 active:scale-95 border-sky-200 hover:border-sky-400 cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: choice.hex }} />
                      <span className="font-display font-bold text-base text-slate-900 group-hover:text-sky-700">
                        {choice.nameEn}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 font-medium">
                      {choice.nameZh}
                    </span>
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Game Over Victory Podium Modal / Screen */}
      {gameState === 'game_over' && (
        <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border-2 border-amber-300 shadow-xl text-center space-y-8 animate-subtle-bounce">
          <div className="space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
              <Crown className="w-8 h-8 fill-amber-500 text-amber-500" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 font-display">
              比赛结束 · 优胜者诞生！
            </h2>
            <p className="text-slate-600 text-sm">
              双方都表现得极具英语色彩天赋！
            </p>
          </div>

          {/* Podium Score Comparison */}
          <div className="grid grid-cols-2 gap-6 max-w-lg mx-auto">
            <div className={`p-6 rounded-3xl border-2 transition-all ${
              redScore >= blueScore
                ? 'bg-rose-50 border-rose-400 shadow-md ring-4 ring-rose-200'
                : 'bg-slate-50 border-slate-200 opacity-70'
            }`}>
              {redScore >= blueScore && (
                <span className="text-xs font-bold text-white bg-rose-500 px-3 py-0.5 rounded-full inline-block mb-2">
                  🏆 冠军 CHAMPION
                </span>
              )}
              <div className="text-base font-bold text-rose-900">红队 Team Red</div>
              <div className="text-4xl font-extrabold text-rose-600 font-display mt-2">
                {redScore}
              </div>
              <div className="text-xs text-slate-500 mt-1">分 (Points)</div>
            </div>

            <div className={`p-6 rounded-3xl border-2 transition-all ${
              blueScore >= redScore
                ? 'bg-sky-50 border-sky-400 shadow-md ring-4 ring-sky-200'
                : 'bg-slate-50 border-slate-200 opacity-70'
            }`}>
              {blueScore >= redScore && (
                <span className="text-xs font-bold text-white bg-sky-500 px-3 py-0.5 rounded-full inline-block mb-2">
                  🏆 冠军 CHAMPION
                </span>
              )}
              <div className="text-base font-bold text-sky-900">
                {gameMode === 'bot' ? '恐龙机器人' : '蓝队 Team Blue'}
              </div>
              <div className="text-4xl font-extrabold text-sky-600 font-display mt-2">
                {blueScore}
              </div>
              <div className="text-xs text-slate-500 mt-1">分 (Points)</div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4 flex justify-center gap-4">
            <button
              onClick={handleStartMatch}
              className="px-8 py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-bold font-display rounded-2xl shadow-md transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              <span>再战一局 (Rematch)</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
