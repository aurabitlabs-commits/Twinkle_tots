import { BackButton } from '@/components/BackButton';
import { TaraMascot } from '@/components/TaraMascot';
import { colors } from '@/theme';
import { useSpeech, playTone } from '@/hooks/useSpeech';
import type { ScreenName } from '@/types';

interface TopicButtonConfig {
  id: string;
  label: string;
  icon: string;
  color: string;
  route: ScreenName;
  speechText: string;
}

interface TopicMenuProps {
  title: string;
  titleIcon: string;
  bgGradient: [string, string];
  buttons: TopicButtonConfig[];
  onBack: () => void;
  onNavigate: (route: ScreenName) => void;
}

export function TopicMenuScreen({
  title,
  titleIcon,
  bgGradient,
  buttons,
  onBack,
  onNavigate,
}: TopicMenuProps) {
  const { speak } = useSpeech();
  const isMultiGrid = buttons.length > 4;

  return (
    <div
      className="flex flex-col h-full animate-fade-in select-none relative overflow-y-auto"
      style={{
        background: `linear-gradient(160deg, ${bgGradient[0]} 0%, ${bgGradient[1]} 100%)`,
      }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between p-4 sticky top-0 z-20 bg-white/40 backdrop-blur-xs shadow-2xs">
        <BackButton onClick={onBack} />
        <div className="flex items-center gap-2">
          <span style={{ fontSize: '2rem' }}>{titleIcon}</span>
          <h2 className="font-rounded font-bold text-3xl" style={{ color: colors.ink }}>
            {title}
          </h2>
        </div>
        <div style={{ width: '48px' }} />
      </div>

      {/* Mascot */}
      <div className="flex justify-center mt-1 shrink-0">
        <TaraMascot size={isMultiGrid ? 64 : 76} animation="bounce" />
      </div>

      {/* Buttons Container */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 pb-8 max-w-[380px] mx-auto w-full">
        {isMultiGrid ? (
          /* 2-Column Responsive Grid when 5+ buttons (e.g. 123 section with 6 buttons) */
          <div className="grid grid-cols-2 gap-3 w-full">
            {buttons.map((btn) => (
              <button
                key={btn.id}
                onClick={() => {
                  playTone('tap');
                  speak(btn.speechText);
                  onNavigate(btn.route);
                }}
                className="w-full min-h-[96px] py-3 px-2 rounded-3xl font-rounded font-bold flex flex-col items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all text-white cursor-pointer hover:scale-[1.02]"
                style={{
                  backgroundColor: btn.color,
                  boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
                }}
              >
                <span className="text-3xl leading-none">{btn.icon}</span>
                <span className="text-sm font-extrabold text-center leading-tight">
                  {btn.label}
                </span>
              </button>
            ))}
          </div>
        ) : (
          /* Single Column for 4 or fewer buttons */
          <div className="flex flex-col gap-3 w-full max-w-[320px]">
            {buttons.map((btn) => (
              <button
                key={btn.id}
                onClick={() => {
                  playTone('tap');
                  speak(btn.speechText);
                  onNavigate(btn.route);
                }}
                className="w-full min-h-[76px] py-3.5 px-4 rounded-3xl font-rounded font-bold flex items-center justify-center gap-3 shadow-md active:scale-95 transition-all text-white cursor-pointer hover:scale-[1.02]"
                style={{
                  backgroundColor: btn.color,
                  boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
                }}
              >
                <span className="text-3xl">{btn.icon}</span>
                <span className="text-xl font-extrabold">{btn.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
