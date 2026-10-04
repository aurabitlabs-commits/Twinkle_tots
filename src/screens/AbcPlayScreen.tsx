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
import { buildLetterRound, roundStars } from '@/utils/quiz';
import alphabetData from '@/data/alphabet.json';
import type { AlphabetEntry, GenericQuestion, QuestionOption } from '@/types';

interface AbcPlayScreenProps {
  onBack: () => void;
  onHome: () => void;
  addStars: (count: number) => void;
  recordRoundScore: (topic: 'abc' | 'num', score: number) => void;
}

const ROUND_SIZE = 10;

export function AbcPlayScreen({ onBack, onHome, addStars, recordRoundScore }: AbcPlayScreenProps) {
  const alphabet = alphabetData as AlphabetEntry[];
  const letterMap = useRef<Map<string, AlphabetEntry>>(new Map(alphabet.map((e) => [e.id, e])));

  const [round, setRound] = useState<GenericQuestion[]>(() =>
    buildLetterRound(alphabet.map((e) => e.id), ROUND_SIZE),
  );
  const [qIndex, setQIndex] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState<Set<string>>(new Set());
  const [firstTryCorrect, setFirstTryCorrect] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [phase, setPhase] = useState<'playing' | 'done'>('playing');
  const { speak, stop } = useSpeech();

  const current = round[qIndex];
  const correctEntry = current ? letterMap.current.get(current.correctId) : null;

  const speakPrompt = useCallback(
    (letterId: string) => {
      const entry = letterMap.current.get(letterId);
      if (entry) {
        speak(`Find the letter ${entry.id}! ${entry.id} for ${entry.word}`);
      }
    },
    [speak],
  );

  useEffect(() => {
    if (phase === 'playing' && current) {
      const timer = setTimeout(() => speakPrompt(current.correctId), 300);
      return () => {
        clearTimeout(timer);
        stop();
      };
    }
  }, [qIndex, phase, current, speakPrompt, stop]);

  const handleChoice = (letterId: string) => {
    if (!current) return;
    const isCorrect = letterId === current.correctId;

    if (isCorrect) {
      const wasFirstTry = wrongAnswers.size === 0;
      if (wasFirstTry) {
        setFirstTryCorrect((n) => n + 1);
        addStars(1);
      }
      playTone('correct');
      setShowConfetti(true);
      if (correctEntry) {
        speak(`Yes! ${correctEntry.id} for ${correctEntry.word}`);
      }

      setTimeout(() => {
        setShowConfetti(false);
        if (qIndex < round.length - 1) {
          setQIndex((i) => i + 1);
          setWrongAnswers(new Set());
        } else {
          const finalScore = wasFirstTry ? firstTryCorrect + 1 : firstTryCorrect;
          recordRoundScore('abc', finalScore);
          playTone('win');
          setPhase('done');
        }
      }, 1900);
    } else {
      playTone('wrong');
      speak('Try again!');
      setWrongAnswers((prev) => {
        const next = new Set(prev);
        next.add(letterId);
        if (next.size >= 2) {
          setTimeout(() => {
            if (correctEntry) {
              speak(`The answer is ${correctEntry.id}`);
            }
            setTimeout(() => {
              if (qIndex < round.length - 1) {
                setQIndex((i) => i + 1);
                setWrongAnswers(new Set());
              } else {
                recordRoundScore('abc', firstTryCorrect);
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
    setRound(buildLetterRound(alphabet.map((e) => e.id), ROUND_SIZE));
    setQIndex(0);
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
          style={{ background: `linear-gradient(160deg, ${colors.pastels[0]}, ${colors.pastels[3]})` }}
        >
          <EndRoundScreen stars={roundStars(firstTryCorrect)} onPlayAgain={playAgain} onHome={onHome} />
        </div>
      </>
    );
  }

  return (
    <div
      className="flex flex-col h-full animate-fade-in select-none"
      style={{
        background: `linear-gradient(160deg, ${colors.pastels[qIndex % 6]}, ${colors.pastels[(qIndex + 3) % 6]})`,
      }}
    >
      <Confetti active={showConfetti} />

      {/* Top bar */}
      <div className="flex items-center justify-between p-4 sticky top-0 z-10 bg-white/40 backdrop-blur-xs">
        <BackButton onClick={onBack} />
        <h2 className="font-rounded font-bold text-2xl" style={{ color: colors.ink }}>
          ABC Play
        </h2>
        <SpeakerButton onClick={() => current && speakPrompt(current.correctId)} />
      </div>

      {/* Mascot */}
      <div className="flex justify-center mt-2">
        <TaraMascot size={74} animation={showConfetti ? 'cheer' : 'idle'} />
      </div>

      {/* Prompt Card */}
      <div className="text-center mt-2 px-4">
        <div className="bg-white/95 rounded-2xl py-2 px-4 shadow-sm inline-flex items-center gap-2 border-2 border-amber-200">
          <span className="text-2xl">🎧</span>
          <span className="font-rounded font-bold text-lg text-slate-800">
            Find the letter{' '}
            <span className="text-amber-600 text-2xl font-extrabold">{current?.correctId}</span>
          </span>
        </div>
      </div>

      {/* Choices */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="grid grid-cols-1 gap-3.5 w-full max-w-[300px]">
          {current &&
            current.options.map((opt) => {
              const letterId = typeof opt === 'string' ? opt : (opt as QuestionOption).id;
              const entry = letterMap.current.get(letterId);
              let state: 'default' | 'correct' | 'wrong' | 'disabled' | 'revealed' = 'default';
              if (letterId === current.correctId && showConfetti) state = 'correct';
              else if (wrongAnswers.has(letterId)) state = 'wrong';
              else if (wrongAnswers.size >= 2 && letterId === current.correctId) state = 'revealed';
              else if (showConfetti) state = 'disabled';

              return (
                <ChoiceButton
                  key={letterId}
                  label={entry ? `${entry.upper} ${entry.lower}` : letterId}
                  emoji={entry?.emoji}
                  state={state}
                  onClick={() => handleChoice(letterId)}
                />
              );
            })}
        </div>
      </div>

      {/* Progress */}
      <div className="flex flex-col items-center gap-2 pb-6">
        <ProgressDots total={round.length} current={qIndex} />
        <p className="font-rounded font-bold text-base" style={{ color: colors.inkLight }}>
          {qIndex + 1} / {round.length}
        </p>
      </div>
    </div>
  );
}
