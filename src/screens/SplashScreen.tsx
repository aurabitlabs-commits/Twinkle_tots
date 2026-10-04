import { useEffect } from 'react';
import { TaraMascot } from '@/components/TaraMascot';
import { colors } from '@/theme';
import { playTone } from '@/hooks/useSpeech';

interface SplashScreenProps {
  onDone: () => void;
}

export function SplashScreen({ onDone }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(onDone, 1600);
    return () => clearTimeout(timer);
  }, [onDone]);

  const handleLaunch = () => {
    playTone('tap');
    onDone();
  };

  return (
    <div
      onClick={handleLaunch}
      className="flex flex-col items-center justify-center h-full animate-fade-in cursor-pointer select-none px-6"
      style={{
        background: `linear-gradient(135deg, ${colors.pastels[0]} 0%, ${colors.pastels[1]} 50%, ${colors.pastels[3]} 100%)`,
      }}
    >
      {/* Official App Icon Card */}
      <div className="w-36 h-36 rounded-[2.5rem] bg-white shadow-2xl border-4 border-amber-300 flex items-center justify-center p-3 animate-pop relative">
        <div className="animate-bounce-gentle">
          <TaraMascot size={110} animation="idle" />
        </div>
        <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs shadow-md">
          ✨
        </div>
      </div>

      <h1
        className="font-rounded font-bold mt-5 animate-slide-up text-center"
        style={{ fontSize: '3rem', color: colors.primary, textShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
      >
        Twinkle Tots
      </h1>

      <p
        className="font-rounded mt-1 animate-slide-up text-center"
        style={{ fontSize: '1.25rem', color: colors.inkLight, animationDelay: '0.15s' }}
      >
        Every little star learns to shine
      </p>

      {/* Prominent Launch Button */}
      <button
        onClick={handleLaunch}
        className="mt-8 px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-rounded font-bold text-xl shadow-lg transition-transform active:scale-95 animate-slide-up flex items-center gap-2 cursor-pointer"
        style={{ animationDelay: '0.25s' }}
      >
        <span>Launch App</span>
        <span className="text-2xl">➔</span>
      </button>

      {/* Loading dots */}
      <div className="flex gap-2.5 mt-6">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="rounded-full animate-bounce-gentle"
            style={{
              width: '10px',
              height: '10px',
              backgroundColor: colors.primary,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
