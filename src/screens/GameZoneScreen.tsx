import { useState } from 'react';
import { BackButton } from '@/components/BackButton';
import { ChoiceButton } from '@/components/ChoiceButton';
import { Confetti } from '@/components/Confetti';
import { TaraMascot } from '@/components/TaraMascot';
import { colors } from '@/theme';
import { playTone, useSpeech } from '@/hooks/useSpeech';
import { shuffle } from '@/utils/shuffle';
import { loadChildProfile, getPersonalizedPraise } from '@/utils/profileStorage';
import { Gamepad2, Sparkles, Check, Heart } from 'lucide-react';

interface GameZoneScreenProps {
  onBack: () => void;
  addStars: (count: number) => void;
  onOpenMemoryMatch: () => void;
}

type GameType =
  | 'menu'
  | 'find_letter'
  | 'feed_tara'
  | 'missing_letter'
  | 'letter_puzzle'
  | 'count_objects'
  | 'more_less'
  | 'color_hunt'
  | 'shape_match';

const GAMES_LIST = [
  { id: 'find_letter' as GameType, title: 'Find the Letter', icon: '🔤', desc: 'Spot the shining letter', color: '#FF7043' },
  { id: 'feed_tara' as GameType, title: 'Feed Tara', icon: '⭐', desc: 'Feed yummy fruits to Tara', color: '#FFA726' },
  { id: 'missing_letter' as GameType, title: 'Missing Letter', icon: '🧩', desc: 'Fill the missing alphabet gap', color: '#AB47BC' },
  { id: 'letter_puzzle' as GameType, title: 'Letter Puzzle', icon: '🔡', desc: 'Match Capital to Small (A ➔ a)', color: '#26A69A' },
  { id: 'count_objects' as GameType, title: 'Count Objects', icon: '🔢', desc: 'Count the friendly balloons', color: '#42A5F5' },
  { id: 'more_less' as GameType, title: 'More vs Less', icon: '⚖️', desc: 'Which group has more?', color: '#66BB6A' },
  { id: 'color_hunt' as GameType, title: 'Colour Hunt', icon: '🎨', desc: 'Find the matching color', color: '#EC407A' },
  { id: 'shape_match' as GameType, title: 'Shape Match', icon: '🔺', desc: 'Match circles, squares & triangles', color: '#7E57C2' },
];

