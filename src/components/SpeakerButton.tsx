import { Volume2 } from 'lucide-react';
import { playTone } from '@/hooks/useSpeech';

interface SpeakerButtonProps {
  onClick: () => void;
  size?: number;
}

export function SpeakerButton({ onClick, size = 64 }: SpeakerButtonProps) {
  return (
    <button
      onClick={() => {
        playTone('tap');
        onClick();
      }}
      className="flex items-center justify-center rounded-full transition-all duration-150 active:scale-90 hover:scale-110 cursor-pointer"
      style={{
        backgroundColor: '#FFFFFF',
        width: `${size}px`,
        height: `${size}px`,
        boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
      }}
    >
      <Volume2 size={size * 0.5} color="#FF8C42" strokeWidth={2.5} />
    </button>
  );
}
