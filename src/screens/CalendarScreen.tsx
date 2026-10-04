import { useState } from 'react';
import { BackButton } from '@/components/BackButton';
import { colors } from '@/theme';
import { playTone, useSpeech } from '@/hooks/useSpeech';
import {
  monthGrid,
  todayInfo,
  orderedDays,
  MONTHS,
  DAYS,
  daysInMonth,
} from '@/utils/calendar';
import { ChevronLeft, ChevronRight, RotateCcw, Calendar as CalendarIcon, Volume2 } from 'lucide-react';

interface CalendarScreenProps {
  onBack: () => void;
  weekStart?: 'sun' | 'mon';
  voiceLang?: 'en' | 'hi' | 'both';
}

export function CalendarScreen({
  onBack,
  weekStart = 'sun',
  voiceLang = 'both',
}: CalendarScreenProps) {
  const today = todayInfo();
  const [currentYear, setCurrentYear] = useState(today.year);
  const [currentMonth0to11, setCurrentMonth0to11] = useState(today.month0to11);
  const { speak, stop } = useSpeech();

  const daysHeader = orderedDays(weekStart);
  const grid = monthGrid(currentYear, currentMonth0to11, weekStart);
  const monthData = MONTHS[currentMonth0to11];
  const totalDays = daysInMonth(currentYear, currentMonth0to11 + 1);

  const handlePrevMonth = () => {
    playTone('tap');
    if (currentMonth0to11 === 0) {
      setCurrentMonth0to11(11);
      setCurrentYear((y) => Math.max(today.year - 5, y - 1));
    } else {
      setCurrentMonth0to11((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    playTone('tap');
    if (currentMonth0to11 === 11) {
      setCurrentMonth0to11(0);
      setCurrentYear((y) => Math.min(today.year + 5, y + 1));
    } else {
      setCurrentMonth0to11((m) => m + 1);
    }
  };

  const handleJumpToday = () => {
    playTone('pop');
    setCurrentYear(today.year);
    setCurrentMonth0to11(today.month0to11);
  };

  const handleDateClick = (dateNum: number) => {
    if (dateNum === 0) return;
    playTone('pop');

    const clickedDate = new Date(currentYear, currentMonth0to11, dateNum);
    const dayOfWeek = clickedDate.getDay();
    const dayItem = DAYS.find((d) => d.index === dayOfWeek) || DAYS[0];

    const speech =
      voiceLang === 'hi'
        ? `${dayItem.hi}, ${dateNum} ${monthData.hi}`
        : voiceLang === 'both'
        ? `${dayItem.en}, ${dateNum} ${monthData.en}`
        : `${dayItem.en}, ${dateNum} ${monthData.en}`;

    speak(speech);
  };

  return (
    <div
      className="flex flex-col h-full animate-fade-in select-none relative overflow-y-auto"
      style={{
        background: `linear-gradient(160deg, #E8F5E9 0%, #FFFFFF 60%, #E0F2F1 100%)`,
      }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between p-4 sticky top-0 bg-white/70 backdrop-blur-sm z-20 shadow-xs">
        <BackButton
          onClick={() => {
            stop();
            onBack();
          }}
        />
        <h2 className="font-rounded font-bold text-2xl text-slate-800">
          My Calendar
        </h2>
        <button
          onClick={handleJumpToday}
          className="px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-xl font-rounded font-bold text-xs shadow-xs active:scale-95 flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw size={12} /> Today
        </button>
      </div>

      <div className="p-4 flex flex-col gap-4 max-w-[420px] mx-auto w-full pb-8">
        {/* Calendar Card Container */}
        <div className="bg-white rounded-[2.5rem] p-5 shadow-xl border-4 border-emerald-300 flex flex-col items-center">
          {/* Month & Year Navigation Header */}
          <div className="w-full flex items-center justify-between mb-2">
            <button
              onClick={handlePrevMonth}
              className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-95 cursor-pointer"
            >
              <ChevronLeft size={22} />
            </button>

            <div className="text-center">
              <h3 className="font-rounded font-extrabold text-2xl text-emerald-950 leading-tight">
                {monthData.en} {currentYear}
              </h3>
              <span className="font-rounded font-bold text-sm text-emerald-700">
                {monthData.hi}
              </span>
            </div>

            <button
              onClick={handleNextMonth}
              className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-95 cursor-pointer"
            >
              <ChevronRight size={22} />
            </button>
          </div>

          {/* Days count badge */}
          <div className="mb-4">
            <span className="px-3 py-0.5 bg-emerald-50 text-emerald-800 rounded-full text-xs font-bold border border-emerald-200">
              {totalDays} Days in this month
            </span>
          </div>

          {/* Weekday Initials Header */}
          <div className="grid grid-cols-7 gap-1.5 w-full text-center mb-2">
            {daysHeader.map((d) => (
              <div
                key={d.id}
                className="font-rounded font-bold text-xs py-1 rounded-lg"
                style={{ color: d.color }}
              >
                {d.en.slice(0, 3)}
              </div>
            ))}
          </div>

          {/* Dates Grid */}
          <div className="flex flex-col gap-1.5 w-full">
            {grid.map((week, wIdx) => (
              <div key={wIdx} className="grid grid-cols-7 gap-1.5 w-full">
                {week.map((cell, cIdx) => {
                  if (cell.date === 0) {
                    return <div key={cIdx} className="aspect-square" />;
                  }

                  return (
                    <button
                      key={cIdx}
                      onClick={() => handleDateClick(cell.date)}
                      className={`aspect-square rounded-2xl flex flex-col items-center justify-center font-rounded font-extrabold text-base transition-all active:scale-90 cursor-pointer ${
                        cell.isToday
                          ? 'bg-emerald-500 text-white shadow-md ring-4 ring-emerald-200 animate-pulse'
                          : 'bg-slate-50 text-slate-800 hover:bg-emerald-50 border border-slate-100'
                      }`}
                    >
                      <span>{cell.date}</span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Audio helper hint */}
        <div className="p-3 bg-white/90 rounded-2xl border border-emerald-200 text-center">
          <p className="font-rounded text-xs text-slate-600 font-semibold flex items-center justify-center gap-1.5">
            <Volume2 size={16} className="text-emerald-600" />
            Tap any date to hear the day and date aloud!
          </p>
        </div>
      </div>
    </div>
  );
}
