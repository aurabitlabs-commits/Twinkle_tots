import { useState, useEffect } from 'react';
import { BackButton } from '@/components/BackButton';
import { Confetti } from '@/components/Confetti';
import { EndRoundScreen } from '@/components/EndRoundScreen';
import { ShapeView } from '@/components/ShapeView';
import { colors } from '@/theme';
import { useSpeech, playTone } from '@/hooks/useSpeech';
import { shuffle } from '@/utils/shuffle';
import shapesData from '@/data/shapes.json';
import type { ShapeEntry } from '@/types';

interface ShapeSorterProps {
  onBack: () => void;
  onHome: () => void;
  addStars: (count: number, topicId?: string) => void;
}

interface SorterPuzzle {
  shapes: ShapeEntry[];
  colors: string[];
}

const colorPalette = ['#FF7043', '#42A5F5', '#66BB6A', '#AB47BC', '#FFA726', '#EC407A', '#26A69A'];

function generatePuzzles(allShapes: ShapeEntry[], count = 5): SorterPuzzle[] {
  const puzzles: SorterPuzzle[] = [];
  for (let i = 0; i < count; i++) {
    const selected = shuffle(allShapes).slice(0, 3);
    const assignedColors = shuffle(colorPalette).slice(0, 3);
    puzzles.push({ shapes: selected, colors: assignedColors });
  }
  return puzzles;
}

