import { useCallback, useEffect, useRef, useState } from 'react';
import { BackButton } from '@/components/BackButton';
import { ChoiceButton } from '@/components/ChoiceButton';
import { ProgressDots } from '@/components/ProgressDots';
import { SpeakerButton } from '@/components/SpeakerButton';
import { Confetti } from '@/components/Confetti';
import { EndRoundScreen } from '@/components/EndRoundScreen';
import { TaraMascot } from '@/components/TaraMascot';
import { colors } from '@/theme';
import { useSpeech, playTone } from '@/hooks/useSpeech';
import { buildNumberRound, roundStars } from '@/utils/quiz';
import { shuffle } from '@/utils/shuffle';
import numbersData from '@/data/numbers.json';
import type { NumberEntry, QuizQuestion } from '@/types';

interface NumPlayScreenProps {
  onBack: () => void;
  onHome: () => void;
  addStars: (count: number) => void;
  recordRoundScore: (topic: 'abc' | 'num', score: number) => void;
}

const ROUND_SIZE = 10;
const numberWords = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];
const objectEmojis = ['\ud83c\udf4e', '\ud83c\udf89', '\u2b50', '\ud83d\udc1f', '\ud83e\udd86', '\ud83c\udf38'];

interface NumPlayQuestion extends QuizQuestion {
  count: number;
  emoji: string;
}

