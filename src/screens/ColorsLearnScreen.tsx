import { useEffect, useRef, useState } from 'react';
import { BackButton } from '@/components/BackButton';
import { FlashCard } from '@/components/FlashCard';
import { NavArrow } from '@/components/NavArrow';
import { ProgressDots } from '@/components/ProgressDots';
import { SpeakerButton } from '@/components/SpeakerButton';
import { colors } from '@/theme';
import { useSpeech, playTone } from '@/hooks/useSpeech';
import colorsData from '@/data/colors.json';
import type { ColorEntry } from '@/types';

interface ColorsLearnScreenProps {
  onBack: () => void;
  markCardSeen: (id: string) => void;
}

export function ColorsLearnScreen({ onBack, markCardSeen }: ColorsLearnScreenProps) {
  const colorList = colorsData as ColorEntry[];
  const [index, setIndex] = useState(0);
  const { speakBilingual, stop } = useSpeech();
  const touchStartX = useRef(0);

  const current = colorList[index];

  useEffect(() => {
    if (current) {
      speakBilingual(current.nameEn, current.nameHi);
      markCardSeen(current.id);
    }
    return () => stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const goNext = () => {
    if (index < colorList.length - 1) {
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
      className="flex flex-col h-full animate-fade-in select-none"
      style={{
        background: `linear-gradient(160deg, ${colors.pastels[index % 6]} 0%, ${colors.pastels[(index + 3) % 6]} 100%)`,
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between p-4">
        <BackButton onClick={onBack} />
        <h2 className="font-rounded font-bold text-2xl" style={{ color: colors.ink }}>
          Colors / रंग
        </h2>
        <SpeakerButton onClick={() => speakBilingual(current.nameEn, current.nameHi)} />
      </div>

      {/* FlashCard */}
      <div className="flex-1 flex items-center justify-center p-4">
        <FlashCard
          key={index}
          bigText={current.nameEn}
          subtitle={current.nameHi}
          colorSwatch={current.hex}
          realWorldItems={current.objects}
          pastelIndex={index}
          onTap={() => {
            playTone('pop');
            speakBilingual(current.nameEn, current.nameHi);
          }}
        />
      </div>

      {/* Nav arrows */}
      <div className="flex items-center justify-center gap-8 pb-3">
        <NavArrow direction="left" onClick={goPrev} disabled={index === 0} />
        <NavArrow direction="right" onClick={goNext} disabled={index === colorList.length - 1} />
      </div>

      {/* Progress */}
      <div className="flex flex-col items-center gap-2 pb-6">
        <p className="font-rounded font-bold text-lg" style={{ color: colors.inkLight }}>
          {index + 1} / {colorList.length}
        </p>
        <ProgressDots total={colorList.length} current={index} />
      </div>
    </div>
  );
}
