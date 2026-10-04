import { useState, useEffect } from 'react';
import { BackButton } from '@/components/BackButton';
import { TaraMascot } from '@/components/TaraMascot';
import { colors } from '@/theme';
import { playTone, useSpeech } from '@/hooks/useSpeech';
import { orderedDays, todayInfo, type DayItem } from '@/utils/calendar';
import { Volume2, Sparkles, Star, Play, Flag } from 'lucide-react';

interface DaysLearnScreenProps {
  onBack: () => void;
  weekStart?: 'sun' | 'mon';
  markCardSeen?: (id: string) => void;
  voiceLang?: 'en' | 'hi' | 'both';
}

export function DaysLearnScreen({
  onBack,
  weekStart = 'sun',
  markCardSeen,
  voiceLang = 'both',
}: DaysLearnScreenProps) {
  const days = orderedDays(weekStart);
  const today = todayInfo();
  const { speak, stop } = useSpeech();

  const [activeDayId, setActiveDayId] = useState<string | null>(null);
  const [isPlayingWeek, setIsPlayingWeek] = useState(false);
  const [taraReaction, setTaraReaction] = useState<'idle' | 'cheer'>('idle');

  // Today Banner text
  const isHi = voiceLang === 'hi';
  const todayBannerText = isHi
    ? `आज ${today.dayItem.hi} है! ✨`
    : voiceLang === 'both'
    ? `Today is ${today.dayItem.en}! आज ${today.dayItem.hi} है! ✨`
    : `Today is ${today.dayItem.en}! ✨`;

  useEffect(() => {
    // Initial friendly greeting
    speak(todayBannerText);
  }, []);

  const handleDayTap = (day: DayItem, index: number) => {
    playTone('pop');
    setActiveDayId(day.id);
    setTaraReaction('cheer');
    markCardSeen?.(`day_${day.id}`);

    const speech =
      voiceLang === 'hi'
        ? day.hi
        : voiceLang === 'both'
        ? `${day.en}... ${day.hi}`
        : day.en;

    speak(speech);

    setTimeout(() => {
      setActiveDayId(null);
      setTaraReaction('idle');
    }, 1200);
  };

  const handleSayTheWeek = async () => {
    if (isPlayingWeek) return;
    setIsPlayingWeek(true);
    playTone('tap');

    for (let i = 0; i < days.length; i++) {
      const d = days[i];
      setActiveDayId(d.id);
      const text = voiceLang === 'hi' ? d.hi : voiceLang === 'both' ? `${d.en}, ${d.hi}` : d.en;
      speak(text);
      await new Promise((res) => setTimeout(res, 1200));
    }

    setActiveDayId(null);
    setIsPlayingWeek(false);
    playTone('win');
  };

  return (
    <div
      className="flex flex-col h-full animate-fade-in select-none relative overflow-y-auto"
      style={{
        background: `linear-gradient(160deg, #FFF9C4 0%, #FFFFFF 50%, #E1F5FE 100%)`,
      }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between p-4 sticky top-0 bg-white/70 backdrop-blur-sm z-20 shadow-xs">
        <BackButton
          onClick={() => {
            stop();
            onBack();
          }}
        />
        <h2 className="font-rounded font-bold text-2xl text-slate-800">
          Days of the Week
        </h2>
        <div className="w-8" />
      </div>

      <div className="p-4 flex flex-col gap-3.5 max-w-[420px] mx-auto w-full pb-8">
        {/* Today's Mascot Banner */}
        <div className="bg-white rounded-3xl p-4 shadow-md border-3 border-amber-300 flex items-center gap-3.5">
          <TaraMascot size={64} animation={taraReaction} />
          <div>
            <span className="text-[11px] uppercase font-bold text-amber-700 tracking-wide block">
              Today is:
            </span>
            <h3 className="font-rounded font-extrabold text-2xl text-amber-950 leading-tight">
              {today.dayItem.en}
            </h3>
            <span className="font-rounded text-sm text-slate-600 font-bold">
              {today.dayItem.hi}
            </span>
          </div>
        </div>

        {/* Action Button: Say the Week */}
        <button
          onClick={handleSayTheWeek}
          disabled={isPlayingWeek}
          className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-rounded font-bold text-base shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          <Play size={18} />
          <span>{isPlayingWeek ? 'Speaking the week...' : 'Say the Week! (सुनो)'}</span>
        </button>

        {/* 7 Days Cards */}
        <div className="flex flex-col gap-2.5">
          {days.map((day, idx) => {
            const isToday = day.index === today.dayOfWeekIndex;
            const isWeekend = day.index === 0 || day.index === 6;
            const isActive = activeDayId === day.id;

            return (
              <button
                key={day.id}
                onClick={() => handleDayTap(day, idx)}
                className={`w-full p-3.5 rounded-2xl flex items-center justify-between shadow-sm transition-all duration-200 cursor-pointer ${
                  isActive ? 'scale-105 shadow-lg ring-4 ring-amber-400' : 'hover:scale-[1.01]'
                }`}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderLeft: `8px solid ${day.color}`,
                }}
              >
                <div className="flex items-center gap-3">
                  {/* Order Number Badge */}
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center font-rounded font-extrabold text-base text-white shadow-xs"
                    style={{ backgroundColor: day.color }}
                  >
                    {idx + 1}
                  </div>

                  <div className="text-left">
                    <span className="font-rounded font-extrabold text-xl text-slate-900 block leading-tight">
                      {day.en}
                    </span>
                    <span className="font-rounded font-bold text-sm text-slate-500">
                      {day.hi}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isToday && (
                    <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full font-rounded font-extrabold text-[11px] flex items-center gap-1 border border-amber-300 animate-pulse">
                      <Star size={12} className="fill-amber-500 text-amber-500" />
                      Today
                    </span>
                  )}

                  {isWeekend && (
                    <span className="px-2 py-0.5 bg-rose-50 text-rose-600 rounded-lg text-[10px] font-bold flex items-center gap-0.5">
                      <Flag size={10} /> Holiday
                    </span>
                  )}

                  <Volume2 size={20} className="text-slate-400 ml-1" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