export function GameZoneScreen({
  onBack,
  addStars,
  onOpenMemoryMatch,
}: GameZoneScreenProps) {
  const [activeGame, setActiveGame] = useState<GameType>('menu');
  const [round, setRound] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [taraReaction, setTaraReaction] = useState<'idle' | 'cheer'>('idle');
  const [wrongChoices, setWrongChoices] = useState<Set<string>>(new Set());
  const { speak } = useSpeech();
  const profile = loadChildProfile();

  // Helper for win
  const handleCorrectChoice = (spokenAnswer: string) => {
    playTone('correct');
    setShowConfetti(true);
    setTaraReaction('cheer');
    const praise = getPersonalizedPraise(profile);
    speak(`${praise} That's ${spokenAnswer}!`);
    addStars(1);

    setTimeout(() => {
      setShowConfetti(false);
      setTaraReaction('idle');
      setWrongChoices(new Set());
      setRound((r) => r + 1);
    }, 1800);
  };

  const handleWrongChoice = (choiceId: string) => {
    playTone('wrong');
    speak('Try again, you can do it!');
    setWrongChoices((prev) => new Set([...prev, choiceId]));
  };

  // --- 1. FIND THE LETTER ---
  const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'M', 'S', 'T'];
  const targetLetter = alphabet[round % alphabet.length];
  const letterOptions = shuffle([
    targetLetter,
    ...shuffle(alphabet.filter((l) => l !== targetLetter)).slice(0, 2),
  ]);

  // --- 2. FEED TARA ---
  const foods = [
    { name: 'Apple', emoji: '🍎' },
    { name: 'Banana', emoji: '🍌' },
    { name: 'Mango', emoji: '🥭' },
    { name: 'Strawberry', emoji: '🍓' },
    { name: 'Watermelon', emoji: '🍉' },
  ];
  const targetFood = foods[round % foods.length];
  const foodOptions = shuffle([
    targetFood,
    ...shuffle(foods.filter((f) => f.name !== targetFood.name)).slice(0, 2),
  ]);

  // --- 3. MISSING LETTER ---
  const missingTriplets = [
    { first: 'A', blank: 'B', third: 'C' },
    { first: 'C', blank: 'D', third: 'E' },
    { first: 'X', blank: 'Y', third: 'Z' },
    { first: 'M', blank: 'N', third: 'O' },
    { first: 'P', blank: 'Q', third: 'R' },
  ];
  const currentTriplet = missingTriplets[round % missingTriplets.length];
  const missingOptions = shuffle([
    currentTriplet.blank,
    ...shuffle(alphabet.filter((l) => l !== currentTriplet.blank)).slice(0, 2),
  ]);

  // --- 4. COUNT OBJECTS ---
  const targetCount = (round % 5) + 2; // 2 to 6
  const countOptions = shuffle([
    targetCount,
    ...shuffle([1, 2, 3, 4, 5, 6].filter((n) => n !== targetCount)).slice(0, 2),
  ]);

  // --- 5. MORE VS LESS ---
  const groupA = (round % 3) + 2;
  const groupB = groupA + 2;
  const moreAnswer = groupB > groupA ? 'B' : 'A';

  return (
    <div
      className="flex flex-col h-full animate-fade-in select-none relative overflow-hidden"
      style={{
        background: `linear-gradient(160deg, #FFF9C4 0%, ${colors.pastels[round % 6]} 100%)`,
      }}
    >
      <Confetti active={showConfetti} />

      {/* Top bar */}
      <div className="flex items-center justify-between p-4 sticky top-0 bg-white/70 backdrop-blur-sm z-10 shadow-xs">
        <BackButton
          onClick={() => {
            if (activeGame === 'menu') {
              onBack();
            } else {
              setActiveGame('menu');
            }
          }}
        />
        <h2 className="font-rounded font-bold text-2xl text-slate-800">
          {activeGame === 'menu' ? 'Game Zone' : GAMES_LIST.find((g) => g.id === activeGame)?.title}
        </h2>
        <div className="w-8" />
      </div>

      {/* GAMES MENU */}
      {activeGame === 'menu' && (
        <div className="flex-1 overflow-y-auto p-4 max-w-[420px] mx-auto w-full pb-8">
          <div className="text-center mb-4">
            <span className="font-rounded text-sm font-semibold text-slate-600">
              Short, playful mini-games with Tara!
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {GAMES_LIST.map((game) => (
              <button
                key={game.id}
                onClick={() => {
                  playTone('tap');
                  setActiveGame(game.id);
                  setRound(0);
                  setWrongChoices(new Set());
                }}
                className="rounded-3xl p-4 bg-white shadow-md border-2 border-amber-200/80 hover:scale-[1.03] active:scale-95 transition-all text-left flex flex-col justify-between min-h-[130px] cursor-pointer"
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-2"
                  style={{ backgroundColor: game.color + '20' }}
                >
                  {game.icon}
                </div>
                <div>
                  <span className="font-rounded font-bold text-base text-slate-800 block line-clamp-1">
                    {game.title}
                  </span>
                  <span className="font-rounded text-[11px] text-slate-500 line-clamp-1">
                    {game.desc}
                  </span>
                </div>
              </button>
            ))}

            {/* Memory Match Card */}
            <button
              onClick={() => {
                playTone('tap');
                onOpenMemoryMatch();
              }}
              className="col-span-2 rounded-3xl p-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg flex items-center justify-between transition-transform active:scale-95 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-3xl">
                  🧩
                </div>
                <div className="text-left">
                  <span className="font-rounded font-bold text-lg block">Memory Match</span>
                  <span className="text-xs opacity-90">Match card pairs in Easy, Medium & Hard!</span>
                </div>
              </div>
              <span className="text-2xl">➔</span>
            </button>
          </div>
        </div>
      )}

      {/* --- GAME 1: FIND THE LETTER --- */}
      {activeGame === 'find_letter' && (
        <div className="flex-1 flex flex-col items-center justify-between p-4 z-10">
          <div className="flex justify-center mt-2">
            <TaraMascot size={74} animation={taraReaction} />
          </div>

          <div className="my-2 p-4 bg-white/95 rounded-3xl border-3 border-amber-300 text-center shadow-lg w-full max-w-[320px]">
            <span className="text-xs uppercase font-bold text-amber-700 block">Tap the Letter:</span>
            <span className="font-rounded font-bold text-5xl text-amber-950 mt-1 block">
              {targetLetter}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3.5 w-full max-w-[280px]">
            {letterOptions.map((opt) => (
              <ChoiceButton
                key={opt}
                label={opt}
                state={wrongChoices.has(opt) ? 'wrong' : 'default'}
                onClick={() => {
                  if (opt === targetLetter) handleCorrectChoice(targetLetter);
                  else handleWrongChoice(opt);
                }}
              />
            ))}
          </div>

          <div className="text-slate-500 font-rounded font-bold text-sm pb-4">
            Round {round + 1}
          </div>
        </div>
      )}

      {/* --- GAME 2: FEED TARA --- */}
      {activeGame === 'feed_tara' && (
        <div className="flex-1 flex flex-col items-center justify-between p-4 z-10">
          <div className="flex flex-col items-center mt-2">
            <TaraMascot size={90} animation={taraReaction} />
            <span className="font-rounded font-bold text-sm text-amber-950 mt-1">
              "Tara is hungry! Feed me a {targetFood.name}!"
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 w-full max-w-[280px]">
            {foodOptions.map((food) => (
              <ChoiceButton
                key={food.name}
                label={food.name}
                emoji={food.emoji}
                state={wrongChoices.has(food.name) ? 'wrong' : 'default'}
                onClick={() => {
                  if (food.name === targetFood.name) handleCorrectChoice(food.name);
                  else handleWrongChoice(food.name);
                }}
              />
            ))}
          </div>

          <div className="text-slate-500 font-rounded font-bold text-sm pb-4">
            Round {round + 1}
          </div>
        </div>
      )}

      {/* --- GAME 3: MISSING LETTER --- */}
      {activeGame === 'missing_letter' && (
        <div className="flex-1 flex flex-col items-center justify-between p-4 z-10">
          <div className="flex justify-center mt-2">
            <TaraMascot size={70} animation={taraReaction} />
          </div>

          <div className="my-2 p-5 bg-white/95 rounded-3xl border-3 border-purple-300 text-center shadow-lg w-full max-w-[320px]">
            <span className="text-xs uppercase font-bold text-purple-700 block mb-2">What letter goes in the blank?</span>
            <div className="flex items-center justify-center gap-3 font-rounded font-bold text-4xl text-purple-950">
              <span>{currentTriplet.first}</span>
              <span className="w-14 h-14 rounded-2xl border-3 border-dashed border-purple-400 bg-purple-50 flex items-center justify-center text-purple-400">
                ?
              </span>
              <span>{currentTriplet.third}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 w-full max-w-[300px]">
            {missingOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  if (opt === currentTriplet.blank) handleCorrectChoice(opt);
                  else handleWrongChoice(opt);
                }}
                className="aspect-square rounded-2xl bg-white shadow-md border-2 border-purple-200 text-3xl font-rounded font-bold text-purple-900 active:scale-95"
              >
                {opt}
              </button>
            ))}
          </div>

          <div className="text-slate-500 font-rounded font-bold text-sm pb-4">
            Round {round + 1}
          </div>
        </div>
      )}

      {/* --- GAME 4: COUNT OBJECTS --- */}
      {activeGame === 'count_objects' && (
        <div className="flex-1 flex flex-col items-center justify-between p-4 z-10">
          <div className="my-2 p-5 bg-white/95 rounded-3xl border-3 border-blue-300 text-center shadow-lg w-full max-w-[320px]">
            <span className="text-xs uppercase font-bold text-blue-700 block mb-2">How many balloons?</span>
            <div className="flex flex-wrap justify-center gap-2 text-4xl py-2">
              {Array.from({ length: targetCount }).map((_, i) => (
                <span key={i} className="animate-bounce-gentle" style={{ animationDelay: `${i * 0.15}s` }}>
                  🎈
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 w-full max-w-[300px]">
            {countOptions.map((num) => (
              <button
                key={num}
                onClick={() => {
                  if (num === targetCount) handleCorrectChoice(String(num));
                  else handleWrongChoice(String(num));
                }}
                className="aspect-square rounded-2xl bg-white shadow-md border-2 border-blue-200 text-4xl font-rounded font-bold text-blue-900 active:scale-95"
              >
                {num}
              </button>
            ))}
          </div>

          <div className="text-slate-500 font-rounded font-bold text-sm pb-4">
            Round {round + 1}
          </div>
        </div>
      )}

      {/* --- GAME 5: MORE VS LESS --- */}
      {activeGame === 'more_less' && (
        <div className="flex-1 flex flex-col items-center justify-between p-4 z-10">
          <div className="text-center my-2">
            <h3 className="font-rounded font-bold text-2xl text-slate-800">
              Which bowl has MORE apples? 🍎
            </h3>
          </div>

          <div className="flex gap-4 w-full max-w-[320px]">
            {/* Box A */}
            <button
              onClick={() => {
                if (moreAnswer === 'A') handleCorrectChoice('Group A');
                else handleWrongChoice('A');
              }}
              className="flex-1 aspect-square bg-white rounded-3xl shadow-lg border-3 border-green-300 p-3 flex flex-col items-center justify-center active:scale-95"
            >
              <div className="flex flex-wrap justify-center gap-1 text-2xl mb-2">
                {Array.from({ length: groupA }).map((_, i) => (
                  <span key={i}>🍎</span>
                ))}
              </div>
              <span className="font-rounded font-bold text-lg text-green-900">Bowl A</span>
            </button>

            {/* Box B */}
            <button
              onClick={() => {
                if (moreAnswer === 'B') handleCorrectChoice('Bowl B');
                else handleWrongChoice('B');
              }}
              className="flex-1 aspect-square bg-white rounded-3xl shadow-lg border-3 border-green-300 p-3 flex flex-col items-center justify-center active:scale-95"
            >
              <div className="flex flex-wrap justify-center gap-1 text-2xl mb-2">
                {Array.from({ length: groupB }).map((_, i) => (
                  <span key={i}>🍎</span>
                ))}
              </div>
              <span className="font-rounded font-bold text-lg text-green-900">Bowl B</span>
            </button>
          </div>

          <div className="text-slate-500 font-rounded font-bold text-sm pb-4">
            Round {round + 1}
          </div>
        </div>
      )}

      {/* Fallback for other modes */}
      {(activeGame === 'letter_puzzle' || activeGame === 'color_hunt' || activeGame === 'shape_match') && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center z-10">
          <span className="text-6xl mb-3">⭐</span>
          <h3 className="font-rounded font-bold text-2xl text-slate-800 mb-2">
            Ready to Play!
          </h3>
          <p className="font-rounded text-sm text-slate-600 mb-6">
            Tap below to earn a star!
          </p>
          <button
            onClick={() => handleCorrectChoice('Super Job')}
            className="px-8 py-3.5 bg-amber-500 text-white font-rounded font-bold text-xl rounded-2xl shadow-lg active:scale-95"
          >
            Claim Star ⭐
          </button>
        </div>
      )}
    </div>
  );
}
