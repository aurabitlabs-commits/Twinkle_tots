import { useState } from 'react';
import { playTone } from '@/hooks/useSpeech';

interface LearningWorldCardProps {
  title: string;
  subtitle: string;
  icon: string;
  categoryColor: string;
  categoryBg: string;
  onClick: () => void;
  variant?: 'hero' | 'compact';
  badgeText?: string;
}

export function LearningWorldCard({
  title,
  subtitle,
  icon,
  categoryColor,
  categoryBg,
  onClick,
  variant = 'compact',
  badgeText,
}: LearningWorldCardProps) {
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = () => {
    playTone('tap');
    onClick();
  };

  if (variant === 'hero') {
    return (
      <button
        onClick={handleClick}
        onPointerDown={() => setIsPressed(true)}
        onPointerUp={() => setIsPressed(false)}
        onPointerLeave={() => setIsPressed(false)}
        className={`w-full rounded-[2.2rem] p-5 text-left border-3 transition-all duration-150 relative overflow-hidden active:scale-96 cursor-pointer flex items-center justify-between ${
          isPressed ? 'scale-96 shadow-sm' : 'scale-100 shadow-lg hover:shadow-xl'
        }`}
        style={{
          background: `linear-gradient(135deg, #FFFFFF 0%, ${categoryBg} 100%)`,
          borderColor: categoryColor,
          boxShadow: `0 10px 25px ${categoryColor}25`,
        }}
      >
        {/* Soft background orb */}
        <div
          className="absolute -right-4 -top-4 w-28 h-28 rounded-full pointer-events-none opacity-20"
          style={{ backgroundColor: categoryColor }}
        />

        <div className="flex flex-col z-10">
          {badgeText && (
            <span
              className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full inline-block mb-1.5 w-fit font-rounded"
              style={{ backgroundColor: `${categoryColor}20`, color: categoryColor }}
            >
              {badgeText}
            </span>
          )}
          <h3 className="font-rounded font-black text-2xl text-slate-900 leading-tight">
            {title}
          </h3>
          <p className="font-rounded font-bold text-xs text-slate-500 mt-0.5">
            {subtitle}
          </p>
        </div>

        {/* Large Glowing Icon Bubble */}
        <div
          className="w-18 h-18 rounded-3xl flex items-center justify-center shrink-0 border-2 shadow-md z-10"
          style={{
            backgroundColor: `${categoryColor}18`,
            borderColor: `${categoryColor}50`,
          }}
        >
          <span className="text-4xl filter drop-shadow-xs">{icon}</span>
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      onPointerDown={() => setIsPressed(true)}
      onPointerUp={() => setIsPressed(false)}
      onPointerLeave={() => setIsPressed(false)}
      className={`w-full rounded-[2rem] p-4 text-center border-3 transition-all duration-150 relative overflow-hidden active:scale-95 cursor-pointer flex flex-col items-center justify-center ${
        isPressed ? 'scale-95 shadow-sm' : 'scale-100 shadow-md hover:shadow-lg'
      }`}
      style={{
        background: `linear-gradient(145deg, #FFFFFF 0%, ${categoryBg} 100%)`,
        borderColor: `${categoryColor}60`,
        boxShadow: `0 8px 20px ${categoryColor}20`,
      }}
    >
      {/* Icon Bubble */}
      <div
        className="w-15 h-15 rounded-2xl flex items-center justify-center mb-2.5 border-2 shadow-xs"
        style={{
          backgroundColor: categoryBg,
          borderColor: `${categoryColor}40`,
        }}
      >
        <span className="text-3xl filter drop-shadow-xs">{icon}</span>
      </div>

      <h4 className="font-rounded font-black text-lg text-slate-900 leading-tight">
        {title}
      </h4>
      <p className="font-rounded font-bold text-[11px] text-slate-500 mt-0.5 line-clamp-1">
        {subtitle}
      </p>
    </button>
  );
}
