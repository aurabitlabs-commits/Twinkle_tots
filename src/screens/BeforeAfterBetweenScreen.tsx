import { useState, useEffect } from 'react';
import { BackButton } from '@/components/BackButton';
import { ChoiceButton } from '@/components/ChoiceButton';
import { Confetti } from '@/components/Confetti';
import { TaraMascot } from '@/components/TaraMascot';
import { EndRoundScreen } from '@/components/EndRoundScreen';
import { colors } from '@/theme';
import { playTone, useSpeech } from '@/hooks/useSpeech';
import {
  generateSequenceQuestion,
  getNumberWord,
  type BeforeAfterQuestion,
  type SequenceType,
} from '@/utils/numberWords';
import { Volume2, ArrowLeft, ArrowRight, Sparkles, Filter } from 'lucide-react';

interface BeforeAfterBetweenScreenProps {
  onBack: () => void;
  addStars: (count: number) => void;
  voiceLang?: 'en' | 'hi' | 'both';
}

const MODES: Array<{ id: SequenceType | 'mixed'; label: string; hiLabel: string; icon: string }> = [
  { id: 'before', label: 'Before', hiLabel: 'पहले', icon: '⬅️' },
  { id: 'after', label: 'After', hiLabel: 'बाद', icon: '➡️' },
  { id: 'between', label: 'Between', hiLabel: 'बीच', icon: '↔️' },
  { id: 'mixed', label: 'Mixed', hiLabel: 'मिक्स', icon: '🎲' },
];

const RANGES: Array<'1-20' | '1-50' | '1-100'> = ['1-20', '1-50', '1-100'];

