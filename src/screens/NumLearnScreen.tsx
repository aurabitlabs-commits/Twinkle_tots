import { useEffect, useRef, useState } from 'react';
import { BackButton } from '@/components/BackButton';
import { FlashCard } from '@/components/FlashCard';
import { NavArrow } from '@/components/NavArrow';
import { ProgressDots } from '@/components/ProgressDots';
import { SpeakerButton } from '@/components/SpeakerButton';
import { colors } from '@/theme';
import { useSpeech, playTone } from '@/hooks/useSpeech';
import numbersData from '@/data/numbers.json';
import type { NumberEntry } from '@/types';

interface NumLearnScreenProps {
  onBack: () => void;
  markCardSeen: (id: string) => void;
}

const numberWords = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];

export function NumLearnScreen({ onBack, markCardSeen }: NumLearnScreenProps) {
  const numbers = numbersData as NumberEntry[];
  const [index, setIndex] = useState(0);
  const [tappedEmojis, setTappedEmojis] = useState<Set<number>>(new Set());
  const { speak, stop } = useSpeech();
  const touchStartX = useRef(0);

  const current = numbers[index];
  const count = current.id;

  useEffect(() => {
    setTappedEmojis(new Set());
    speak(current.audioNumber);
    markCardSeen(String(current.id));

    const countUpDelay = 1500;
    const timers: ReturnType<typeof setTimeout>[] = [];

    for (let i = 0; i < count; i++) {
      timers.push(
        setTimeout(() => {
          setTappedEmojis((prev) => {
            const next = new Set(prev);
            next.add(i);
            return next;
          });
          speak(numberWords[i]);
        }, countUpDelay + i * 700),
      );
    }

    return () => {
      timers.forEach(clearTimeout);
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const goNext = () => {
    if (index < numbers.length - 1) {
      playTone('tap');
      setIndex((i) => i + 1);
    }
  };

  const goPrev = () => {
    if (index > 0) {
      playTone('tap');
      setIndex((i) => i - 1);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > 60) {
      if (diff < 0) goNext();
      else goPrev();
    }
  };

  const handleEmojiTap = (i: number) => {
    if (tappedEmojis.has(i)) return;
    playTone('pop');
    setTappedEmojis((prev) => {
      const next = new Set(prev);
      next.add(i);
      return next;
    });
    speak(numberWords[i]);
  };

  return (
    <div
      className="flex flex-col h-full animate-fade-in"
      style={{
        background: `linear-gradient(160deg, ${colors.pastels[index % 6]} 0%, ${colors.pastels[(index + 2) % 6]} 100%)`,
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between p-4">
        <BackButton onClick={onBack} />
        <h2 className="font-rounded font-bold" style={{ fontSize: '1.75rem', color: colors.ink }}>
          123 Learn
        </h2>
        <SpeakerButton onClick={() => speak(current.audioNumber)} />
      </div>

      {/* Card */}
      <div className="flex-1 flex items-center justify-center p-4 overflow-y-auto">
        <div className="w-full flex justify-center">
        <FlashCard
          key={index}
          bigText={current.numeral}
          word={current.word}
          emoji={current.emoji}
          emojiCount={count}
          showEmojiGrid
          pastelIndex={index}
          bigFontSize="5rem"
          tappedEmojis={tappedEmojis}
          onEmojiTap={handleEmojiTap}
          onTap={() => {
            playTone('pop');
            speak(current.audioNumber);
          }}
        />
        </div>
      </div>

      {/* Nav arrows */}
      <div className="flex items-center justify-center gap-8 pb-4">
        <NavArrow direction="left" onClick={goPrev} disabled={index === 0} />
        <NavArrow direction="right" onClick={goNext} disabled={index === numbers.length - 1} />
      </div>

      {/* Progress */}
      <div className="flex flex-col items-center gap-2 pb-6">
        <p className="font-rounded font-bold" style={{ fontSize: '1.25rem', color: colors.inkLight }}>
          {index + 1} / {numbers.length}
        </p>
        <ProgressDots total={numbers.length} current={index} />
      </div>
    </div>
  );
}
