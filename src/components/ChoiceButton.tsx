import { useState, type ReactNode } from 'react';
import { playTone } from '@/hooks/useSpeech';
import { colors } from '@/theme';
import { ShapeView } from './ShapeView';
import type { QuestionKind } from '@/types';

interface ChoiceButtonProps {
  label?: string;
  onClick: () => void;
  state?: 'default' | 'correct' | 'wrong' | 'disabled' | 'revealed';
  emoji?: ReactNode;
  kind?: QuestionKind;
  value?: string;
  colorSwatch?: string;
  shapeId?: string;
  shapeColor?: string;
}

export function ChoiceButton({
  label,
  onClick,
  state = 'default',
  emoji,
  kind = 'text',
  colorSwatch,
  shapeId,
  shapeColor = '#FF8C42',
}: ChoiceButtonProps) {
  const [animClass, setAnimClass] = useState('');

  const handleClick = () => {
    if (state === 'disabled' || state === 'correct' || state === 'wrong' || state === 'revealed') return;
    playTone('tap');
    setAnimClass('animate-pop');
    setTimeout(() => setAnimClass(''), 350);
    onClick();
  };

  let bgColor = '#FFFFFF';
  let borderColor = '#E0E0E0';
  let textColor: string = colors.ink;
  let extraClass = '';

  if (state === 'correct') {
    bgColor = colors.success;
    borderColor = colors.success;
    textColor = '#FFFFFF';
    extraClass = 'animate-pulse-green';
  } else if (state === 'wrong') {
    bgColor = colors.error;
    borderColor = colors.error;
    textColor = '#FFFFFF';
    extraClass = 'animate-shake';
  } else if (state === 'disabled') {
    bgColor = '#F5F5F5';
    borderColor = '#E0E0E0';
    textColor = '#BBBBBB';
  } else if (state === 'revealed') {
    bgColor = colors.star;
    borderColor = colors.starDark;
    textColor = colors.ink;
    extraClass = 'animate-glow';
  }

  return (
    <button
      onClick={handleClick}
      disabled={state === 'disabled' || state === 'correct' || state === 'wrong' || state === 'revealed'}
      className={`
        rounded-[1.5rem]
        font-rounded font-bold
        flex flex-col items-center justify-center gap-1
        transition-all duration-150
        ${extraClass}
        ${animClass}
        ${state === 'default' ? 'cursor-pointer active:scale-95 hover:scale-105' : ''}
        min-h-[100px] w-full p-3
      `}
      style={{
        backgroundColor: bgColor,
        color: textColor,
        border: `4px solid ${borderColor}`,
        boxShadow: state === 'default' ? '0 6px 20px rgba(0,0,0,0.1)' : 'none',
        fontSize: '2.4rem',
      }}
    >
      {kind === 'color' && colorSwatch && (
        <div
          className="rounded-full shadow-md my-1 transition-transform"
          style={{
            width: '68px',
            height: '68px',
            backgroundColor: colorSwatch,
            border: colorSwatch.toLowerCase() === '#fafafa' || colorSwatch.toLowerCase() === '#ffffff' ? '3px solid #E0E0E0' : 'none',
          }}
        />
      )}

      {kind === 'shape' && shapeId && (
        <div className="my-1 flex items-center justify-center">
          <ShapeView shapeId={shapeId} color={shapeColor} size={68} />
        </div>
      )}

      {emoji && kind !== 'shape' && kind !== 'color' && (
        <span style={{ fontSize: '2.5rem' }}>{emoji}</span>
      )}

      {label && <span>{label}</span>}
    </button>
  );
}
