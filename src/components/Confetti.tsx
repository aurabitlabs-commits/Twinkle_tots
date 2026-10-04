import { useEffect, useState } from 'react';

interface ConfettiProps {
  active: boolean;
}

const confettiColors = ['#FFD54F', '#FF8C42', '#4FC3F7', '#66BB6A', '#FF8A80', '#CE93D8'];
const confettiEmojis = ['\u2b50', '\ud83c\udf89', '\u2728', '\ud83c\udf8a'];

export function Confetti({ active }: ConfettiProps) {
  const [pieces, setPieces] = useState<
    Array<{ id: number; left: number; delay: number; duration: number; color: string; isEmoji: boolean; char: string; size: number }>
  >([]);

  useEffect(() => {
    if (active) {
      const newPieces = Array.from({ length: 40 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 1.5,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        isEmoji: Math.random() > 0.5,
        char: confettiEmojis[Math.floor(Math.random() * confettiEmojis.length)],
        size: 16 + Math.random() * 24,
      }));
      setPieces(newPieces);
      const timer = setTimeout(() => setPieces([]), 4000);
      return () => clearTimeout(timer);
    } else {
      setPieces([]);
    }
  }, [active]);

  if (pieces.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute animate-confetti-fall"
          style={{
            left: `${piece.left}%`,
            top: '-20px',
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
          }}
        >
          {piece.isEmoji ? (
            <span style={{ fontSize: `${piece.size}px` }}>{piece.char}</span>
          ) : (
            <div
              style={{
                width: `${piece.size}px`,
                height: `${piece.size}px`,
                backgroundColor: piece.color,
                borderRadius: '4px',
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
