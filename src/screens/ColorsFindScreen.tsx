import { useCallback, useEffect, useState } from 'react';
import { BackButton } from '@/components/BackButton';
import { ChoiceButton } from '@/components/ChoiceButton';
import { ProgressDots } from '@/components/ProgressDots';
import { SpeakerButton } from '@/components/SpeakerButton';
import { Confetti } from '@/components/Confetti';
import { EndRoundScreen } from '@/components/EndRoundScreen';
import { TaraMascot } from '@/components/TaraMascot';
import { colors } from '@/theme';
import { useSpeech, playTone } from '@/hooks/useSpeech';
import { buildColorRound, roundStars } from '@/utils/quiz';
import colorsData from '@/data/colors.json';
import type { ColorEntry, GenericQuestion } from '@/types';

interface ColorsFindScreenProps {
  onBack: () => void;
  onHome: () => void;
  addStars: (count: number, topicId?: string) => void;
  recordRoundScore: (topic: string, score: number) => void;
}

export function ColorsFindScreen({
  onBack,
  onHome,
  addStars,
  recordRoundScore,
}: ColorsFindScreenProps) {
  const allColors = colorsData as ColorEntry[];
  const [round, setRound] = useState<GenericQuestion[]>(() => buildColorRound(allColors, 10));
  const [qIndex, setQIndex] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState<Set<string>>(new Set());
  const [firstTryCorrect, setFirstTryCorrect] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [phase, setPhase] = useState<'playing' | 'done'>('playing');
  const { speak, stop } = useSpeech();

  const current = round[qIndex];

  const speakPrompt = useCallback(
    (question: GenericQuestion) => {
      speak(question.promptAudioText);
    },
    [speak]
  );

  useEffect(() => {
    if (phase === 'playing' && current) {
      const timer = setTimeout(() => speakPrompt(current), 300);
      return () => {
        clearTimeout(timer);
        stop();
      };
    }
  }, [qIndex, phase, current, speakPrompt, stop]);

  const handleChoice = (optionId: string) => {
    if (!current) return;
    const isCorrect = optionId === current.correctId;

    if (isCorrect) {
      const wasFirstTry = wrongAnswers.size === 0;
      if (wasFirstTry) {
        setFirstTryCorrect((n) => n + 1);
        addStars(1, 'colors');
      }
      playTone('correct');
      setShowConfetti(true);
      speak(`Yes! ${current.feedbackAudioText || ''}`);

      setTimeout(() => {
        setShowConfetti(false);
        if (qIndex < round.length - 1) {
          setQIndex((i) => i + 1);
          setWrongAnswers(new Set());
        } else {
          const finalScore = wasFirstTry ? firstTryCorrect + 1 : firstTryCorrect;
          recordRoundScore('colors_find', finalScore);
          playTone('win');
          setPhase('done');
        }
      }, 2000);
    } else {
      playTone('wrong');
      speak('Try again... फिर से कोशिश करो');
      setWrongAnswers((prev) => {
        const next = new Set(prev);
        next.add(optionId);
        if (next.size >= 2) {
          setTimeout(() => {
            speak(`The answer is ${current.correctId}`);
            setTimeout(() => {
              if (qIndex < round.length - 1) {
                setQIndex((i) => i + 1);
                setWrongAnswers(new Set());
              } else {
                recordRoundScore('colors_find', firstTryCorrect);
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
    setRound(buildColorRound(allColors, 10));
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
          style={{ background: `linear-gradient(160deg, ${colors.pastels[3]}, ${colors.pastels[1]})` }}
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
      <div className="flex items-center justify-between p-4">
        <BackButton onClick={onBack} />
        <h2 className="font-rounded font-bold text-2xl" style={{ color: colors.ink }}>
          Find the Color
        </h2>
        <SpeakerButton onClick={() => current && speakPrompt(current)} />
      </div>

      {/* Mascot */}
      <div className="flex justify-center">
        <TaraMascot size={64} animation={showConfetti ? 'cheer' : 'idle'} />
      </div>

      {/* Prompt */}
      <div className="text-center mt-2 px-4">
        <p className="font-rounded text-lg font-bold" style={{ color: colors.ink }}>
          {current ? current.promptAudioText : 'Find the color!'}
        </p>
      </div>

      {/* Choices */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="grid grid-cols-1 gap-3.5 w-full max-w-[300px]">
          {current &&
            current.options.map((opt) => {
              let state: 'default' | 'correct' | 'wrong' | 'disabled' | 'revealed' = 'default';
              if (opt.id === current.correctId && showConfetti) state = 'correct';
              else if (wrongAnswers.has(opt.id)) state = 'wrong';
              else if (wrongAnswers.size >= 2 && opt.id === current.correctId) state = 'revealed';
              else if (showConfetti) state = 'disabled';

              return (
                <ChoiceButton
                  key={opt.id}
                  label={opt.label}
                  kind="color"
                  colorSwatch={opt.color}
                  state={state}
                  onClick={() => handleChoice(opt.id)}
                />
              );
            })}
        </div>
      </div>

      {/* Progress */}
      <div className="flex flex-col items-center gap-2 pb-6">
        <ProgressDots total={round.length} current={qIndex} />
        <p className="font-rounded font-bold text-lg" style={{ color: colors.inkLight }}>
          {qIndex + 1} / {round.length}
        </p>
      </div>
    </div>
  );
}
