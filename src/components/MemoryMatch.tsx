import { useState, useEffect } from 'react';
import { Confetti } from './Confetti';
import { colors } from '@/theme';
import { useSpeech, playTone } from '@/hooks/useSpeech';
import { shuffle } from '@/utils/shuffle';

export interface MemoryCardItem {
  id: string;
  name: string;
  display: string; // emoji, character, or SVG
  matchKey: string;
}

interface MemoryMatchProps {
  items: MemoryCardItem[]; // at least 6 items
  onComplete: () => void;
  title?: string;
}

export function MemoryMatch({
  items,
  onComplete,
  title = 'Memory Match',
}: MemoryMatchProps) {
  const [difficulty, setDifficulty] = useState<4 | 6 | 12>(6);
  const [cards, setCards] = useState<Array<MemoryCardItem & { instanceId: number }>>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [showConfetti, setShowConfetti] = useState(false);
  const { speak } = useSpeech();

  const initGame = (pairCount: number) => {
    const selected = shuffle([...items]).slice(0, pairCount / 2);
    // Duplicate to form pairs
    const deck = shuffle(
      selected.flatMap((item, idx) => [
        { ...item, instanceId: idx * 2 },
        { ...item, instanceId: idx * 2 + 1 },
      ])
    );
    setCards(deck);
    setFlipped([]);
    setMatched(new Set());
    setShowConfetti(false);
  };

  useEffect(() => {
    initGame(difficulty);
  }, [difficulty]);

  const handleCardClick = (instanceId: number, card: MemoryCardItem) => {
    if (flipped.length >= 2 || flipped.includes(instanceId) || matched.has(instanceId)) {
      return;
    }

    playTone('tap');
    speak(card.name);

    const nextFlipped = [...flipped, instanceId];
    setFlipped(nextFlipped);

    if (nextFlipped.length === 2) {
      const firstCard = cards.find((c) => c.instanceId === nextFlipped[0]);
      const secondCard = cards.find((c) => c.instanceId === nextFlipped[1]);

      if (firstCard && secondCard && firstCard.matchKey === secondCard.matchKey) {
        // Matched!
        playTone('correct');
        const nextMatched = new Set(matched);
        nextMatched.add(firstCard.instanceId);
        nextMatched.add(secondCard.instanceId);
        setMatched(nextMatched);
        setFlipped([]);

        if (nextMatched.size === cards.length) {
          // Win!
          playTone('win');
          setShowConfetti(true);
          onComplete();
        }
      } else {
        // Mismatch - flip back after 1.2s
        setTimeout(() => {
          setFlipped([]);
        }, 1200);
      }
    }
  };

  const getGridCols = () => {
    if (difficulty === 4) return 'grid-cols-2';
    if (difficulty === 6) return 'grid-cols-3';
    return 'grid-cols-3 sm:grid-cols-4';
  };

  return (
    <div className="flex flex-col items-center h-full w-full select-none">
      <Confetti active={showConfetti} />

      {/* Difficulty Switcher */}
      <div className="flex gap-2 mb-4">
        {[
          { label: 'Easy (4)', count: 4 },
          { label: 'Medium (6)', count: 6 },
          { label: 'Hard (12)', count: 12 },
        ].map((diff) => (
          <button
            key={diff.count}
            onClick={() => {
              playTone('tap');
              setDifficulty(diff.count as 4 | 6 | 12);
            }}
            className={`px-3 py-1.5 rounded-xl font-rounded font-bold text-xs transition-all ${
              difficulty === diff.count
                ? 'bg-amber-500 text-white shadow-sm scale-105'
                : 'bg-white/80 text-slate-700 hover:bg-white'
            }`}
          >
            {diff.label}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      <div className={`grid ${getGridCols()} gap-3 w-full max-w-[340px] p-2 flex-1 items-center`}>
        {cards.map((card) => {
          const isOpen = flipped.includes(card.instanceId) || matched.has(card.instanceId);
          const isDone = matched.has(card.instanceId);

          return (
            <button
              key={card.instanceId}
              onClick={() => handleCardClick(card.instanceId, card)}
              className={`aspect-square rounded-2xl flex items-center justify-center p-2 shadow-md transition-all duration-300 ${
                isOpen
                  ? isDone
                    ? 'bg-green-100 border-2 border-green-400 scale-95 opacity-80'
                    : 'bg-white border-3 border-amber-400 scale-105 shadow-lg'
                  : 'bg-gradient-to-br from-amber-400 to-amber-500 hover:scale-105 active:scale-95 text-white'
              }`}
            >
              {isOpen ? (
                <span className="text-4xl animate-pop">{card.display}</span>
              ) : (
                <span className="text-3xl opacity-80">⭐</span>
              )}
            </button>
          );
        })}
      </div>

      {showConfetti && (
        <div className="mt-2 mb-4 animate-slide-up">
          <button
            onClick={() => initGame(difficulty)}
            className="px-6 py-2.5 bg-green-500 text-white font-rounded font-bold text-lg rounded-2xl shadow-lg active:scale-95"
          >
            Play Again ➔
          </button>
        </div>
      )}
    </div>
  );
}
