import { Lock } from 'lucide-react';
import { playTone } from '@/hooks/useSpeech';

interface LockButtonProps {
  onClick: () => void;
}

export function LockButton({ onClick }: LockButtonProps) {
  return (
    <button
      onClick={() => {
        playTone('tap');
        onClick();
      }}
      className="flex items-center justify-center rounded-full transition-all duration-150 active:scale-90 hover:scale-110 cursor-pointer"
      style={{
        backgroundColor: '#FFFFFF',
        width: '56px',
        height: '56px',
        boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
      }}
    >
      <Lock size={24} color="#5A6B7E" strokeWidth={2.5} />
    </button>
  );
}
