import { useState } from 'react';
import { BackButton } from '@/components/BackButton';
import { colors } from '@/theme';
import { playTone, useSpeech } from '@/hooks/useSpeech';
import { isUnlocked, isPlusOwned } from '@/utils/entitlements';
import { Lock, Sparkles, Play } from 'lucide-react';
import type { ScreenName } from '@/types';

interface PlusPacksScreenProps {
  onBack: () => void;
  onNavigate: (screen: ScreenName) => void;
  onOpenPaywall: () => void;
}

const PACKS = [
  { id: 'plus_animals', title: 'Animals & Sounds', titleHi: 'जानवर और आवाज़ें', icon: '🦁', color: '#FF7043', route: 'animalsMenu' as ScreenName },
  { id: 'plus_fruits_veg', title: 'Fruits & Veggies', titleHi: 'फल और सब्ज़ियाँ', icon: '🍓', color: '#43A047', route: 'fruitsMenu' as ScreenName },
  { id: 'plus_vehicles', title: 'Vehicles & Sounds', titleHi: 'गाड़ियाँ और हॉर्न', icon: '🚗', color: '#1E88E5', route: 'vehiclesMenu' as ScreenName },
  { id: 'plus_body', title: 'My Body', titleHi: 'मेरा शरीर', icon: '🧒', color: '#AB47BC', route: 'bodyActivity' as ScreenName },
  { id: 'plus_ginti', title: 'Hindi Ginti 1-20', titleHi: 'हिन्दी गिनती १-२०', icon: '🔟', color: '#FFA726', route: 'hindiGinti' as ScreenName },
];

export function PlusPacksScreen({
  onBack,
  onNavigate,
  onOpenPaywall,
}: PlusPacksScreenProps) {
  const { speak } = useSpeech();
  const plusOwned = isPlusOwned();

  const handlePackClick = (pack: typeof PACKS[0]) => {
    const unlocked = isUnlocked(pack.id, 0); // sample items check
    if (unlocked || plusOwned) {
      playTone('tap');
      speak(pack.title);
      onNavigate(pack.route);
    } else {
      playTone('wrong');
      speak('Ask a grown-up!');
      onOpenPaywall();
    }
  };

  return (
    <div
      className="flex flex-col h-full animate-fade-in select-none overflow-y-auto"
      style={{
        background: `linear-gradient(160deg, ${colors.pastels[0]} 0%, ${colors.pastels[4]} 100%)`,
      }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between p-4 sticky top-0 bg-white/70 backdrop-blur-sm z-10 shadow-xs">
        <BackButton onClick={onBack} />
        <h2 className="font-rounded font-bold text-2xl" style={{ color: colors.ink }}>
          Bonus Packs
        </h2>
        {!plusOwned ? (
          <button
            onClick={onOpenPaywall}
            className="flex items-center gap-1 px-3 py-1.5 bg-amber-500 text-white rounded-full font-rounded font-bold text-xs shadow-sm active:scale-95"
          >
            <Sparkles size={14} /> Plus
          </button>
        ) : (
          <span className="text-xs font-bold text-green-700 bg-green-100 px-3 py-1 rounded-full">
            ✓ Plus Unlocked
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col gap-4 max-w-[420px] mx-auto w-full pb-8">
        {PACKS.map((pack) => {
          const unlocked = isUnlocked(pack.id, 0);

          return (
            <button
              key={pack.id}
              onClick={() => handlePackClick(pack)}
              className="rounded-3xl p-5 bg-white/95 hover:bg-white border-2 border-amber-200/80 shadow-md flex items-center gap-4 transition-transform active:scale-95 text-left cursor-pointer relative overflow-hidden"
            >
              <div
                className="w-18 h-18 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0 shadow-xs"
                style={{ backgroundColor: pack.color + '20' }}
              >
                {pack.icon}
              </div>
              <div className="flex-1">
                <span className="font-rounded font-bold text-xl text-slate-900 block">
                  {pack.title}
                </span>
                <span className="font-rounded text-sm font-semibold text-slate-500 block">
                  {pack.titleHi}
                </span>
                {!plusOwned && (
                  <span className="text-[11px] font-bold text-amber-700 mt-1 inline-block bg-amber-50 px-2 py-0.5 rounded-md">
                    ⭐ Free 3 Samples
                  </span>
                )}
              </div>

              {!unlocked && !plusOwned ? (
                <div className="p-3 rounded-2xl bg-amber-100 text-amber-900">
                  <Lock size={20} />
                </div>
              ) : (
                <div className="p-3 rounded-2xl bg-slate-100 text-slate-700">
                  <Play size={20} />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
