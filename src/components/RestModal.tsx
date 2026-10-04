import { useState } from 'react';
import { TaraMascot } from './TaraMascot';
import { colors } from '@/theme';
import { playTone } from '@/hooks/useSpeech';

interface RestModalProps {
  onGrantMoreTime: () => void;
}

export function RestModal({ onGrantMoreTime }: RestModalProps) {
  const [showGate, setShowGate] = useState(false);
  const [answer, setAnswer] = useState('');
  const [mathA] = useState(() => Math.floor(Math.random() * 6) + 3);
  const [mathB] = useState(() => Math.floor(Math.random() * 6) + 3);

  const handleGateSubmit = () => {
    if (parseInt(answer, 10) === mathA + mathB) {
      playTone('correct');
      onGrantMoreTime();
    } else {
      playTone('wrong');
      setAnswer('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in select-none">
      <div className="bg-white rounded-[2.5rem] p-6 max-w-[360px] w-full text-center shadow-2xl border-4 border-amber-300 animate-pop">
        <div className="flex justify-center mb-3">
          <TaraMascot size={110} animation="idle" />
        </div>

        <h3 className="font-rounded font-bold text-3xl text-amber-900 mb-1">
          Time to Rest! 🌙
        </h3>
        <p className="font-rounded text-slate-600 text-base mb-6">
          You played wonderfully today! Tara is sleepy and resting her eyes.
        </p>

        {!showGate ? (
          <button
            onClick={() => {
              playTone('tap');
              setShowGate(true);
            }}
            className="w-full py-3.5 px-6 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-rounded font-bold text-lg shadow-sm transition-transform active:scale-95"
          >
            🔒 Grown-Up: Grant 10 More Mins
          </button>
        ) : (
          <div className="flex flex-col gap-3 p-3 bg-amber-50 rounded-2xl border border-amber-200">
            <span className="font-rounded font-bold text-sm text-amber-900">
              Parents only: What is {mathA} + {mathB}?
            </span>
            <div className="flex gap-2 justify-center">
              <input
                type="number"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="?"
                className="w-20 text-center font-rounded font-bold text-2xl p-2 bg-white rounded-xl border-2 border-amber-300"
                autoFocus
              />
              <button
                onClick={handleGateSubmit}
                className="px-4 py-2 bg-green-500 text-white font-rounded font-bold rounded-xl shadow-sm active:scale-95"
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
