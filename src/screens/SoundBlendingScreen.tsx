import { useState, useEffect } from 'react';
import { BackButton } from '@/components/BackButton';
import { TaraMascot } from '@/components/TaraMascot';
import { Confetti } from '@/components/Confetti';
import { colors } from '@/theme';
import { playTone, useSpeech } from '@/hooks/useSpeech';
import phonicsData from '@/data/phonicsData.json';
import { Sparkles, Volume2, ArrowRight, RotateCcw } from 'lucide-react';

interface SoundBlendingScreenProps {
  onBack: () => void;
  addStars: (count: number) => void;
}

export function SoundBlendingScreen({ onBack, addStars }: SoundBlendingScreenProps) {
  const [wordIdx, setWordIdx] = useState(0);
  const [activeLetterIdx, setActiveLetterIdx] = useState<number | null>(null);
  const [isBlended, setIsBlended] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { speak } = useSpeech();

  const words = phonicsData.cvcWords;
  const currentWord = words[wordIdx];

  useEffect(() => {
    setIsBlended(false);
    setActiveLetterIdx(null);
    setShowConfetti(false);
    speak(`Tap each letter sound to blend the word!`);
  }, [wordIdx, speak]);

  const handleTapLetter = (letter: string, phoneme: string, idx: number) => {
    playTone('pop');
    setActiveLetterIdx(idx);
    speak(phoneme);
    setTimeout(() => setActiveLetterIdx(null), 800);
  };

  const handleBlend = () => {
    playTone('tap');
    setIsBlended(true);

    // Read phonemes in sequence then whole word
    const p1 = currentWord.phonemes[0];
    const p2 = currentWord.phonemes[1];
    const p3 = currentWord.phonemes[2];

    speak(`${p1}... ${p2}... ${p3}... blends into ${currentWord.word}!`);

    setTimeout(() => {
      playTone('win');
      setShowConfetti(true);
      addStars(1);
    }, 1800);
  };

  const handleNextWord = () => {
    playTone('tap');
    setWordIdx((i) => (i + 1) % words.length);
  };

  return (
    <div
      className="flex flex-col h-full animate-fade-in select-none relative overflow-hidden"
      style={{
        background: `linear-gradient(160deg, #F3E5F5 0%, #FFFFFF 60%, ${colors.pastels[wordIdx % 6]} 100%)`,
      }}
    >
      <Confetti active={showConfetti} />

      {/* Top bar */}
      <div className="flex items-center justify-between p-4 z-10">
        <BackButton onClick={onBack} />
        <h2 className="font-rounded font-bold text-2xl text-slate-800">
          Sound Blending
        </h2>
        <div className="w-8" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-between p-4 max-w-[380px] mx-auto w-full z-10">
        <div className="flex justify-center mt-1">
          <TaraMascot size={74} animation={isBlended ? 'cheer' : 'idle'} />
        </div>

        {/* Word Card */}
        <div className="w-full bg-white rounded-[2.5rem] shadow-xl border-4 border-purple-200 p-6 flex flex-col items-center text-center my-3">
          <span className="text-xs uppercase font-bold text-purple-700 tracking-wider mb-4">
            Tap Each Sound
          </span>

          {/* 3 Letter Buttons */}
          <div
            className={`flex items-center justify-center transition-all duration-500 ${
              isBlended ? 'gap-1 scale-105' : 'gap-4'
            }`}
          >
            {currentWord.letters.map((letter, idx) => {
              const isPulsing = activeLetterIdx === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleTapLetter(letter, currentWord.phonemes[idx], idx)}
                  className={`w-20 h-24 rounded-3xl flex flex-col items-center justify-center shadow-md border-3 transition-transform active:scale-95 cursor-pointer ${
                    isPulsing
                      ? 'bg-purple-200 border-purple-500 scale-110'
                      : isBlended
                      ? 'bg-green-100 border-green-400'
                      : 'bg-purple-50 border-purple-300 hover:bg-purple-100'
                  }`}
                >
                  <span className="font-rounded font-extrabold text-4xl text-purple-950">
                    {letter}
                  </span>
                  <span className="text-[11px] font-bold text-purple-700 mt-1">
                    /{currentWord.phonemes[idx]}/
                  </span>
                </button>
              );
            })}
          </div>

          {/* Blended Reveal with Picture */}
          {isBlended && (
            <div className="mt-5 p-4 rounded-3xl bg-green-50 border-2 border-green-300 flex items-center justify-center gap-4 w-full animate-pop">
              <span className="text-5xl">{currentWord.emoji}</span>
              <div className="text-left">
                <span className="text-xs font-bold text-green-700 uppercase">Blended Word</span>
                <span className="font-rounded font-extrabold text-4xl text-green-950 block">
                  {currentWord.word}!
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="w-full flex flex-col gap-3 pb-4">
          {!isBlended ? (
            <button
              onClick={handleBlend}
              className="w-full py-4 px-6 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-rounded font-bold text-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Blend Sounds</span>
              <ArrowRight size={22} />
            </button>
          ) : (
            <button
              onClick={handleNextWord}
              className="w-full py-4 px-6 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-rounded font-bold text-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Next Word ➔</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
