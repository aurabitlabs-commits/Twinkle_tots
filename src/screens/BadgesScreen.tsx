import { useState } from 'react';
import { BackButton } from '@/components/BackButton';
import { colors } from '@/theme';
import { playTone, useSpeech } from '@/hooks/useSpeech';
import {
  BADGE_DEFINITIONS,
  loadChildProfile,
  saveChildProfile,
  type ChildProfile,
} from '@/utils/profileStorage';
import { TaraMascot } from '@/components/TaraMascot';
import { Trophy, Award, Lock, Sparkles } from 'lucide-react';

interface BadgesScreenProps {
  onBack: () => void;
}

export function BadgesScreen({ onBack }: BadgesScreenProps) {
  const [profile, setProfile] = useState<ChildProfile>(() => loadChildProfile());
  const { speak } = useSpeech();

  const earnedSet = new Set(profile.earnedBadges);

  const handleSelectCostume = (costume: string) => {
    playTone('pop');
    const updated = { ...profile, taraCostume: costume };
    setProfile(updated);
    saveChildProfile(updated);
    speak(`Tara loves this look!`);
  };

  return (
    <div
      className="flex flex-col h-full animate-fade-in select-none overflow-y-auto"
      style={{
        background: `linear-gradient(160deg, ${colors.pastels[0]} 0%, ${colors.pastels[3]} 100%)`,
      }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between p-4 sticky top-0 bg-white/70 backdrop-blur-sm z-10 shadow-xs">
        <BackButton onClick={onBack} />
        <h2 className="font-rounded font-bold text-2xl" style={{ color: colors.ink }}>
          My Trophies & Badges
        </h2>
        <div className="w-8" />
      </div>

      <div className="p-4 flex flex-col gap-4 max-w-[420px] mx-auto w-full pb-8">
        {/* Child Avatar & Name Banner */}
        <div className="bg-white rounded-3xl p-4 shadow-md border border-amber-200 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center text-4xl shadow-xs">
            {profile.avatar}
          </div>
          <div>
            <h3 className="font-rounded font-bold text-2xl text-slate-800">
              {profile.name}
            </h3>
            <span className="font-rounded text-xs text-amber-700 font-bold bg-amber-50 px-2.5 py-0.5 rounded-full inline-block">
              🏆 {earnedSet.size} of {BADGE_DEFINITIONS.length} Badges Unlocked
            </span>
          </div>
        </div>

        {/* Tara Dress-Up / Customization */}
        <div className="bg-white rounded-3xl p-4 shadow-md border border-slate-100">
          <span className="font-rounded font-bold text-sm text-slate-700 block mb-2">
            ✨ Tara's Accessories:
          </span>
          <div className="flex justify-around items-center pt-1">
            {[
              { id: 'classic', label: 'Classic', icon: '⭐' },
              { id: 'crown', label: 'Crown', icon: '👑' },
              { id: 'cap', label: 'Cap', icon: '🧢' },
              { id: 'glasses', label: 'Glasses', icon: '👓' },
            ].map((acc) => {
              const isSel = profile.taraCostume === acc.id;
              return (
                <button
                  key={acc.id}
                  onClick={() => handleSelectCostume(acc.id)}
                  className={`p-2.5 rounded-2xl flex flex-col items-center gap-1 transition-transform active:scale-95 ${
                    isSel
                      ? 'bg-amber-100 border-2 border-amber-500 shadow-sm scale-105'
                      : 'bg-slate-50 border border-slate-200'
                  }`}
                >
                  <span className="text-2xl">{acc.icon}</span>
                  <span className="font-rounded text-[11px] font-bold text-slate-700">
                    {acc.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Badges Grid */}
        <div className="bg-white rounded-3xl p-4 shadow-md border border-slate-100">
          <span className="font-rounded font-bold text-sm text-slate-700 block mb-3">
            Trophy Showcase
          </span>
          <div className="grid grid-cols-2 gap-3">
            {BADGE_DEFINITIONS.map((badge) => {
              const isEarned = earnedSet.has(badge.id);

              return (
                <div
                  key={badge.id}
                  className={`p-3 rounded-2xl border flex flex-col items-center text-center transition-all ${
                    isEarned
                      ? 'bg-amber-50/70 border-amber-300 shadow-xs'
                      : 'bg-slate-50 border-slate-200 opacity-50'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-1 ${
                      isEarned ? 'bg-amber-200 shadow-xs' : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    {isEarned ? badge.icon : <Lock size={20} />}
                  </div>
                  <span className="font-rounded font-bold text-sm text-slate-800 line-clamp-1">
                    {badge.title}
                  </span>
                  <span className="font-rounded text-[10px] text-slate-500 line-clamp-2 mt-0.5">
                    {badge.desc}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
