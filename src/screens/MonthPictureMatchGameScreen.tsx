import { useState, useEffect } from 'react';
import { BackButton } from '@/components/BackButton';
import { ChoiceButton } from '@/components/ChoiceButton';
import { Confetti } from '@/components/Confetti';
import { TaraMascot } from '@/components/TaraMascot';
import { EndRoundScreen } from '@/components/EndRoundScreen';
import { colors } from '@/theme';
import { playTone, useSpeech } from '@/hooks/useSpeech';
import { shuffle } from '@/utils/shuffle';
import { MONTHS, type MonthItem } from '@/utils/calendar';
import { Volume2, BookOpen } from 'lucide-react';

interface MonthPictureMatchGameScreenProps {
  onBack: () => void;
  addStars: (count: number) => void;
  onOpenMonthsLearn?: () => void;
  voiceLang?: 'en' | 'hi' | 'both';
}

interface PictureQuestion {
  target: MonthItem;
  options: MonthItem[];
}

export function MonthPictureMatchGameScreen({
  onBack,
  addStars,
  onOpenMonthsLearn,
  voiceLang = 'both',
}: MonthPictureMatchGameScreenProps) {
  const [questions, setQuestions] = useState<PictureQuestion[]>(() => buildQuestions(10));
  const [qIndex, setQIndex] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState<Set<string>>(new Set());
  const [firstTryCorrect, setFirstTryCorrect] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [phase, setPhase] = useState<'playing' | 'done'>('playing');
  const { speak, stop } = useSpeech();

  const current = questions[qIndex];

  function buildQuestions(count = 10): PictureQuestion[] {
    const shuffledMonths = shuffle([...MONTHS]);
    const list: PictureQuestion[] = [];

    for (let i = 0; i < count; i++) {
      const target = shuffledMonths[i % shuffledMonths.length];
      const wrong = shuffle(MONTHS.filter((m) => m.id !== target.id)).slice(0, 2);
      const options = shuffle([target, ...wrong]);

      list.push({ target, options });
    }
    return list;
  }

  const speakPrompt = () => {
    if (!current) return;
    const promptText =
      voiceLang === 'hi'
        ? `यह कौन सा महीना है? ${current.target.cueHi}!`
        : voiceLang === 'both'
        ? `Which month is this? ${current.target.cueName}! यह कौन सा महीना है?`
        : `Which month has ${current.target.cueName}?`;
    speak(promptText);
  };

  useEffect(() => {
    if (phase === 'playing' && current) {
      speakPrompt();
    }
  }, [qIndex, phase]);

  const handleChoice = (opt: MonthItem) => {
    if (!current) return;
    const isCorrect = opt.id === current.target.id;

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
          ? `शाबाश! यह है ${current.target.hi}!`
          : `Yes! It is ${current.target.en}!`;
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
        next.add(opt.id);
        if (next.size >= 2) {
          setTimeout(() => {
            speak(`The answer is ${current.target.en}`);
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
        {onOpenMonthsLearn && (
          <div className="p-4 text-center">
            <button
              onClick={onOpenMonthsLearn}
              className="py-2.5 px-4 bg-white/90 text-teal-800 rounded-xl font-rounded font-bold text-xs shadow-xs active:scale-95 inline-flex items-center gap-1.5"
            >
              <BookOpen size={14} /> Learn the pictures first
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className="flex flex-col h-full animate-fade-in select-none relative overflow-hidden"
      style={{
        background: `linear-gradient(160deg, #E0F2F1 0%, #FFFFFF 60%, ${colors.pastels[qIndex % 6]} 100%)`,
      }}
    >
      <Confetti active={showConfetti} />

      {/* Top bar */}
      <div className="flex items-center justify-between p-4 z-10">
        <BackButton onClick={onBack} />
        <h2 className="font-rounded font-bold text-2xl text-slate-800">
          Month Picture Match
        </h2>
        <button
          onClick={speakPrompt}
          className="p-2.5 rounded-full bg-white text-teal-700 shadow-sm active:scale-95 cursor-pointer"
        >
          <Volume2 size={20} />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-between p-4 max-w-[360px] mx-auto w-full z-10">
        <div className="flex justify-center">
          <TaraMascot size={64} animation={showConfetti ? 'cheer' : 'idle'} />
        </div>

        {/* Picture Cue Card */}
        <div className="w-full bg-white rounded-3xl p-5 shadow-lg border-3 border-teal-300 text-center my-2">
          <span className="text-7xl block mb-2 animate-bounce-gentle">
            {current?.target.cueEmoji}
          </span>
          <span className="text-xs uppercase font-bold text-teal-800 tracking-wide block">
            {current?.target.cueName} • {current?.target.cueHi}
          </span>
          <span className="font-rounded font-bold text-sm text-slate-600 mt-1 block">
            Which month is this?
          </span>
        </div>

        {/* 3 Choices */}
        <div className="grid grid-cols-1 gap-3 w-full my-2">
          {current?.options.map((opt) => {
            const isCorrect = opt.id === current.target.id;
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
