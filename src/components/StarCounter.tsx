import { Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { colors } from '@/theme';

interface StarCounterProps {
  count: number;
}

export function StarCounter({ count }: StarCounterProps) {
  const [isPopping, setIsPopping] = useState(false);
  const [prevCount, setPrevCount] = useState(count);

  useEffect(() => {
    if (count > prevCount) {
      setIsPopping(true);
      const timer = setTimeout(() => setIsPopping(false), 450);
      return () => clearTimeout(timer);
    }
    setPrevCount(count);
  }, [count, prevCount]);

  return (
    <div
      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-rounded border-2 border-amber-300 shadow-md transition-transform duration-300 ${
        isPopping ? 'scale-115 shadow-lg border-amber-400' : 'scale-100'
      }`}
      style={{
        background: 'linear-gradient(135deg, #FFFDF7 0%, #FFF8E1 50%, #FFFDF7 100%)',
      }}
    >
      <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
        <Star
          size={18}
          fill="#FFC107"
          stroke="#FFA000"
          className={`transition-transform ${isPopping ? 'rotate-180 scale-125' : 'animate-pulse'}`}
        />
      </div>

      <span
        className="font-extrabold text-base text-slate-800"
        style={{ letterSpacing: '0.02em' }}
      >
        {count}
      </span>

      <span className="text-[11px] font-extrabold text-amber-700 uppercase tracking-wider">
        {count === 1 ? 'Star' : 'Stars'}
      </span>
    </div>
  );
}
