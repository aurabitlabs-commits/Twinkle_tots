import { Star } from 'lucide-react';
import { colors } from '@/theme';

interface EndRoundScreenProps {
  stars: number;
  onPlayAgain: () => void;
  onHome: () => void;
}

export function EndRoundScreen({ stars, onPlayAgain, onHome }: EndRoundScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 animate-fade-in p-8">
      <div
        className="rounded-[2.5rem] flex flex-col items-center gap-6 p-8"
        style={{
          backgroundColor: '#FFFFFF',
          boxShadow: '0 14px 44px rgba(0,0,0,0.16)',
          maxWidth: '360px',
          width: '100%',
        }}
      >
        <h2 className="font-rounded font-bold text-center" style={{ fontSize: '2rem', color: colors.ink }}>
          Great Job!
        </h2>

        <div className="flex gap-3">
          {Array.from({ length: 3 }, (_, i) => (
            <div
              key={i}
              className="animate-pop"
              style={{ animationDelay: `${i * 0.2}s` }}
            >
              <Star
                size={72}
                fill={i < stars ? colors.star : 'none'}
                stroke={i < stars ? colors.starDark : '#E0E0E0'}
                strokeWidth={2}
                className={i < stars ? 'animate-twinkle' : ''}
              />
            </div>
          ))}
        </div>

        <p className="font-rounded text-center" style={{ fontSize: '1.25rem', color: colors.inkLight }}>
          {stars === 3 ? 'Perfect! You are a star!' : stars === 2 ? 'Well done, keep shining!' : 'Good try, play again!'}
        </p>

        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={onPlayAgain}
            className="rounded-[1.5rem] py-4 px-6 font-rounded font-bold flex items-center justify-center gap-2 transition-all duration-150 active:scale-95 hover:scale-105 cursor-pointer"
            style={{ backgroundColor: colors.primary, color: '#FFFFFF', fontSize: '1.25rem', boxShadow: '0 6px 20px rgba(0,0,0,0.12)' }}
          >
            <span style={{ fontSize: '1.5rem' }}>{"\u21bb"}</span> Play Again
          </button>
          <button
            onClick={onHome}
            className="rounded-[1.5rem] py-4 px-6 font-rounded font-bold flex items-center justify-center gap-2 transition-all duration-150 active:scale-95 hover:scale-105 cursor-pointer"
            style={{ backgroundColor: '#E3F2FD', color: colors.ink, fontSize: '1.25rem' }}
          >
            <span style={{ fontSize: '1.5rem' }}>{"\ud83c\udfe0"}</span> Home
          </button>
        </div>
      </div>
    </div>
  );
}