export function ShapeSorterScreen({ onBack, onHome, addStars }: ShapeSorterProps) {
  const allShapes = shapesData as ShapeEntry[];
  const [puzzles] = useState(() => generatePuzzles(allShapes, 5));
  const [puzzleIdx, setPuzzleIdx] = useState(0);
  const [placedHoles, setPlacedHoles] = useState<Set<string>>(new Set());
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const { speak } = useSpeech();

  const currentPuzzle = puzzles[puzzleIdx];
  // Shuffle placement slots at top and bottom so they're in different orders
  const [holeOrder, setHoleOrder] = useState<ShapeEntry[]>([]);
  const [shapeOrder, setShapeOrder] = useState<ShapeEntry[]>([]);

  useEffect(() => {
    if (currentPuzzle) {
      setHoleOrder(shuffle([...currentPuzzle.shapes]));
      setShapeOrder(shuffle([...currentPuzzle.shapes]));
      setPlacedHoles(new Set());
      setSelectedShapeId(null);
      speak('Match the shapes!');
    }
  }, [puzzleIdx, currentPuzzle, speak]);

  const handleShapeSelect = (shapeId: string) => {
    if (placedHoles.has(shapeId)) return;
    playTone('tap');
    setSelectedShapeId(shapeId);
    const shape = allShapes.find((s) => s.id === shapeId);
    if (shape) speak(shape.nameEn);
  };

  const handleHoleTap = (holeShapeId: string) => {
    if (placedHoles.has(holeShapeId)) return;

    if (!selectedShapeId) {
      playTone('tap');
      return;
    }

    if (selectedShapeId === holeShapeId) {
      // Correct match!
      playTone('snap');
      const nextPlaced = new Set(placedHoles);
      nextPlaced.add(holeShapeId);
      setPlacedHoles(nextPlaced);
      setSelectedShapeId(null);

      if (nextPlaced.size === 3) {
        // Completed this puzzle!
        playTone('win');
        setShowConfetti(true);
        addStars(1, 'shapes');

        setTimeout(() => {
          setShowConfetti(false);
          if (puzzleIdx < puzzles.length - 1) {
            setPuzzleIdx((p) => p + 1);
          } else {
            setIsDone(true);
          }
        }, 1800);
      }
    } else {
      // Gentle wrong boing feedback
      playTone('wrong');
      setSelectedShapeId(null);
    }
  };

  if (isDone) {
    return (
      <>
        <Confetti active={showConfetti} />
        <div
          className="h-full animate-fade-in"
          style={{ background: `linear-gradient(160deg, ${colors.pastels[2]}, ${colors.pastels[4]})` }}
        >
          <EndRoundScreen
            stars={3}
            onPlayAgain={() => {
              setPuzzleIdx(0);
              setIsDone(false);
            }}
            onHome={onHome}
          />
        </div>
      </>
    );
  }

  return (
    <div
      className="flex flex-col h-full animate-fade-in select-none relative"
      style={{
        background: `linear-gradient(160deg, ${colors.pastels[puzzleIdx % 6]} 0%, ${colors.pastels[(puzzleIdx + 2) % 6]} 100%)`,
      }}
    >
      <Confetti active={showConfetti} />

      {/* Top bar */}
      <div className="flex items-center justify-between p-4">
        <BackButton onClick={onBack} />
        <h2 className="font-rounded font-bold text-2xl" style={{ color: colors.ink }}>
          Shape Sorter
        </h2>
        <div className="bg-white/80 px-3 py-1.5 rounded-full font-bold text-slate-700 shadow-sm">
          {puzzleIdx + 1} / {puzzles.length}
        </div>
      </div>

      {/* Instructions */}
      <div className="text-center px-4 my-1">
        <p className="font-rounded font-semibold text-slate-700 text-lg">
          {selectedShapeId ? 'Now tap the matching outline hole! 🎯' : 'Tap a shape at the bottom! 👇'}
        </p>
      </div>

      {/* Top Section: 3 Outline Holes */}
      <div className="p-4 flex items-center justify-center">
        <div className="w-full max-w-[360px] rounded-[2rem] bg-white/90 p-4 shadow-md flex justify-around items-center min-h-[140px]">
          {holeOrder.map((holeShape) => {
            const isFilled = placedHoles.has(holeShape.id);
            const shapeColor = currentPuzzle.colors[currentPuzzle.shapes.findIndex((s) => s.id === holeShape.id)] || '#FF8C42';

            return (
              <button
                key={holeShape.id}
                onClick={() => handleHoleTap(holeShape.id)}
                className={`relative flex items-center justify-center rounded-2xl p-2 transition-transform duration-200 cursor-pointer ${
                  selectedShapeId ? 'hover:scale-110 active:scale-95' : ''
                }`}
              >
                {isFilled ? (
                  <div className="animate-pop">
                    <ShapeView shapeId={holeShape.id} color={shapeColor} size={76} />
                  </div>
                ) : (
                  <div className="border-3 border-dashed border-slate-400 bg-slate-100/60 rounded-2xl p-2 flex items-center justify-center">
                    <ShapeView
                      shapeId={holeShape.id}
                      color="transparent"
                      stroke="#64748B"
                      strokeWidth={4}
                      size={68}
                    />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1" />

      {/* Bottom Section: 3 Colored Shapes to Pick */}
      <div className="p-4 pb-8 flex items-center justify-center">
        <div className="w-full max-w-[360px] rounded-[2rem] bg-white p-5 shadow-lg flex justify-around items-center min-h-[140px]">
          {shapeOrder.map((shape) => {
            const isPlaced = placedHoles.has(shape.id);
            const isSelected = selectedShapeId === shape.id;
            const shapeColor = currentPuzzle.colors[currentPuzzle.shapes.findIndex((s) => s.id === shape.id)] || '#FF8C42';

            return (
              <button
                key={shape.id}
                disabled={isPlaced}
                onClick={() => handleShapeSelect(shape.id)}
                className={`relative flex items-center justify-center rounded-2xl p-2 transition-all duration-200 ${
                  isPlaced
                    ? 'opacity-20 pointer-events-none scale-90'
                    : isSelected
                    ? 'scale-120 ring-4 ring-amber-400 bg-amber-50 shadow-md animate-bounce-gentle'
                    : 'hover:scale-105 active:scale-90 cursor-pointer'
                }`}
              >
                <ShapeView shapeId={shape.id} color={shapeColor} size={76} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
