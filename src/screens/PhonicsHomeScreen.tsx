import { BackButton } from '@/components/BackButton';
import { TaraMascot } from '@/components/TaraMascot';
import { colors } from '@/theme';
import { playTone, useSpeech } from '@/hooks/useSpeech';
import { loadChildProfile } from '@/utils/profileStorage';
import type { ScreenName } from '@/types';
import { Volume2, Sparkles, Search, Layers, Edit3, Home, Gamepad2 } from 'lucide-react';

interface PhonicsHomeScreenProps {
  onBack: () => void;
  onNavigate: (screen: ScreenName) => void;
}

const PHONICS_CARDS = [
  {
    id: 'letterSounds',
    title: 'Letter Sounds',
    subtitle: 'Name vs Sound (A ➔ /æ/)',
    icon: '🗣️',
    color: '#FF7043',
    route: 'letterSounds' as ScreenName,
  },
  {
    id: 'listenFind',
    title: 'Listen & Find',
    subtitle: 'Which word starts with...?',
    icon: '👂',
    color: '#42A5F5',
    route: 'beginningSound' as ScreenName,
  },
  {
    id: 'blendSounds',
    title: 'Blend Sounds',
    subtitle: 'C + A + T ➔ CAT',
    icon: '🔗',
    color: '#AB47BC',
    route: 'soundBlending' as ScreenName,
  },
  {
    id: 'spellWord',
    title: 'Spell the Word',
    subtitle: 'Tap letters to spell',
    icon: '✏️',
    color: '#26A69A',
    route: 'spellingActivity' as ScreenName,
  },
  {
    id: 'wordFamilies',
    title: 'Word Families',
    subtitle: 'Rhyming houses (-at, -an)',
    icon: '🏡',
    color: '#FFA726',
    route: 'wordFamilies' as ScreenName,
  },
  {
    id: 'phonicsGames',
    title: 'Phonics Games',
    subtitle: 'Missing sound & sound hunt',
    icon: '🎮',
    color: '#EC407A',
    route: 'phonicsGames' as ScreenName,
  },
];

export function PhonicsHomeScreen({ onBack, onNavigate }: PhonicsHomeScreenProps) {
  const { speak } = useSpeech();
  const profile = loadChildProfile();

  return (
    <div
      className="flex flex-col h-full animate-fade-in select-none overflow-y-auto"
      style={{
        background: `linear-gradient(160deg, #E0F7FA 0%, #FFF9C4 50%, #FFE0B2 100%)`,
      }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between p-4 sticky top-0 bg-white/70 backdrop-blur-sm z-10 shadow-xs">
        <BackButton onClick={onBack} />
        <h2 className="font-rounded font-bold text-2xl text-slate-800">
          Phonics & Sounds
        </h2>
        <div className="w-8" />
      </div>

      <div className="p-4 flex flex-col gap-4 max-w-[420px] mx-auto w-full pb-8">
        {/* Tara Mascot Greeting Banner */}
        <div className="bg-white rounded-3xl p-4 shadow-md border-2 border-amber-200 flex items-center gap-3.5">
          <div className="animate-bounce-gentle">
            <TaraMascot size={64} animation="idle" />
          </div>
          <div>
            <h3 className="font-rounded font-bold text-xl text-amber-950">
              Hi {profile.name}! ✨
            </h3>
            <p className="font-rounded text-xs text-slate-600">
              Letters have names AND sounds! Let's explore together!
            </p>
          </div>
        </div>

        {/* 6 Large Phonics Cards */}
        <div className="grid grid-cols-2 gap-3.5">
          {PHONICS_CARDS.map((card) => (
            <button
              key={card.id}
              onClick={() => {
                playTone('tap');
                speak(card.title);
                onNavigate(card.route);
              }}
              className="rounded-3xl p-4 bg-white shadow-md border-2 border-slate-100 hover:scale-[1.03] active:scale-95 transition-all text-left flex flex-col justify-between min-h-[140px] cursor-pointer"
            >
              <div
                className="w-13 h-13 rounded-2xl flex items-center justify-center text-3xl shadow-2xs mb-2"
                style={{ backgroundColor: card.color + '20' }}
              >
                {card.icon}
              </div>
              <div>
                <span className="font-rounded font-bold text-base text-slate-900 block leading-tight">
                  {card.title}
                </span>
                <span className="font-rounded text-[11px] text-slate-500 font-semibold line-clamp-1 mt-0.5">
                  {card.subtitle}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
