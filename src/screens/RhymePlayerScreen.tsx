import { useState, useEffect, useRef } from 'react';
import { BackButton } from '@/components/BackButton';
import { TaraMascot } from '@/components/TaraMascot';
import { Confetti } from '@/components/Confetti';
import { colors } from '@/theme';
import { useSpeech, playTone } from '@/hooks/useSpeech';
import { rhymeMusicPlayer } from '@/utils/rhymeMelodies';
import { Play, Pause, RotateCcw, SkipForward, Music, Volume2, Sparkles } from 'lucide-react';

export interface RhymeLine {
  text: string;
  startMs: number;
  endMs: number;
  scene: number;
}

export interface RhymeData {
  id: string;
  lang: string;
  title: string;
  thumbnail: string;
  scenes: string[];
  lines: RhymeLine[];
}

interface RhymePlayerScreenProps {
  rhyme: RhymeData;
  onBack: () => void;
  onNextRhyme?: () => void;
  onComplete: () => void;
}

export function RhymePlayerScreen({
  rhyme,
  onBack,
  onNextRhyme,
  onComplete,
}: RhymePlayerScreenProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [musicOn, setMusicOn] = useState(true);
  const [currentTimeMs, setCurrentTimeMs] = useState(0);
  const [isDance, setIsDance] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { speak, stop } = useSpeech();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalDuration = rhyme.lines[rhyme.lines.length - 1]?.endMs || 20000;

  // Find active line & scene
  const activeLineIdx = rhyme.lines.findIndex(
    (l) => currentTimeMs >= l.startMs && currentTimeMs < l.endMs
  );
  const currentLine = rhyme.lines[activeLineIdx] || rhyme.lines[0];
  const currentScene = currentLine?.scene ?? 0;

  // Manage Background Nursery Rhyme Melody
  useEffect(() => {
    if (isPlaying && musicOn) {
      rhymeMusicPlayer.playRhyme(rhyme.id);
    } else {
      rhymeMusicPlayer.stop();
    }
    return () => {
      rhymeMusicPlayer.stop();
    };
  }, [isPlaying, musicOn, rhyme.id]);

  // Melodious singing-style voice delivery
  useEffect(() => {
    if (isPlaying && activeLineIdx >= 0 && rhyme.lines[activeLineIdx]) {
      const line = rhyme.lines[activeLineIdx];
      const singingPitch = activeLineIdx % 2 === 0 ? 1.25 : 1.34;
      const singingRate = rhyme.lang === 'hi' ? 0.84 : 0.88;

      speak(line.text, {
        rate: singingRate,
        pitch: singingPitch,
        lang: rhyme.lang === 'hi' ? 'hi-IN' : 'en-US',
      });
    }
  }, [activeLineIdx, isPlaying, rhyme.lang, speak]);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentTimeMs((t) => {
          const next = t + 200;
          if (next >= totalDuration) {
            // Rhyme complete!
            setIsPlaying(false);
            rhymeMusicPlayer.stop();
            setShowConfetti(true);
            playTone('win');
            onComplete();
            return totalDuration;
          }
          return next;
        });
      }, 200);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      stop();
    };
  }, [isPlaying, totalDuration, onComplete, stop]);

  const togglePlay = () => {
    playTone('tap');
    if (!isPlaying && currentTimeMs >= totalDuration) {
      setCurrentTimeMs(0);
      setIsPlaying(true);
      setShowConfetti(false);
    } else {
      if (isPlaying) {
        stop();
      } else {
        if (currentLine) {
          speak(currentLine.text, {
            rate: rhyme.lang === 'hi' ? 0.84 : 0.88,
            pitch: 1.25,
            lang: rhyme.lang === 'hi' ? 'hi-IN' : 'en-US',
          });
        }
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleReplay = () => {
    playTone('tap');
    stop();
    rhymeMusicPlayer.stop();
    setCurrentTimeMs(0);
    setIsPlaying(true);
    setShowConfetti(false);
  };

  // Animated background themes per scene
  const sceneGradients = [
    'linear-gradient(160deg, #E0F7FA 0%, #FFF9C4 100%)',
    'linear-gradient(160deg, #F3E5F5 0%, #E8F5E9 100%)',
    'linear-gradient(160deg, #FFF3E0 0%, #E1F5FE 100%)',
  ];

  return (
    <div
      className="flex flex-col h-full animate-fade-in select-none relative overflow-hidden transition-all duration-700"
      style={{ background: sceneGradients[currentScene % sceneGradients.length] }}
    >
      <Confetti active={showConfetti} />

      {/* Floating Musical Notes Animation */}
      {isPlaying && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <span className="absolute text-2xl animate-float-slow opacity-60" style={{ top: '18%', left: '12%' }}>
            🎵
          </span>
          <span className="absolute text-2xl animate-float opacity-70" style={{ top: '35%', right: '15%' }}>
            🎶
          </span>
          <span className="absolute text-xl animate-float-slow opacity-60" style={{ top: '55%', left: '20%' }}>
            ⭐
          </span>
          <span className="absolute text-2xl animate-float opacity-70" style={{ top: '25%', right: '28%' }}>
            🔔
          </span>
        </div>
      )}

      {/* Top bar */}
      <div className="flex items-center justify-between p-4 z-10">
        <BackButton
          onClick={() => {
            rhymeMusicPlayer.stop();
            stop();
            onBack();
          }}
        />
        <div className="text-center">
          <span className="text-[10px] font-bold text-amber-700 tracking-wider uppercase block">
            Sing-Along Rhyme 🎵
          </span>
          <h2 className="font-rounded font-bold text-xl text-slate-800 line-clamp-1 max-w-[190px]">
            {rhyme.title}
          </h2>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Music Toggle */}
          <button
            onClick={() => {
              playTone('tap');
              setMusicOn(!musicOn);
            }}
            className={`p-2.5 rounded-full shadow-sm active:scale-95 transition-all cursor-pointer ${
              musicOn ? 'bg-amber-500 text-white' : 'bg-white text-slate-400'
            }`}
            title={musicOn ? 'Mute Music' : 'Play Music'}
          >
            <Music size={18} />
          </button>

          <button
            onClick={handleReplay}
            className="p-2.5 rounded-full bg-white/80 hover:bg-white text-slate-700 shadow-sm active:scale-95 cursor-pointer"
            title="Replay"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </div>

      {/* Main Scene & Dancing Mascot */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 relative z-10">
        <div
          onClick={() => {
            playTone('pop');
            setIsDance(true);
            setTimeout(() => setIsDance(false), 800);
          }}
          className={`cursor-pointer transition-transform ${isDance || isPlaying ? 'animate-bounce-gentle' : ''}`}
        >
          <TaraMascot size={135} animation={isDance || isPlaying ? 'cheer' : 'idle'} />
        </div>

        {/* Thumbnail & Dancing Music Beat */}
        <div className="flex items-center gap-3 mt-3">
          <span className="text-3xl animate-bounce-gentle">🎵</span>
          <span className="text-6xl animate-float filter drop-shadow-md">{rhyme.thumbnail}</span>
          <span className="text-3xl animate-bounce-gentle" style={{ animationDelay: '0.3s' }}>🎶</span>
        </div>
      </div>

      {/* Karaoke Singing Box with Bouncing Star */}
      <div
        onClick={() => {
          playTone('pop');
          if (currentLine) {
            speak(currentLine.text, {
              rate: rhyme.lang === 'hi' ? 0.84 : 0.88,
              pitch: 1.25,
              lang: rhyme.lang === 'hi' ? 'hi-IN' : 'en-US',
            });
          }
        }}
        className="p-4 mx-4 mb-2 bg-white/95 backdrop-blur rounded-3xl shadow-xl border-3 border-amber-300 z-10 text-center min-h-[105px] flex flex-col items-center justify-center relative overflow-hidden active:scale-98 transition-transform cursor-pointer"
        title="Tap to hear line again"
      >
        {/* Bouncing Star Karaoke indicator */}
        <div className="flex items-center gap-1 mb-1 animate-pulse">
          <span className="text-amber-500 text-sm">⭐</span>
          <span className="text-[11px] font-bold text-amber-700 uppercase tracking-widest">
            Singing Now
          </span>
          <span className="text-amber-500 text-sm">⭐</span>
        </div>

        <p className="font-rounded font-extrabold text-2xl text-amber-950 transition-all duration-300 leading-tight">
          {currentLine?.text || rhyme.title}
        </p>

        {/* Mini progress bar under lyrics */}
        <div className="w-48 h-1.5 bg-amber-100 rounded-full mt-2.5 overflow-hidden">
          <div
            className="h-full bg-amber-500 transition-all duration-200"
            style={{ width: `${(currentTimeMs / totalDuration) * 100}%` }}
          />
        </div>
      </div>

      {/* Player Controls */}
      <div className="p-4 pb-8 flex items-center justify-center gap-6 z-10">
        <button
          onClick={togglePlay}
          className="w-16 h-16 rounded-full bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer"
        >
          {isPlaying ? <Pause size={30} /> : <Play size={30} className="ml-1" />}
        </button>

        {onNextRhyme && (
          <button
            onClick={() => {
              playTone('tap');
              stop();
              rhymeMusicPlayer.stop();
              onNextRhyme();
            }}
            className="w-12 h-12 rounded-full bg-white hover:bg-slate-100 text-slate-700 flex items-center justify-center shadow-md active:scale-95 cursor-pointer"
            title="Next Rhyme"
          >
            <SkipForward size={22} />
          </button>
        )}
      </div>
    </div>
  );
}
