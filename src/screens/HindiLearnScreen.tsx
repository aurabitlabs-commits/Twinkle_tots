import { useEffect, useRef, useState } from 'react';
import { BackButton } from '@/components/BackButton';
import { FlashCard } from '@/components/FlashCard';
import { NavArrow } from '@/components/NavArrow';
import { ProgressDots } from '@/components/ProgressDots';
import { SpeakerButton } from '@/components/SpeakerButton';
import { colors } from '@/theme';
import { useSpeech, playTone } from '@/hooks/useSpeech';
import hindiData from '@/data/hindi.json';
import type { HindiEntry } from '@/types';

interface HindiLearnScreenProps {
  onBack: () => void;
  markCardSeen: (id: string) => void;
}

export function HindiLearnScreen({ onBack, markCardSeen }: HindiLearnScreenProps) {
  const entries = hindiData as HindiEntry[];
  const [tab, setTab] = useState<'swar' | 'vyanjan'>('swar');
  const [index, setIndex] = useState(0);
  const { speak, stop } = useSpeech();
  const touchStartX = useRef(0);

  const currentList = entries.filter((e) => e.group === tab);
  const current = currentList[index] || currentList[0];

  useEffect(() => {
    setIndex(0);
  }, [tab]);

  useEffect(() => {
    if (current) {
      speak(current.audioPhrase, { lang: 'hi-IN' });
      markCardSeen(current.id);
    }
    return () => stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, tab]);

  const goNext = () => {
    if (index < currentList.length - 1) {
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
          वर्णमाला सीखो
        </h2>
        <SpeakerButton onClick={() => current && speak(current.audioPhrase, { lang: 'hi-IN' })} />
      </div>

      {/* Tabs: स्वर (13) and व्यंजन (36) */}
      <div className="flex justify-center gap-3 px-4">
        <button
          onClick={() => {
            playTone('tap');
            setTab('swar');
          }}
          className={`rounded-2xl px-6 py-2.5 font-rounded font-bold text-lg transition-all ${
            tab === 'swar'
              ? 'bg-amber-500 text-white shadow-md scale-105'
              : 'bg-white/80 text-slate-700 hover:bg-white'
          }`}
        >
          स्वर (13)
        </button>
        <button
          onClick={() => {
            playTone('tap');
            setTab('vyanjan');
          }}
          className={`rounded-2xl px-6 py-2.5 font-rounded font-bold text-lg transition-all ${
            tab === 'vyanjan'
              ? 'bg-amber-500 text-white shadow-md scale-105'
              : 'bg-white/80 text-slate-700 hover:bg-white'
          }`}
        >
          व्यंजन (36)
        </button>
      </div>

      {/* FlashCard */}
      <div className="flex-1 flex items-center justify-center p-4">
        {current && (
          <FlashCard
            key={`${tab}_${index}`}
            bigText={current.letter}
            word={current.noPicture ? undefined : `${current.letter} से ${current.word}`}
            emoji={current.noPicture ? undefined : current.emoji}
            noPicture={current.noPicture}
            pastelIndex={index}
            bigFontSize="5.5rem"
            onTap={() => {
              playTone('pop');
              speak(current.audioPhrase, { lang: 'hi-IN' });
            }}
          />
        )}
      </div>

      {/* Nav arrows */}
      <div className="flex items-center justify-center gap-8 pb-3">
        <NavArrow direction="left" onClick={goPrev} disabled={index === 0} />
        <NavArrow direction="right" onClick={goNext} disabled={index === currentList.length - 1} />
      </div>

      {/* Progress */}
      <div className="flex flex-col items-center gap-2 pb-6">
        <p className="font-rounded font-bold text-lg" style={{ color: colors.inkLight }}>
          {index + 1} / {currentList.length}
        </p>
        <ProgressDots total={currentList.length} current={index} />
      </div>
    </div>
  );
}
