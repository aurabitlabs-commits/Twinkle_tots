import { useState, useEffect } from 'react';
import { BackButton } from '@/components/BackButton';
import { ChoiceButton } from '@/components/ChoiceButton';
import { Confetti } from '@/components/Confetti';
import { TaraMascot } from '@/components/TaraMascot';
import { EndRoundScreen } from '@/components/EndRoundScreen';
import { colors } from '@/theme';
import { playTone, useSpeech } from '@/hooks/useSpeech';
import {
  buildSequenceQuestions,
  type SequenceQuestion,
  type DayItem,
  type MonthItem,
} from '@/utils/calendar';
import { Volume2, ArrowRight } from 'lucide-react';

interface NextUpGameScreenProps {
  onBack: () => void;
  addStars: (count: number) => void;
  level: 1 | 2 | 3;
  weekStart?: 'sun' | 'mon';
  voiceLang?: 'en' | 'hi' | 'both';
}

export function NextUpGameScreen({
  onBack,
  addStars,
  level,
  weekStart = 'sun',
  voiceLang = 'both',
}: NextUpGameScreenProps) {
  const [kind, setKind] = useState<'day' | 'month'>(level === 3 ? 'month' : 'day');
  const [questions, setQuestions] = useState<SequenceQuestion[]>(() =>
    buildSequenceQuestions(kind, level, 10, weekStart)
  );
  const [qIndex, setQIndex] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState<Set<string>>(new Set());
  const [firstTryCorrect, setFirstTryCorrect] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [phase, setPhase] = useState<'playing' | 'done'>('playing');
  const { speak, stop } = useSpeech();

  const current = questions[qIndex];

  const speakPrompt = () => {
    if (!current) return;
    const promptText = voiceLang === 'hi' ? current.promptHi : current.promptEn;
    speak(promptText);
  };

  useEffect(() => {
    if (phase === 'playing' && current) {
      speakPrompt();
    }
  }, [qIndex, phase, kind]);

  const handleChoice = (option: DayItem | MonthItem) => {
    if (!current) return;
    const isCorrect = option.id === current.correctItem.id;

    if (isCorrect) {
      const wasFirstTry = wrongAnswers.size === 0;
      if (wasFirstTry) {
        setFirstTryCorrect((c) => c + 1);
        addStars(1);
      }
      playTone('correct');
      setShowConfetti(true);

      const celebration =
        voiceLang === 'hi'
          ? `शाबाश! सही उत्तर है ${current.correctItem.hi}!`
          : `Yes! After comes ${current.correctItem.en}!`;
      speak(celebration);

      setTimeout(() => {
        setShowConfetti(false);
        if (qIndex < questions.length - 1) {
          setQIndex((i) => i + 1);
          setWrongAnswers(new Set());
        } else {
          playTone('win');
          setPhase('done');
        }
      }, 1900);
    } else {
      playTone('wrong');
      speak(voiceLang === 'hi' ? 'फिर से कोशिश करो!' : 'Try again!');
      setWrongAnswers((prev) => {
        const next = new Set(prev);
        next.add(option.id);
        if (next.size >= 2) {
          // Reveal correct
          setTimeout(() => {
            speak(`The answer is ${current.correctItem.en}`);
            setTimeout(() => {
              if (qIndex < questions.length - 1) {
                setQIndex((i) => i + 1);
                setWrongAnswers(new Set());
              } else {
                setPhase('done');
              }
            }, 1800);
          }, 500);
        }
        return next;
      });
    }
  };

  const playAgain = () => {
    stop();
    setQuestions(buildSequenceQuestions(kind, level, 10, weekStart));
    setQIndex(0);
    setWrongAnswers(new Set());
    setFirstTryCorrect(0);
    setShowConfetti(false);
    setPhase('playing');
  };

  if (phase === 'done') {
    return (
      <div
        className="flex flex-col h-full animate-fade-in"
        style={{
          background: `linear-gradient(160deg, ${colors.pastels[0]}, ${colors.pastels[3]})`,
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
      className="flex flex-col h-full animate-fade-in select-none relative overflow-hidden"
      style={{
        background: `linear-gradient(160deg, #FFF9C4 0%, #FFFFFF 60%, ${colors.pastels[qIndex % 6]} 100%)`,
      }}
    >
      <Confetti active={showConfetti} />

      {/* Top bar */}
      <div className="flex items-center justify-between p-4 z-10">
        <BackButton onClick={onBack} />
        <h2 className="font-rounded font-bold text-2xl text-slate-800">
          Next Up
        </h2>
        <button
          onClick={speakPrompt}
          className="p-2.5 rounded-full bg-white text-amber-600 shadow-sm active:scale-95 cursor-pointer"
        >
          <Volume2 size={20} />
        </button>
      </div>

      {/* Days / Months toggle */}
      <div className="flex justify-center gap-2 px-4 mb-2 z-10">
        <button
          onClick={() => {
            playTone('tap');
            setKind('day');
            setQuestions(buildSequenceQuestions('day', level, 10, weekStart));
            setQIndex(0);
          }}
          className={`px-4 py-1.5 rounded-xl font-rounded font-bold text-xs transition-all ${
            kind === 'day' ? 'bg-amber-500 text-white shadow-xs' : 'bg-white text-slate-700'
          }`}
        >
          Days of Week
        </button>
        <button
          onClick={() => {
            playTone('tap');
            setKind('month');
            setQuestions(buildSequenceQuestions('month', level, 10, weekStart));
            setQIndex(0);
          }}
          className={`px-4 py-1.5 rounded-xl font-rounded font-bold text-xs transition-all ${
            kind === 'month' ? 'bg-amber-500 text-white shadow-xs' : 'bg-white text-slate-700'
          }`}
        >
          Months of Year
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-between p-4 max-w-[360px] mx-auto w-full z-10">
        <div className="flex justify-center">
          <TaraMascot size={64} animation={showConfetti ? 'cheer' : 'idle'} />
        </div>

        {/* Sequence Display Card */}
        <div className="w-full bg-white rounded-3xl p-5 shadow-lg border-3 border-amber-300 text-center my-2">
          <span className="text-xs uppercase font-bold text-amber-800 block mb-3">
            {voiceLang === 'hi' ? current?.promptHi : current?.promptEn}
          </span>

          <div className="flex items-center justify-center gap-2 font-rounded font-bold">
            {current?.givenItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="px-3.5 py-2.5 rounded-2xl bg-amber-50 border-2 border-amber-200 text-slate-900 shadow-xs">
                  <span className="text-lg block leading-tight">{item.en}</span>
                  <span className="text-xs text-amber-800 block">{item.hi}</span>
                </div>
                <ArrowRight size={18} className="text-amber-500" />
              </div>
            ))}

            <div className="w-16 h-16 rounded-2xl border-3 border-dashed border-amber-400 bg-amber-50 flex items-center justify-center text-2xl font-bold text-amber-500 animate-pulse">
              ?
            </div>
          </div>
        </div>

        {/* 3 Choices */}
        <div className="grid grid-cols-1 gap-3 w-full my-2">
          {current?.options.map((opt) => {
            const isCorrect = opt.id === current.correctItem.id;
            let state: 'default' | 'correct' | 'wrong' | 'revealed' = 'default';
            if (isCorrect && showConfetti) state = 'correct';
            else if (wrongAnswers.has(opt.id)) state = 'wrong';
            else if (wrongAnswers.size >= 2 && isCorrect) state = 'revealed';

            return (
              <ChoiceButton
                key={opt.id}
                label={`${opt.en} • ${opt.hi}`}
                state={state}
                onClick={() => handleChoice(opt)}
              />
            );
          })}
        </div>

        <div className="text-slate-500 font-rounded font-bold text-sm pb-2">
          {qIndex + 1} / {questions.length}
        </div>
      </div>
    </div>
  );
}
