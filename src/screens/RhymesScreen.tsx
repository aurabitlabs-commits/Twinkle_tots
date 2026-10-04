import { useState } from 'react';
import { BackButton } from '@/components/BackButton';
import { colors } from '@/theme';
import { playTone } from '@/hooks/useSpeech';
import rhymesData from '@/data/rhymes.json';
import type { RhymeData } from './RhymePlayerScreen';
import { Play } from 'lucide-react';

interface RhymesScreenProps {
  onBack: () => void;
  onSelectRhyme: (rhyme: RhymeData) => void;
  onPlayAll: () => void;
}

export function RhymesScreen({ onBack, onSelectRhyme, onPlayAll }: RhymesScreenProps) {
  const [langFilter, setLangFilter] = useState<'all' | 'en' | 'hi'>('all');
  const allRhymes = rhymesData as RhymeData[];

  const filtered = allRhymes.filter((r) => {
    if (langFilter === 'en') return r.lang === 'en';
    if (langFilter === 'hi') return r.lang === 'hi';
    return true;
  });

  return (
    <div
      className="flex flex-col h-full animate-fade-in select-none overflow-y-auto"
      style={{
        background: `linear-gradient(160deg, ${colors.pastels[1]} 0%, ${colors.pastels[4]} 100%)`,
      }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between p-4 sticky top-0 bg-white/70 backdrop-blur-sm z-10 shadow-xs">
        <BackButton onClick={onBack} />
        <h2 className="font-rounded font-bold text-2xl" style={{ color: colors.ink }}>
          Sing Along / बाल गीत
        </h2>
        <button
          onClick={() => {
            playTone('tap');
            onPlayAll();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-full font-rounded font-bold text-xs shadow-sm active:scale-95"
        >
          <Play size={14} /> Play All
        </button>
      </div>

      {/* Language filter buttons */}
      <div className="flex justify-center gap-2 p-3">
        {(['all', 'en', 'hi'] as const).map((l) => (
          <button
            key={l}
            onClick={() => {
              playTone('tap');
              setLangFilter(l);
            }}
            className={`px-4 py-1.5 rounded-xl font-rounded font-bold text-sm transition-all ${
              langFilter === l
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-white/80 text-slate-700 hover:bg-white'
            }`}
          >
            {l === 'all' ? 'All Songs' : l === 'en' ? 'English' : 'हिन्दी'}
          </button>
        ))}
      </div>

      {/* Rhymes Grid */}
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-[420px] mx-auto w-full pb-8">
        {filtered.map((rhyme) => (
          <button
            key={rhyme.id}
            onClick={() => {
              playTone('tap');
              onSelectRhyme(rhyme);
            }}
            className="rounded-3xl p-4 bg-white/95 hover:bg-white border-2 border-amber-200/80 shadow-md flex items-center gap-4 transition-transform active:scale-95 text-left cursor-pointer"
          >
            <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center text-3xl flex-shrink-0 shadow-xs">
              {rhyme.thumbnail}
            </div>
            <div className="flex-1">
              <span className="font-rounded font-bold text-lg text-slate-800 line-clamp-1 block">
                {rhyme.title}
              </span>
              <span className="text-xs font-semibold text-amber-700 uppercase">
                {rhyme.lang === 'hi' ? 'Hindi Rhyme' : 'English Rhyme'}
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
              <Play size={18} className="ml-0.5" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
