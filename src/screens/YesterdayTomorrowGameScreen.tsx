import { useState, useEffect } from 'react';
import { BackButton } from '@/components/BackButton';
import { ChoiceButton } from '@/components/ChoiceButton';
import { Confetti } from '@/components/Confetti';
import { TaraMascot } from '@/components/TaraMascot';
import { EndRoundScreen } from '@/components/EndRoundScreen';
import { colors } from '@/theme';
import { playTone, useSpeech } from '@/hooks/useSpeech';
import { shuffle } from '@/utils/shuffle';
import { DAYS, nextDay, prevDay, type DayItem } from '@/utils/calendar';
import { Volume2, ArrowLeft, ArrowRight } from 'lucide-react';

interface YesterdayTomorrowGameScreenProps {
  onBack: () => void;
  addStars: (count: number) => void;
  voiceLang?: 'en' | 'hi' | 'both';
}

interface YQuestion {
  mockToday: DayItem;
  target: 'yesterday' | 'tomorrow';
  correct: DayItem;
  options: DayItem[];
}

export function YesterdayTomorrowGameScreen({
  onBack,
  addStars,
  voiceLang = 'both',
}: YesterdayTomorrowGameScreenProps) {
  const [questions, setQuestions] = useState<YQuestion[]>(() => buildQuestions(10));
  const [qIndex, setQIndex] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState<Set<string>>(new Set());
  const [firstTryCorrect, setFirstTryCorrect] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [phase, setPhase] = useState<'playing' | 'done'>('playing');
  const { speak, stop } = useSpeech();

  const current = questions[qIndex];

  function buildQuestions(count = 10): YQuestion[] {
    const list: YQuestion[] = [];
    for (let i = 0; i < count; i++) {
      const mockToday = DAYS[(i * 2 + Math.floor(Math.random() * 7)) % 7];
      const target = i % 2 === 0 ? 'tomorrow' : 'yesterday';
      const correct = target === 'tomorrow' ? nextDay(mockToday.id) : prevDay(mockToday.id);
      const wrong = shuffle(DAYS.filter((d) => d.id !== correct.id)).slice(0, 2);
      const options = shuffle([correct, ...wrong]);

      list.push({ mockToday, target, correct, options });
    }
    return list;
  }

  const speakPrompt = () => {
    if (!current) return;
    if (current.target === 'tomorrow') {
      const speech =
        voiceLang === 'hi'
          ? `अगर आज ${current.mockToday.hi} है, तो आने वाला कल कौन सा दिन है?`
          : voiceLang === 'both'
          ? `If today is ${current.mockToday.en}, what is tomorrow? आने वाला कल कौन सा दिन है?`
          : `If today is ${current.mockToday.en}, what is tomorrow?`;
      speak(speech);
    } else {
      const speech =
        voiceLang === 'hi'
          ? `अगर आज ${current.mockToday.hi} है, तो बीता हुआ कल कौन सा दिन था?`
          : voiceLang === 'both'
          ? `If today is ${current.mockToday.en}, what was yesterday? बीता हुआ कल कौन सा दिन था?`
          : `If today is ${current.mockToday.en}, what was yesterday?`;
      speak(speech);
    }
  };

  useEffect(() => {
    if (phase === 'playing' && current) {
      speakPrompt();
    }
  }, [qIndex, phase]);

  const handleChoice = (opt: DayItem) => {
    if (!current) return;
    const isCorrect = opt.id === current.correct.id;

    if (isCorrect) {
      const wasFirstTry = wrongAnswers.size === 0;
      if (wasFirstTry) {
        setFirstTryCorrect((c) => c + 1);
        addStars(1);
      }
      playTone('correct');
      setShowConfetti(true);

      const targetLabel =
        current.target === 'tomorrow'
          ? voiceLang === 'hi'
            ? 'आने वाला कल'
            : 'tomorrow'
          : voiceLang === 'hi'
          ? 'बीता हुआ कल'
          : 'yesterday';

      speak(`Correct! ${targetLabel} is ${current.correct.en}, ${current.correct.hi}!`);

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
        next.add(opt.id);
        if (next.size >= 2) {
          setTimeout(() => {
            speak(`The answer is ${current.correct.en}`);
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
    setQuestions(buildQuestions(10));
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
        background: `linear-gradient(160deg, #F3E5F5 0%, #FFFFFF 60%, ${colors.pastels[qIndex % 6]} 100%)`,
      }}
    >
      <Confetti active={showConfetti} />

      {/* Top bar */}
      <div className="flex items-center justify-between p-4 z-10">
        <BackButton onClick={onBack} />
        <h2 className="font-rounded font-bold text-2xl text-slate-800">
          Yesterday & Tomorrow
        </h2>
        <button
          onClick={speakPrompt}
          className="p-2.5 rounded-full bg-white text-purple-700 shadow-sm active:scale-95 cursor-pointer"
        >
          <Volume2 size={20} />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-between p-4 max-w-[360px] mx-auto w-full z-10">
        <div className="flex justify-center">
          <TaraMascot size={64} animation={showConfetti ? 'cheer' : 'idle'} />
        </div>

        {/* Direction Center Card */}
        <div className="w-full bg-white rounded-3xl p-5 shadow-lg border-3 border-purple-300 text-center my-2">
          {/* Question Banner */}
          <div className="mb-3">
            <span className="text-xs uppercase font-extrabold text-purple-700 tracking-wide block">
              {current?.target === 'tomorrow'
                ? 'What is TOMORROW? (आने वाला कल)'
                : 'What was YESTERDAY? (बीता हुआ कल)'}
            </span>
          </div>

          {/* Directional Arrows with Center "Today" Card */}
          <div className="flex items-center justify-between gap-1 my-2">
            {/* Yesterday Arrow */}
            <div
              className={`flex flex-col items-center p-2 rounded-xl border-2 transition-all ${
                current?.target === 'yesterday'
                  ? 'bg-purple-100 border-purple-500 scale-105 animate-pulse'
                  : 'bg-slate-50 border-slate-200 opacity-50'
              }`}
            >
              <ArrowLeft size={20} className="text-purple-600" />
              <span className="text-[10px] font-bold text-purple-900 mt-0.5">
                Yesterday
              </span>
              <span className="text-[9px] text-purple-700 font-semibold">
                बीता कल
              </span>
            </div>

            {/* Mock Today Card */}
            <div className="p-3.5 rounded-2xl bg-amber-100 border-2 border-amber-400 shadow-xs flex flex-col items-center">
              <span className="text-[10px] uppercase font-bold text-amber-800">
                If Today is:
              </span>
              <span className="font-rounded font-extrabold text-2xl text-amber-950">
                {current?.mockToday.en}
              </span>
              <span className="font-rounded font-bold text-xs text-amber-800">
                {current?.mockToday.hi}
              </span>
            </div>

            {/* Tomorrow Arrow */}
            <div
              className={`flex flex-col items-center p-2 rounded-xl border-2 transition-all ${
                current?.target === 'tomorrow'
                  ? 'bg-purple-100 border-purple-500 scale-105 animate-pulse'
                  : 'bg-slate-50 border-slate-200 opacity-50'
              }`}
            >
              <ArrowRight size={20} className="text-purple-600" />
              <span className="text-[10px] font-bold text-purple-900 mt-0.5">
                Tomorrow
              </span>
              <span className="text-[9px] text-purple-700 font-semibold">
                आने वाला कल
              </span>
            </div>
          </div>
        </div>

        {/* 3 Answer Cards */}
        <div className="grid grid-cols-1 gap-3 w-full my-2">
          {current?.options.map((opt) => {
            const isCorrect = opt.id === current.correct.id;
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
