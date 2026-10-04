import { useState, useEffect } from 'react';
import { BackButton } from '@/components/BackButton';
import { TaraMascot } from '@/components/TaraMascot';
import { Confetti } from '@/components/Confetti';
import { colors } from '@/theme';
import { playTone, useSpeech } from '@/hooks/useSpeech';
import { shuffle } from '@/utils/shuffle';
import {
  getNumberWord,
  getAllNumbers,
  type NumberDetail,
} from '@/utils/numberWords';
import {
  Volume2,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Award,
  Sparkles,
  Grid,
} from 'lucide-react';

interface NumberSpellingScreenProps {
  onBack: () => void;
  addStars: (count: number) => void;
  voiceLang?: 'en' | 'hi' | 'both';
}

export function NumberSpellingScreen({
  onBack,
  addStars,
  voiceLang = 'both',
}: NumberSpellingScreenProps) {
  const [tab, setTab] = useState<'learn' | 'quiz'>('learn');
  const [currentNum, setCurrentNum] = useState(1);
  const [showGridModal, setShowGridModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Quiz state
  const [quizTarget, setQuizTarget] = useState<NumberDetail>(() => getNumberWord(7));
  const [quizOptions, setQuizOptions] = useState<NumberDetail[]>([]);
  const [wrongAnswers, setWrongAnswers] = useState<Set<number>>(new Set());
  const [score, setScore] = useState(0);

  const { speak, stop } = useSpeech();
  const currentDetail = getNumberWord(currentNum);

  const speakCurrent = (numDetail = currentDetail) => {
    playTone('pop');
    const speech =
      voiceLang === 'hi'
        ? `${numDetail.num}, ${numDetail.hi}, ${numDetail.en}`
        : voiceLang === 'both'
        ? `${numDetail.num}... ${numDetail.en}... ${numDetail.hi}`
        : `${numDetail.num}... ${numDetail.en}`;
    speak(speech);
  };

  useEffect(() => {
    if (tab === 'learn') {
      speakCurrent();
    } else {
      nextQuizRound();
    }
  }, [tab, currentNum]);

  const nextQuizRound = () => {
    setShowConfetti(false);
    setWrongAnswers(new Set());
    const randomNum = Math.floor(Math.random() * 100) + 1;
    const target = getNumberWord(randomNum);
    setQuizTarget(target);

    // 2 distractors
    const candidates: number[] = [];
    while (candidates.length < 2) {
      const r = Math.floor(Math.random() * 100) + 1;
      if (r !== randomNum && !candidates.includes(r)) {
        candidates.push(r);
      }
    }
    const options = shuffle([target, ...candidates.map(getNumberWord)]);
    setQuizOptions(options);

    const prompt =
      voiceLang === 'hi'
        ? `संख्या ${target.num} की सही स्पेलिंग चुनो!`
        : `What is the spelling of ${target.num}?`;
    speak(prompt);
  };

  const handleQuizChoice = (option: NumberDetail) => {
    if (showConfetti) return;

    if (option.num === quizTarget.num) {
      playTone('correct');
      setShowConfetti(true);
      setScore((s) => s + 1);
      addStars(1);

      const celeb =
        voiceLang === 'hi'
          ? `शाबाश! ${quizTarget.num} को कहते हैं ${quizTarget.en}!`
          : `Great job! ${quizTarget.num} is spelled ${quizTarget.en}!`;
      speak(celeb);

      setTimeout(() => {
        nextQuizRound();
      }, 1900);
    } else {
      playTone('wrong');
      speak(voiceLang === 'hi' ? 'फिर से कोशिश करो!' : 'Try again!');
      setWrongAnswers((prev) => new Set([...prev, option.num]));
    }
  };

  return (
    <div
      className="flex flex-col h-full animate-fade-in select-none relative overflow-y-auto"
      style={{
        background: `linear-gradient(160deg, #FFF8E1 0%, #FFFFFF 60%, #E8EAF6 100%)`,
      }}
    >
      <Confetti active={showConfetti} />

      {/* Top bar */}
      <div className="flex items-center justify-between p-4 sticky top-0 bg-white/70 backdrop-blur-sm z-20 shadow-xs">
        <BackButton onClick={onBack} />
        <h2 className="font-rounded font-bold text-2xl text-slate-800">
          Number Spellings 1-100
        </h2>
        {tab === 'learn' ? (
          <button
            onClick={() => setShowGridModal(true)}
            className="p-2.5 rounded-full bg-white text-amber-700 shadow-sm active:scale-95 cursor-pointer"
            title="Choose number"
          >
            <Grid size={20} />
          </button>
        ) : (
          <div className="w-8" />
        )}
      </div>

      <div className="p-4 flex flex-col gap-3.5 max-w-[420px] mx-auto w-full pb-8">
        {/* Tab switch: Learn vs Quiz */}
        <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-2xl">
          <button
            onClick={() => {
              playTone('tap');
              setTab('learn');
            }}
            className={`py-2 px-3 rounded-xl font-rounded font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
              tab === 'learn'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen size={16} />
            <span>Learn 1-100</span>
          </button>
          <button
            onClick={() => {
              playTone('tap');
              setTab('quiz');
            }}
            className={`py-2 px-3 rounded-xl font-rounded font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
              tab === 'quiz'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award size={16} />
            <span>Spelling Quiz</span>
          </button>
        </div>

        {tab === 'learn' ? (
          <>
            {/* Giant Number Flashcard */}
            <div className="w-full bg-white rounded-[2.5rem] shadow-xl border-4 border-amber-300 p-6 flex flex-col items-center text-center my-1 relative overflow-hidden">
              <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider mb-2">
                Number & Word
              </span>

              {/* Big Numeral */}
              <button
                onClick={() => speakCurrent()}
                className="w-32 h-32 rounded-3xl bg-amber-50 border-3 border-amber-200 flex items-center justify-center text-amber-950 font-rounded font-extrabold text-7xl my-1 shadow-inner active:scale-95 transition-transform cursor-pointer"
              >
                {currentDetail.num}
              </button>

              {/* Spelling in English */}
              <h3 className="font-rounded font-black text-3xl text-slate-900 mt-2 tracking-wide uppercase">
                {currentDetail.en}
              </h3>

              {/* Hindi Name */}
              <span className="font-rounded font-bold text-xl text-amber-800 mt-0.5">
                {currentDetail.hi}
              </span>

              {/* Tens & Ones Breakdown */}
              <div className="mt-4 p-3 bg-amber-50/80 rounded-2xl border border-amber-200 w-full text-center">
                <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                  Tens & Ones Math Breakdown
                </span>
                <span className="font-rounded font-extrabold text-base text-amber-950 block">
                  {currentDetail.breakdownText}
                </span>
                <span className="text-xs text-slate-600 font-semibold block mt-0.5">
                  ({currentDetail.tens} Tens + {currentDetail.ones} Ones)
                </span>
              </div>
            </div>

            {/* Prev / Next Steppers */}
            <div className="flex items-center justify-between w-full px-2">
              <button
                onClick={() => {
                  playTone('tap');
                  if (currentNum > 1) setCurrentNum((n) => n - 1);
                }}
                disabled={currentNum === 1}
                className="py-3 px-5 rounded-2xl bg-white shadow-md text-slate-700 font-rounded font-bold text-sm flex items-center gap-1 disabled:opacity-30 active:scale-95 cursor-pointer"
              >
                <ChevronLeft size={20} /> Prev
              </button>

              <span className="font-rounded font-extrabold text-base text-slate-800">
                {currentNum} / 100
              </span>

              <button
                onClick={() => {
                  playTone('tap');
                  if (currentNum < 100) setCurrentNum((n) => n + 1);
                }}
                disabled={currentNum === 100}
                className="py-3 px-5 rounded-2xl bg-amber-500 shadow-md text-white font-rounded font-bold text-sm flex items-center gap-1 disabled:opacity-30 active:scale-95 cursor-pointer"
              >
                Next <ChevronRight size={20} />
              </button>
            </div>
          </>
        ) : (
          /* Quiz Mode */
          <div className="flex flex-col items-center gap-3">
            <div className="flex justify-center">
              <TaraMascot size={64} animation={showConfetti ? 'cheer' : 'idle'} />
            </div>

            <div className="w-full bg-white rounded-3xl p-5 shadow-lg border-3 border-indigo-200 text-center">
              <span className="text-xs uppercase font-bold text-indigo-700 block mb-1">
                Spell the Number:
              </span>
              <span className="font-rounded font-extrabold text-6xl text-indigo-950 block my-2">
                {quizTarget.num}
              </span>
              <span className="text-xs text-slate-500 font-bold block">
                Tap the correct English spelling below:
              </span>
            </div>

            {/* 3 Spelling Choices */}
            <div className="flex flex-col gap-3 w-full my-2">
              {quizOptions.map((opt) => {
                const isWrong = wrongAnswers.has(opt.num);
                const isCorrect = opt.num === quizTarget.num;

                return (
                  <button
                    key={opt.num}
                    onClick={() => handleQuizChoice(opt)}
                    disabled={isWrong}
                    className={`w-full py-4 px-5 rounded-2xl border-3 font-rounded font-extrabold text-2xl shadow-sm transition-all active:scale-95 cursor-pointer flex items-center justify-center text-center tracking-wide uppercase ${
                      isWrong
                        ? 'bg-rose-50 border-rose-300 text-rose-300 opacity-60'
                        : isCorrect && showConfetti
                        ? 'bg-green-100 border-green-500 text-green-950 scale-102 shadow-md'
                        : 'bg-white border-indigo-200 text-slate-800 hover:bg-indigo-50 hover:border-indigo-400'
                    }`}
                  >
                    <span>{opt.en}</span>
                  </button>
                );
              })}
            </div>

            <div className="text-center font-rounded font-bold text-xs text-slate-500">
              Score: {score} Stars Earned ⭐
            </div>
          </div>
        )}
      </div>

      {/* Grid Picker Modal for 1-100 */}
      {showGridModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[2.5rem] p-5 max-w-[380px] w-full max-h-[85vh] flex flex-col shadow-2xl border-4 border-amber-300 relative text-center">
            <h3 className="font-rounded font-bold text-xl text-slate-900 mb-2">
              Pick Any Number (1 - 100)
            </h3>
            <p className="font-rounded text-xs text-slate-500 mb-3">
              Tap a number to view its spelling and tens/ones breakdown:
            </p>

            <div className="overflow-y-auto flex-1 grid grid-cols-5 gap-2 p-1">
              {Array.from({ length: 100 }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => {
                    playTone('tap');
                    setCurrentNum(n);
                    setShowGridModal(false);
                  }}
                  className={`aspect-square rounded-xl font-rounded font-extrabold text-base flex items-center justify-center transition-all ${
                    currentNum === n
                      ? 'bg-amber-500 text-white shadow-md scale-105'
                      : 'bg-slate-50 border border-slate-200 text-slate-800 hover:bg-amber-50'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowGridModal(false)}
              className="mt-4 py-2.5 px-4 bg-slate-100 text-slate-700 rounded-xl font-rounded font-bold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
