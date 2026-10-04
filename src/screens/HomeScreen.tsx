import { useState } from 'react';
import { StarCounter } from '@/components/StarCounter';
import { LockButton } from '@/components/LockButton';
import { TaraMascot } from '@/components/TaraMascot';
import { LearningWorldCard } from '@/components/LearningWorldCard';
import { colors } from '@/theme';
import { useSpeech, playTone } from '@/hooks/useSpeech';
import { isPlusOwned } from '@/utils/entitlements';
import { loadChildProfile } from '@/utils/profileStorage';
import type { ScreenName } from '@/types';
import { BookOpen, Music, Sparkles, Trophy, Edit3, Gamepad2, Compass } from 'lucide-react';

interface HomeScreenProps {
  stars: number;
  onNavigate: (screen: ScreenName) => void;
  onOpenPaywall: () => void;
  onOpenAdventure: () => void;
}

export function HomeScreen({
  stars,
  onNavigate,
  onOpenPaywall,
  onOpenAdventure,
}: HomeScreenProps) {
  const [activeTab, setActiveTab] = useState<'learn' | 'songs' | 'stories'>('learn');
  const [taraAnimation, setTaraAnimation] = useState<'idle' | 'bounce' | 'cheer'>('idle');
  const [greeting, setGreeting] = useState<string>("Hi, little star! ⭐ Ready to play?");
  const { speak } = useSpeech();
  const plusOwned = isPlusOwned();
  const profile = loadChildProfile();

  const handleTaraClick = () => {
    playTone('pop');
    setTaraAnimation('cheer');
    setGreeting("Yay! Let's explore together! 🎈");
    speak("Hi little star! Let's learn and play!");
    setTimeout(() => setTaraAnimation('idle'), 1800);
  };

  return (
    <div
      className="flex flex-col h-full animate-fade-in overflow-hidden select-none relative"
      style={{
        background: `linear-gradient(170deg, #E8F4F8 0%, #FFF9E6 50%, #FFF3EB 100%)`,
      }}
    >
      {/* Top Bar: Brand, Reward Capsule & Controls */}
      <div className="flex items-center justify-between p-3.5 sticky top-0 z-20 backdrop-blur-xs bg-white/60 shadow-2xs">
        {/* Child Avatar & Brand Badge */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              playTone('tap');
              onNavigate('badgesScreen');
            }}
            className="flex items-center gap-1.5 p-1.5 pr-2.5 bg-white rounded-full shadow-xs border border-amber-200 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
          >
            <span className="text-xl">{profile.avatar}</span>
            <span className="font-rounded font-extrabold text-[11px] text-slate-800 line-clamp-1 max-w-[70px]">
              {profile.name}
            </span>
            <Trophy size={13} className="text-amber-500" />
          </button>

          {/* Twinkle Tots Brand Pill */}
          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 bg-white/80 rounded-full border border-amber-300 shadow-2xs">
            <Sparkles size={12} className="text-amber-500" />
            <span className="font-rounded font-black text-[10px] text-amber-700 tracking-wider">
              TWINKLE TOTS
            </span>
          </div>
        </div>

        {/* Star Reward Capsule */}
        <StarCounter count={stars} />

        {/* Plus & Lock */}
        <div className="flex items-center gap-2">
          {!plusOwned ? (
            <button
              onClick={onOpenPaywall}
              className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full font-rounded font-bold text-xs shadow-sm active:scale-95 cursor-pointer"
            >
              <Sparkles size={13} /> Plus
            </button>
          ) : (
            <span className="text-[11px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
              ⭐ Plus
            </span>
          )}

          <LockButton onClick={() => onNavigate('parentGate')} />
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {activeTab === 'learn' && (
          <div className="flex flex-col pb-6">
            {/* Mascot Hero & Living Greeting */}
            <div className="flex flex-col items-center justify-center mt-2 px-4 text-center">
              {/* Interactive Speech Bubble */}
              <div className="px-4 py-1.5 bg-white/95 rounded-2xl shadow-sm border-2 border-amber-200/80 mb-1 max-w-[300px]">
                <p className="font-rounded font-extrabold text-sm text-amber-950">
                  {greeting}
                </p>
              </div>

              {/* Tara Mascot */}
              <TaraMascot
                size={82}
                animation={taraAnimation}
                onClick={handleTaraClick}
              />

              <h2 className="font-rounded font-black text-2xl text-slate-900 mt-1 tracking-tight">
                Learning Playground
              </h2>
              <p className="font-rounded font-semibold text-xs text-slate-500">
                Tap a world to start your adventure!
              </p>
            </div>

            {/* Quick Quests Row */}
            <div className="px-4 mt-3 grid grid-cols-2 gap-2.5 max-w-[440px] mx-auto w-full">
              {/* Today's Adventure */}
              <button
                onClick={() => {
                  playTone('tap');
                  onOpenAdventure();
                }}
                className="rounded-2xl p-3 bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-sm flex items-center gap-2.5 active:scale-95 transition-transform cursor-pointer border border-white/40"
              >
                <span className="text-2xl">🚀</span>
                <div className="text-left">
                  <span className="font-rounded font-extrabold text-sm block leading-tight">
                    Daily Quest
                  </span>
                  <span className="text-[10px] text-amber-100 font-medium">
                    3-Min Play ▶
                  </span>
                </div>
              </button>

              {/* Phonics & Sounds */}
              <button
                onClick={() => {
                  playTone('tap');
                  speak('Phonics and Sounds');
                  onNavigate('phonicsHome');
                }}
                className="rounded-2xl p-3 bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-sm flex items-center gap-2.5 active:scale-95 transition-transform cursor-pointer border border-white/40"
              >
                <span className="text-2xl">🗣️</span>
                <div className="text-left">
                  <span className="font-rounded font-extrabold text-sm block leading-tight">
                    Phonics
                  </span>
                  <span className="text-[10px] text-teal-100 font-medium">
                    Sounds & CVC
                  </span>
                </div>
              </button>
            </div>

            {/* Hubs: Writing Academy & Mini Games */}
            <div className="px-4 mt-2.5 grid grid-cols-2 gap-2.5 max-w-[440px] mx-auto w-full">
              <button
                onClick={() => {
                  playTone('tap');
                  speak('Writing Academy');
                  onNavigate('writingAcademy');
                }}
                className="rounded-2xl p-3 bg-white shadow-xs border-2 border-indigo-200 flex items-center gap-2.5 active:scale-95 transition-transform cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Edit3 size={18} />
                </div>
                <div className="text-left">
                  <span className="font-rounded font-extrabold text-xs text-slate-800 block">
                    Writing
                  </span>
                  <span className="text-[9px] text-slate-400 font-bold uppercase">
                    Trace A-Z & 1-10
                  </span>
                </div>
              </button>

              <button
                onClick={() => {
                  playTone('tap');
                  speak('Game Zone');
                  onNavigate('gameZone');
                }}
                className="rounded-2xl p-3 bg-white shadow-xs border-2 border-emerald-200 flex items-center gap-2.5 active:scale-95 transition-transform cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <Gamepad2 size={18} />
                </div>
                <div className="text-left">
                  <span className="font-rounded font-extrabold text-xs text-slate-800 block">
                    Game Zone
                  </span>
                  <span className="text-[9px] text-slate-400 font-bold uppercase">
                    12 Mini Games
                  </span>
                </div>
              </button>
            </div>

            {/* ASYMMETRICAL LEARNING WORLDS */}
            <div className="px-4 mt-4 flex flex-col gap-3 max-w-[440px] mx-auto w-full">
              {/* 1. Hero Card: ABC Adventure */}
              <LearningWorldCard
                title="ABC Adventure"
                subtitle="Letters, Phonics & Words"
                icon="🐣"
                categoryColor="#FF7043"
                categoryBg="#FFF3E0"
                variant="hero"
                badgeText="⭐ FAVORITE"
                onClick={() => {
                  speak('A B C Adventure');
                  onNavigate('abcMenu');
                }}
              />

              {/* 2. Row: 123 Garden & Hindi World */}
              <div className="grid grid-cols-2 gap-3">
                <LearningWorldCard
                  title="123 Garden"
                  subtitle="Count & Numbers"
                  icon="🔢"
                  categoryColor="#0288D1"
                  categoryBg="#E1F5FE"
                  onClick={() => {
                    speak('Number Garden! One Two Three');
                    onNavigate('numMenu');
                  }}
                />

                <LearningWorldCard
                  title="अ आ World"
                  subtitle="वर्णमाला सीखो"
                  icon="🦚"
                  categoryColor="#FF5722"
                  categoryBg="#FBE9E7"
                  onClick={() => {
                    speak('वर्णमाला सीखो और खेलो');
                    onNavigate('hindiMenu');
                  }}
                />
              </div>

              {/* 3. Row: Shape Planet & Color Garden */}
              <div className="grid grid-cols-2 gap-3">
                <LearningWorldCard
                  title="Shape Planet"
                  subtitle="Shapes & Match"
                  icon="🔺"
                  categoryColor="#8E24AA"
                  categoryBg="#F3E5F5"
                  onClick={() => {
                    speak('Shape Planet! आकार');
                    onNavigate('shapesMenu');
                  }}
                />

                <LearningWorldCard
                  title="Color Garden"
                  subtitle="Colors & Magic"
                  icon="🎨"
                  categoryColor="#00897B"
                  categoryBg="#E0F2F1"
                  onClick={() => {
                    speak('Color Garden! रंग');
                    onNavigate('colorsMenu');
                  }}
                />
              </div>

              {/* Bonus Packs Card */}
              <button
                onClick={() => {
                  playTone('tap');
                  speak('Bonus Packs');
                  onNavigate('plusPacks');
                }}
                className="rounded-3xl p-4 bg-gradient-to-r from-orange-400 to-amber-500 text-white shadow-md flex items-center justify-between active:scale-95 transition-transform cursor-pointer border-2 border-white/50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-3xl">
                    🎁
                  </div>
                  <div className="text-left">
                    <span className="font-rounded font-extrabold text-lg block leading-tight">
                      Bonus Packs
                    </span>
                    <span className="text-xs opacity-90 font-medium">
                      Animals, Vehicles, Fruits & Body
                    </span>
                  </div>
                </div>
                <span className="text-2xl font-bold">➔</span>
              </button>
            </div>
          </div>
        )}

        {/* Songs Tab */}
        {activeTab === 'songs' && (
          <div className="p-6 flex flex-col items-center justify-center min-h-[420px] text-center">
            <div className="w-20 h-20 rounded-3xl bg-amber-100 flex items-center justify-center text-4xl mb-3 shadow-md animate-bounce-gentle">
              🎵
            </div>
            <h3 className="font-rounded font-black text-3xl text-amber-950 mb-1">
              Sing Along Rhymes
            </h3>
            <p className="font-rounded text-slate-600 text-sm max-w-[280px] mb-6">
              Sing with Twinkle Twinkle, Baa Baa Sheep, तितली उड़ी, and मछली जल की रानी!
            </p>
            <button
              onClick={() => {
                playTone('tap');
                onNavigate('rhymesList');
              }}
              className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white font-rounded font-extrabold text-lg rounded-2xl shadow-lg active:scale-95 cursor-pointer"
            >
              Open Rhymes ▶
            </button>
          </div>
        )}

        {/* Stories Tab */}
        {activeTab === 'stories' && (
          <div className="p-6 flex flex-col items-center justify-center min-h-[420px] text-center">
            <div className="w-20 h-20 rounded-3xl bg-indigo-100 flex items-center justify-center text-4xl mb-3 shadow-md animate-bounce-gentle">
              📖
            </div>
            <h3 className="font-rounded font-black text-3xl text-indigo-950 mb-1">
              Bedtime & Moral Stories
            </h3>
            <p className="font-rounded text-slate-600 text-sm max-w-[280px] mb-6">
              The Thirsty Crow, Hare & Tortoise, Lion & Mouse with touch words, sound effects & quiz!
            </p>
            <button
              onClick={() => {
                playTone('tap');
                onNavigate('storiesList');
              }}
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-rounded font-extrabold text-lg rounded-2xl shadow-lg active:scale-95 cursor-pointer"
            >
              Open Stories ▶
            </button>
          </div>
        )}
      </div>

      {/* 3 Bottom Navigation Tabs */}
      <div className="bg-white/95 backdrop-blur border-t border-slate-200/80 px-4 py-2 flex items-center justify-around z-20 shadow-lg">
        <button
          onClick={() => {
            playTone('tap');
            setActiveTab('learn');
            speak('Learn');
          }}
          className={`flex flex-col items-center gap-1 py-1 px-4 rounded-2xl transition-all cursor-pointer ${
            activeTab === 'learn' ? 'text-amber-600 font-extrabold scale-105' : 'text-slate-400 font-semibold'
          }`}
        >
          <span className="text-2xl">🧸</span>
          <span className="text-xs font-rounded">Playground</span>
        </button>

        <button
          onClick={() => {
            playTone('tap');
            setActiveTab('songs');
            speak('Songs');
          }}
          className={`flex flex-col items-center gap-1 py-1 px-4 rounded-2xl transition-all cursor-pointer ${
            activeTab === 'songs' ? 'text-amber-600 font-extrabold scale-105' : 'text-slate-400 font-semibold'
          }`}
        >
          <Music size={24} />
          <span className="text-xs font-rounded">Sing Along</span>
        </button>

        <button
          onClick={() => {
            playTone('tap');
            setActiveTab('stories');
            speak('Stories');
          }}
          className={`flex flex-col items-center gap-1 py-1 px-4 rounded-2xl transition-all cursor-pointer ${
            activeTab === 'stories' ? 'text-amber-600 font-extrabold scale-105' : 'text-slate-400 font-semibold'
          }`}
        >
          <BookOpen size={24} />
          <span className="text-xs font-rounded">Stories</span>
        </button>
      </div>
    </div>
  );
}
