import { useState } from 'react';
import { Confetti } from './Confetti';
import { TaraMascot } from './TaraMascot';
import { colors } from '@/theme';
import { playTone, useSpeech } from '@/hooks/useSpeech';
import { awardBadge, loadChildProfile } from '@/utils/profileStorage';
import { Sparkles, CheckCircle2, ArrowRight, X } from 'lucide-react';

interface TodaysAdventureModalProps {
  onClose: () => void;
  onStartStep: (stepRoute: string) => void;
  onFinishAdventure: () => void;
}

export function TodaysAdventureModal({
  onClose,
  onStartStep,
  onFinishAdventure,
}: TodaysAdventureModalProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [showConfetti, setShowConfetti] = useState(false);
  const { speak } = useSpeech();
  const profile = loadChildProfile();

  const handleStepComplete = () => {
    playTone('correct');
    if (step < 3) {
      setStep((s) => (s + 1) as 1 | 2 | 3 | 4);
    } else {
      // Completed all 3 steps!
      setStep(4);
      playTone('win');
      setShowConfetti(true);
      awardBadge('adventure_champ');
      speak(`Congratulations ${profile.name}! You finished Today's Adventure and earned the Daily Explorer Badge!`);
      onFinishAdventure();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in select-none">
      <Confetti active={showConfetti} />

      <div className="bg-white rounded-[2.5rem] p-6 max-w-[380px] w-full text-center shadow-2xl border-4 border-amber-300 relative animate-pop overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-transform active:scale-90"
        >
          <X size={20} />
        </button>

        <div className="flex justify-center mb-1">
          <TaraMascot size={74} animation={step === 4 ? 'cheer' : 'idle'} />
        </div>

        <div className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-900 rounded-full font-rounded font-bold text-xs mb-2">
          <Sparkles size={14} /> Daily Learning Quest
        </div>

        <h3 className="font-rounded font-bold text-3xl text-amber-950 mb-1">
          Today's Adventure
        </h3>

        {step < 4 ? (
          <>
            <p className="font-rounded text-sm text-slate-600 mb-5">
              Complete 3 quick steps to earn today's golden star!
            </p>

            {/* 3 Step Progress Cards */}
            <div className="flex flex-col gap-2.5 mb-6 text-left">
              {/* Step 1: Learn */}
              <div
                className={`p-3 rounded-2xl border-2 flex items-center justify-between ${
                  step > 1
                    ? 'bg-green-50 border-green-300 text-green-900'
                    : step === 1
                    ? 'bg-amber-50 border-amber-400 shadow-sm'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📖</span>
                  <div>
                    <span className="font-rounded font-bold text-sm block">1. Learn Letter B</span>
                    <span className="text-[11px] text-slate-500">Discover words & sounds</span>
                  </div>
                </div>
                {step > 1 ? (
                  <CheckCircle2 size={20} className="text-green-600" />
                ) : (
                  <button
                    onClick={handleStepComplete}
                    className="px-3 py-1 bg-amber-500 text-white rounded-xl text-xs font-bold shadow-xs active:scale-95"
                  >
                    Done ✓
                  </button>
                )}
              </div>

              {/* Step 2: Trace */}
              <div
                className={`p-3 rounded-2xl border-2 flex items-center justify-between ${
                  step > 2
                    ? 'bg-green-50 border-green-300 text-green-900'
                    : step === 2
                    ? 'bg-amber-50 border-amber-400 shadow-sm'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✏️</span>
                  <div>
                    <span className="font-rounded font-bold text-sm block">2. Trace Letter B</span>
                    <span className="text-[11px] text-slate-500">Practice finger writing</span>
                  </div>
                </div>
                {step > 2 ? (
                  <CheckCircle2 size={20} className="text-green-600" />
                ) : step === 2 ? (
                  <button
                    onClick={handleStepComplete}
                    className="px-3 py-1 bg-amber-500 text-white rounded-xl text-xs font-bold shadow-xs active:scale-95"
                  >
                    Done ✓
                  </button>
                ) : null}
              </div>

              {/* Step 3: Game */}
              <div
                className={`p-3 rounded-2xl border-2 flex items-center justify-between ${
                  step > 3
                    ? 'bg-green-50 border-green-300 text-green-900'
                    : step === 3
                    ? 'bg-amber-50 border-amber-400 shadow-sm'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🎮</span>
                  <div>
                    <span className="font-rounded font-bold text-sm block">3. Play Mini Game</span>
                    <span className="text-[11px] text-slate-500">Find the Letter</span>
                  </div>
                </div>
                {step > 3 ? (
                  <CheckCircle2 size={20} className="text-green-600" />
                ) : step === 3 ? (
                  <button
                    onClick={handleStepComplete}
                    className="px-3 py-1 bg-amber-500 text-white rounded-xl text-xs font-bold shadow-xs active:scale-95"
                  >
                    Play ✓
                  </button>
                ) : null}
              </div>
            </div>
          </>
        ) : (
          <div className="py-4 flex flex-col items-center animate-slide-up">
            <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center text-4xl mb-3 shadow-inner">
              🏆
            </div>
            <h4 className="font-rounded font-bold text-2xl text-amber-950 mb-1">
              Quest Complete!
            </h4>
            <p className="font-rounded text-sm text-slate-600 mb-6">
              You earned the <b>Daily Explorer Badge</b> and +3 Bonus Stars!
            </p>
            <button
              onClick={onClose}
              className="w-full py-3.5 px-6 rounded-2xl bg-green-500 hover:bg-green-600 text-white font-rounded font-bold text-lg shadow-lg active:scale-95"
            >
              Collect Rewards ⭐
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
