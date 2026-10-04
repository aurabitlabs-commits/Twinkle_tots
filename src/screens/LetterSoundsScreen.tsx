import { useState } from 'react';
import { BackButton } from '@/components/BackButton';
import { TaraMascot } from '@/components/TaraMascot';
import { colors } from '@/theme';
import { playTone, useSpeech } from '@/hooks/useSpeech';
import phonicsData from '@/data/phonicsData.json';
import { Volume2, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

interface LetterSoundsScreenProps {
  onBack: () => void;
  addStars: (count: number) => void;
}

export function LetterSoundsScreen({ onBack, addStars }: LetterSoundsScreenProps) {
  const [index, setIndex] = useState(0);
  const { speak } = useSpeech();
  const letters = phonicsData.letters;
  const item = letters[index];

  const handleHearName = () => {
    playTone('tap');
    speak(`Letter ${item.upper}... its name is ${item.name}!`);
  };

  const handleHearSound = () => {
    playTone('pop');
    speak(`${item.soundSpoken}... ${item.soundSpoken}! ${item.taraPhrase}!`);
  };

  const handleHearWord = () => {
    playTone('correct');
    speak(`${item.example}... starts with ${item.soundSpoken}!`);
    addStars(1);
  };

  return (
    <div
      className="flex flex-col h-full animate-fade-in select-none relative overflow-hidden"
      style={{
        background: `linear-gradient(160deg, ${colors.pastels[index % 6]} 0%, #FFFFFF 60%, ${colors.pastels[(index + 2) % 6]} 100%)`,
      }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between p-4 z-10">
        <BackButton onClick={onBack} />
        <h2 className="font-rounded font-bold text-2xl text-slate-800">
          Letter Sounds
        </h2>
        <div className="w-8" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-between p-4 max-w-[380px] mx-auto w-full z-10">
        {/* Main Card */}
        <div className="w-full bg-white rounded-[2.5rem] shadow-xl border-4 border-amber-200 p-5 flex flex-col items-center text-center">
          {/* Letter Pair */}
          <div className="flex items-baseline gap-3 mb-2">
            <span className="font-rounded font-extrabold text-7xl text-amber-950">
              {item.upper}
            </span>
            <span className="font-rounded font-extrabold text-6xl text-amber-700">
              {item.lower}
            </span>
          </div>

          {/* Visual Distinction: Letter Name vs Letter Sound */}
          <div className="grid grid-cols-2 gap-3 w-full my-3">
            {/* Letter Name Box */}
            <button
              onClick={handleHearName}
              className="p-3 rounded-2xl bg-amber-50 hover:bg-amber-100 border-2 border-amber-200 flex flex-col items-center active:scale-95 transition-transform cursor-pointer"
            >
              <span className="text-[10px] uppercase font-bold text-amber-800">
                Letter Name
              </span>
              <span className="font-rounded font-bold text-2xl text-amber-950 my-0.5">
                "{item.name}"
              </span>
              <Volume2 size={16} className="text-amber-600 mt-1" />
            </button>

            {/* Letter Sound Box */}
            <button
              onClick={handleHearSound}
              className="p-3 rounded-2xl bg-teal-50 hover:bg-teal-100 border-2 border-teal-300 flex flex-col items-center active:scale-95 transition-transform cursor-pointer"
            >
              <span className="text-[10px] uppercase font-bold text-teal-800">
                Letter Sound
              </span>
              <span className="font-rounded font-extrabold text-2xl text-teal-900 my-0.5">
                {item.phoneme}
              </span>
              <Volume2 size={16} className="text-teal-600 mt-1" />
            </button>
          </div>

          {/* Example Word & Picture */}
          <button
            onClick={handleHearWord}
            className="w-full p-4 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-md flex items-center justify-between active:scale-95 transition-transform cursor-pointer mt-1"
          >
            <div className="flex items-center gap-3">
              <span className="text-4xl">{item.emoji}</span>
              <div className="text-left">
                <span className="text-[11px] uppercase font-bold opacity-90 block">
                  Example Word
                </span>
                <span className="font-rounded font-bold text-2xl leading-tight">
                  {item.example}
                </span>
              </div>
            </div>
            <Volume2 size={24} />
          </button>

          {/* Tara's Explanation */}
          <div className="mt-4 p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-2.5 text-left w-full">
            <TaraMascot size={42} animation="idle" />
            <p className="font-rounded text-xs text-slate-700 font-semibold leading-snug">
              "{item.taraPhrase}!"
            </p>
          </div>
        </div>

        {/* Navigation Arrows */}
        <div className="flex items-center justify-between w-full px-2 py-2">
          <button
            onClick={() => {
              playTone('tap');
              if (index > 0) setIndex((i) => i - 1);
            }}
            disabled={index === 0}
            className="w-14 h-14 rounded-2xl bg-white shadow-md text-slate-700 flex items-center justify-center disabled:opacity-30 active:scale-95 cursor-pointer"
          >
            <ChevronLeft size={28} />
          </button>

          <span className="font-rounded font-bold text-base text-slate-700">
            {index + 1} / {letters.length}
          </span>

          <button
            onClick={() => {
              playTone('tap');
              if (index < letters.length - 1) setIndex((i) => i + 1);
            }}
            disabled={index === letters.length - 1}
            className="w-14 h-14 rounded-2xl bg-amber-500 shadow-md text-white flex items-center justify-center disabled:opacity-30 active:scale-95 cursor-pointer"
          >
            <ChevronRight size={28} />
          </button>
        </div>
      </div>
    </div>
  );
}
