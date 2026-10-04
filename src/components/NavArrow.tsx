import { ChevronLeft, ChevronRight } from 'lucide-react';

interface NavArrowProps {
  direction: 'left' | 'right';
  onClick: () => void;
  disabled?: boolean;
}

export function NavArrow({ direction, onClick, disabled = false }: NavArrowProps) {
  const Icon = direction === 'left' ? ChevronLeft : ChevronRight;

  return (
    <button
      onClick={() => {
        if (disabled) return;
        onClick();
      }}
      disabled={disabled}
      className={`
        flex items-center justify-center
        rounded-full
        transition-all duration-150
        ${disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer active:scale-90 hover:scale-110'}
      `}
      style={{
        backgroundColor: '#FFFFFF',
        width: '64px',
        height: '64px',
        boxShadow: disabled ? 'none' : '0 6px 20px rgba(0,0,0,0.12)',
      }}
    >
      <Icon size={36} color={disabled ? '#999' : '#FF8C42'} strokeWidth={3} />
    </button>
  );
}
