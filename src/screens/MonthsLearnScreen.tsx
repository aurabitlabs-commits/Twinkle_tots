import { useState, useEffect } from 'react';
import { BackButton } from '@/components/BackButton';
import { TaraMascot } from '@/components/TaraMascot';
import { playTone, useSpeech } from '@/hooks/useSpeech';
import { MONTHS, todayInfo, type MonthItem } from '@/utils/calendar';
import { ChevronLeft, ChevronRight, Volume2, Compass, X, Calendar } from 'lucide-react';

interface MonthsLearnScreenProps {
  onBack: () => void;
  markCardSeen?: (id: string) => void;
  voiceLang?: 'en' | 'hi' | 'both';
}

export function MonthsLearnScreen({
  onBack,
  markCardSeen,
  voiceLang = 'both',
}: MonthsLearnScreenProps) {
  const [index, setIndex] = useState(0);
  const [showYearWheel, setShowYearWheel] = useState(false);
  const { speak, stop } = useSpeech();
  const today = todayInfo();

  const current = MONTHS[index];

  const speakMonth = (m: MonthItem) => {
    playTone('pop');
    markCardSeen?.(`month_${m.id}`);

    const speech =
      voiceLang === 'hi'
        ? `${m.hi}, ${m.cueHi}`
        : voiceLang === 'both'
        ? `${m.en}... ${m.hi}... ${m.cueName}`
        : `${m.en}... ${m.cueName}`;

    speak(speech);
  };

  useEffect(() => {
    speakMonth(current);
  }, [index]);

  return (
    <div
      className="flex flex-col h-full animate-fade-in select-none relative overflow-hidden"
      style={{
        background: `linear-gradient(160deg, ${current.color} 0%, #FFFFFF 60%, ${current.color} 100%)`,
      }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between p-4 z-10">
        <BackButton
          onClick={() => {
            stop();
            onBack();
          }}
        />
        <h2 className="font-rounded font-bold text-2xl text-slate-800">
          Months of the Year
        </h2>
        {/* Year Wheel Trigger */}
        <button
          onClick={() => {
            playTone('tap');
            setShowYearWheel(true);
          }}
          className="p-2.5 rounded-full bg-white text-indigo-600 shadow-sm active:scale-95 cursor-pointer"
          title="Year Wheel"
        >
          <Compass size={22} />
        </button>
      </div>

      {/* Main Flashcard */}
      <div className="flex-1 flex flex-col items-center justify-between p-4 max-w-[380px] mx-auto w-full z-10">
        <div className="w-full bg-white rounded-[2.5rem] shadow-xl border-4 border-indigo-200 p-6 flex flex-col items-center text-center relative overflow-hidden">
          {/* Day count and season pills */}
          <div className="w-full flex items-center justify-between mb-3">
            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 font-rounded font-bold text-xs rounded-full">
              {current.season}
            </span>
            <span className="px-3 py-1 bg-amber-50 text-amber-800 font-rounded font-extrabold text-xs rounded-full border border-amber-200">
              {current.daysCount} Days
            </span>
          </div>

          {/* Picture Cue Emoji Button */}
          <button
            onClick={() => speakMonth(current)}
            className="w-32 h-32 rounded-3xl bg-slate-50 border-3 border-indigo-100 flex items-center justify-center text-7xl my-2 shadow-inner active:scale-95 transition-transform cursor-pointer"
          >
            <span>{current.cueEmoji}</span>
          </button>

          <span className="text-xs uppercase font-bold text-slate-500 mt-1">
            {current.cueName} • {current.cueHi}
          </span>

          {/* Month English and Hindi Names */}
          <h3 className="font-rounded font-extrabold text-4xl text-slate-900 mt-2 mb-0.5">
            {current.en}
          </h3>
          <span className="font-rounded font-bold text-2xl text-indigo-600 mb-3">
            {current.hi}
          </span>

          {/* Today's Month Badge */}
          {current.index === today.month0to11 + 1 && (
            <div className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full font-rounded font-bold text-xs inline-flex items-center gap-1">
              ✨ Current Month
            </div>
          )}
        </div>

        {/* Navigation Arrows */}
        <div className="flex items-center justify-between w-full px-4 py-3">
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

          <span className="font-rounded font-bold text-lg text-slate-800">
            {current.index} / {MONTHS.length}
          </span>

          <button
            onClick={() => {
              playTone('tap');
              if (index < MONTHS.length - 1) setIndex((i) => i + 1);
            }}
            disabled={index === MONTHS.length - 1}
            className="w-14 h-14 rounded-2xl bg-indigo-600 shadow-md text-white flex items-center justify-center disabled:opacity-30 active:scale-95 cursor-pointer"
          >
            <ChevronRight size={28} />
          </button>
        </div>
      </div>

      {/* Year Wheel Modal */}
      {showYearWheel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[2.5rem] p-5 max-w-[380px] w-full shadow-2xl border-4 border-indigo-300 relative text-center">
            <button
              onClick={() => setShowYearWheel(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-600 active:scale-90"
            >
              <X size={20} />
            </button>

            <h3 className="font-rounded font-bold text-2xl text-slate-900 mb-1">
              The Year Wheel 🎡
            </h3>
            <p className="font-rounded text-xs text-slate-500 mb-4">
              Tap any month to jump directly to it!
            </p>

            {/* 12 Months Grid */}
            <div className="grid grid-cols-3 gap-2 my-2">
              {MONTHS.map((m, idx) => {
                const isSelected = idx === index;
                const isCurrent = m.index === today.month0to11 + 1;

                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      playTone('tap');
                      setIndex(idx);
                      setShowYearWheel(false);
                    }}
                    className={`p-2 rounded-2xl flex flex-col items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-md scale-105'
                        : isCurrent
                        ? 'bg-amber-100 border-2 border-amber-400 text-amber-950 font-bold'
                        : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-xl mb-0.5">{m.cueEmoji}</span>
                    <span className="font-rounded font-bold text-xs truncate max-w-[75px]">
                      {m.en}
                    </span>
                    <span className="font-rounded text-[10px] opacity-80">
                      {m.hi}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
