import { useEffect, useState } from 'react';
import { BackButton } from '@/components/BackButton';
import { SpeakerButton } from '@/components/SpeakerButton';
import { Confetti } from '@/components/Confetti';
import { TracingCanvas } from '@/components/TracingCanvas';
import { colors } from '@/theme';
import { useSpeech, playTone } from '@/hooks/useSpeech';
import type { TracingItem } from '@/types';

interface TracingScreenProps {
  title: string;
  items: TracingItem[];
  tracedLetters: string[];
  onBack: () => void;
  onLetterCompleted: (letterId: string) => void;
  getSpeechText: (item: TracingItem) => string;
}

export function TracingScreen({
  title,
  items,
  tracedLetters,
  onBack,
  onLetterCompleted,
  getSpeechText,
}: TracingScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const { speak } = useSpeech();

  const currentItem = items[currentIndex] || items[0];

  useEffect(() => {
    if (currentItem) {
      speak(getSpeechText(currentItem));
      setIsCompleted(false);
    }
  }, [currentIndex, currentItem, getSpeechText, speak]);

  const handleComplete = () => {
    playTone('win');
    setShowConfetti(true);
    setIsCompleted(true);
    onLetterCompleted(currentItem.id);
    speak(getSpeechText(currentItem));
  };

  const handleNext = () => {
    playTone('tap');
    setShowConfetti(false);
    setIsCompleted(false);
    if (currentIndex < items.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  return (
    <div
      className="flex flex-col h-full animate-fade-in relative overflow-hidden"
      style={{
        background: `linear-gradient(160deg, ${colors.pastels[currentIndex % 6]} 0%, ${colors.pastels[(currentIndex + 2) % 6]} 100%)`,
      }}
    >
      <Confetti active={showConfetti} />

      {/* Top bar */}
      <div className="flex items-center justify-between p-4 z-10">
        <BackButton onClick={onBack} />
        <h2 className="font-rounded font-bold text-2xl" style={{ color: colors.ink }}>
          {title}
        </h2>
        <SpeakerButton onClick={() => speak(getSpeechText(currentItem))} />
      </div>

      {/* Scrollable Letter Selector Bar */}
      <div className="px-4 py-2 overflow-x-auto flex gap-2 no-scrollbar z-10">
        {items.map((item, idx) => {
          const isSelected = idx === currentIndex;
          const isTraced = tracedLetters.includes(item.id);

          return (
            <button
              key={item.id}
              onClick={() => {
                playTone('tap');
                setShowConfetti(false);
                setCurrentIndex(idx);
              }}
              className={`relative flex-shrink-0 flex items-center justify-center rounded-2xl font-rounded font-bold transition-all ${
                isSelected
                  ? 'w-14 h-14 bg-white shadow-md text-amber-600 scale-105 border-2 border-amber-400'
                  : 'w-11 h-11 bg-white/70 text-slate-700 hover:bg-white'
              }`}
              style={{ fontSize: isSelected ? '1.5rem' : '1.2rem' }}
            >
              {item.label}
              {isTraced && (
                <span className="absolute -top-1 -right-1 text-xs">⭐</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Tracing Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 z-10">
        {currentItem && (
          <TracingCanvas
            key={currentItem.id}
            strokes={currentItem.strokes}
            onComplete={handleComplete}
          />
        )}

        {isCompleted && (
          <div className="mt-4 animate-slide-up flex gap-3">
            <button
              onClick={handleNext}
              className="rounded-2xl py-3 px-6 font-rounded font-bold text-white shadow-lg flex items-center gap-2 transition-transform active:scale-95"
              style={{ backgroundColor: colors.success, fontSize: '1.25rem' }}
            >
              Next Letter ➔
            </button>
          </div>
        )}
      </div>

      {/* Prompt Footer */}
      <div className="pb-6 text-center z-10">
        <p className="font-rounded font-semibold text-slate-600 text-lg">
          Follow the numbers with your finger! 👆
        </p>
      </div>
    </div>
  );
}
