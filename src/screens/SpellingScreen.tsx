import { useState, useEffect } from 'react';
import { BackButton } from '@/components/BackButton';
import { TaraMascot } from '@/components/TaraMascot';
import { Confetti } from '@/components/Confetti';
import { colors } from '@/theme';
import { playTone, useSpeech } from '@/hooks/useSpeech';
import { shuffle } from '@/utils/shuffle';
import phonicsData from '@/data/phonicsData.json';
import { Volume2, RotateCcw } from 'lucide-react';

interface SpellingScreenProps {
  onBack: () => void;
  addStars: (count: number) => void;
}

export function SpellingScreen({ onBack, addStars }: SpellingScreenProps) {
  const [round, setRound] = useState(0);
  const [typedLetters, setTypedLetters] = useState<string[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { speak } = useSpeech();

  const words = phonicsData.cvcWords;
  const current = words[round % words.length];

  // Distractors
  const alphabetPool = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'M', 'N', 'P', 'R', 'S', 'T'];
  const distractors = shuffle(alphabetPool.filter((l) => !current.letters.includes(l))).slice(0, 2);
  const [availableTiles, setAvailableTiles] = useState<Array<{ id: number; letter: string }>>([]);

  const initTiles = () => {
    const raw = [...current.letters, ...distractors];
    setAvailableTiles(shuffle(raw).map((letter, idx) => ({ id: idx, letter })));
    setTypedLetters([]);
    setIsSuccess(false);
    setShowConfetti(false);
  };

  useEffect(() => {
    initTiles();
    speak(`Spell the word: ${current.word}!`);
  }, [round, speak]);

  const handleTileClick = (tile: { id: number; letter: string }) => {
    if (isSuccess || typedLetters.length >= current.letters.length) return;
    playTone('tap');

    const nextTyped = [...typedLetters, tile.letter];
    setTypedLetters(nextTyped);

    if (nextTyped.length === current.letters.length) {
      const spelled = nextTyped.join('');
      if (spelled === current.word) {
        // Success!
        playTone('win');
        setShowConfetti(true);
        setIsSuccess(true);
        speak(`Great spelling! You spelled ${current.word}!`);
        addStars(1);

        setTimeout(() => {
          setRound((r) => r + 1);
        }, 2200);
      } else {
        // Mismatch
        playTone('wrong');
        speak(`Let's try again! ${current.word}`);
        setTimeout(() => {
          setTypedLetters([]);
        }, 800);
      }
    }
  };

  return (
    <div
      className="flex flex-col h-full animate-fade-in select-none relative overflow-hidden"
      style={{
        background: `linear-gradient(160deg, #E0F2F1 0%, #FFFFFF 60%, ${colors.pastels[round % 6]} 100%)`,
      }}
    >
      <Confetti active={showConfetti} />

      {/* Top bar */}
      <div className="flex items-center justify-between p-4 z-10">
        <BackButton onClick={onBack} />
        <h2 className="font-rounded font-bold text-2xl text-slate-800">
          Spell the Word
        </h2>
        <button
          onClick={() => {
            playTone('tap');
            speak(`Spell ${current.word}`);
          }}
          className="p-2.5 rounded-full bg-white text-teal-700 shadow-sm active:scale-95 cursor-pointer"
        >
          <Volume2 size={20} />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-between p-4 max-w-[380px] mx-auto w-full z-10">
        {/* Word Picture Frame */}
        <div className="w-full bg-white rounded-[2.5rem] shadow-xl border-4 border-teal-200 p-6 flex flex-col items-center text-center my-2">
          <span className="text-7xl mb-2 animate-bounce-gentle">{current.emoji}</span>
          <span className="font-rounded font-bold text-lg text-teal-900">
            {isSuccess ? current.word : 'What is this word?'}
          </span>

          {/* Letter Slots */}
          <div className="flex gap-3 my-4">
            {current.letters.map((_, idx) => {
              const letter = typedLetters[idx];
              return (
                <div
                  key={idx}
                  className={`w-16 h-20 rounded-2xl border-3 flex items-center justify-center font-rounded font-extrabold text-4xl shadow-sm ${
                    letter
                      ? isSuccess
                        ? 'bg-green-100 border-green-500 text-green-950 scale-105'
                        : 'bg-teal-50 border-teal-400 text-teal-950'
                      : 'bg-slate-50 border-dashed border-slate-300 text-slate-300'
                  }`}
                >
                  {letter || '_'}
                </div>
              );
            })}
          </div>

          {typedLetters.length > 0 && !isSuccess && (
            <button
              onClick={() => {
                playTone('tap');
                setTypedLetters([]);
              }}
              className="text-xs font-bold text-slate-500 hover:text-slate-700 flex items-center gap-1 mt-1"
            >
              <RotateCcw size={12} /> Clear letters
            </button>
          )}
        </div>

        {/* Letter Keyboard Choices */}
        <div className="w-full my-2">
          <span className="text-xs uppercase font-bold text-slate-500 block text-center mb-2">
            Tap letters to spell:
          </span>
          <div className="flex justify-center gap-2.5 flex-wrap">
            {availableTiles.map((tile) => (
              <button
                key={tile.id}
                onClick={() => handleTileClick(tile)}
                className="w-14 h-16 rounded-2xl bg-white shadow-md border-2 border-teal-300 font-rounded font-extrabold text-3xl text-teal-950 active:scale-90 hover:scale-105 transition-transform cursor-pointer"
              >
                {tile.letter}
              </button>
            ))}
          </div>
        </div>

        <div className="text-slate-500 font-rounded font-bold text-sm pb-4">
          Round {round + 1}
        </div>
      </div>
    </div>
  );
}
