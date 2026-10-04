import { useState } from 'react';
import { BackButton } from '@/components/BackButton';
import { TaraMascot } from '@/components/TaraMascot';
import { colors } from '@/theme';
import { playTone, useSpeech } from '@/hooks/useSpeech';
import phonicsData from '@/data/phonicsData.json';
import { Volume2, Home, Sparkles } from 'lucide-react';

interface WordFamiliesScreenProps {
  onBack: () => void;
  addStars: (count: number) => void;
}

export function WordFamiliesScreen({ onBack, addStars }: WordFamiliesScreenProps) {
  const [selectedFamilyId, setSelectedFamilyId] = useState('-at');
  const { speak } = useSpeech();
  const families = phonicsData.wordFamilies;
  const currentFamily = families.find((f) => f.id === selectedFamilyId) || families[0];

  const handleWordClick = (word: string) => {
    playTone('pop');
    speak(`${word}! It belongs to the ${currentFamily.name}!`);
    addStars(1);
  };

  const handleHearFamily = () => {
    playTone('tap');
    speak(`The ${currentFamily.name}... rhyming with ${currentFamily.sound}!`);
  };

  return (
    <div
      className="flex flex-col h-full animate-fade-in select-none relative overflow-y-auto"
      style={{
        background: `linear-gradient(160deg, #FFF8E1 0%, #FFFFFF 60%, ${currentFamily.color}20 100%)`,
      }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between p-4 sticky top-0 bg-white/70 backdrop-blur-sm z-10 shadow-xs">
        <BackButton onClick={onBack} />
        <h2 className="font-rounded font-bold text-2xl text-slate-800">
          Word Families
        </h2>
        <div className="w-8" />
      </div>

      <div className="p-4 flex flex-col gap-4 max-w-[420px] mx-auto w-full pb-8">
        {/* Family Selector Pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
          {families.map((fam) => {
            const isSel = fam.id === selectedFamilyId;
            return (
              <button
                key={fam.id}
                onClick={() => {
                  playTone('tap');
                  setSelectedFamilyId(fam.id);
                  speak(fam.name);
                }}
                className={`flex-shrink-0 px-4 py-2 rounded-2xl font-rounded font-bold text-sm transition-all ${
                  isSel
                    ? 'bg-amber-500 text-white shadow-md scale-105'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {fam.name}
              </button>
            );
          })}
        </div>

        {/* Visual Word Family House */}
        <div className="w-full bg-white rounded-[2.5rem] shadow-xl border-4 border-amber-300 p-5 flex flex-col items-center text-center relative overflow-hidden">
          {/* Roof decoration */}
          <div className="w-full flex items-center justify-center gap-2 mb-2">
            <Home size={28} className="text-amber-600" />
            <h3 className="font-rounded font-extrabold text-3xl text-amber-950">
              {currentFamily.name} House
            </h3>
          </div>

          <p className="font-rounded text-xs text-slate-600 mb-4">
            Notice how all these words end with the same rhyming sound!
          </p>

          {/* Rhyming Words in the House */}
          <div className="grid grid-cols-2 gap-3 w-full my-2">
            {currentFamily.words.map((w) => {
              const prefix = w.slice(0, w.length - 2);
              const suffix = w.slice(w.length - 2);

              return (
                <button
                  key={w}
                  onClick={() => handleWordClick(w)}
                  className="p-3.5 rounded-2xl bg-amber-50/70 hover:bg-amber-100 border-2 border-amber-200 flex items-center justify-between shadow-xs active:scale-95 transition-transform cursor-pointer"
                >
                  <span className="font-rounded font-extrabold text-2xl text-slate-900">
                    <span className="text-amber-700">{prefix}</span>
                    <span className="text-orange-600 underline decoration-amber-400">{suffix}</span>
                  </span>
                  <Volume2 size={18} className="text-amber-600" />
                </button>
              );
            })}
          </div>

          {/* Tara's Audio Tip */}
          <div className="mt-4 p-3 bg-amber-50 rounded-2xl border border-amber-200 flex items-center gap-3 w-full text-left">
            <TaraMascot size={46} animation="idle" />
            <p className="font-rounded text-xs text-amber-950 font-semibold leading-snug">
              "Tap any word to hear how it rhymes in the {currentFamily.name}!"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
