import { useState } from 'react';
import { BackButton } from '@/components/BackButton';
import { colors } from '@/theme';
import { playTone } from '@/hooks/useSpeech';
import {
  getDayStreak,
  getPast7DaysStats,
  getNeedsPracticeItems,
  getDoingGreatItems,
  loadDetailedProgress,
  saveDetailedProgress,
  getItemStatus,
} from '@/utils/progressTracker';
import { Trophy, TrendingUp, Sparkles, AlertCircle, Share2, RotateCcw } from 'lucide-react';

interface ParentProgressScreenProps {
  onBack: () => void;
}

export function ParentProgressScreen({ onBack }: ParentProgressScreenProps) {
  const [data, setData] = useState(() => loadDetailedProgress());
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [shareNotice, setShareNotice] = useState(false);

  const streak = getDayStreak();
  const past7Days = getPast7DaysStats();
  const maxStars = Math.max(...past7Days.map((d) => d.stars), 10);
  const needsPractice = getNeedsPracticeItems(5);
  const doingGreat = getDoingGreatItems(5);

  // Compute topic rings
  const topics = ['abc', 'num', 'hindi', 'shapes', 'colors'];
  const topicStats = topics.map((t) => {
    const items = Object.values(data.items).filter((i) => i.topic === t);
    const mastered = items.filter((i) => getItemStatus(i) === 'mastered').length;
    const practicing = items.filter((i) => getItemStatus(i) === 'practicing').length;
    const total = items.length;
    return { topic: t, mastered, practicing, total };
  });

  // Offline rule-based Tip
  const weakest = [...topicStats].sort((a, b) => (a.mastered / (a.total || 1)) - (b.mastered / (b.total || 1)))[0];
  const tipText = weakest
    ? `Tip: Try focusing 5 minutes on ${weakest.topic.toUpperCase()} learning mode together this week!`
    : 'Tip: Consistent 10-minute daily play builds the strongest memory habits!';

  const handleShare = () => {
    playTone('tap');
    const text = `🌟 Twinkle Tots Progress Report: ${streak} day learning streak! Mastered: ${doingGreat.map((i) => i.itemId).join(', ')}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setShareNotice(true);
      setTimeout(() => setShareNotice(false), 2500);
    }
  };

  const handleReset = () => {
    saveDetailedProgress({ items: {}, dayStats: {} });
    setData({ items: {}, dayStats: {} });
    setShowResetConfirm(false);
    playTone('pop');
  };

  return (
    <div
      className="flex flex-col h-full animate-fade-in select-none overflow-y-auto"
      style={{
        background: `linear-gradient(160deg, ${colors.pastels[0]} 0%, ${colors.pastels[1]} 100%)`,
      }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between p-4 sticky top-0 bg-white/80 backdrop-blur-sm z-10 shadow-xs">
        <BackButton onClick={onBack} />
        <h2 className="font-rounded font-bold text-2xl" style={{ color: colors.ink }}>
          Progress Report
        </h2>
        <button
          onClick={handleShare}
          className="p-2.5 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 transition-transform active:scale-95"
          title="Share Report"
        >
          <Share2 size={20} />
        </button>
      </div>

      {shareNotice && (
        <div className="m-3 p-2 bg-green-100 border border-green-300 text-green-800 text-xs font-bold rounded-xl text-center animate-fade-in">
          Report summary copied to clipboard!
        </div>
      )}

      <div className="p-4 flex flex-col gap-4 max-w-[420px] mx-auto w-full pb-8">
        {/* Streak card */}
        <div className="bg-white rounded-3xl p-4 shadow-md flex items-center justify-between border border-amber-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-2xl">
              🔥
            </div>
            <div>
              <div className="font-rounded font-bold text-2xl text-amber-950">
                {streak} Days Streak!
              </div>
              <div className="font-rounded text-xs text-slate-500">
                Learning every day with Tara
              </div>
            </div>
          </div>
          <Trophy size={28} className="text-amber-500" />
        </div>

        {/* 7-Day Chart */}
        <div className="bg-white rounded-3xl p-4 shadow-md border border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <span className="font-rounded font-bold text-sm text-slate-700 flex items-center gap-1.5">
              <TrendingUp size={16} className="text-blue-500" /> Stars This Week
            </span>
          </div>
          <div className="flex items-end justify-between h-28 gap-2 pt-2 px-1">
            {past7Days.map((d, i) => {
              const heightPct = Math.max(10, (d.stars / maxStars) * 100);
              const dayName = new Date(d.date).toLocaleDateString('en-US', { weekday: 'narrow' });
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] font-bold text-slate-400">{d.stars}</span>
                  <div
                    className="w-full bg-gradient-to-t from-amber-400 to-amber-300 rounded-t-lg transition-all duration-500"
                    style={{ height: `${heightPct}%` }}
                  />
                  <span className="text-xs font-bold text-slate-600">{dayName}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Per-Topic Mastered Overview */}
        <div className="bg-white rounded-3xl p-4 shadow-md border border-slate-100">
          <span className="font-rounded font-bold text-sm text-slate-700 block mb-3">
            Topic Mastery
          </span>
          <div className="grid grid-cols-2 gap-2">
            {topicStats.map((ts) => (
              <div key={ts.topic} className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="font-rounded font-bold text-xs uppercase text-slate-600">
                  {ts.topic}
                </span>
                <div className="font-rounded font-bold text-lg text-slate-900 mt-0.5">
                  {ts.mastered} Mastered
                </div>
                <div className="text-[11px] text-slate-400 font-semibold">
                  {ts.practicing} Practicing
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Needs Practice */}
        {needsPractice.length > 0 && (
          <div className="bg-white rounded-3xl p-4 shadow-md border border-slate-100">
            <span className="font-rounded font-bold text-sm text-slate-700 flex items-center gap-1.5 mb-2">
              <AlertCircle size={16} className="text-orange-500" /> Needs Practice
            </span>
            <div className="flex gap-2 flex-wrap">
              {needsPractice.map((item, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 bg-orange-50 border border-orange-200 text-orange-900 rounded-xl font-rounded font-bold text-sm"
                >
                  {item.itemId}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Doing Great */}
        {doingGreat.length > 0 && (
          <div className="bg-white rounded-3xl p-4 shadow-md border border-slate-100">
            <span className="font-rounded font-bold text-sm text-slate-700 flex items-center gap-1.5 mb-2">
              <Sparkles size={16} className="text-green-600" /> Doing Great!
            </span>
            <div className="flex gap-2 flex-wrap">
              {doingGreat.map((item, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 bg-green-50 border border-green-200 text-green-900 rounded-xl font-rounded font-bold text-sm flex items-center gap-1"
                >
                  ⭐ {item.itemId}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tip of the week */}
        <div className="bg-amber-50 rounded-3xl p-4 border border-amber-200">
          <span className="font-rounded font-bold text-xs uppercase text-amber-800 block mb-1">
            Parenting Tip
          </span>
          <p className="font-rounded text-sm text-amber-950 font-medium">
            {tipText}
          </p>
        </div>

        {/* Reset progress button */}
        {!showResetConfirm ? (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center justify-center gap-1.5 py-3 text-red-500 font-rounded font-bold text-xs hover:text-red-700"
          >
            <RotateCcw size={14} /> Reset detailed progress
          </button>
        ) : (
          <div className="p-3 bg-red-50 rounded-2xl border border-red-200 flex flex-col items-center gap-2">
            <span className="font-rounded text-xs text-red-700 font-bold">
              Are you sure? This will reset all mastery records.
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleReset}
                className="px-4 py-1.5 bg-red-500 text-white rounded-xl font-rounded font-bold text-xs"
              >
                Yes, Reset
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-1.5 bg-slate-200 text-slate-700 rounded-xl font-rounded font-bold text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
