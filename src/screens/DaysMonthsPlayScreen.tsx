import { useState } from 'react';
import { BackButton } from '@/components/BackButton';
import { TaraMascot } from '@/components/TaraMascot';
import { colors } from '@/theme';
import { playTone, useSpeech } from '@/hooks/useSpeech';
import type { ScreenName } from '@/types';
import { Sparkles, Star, ArrowRight } from 'lucide-react';

interface DaysMonthsPlayScreenProps {
  onBack: () => void;
  onNavigate: (screen: ScreenName) => void;
  level: 1 | 2 | 3;
  onChangeLevel: (lvl: 1 | 2 | 3) => void;
}

const GAMES = [
  {
    id: 'gameNextUp',
    title: 'Next Up',
    subtitle: 'What day or month comes next?',
    icon: '➡️',
    color: '#FF7043',
    route: 'gameNextUp' as ScreenName,
  },
  {
    id: 'gameOrderUp',
    title: 'Order Up',
    subtitle: 'Place days & months in order!',
    icon: '🧩',
    color: '#42A5F5',
    route: 'gameOrderUp' as ScreenName,
  },
  {
    id: 'gameYesterdayTomorrow',
    title: 'Yesterday & Tomorrow',
    subtitle: 'बीता हुआ कल & आने वाला कल',
    icon: '⏳',
    color: '#AB47BC',
    route: 'gameYesterdayTomorrow' as ScreenName,
  },
  {
    id: 'gameMonthPictureMatch',
    title: 'Month Picture Match',
    subtitle: 'Match kite, mango & rain to months',
    icon: '🖼️',
    color: '#26A69A',
    route: 'gameMonthPictureMatch' as ScreenName,
  },
];

export function DaysMonthsPlayScreen({
  onBack,
  onNavigate,
  level,
  onChangeLevel,
}: DaysMonthsPlayScreenProps) {
  const { speak } = useSpeech();

  return (
    <div
      className="flex flex-col h-full animate-fade-in select-none relative overflow-y-auto"
      style={{
        background: `linear-gradient(160deg, #FCE4EC 0%, #FFFFFF 50%, #EDE7F6 100%)`,
      }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between p-4 sticky top-0 bg-white/70 backdrop-blur-sm z-20 shadow-xs">
        <BackButton onClick={onBack} />
        <h2 className="font-rounded font-bold text-2xl text-slate-800">
          Days & Months Games
        </h2>
        <div className="w-8" />
      </div>

      <div className="p-4 flex flex-col gap-4 max-w-[420px] mx-auto w-full pb-8">
        {/* Level Selector */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex flex-col items-center text-center">
          <span className="font-rounded font-bold text-xs text-slate-500 uppercase mb-2">
            Choose Difficulty Level:
          </span>
          <div className="grid grid-cols-3 gap-2 w-full">
            {[
              { lvl: 1 as const, label: 'Level 1', stars: '⭐', desc: 'Age 3-4' },
              { lvl: 2 as const, label: 'Level 2', stars: '⭐⭐', desc: 'Age 4-5' },
              { lvl: 3 as const, label: 'Level 3', stars: '⭐⭐⭐', desc: 'Age 5-6' },
            ].map((item) => {
              const isSel = level === item.lvl;
              return (
                <button
                  key={item.lvl}
                  onClick={() => {
                    playTone('tap');
                    onChangeLevel(item.lvl);
                    speak(`${item.label}!`);
                  }}
                  className={`py-2 px-1 rounded-2xl flex flex-col items-center transition-all cursor-pointer ${
                    isSel
                      ? 'bg-amber-500 text-white shadow-md scale-105'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span className="text-xs">{item.stars}</span>
                  <span className="font-rounded font-bold text-xs mt-0.5">{item.label}</span>
                  <span className="text-[10px] opacity-80">{item.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4 Games Grid */}
        <div className="grid grid-cols-1 gap-3">
          {GAMES.map((game) => (
            <button
              key={game.id}
              onClick={() => {
                playTone('tap');
                speak(game.title);
                onNavigate(game.route);
              }}
              className="w-full p-4 rounded-3xl bg-white shadow-md border-2 border-slate-100 hover:scale-[1.02] active:scale-95 transition-all text-left flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div
                  className="w-13 h-13 rounded-2xl flex items-center justify-center text-3xl shadow-xs"
                  style={{ backgroundColor: game.color + '20' }}
                >
                  {game.icon}
                </div>
                <div>
                  <span className="font-rounded font-bold text-lg text-slate-800 block leading-tight">
                    {game.title}
                  </span>
                  <span className="font-rounded text-xs text-slate-500 line-clamp-1 mt-0.5">
                    {game.subtitle}
                  </span>
                </div>
              </div>
              <ArrowRight size={20} className="text-slate-400" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
