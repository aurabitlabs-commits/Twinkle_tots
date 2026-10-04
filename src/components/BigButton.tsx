import { useState, type ReactNode } from 'react';
import { playTone } from '@/hooks/useSpeech';

interface BigButtonProps {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  color?: string;
  textColor?: string;
  size?: 'normal' | 'large';
  disabled?: boolean;
}

export function BigButton({
  label,
  icon,
  onClick,
  color = '#FF8C42',
  textColor = '#FFFFFF',
  size = 'normal',
  disabled = false,
}: BigButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = () => {
    if (disabled) return;
    playTone('tap');
    onClick();
  };

  const minSize = size === 'large' ? 'min-h-[140px]' : 'min-h-[80px]';

  return (
    <button
      onClick={handleClick}
      onPointerDown={() => setIsPressed(true)}
      onPointerUp={() => setIsPressed(false)}
      onPointerLeave={() => setIsPressed(false)}
      disabled={disabled}
      className={`
        ${minSize}
        w-full
        rounded-[2rem]
        font-rounded
        font-bold
        flex flex-col items-center justify-center gap-2
        transition-all duration-150
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer active:scale-95'}
        ${isPressed ? 'scale-95' : 'scale-100'}
      `}
      style={{
        backgroundColor: color,
        color: textColor,
        boxShadow: disabled ? 'none' : '0 6px 20px rgba(0,0,0,0.15)',
        fontSize: size === 'large' ? '1.75rem' : '1.25rem',
        padding: size === 'large' ? '1.5rem 2rem' : '1rem 1.5rem',
      }}
    >
      {icon && <span style={{ fontSize: size === 'large' ? '3rem' : '2rem' }}>{icon}</span>}
      <span>{label}</span>
    </button>
  );
}
