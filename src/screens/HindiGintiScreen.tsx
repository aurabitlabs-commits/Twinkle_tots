import { useState } from 'react';
import { BackButton } from '@/components/BackButton';
import { ChoiceButton } from '@/components/ChoiceButton';
import { FlashCard } from '@/components/FlashCard';
import { ProgressDots } from '@/components/ProgressDots';
import { SpeakerButton } from '@/components/SpeakerButton';
import { Confetti } from '@/components/Confetti';
import { EndRoundScreen } from '@/components/EndRoundScreen';
import { colors } from '@/theme';
import { useSpeech, playTone } from '@/hooks/useSpeech';
import plusPacksData from '@/data/plusPacks.json';
import { shuffle } from '@/utils/shuffle';

interface HindiGintiScreenProps {
  onBack: () => void;
  onHome: () => void;
  addStars: (count: number) => void;
}

export function HindiGintiScreen({
  onBack,
  onHome,
  addStars,
}: HindiGintiScreenProps) {
  const gintiList = plusPacksData.ginti;
  const [mode, setMode] = useState<'learn' | 'play'>('learn');
  const [index, setIndex] = useState(0);
  const [qIndex, setQIndex] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState<Set<string>>(new Set());
  const [showConfetti, setShowConfetti] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const { speak } = useSpeech();

  const currentLearn = gintiList[index];

  // For quiz: 8 questions
  const [quizQuestions] = useState(() => {
    return shuffle([...gintiList]).slice(0, 8).map((item) => {
      const wrong = shuffle(gintiList.filter((g) => g.number !== item.number)).slice(0, 2);
      return {
        correct: item,
        options: shuffle([item, ...wrong]),
      };
    });
  });

  const currentQ = quizQuestions[qIndex];

  const handleLearnTap = () => {
    playTone('pop');
    speak(`${currentLearn.wordHi} (${currentLearn.wordEn})`, { lang: 'hi-IN' });
  };

  const handleChoice = (selectedNum: number) => {
    if (!currentQ) return;
    if (selectedNum === currentQ.correct.number) {
      playTone('correct');
      setShowConfetti(true);
      speak(`शाबाश! ${currentQ.correct.wordHi}`);
      addStars(1);

      setTimeout(() => {
        setShowConfetti(false);
        if (qIndex < quizQuestions.length - 1) {
          setQIndex((i) => i + 1);
          setWrongAnswers(new Set());
        } else {
          playTone('win');
          setIsDone(true);
        }
      }, 1800);
    } else {
      playTone('wrong');
      speak('फिर से कोशिश करो', { lang: 'hi-IN' });
      setWrongAnswers((prev) => new Set([...prev, String(selectedNum)]));
    }
  };

  if (isDone) {
    return (
      <div className="h-full animate-fade-in" style={{ background: colors.pastels[5] }}>
        <EndRoundScreen
          stars={3}
          onPlayAgain={() => {
            setQIndex(0);
            setIsDone(false);
          }}
          onHome={onHome}
        />
      </div>
    );
  }

  return (
    <div
      className="flex flex-col h-full animate-fade-in select-none relative"
      style={{
        background: `linear-gradient(160deg, ${colors.pastels[index % 6]} 0%, ${colors.pastels[(index + 2) % 6]} 100%)`,
      }}
    >
      <Confetti active={showConfetti} />

      {/* Top bar */}
      <div className="flex items-center justify-between p-4">
        <BackButton onClick={onBack} />
        <h2 className="font-rounded font-bold text-2xl" style={{ color: colors.ink }}>
          हिन्दी गिनती १-२०
        </h2>
        <SpeakerButton
          onClick={() => {
            playTone('tap');
            if (mode === 'learn') {
              speak(`${currentLearn.wordHi}... ${currentLearn.wordEn}`, { lang: 'hi-IN' });
            } else if (currentQ) {
              speak(`गिनती चुनो: ${currentQ.correct.wordHi}`, { lang: 'hi-IN' });
            }
          }}
        />
      </div>

      {/* Learn / Play Tabs */}
      <div className="flex justify-center gap-3 px-4 mb-2">
        <button
          onClick={() => {
            playTone('tap');
            setMode('learn');
          }}
          className={`px-5 py-2 rounded-2xl font-rounded font-bold text-base transition-all ${
            mode === 'learn' ? 'bg-amber-500 text-white shadow-md' : 'bg-white/80 text-slate-700'
          }`}
        >
          📖 सीखो (Learn)
        </button>
        <button
          onClick={() => {
            playTone('tap');
            setMode('play');
            setQIndex(0);
          }}
          className={`px-5 py-2 rounded-2xl font-rounded font-bold text-base transition-all ${
            mode === 'play' ? 'bg-amber-500 text-white shadow-md' : 'bg-white/80 text-slate-700'
          }`}
        >
          🎮 खेलो (Play)
        </button>
      </div>

      {mode === 'learn' && (
        <div className="flex-1 flex flex-col items-center justify-between p-4">
          <div className="flex-1 flex items-center justify-center w-full">
            <FlashCard
              bigText={currentLearn.numeral}
              smallText={`(${currentLearn.number})`}
              word={`${currentLearn.wordHi} • ${currentLearn.wordEn}`}
              emoji={currentLearn.emoji}
              emojiCount={currentLearn.number <= 10 ? currentLearn.number : 10}
              showEmojiGrid={true}
              pastelIndex={index}
              onTap={handleLearnTap}
            />
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-6 pb-2">
            <button
              onClick={() => index > 0 && setIndex((i) => i - 1)}
              disabled={index === 0}
              className="px-4 py-2 bg-white rounded-2xl shadow-sm font-bold text-slate-700 disabled:opacity-30 active:scale-95"
            >
              ◀ पिछला
            </button>
            <span className="font-rounded font-bold text-lg text-slate-700">
              {index + 1} / {gintiList.length}
            </span>
            <button
              onClick={() => index < gintiList.length - 1 && setIndex((i) => i + 1)}
              disabled={index === gintiList.length - 1}
              className="px-4 py-2 bg-amber-500 text-white rounded-2xl shadow-sm font-bold disabled:opacity-30 active:scale-95"
            >
              अगला ▶
            </button>
          </div>
        </div>
      )}

      {mode === 'play' && currentQ && (
        <div className="flex-1 flex flex-col items-center justify-between p-4">
          <div className="my-2 p-4 bg-white/90 rounded-3xl border-2 border-amber-300 text-center shadow-md w-full max-w-[320px]">
            <span className="text-xs uppercase font-bold text-amber-700 block">संख्या ढूँढो:</span>
            <span className="font-rounded font-bold text-4xl text-amber-950 mt-1 block">
              {currentQ.correct.wordHi} ({currentQ.correct.wordEn})
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3.5 w-full max-w-[300px]">
            {currentQ.options.map((opt) => (
              <ChoiceButton
                key={opt.number}
                label={`${opt.numeral}  (${opt.number})`}
                emoji={opt.emoji}
                state={wrongAnswers.has(String(opt.number)) ? 'wrong' : 'default'}
                onClick={() => handleChoice(opt.number)}
              />
            ))}
          </div>

          <div className="pb-4 font-rounded font-bold text-slate-500">
            {qIndex + 1} / {quizQuestions.length}
          </div>
        </div>
      )}
    </div>
  );
}
