import { useState } from 'react';
import { BackButton } from '@/components/BackButton';
import { Confetti } from '@/components/Confetti';
import { colors } from '@/theme';
import { useSpeech, playTone } from '@/hooks/useSpeech';
import colorsData from '@/data/colors.json';
import type { ColorEntry } from '@/types';
import { RotateCcw, Trash2, CheckCircle2 } from 'lucide-react';

interface PaintScreenProps {
  onBack: () => void;
  addStars: (count: number, topicId?: string) => void;
}

type PictureType = 'house' | 'rocket' | 'fish' | 'icecream';

export function PaintScreen({ onBack, addStars }: PaintScreenProps) {
  const colorList = colorsData as ColorEntry[];
  const [activeColor, setActiveColor] = useState<string>(colorList[0].hex);
  const [activePicture, setActivePicture] = useState<PictureType>('house');
  const [regionColors, setRegionColors] = useState<Record<string, string>>({});
  const [history, setHistory] = useState<Array<Record<string, string>>>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const { speakBilingual } = useSpeech();

  const handleColorSelect = (color: ColorEntry) => {
    playTone('tap');
    setActiveColor(color.hex);
    speakBilingual(color.nameEn, color.nameHi);
  };

  const handleRegionClick = (regionId: string) => {
    playTone('pop');
    setHistory((prev) => [...prev, { ...regionColors }]);
    setRegionColors((prev) => ({
      ...prev,
      [regionId]: activeColor,
    }));
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    playTone('tap');
    const prev = history[history.length - 1];
    setRegionColors(prev);
    setHistory((h) => h.slice(0, -1));
  };

  const handleClear = () => {
    playTone('tap');
    setHistory((prev) => [...prev, { ...regionColors }]);
    setRegionColors({});
  };

  const handleDone = () => {
    playTone('win');
    setShowConfetti(true);
    addStars(1, 'colors');
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const getFill = (regionId: string, defaultColor = '#FFFFFF') => {
    return regionColors[regionId] || defaultColor;
  };

  return (
    <div
      className="flex flex-col h-full animate-fade-in select-none relative overflow-hidden"
      style={{
        background: `linear-gradient(160deg, ${colors.pastels[3]} 0%, ${colors.pastels[1]} 100%)`,
      }}
    >
      <Confetti active={showConfetti} />

      {/* Top bar */}
      <div className="flex items-center justify-between p-4">
        <BackButton onClick={onBack} />
        <h2 className="font-rounded font-bold text-2xl" style={{ color: colors.ink }}>
          Paint / रंग भरो
        </h2>
        <button
          onClick={handleDone}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full font-rounded font-bold text-white bg-green-500 shadow-md transition-transform active:scale-95 cursor-pointer"
        >
          <CheckCircle2 size={20} />
          Done
        </button>
      </div>

      {/* Picture Selector Tabs */}
      <div className="flex justify-center gap-2 px-4 mb-2">
        {(['house', 'rocket', 'fish', 'icecream'] as PictureType[]).map((p) => (
          <button
            key={p}
            onClick={() => {
              playTone('tap');
              setActivePicture(p);
              setRegionColors({});
              setHistory([]);
            }}
            className={`rounded-xl px-3 py-1.5 font-rounded font-bold text-sm transition-all capitalize ${
              activePicture === p
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-white/80 text-slate-700 hover:bg-white'
            }`}
          >
            {p === 'house' ? '🏠 House' : p === 'rocket' ? '🚀 Rocket' : p === 'fish' ? '🐟 Fish' : '🍦 Ice Cream'}
          </button>
        ))}
      </div>

      {/* Canvas Area */}
      <div className="flex-1 flex items-center justify-center p-3 relative">
        <div className="w-full max-w-[340px] aspect-square bg-white rounded-3xl p-3 shadow-lg border-4 border-amber-200 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full cursor-pointer">
            {activePicture === 'house' && (
              <g stroke="#2D3A4B" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round">
                {/* Roof */}
                <polygon
                  points="50,15 15,45 85,45"
                  fill={getFill('roof')}
                  onClick={() => handleRegionClick('roof')}
                />
                {/* Wall */}
                <rect
                  x="22"
                  y="45"
                  width="56"
                  height="45"
                  fill={getFill('wall')}
                  onClick={() => handleRegionClick('wall')}
                />
                {/* Door */}
                <rect
                  x="40"
                  y="62"
                  width="20"
                  height="28"
                  fill={getFill('door')}
                  onClick={() => handleRegionClick('door')}
                />
                {/* Window */}
                <circle
                  cx="50"
                  cy="32"
                  r="7"
                  fill={getFill('attic_win')}
                  onClick={() => handleRegionClick('attic_win')}
                />
              </g>
            )}

            {activePicture === 'rocket' && (
              <g stroke="#2D3A4B" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round">
                {/* Body */}
                <path
                  d="M 50 15 C 65 35 65 65 50 78 C 35 65 35 35 50 15 Z"
                  fill={getFill('rocket_body')}
                  onClick={() => handleRegionClick('rocket_body')}
                />
                {/* Left fin */}
                <polygon
                  points="36,55 18,75 36,75"
                  fill={getFill('left_fin')}
                  onClick={() => handleRegionClick('left_fin')}
                />
                {/* Right fin */}
                <polygon
                  points="64,55 82,75 64,75"
                  fill={getFill('right_fin')}
                  onClick={() => handleRegionClick('right_fin')}
                />
                {/* Window */}
                <circle
                  cx="50"
                  cy="40"
                  r="9"
                  fill={getFill('rocket_win')}
                  onClick={() => handleRegionClick('rocket_win')}
                />
                {/* Flame */}
                <polygon
                  points="42,78 50,94 58,78"
                  fill={getFill('rocket_flame', '#FFD54F')}
                  onClick={() => handleRegionClick('rocket_flame')}
                />
              </g>
            )}

            {activePicture === 'fish' && (
              <g stroke="#2D3A4B" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round">
                {/* Body */}
                <ellipse
                  cx="48"
                  cy="50"
                  rx="32"
                  ry="24"
                  fill={getFill('fish_body')}
                  onClick={() => handleRegionClick('fish_body')}
                />
                {/* Tail */}
                <polygon
                  points="78,50 94,28 94,72"
                  fill={getFill('fish_tail')}
                  onClick={() => handleRegionClick('fish_tail')}
                />
                {/* Eye */}
                <circle cx="32" cy="44" r="5" fill="#FFFFFF" />
                <circle cx="30" cy="44" r="2.5" fill="#2D3A4B" />
                {/* Fin */}
                <path
                  d="M 44 48 C 54 48 54 62 44 62 Z"
                  fill={getFill('fish_fin')}
                  onClick={() => handleRegionClick('fish_fin')}
                />
              </g>
            )}

            {activePicture === 'icecream' && (
              <g stroke="#2D3A4B" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round">
                {/* Cone */}
                <polygon
                  points="30,55 70,55 50,92"
                  fill={getFill('cone', '#FFE082')}
                  onClick={() => handleRegionClick('cone')}
                />
                {/* Scoop 1 */}
                <circle
                  cx="50"
                  cy="42"
                  r="22"
                  fill={getFill('scoop_1')}
                  onClick={() => handleRegionClick('scoop_1')}
                />
                {/* Cherry */}
                <circle
                  cx="50"
                  cy="16"
                  r="7"
                  fill={getFill('cherry', '#E53935')}
                  onClick={() => handleRegionClick('cherry')}
                />
              </g>
            )}
          </svg>
        </div>

        {/* Undo and Clear side tools */}
        <div className="absolute right-4 flex flex-col gap-2">
          <button
            onClick={handleUndo}
            disabled={history.length === 0}
            className="p-3 bg-white rounded-full shadow-md text-slate-700 disabled:opacity-40 transition-transform active:scale-90"
            title="Undo"
          >
            <RotateCcw size={22} />
          </button>
          <button
            onClick={handleClear}
            className="p-3 bg-white rounded-full shadow-md text-slate-700 transition-transform active:scale-90"
            title="Clear"
          >
            <Trash2 size={22} />
          </button>
        </div>
      </div>

      {/* 10-Color Palette at bottom */}
      <div className="p-3 bg-white/90 backdrop-blur rounded-t-3xl shadow-lg border-t border-slate-100">
        <div className="flex items-center justify-between gap-1 overflow-x-auto py-1 px-2 no-scrollbar">
          {colorList.map((col) => {
            const isSelected = activeColor === col.hex;
            return (
              <button
                key={col.id}
                onClick={() => handleColorSelect(col)}
                className={`relative flex-shrink-0 rounded-full transition-transform cursor-pointer ${
                  isSelected ? 'scale-125 ring-3 ring-amber-400 shadow-md' : 'hover:scale-110 active:scale-95'
                }`}
                style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: col.hex,
                  border: col.hex.toLowerCase() === '#fafafa' ? '2px solid #E0E0E0' : 'none',
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
