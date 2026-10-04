import { ArrowLeft } from 'lucide-react';
import { playTone } from '@/hooks/useSpeech';

interface BackButtonProps {
  onClick: () => void;
  color?: string;
}

export function BackButton({ onClick, color = '#FFFFFF' }: BackButtonProps) {
  return (
    <button
      onClick={() => {
        playTone('tap');
        onClick();
      }}
      className="flex items-center justify-center rounded-full transition-all duration-150 active:scale-90 hover:scale-110 cursor-pointer"
      style={{
        backgroundColor: color,
        width: '64px',
        height: '64px',
        boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
      }}
    >
      <ArrowLeft size={32} color="#5A6B7E" strokeWidth={3} />
    </button>
  );
}
