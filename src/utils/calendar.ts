import daysData from '@/data/days.json';
import monthsData from '@/data/months.json';
import { shuffle } from './shuffle';

export interface DayItem {
  id: string;
  index: number; // 0=Sunday, 1=Monday... 6=Saturday
  en: string;
  hi: string;
  color: string;
  audioEn: string;
  audioHi: string;
}

export interface MonthItem {
  id: string;
  index: number; // 1=Jan... 12=Dec
  en: string;
  hi: string;
  season: 'Winter' | 'Summer' | 'Rains';
  cueEmoji: string;
  cueName: string;
  cueHi: string;
  daysCount: number;
  color: string;
}

export const DAYS: DayItem[] = daysData as DayItem[];
export const MONTHS: MonthItem[] = monthsData as MonthItem[];

/**
 * Returns the 7 days ordered by weekStart ('sun' or 'mon')
 */
export function orderedDays(weekStart: 'sun' | 'mon' = 'sun'): DayItem[] {
  if (weekStart === 'sun') {
    return [...DAYS];
  }
  // Monday start: Mon(1), Tue(2), Wed(3), Thu(4), Fri(5), Sat(6), Sun(0)
  const monday = DAYS.filter((d) => d.index >= 1).sort((a, b) => a.index - b.index);
  const sunday = DAYS.find((d) => d.index === 0);
  return sunday ? [...monday, sunday] : [...DAYS];
}

/**
 * Standard days order index map (Sun=0, Mon=1...)
 */
export function nextDay(dayId: string): DayItem {
  const current = DAYS.find((d) => d.id === dayId) || DAYS[0];
  const nextIdx = (current.index + 1) % 7;
  return DAYS.find((d) => d.index === nextIdx) || DAYS[0];
}

export function prevDay(dayId: string): DayItem {
  const current = DAYS.find((d) => d.id === dayId) || DAYS[0];
  const prevIdx = (current.index + 6) % 7;
  return DAYS.find((d) => d.index === prevIdx) || DAYS[0];
}

export function dayAfter(dayId: string, n: number): DayItem {
  const current = DAYS.find((d) => d.id === dayId) || DAYS[0];
  const targetIdx = (((current.index + n) % 7) + 7) % 7;
  return DAYS.find((d) => d.index === targetIdx) || DAYS[0];
}

export function dayBefore(dayId: string, n: number): DayItem {
  return dayAfter(dayId, -n);
}

export function nextMonth(monthId: string): MonthItem {
  const current = MONTHS.find((m) => m.id === monthId) || MONTHS[0];
  const nextIdx = current.index === 12 ? 1 : current.index + 1;
  return MONTHS.find((m) => m.index === nextIdx) || MONTHS[0];
}

export function prevMonth(monthId: string): MonthItem {
  const current = MONTHS.find((m) => m.id === monthId) || MONTHS[0];
  const prevIdx = current.index === 1 ? 12 : current.index - 1;
  return MONTHS.find((m) => m.index === prevIdx) || MONTHS[11];
}

export function isLeapYear(year: number): boolean {
  if (year % 400 === 0) return true;
  if (year % 100 === 0) return false;
  return year % 4 === 0;
}

export function daysInMonth(year: number, monthIndex1to12: number): number {
  if (monthIndex1to12 === 2) {
    return isLeapYear(year) ? 29 : 28;
  }
  if ([4, 6, 9, 11].includes(monthIndex1to12)) {
    return 30;
  }
  return 31;
}

export function todayInfo() {
  const now = new Date();
  const dayOfWeekIndex = now.getDay(); // 0 = Sun
  const date = now.getDate();
  const month0to11 = now.getMonth();
  const year = now.getFullYear();

  const currentDay = DAYS.find((d) => d.index === dayOfWeekIndex) || DAYS[0];
  const currentMonth = MONTHS.find((m) => m.index === month0to11 + 1) || MONTHS[0];

  return {
    dayOfWeekIndex,
    date,
    month0to11,
    year,
    dayItem: currentDay,
    monthItem: currentMonth,
  };
}

export interface CalendarDayCell {
  date: number; // 1..31 or 0 for empty cell padding
  isCurrentMonth: boolean;
  isToday: boolean;
  dayItem?: DayItem;
}

/**
 * Creates 7-column calendar week rows for a given month and year
 */
