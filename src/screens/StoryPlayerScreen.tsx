import { useState, useEffect } from 'react';
import { BackButton } from '@/components/BackButton';
import { ChoiceButton } from '@/components/ChoiceButton';
import { Confetti } from '@/components/Confetti';
import { colors } from '@/theme';
import { useSpeech, playTone } from '@/hooks/useSpeech';
import { storybookAudio } from '@/utils/storybookAudio';
import { BookOpen, Volume2, Sparkles, Music, ChevronLeft, ChevronRight } from 'lucide-react';

export interface StoryPage {
  id: string;
  caption: { en: string; hi: string };
  bgEmoji: string;
  mainEmoji: string;
  hotspots: Array<{
    id: string;
    name: { en: string; hi: string };
    emoji: string;
    x: number;
    y: number;
  }>;
}

export interface StoryQuizQuestion {
  question: { en: string; hi: string };
  options: Array<{ id: string; label: { en: string; hi: string }; emoji: string }>;
  correctId: string;
}

export interface StoryData {
  id: string;
  title: { en: string; hi: string };
  coverEmoji: string;
  pages: StoryPage[];
  quiz: StoryQuizQuestion[];
}

interface StoryPlayerScreenProps {
  story: StoryData;
  lang: 'en' | 'hi';
  onBack: () => void;
  onComplete: () => void;
}

