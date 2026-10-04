import { useState, useEffect } from 'react';
import { BackButton } from '@/components/BackButton';
import { ChoiceButton } from '@/components/ChoiceButton';
import { Confetti } from '@/components/Confetti';
import { TaraMascot } from '@/components/TaraMascot';
import { colors } from '@/theme';
import { playTone, useSpeech } from '@/hooks/useSpeech';
import { shuffle } from '@/utils/shuffle';
import phonicsData from '@/data/phonicsData.json';
import { Volume2 } from 'lucide-react';

interface BeginningSoundScreenProps {
  onBack: () => void;
  addStars: (count: number) => void;
}

export function BeginningSoundScreen({ onBack, addStars }: BeginningSoundScreenProps) {
  const [round, setRound] = useState(0);
  const [wrongChoices, setWrongChoices] = useState<Set<string>>(new Set());
  const [showConfetti, setShowConfetti] = useState(false);
  const { speak } = useSpeech();

  const letters = phonicsData.letters;
  // Pick target
  const target = letters[round % letters.length];
  // Pick 2 wrong items
  const wrongCandidates = letters.filter((l) => l.id !== target.id);
  const options = shuffle([target, ...shuffle(wrongCandidates).slice(0, 2)]);

  const promptQuestion = `Which word starts with ${target.soundSpoken}?`;

  useEffect(() => {
    speak(promptQuestion);
  }, [round, promptQuestion, speak]);

  const handleChoice = (selectedId: string) => {
    if (selectedId === target.id) {
      playTone('correct');
      setShowConfetti(true);
      speak(`Good listening! ${target.example} starts with ${target.soundSpoken}!`);
      addStars(1);

      setTimeout(() => {
        setShowConfetti(false);
        setWrongChoices(new Set());
        setRound((r) => r + 1);
      }, 1900);
    } else {
      playTone('wrong');
      speak(`Listen carefully! Which word starts with ${target.soundSpoken}?`);
      setWrongChoices((prev) => new Set([...prev, selectedId]));
    }
  };

  return (
    <div
      className="flex flex-col h-full animate-fade-in select-none relative overflow-hidden"
      style={{
        background: `linear-gradient(160deg, #E1F5FE 0%, #FFFFFF 60%, ${colors.pastels[round % 6]} 100%)`,
      }}
    >
      <Confetti active={showConfetti} />

      {/* Top bar */}
      <div className="flex items-center justify-between p-4 z-10">
        <BackButton onClick={onBack} />
        <h2 className="font-rounded font-bold text-2xl text-slate-800">
          Listen & Find
        </h2>
        <button
          onClick={() => {
            playTone('tap');
            speak(promptQuestion);
          }}
          className="p-2.5 rounded-full bg-white text-blue-600 shadow-sm active:scale-95 cursor-pointer"
        >
          <Volume2 size={20} />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-between p-4 max-w-[360px] mx-auto w-full z-10">
        <div className="flex justify-center mt-1">
          <TaraMascot size={70} animation={showConfetti ? 'cheer' : 'idle'} />
        </div>

        {/* Prompt Sound Banner */}
        <div className="w-full bg-white rounded-3xl p-5 shadow-lg border-3 border-blue-300 text-center my-2">
          <span className="text-xs uppercase font-bold text-blue-700 block mb-1">
            Listen for the sound:
          </span>
          <div className="flex items-center justify-center gap-3">
            <span className="font-rounded font-extrabold text-5xl text-blue-950">
              {target.phoneme}
            </span>
            <button
              onClick={() => {
                playTone('pop');
                speak(target.soundSpoken);
              }}
              className="p-3 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 active:scale-95"
            >
              <Volume2 size={24} />
            </button>
          </div>
          <span className="text-xs text-slate-500 font-semibold mt-2 block">
            Which word starts with this sound?
          </span>
        </div>

        {/* 3 Choices */}
        <div className="grid grid-cols-1 gap-3 w-full my-2">
          {options.map((opt) => (
            <ChoiceButton
              key={opt.id}
              label={opt.example}
              emoji={opt.emoji}
              state={wrongChoices.has(opt.id) ? 'wrong' : 'default'}
              onClick={() => handleChoice(opt.id)}
            />
          ))}
        </div>

        <div className="text-slate-500 font-rounded font-bold text-sm pb-4">
          Round {round + 1}
        </div>
      </div>
    </div>
  );
}
