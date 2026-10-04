import { useState, useRef, useEffect, useCallback } from 'react';
import { BackButton } from '@/components/BackButton';
import { Confetti } from '@/components/Confetti';
import { TaraMascot } from '@/components/TaraMascot';
import { colors } from '@/theme';
import { playTone, useSpeech } from '@/hooks/useSpeech';
import type { TracingItem } from '@/types';
import tracingData from '@/data/tracing.json';
import lowercaseTracing from '@/data/lowercaseTracing.json';
import { Sparkles, RotateCcw, Eye, Edit3, CheckCircle2 } from 'lucide-react';

interface WritingAcademyScreenProps {
  onBack: () => void;
  onLetterCompleted: (id: string) => void;
}

export function WritingAcademyScreen({
  onBack,
  onLetterCompleted,
}: WritingAcademyScreenProps) {
  const [category, setCategory] = useState<'capital' | 'lowercase' | 'numbers'>('capital');
  const [index, setIndex] = useState(0);
  const [flowStep, setFlowStep] = useState<'learn' | 'trace' | 'practice'>('trace');
  const [showConfetti, setShowConfetti] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [userPoints, setUserPoints] = useState<Array<[number, number]>>([]);
  const [completedStrokes, setCompletedStrokes] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { speak } = useSpeech();

  const items: TracingItem[] =
    category === 'capital'
      ? (tracingData.english as TracingItem[])
      : category === 'lowercase'
      ? (lowercaseTracing as TracingItem[])
      : (tracingData.numbers as TracingItem[]);

  const currentItem = items[index] || items[0];

  const resetCanvas = useCallback(() => {
    setUserPoints([]);
    setCompletedStrokes(0);
    setShowConfetti(false);
  }, []);

  useEffect(() => {
    resetCanvas();
    const typeLabel =
      category === 'numbers' ? 'number' : category === 'capital' ? 'capital letter' : 'lowercase letter';
    speak(`Trace the ${typeLabel} ${currentItem.label}. Start at the green dot!`);
  }, [index, category, currentItem, speak, resetCanvas]);

  // Canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // 1. Digital writing board guidelines (ruled school paper lines)
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 6]);
    // Top guideline
    ctx.beginPath();
    ctx.moveTo(20, h * 0.22);
    ctx.lineTo(w - 20, h * 0.22);
    ctx.stroke();
    // Mid guideline
    ctx.beginPath();
    ctx.moveTo(20, h * 0.5);
    ctx.lineTo(w - 20, h * 0.5);
    ctx.stroke();
    // Base guideline
    ctx.beginPath();
    ctx.moveTo(20, h * 0.8);
    ctx.lineTo(w - 20, h * 0.8);
    ctx.stroke();
    ctx.setLineDash([]);

    // 2. Guide strokes
    if (flowStep !== 'practice') {
      currentItem.strokes.forEach((stroke, sIdx) => {
        if (stroke.length < 2) return;
        ctx.beginPath();
        ctx.moveTo((stroke[0][0] / 100) * w, (stroke[0][1] / 100) * h);
        for (let i = 1; i < stroke.length; i++) {
          ctx.lineTo((stroke[i][0] / 100) * w, (stroke[i][1] / 100) * h);
        }
        ctx.strokeStyle = sIdx < completedStrokes ? '#81C784' : '#E0E7FF';
        ctx.lineWidth = 36;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();

        // Directional stroke outline
        ctx.strokeStyle = sIdx < completedStrokes ? '#4CAF50' : '#A5B4FC';
        ctx.lineWidth = 3;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // Starting Green Dot
      const activeStrokeIdx = Math.min(completedStrokes, currentItem.strokes.length - 1);
      const activeStroke = currentItem.strokes[activeStrokeIdx];
      if (activeStroke && activeStroke.length > 0) {
        const startX = (activeStroke[0][0] / 100) * w;
        const startY = (activeStroke[0][1] / 100) * h;

        // Glowing pulse halo
        ctx.beginPath();
        ctx.arc(startX, startY, 20, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(74, 222, 128, 0.4)';
        ctx.fill();

        // Core green dot
        ctx.beginPath();
        ctx.arc(startX, startY, 12, 0, Math.PI * 2);
        ctx.fillStyle = '#22C55E';
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 3;
        ctx.stroke();
      }
    }

    // 3. User drawn finger trace
    if (userPoints.length > 1) {
      ctx.beginPath();
      ctx.moveTo(userPoints[0][0], userPoints[0][1]);
      for (let i = 1; i < userPoints.length; i++) {
        ctx.lineTo(userPoints[i][0], userPoints[i][1]);
      }
      ctx.strokeStyle = '#FF7043';
      ctx.lineWidth = 26;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    }
  }, [currentItem, userPoints, completedStrokes, flowStep]);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setUserPoints([[x, y]]);
    playTone('tap');
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setUserPoints((prev) => [...prev, [x, y]]);
  };

  const handlePointerUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    // Stroke completion logic
    if (userPoints.length > 8) {
      const nextStroke = completedStrokes + 1;
      setCompletedStrokes(nextStroke);
      playTone('correct');

      if (nextStroke >= currentItem.strokes.length) {
        // Complete letter!
        playTone('win');
        setShowConfetti(true);
        speak(`Excellent! You traced ${currentItem.label}!`);
        onLetterCompleted(currentItem.id);
      }
    }
  };

  return (
    <div
      className="flex flex-col h-full animate-fade-in select-none relative overflow-hidden"
      style={{
        background: `linear-gradient(160deg, #F8FAFC 0%, ${colors.pastels[index % 6]} 100%)`,
      }}
    >
      <Confetti active={showConfetti} />

      {/* Top bar */}
      <div className="flex items-center justify-between p-4 z-10">
        <BackButton onClick={onBack} />
        <h2 className="font-rounded font-bold text-2xl text-slate-800">
          Writing Academy
        </h2>
        <button
          onClick={resetCanvas}
          className="p-2.5 rounded-full bg-white text-slate-700 shadow-sm active:scale-95"
          title="Clear"
        >
          <RotateCcw size={20} />
        </button>
      </div>

      {/* Category Tabs: Capital / Lowercase / Numbers */}
      <div className="flex justify-center gap-2 px-4 mb-2 z-10">
        {[
          { key: 'capital', label: 'A-Z Capital' },
          { key: 'lowercase', label: 'a-z Small' },
          { key: 'numbers', label: '1-10 Numbers' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              playTone('tap');
              setCategory(tab.key as 'capital' | 'lowercase' | 'numbers');
              setIndex(0);
            }}
            className={`py-1.5 px-3 rounded-xl font-rounded font-bold text-xs transition-all ${
              category === tab.key
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-white/80 text-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Flow Mode Switcher: Learn -> Trace -> Practice */}
      <div className="flex justify-center gap-3 px-4 mb-2 z-10">
        {[
          { key: 'learn', label: '1. Watch', icon: Eye },
          { key: 'trace', label: '2. Trace', icon: Edit3 },
          { key: 'practice', label: '3. Practice', icon: CheckCircle2 },
        ].map((step) => {
          const Icon = step.icon;
          const isSel = flowStep === step.key;
          return (
            <button
              key={step.key}
              onClick={() => {
                playTone('tap');
                setFlowStep(step.key as 'learn' | 'trace' | 'practice');
                resetCanvas();
              }}
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-rounded font-bold transition-all ${
                isSel ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-200/80 text-slate-600'
              }`}
            >
              <Icon size={12} />
              <span>{step.label}</span>
            </button>
          );
        })}
      </div>

      {/* Digital Writing Board UI */}
      <div className="flex-1 flex flex-col items-center justify-center p-3 relative z-10">
        <div className="relative w-full max-w-[340px] aspect-[4/5] bg-white rounded-[2.5rem] shadow-2xl border-4 border-amber-300 p-2 flex flex-col items-center justify-center overflow-hidden">
          <canvas
            ref={canvasRef}
            width={320}
            height={380}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="touch-none cursor-crosshair w-full h-full"
          />

          {/* Large Letter Watermark in Practice Mode */}
          {flowStep === 'practice' && (
            <div className="absolute top-4 left-4 text-xs font-bold text-slate-400 uppercase">
              Write: {currentItem.label}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between px-6 pb-6 z-10 max-w-[380px] mx-auto w-full">
        <button
          onClick={() => index > 0 && setIndex((i) => i - 1)}
          disabled={index === 0}
          className="px-5 py-2.5 bg-white text-slate-700 font-rounded font-bold rounded-2xl shadow-sm disabled:opacity-30 active:scale-95 cursor-pointer"
        >
          ◀ Prev
        </button>

        <span className="font-rounded font-bold text-lg text-slate-800">
          {currentItem.label} ({index + 1}/{items.length})
        </span>

        <button
          onClick={() => index < items.length - 1 && setIndex((i) => i + 1)}
          disabled={index === items.length - 1}
          className="px-5 py-2.5 bg-amber-500 text-white font-rounded font-bold rounded-2xl shadow-md disabled:opacity-30 active:scale-95 cursor-pointer"
        >
          Next ▶
        </button>
      </div>
    </div>
  );
}
