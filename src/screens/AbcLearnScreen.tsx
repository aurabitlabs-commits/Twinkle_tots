import { useEffect, useRef, useState } from 'react';
import { BackButton } from '@/components/BackButton';
import { FlashCard } from '@/components/FlashCard';
import { NavArrow } from '@/components/NavArrow';
import { ProgressDots } from '@/components/ProgressDots';
import { SpeakerButton } from '@/components/SpeakerButton';
import { colors } from '@/theme';
import { useSpeech, playTone } from '@/hooks/useSpeech';
import alphabetData from '@/data/alphabet.json';
import type { AlphabetEntry } from '@/types';

interface AbcLearnScreenProps {
  onBack: () => void;
  markCardSeen: (id: string) => void;
}

export function AbcLearnScreen({ onBack, markCardSeen }: AbcLearnScreenProps) {
  const alphabet = alphabetData as AlphabetEntry[];
  const [index, setIndex] = useState(0);
  const { speak, stop } = useSpeech();
  const touchStartX = useRef(0);

  const current = alphabet[index];

  useEffect(() => {
    speak(current.audioPhrase);
    markCardSeen(current.id);
    return () => stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const goNext = () => {
    if (index < alphabet.length - 1) {
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
          ABC Learn
        </h2>
        <SpeakerButton onClick={() => speak(current.audioPhrase)} />
      </div>

      {/* Card */}
      <div className="flex-1 flex items-center justify-center p-4">
        <FlashCard
          key={index}
          bigText={current.upper}
          smallText={current.lower}
          word={current.word}
          emoji={current.emoji}
          pastelIndex={index}
          bigFontSize="5rem"
          onTap={() => {
            playTone('pop');
            speak(current.audioPhrase);
          }}
        />
      </div>

      {/* Nav arrows */}
      <div className="flex items-center justify-center gap-8 pb-4">
        <NavArrow direction="left" onClick={goPrev} disabled={index === 0} />
        <NavArrow direction="right" onClick={goNext} disabled={index === alphabet.length - 1} />
      </div>

      {/* Progress */}
      <div className="flex flex-col items-center gap-2 pb-6">
        <p className="font-rounded font-bold" style={{ fontSize: '1.25rem', color: colors.inkLight }}>
          {index + 1} / {alphabet.length}
        </p>
        <ProgressDots total={alphabet.length} current={index} />
      </div>
    </div>
  );
}
