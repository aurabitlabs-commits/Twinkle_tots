import { useEffect, useRef, useState, useCallback } from 'react';
import { playTone } from '@/hooks/useSpeech';

interface TracingCanvasProps {
  strokes: number[][][]; // each stroke is list of [x, y] in 0..100
  onComplete: () => void;
  tolerance?: number;
}

export function TracingCanvas({
  strokes,
  onComplete,
  tolerance = 14,
}: TracingCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentStrokeIdx, setCurrentStrokeIdx] = useState(0);
  const [completedStrokes, setCompletedStrokes] = useState<number[]>([]);
  const [drawnPath, setDrawnPath] = useState<Array<[number, number]>>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [demoPos, setDemoPos] = useState<[number, number] | null>(null);
  const [showDemo, setShowDemo] = useState(true);

  const waypointsReachedRef = useRef<Set<number>>(new Set());
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentStroke = strokes[currentStrokeIdx] || [];

  // Generate interpolated waypoints along current stroke
  const getWaypoints = useCallback((pts: number[][]) => {
    const waypoints: Array<[number, number]> = [];
    if (pts.length < 2) return waypoints;

    for (let i = 0; i < pts.length - 1; i++) {
      const [x1, y1] = pts[i];
      const [x2, y2] = pts[i + 1];
      const dist = Math.hypot(x2 - x1, y2 - y1);
      const steps = Math.max(1, Math.floor(dist / 4));
      for (let s = 0; s <= steps; s++) {
        const t = s / steps;
        waypoints.push([x1 + (x2 - x1) * t, y1 + (y2 - y1) * t]);
      }
    }
    return waypoints;
  }, []);

  const waypoints = getWaypoints(currentStroke);

  // Play demo animation
  const runDemoAnimation = useCallback(() => {
    if (currentStroke.length < 2) return;
    setShowDemo(true);
    let step = 0;
    const totalSteps = 40;
    const interval = setInterval(() => {
      step++;
      const t = step / totalSteps;
      const totalLen = currentStroke.length - 1;
      const segIndex = Math.min(Math.floor(t * totalLen), totalLen - 1);
      const segT = (t * totalLen) - segIndex;
      const p1 = currentStroke[segIndex];
      const p2 = currentStroke[segIndex + 1];
      if (p1 && p2) {
        setDemoPos([p1[0] + (p2[0] - p1[0]) * segT, p1[1] + (p2[1] - p1[1]) * segT]);
      }
      if (step >= totalSteps) {
        clearInterval(interval);
        setTimeout(() => setShowDemo(false), 500);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [currentStroke]);

  // Trigger demo on stroke change or after 6s idle
  useEffect(() => {
    waypointsReachedRef.current.clear();
    setDrawnPath([]);
    const stopAnim = runDemoAnimation();

    const resetIdleTimer = () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
        runDemoAnimation();
      }, 6000);
    };

    resetIdleTimer();

    return () => {
      stopAnim?.();
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [currentStrokeIdx, runDemoAnimation]);

  const handlePointerDown = (e: React.PointerEvent) => {
    setShowDemo(false);
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setIsDrawing(true);
    setDrawnPath([[x, y]]);

    // Check if close to start dot
    const startPt = currentStroke[0];
    if (startPt && Math.hypot(x - startPt[0], y - startPt[1]) <= tolerance * 1.5) {
      waypointsReachedRef.current.add(0);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDrawing || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setDrawnPath((prev) => [...prev, [x, y]]);

    // Check against waypoints
    waypoints.forEach((wp, idx) => {
      if (Math.hypot(x - wp[0], y - wp[1]) <= tolerance) {
        waypointsReachedRef.current.add(idx);
      }
    });

    // Check if stroke completed (>= 80% waypoints passed)
    if (waypoints.length > 0) {
      const reachedCount = waypointsReachedRef.current.size;
      const progress = reachedCount / waypoints.length;

      if (progress >= 0.8) {
        // Complete current stroke!
        playTone('chime');
        const nextIdx = currentStrokeIdx + 1;
        setCompletedStrokes((prev) => [...prev, currentStrokeIdx]);
        setIsDrawing(false);
        setDrawnPath([]);

        if (nextIdx < strokes.length) {
          setCurrentStrokeIdx(nextIdx);
        } else {
          // All strokes complete!
          setTimeout(onComplete, 400);
        }
      }
    }
  };

  const handlePointerUp = () => {
    setIsDrawing(false);
    // If not completed, fade out drawn path
    setTimeout(() => {
      setDrawnPath([]);
    }, 400);
  };

  const startPt = currentStroke[0];

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className="relative w-full aspect-square max-w-[340px] mx-auto rounded-[2rem] bg-white shadow-lg border-4 border-amber-200 select-none touch-none overflow-hidden"
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* All faint guide strokes */}
        {strokes.map((stroke, sIdx) => {
          const pathD = stroke.reduce(
            (acc, [x, y], idx) => (idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`),
            ''
          );
          const isCompleted = completedStrokes.includes(sIdx);
          const isCurrent = sIdx === currentStrokeIdx;

          return (
            <path
              key={sIdx}
              d={pathD}
              fill="none"
              stroke={isCompleted ? '#66BB6A' : isCurrent ? '#FFE082' : '#F0F0F0'}
              strokeWidth={isCompleted ? '14' : '16'}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-colors duration-300"
            />
          );
        })}

        {/* Start dot with pulse and number */}
        {startPt && !completedStrokes.includes(currentStrokeIdx) && (
          <g>
            <circle
              cx={startPt[0]}
              cy={startPt[1]}
              r="7"
              fill="#FF8C42"
              className="animate-pulse"
            />
            <circle
              cx={startPt[0]}
              cy={startPt[1]}
              r="4"
              fill="#FFFFFF"
            />
            <text
              x={startPt[0]}
              y={startPt[1] + 2}
              textAnchor="middle"
              fontSize="6"
              fontWeight="bold"
              fill="#FF8C42"
            >
              {currentStrokeIdx + 1}
            </text>
          </g>
        )}

        {/* Child's live drawn ink */}
        {drawnPath.length > 1 && (
          <path
            d={drawnPath.reduce(
              (acc, [x, y], idx) => (idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`),
              ''
            )}
            fill="none"
            stroke="#4FC3F7"
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-90"
          />
        )}

        {/* Demo animated hand indicator */}
        {showDemo && demoPos && (
          <g transform={`translate(${demoPos[0] - 6}, ${demoPos[1] - 6})`}>
            <circle cx="6" cy="6" r="6" fill="#FF8C42" opacity="0.8" />
            <text x="6" y="9" textAnchor="middle" fontSize="8" fill="#FFF">
              👆
            </text>
          </g>
        )}
      </svg>

      {/* Stroke instruction banner */}
      <div className="absolute bottom-2 left-0 right-0 text-center pointer-events-none">
        <span className="bg-amber-50 text-amber-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
          Stroke {Math.min(currentStrokeIdx + 1, strokes.length)} of {strokes.length}
        </span>
      </div>
    </div>
  );
}
