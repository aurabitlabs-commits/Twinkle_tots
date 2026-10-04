import { BackButton } from '@/components/BackButton';
import { TaraMascot } from '@/components/TaraMascot';
import { colors } from '@/theme';
import { playTone, useSpeech } from '@/hooks/useSpeech';
import type { ScreenName } from '@/types';
import { Sun, Calendar as CalendarIcon, Compass, Gamepad2, ArrowRight } from 'lucide-react';

interface DaysMonthsMenuScreenProps {
  onBack: () => void;
  onNavigate: (screen: ScreenName) => void;
}

export function DaysMonthsMenuScreen({
  onBack,
  onNavigate,
}: DaysMonthsMenuScreenProps) {
  const { speak } = useSpeech();

  const MENU_ITEMS = [
    {
      id: 'days',
      title: 'Days of the Week',
      subtitle: 'दिनों के नाम (सोमवार, मंगलवार...)',
      icon: '☀️',
      color: '#F59E0B',
      route: 'daysLearn' as ScreenName,
    },
    {
      id: 'months',
      title: 'Months of the Year',
      subtitle: 'महीनों के नाम (जनवरी, फ़रवरी...)',
      icon: '🗓️',
      color: '#3B82F6',
      route: 'monthsLearn' as ScreenName,
    },
    {
      id: 'calendar',
      title: 'My Calendar',
      subtitle: 'कैलेंडर (Today, dates & days)',
      icon: '📆',
      color: '#10B981',
      route: 'calendarScreen' as ScreenName,
    },
    {
      id: 'play',
      title: 'Play Games',
      subtitle: 'Next Up, Order Up & Yesterday/Tomorrow',
      icon: '🎮',
      color: '#EC407A',
      route: 'daysMonthsPlay' as ScreenName,
    },
  ];

  return (
    <div
      className="flex flex-col h-full animate-fade-in select-none relative overflow-y-auto"
      style={{
        background: `linear-gradient(160deg, #E3F2FD 0%, #FFF9C4 50%, #EDE7F6 100%)`,
      }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between p-4 sticky top-0 bg-white/70 backdrop-blur-sm z-20 shadow-xs">
        <BackButton onClick={onBack} />
        <h2 className="font-rounded font-bold text-2xl text-slate-800">
          Days & Months
        </h2>
        <div className="w-8" />
      </div>

      <div className="p-4 flex flex-col gap-4 max-w-[420px] mx-auto w-full pb-8">
        {/* Banner with Tara */}
        <div className="bg-white rounded-3xl p-4 shadow-md border-3 border-amber-300 flex items-center gap-3.5">
          <div className="animate-bounce-gentle">
            <TaraMascot size={64} animation="idle" />
          </div>
          <div>
            <h3 className="font-rounded font-extrabold text-xl text-amber-950">
              दिन और महीने ✨
            </h3>
            <p className="font-rounded text-xs text-slate-600">
              Learn the 7 days, 12 months, real calendar & fun games!
            </p>
          </div>
        </div>

        {/* 4 Menu Cards */}
        <div className="flex flex-col gap-3">
          {MENU_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                playTone('tap');
                speak(item.title);
                onNavigate(item.route);
              }}
              className="w-full p-4 rounded-3xl bg-white shadow-md border-2 border-slate-100 hover:scale-[1.02] active:scale-95 transition-all text-left flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div
                  className="w-13 h-13 rounded-2xl flex items-center justify-center text-3xl shadow-xs"
                  style={{ backgroundColor: item.color + '20' }}
                >
                  {item.icon}
                </div>
                <div>
                  <span className="font-rounded font-bold text-lg text-slate-900 block leading-tight">
                    {item.title}
                  </span>
                  <span className="font-rounded text-xs text-slate-500 font-semibold line-clamp-1 mt-0.5">
                    {item.subtitle}
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