export function NumPlayScreen({ onBack, onHome, addStars, recordRoundScore }: NumPlayScreenProps) {
  const numbers = numbersData as NumberEntry[];
  const numberMap = useRef<Map<string, NumberEntry>>(new Map(numbers.map((e) => [String(e.id), e])));

  const buildRound = useCallback((): NumPlayQuestion[] => {
    const base = buildNumberRound(10, ROUND_SIZE);
    return base.map((q) => {
      const entry = numberMap.current.get(q.correctId);
      return {
        ...q,
        count: entry ? entry.id : parseInt(q.correctId, 10),
        emoji: objectEmojis[Math.floor(Math.random() * objectEmojis.length)],
      };
    });
  }, []);

  const [round, setRound] = useState<NumPlayQuestion[]>(() => buildRound());
  const [qIndex, setQIndex] = useState(0);
  const [tappedObjects, setTappedObjects] = useState<Set<number>>(new Set());
  const [wrongAnswers, setWrongAnswers] = useState<Set<string>>(new Set());
  const [firstTryCorrect, setFirstTryCorrect] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [phase, setPhase] = useState<'playing' | 'done'>('playing');
  const { speak, stop } = useSpeech();

  const current = round[qIndex];

  useEffect(() => {
    setTappedObjects(new Set());
    if (phase === 'playing' && current) {
      const timer = setTimeout(() => speak('How many?'), 300);
      return () => {
        clearTimeout(timer);
        stop();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qIndex, phase]);

  const handleObjectTap = (i: number) => {
    if (tappedObjects.has(i)) return;
    playTone('pop');
    setTappedObjects((prev) => {
      const next = new Set(prev);
      next.add(i);
      return next;
    });
    speak(numberWords[i]);
  };

  const handleChoice = (numStr: string) => {
    if (!current) return;
    const isCorrect = numStr === current.correctId;

    if (isCorrect) {
      const wasFirstTry = wrongAnswers.size === 0;
      if (wasFirstTry) {
        setFirstTryCorrect((n) => n + 1);
        addStars(1);
      }
      playTone('correct');
      setShowConfetti(true);
      const entry = numberMap.current.get(current.correctId);
      if (entry) {
        speak(`Yes! ${entry.word} ${entry.emoji}`);
      }

      setTimeout(() => {
        setShowConfetti(false);
        if (qIndex < round.length - 1) {
          setQIndex((i) => i + 1);
          setWrongAnswers(new Set());
        } else {
          const finalScore = wasFirstTry ? firstTryCorrect + 1 : firstTryCorrect;
          recordRoundScore('num', finalScore);
          playTone('win');
          setPhase('done');
        }
      }, 2000);
    } else {
      playTone('wrong');
      speak('Try again');
      setWrongAnswers((prev) => {
        const next = new Set(prev);
        next.add(numStr);
        if (next.size >= 2) {
          const entry = numberMap.current.get(current.correctId);
          setTimeout(() => {
            if (entry) speak(`The answer is ${entry.word}`);
            setTimeout(() => {
              if (qIndex < round.length - 1) {
                setQIndex((i) => i + 1);
                setWrongAnswers(new Set());
              } else {
                recordRoundScore('num', firstTryCorrect);
                setPhase('done');
              }
            }, 2000);
          }, 500);
        }
        return next;
      });
    }
  };

  const playAgain = () => {
    stop();
    setRound(buildRound());
    setQIndex(0);
    setTappedObjects(new Set());
    setWrongAnswers(new Set());
    setFirstTryCorrect(0);
    setShowConfetti(false);
    setPhase('playing');
  };

  if (phase === 'done') {
    return (
      <>
        <Confetti active={showConfetti} />
        <div
          className="h-full animate-fade-in"
          style={{ background: `linear-gradient(160deg, ${colors.pastels[1]}, ${colors.pastels[4]})` }}
        >
          <EndRoundScreen stars={roundStars(firstTryCorrect)} onPlayAgain={playAgain} onHome={onHome} />
        </div>
      </>
    );
  }

  const cols = current && current.count <= 3 ? current.count : current && current.count <= 6 ? 3 : 4;

  return (
    <div
      className="flex flex-col h-full animate-fade-in"
      style={{ background: `linear-gradient(160deg, ${colors.pastels[qIndex % 6]}, ${colors.pastels[(qIndex + 3) % 6]})` }}
    >
      <Confetti active={showConfetti} />

      {/* Top bar */}
      <div className="flex items-center justify-between p-4">
        <BackButton onClick={onBack} />
        <h2 className="font-rounded font-bold" style={{ fontSize: '1.75rem', color: colors.ink }}>
          123 Play
        </h2>
        <SpeakerButton onClick={() => speak('How many?')} />
      </div>

      {/* Mascot */}
      <div className="flex justify-center">
        <TaraMascot size={60} animation={showConfetti ? 'cheer' : 'idle'} />
      </div>

      {/* Object grid */}
      <div className="flex items-center justify-center p-4">
        <div
          className="rounded-[1.5rem] p-4 flex flex-wrap items-center justify-center gap-2"
          style={{ backgroundColor: '#FFFFFF', boxShadow: '0 6px 20px rgba(0,0,0,0.08)' }}
        >
          {current &&
            Array.from({ length: current.count }, (_, i) => {
              const isTapped = tappedObjects.has(i);
              return (
                <button
                  key={i}
                  onClick={() => handleObjectTap(i)}
                  className={`flex items-center justify-center rounded-full transition-all duration-200 ${isTapped ? 'animate-pop' : 'hover:scale-110'} cursor-pointer`}
                  style={{
                    width: '56px',
                    height: '56px',
                    backgroundColor: isTapped ? colors.successLight : '#F8F8F8',
                    border: isTapped ? `3px solid ${colors.success}` : '3px solid transparent',
                  }}
                >
                  <span style={{ fontSize: '2rem', opacity: isTapped ? 0.6 : 1 }}>{current.emoji}</span>
                </button>
              );
            })}
        </div>
      </div>

      {/* Choices */}
      <div className="flex-1 flex items-center justify-center px-4 pb-2">
        <div className="grid grid-cols-3 gap-3 w-full max-w-[360px]">
          {current &&
            current.options.map((opt) => {
              const numStr = typeof opt === 'string' ? opt : ((opt as any).id as string);
              const entry = numberMap.current.get(numStr);
              let state: 'default' | 'correct' | 'wrong' | 'disabled' | 'revealed' = 'default';
              if (numStr === current.correctId && showConfetti) state = 'correct';
              else if (wrongAnswers.has(numStr)) state = 'wrong';
              else if (wrongAnswers.size >= 2 && numStr === current.correctId) state = 'revealed';
              else if (showConfetti) state = 'disabled';

              return (
                <ChoiceButton
                  key={numStr}
                  label={entry ? entry.numeral : numStr}
                  state={state}
                  onClick={() => handleChoice(numStr)}
                />
              );
            })}
        </div>
      </div>

      {/* Progress */}
      <div className="flex flex-col items-center gap-2 pb-6">
        <ProgressDots total={round.length} current={qIndex} />
        <p className="font-rounded font-bold" style={{ fontSize: '1.25rem', color: colors.inkLight }}>
          {qIndex + 1} / {round.length}
        </p>
      </div>
    </div>
  );
}
