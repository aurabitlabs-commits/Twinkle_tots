import { useState, type ReactNode } from 'react';
import { colors } from '@/theme';
import { TaraMascot } from './TaraMascot';
import { ShapeView } from './ShapeView';

interface FlashCardProps {
  bigText?: string;
  smallText?: string;
  subtitle?: string;
  word?: string;
  emoji?: string;
  emojiCount?: number;
  pastelIndex: number;
  onTap?: () => void;
  onEmojiTap?: (index: number) => void;
  tappedEmojis?: Set<number>;
  showEmojiGrid?: boolean;
  noPicture?: boolean;
  colorSwatch?: string;
  shapeId?: string;
  shapeColor?: string;
  realWorldItems?: Array<{ name: string; emoji: string }>;
  bigFontSize?: string;
  children?: ReactNode;
}

export function FlashCard({
  bigText,
  smallText,
  subtitle,
  word,
  emoji,
  emojiCount,
  pastelIndex,
  onTap,
  onEmojiTap,
  tappedEmojis,
  showEmojiGrid = false,
  noPicture = false,
  colorSwatch,
  shapeId,
  shapeColor = '#FF8C42',
  realWorldItems,
  bigFontSize = '5rem',
  children,
}: FlashCardProps) {
  const [bounce, setBounce] = useState(false);

  const bgColor = colors.pastels[pastelIndex % colors.pastels.length];
  const borderColor = colors.pastelBorders[pastelIndex % colors.pastelBorders.length];

  const handleCardTap = () => {
    setBounce(true);
    setTimeout(() => setBounce(false), 400);
    onTap?.();
  };

  return (
    <div
      className={`rounded-[2.5rem] flex flex-col items-center justify-center p-5 ${bounce ? 'animate-bounce-card' : ''} animate-fade-in select-none`}
      style={{
        backgroundColor: bgColor,
        border: `4px solid ${borderColor}`,
        boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
        width: '100%',
        maxWidth: '420px',
      }}
      onClick={handleCardTap}
    >
      {/* Big letter / numeral / shape name */}
      {bigText && (
        <div className="flex items-baseline justify-center gap-3 mb-2 flex-wrap">
          <span
            className="font-rounded font-bold text-center"
            style={{ fontSize: bigFontSize, color: colors.ink, lineHeight: 1.1 }}
          >
            {bigText}
          </span>
          {smallText && (
            <span
              className="font-rounded font-bold"
              style={{ fontSize: `calc(${bigFontSize} * 0.6)`, color: colors.inkLight, lineHeight: 1 }}
            >
              {smallText}
            </span>
          )}
        </div>
      )}

      {subtitle && (
        <div
          className="font-rounded font-bold -mt-1 mb-2"
          style={{ fontSize: '1.5rem', color: colors.inkLight }}
        >
          {subtitle}
        </div>
      )}

      {/* Color Swatch Display */}
      {colorSwatch && (
        <div
          className="rounded-full my-3 shadow-lg animate-pop flex items-center justify-center"
          style={{
            width: '150px',
            height: '150px',
            backgroundColor: colorSwatch,
            border: colorSwatch.toLowerCase() === '#fafafa' || colorSwatch.toLowerCase() === '#ffffff' ? '4px solid #E0E0E0' : '4px solid rgba(255,255,255,0.7)',
          }}
        />
      )}

      {/* Shape Display */}
      {shapeId && (
        <div
          className="rounded-full my-3 flex items-center justify-center"
          style={{
            backgroundColor: '#FFFFFF',
            width: '160px',
            height: '160px',
            boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
          }}
        >
          <ShapeView shapeId={shapeId} color={shapeColor} size={110} />
        </div>
      )}

      {/* Picture / Emoji */}
      {!showEmojiGrid && !noPicture && !colorSwatch && !shapeId && emoji && (
        <div
          className="flex items-center justify-center rounded-full my-3"
          style={{
            backgroundColor: '#FFFFFF',
            width: '150px',
            height: '150px',
            boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
          }}
        >
          <span style={{ fontSize: '4.8rem' }}>{emoji}</span>
        </div>
      )}

      {/* No Picture indicator (e.g. ङ, ञ, ण, अः) with Tara mascot */}
      {noPicture && (
        <div className="flex flex-col items-center my-3 gap-2">
          <TaraMascot size={90} animation="cheer" />
          <span className="font-rounded text-sm" style={{ color: colors.inkLight }}>
            Listen to the sound!
          </span>
        </div>
      )}

      {/* Emoji grid for numbers */}
      {showEmojiGrid && emoji && emojiCount && emojiCount > 0 && (
        <div
          className="flex flex-wrap items-center justify-center gap-2 my-2 p-3 rounded-[1.5rem]"
          style={{
            backgroundColor: '#FFFFFF',
            maxWidth: '300px',
            boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
          }}
        >
          {Array.from({ length: emojiCount }, (_, i) => {
            const isTapped = tappedEmojis?.has(i);
            const itemSize = emojiCount > 6 ? '46px' : '54px';
            const emojiSize = emojiCount > 6 ? '1.5rem' : '2rem';
            return (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  onEmojiTap?.(i);
                }}
                className={`flex items-center justify-center rounded-full transition-all duration-200 ${isTapped ? 'animate-pop' : ''}`}
                style={{
                  width: itemSize,
                  height: itemSize,
                  backgroundColor: isTapped ? colors.successLight : '#F8F8F8',
                  border: isTapped ? `3px solid ${colors.success}` : '3px solid transparent',
                }}
              >
                <span style={{ fontSize: emojiSize, opacity: isTapped ? 0.6 : 1 }}>{emoji}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Real world items for Shapes & Colors */}
      {realWorldItems && realWorldItems.length > 0 && (
        <div className="flex items-center justify-center gap-4 my-3">
          {realWorldItems.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center gap-1 p-2 rounded-2xl bg-white shadow-sm min-w-[90px]"
            >
              <span style={{ fontSize: '2.5rem' }}>{item.emoji}</span>
              <span className="font-rounded font-semibold text-xs" style={{ color: colors.inkLight }}>
                {item.name}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Word */}
      {word && (
        <div
          className="font-rounded font-bold mt-2 text-center"
          style={{ fontSize: '1.8rem', color: colors.ink }}
        >
          {word}
        </div>
      )}

      {children}
    </div>
  );
}
