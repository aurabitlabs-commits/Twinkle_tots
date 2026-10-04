import { useState, useEffect } from 'react';
import { BackButton } from '@/components/BackButton';
import { ChoiceButton } from '@/components/ChoiceButton';
import { Confetti } from '@/components/Confetti';
import { EndRoundScreen } from '@/components/EndRoundScreen';
import { TaraMascot } from '@/components/TaraMascot';
import { colors } from '@/theme';
import { useSpeech, playTone } from '@/hooks/useSpeech';
import { shuffle } from '@/utils/shuffle';

export interface SoundQuizItem {
  id: string;
  nameEn: string;
  nameHi: string;
  emoji: string;
  soundWord?: string;
  sound?: string;
}

interface SoundQuizScreenProps {
  title: string;
  items: SoundQuizItem[];
  onBack: () => void;
  onHome: () => void;
  addStars: (count: number) => void;
}

export function SoundQuizScreen({
  title,
  items,
  onBack,
  onHome,
  addStars,
}: SoundQuizScreenProps) {
  const [qIndex, setQIndex] = useState(0);
  const [questions, setQuestions] = useState<Array<{ correct: SoundQuizItem; options: SoundQuizItem[] }>>([]);
  const [wrongAnswers, setWrongAnswers] = useState<Set<string>>(new Set());
  const [firstTryCorrect, setFirstTryCorrect] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const { speak } = useSpeech();

  const initQuestions = () => {
    const shuffled = shuffle([...items]).slice(0, Math.min(8, items.length));
    const round = shuffled.map((item) => {
      const wrong = shuffle(items.filter((i) => i.id !== item.id)).slice(0, 2);
      return {
        correct: item,
        options: shuffle([item, ...wrong]),
      };
    });
    setQuestions(round);
    setQIndex(0);
    setWrongAnswers(new Set());
    setFirstTryCorrect(0);
    setIsDone(false);
  };

  useEffect(() => {
    initQuestions();
  }, [items]);

  const currentQ = questions[qIndex];

  useEffect(() => {
    if (currentQ && !isDone) {
      const soundText = currentQ.correct.soundWord || currentQ.correct.sound || '';
      speak(`Whose sound? ${soundText}`);
    }
  }, [qIndex, currentQ, isDone, speak]);

  const handleChoice = (selectedId: string) => {
    if (!currentQ) return;
    if (selectedId === currentQ.correct.id) {
      const wasFirstTry = wrongAnswers.size === 0;
      if (wasFirstTry) {
        setFirstTryCorrect((c) => c + 1);
        addStars(1);
      }
      playTone('correct');
      setShowConfetti(true);
      speak(`Yes! ${currentQ.correct.nameEn}`);

      setTimeout(() => {
        setShowConfetti(false);
        if (qIndex < questions.length - 1) {
          setQIndex((i) => i + 1);
          setWrongAnswers(new Set());
        } else {
          playTone('win');
          setIsDone(true);
        }
      }, 1800);
    } else {
      playTone('wrong');
      speak('Try again!');
      setWrongAnswers((prev) => new Set([...prev, selectedId]));
    }
  };

  if (isDone) {
    return (
      <div className="h-full animate-fade-in" style={{ background: colors.pastels[1] }}>
        <EndRoundScreen
          stars={firstTryCorrect >= 6 ? 3 : firstTryCorrect >= 4 ? 2 : 1}
          onPlayAgain={initQuestions}
          onHome={onHome}
        />
      </div>
    );
  }

  return (
    <div
      className="flex flex-col h-full animate-fade-in select-none relative"
      style={{
        background: `linear-gradient(160deg, ${colors.pastels[qIndex % 6]} 0%, ${colors.pastels[(qIndex + 2) % 6]} 100%)`,
      }}
    >
      <Confetti active={showConfetti} />

      {/* Top bar */}
      <div className="flex items-center justify-between p-4">
        <BackButton onClick={onBack} />
        <h2 className="font-rounded font-bold text-2xl" style={{ color: colors.ink }}>
          {title}
        </h2>
        <div className="w-8" />
      </div>

      <div className="flex justify-center mt-2">
        <TaraMascot size={68} animation={showConfetti ? 'cheer' : 'idle'} />
      </div>

      {/* Sound Prompt Box */}
      <div className="p-4 mx-4 my-3 bg-white/90 rounded-3xl shadow-md border-2 border-amber-300 text-center">
        <span className="text-xs uppercase font-bold text-amber-700 block mb-1">
          Listen to the sound:
        </span>
        <span className="font-rounded font-bold text-3xl text-amber-950">
          🎵 "{currentQ?.correct.soundWord || currentQ?.correct.sound}"
        </span>
      </div>

      {/* Choices */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="grid grid-cols-1 gap-3.5 w-full max-w-[300px]">
          {currentQ?.options.map((opt) => (
            <ChoiceButton
              key={opt.id}
              label={opt.nameEn}
              emoji={opt.emoji}
              state={wrongAnswers.has(opt.id) ? 'wrong' : 'default'}
              onClick={() => handleChoice(opt.id)}
            />
          ))}
        </div>
      </div>

      <div className="text-center pb-6 font-rounded font-bold text-slate-500">
        {qIndex + 1} / {questions.length}
      </div>
    </div>
  );
}