export function monthGrid(
  year: number,
  month0to11: number,
  weekStart: 'sun' | 'mon' = 'sun'
): CalendarDayCell[][] {
  const totalDays = daysInMonth(year, month0to11 + 1);
  const firstDay = new Date(year, month0to11, 1).getDay(); // 0=Sun, 1=Mon...

  // offset calculation
  let startOffset = firstDay;
  if (weekStart === 'mon') {
    startOffset = firstDay === 0 ? 6 : firstDay - 1;
  }

  const today = todayInfo();
  const isThisMonth = today.year === year && today.month0to11 === month0to11;

  const rows: CalendarDayCell[][] = [];
  let currentRow: CalendarDayCell[] = [];

  // leading empty cells
  for (let i = 0; i < startOffset; i++) {
    currentRow.push({ date: 0, isCurrentMonth: false, isToday: false });
  }

  for (let d = 1; d <= totalDays; d++) {
    const isToday = isThisMonth && today.date === d;
    currentRow.push({
      date: d,
      isCurrentMonth: true,
      isToday,
    });

    if (currentRow.length === 7) {
      rows.push(currentRow);
      currentRow = [];
    }
  }

  // trailing empty cells
  if (currentRow.length > 0) {
    while (currentRow.length < 7) {
      currentRow.push({ date: 0, isCurrentMonth: false, isToday: false });
    }
    rows.push(currentRow);
  }

  return rows;
}

export interface SequenceQuestion {
  id: string;
  kind: 'day' | 'month';
  level: 1 | 2 | 3;
  direction: 'next' | 'before';
  givenItems: Array<DayItem | MonthItem>;
  correctItem: DayItem | MonthItem;
  options: Array<DayItem | MonthItem>;
  promptEn: string;
  promptHi: string;
}

/**
 * Generates unique sequence questions for Next Up game
 */
export function buildSequenceQuestions(
  kind: 'day' | 'month',
  level: 1 | 2 | 3,
  count = 10,
  weekStart: 'sun' | 'mon' = 'sun'
): SequenceQuestion[] {
  const questions: SequenceQuestion[] = [];
  const days = orderedDays(weekStart);
  const months = MONTHS;

  for (let i = 0; i < count; i++) {
    if (kind === 'day') {
      const startIdx = (i * 3 + Math.floor(Math.random() * 7)) % 7;
      const isBefore = level >= 2 && i % 2 === 1;

      if (!isBefore) {
        // "What comes next?"
        const d1 = days[startIdx];
        const d2 = nextDay(d1.id);
        const correct = nextDay(d2.id);

        const wrongCandidates = days.filter((d) => d.id !== correct.id);
        const options = shuffle([correct, ...shuffle(wrongCandidates).slice(0, 2)]);

        questions.push({
          id: `seq_day_${i}`,
          kind: 'day',
          level,
          direction: 'next',
          givenItems: level === 1 ? [d1, d2] : [d2],
          correctItem: correct,
          options,
          promptEn: `What comes after ${d2.en}?`,
          promptHi: `${d2.hi} के बाद क्या आता है?`,
        });
      } else {
        // "What comes before?"
        const d2 = days[startIdx];
        const correct = prevDay(d2.id);

        const wrongCandidates = days.filter((d) => d.id !== correct.id);
        const options = shuffle([correct, ...shuffle(wrongCandidates).slice(0, 2)]);

        questions.push({
          id: `seq_day_before_${i}`,
          kind: 'day',
          level,
          direction: 'before',
          givenItems: [d2],
          correctItem: correct,
          options,
          promptEn: `What comes before ${d2.en}?`,
          promptHi: `${d2.hi} से पहले क्या आता है?`,
        });
      }
    } else {
      // month sequence
      const startMonthIdx = (i * 2 + 1) % 12;
      const m1 = months[startMonthIdx];
      const correct = nextMonth(m1.id);

      const wrongCandidates = months.filter((m) => m.id !== correct.id);
      const options = shuffle([correct, ...shuffle(wrongCandidates).slice(0, 2)]);

      questions.push({
        id: `seq_month_${i}`,
        kind: 'month',
        level,
        direction: 'next',
        givenItems: [m1],
        correctItem: correct,
        options,
        promptEn: `What month comes after ${m1.en}?`,
        promptHi: `${m1.hi} के बाद कौन सा महीना आता है?`,
      });
    }
  }

  return questions;
}