export function StoryPlayerScreen({
  story,
  lang,
  onBack,
  onComplete,
}: StoryPlayerScreenProps) {
  const [pageIdx, setPageIdx] = useState(0);
  const [readToMe, setReadToMe] = useState(true);
  const [musicOn, setMusicOn] = useState(true);
  const [bounceHotspotId, setBounceHotspotId] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [quizIdx, setQuizIdx] = useState(0);
  const [phase, setPhase] = useState<'reading' | 'quiz' | 'done'>('reading');
  const [wrongAnswers, setWrongAnswers] = useState<Set<string>>(new Set());
  const { speak, stop } = useSpeech();

  const totalPages = story.pages.length;
  const currentPage = story.pages[pageIdx];

  // Ambient storybook music management
  useEffect(() => {
    if (phase === 'reading' && musicOn) {
      storybookAudio.startStoryBgm();
    } else {
      storybookAudio.stopStoryBgm();
    }
    return () => {
      storybookAudio.stopStoryBgm();
    };
  }, [phase, musicOn]);

  // Expressive story narration on page change
  useEffect(() => {
    if (phase === 'reading' && currentPage) {
      const caption = currentPage.caption[lang];
      // Expressive storytelling pacing & pitch
      const storyRate = lang === 'hi' ? 0.8 : 0.82;
      const storyPitch = lang === 'hi' ? 1.06 : 1.1;

      speak(caption, { rate: storyRate, pitch: storyPitch, lang: lang === 'hi' ? 'hi-IN' : 'en-US' });

      if (readToMe) {
        // Auto-turn after caption finishes
        const durationMs = Math.max(4000, caption.length * 95);
        const timer = setTimeout(() => {
          if (pageIdx < totalPages - 1) {
            storybookAudio.playPageTurn();
            setPageIdx((p) => p + 1);
          } else {
            // Finished reading!
            storybookAudio.stopStoryBgm();
            playTone('win');
            setShowConfetti(true);
            onComplete();
            setTimeout(() => {
              setPhase('quiz');
              setShowConfetti(false);
            }, 2500);
          }
        }, durationMs);

        return () => clearTimeout(timer);
      }
    }
    return () => stop();
  }, [pageIdx, phase, readToMe, lang, currentPage, totalPages, onComplete, speak, stop]);

  const handleHotspotClick = (h: { id: string; name: { en: string; hi: string } }) => {
    setBounceHotspotId(h.id);

    // Contextual sound effect
    const nameLower = h.name.en.toLowerCase();
    if (nameLower.includes('water') || nameLower.includes('pitcher')) {
      storybookAudio.playWaterDrop();
    } else if (nameLower.includes('sun') || nameLower.includes('idea') || nameLower.includes('flower') || nameLower.includes('star')) {
      storybookAudio.playSparkle();
    } else {
      storybookAudio.playBoing();
    }

    speak(h.name[lang], { rate: 0.9, pitch: 1.15, lang: lang === 'hi' ? 'hi-IN' : 'en-US' });
    setTimeout(() => setBounceHotspotId(null), 500);
  };

  const handlePageChange = (nextIndex: number) => {
    storybookAudio.playPageTurn();
    setPageIdx(nextIndex);
  };

  const handleQuizChoice = (optionId: string) => {
    const currentQ = story.quiz[quizIdx];
    if (!currentQ) return;

    if (optionId === currentQ.correctId) {
      playTone('correct');
      storybookAudio.playSparkle();
      setShowConfetti(true);
      speak(lang === 'hi' ? 'शाबाश! बहुत बढ़िया!' : 'Great job! That is correct!', {
        lang: lang === 'hi' ? 'hi-IN' : 'en-US',
      });

      setTimeout(() => {
        setShowConfetti(false);
        if (quizIdx < story.quiz.length - 1) {
          setQuizIdx((q) => q + 1);
          setWrongAnswers(new Set());
        } else {
          setPhase('done');
        }
      }, 1800);
    } else {
      playTone('wrong');
      speak(lang === 'hi' ? 'फिर से सोचो!' : 'Try again!', { lang: lang === 'hi' ? 'hi-IN' : 'en-US' });
      setWrongAnswers((prev) => new Set([...prev, optionId]));
    }
  };

  return (
    <div
      className="flex flex-col h-full animate-fade-in select-none relative overflow-hidden"
      style={{
        background: `linear-gradient(160deg, ${colors.pastels[pageIdx % 6]} 0%, ${colors.pastels[(pageIdx + 3) % 6]} 100%)`,
      }}
    >
      <Confetti active={showConfetti} />

      {/* Floating Story Sparkles */}
      {phase === 'reading' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <span className="absolute text-xl animate-float-slow opacity-60" style={{ top: '15%', left: '10%' }}>
            ✨
          </span>
          <span className="absolute text-2xl animate-float opacity-50" style={{ top: '40%', right: '12%' }}>
            🌟
          </span>
          <span className="absolute text-lg animate-float-slow opacity-50" style={{ top: '70%', left: '15%' }}>
            🍃
          </span>
        </div>
      )}

      {/* Top bar */}
      <div className="flex items-center justify-between p-4 z-10 bg-white/40 backdrop-blur-xs shadow-2xs">
        <BackButton
          onClick={() => {
            storybookAudio.stopStoryBgm();
            stop();
            onBack();
          }}
        />

        <div className="text-center">
          <span className="text-[10px] font-bold text-indigo-700 tracking-wider uppercase block">
            Magical Storytime 📖✨
          </span>
          <h2 className="font-rounded font-bold text-lg text-slate-800 line-clamp-1 max-w-[190px]">
            {story.title[lang]}
          </h2>
        </div>

        {phase === 'reading' ? (
          <div className="flex items-center gap-1.5">
            {/* Music Toggle */}
            <button
              onClick={() => {
                playTone('tap');
                setMusicOn(!musicOn);
              }}
              className={`p-2.5 rounded-full shadow-sm active:scale-95 transition-all cursor-pointer ${
                musicOn ? 'bg-indigo-600 text-white' : 'bg-white text-slate-400'
              }`}
              title={musicOn ? 'Mute Music' : 'Play Music'}
            >
              <Music size={18} />
            </button>

            {/* Read to me toggle */}
            <button
              onClick={() => {
                playTone('tap');
                setReadToMe(!readToMe);
              }}
              className={`p-2.5 rounded-full shadow-sm active:scale-95 transition-all cursor-pointer ${
                readToMe ? 'bg-amber-500 text-white' : 'bg-white text-slate-600'
              }`}
              title={readToMe ? 'Auto-play on' : 'Auto-play off'}
            >
              <Volume2 size={18} />
            </button>
          </div>
        ) : (
          <div className="w-8" />
        )}
      </div>

      {phase === 'reading' && currentPage && (
        <div className="flex-1 flex flex-col justify-between p-4 pb-6 z-10">
          {/* Illustration Stage */}
          <div className="flex-1 flex flex-col items-center justify-center relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border-3 border-white/60 p-4 overflow-hidden min-h-[220px]">
            {/* Background Atmosphere Emoji */}
            <span className="text-8xl opacity-20 absolute -top-2 -right-2 animate-float-slow select-none">
              {currentPage.bgEmoji}
            </span>

            {/* Main Character */}
            <div className="relative z-10 flex flex-col items-center">
              <span className="text-8xl animate-bounce-gentle filter drop-shadow-md">
                {currentPage.mainEmoji}
              </span>
            </div>

            {/* Interactive Hotspots */}
            {currentPage.hotspots.map((h) => (
              <button
                key={h.id}
                onClick={() => handleHotspotClick(h)}
                style={{ top: `${h.y}%`, left: `${h.x}%` }}
                className={`absolute p-2.5 bg-white/95 rounded-2xl shadow-md border-2 border-indigo-200 transition-transform active:scale-90 flex items-center gap-1 cursor-pointer z-20 ${
                  bounceHotspotId === h.id ? 'animate-wiggle scale-115 border-amber-400 bg-amber-50' : 'hover:scale-105'
                }`}
              >
                <span className="text-2xl">{h.emoji}</span>
                <span className="text-xs font-rounded font-bold text-slate-700">
                  {h.name[lang]}
                </span>
              </button>
            ))}
          </div>

          {/* Storybook Narration Card */}
          <div
            onClick={() => {
              playTone('pop');
              const caption = currentPage.caption[lang];
              speak(caption, {
                rate: lang === 'hi' ? 0.8 : 0.82,
                pitch: lang === 'hi' ? 1.06 : 1.1,
                lang: lang === 'hi' ? 'hi-IN' : 'en-US',
              });
            }}
            className="mt-3 p-4 bg-white/95 backdrop-blur rounded-3xl shadow-xl border-3 border-indigo-200 text-center relative overflow-hidden active:scale-98 transition-transform cursor-pointer"
            title="Tap to re-read"
          >
            <div className="flex items-center justify-center gap-1.5 mb-1 text-indigo-600 font-bold text-xs uppercase tracking-wider">
              <Sparkles size={14} className="animate-spin" />
              <span>Narrator (Tap to Listen)</span>
              <Sparkles size={14} className="animate-spin" />
            </div>

            <p className="font-rounded font-bold text-xl text-slate-800 leading-snug">
              {currentPage.caption[lang]}
            </p>
          </div>

          {/* Steppers & Progress */}
          <div className="flex items-center justify-between mt-3 px-2">
            <button
              onClick={() => handlePageChange(pageIdx - 1)}
              disabled={pageIdx === 0}
              className="py-2.5 px-4 rounded-2xl bg-white shadow-md text-slate-700 font-rounded font-bold text-sm flex items-center gap-1 disabled:opacity-30 active:scale-95 cursor-pointer"
            >
              <ChevronLeft size={18} /> Prev
            </button>

            <span className="font-rounded font-bold text-sm text-slate-600">
              Page {pageIdx + 1} of {totalPages}
            </span>

            <button
              onClick={() => {
                if (pageIdx < totalPages - 1) {
                  handlePageChange(pageIdx + 1);
                } else {
                  storybookAudio.stopStoryBgm();
                  setPhase('quiz');
                }
              }}
              className="py-2.5 px-4 rounded-2xl bg-indigo-600 shadow-md text-white font-rounded font-bold text-sm flex items-center gap-1 active:scale-95 cursor-pointer"
            >
              {pageIdx < totalPages - 1 ? 'Next' : 'Quiz'} <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Story Quiz Phase */}
      {phase === 'quiz' && story.quiz[quizIdx] && (
        <div className="flex-1 flex flex-col justify-between p-4 pb-8 z-10 max-w-[400px] mx-auto w-full">
          <div className="bg-white rounded-3xl p-5 shadow-lg border-3 border-indigo-200 text-center my-auto">
            <span className="text-xs font-bold text-indigo-600 uppercase block mb-1">
              Story Fun Quiz ⭐ ({quizIdx + 1} of {story.quiz.length})
            </span>
            <h3 className="font-rounded font-bold text-xl text-slate-900 my-2">
              {story.quiz[quizIdx].question[lang]}
            </h3>

            <div className="flex flex-col gap-2.5 mt-4">
              {story.quiz[quizIdx].options.map((opt) => {
                const isWrong = wrongAnswers.has(opt.id);
                return (
                  <ChoiceButton
                    key={opt.id}
                    label={opt.label[lang]}
                    icon={<span className="text-2xl">{opt.emoji}</span>}
                    disabled={isWrong}
                    isWrong={isWrong}
                    onClick={() => handleQuizChoice(opt.id)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Done Screen */}
      {phase === 'done' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center z-10">
          <span className="text-7xl animate-bounce">🏆</span>
          <h2 className="font-rounded font-black text-3xl text-slate-900 mt-4 mb-2">
            {lang === 'hi' ? 'कहानी पूरी हुई!' : 'Story Completed!'}
          </h2>
          <p className="font-rounded font-bold text-slate-600 mb-6">
            {lang === 'hi'
              ? 'शाबाश! आपने बहुत सुंदर कहानी सुनी!'
              : 'You listened so beautifully! Great job!'}
          </p>
          <button
            onClick={onBack}
            className="py-3.5 px-8 rounded-full bg-indigo-600 text-white font-rounded font-extrabold text-lg shadow-lg active:scale-95 cursor-pointer"
          >
            {lang === 'hi' ? 'कहानियों पर वापस' : 'Back to Stories'}
          </button>
        </div>
      )}
    </div>
  );
}
