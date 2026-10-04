import { useState } from 'react';
import { BackButton } from '@/components/BackButton';
import { FlashCard } from '@/components/FlashCard';
import { ChoiceButton } from '@/components/ChoiceButton';
import { MemoryMatch } from '@/components/MemoryMatch';
import { Confetti } from '@/components/Confetti';
import { EndRoundScreen } from '@/components/EndRoundScreen';
import { colors } from '@/theme';
import { useSpeech, playTone } from '@/hooks/useSpeech';
import { isUnlocked } from '@/utils/entitlements';
import { shuffle } from '@/utils/shuffle';
import { Lock } from 'lucide-react';

interface PackItem {
  id: string;
  nameEn: string;
  nameHi: string;
  emoji: string;
  soundWord?: string;
  sound?: string;
}

interface PackLearnPlayScreenProps {
  packId: string;
  title: string;
  items: PackItem[];
  onBack: () => void;
  onHome: () => void;
  addStars: (count: number) => void;
  onOpenPaywall: () => void;
  onSoundQuiz?: () => void;
}

export function PackLearnPlayScreen({
  packId,
  title,
  items,
  onBack,
  onHome,
  addStars,
  onOpenPaywall,
  onSoundQuiz,
}: PackLearnPlayScreenProps) {
  const [mode, setMode] = useState<'learn' | 'find' | 'match'>('learn');
  const [index, setIndex] = useState(0);
  const [qIndex, setQIndex] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState<Set<string>>(new Set());
  const [showConfetti, setShowConfetti] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const { speak } = useSpeech();

  const currentItem = items[index];

  // Quiz questions
  const [quizQuestions] = useState(() => {
    return shuffle([...items]).slice(0, 8).map((item) => {
      const wrong = shuffle(items.filter((i) => i.id !== item.id)).slice(0, 2);
      return {
        correct: item,
        options: shuffle([item, ...wrong]),
      };
    });
  });

  const currentQ = quizQuestions[qIndex];

  const handleLearnTap = () => {
    playTone('pop');
    speak(`${currentItem.nameEn}... ${currentItem.nameHi}`);
  };

  const handleChoice = (selectedId: string) => {
    if (!currentQ) return;
    if (selectedId === currentQ.correct.id) {
      playTone('correct');
      setShowConfetti(true);
      speak(`Yes! ${currentQ.correct.nameEn}`);
      addStars(1);

      setTimeout(() => {
        setShowConfetti(false);
        if (qIndex < quizQuestions.length - 1) {
          setQIndex((i) => i + 1);
          setWrongAnswers(new Set());
        } else {
          playTone('win');
          setIsDone(true);
        }
      }, 1800);
    } else {
      playTone('wrong');
      speak('Try again');
      setWrongAnswers((prev) => new Set([...prev, selectedId]));
    }
  };

  const itemUnlocked = isUnlocked(packId, index);

  if (isDone) {
    return (
      <div className="h-full animate-fade-in" style={{ background: colors.pastels[0] }}>
        <EndRoundScreen
          stars={3}
          onPlayAgain={() => {
            setQIndex(0);
            setIsDone(false);
          }}
          onHome={onHome}
        />
      </div>
    );
  }

  return (
    <div
      className="flex flex-col h-full animate-fade-in select-none relative"
      style={{
        background: `linear-gradient(160deg, ${colors.pastels[index % 6]} 0%, ${colors.pastels[(index + 3) % 6]} 100%)`,
      }}
    >
      <Confetti active={showConfetti} />

      {/* Top bar */}
      <div className="flex items-center justify-between p-4">
        <BackButton onClick={onBack} />
        <h2 className="font-rounded font-bold text-2xl" style={{ color: colors.ink }}>
          {title}
        </h2>
        {onSoundQuiz ? (
          <button
            onClick={() => {
              playTone('tap');
              onSoundQuiz();
            }}
            className="px-3 py-1.5 bg-amber-500 text-white rounded-full font-rounded font-bold text-xs shadow-sm active:scale-95"
          >
            🎵 Sound Quiz
          </button>
        ) : (
          <div className="w-8" />
        )}
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex justify-center gap-2 px-4 mb-2">
        <button
          onClick={() => {
            playTone('tap');
            setMode('learn');
          }}
          className={`px-4 py-1.5 rounded-xl font-rounded font-bold text-sm transition-all ${
            mode === 'learn' ? 'bg-amber-500 text-white shadow-sm' : 'bg-white/80 text-slate-700'
          }`}
        >
          📖 Learn
        </button>
        <button
          onClick={() => {
            playTone('tap');
            setMode('find');
            setQIndex(0);
          }}
          className={`px-4 py-1.5 rounded-xl font-rounded font-bold text-sm transition-all ${
            mode === 'find' ? 'bg-amber-500 text-white shadow-sm' : 'bg-white/80 text-slate-700'
          }`}
        >
          🔍 Find
        </button>
        <button
          onClick={() => {
            playTone('tap');
            setMode('match');
          }}
          className={`px-4 py-1.5 rounded-xl font-rounded font-bold text-sm transition-all ${
            mode === 'match' ? 'bg-amber-500 text-white shadow-sm' : 'bg-white/80 text-slate-700'
          }`}
        >
          🧩 Match
        </button>
      </div>

      {mode === 'learn' && currentItem && (
        <div className="flex-1 flex flex-col items-center justify-between p-4">
          <div className="flex-1 flex items-center justify-center w-full relative">
            {!itemUnlocked ? (
              <div
                onClick={onOpenPaywall}
                className="w-full max-w-[340px] aspect-square rounded-[2.5rem] bg-white/95 border-4 border-amber-300 shadow-xl flex flex-col items-center justify-center p-6 text-center cursor-pointer animate-pop"
              >
                <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 mb-3">
                  <Lock size={36} />
                </div>
                <h4 className="font-rounded font-bold text-2xl text-amber-950 mb-1">
                  Plus Pack Item
                </h4>
                <p className="font-rounded text-sm text-slate-600 mb-4">
                  Tap to unlock all animals, vehicles & bonus packs!
                </p>
                <span className="px-6 py-2.5 rounded-2xl bg-amber-500 text-white font-rounded font-bold text-base shadow-md">
                  Unlock Plus
                </span>
              </div>
            ) : (
              <FlashCard
                bigText={currentItem.nameEn}
                subtitle={currentItem.nameHi}
                emoji={currentItem.emoji}
                pastelIndex={index}
                onTap={handleLearnTap}
              />
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-6 pb-2">
            <button
              onClick={() => index > 0 && setIndex((i) => i - 1)}
              disabled={index === 0}
              className="px-4 py-2 bg-white rounded-2xl shadow-sm font-bold text-slate-700 disabled:opacity-30 active:scale-95"
            >
              ◀ Back
            </button>
            <span className="font-rounded font-bold text-lg text-slate-700">
              {index + 1} / {items.length}
            </span>
            <button
              onClick={() => index < items.length - 1 && setIndex((i) => i + 1)}
              disabled={index === items.length - 1}
              className="px-4 py-2 bg-amber-500 text-white rounded-2xl shadow-sm font-bold disabled:opacity-30 active:scale-95"
            >
              Next ▶
            </button>
          </div>
        </div>
      )}

      {mode === 'find' && currentQ && (
        <div className="flex-1 flex flex-col items-center justify-between p-4">
          <div className="my-2 p-4 bg-white/90 rounded-3xl border-2 border-amber-300 text-center shadow-md w-full max-w-[320px]">
            <span className="text-xs uppercase font-bold text-amber-700 block">Find the:</span>
            <span className="font-rounded font-bold text-3xl text-amber-950 mt-1 block">
              {currentQ.correct.nameEn} ({currentQ.correct.nameHi})
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3.5 w-full max-w-[300px]">
            {currentQ.options.map((opt) => (
              <ChoiceButton
                key={opt.id}
                label={opt.nameEn}
                emoji={opt.emoji}
                state={wrongAnswers.has(opt.id) ? 'wrong' : 'default'}
                onClick={() => handleChoice(opt.id)}
              />
            ))}
          </div>

          <div className="pb-4 font-rounded font-bold text-slate-500">
            {qIndex + 1} / {quizQuestions.length}
          </div>
        </div>
      )}

      {mode === 'match' && (
        <div className="flex-1 p-2 flex items-center justify-center">
          <MemoryMatch
            items={items.map((i) => ({
              id: i.id,
              name: i.nameEn,
              display: i.emoji,
              matchKey: i.id,
            }))}
            onComplete={() => addStars(1)}
          />
        </div>
      )}
    </div>
  );
}
