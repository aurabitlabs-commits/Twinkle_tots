import { useState } from 'react';
import { Star } from 'lucide-react';
import { playTone } from '@/hooks/useSpeech';

interface TaraMascotProps {
  size?: number;
  className?: string;
  animation?: 'bounce' | 'idle' | 'cheer' | 'sad' | 'celebrate' | 'wobble';
  onClick?: () => void;
}

export function TaraMascot({
  size = 120,
  className = '',
  animation = 'idle',
  onClick,
}: TaraMascotProps) {
  const [isTapped, setIsTapped] = useState(false);

  const animClass =
    isTapped
      ? 'animate-pop scale-110'
      : animation === 'bounce'
      ? 'animate-bounce-gentle'
      : animation === 'cheer'
      ? 'animate-wiggle scale-105'
      : animation === 'wobble'
      ? 'animate-wiggle'
      : 'animate-float';

  const handleClick = () => {
    playTone('pop');
    setIsTapped(true);
    setTimeout(() => setIsTapped(false), 500);
    onClick?.();
  };

  return (
    <div
      onClick={handleClick}
      className={`flex flex-col items-center justify-center transition-transform select-none cursor-pointer ${animClass} ${className}`}
    >
      <div
        className="relative flex items-center justify-center filter drop-shadow-md"
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        <Star
          size={size}
          fill="url(#taraStarGradient)"
          stroke="#FFA000"
          strokeWidth={3}
          strokeLinejoin="round"
        />

        {/* SVG Gradient definition */}
        <svg width="0" height="0" className="absolute">
          <defs>
            <radialGradient id="taraStarGradient" cx="50%" cy="40%" r="65%">
              <stop offset="0%" stopColor="#FFF9C4" />
              <stop offset="60%" stopColor="#FFC107" />
              <stop offset="100%" stopColor="#FFA000" />
            </radialGradient>
          </defs>
        </svg>

        {/* Sparkle glint on star top point */}
        <div
          className="absolute rounded-full bg-white opacity-80"
          style={{
            width: `${size * 0.08}px`,
            height: `${size * 0.08}px`,
            top: `${size * 0.14}px`,
            left: `${size * 0.46}px`,
          }}
        />

        {/* Big Kawaii Eyes with Sparkle Glints */}
        <div
          className="absolute flex items-center justify-between"
          style={{
            top: `${size * 0.32}px`,
            width: `${size * 0.38}px`,
          }}
        >
          {/* Left Eye */}
          <div
            className="rounded-full bg-slate-900 relative"
            style={{ width: `${size * 0.12}px`, height: `${size * 0.12}px` }}
          >
            {/* Major Glint */}
            <div
              className="rounded-full bg-white absolute"
              style={{
                width: `${size * 0.05}px`,
                height: `${size * 0.05}px`,
                top: `${size * 0.015}px`,
                left: `${size * 0.015}px`,
              }}
            />
            {/* Minor Glint */}
            <div
              className="rounded-full bg-white absolute"
              style={{
                width: `${size * 0.025}px`,
                height: `${size * 0.025}px`,
                bottom: `${size * 0.015}px`,
                right: `${size * 0.015}px`,
              }}
            />
          </div>

          {/* Right Eye */}
          <div
            className="rounded-full bg-slate-900 relative"
            style={{ width: `${size * 0.12}px`, height: `${size * 0.12}px` }}
          >
            {/* Major Glint */}
            <div
              className="rounded-full bg-white absolute"
              style={{
                width: `${size * 0.05}px`,
                height: `${size * 0.05}px`,
                top: `${size * 0.015}px`,
                left: `${size * 0.015}px`,
              }}
            />
            {/* Minor Glint */}
            <div
              className="rounded-full bg-white absolute"
              style={{
                width: `${size * 0.025}px`,
                height: `${size * 0.025}px`,
                bottom: `${size * 0.015}px`,
                right: `${size * 0.015}px`,
              }}
            />
          </div>
        </div>

        {/* Rosy Peach Cheeks */}
        <div
          className="absolute flex items-center justify-between"
          style={{
            top: `${size * 0.44}px`,
            width: `${size * 0.52}px`,
          }}
        >
          <div
            className="rounded-full bg-rose-400 opacity-70 filter blur-[0.5px]"
            style={{ width: `${size * 0.14}px`, height: `${size * 0.08}px` }}
          />
          <div
            className="rounded-full bg-rose-400 opacity-70 filter blur-[0.5px]"
            style={{ width: `${size * 0.14}px`, height: `${size * 0.08}px` }}
          />
        </div>

        {/* Happy Smile or Cheerful Open Mouth */}
        {animation === 'cheer' || animation === 'celebrate' ? (
          <div
            className="absolute rounded-b-full bg-pink-700 border-2 border-slate-900 overflow-hidden"
            style={{
              width: `${size * 0.18}px`,
              height: `${size * 0.12}px`,
              top: `${size * 0.44}px`,
            }}
          >
            <div
              className="w-full h-1/2 bg-rose-400 rounded-full mt-1.5"
            />
          </div>
        ) : (
          <div
            className="absolute rounded-b-full border-b-[3.5px] border-slate-900"
            style={{
              width: `${size * 0.20}px`,
              height: `${size * 0.10}px`,
              top: `${size * 0.42}px`,
            }}
          />
        )}
      </div>
    </div>
  );
}
