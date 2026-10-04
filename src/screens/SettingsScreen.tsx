import { useState } from 'react';
import { BackButton } from '@/components/BackButton';
import { colors } from '@/theme';
import { playTone } from '@/hooks/useSpeech';
import { isPlusOwned, setPlusOwned } from '@/utils/entitlements';
import { loadChildProfile } from '@/utils/profileStorage';
import type { AppSettings } from '@/types';
import {
  Volume2,
  Mic,
  RotateCcw,
  Sparkles,
  BarChart2,
  Clock,
  Languages,
  User,
} from 'lucide-react';

interface SettingsScreenProps {
  onBack: () => void;
  settings: AppSettings & { voiceLang?: 'en' | 'hi' | 'both'; playTimeLimit?: number };
  onToggle: (key: string) => void;
  onSetSetting?: (key: string, value: unknown) => void;
  onResetStars: () => void;
  onOpenProgress?: () => void;
  onOpenPaywall?: () => void;
  onEditProfile?: () => void;
}

export function SettingsScreen({
  onBack,
  settings,
  onToggle,
  onSetSetting,
  onResetStars,
  onOpenProgress,
  onOpenPaywall,
  onEditProfile,
}: SettingsScreenProps) {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const plusOwned = isPlusOwned();
  const profile = loadChildProfile();
  const voiceLang = settings.voiceLang || 'both';
  const playTimeLimit = settings.playTimeLimit ?? 0;

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
          Parent Corner
        </h2>
        <div className="w-8" />
      </div>

      <div className="p-4 flex flex-col gap-3.5 max-w-[420px] mx-auto w-full pb-8">
        {/* Child Profile Overview & Edit */}
        {onEditProfile && (
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-3xl">
                {profile.avatar}
              </div>
              <div>
                <span className="font-rounded font-bold text-base text-slate-800 block">
                  {profile.name} (Age {profile.ageGroup})
                </span>
                <span className="text-xs text-slate-500">
                  Child profile & avatar
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                playTone('tap');
                onEditProfile();
              }}
              className="px-3.5 py-1.5 bg-amber-500 text-white rounded-xl font-rounded font-bold text-xs shadow-xs active:scale-95 cursor-pointer"
            >
              Edit
            </button>
          </div>
        )}

        {/* Progress Report Card */}
        {onOpenProgress && (
          <button
            onClick={() => {
              playTone('tap');
              onOpenProgress();
            }}
            className="w-full p-4 rounded-3xl bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md flex items-center justify-between transition-transform active:scale-95 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                <BarChart2 size={24} />
              </div>
              <div className="text-left">
                <span className="font-rounded font-bold text-lg block">Child Progress Report</span>
                <span className="text-xs opacity-90">Streaks, topic rings & mastery</span>
              </div>
            </div>
            <span className="text-xl">➔</span>
          </button>
        )}

        {/* Plus Status Card */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-900">
              <Sparkles size={20} />
            </div>
            <div>
              <span className="font-rounded font-bold text-base text-slate-800 block">
                Twinkle Tots Plus
              </span>
              <span className="text-xs text-slate-500">
                {plusOwned ? '✓ Family Lifetime Unlocked' : '5 Bonus packs locked'}
              </span>
            </div>
          </div>
          {!plusOwned && onOpenPaywall && (
            <button
              onClick={() => {
                playTone('tap');
                onOpenPaywall();
              }}
              className="px-4 py-2 bg-amber-500 text-white rounded-2xl font-rounded font-bold text-xs shadow-xs active:scale-95"
            >
              Unlock
            </button>
          )}
        </div>

        {/* Voice Language Switcher */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-2">
            <Languages size={18} className="text-amber-600" />
            <span className="font-rounded font-bold text-base text-slate-800">
              Voice Language
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { key: 'both', label: 'Both / दोनों' },
              { key: 'en', label: 'English' },
              { key: 'hi', label: 'हिन्दी' },
            ].map((vl) => (
              <button
                key={vl.key}
                onClick={() => {
                  playTone('tap');
                  onSetSetting?.('voiceLang', vl.key);
                }}
                className={`py-2 px-1 rounded-2xl font-rounded font-bold text-xs transition-all ${
                  voiceLang === vl.key
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {vl.label}
              </button>
            ))}
          </div>
        </div>

        {/* Week Start Day Setting */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">📅</span>
            <span className="font-rounded font-bold text-base text-slate-800">
              Week Starts On
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { key: 'sun', label: 'Sunday / रविवार' },
              { key: 'mon', label: 'Monday / सोमवार' },
            ].map((ws) => {
              const isSel = (settings.weekStart || 'sun') === ws.key;
              return (
                <button
                  key={ws.key}
                  onClick={() => {
                    playTone('tap');
                    onSetSetting?.('weekStart', ws.key);
                  }}
                  className={`py-2 px-2 rounded-2xl font-rounded font-bold text-xs transition-all ${
                    isSel
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {ws.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Play-Time Daily Limit */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={18} className="text-blue-600" />
            <span className="font-rounded font-bold text-base text-slate-800">
              Play-Time Daily Limit
            </span>
          </div>
          <div className="grid grid-cols-5 gap-1.5">
            {[
              { min: 0, label: 'Off' },
              { min: 15, label: '15m' },
              { min: 30, label: '30m' },
              { min: 45, label: '45m' },
              { min: 60, label: '60m' },
            ].map((lim) => (
              <button
                key={lim.min}
                onClick={() => {
                  playTone('tap');
                  onSetSetting?.('playTimeLimit', lim.min);
                }}
                className={`py-2 rounded-2xl font-rounded font-bold text-xs transition-all ${
                  playTimeLimit === lim.min
                    ? 'bg-blue-500 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {lim.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sound Effects Toggle */}
        <div
          onClick={() => onToggle('soundEffects')}
          className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Volume2 size={20} className="text-amber-600" />
            <span className="font-rounded font-bold text-base text-slate-800">
              Sound Effects
            </span>
          </div>
          <div
            className={`w-12 h-6 rounded-full transition-colors flex items-center p-0.5 ${
              settings.soundEffects ? 'bg-green-500' : 'bg-slate-200'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-xs transform transition-transform ${
                settings.soundEffects ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </div>
        </div>

        {/* Voice Speech Toggle */}
        <div
          onClick={() => onToggle('voice')}
          className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Mic size={20} className="text-amber-600" />
            <span className="font-rounded font-bold text-base text-slate-800">
              Voice Pronunciation
            </span>
          </div>
          <div
            className={`w-12 h-6 rounded-full transition-colors flex items-center p-0.5 ${
              settings.voice ? 'bg-green-500' : 'bg-slate-200'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-xs transform transition-transform ${
                settings.voice ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </div>
        </div>

        {/* Reset Stars */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100">
          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="w-full flex items-center justify-between text-red-500 font-rounded font-bold text-sm cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <RotateCcw size={18} />
                <span>Reset Stars & Progress</span>
              </div>
              <span>➔</span>
            </button>
          ) : (
            <div className="flex flex-col gap-2 text-center">
              <span className="font-rounded text-xs text-red-700 font-bold">
                Reset all total stars back to 0?
              </span>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => {
                    onResetStars();
                    setShowResetConfirm(false);
                  }}
                  className="px-4 py-1.5 bg-red-500 text-white rounded-xl font-rounded font-bold text-xs"
                >
                  Yes, Reset
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-4 py-1.5 bg-slate-200 text-slate-700 rounded-xl font-rounded font-bold text-xs"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Support & Privacy */}
        <div className="text-center pt-2">
          <p className="font-rounded text-xs text-slate-500">
            Twinkle Tots • Offline & Family Safe • v2.0
          </p>
        </div>
      </div>
    </div>
  );
}
