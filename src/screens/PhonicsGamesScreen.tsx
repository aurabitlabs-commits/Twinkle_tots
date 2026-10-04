import { useState, useEffect } from 'react';
import { BackButton } from '@/components/BackButton';
import { ChoiceButton } from '@/components/ChoiceButton';
import { Confetti } from '@/components/Confetti';
import { TaraMascot } from '@/components/TaraMascot';
import { colors } from '@/theme';
import { playTone, useSpeech } from '@/hooks/useSpeech';
import { shuffle } from '@/utils/shuffle';
import phonicsData from '@/data/phonicsData.json';

interface PhonicsGamesScreenProps {
  onBack: () => void;
  addStars: (count: number) => void;
}

export function PhonicsGamesScreen({ onBack, addStars }: PhonicsGamesScreenProps) {
  const [round, setRound] = useState(0);
  const [wrongChoices, setWrongChoices] = useState<Set<string>>(new Set());
  const [showConfetti, setShowConfetti] = useState(false);
  const { speak } = useSpeech();

  const words = phonicsData.cvcWords;
  const current = words[round % words.length];

  // Missing Middle Vowel: e.g. C _ T (missing 'A')
  const missingVowel = current.letters[1];
  const vowelPool = ['A', 'E', 'I', 'O', 'U'];
  const options = shuffle([
    missingVowel,
    ...shuffle(vowelPool.filter((v) => v !== missingVowel)).slice(0, 2),
  ]);

  useEffect(() => {
    speak(`What is the missing middle vowel in ${current.word}?`);
  }, [round, current.word, speak]);

  const handleChoice = (vowel: string) => {
    if (vowel === missingVowel) {
      playTone('correct');
      setShowConfetti(true);
      speak(`Super! ${current.letters[0]}... ${vowel}... ${current.letters[2]} makes ${current.word}!`);
      addStars(1);

      setTimeout(() => {
        setShowConfetti(false);
        setWrongChoices(new Set());
        setRound((r) => r + 1);
      }, 1900);
    } else {
      playTone('wrong');
      speak(`Let's try again! What vowel makes ${current.word}?`);
      setWrongChoices((prev) => new Set([...prev, vowel]));
    }
  };

  return (
    <div
      className="flex flex-col h-full animate-fade-in select-none relative overflow-hidden"
      style={{
        background: `linear-gradient(160deg, #FCE4EC 0%, #FFFFFF 60%, ${colors.pastels[round % 6]} 100%)`,
      }}
    >
      <Confetti active={showConfetti} />

      {/* Top bar */}
      <div className="flex items-center justify-between p-4 z-10">
        <BackButton onClick={onBack} />
        <h2 className="font-rounded font-bold text-2xl text-slate-800">
          Missing Sound
        </h2>
        <div className="w-8" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-between p-4 max-w-[360px] mx-auto w-full z-10">
        <div className="flex justify-center mt-1">
          <TaraMascot size={72} animation={showConfetti ? 'cheer' : 'idle'} />
        </div>

        {/* Puzzle Card */}
        <div className="w-full bg-white rounded-[2.5rem] shadow-xl border-4 border-pink-200 p-6 flex flex-col items-center text-center my-2">
          <span className="text-6xl mb-2 animate-bounce-gentle">{current.emoji}</span>
          <span className="text-xs uppercase font-bold text-pink-700 block mb-2">
            Find the Missing Vowel:
          </span>

          <div className="flex items-center justify-center gap-3 font-rounded font-extrabold text-5xl text-pink-950 my-2">
            <span>{current.letters[0]}</span>
            <span className="w-14 h-16 rounded-2xl border-3 border-dashed border-pink-400 bg-pink-50 flex items-center justify-center text-pink-400">
              ?
            </span>
            <span>{current.letters[2]}</span>
          </div>
        </div>

        {/* 3 Choices */}
        <div className="grid grid-cols-3 gap-3 w-full my-2">
          {options.map((vowel) => (
            <button
              key={vowel}
              onClick={() => handleChoice(vowel)}
              className={`aspect-square rounded-2xl font-rounded font-extrabold text-4xl shadow-md border-3 transition-transform active:scale-90 ${
                wrongChoices.has(vowel)
                  ? 'bg-rose-50 border-rose-300 text-rose-300'
                  : 'bg-white border-pink-300 text-pink-950 hover:bg-pink-50'
              }`}
            >
              {vowel}
            </button>
          ))}
        </div>

        <div className="text-slate-500 font-rounded font-bold text-sm pb-4">
          Round {round + 1}
        </div>
      </div>
    </div>
  );
}
