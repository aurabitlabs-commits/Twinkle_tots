import { useState } from 'react';
import { BackButton } from '@/components/BackButton';
import { Delete } from 'lucide-react';
import { colors } from '@/theme';
import { playTone } from '@/hooks/useSpeech';
import { TaraMascot } from '@/components/TaraMascot';

interface ParentGateScreenProps {
  onBack: () => void;
  onPass: () => void;
}

function generateQuestion(): { a: number; b: number; answer: number } {
  const a = Math.floor(Math.random() * 8) + 2;
  const b = Math.floor(Math.random() * 8) + 2;
  return { a, b, answer: a + b };
}

export function ParentGateScreen({ onBack, onPass }: ParentGateScreenProps) {
  const [question, setQuestion] = useState(generateQuestion);
  const [input, setInput] = useState('');
  const [wrong, setWrong] = useState(false);

  const handleDigit = (digit: string) => {
    playTone('tap');
    if (input.length < 2) {
      setInput((prev) => prev + digit);
    }
  };

  const handleDelete = () => {
    playTone('tap');
    setInput((prev) => prev.slice(0, -1));
  };

  const handleSubmit = () => {
    if (input === '') return;
    const value = parseInt(input, 10);
    if (value === question.answer) {
      playTone('correct');
      onPass();
    } else {
      playTone('wrong');
      setWrong(true);
      setTimeout(() => {
        setWrong(false);
        setInput('');
        setQuestion(generateQuestion());
        onBack();
      }, 1500);
    }
  };

  return (
    <div
      className="flex flex-col h-full animate-fade-in"
      style={{ background: `linear-gradient(160deg, ${colors.pastels[0]}, ${colors.pastels[2]})` }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between p-4">
        <BackButton onClick={onBack} />
        <h2 className="font-rounded font-bold" style={{ fontSize: '1.75rem', color: colors.ink }}>
          Parents Only
        </h2>
        <div style={{ width: '64px' }} />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6">
        <TaraMascot size={70} animation="idle" />

        <div
          className="rounded-[2rem] p-6 flex flex-col items-center gap-4 w-full max-w-[340px]"
          style={{ backgroundColor: '#FFFFFF', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
        >
          <p className="font-rounded text-center" style={{ fontSize: '1.25rem', color: colors.inkLight }}>
            Please solve this to continue
          </p>
          <p className="font-rounded font-bold" style={{ fontSize: '2.5rem', color: colors.ink }}>
            {question.a} + {question.b} = ?
          </p>

          {/* Display */}
          <div
            className="rounded-[1rem] flex items-center justify-center"
            style={{
              width: '120px',
              height: '64px',
              backgroundColor: wrong ? colors.errorLight : colors.pastels[0],
              border: `4px solid ${wrong ? colors.error : colors.pastelBorders[0]}`,
            }}
          >
            <span className="font-rounded font-bold" style={{ fontSize: '2rem', color: colors.ink }}>
              {input || '?'}
            </span>
          </div>

          {wrong && (
            <p className="font-rounded" style={{ fontSize: '1.25rem', color: colors.error }}>
              Oops! Going back...
            </p>
          )}

          {/* Keypad */}
          <div className="grid grid-cols-3 gap-3">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
              <button
                key={d}
                onClick={() => handleDigit(d)}
                className="rounded-[1rem] font-rounded font-bold flex items-center justify-center transition-all duration-150 active:scale-90 hover:scale-105 cursor-pointer"
                style={{
                  width: '64px',
                  height: '64px',
                  backgroundColor: colors.pastels[parseInt(d, 10) % 6],
                  color: colors.ink,
                  fontSize: '1.75rem',
                  border: `3px solid ${colors.pastelBorders[parseInt(d, 10) % 6]}`,
                }}
              >
                {d}
              </button>
            ))}
            <button
              onClick={handleDelete}
              className="rounded-[1rem] flex items-center justify-center transition-all duration-150 active:scale-90 hover:scale-105 cursor-pointer"
              style={{
                width: '64px',
                height: '64px',
                backgroundColor: '#E0E0E0',
              }}
            >
              <Delete size={28} color={colors.ink} />
            </button>
            <button
              onClick={() => handleDigit('0')}
              className="rounded-[1rem] font-rounded font-bold flex items-center justify-center transition-all duration-150 active:scale-90 hover:scale-105 cursor-pointer"
              style={{
                width: '64px',
                height: '64px',
                backgroundColor: colors.pastels[0],
                color: colors.ink,
                fontSize: '1.75rem',
                border: `3px solid ${colors.pastelBorders[0]}`,
              }}
            >
              0
            </button>
            <button
              onClick={handleSubmit}
              className="rounded-[1rem] font-rounded font-bold flex items-center justify-center transition-all duration-150 active:scale-90 hover:scale-105 cursor-pointer"
              style={{
                width: '64px',
                height: '64px',
                backgroundColor: colors.success,
                color: '#FFFFFF',
                fontSize: '1.25rem',
              }}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