export function BeforeAfterBetweenScreen({
  onBack,
  addStars,
  voiceLang = 'both',
}: BeforeAfterBetweenScreenProps) {
  const [mode, setMode] = useState<SequenceType | 'mixed'>('after');
  const [range, setRange] = useState<'1-20' | '1-50' | '1-100'>('1-20');
  const [question, setQuestion] = useState<BeforeAfterQuestion>(() =>
    generateSequenceQuestion('after', '1-20')
  );
  const [qCount, setQCount] = useState(0);
  const [firstTryCorrect, setFirstTryCorrect] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState<Set<number>>(new Set());
  const [showConfetti, setShowConfetti] = useState(false);
  const [phase, setPhase] = useState<'playing' | 'done'>('playing');
  const { speak, stop } = useSpeech();

  const ROUND_TOTAL = 10;

  const nextQuestion = () => {
    setShowConfetti(false);
    setWrongAnswers(new Set());
    const nextQ = generateSequenceQuestion(mode, range);
    setQuestion(nextQ);
  };

  const speakPrompt = (q = question) => {
    const prompt = voiceLang === 'hi' ? q.promptHi : q.promptEn;
    speak(prompt);
  };

  useEffect(() => {
    if (phase === 'playing') {
      speakPrompt(question);
    }
  }, [qCount, phase]);

  const handleModeChange = (newMode: SequenceType | 'mixed') => {
    playTone('tap');
    setMode(newMode);
    setShowConfetti(false);
    setWrongAnswers(new Set());
    setQCount(0);
    setFirstTryCorrect(0);
    setPhase('playing');
    setQuestion(generateSequenceQuestion(newMode, range));
  };

  const handleRangeChange = (newRange: '1-20' | '1-50' | '1-100') => {
    playTone('tap');
    setRange(newRange);
    setShowConfetti(false);
    setWrongAnswers(new Set());
    setQCount(0);
    setFirstTryCorrect(0);
    setPhase('playing');
    setQuestion(generateSequenceQuestion(mode, newRange));
  };

  const handleChoice = (num: number) => {
    if (showConfetti) return;

    if (num === question.correctNumber) {
      // Correct!
      const wasFirst = wrongAnswers.size === 0;
      if (wasFirst) {
        setFirstTryCorrect((c) => c + 1);
        addStars(1);
      }

      playTone('correct');
      setShowConfetti(true);

      const numWord = getNumberWord(num);
      const celebration =
        voiceLang === 'hi'
          ? `शाबाश! सही उत्तर है ${num}, ${numWord.hi}!`
          : `Yes! Correct! ${num}, ${numWord.en}!`;
      speak(celebration);

      setTimeout(() => {
        if (qCount + 1 < ROUND_TOTAL) {
          setQCount((c) => c + 1);
          nextQuestion();
        } else {
          playTone('win');
          setPhase('done');
        }
      }, 1900);
    } else {
      // Wrong choice
      playTone('wrong');
      speak(voiceLang === 'hi' ? 'फिर से सोचो!' : 'Try again!');
      setWrongAnswers((prev) => new Set([...prev, num]));
    }
  };

  const playAgain = () => {
    stop();
    setQCount(0);
    setFirstTryCorrect(0);
    setPhase('playing');
    nextQuestion();
  };

  if (phase === 'done') {
    return (
      <div
        className="flex flex-col h-full animate-fade-in"
        style={{
          background: `linear-gradient(160deg, ${colors.pastels[1]}, ${colors.pastels[3]})`,
        }}
      >
        <EndRoundScreen
          stars={firstTryCorrect >= 8 ? 3 : firstTryCorrect >= 5 ? 2 : 1}
          onPlayAgain={playAgain}
          onHome={onBack}
        />
      </div>
    );
  }

  return (
    <div
      className="flex flex-col h-full animate-fade-in select-none relative overflow-y-auto"
      style={{
        background: `linear-gradient(160deg, #E8F5E9 0%, #FFFFFF 60%, #E0F7FA 100%)`,
      }}
    >
      <Confetti active={showConfetti} />

      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 sticky top-0 bg-white/70 backdrop-blur-sm z-20 shadow-xs">
        <BackButton onClick={onBack} />
        <h2 className="font-rounded font-bold text-2xl text-slate-800">
          Before, After & Between
        </h2>
        <button
          onClick={() => speakPrompt(question)}
          className="p-2.5 rounded-full bg-white text-emerald-700 shadow-sm active:scale-95 cursor-pointer"
        >
          <Volume2 size={20} />
        </button>
      </div>

      <div className="p-4 flex flex-col gap-3 max-w-[420px] mx-auto w-full pb-8">
        {/* Mode Selector */}
        <div className="grid grid-cols-4 gap-1.5 bg-slate-100 p-1 rounded-2xl">
          {MODES.map((m) => {
            const isSel = mode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => handleModeChange(m.id)}
                className={`py-1.5 px-1 rounded-xl font-rounded font-bold text-xs flex flex-col items-center transition-all ${
                  isSel
                    ? 'bg-emerald-600 text-white shadow-xs scale-102'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{m.icon}</span>
                <span className="mt-0.5">{m.label}</span>
              </button>
            );
          })}
        </div>

        {/* Range Selector (1-20, 1-50, 1-100) */}
        <div className="flex items-center justify-between bg-white px-3 py-1.5 rounded-2xl border border-slate-200">
          <span className="font-rounded font-bold text-xs text-slate-500 uppercase">
            Range:
          </span>
          <div className="flex gap-1.5">
            {RANGES.map((r) => (
              <button
                key={r}
                onClick={() => handleRangeChange(r)}
                className={`px-3 py-1 rounded-xl font-rounded font-bold text-xs transition-all ${
                  range === r
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Mascot + Question Banner */}
        <div className="flex items-center justify-center gap-3 my-1">
          <TaraMascot size={58} animation={showConfetti ? 'cheer' : 'idle'} />
          <div className="bg-white px-4 py-2 rounded-2xl shadow-xs border border-emerald-200 text-center">
            <span className="font-rounded font-extrabold text-base text-emerald-950 block">
              {voiceLang === 'hi' ? question.promptHi : question.promptEn}
            </span>
          </div>
        </div>

        {/* Number Track / Train Visual */}
        <div className="bg-white rounded-3xl p-5 shadow-lg border-3 border-emerald-300 flex items-center justify-center gap-3 my-2">
          {question.type === 'before' && (
            <>
              {/* Missing Slot */}
              <div className="w-20 h-24 rounded-2xl border-3 border-dashed border-emerald-500 bg-emerald-50 flex flex-col items-center justify-center text-emerald-700 animate-pulse shadow-inner">
                <span className="font-rounded font-extrabold text-3xl">?</span>
                <span className="text-[10px] font-bold text-emerald-600 uppercase">Before</span>
              </div>

              {/* Given Number */}
              <div className="w-20 h-24 rounded-2xl bg-emerald-600 text-white flex flex-col items-center justify-center shadow-md">
                <span className="font-rounded font-extrabold text-4xl leading-none">
                  {question.givenNumbers[0]}
                </span>
                <span className="text-[10px] font-bold opacity-90 truncate max-w-[70px] mt-1">
                  {getNumberWord(question.givenNumbers[0]).en}
                </span>
              </div>
            </>
          )}

          {question.type === 'after' && (
            <>
              {/* Given Number */}
              <div className="w-20 h-24 rounded-2xl bg-emerald-600 text-white flex flex-col items-center justify-center shadow-md">
                <span className="font-rounded font-extrabold text-4xl leading-none">
                  {question.givenNumbers[0]}
                </span>
                <span className="text-[10px] font-bold opacity-90 truncate max-w-[70px] mt-1">
                  {getNumberWord(question.givenNumbers[0]).en}
                </span>
              </div>

              {/* Missing Slot */}
              <div className="w-20 h-24 rounded-2xl border-3 border-dashed border-emerald-500 bg-emerald-50 flex flex-col items-center justify-center text-emerald-700 animate-pulse shadow-inner">
                <span className="font-rounded font-extrabold text-3xl">?</span>
                <span className="text-[10px] font-bold text-emerald-600 uppercase">After</span>
              </div>
            </>
          )}

          {question.type === 'between' && (
            <>
              {/* First Given */}
              <div className="w-16 h-22 rounded-2xl bg-emerald-600 text-white flex flex-col items-center justify-center shadow-md">
                <span className="font-rounded font-extrabold text-3xl leading-none">
                  {question.givenNumbers[0]}
                </span>
                <span className="text-[9px] font-bold opacity-80 truncate max-w-[55px] mt-1">
                  {getNumberWord(question.givenNumbers[0]).en}
                </span>
              </div>

              {/* Missing Center Slot */}
              <div className="w-16 h-22 rounded-2xl border-3 border-dashed border-emerald-500 bg-emerald-50 flex flex-col items-center justify-center text-emerald-700 animate-pulse shadow-inner">
                <span className="font-rounded font-extrabold text-2xl">?</span>
                <span className="text-[9px] font-bold text-emerald-600 uppercase">Between</span>
              </div>

              {/* Second Given */}
              <div className="w-16 h-22 rounded-2xl bg-emerald-600 text-white flex flex-col items-center justify-center shadow-md">
                <span className="font-rounded font-extrabold text-3xl leading-none">
                  {question.givenNumbers[1]}
                </span>
                <span className="text-[9px] font-bold opacity-80 truncate max-w-[55px] mt-1">
                  {getNumberWord(question.givenNumbers[1]).en}
                </span>
              </div>
            </>
          )}
        </div>

        {/* 3 Answer Choices */}
        <div className="grid grid-cols-3 gap-3 w-full my-2">
          {question.options.map((num) => {
            const isWrong = wrongAnswers.has(num);
            const isCorrect = num === question.correctNumber;
            const word = getNumberWord(num);

            return (
              <button
                key={num}
                onClick={() => handleChoice(num)}
                disabled={isWrong}
                className={`py-3.5 px-2 rounded-2xl border-3 flex flex-col items-center justify-center shadow-sm active:scale-90 transition-all cursor-pointer ${
                  isWrong
                    ? 'bg-rose-50 border-rose-300 text-rose-300 opacity-60'
                    : isCorrect && showConfetti
                    ? 'bg-green-100 border-green-500 text-green-950 scale-105 shadow-md'
                    : 'bg-white border-emerald-300 text-slate-900 hover:bg-emerald-50'
                }`}
              >
                <span className="font-rounded font-extrabold text-3xl text-emerald-950 leading-none">
                  {num}
                </span>
                <span className="font-rounded font-bold text-xs text-emerald-700 mt-1 truncate max-w-[85px]">
                  {word.en}
                </span>
              </button>
            );
          })}
        </div>

        {/* Round Progress */}
        <div className="text-center font-rounded font-bold text-xs text-slate-500 mt-1">
          Question {qCount + 1} of {ROUND_TOTAL}
        </div>
      </div>
    </div>
  );
}
