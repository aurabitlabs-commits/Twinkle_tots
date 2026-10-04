import { useState, useEffect } from 'react';
import { BackButton } from '@/components/BackButton';
import { Confetti } from '@/components/Confetti';
import { EndRoundScreen } from '@/components/EndRoundScreen';
import { TaraMascot } from '@/components/TaraMascot';
import { colors } from '@/theme';
import { useSpeech, playTone } from '@/hooks/useSpeech';
import plusPacksData from '@/data/plusPacks.json';

interface BodyActivityScreenProps {
  onBack: () => void;
  onHome: () => void;
  addStars: (count: number) => void;
}

export function BodyActivityScreen({
  onBack,
  onHome,
  addStars,
}: BodyActivityScreenProps) {
  const bodyParts = plusPacksData.body;
  const [qIndex, setQIndex] = useState(0);
  const [questions, setQuestions] = useState(() => [...bodyParts].sort(() => Math.random() - 0.5));
  const [showConfetti, setShowConfetti] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const { speak } = useSpeech();

  const currentPart = questions[qIndex];

  useEffect(() => {
    if (currentPart && !isDone) {
      speak(`Touch your ${currentPart.nameEn}... ${currentPart.nameHi} को छुओ!`);
    }
  }, [qIndex, currentPart, isDone, speak]);

  const handleRegionClick = (regionId: string) => {
    if (!currentPart) return;

    if (regionId === currentPart.region) {
      playTone('correct');
      setShowConfetti(true);
      speak(`Yes! That is your ${currentPart.nameEn}!`);
      addStars(1);

      setTimeout(() => {
        setShowConfetti(false);
        if (qIndex < questions.length - 1) {
          setQIndex((i) => i + 1);
        } else {
          playTone('win');
          setIsDone(true);
        }
      }, 1800);
    } else {
      playTone('wrong');
      speak('Try again!');
    }
  };

  if (isDone) {
    return (
      <div className="h-full animate-fade-in" style={{ background: colors.pastels[0] }}>
        <EndRoundScreen
          stars={3}
          onPlayAgain={() => {
            setQuestions([...bodyParts].sort(() => Math.random() - 0.5));
            setQIndex(0);
            setIsDone(false);
          }}
          onHome={onHome}
        />
      </div>
    );
  }

  return (
    <div
      className="flex flex-col h-full animate-fade-in select-none relative"
      style={{
        background: `linear-gradient(160deg, ${colors.pastels[0]} 0%, ${colors.pastels[4]} 100%)`,
      }}
    >
      <Confetti active={showConfetti} />

      {/* Top bar */}
      <div className="flex items-center justify-between p-4 z-10">
        <BackButton onClick={onBack} />
        <h2 className="font-rounded font-bold text-2xl" style={{ color: colors.ink }}>
          Touch Your Body
        </h2>
        <div className="w-8" />
      </div>

      {/* Prompt banner */}
      <div className="mx-4 p-3 bg-white/95 rounded-2xl shadow-md border-2 border-amber-300 text-center z-10">
        <span className="text-xs uppercase font-bold text-amber-700 block">Find and Tap:</span>
        <span className="font-rounded font-bold text-2xl text-amber-950">
          👉 {currentPart?.nameEn} ({currentPart?.nameHi})
        </span>
      </div>

      {/* Cartoon Child Interactive Body Diagram */}
      <div className="flex-1 flex items-center justify-center p-3 relative z-10">
        <div className="relative w-full max-w-[320px] aspect-[3/4] bg-white rounded-3xl p-4 shadow-xl border-4 border-amber-200 flex flex-col items-center">
          {/* Head & Face */}
          <div className="relative w-36 h-36 rounded-full bg-amber-100 border-3 border-amber-300 flex flex-col items-center justify-center shadow-inner mt-2">
            {/* Hair */}
            <div className="absolute -top-3 w-28 h-10 rounded-t-full bg-amber-800" />

            {/* Head zone */}
            <button
              onClick={() => handleRegionClick('head')}
              className="absolute top-2 px-3 py-0.5 rounded-full bg-amber-200/80 text-[10px] font-bold text-amber-900 hover:bg-amber-300"
            >
              Head / सिर
            </button>

            {/* Eyes */}
            <button
              onClick={() => handleRegionClick('eyes')}
              className="mt-6 flex gap-4 p-1 rounded-xl hover:bg-amber-200/60"
            >
              <span className="text-2xl">👀</span>
            </button>

            {/* Nose & Ears */}
            <div className="flex items-center justify-between w-full px-2">
              <button
                onClick={() => handleRegionClick('ears')}
                className="text-xl p-1 rounded-full hover:bg-amber-200"
                title="Ear"
              >
                👂
              </button>
              <button
                onClick={() => handleRegionClick('nose')}
                className="text-xl p-1 rounded-full hover:bg-amber-200"
                title="Nose"
              >
                👃
              </button>
              <button
                onClick={() => handleRegionClick('ears')}
                className="text-xl p-1 rounded-full hover:bg-amber-200"
                title="Ear"
              >
                👂
              </button>
            </div>

            {/* Mouth */}
            <button
              onClick={() => handleRegionClick('mouth')}
              className="text-2xl mt-1 p-1 rounded-full hover:bg-amber-200"
              title="Mouth"
            >
              👄
            </button>
          </div>

          {/* Tummy & Arms */}
          <div className="relative w-full flex items-center justify-center my-3">
            {/* Left Hand */}
            <button
              onClick={() => handleRegionClick('hands')}
              className="p-2 rounded-2xl bg-amber-50 border border-amber-200 shadow-xs flex flex-col items-center hover:scale-105 active:scale-95"
            >
              <span className="text-2xl">✋</span>
              <span className="text-[10px] font-bold text-slate-600">Hand</span>
            </button>

            {/* Tummy */}
            <button
              onClick={() => handleRegionClick('tummy')}
              className="w-32 h-24 mx-2 rounded-3xl bg-blue-100 border-3 border-blue-300 flex flex-col items-center justify-center shadow-inner hover:scale-105 active:scale-95"
            >
              <span className="text-3xl">👕</span>
              <span className="text-xs font-bold text-blue-900 mt-1">Tummy / पेट</span>
            </button>

            {/* Right Hand */}
            <button
              onClick={() => handleRegionClick('hands')}
              className="p-2 rounded-2xl bg-amber-50 border border-amber-200 shadow-xs flex flex-col items-center hover:scale-105 active:scale-95"
            >
              <span className="text-2xl">✋</span>
              <span className="text-[10px] font-bold text-slate-600">Hand</span>
            </button>
          </div>

          {/* Legs */}
          <div className="flex gap-4">
            <button
              onClick={() => handleRegionClick('legs')}
              className="w-14 h-24 rounded-2xl bg-indigo-100 border-2 border-indigo-300 flex flex-col items-center justify-center hover:scale-105 active:scale-95"
            >
              <span className="text-2xl">🦵</span>
              <span className="text-[10px] font-bold text-indigo-900">Leg</span>
            </button>
            <button
              onClick={() => handleRegionClick('legs')}
              className="w-14 h-24 rounded-2xl bg-indigo-100 border-2 border-indigo-300 flex flex-col items-center justify-center hover:scale-105 active:scale-95"
            >
              <span className="text-2xl">🦵</span>
              <span className="text-[10px] font-bold text-indigo-900">Leg</span>
            </button>
          </div>
        </div>
      </div>

      <div className="text-center pb-5 font-rounded font-bold text-slate-500">
        {qIndex + 1} / {questions.length}
      </div>
    </div>
  );
}
