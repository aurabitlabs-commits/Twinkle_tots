import { useState } from 'react';
import { TaraMascot } from './TaraMascot';
import { colors } from '@/theme';
import { purchasePlusMock, restorePurchasesMock, isPlusOwned } from '@/utils/entitlements';
import { playTone } from '@/hooks/useSpeech';
import { CheckCircle2, Sparkles, X, ShieldCheck } from 'lucide-react';

interface PaywallModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const PLUS_PACKS_PREVIEW = [
  { title: 'Animals & Sounds', icon: '🦁', desc: '12 animals, real sounds & sound quiz' },
  { title: 'Fruits & Veggies', icon: '🍓', desc: '12 nutritious fruits & vegetables' },
  { title: 'Vehicles & Horns', icon: '🚗', desc: '10 cars, trains, aeroplanes & sounds' },
  { title: 'My Body', icon: '🧒', desc: 'Interactive body parts & touch quiz' },
  { title: 'Hindi Ginti 1-20', icon: '🔟', desc: 'Learn numbers 1 to 20 in Hindi' },
];

export function PaywallModal({ onClose, onSuccess }: PaywallModalProps) {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePurchase = () => {
    setIsProcessing(true);
    playTone('tap');
    setTimeout(() => {
      purchasePlusMock();
      playTone('win');
      setStatusMessage('Welcome to Twinkle Tots Plus! All packs unlocked.');
      setTimeout(() => {
        setIsProcessing(false);
        onSuccess();
      }, 1200);
    }, 800);
  };

  const handleRestore = () => {
    playTone('tap');
    if (isPlusOwned()) {
      setStatusMessage('Purchases restored successfully!');
      setTimeout(() => onSuccess(), 1200);
    } else {
      setStatusMessage('No previous Plus purchase found on this device.');
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in select-none">
      <div className="bg-white rounded-[2.5rem] p-6 max-w-[400px] w-full text-center shadow-2xl border-4 border-amber-300 relative animate-pop overflow-hidden flex flex-col max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-transform active:scale-90"
        >
          <X size={20} />
        </button>

        <div className="flex justify-center mb-1">
          <TaraMascot size={80} animation="cheer" />
        </div>

        <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-900 rounded-full font-rounded font-bold text-xs mx-auto mb-2">
          <Sparkles size={14} /> One-Time Family Purchase
        </div>

        <h3 className="font-rounded font-bold text-3xl text-amber-950 mb-1">
          Twinkle Tots Plus
        </h3>
        <p className="font-rounded text-sm text-slate-600 mb-4">
          Unlock all 5 bonus packs forever. No ads, no subscription, 100% offline.
        </p>

        {/* Scrolling Pack Previews */}
        <div className="flex gap-2 overflow-x-auto py-1 mb-4 no-scrollbar">
          {PLUS_PACKS_PREVIEW.map((pack, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 w-36 bg-amber-50/80 border border-amber-200/80 rounded-2xl p-2.5 flex flex-col items-center text-center shadow-xs"
            >
              <span className="text-3xl mb-1">{pack.icon}</span>
              <span className="font-rounded font-bold text-xs text-amber-900 line-clamp-1">
                {pack.title}
              </span>
              <span className="font-rounded text-[10px] text-slate-500 line-clamp-2 mt-0.5">
                {pack.desc}
              </span>
            </div>
          ))}
        </div>

        {/* Benefits list */}
        <div className="flex flex-col gap-2 text-left mb-5 px-2">
          <div className="flex items-center gap-2 text-xs font-rounded font-semibold text-slate-700">
            <CheckCircle2 size={16} className="text-green-600 flex-shrink-0" />
            <span>Everything currently in the app stays free forever</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-rounded font-semibold text-slate-700">
            <CheckCircle2 size={16} className="text-green-600 flex-shrink-0" />
            <span>5 New Packs: Animals, Fruits, Vehicles, Body & Ginti</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-rounded font-semibold text-slate-700">
            <ShieldCheck size={16} className="text-blue-600 flex-shrink-0" />
            <span>One-time unlock for family • Zero ads • Safe & offline</span>
          </div>
        </div>

        {statusMessage && (
          <div className="p-2 mb-3 bg-green-50 border border-green-200 text-green-800 text-xs font-bold rounded-xl animate-fade-in">
            {statusMessage}
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handlePurchase}
          disabled={isProcessing}
          className="w-full py-3.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-rounded font-bold text-xl shadow-lg transition-transform active:scale-95 disabled:opacity-50"
        >
          {isProcessing ? 'Unlocking...' : 'Unlock Plus for ₹299'}
        </button>

        <button
          onClick={handleRestore}
          className="mt-3 text-xs font-rounded font-semibold text-slate-500 hover:text-slate-800 underline"
        >
          Restore previous purchase
        </button>
      </div>
    </div>
  );
}
