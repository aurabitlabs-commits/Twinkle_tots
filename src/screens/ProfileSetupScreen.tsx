import { useState } from 'react';
import { TaraMascot } from '@/components/TaraMascot';
import { colors } from '@/theme';
import { playTone, useSpeech } from '@/hooks/useSpeech';
import {
  AVATAR_OPTIONS,
  loadChildProfile,
  saveChildProfile,
  type ChildProfile,
} from '@/utils/profileStorage';
import { Sparkles, Check } from 'lucide-react';

interface ProfileSetupScreenProps {
  onComplete: () => void;
  isEditing?: boolean;
  onBack?: () => void;
}

export function ProfileSetupScreen({
  onComplete,
  isEditing = false,
  onBack,
}: ProfileSetupScreenProps) {
  const current = loadChildProfile();
  const [name, setName] = useState(current.name === 'Little Star' ? '' : current.name);
  const [ageGroup, setAgeGroup] = useState<ChildProfile['ageGroup']>(current.ageGroup);
  const [avatar, setAvatar] = useState(current.avatar);
  const [language, setLanguage] = useState<ChildProfile['preferredLanguage']>(current.preferredLanguage);
  const { speak } = useSpeech();

  const handleSave = () => {
    playTone('correct');
    const childName = name.trim() || 'Little Star';
    saveChildProfile({
      ...current,
      name: childName,
      ageGroup,
      avatar,
      preferredLanguage: language,
      isSetupCompleted: true,
    });
    speak(`Welcome, ${childName}! Let's learn and play!`);
    onComplete();
  };

  return (
    <div
      className="flex flex-col h-full animate-fade-in select-none overflow-y-auto px-4 py-6"
      style={{
        background: `linear-gradient(160deg, ${colors.pastels[0]} 0%, ${colors.pastels[1]} 50%, ${colors.pastels[3]} 100%)`,
      }}
    >
      <div className="max-w-[400px] w-full mx-auto flex flex-col items-center">
        {/* Header Mascot */}
        <div className="animate-bounce-gentle mb-2">
          <TaraMascot size={80} animation="idle" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-900 rounded-full font-rounded font-bold text-xs mb-2">
          <Sparkles size={14} /> {isEditing ? 'Edit Profile' : 'Child Profile Setup'}
        </div>

        <h2 className="font-rounded font-bold text-3xl text-amber-950 text-center mb-1">
          {isEditing ? 'Child Profile' : 'Who is learning today?'}
        </h2>
        <p className="font-rounded text-sm text-slate-600 text-center mb-5">
          Tara will personalize greetings and encouragement!
        </p>

        {/* Form Card */}
        <div className="w-full bg-white/95 rounded-[2rem] p-5 shadow-xl border-3 border-amber-200 flex flex-col gap-4">
          {/* Avatar Picker */}
          <div>
            <label className="font-rounded font-bold text-sm text-slate-700 block mb-2 text-center">
              Choose Avatar:
            </label>
            <div className="grid grid-cols-4 gap-2.5">
              {AVATAR_OPTIONS.map((opt) => {
                const isSelected = avatar === opt.emoji;
                return (
                  <button
                    key={opt.id}
                    onClick={() => {
                      playTone('pop');
                      setAvatar(opt.emoji);
                    }}
                    className={`aspect-square rounded-2xl flex flex-col items-center justify-center text-3xl transition-transform active:scale-90 ${
                      isSelected
                        ? 'bg-amber-100 border-3 border-amber-500 scale-105 shadow-md'
                        : 'bg-slate-50 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>{opt.emoji}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Child Name */}
          <div>
            <label className="font-rounded font-bold text-sm text-slate-700 block mb-1">
              Child's Name:
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Aarav, Ananya, Leo"
              maxLength={20}
              className="w-full px-4 py-3 rounded-2xl font-rounded font-bold text-lg bg-amber-50/60 border-2 border-amber-200 focus:outline-none focus:border-amber-500 text-slate-800"
            />
          </div>

          {/* Age Group */}
          <div>
            <label className="font-rounded font-bold text-sm text-slate-700 block mb-1">
              Age Group:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['3-4', '4-5', '5-6'] as const).map((ag) => (
                <button
                  key={ag}
                  onClick={() => {
                    playTone('tap');
                    setAgeGroup(ag);
                  }}
                  className={`py-2 px-2 rounded-xl font-rounded font-bold text-sm transition-all ${
                    ageGroup === ag
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Age {ag}
                </button>
              ))}
            </div>
          </div>

          {/* Preferred Language */}
          <div>
            <label className="font-rounded font-bold text-sm text-slate-700 block mb-1">
              Voice Language:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'both', label: 'Both / दोनों' },
                { id: 'en', label: 'English' },
                { id: 'hi', label: 'हिन्दी' },
              ].map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => {
                    playTone('tap');
                    setLanguage(lang.id as 'both' | 'en' | 'hi');
                  }}
                  className={`py-2 px-1 rounded-xl font-rounded font-bold text-xs transition-all ${
                    language === lang.id
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="w-full mt-2 py-3.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-rounded font-bold text-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{isEditing ? 'Save Changes' : "Let's Play!"}</span>
            <Check size={22} />
          </button>

          {isEditing && onBack && (
            <button
              onClick={onBack}
              className="text-xs font-rounded font-bold text-slate-500 hover:text-slate-800 text-center py-1"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
