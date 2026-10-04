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
import { buildHindiRound, roundStars } from '@/utils/quiz';
import hindiData from '@/data/hindi.json';
import type { GenericQuestion, HindiEntry } from '@/types';

interface HindiPlayScreenProps {
  onBack: () => void;
  onHome: () => void;
  addStars: (count: number, topicId?: string) => void;
  recordRoundScore: (topic: string, score: number) => void;
}

export function HindiPlayScreen({
  onBack,
  onHome,
  addStars,
  recordRoundScore,
}: HindiPlayScreenProps) {
  const allEntries = hindiData as HindiEntry[];
  const entryMap = useRef<Map<string, HindiEntry>>(new Map(allEntries.map((e) => [e.id, e])));

  const [mode, setMode] = useState<'swar' | 'vyanjan' | 'all'>('swar');
  const [round, setRound] = useState<GenericQuestion[]>(() => buildHindiRound(allEntries, 'swar', 10));
  const [qIndex, setQIndex] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState<Set<string>>(new Set());
  const [firstTryCorrect, setFirstTryCorrect] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [phase, setPhase] = useState<'playing' | 'done'>('playing');
  const { speak, stop } = useSpeech();

  const current = round[qIndex];
  const correctEntry = current ? entryMap.current.get(current.correctId) : null;

  const speakPrompt = useCallback(
    (question: GenericQuestion) => {
      speak(question.promptAudioText, { lang: 'hi-IN' });
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

  const changeMode = (newMode: 'swar' | 'vyanjan' | 'all') => {
    setMode(newMode);
    setRound(buildHindiRound(allEntries, newMode, 10));
    setQIndex(0);
    setWrongAnswers(new Set());
    setFirstTryCorrect(0);
    setShowConfetti(false);
    setPhase('playing');
  };

  const handleChoice = (optionId: string) => {
    if (!current) return;
    const isCorrect = optionId === current.correctId;

    if (isCorrect) {
      const wasFirstTry = wrongAnswers.size === 0;
      if (wasFirstTry) {
        setFirstTryCorrect((n) => n + 1);
        addStars(1, 'hindi');
      }
      playTone('correct');
      setShowConfetti(true);
      if (current.feedbackAudioText) {
        speak(current.feedbackAudioText, { lang: 'hi-IN' });
      }

      setTimeout(() => {
        setShowConfetti(false);
        if (qIndex < round.length - 1) {
          setQIndex((i) => i + 1);
          setWrongAnswers(new Set());
        } else {
          const finalScore = wasFirstTry ? firstTryCorrect + 1 : firstTryCorrect;
          recordRoundScore('hindi', finalScore);
          playTone('win');
          setPhase('done');
        }
      }, 2000);
    } else {
      playTone('wrong');
      speak('फिर से कोशिश करो', { lang: 'hi-IN' });
      setWrongAnswers((prev) => {
        const next = new Set(prev);
        next.add(optionId);
        if (next.size >= 2) {
          setTimeout(() => {
            if (correctEntry) {
              speak(`सही उत्तर है ${correctEntry.letter}`, { lang: 'hi-IN' });
            }
            setTimeout(() => {
              if (qIndex < round.length - 1) {
                setQIndex((i) => i + 1);
                setWrongAnswers(new Set());
              } else {
                recordRoundScore('hindi', firstTryCorrect);
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
    setRound(buildHindiRound(allEntries, mode, 10));
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
      className="flex flex-col h-full animate-fade-in"
      style={{
        background: `linear-gradient(160deg, ${colors.pastels[qIndex % 6]}, ${colors.pastels[(qIndex + 3) % 6]})`,
      }}
    >
      <Confetti active={showConfetti} />

      {/* Top bar */}
      <div className="flex items-center justify-between p-4">
        <BackButton onClick={onBack} />
        <h2 className="font-rounded font-bold text-2xl" style={{ color: colors.ink }}>
          सुनो और चुनो
        </h2>
        <SpeakerButton onClick={() => current && speakPrompt(current)} />
      </div>

      {/* Mode toggle: स्वर / व्यंजन / दोनों */}
      <div className="flex justify-center gap-2 px-4 mb-2">
        {(['swar', 'vyanjan', 'all'] as const).map((m) => (
          <button
            key={m}
            onClick={() => {
              playTone('tap');
              changeMode(m);
            }}
            className={`rounded-xl px-4 py-1.5 font-rounded font-bold text-sm transition-all ${
              mode === m
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-white/80 text-slate-700 hover:bg-white'
            }`}
          >
            {m === 'swar' ? 'स्वर' : m === 'vyanjan' ? 'व्यंजन' : 'दोनों'}
          </button>
        ))}
      </div>

      {/* Mascot */}
      <div className="flex justify-center">
        <TaraMascot size={64} animation={showConfetti ? 'cheer' : 'idle'} />
      </div>

      {/* Prompt */}
      <div className="text-center mt-2">
        <p className="font-rounded text-lg font-bold" style={{ color: colors.ink }}>
          अक्षर सुनो और सही विकल्प चुनो!
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
                  emoji={opt.emoji}
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
