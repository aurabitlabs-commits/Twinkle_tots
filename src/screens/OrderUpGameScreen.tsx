import { useState, useEffect } from 'react';
import { BackButton } from '@/components/BackButton';
import { Confetti } from '@/components/Confetti';
import { TaraMascot } from '@/components/TaraMascot';
import { EndRoundScreen } from '@/components/EndRoundScreen';
import { colors } from '@/theme';
import { playTone, useSpeech } from '@/hooks/useSpeech';
import { shuffle } from '@/utils/shuffle';
import { orderedDays, MONTHS, type DayItem, type MonthItem } from '@/utils/calendar';
import { RotateCcw, Check, Sparkles } from 'lucide-react';

interface OrderUpGameScreenProps {
  onBack: () => void;
  addStars: (count: number) => void;
  level: 1 | 2 | 3;
  weekStart?: 'sun' | 'mon';
}

export function OrderUpGameScreen({
  onBack,
  addStars,
  level,
  weekStart = 'sun',
}: OrderUpGameScreenProps) {
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [placedItems, setPlacedItems] = useState<Array<DayItem | MonthItem>>([]);
  const [unplacedPool, setUnplacedPool] = useState<Array<DayItem | MonthItem>>([]);
  const [targetSequence, setTargetSequence] = useState<Array<DayItem | MonthItem>>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isPuzzleSolved, setIsPuzzleSolved] = useState(false);
  const [solvedCount, setSolvedCount] = useState(0);
  const { speak, stop } = useSpeech();

  const days = orderedDays(weekStart);

  const initPuzzle = () => {
    setIsPuzzleSolved(false);
    setShowConfetti(false);
    setPlacedItems([]);

    let target: Array<DayItem | MonthItem> = [];
    if (level === 1) {
      // 3 consecutive days
      const start = Math.floor(Math.random() * 5);
      target = days.slice(start, start + 3);
    } else if (level === 2) {
      // all 7 days
      target = [...days];
    } else {
      // 6 months (stage 1: Jan-Jun, stage 2: Jul-Dec)
      target = puzzleIndex % 2 === 0 ? MONTHS.slice(0, 6) : MONTHS.slice(6, 12);
    }

    setTargetSequence(target);
    setUnplacedPool(shuffle([...target]));
    speak('Put them in the right order!');
  };

  useEffect(() => {
    initPuzzle();
  }, [puzzleIndex, level]);

  const handleSelectCard = (item: DayItem | MonthItem) => {
    if (isPuzzleSolved) return;
    const nextSlotIndex = placedItems.length;
    const expected = targetSequence[nextSlotIndex];

    if (item.id === expected.id) {
      // Correct placement!
      playTone('correct');
      speak(item.en);
      const nextPlaced = [...placedItems, item];
      setPlacedItems(nextPlaced);
      setUnplacedPool((pool) => pool.filter((p) => p.id !== item.id));

      if (nextPlaced.length === targetSequence.length) {
        // Solved puzzle!
        setIsPuzzleSolved(true);
        setShowConfetti(true);
        playTone('win');
        addStars(1);
        setSolvedCount((c) => c + 1);

        // Read aloud the whole sequence
        setTimeout(() => {
          speak(`Great job! You ordered the sequence!`);
        }, 800);
      }
    } else {
      // Wrong slot bounce
      playTone('wrong');
      speak('Not this one! Try another.');
    }
  };

  const handleNextPuzzle = () => {
    if (puzzleIndex < 2) {
      setPuzzleIndex((i) => i + 1);
    } else {
      // All 3 puzzles done!
      setPuzzleIndex(3);
    }
  };

  if (puzzleIndex >= 3) {
    return (
      <div
        className="flex flex-col h-full animate-fade-in"
        style={{
          background: `linear-gradient(160deg, ${colors.pastels[0]}, ${colors.pastels[3]})`,
        }}
      >
        <EndRoundScreen
          stars={solvedCount >= 3 ? 3 : 2}
          onPlayAgain={() => {
            setPuzzleIndex(0);
            setSolvedCount(0);
            initPuzzle();
          }}
          onHome={onBack}
        />
      </div>
    );
  }

  return (
    <div
      className="flex flex-col h-full animate-fade-in select-none relative overflow-y-auto"
      style={{
        background: `linear-gradient(160deg, #E3F2FD 0%, #FFFFFF 60%, #E8F5E9 100%)`,
      }}
    >
      <Confetti active={showConfetti} />

      {/* Top bar */}
      <div className="flex items-center justify-between p-4 sticky top-0 bg-white/70 backdrop-blur-sm z-20 shadow-xs">
        <BackButton onClick={onBack} />
        <h2 className="font-rounded font-bold text-2xl text-slate-800">
          Order Up
        </h2>
        <button
          onClick={initPuzzle}
          className="p-2.5 rounded-full bg-white text-slate-700 shadow-sm active:scale-95"
          title="Reset"
        >
          <RotateCcw size={18} />
        </button>
      </div>

      <div className="p-4 flex flex-col items-center gap-3.5 max-w-[420px] mx-auto w-full pb-8">
        <span className="font-rounded font-bold text-xs text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
          Puzzle {puzzleIndex + 1} of 3
        </span>

        {/* Target Sequence Slots */}
        <div className="w-full bg-white rounded-3xl p-4 shadow-md border-3 border-blue-200 flex flex-col gap-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase text-center block">
            Tap the cards in order:
          </span>

          <div className="flex flex-wrap gap-2 justify-center">
            {targetSequence.map((target, idx) => {
              const placed = placedItems[idx];

              return (
                <div
                  key={idx}
                  className={`min-w-[85px] py-2 px-3 rounded-2xl flex flex-col items-center justify-center font-rounded transition-all ${
                    placed
                      ? 'bg-green-100 border-2 border-green-500 text-green-950 scale-105 shadow-xs'
                      : idx === placedItems.length
                      ? 'bg-blue-50 border-2 border-dashed border-blue-400 text-blue-500 animate-pulse'
                      : 'bg-slate-50 border-2 border-dashed border-slate-300 text-slate-300'
                  }`}
                >
                  <span className="text-[10px] font-bold opacity-75">#{idx + 1}</span>
                  <span className="text-sm font-extrabold truncate max-w-[80px]">
                    {placed ? placed.en : '?'}
                  </span>
                  {placed && (
                    <span className="text-[10px] text-green-800 font-bold truncate max-w-[80px]">
                      {placed.hi}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Shuffled Available Cards */}
        <div className="w-full my-2">
          <span className="text-xs font-bold text-slate-500 uppercase block text-center mb-2">
            Available Cards:
          </span>

          <div className="flex flex-wrap gap-2.5 justify-center">
            {unplacedPool.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelectCard(item)}
                className="py-2.5 px-4 rounded-2xl bg-white shadow-md border-2 border-slate-200 font-rounded font-extrabold text-base text-slate-900 active:scale-90 hover:scale-105 transition-transform cursor-pointer flex flex-col items-center"
              >
                <span>{item.en}</span>
                <span className="text-xs text-slate-500 font-bold">{item.hi}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Next puzzle action if solved */}
        {isPuzzleSolved && (
          <button
            onClick={handleNextPuzzle}
            className="w-full mt-2 py-3.5 px-6 rounded-2xl bg-green-500 hover:bg-green-600 text-white font-rounded font-bold text-lg shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2 cursor-pointer animate-pop"
          >
            <span>{puzzleIndex < 2 ? 'Next Puzzle ➔' : 'Finish Game 🏆'}</span>
          </button>
        )}
      </div>
    </div>
  );
}
