import { describe, it, expect } from 'vitest';
import {
  orderedDays,
  nextDay,
  prevDay,
  nextMonth,
  prevMonth,
  isLeapYear,
  daysInMonth,
  monthGrid,
  todayInfo,
  buildSequenceQuestions,
} from './calendar';

describe('calendar date logic tests', () => {
  it('orderedDays respects weekStart', () => {
    const sunStart = orderedDays('sun');
    expect(sunStart[0].id).toBe('sun');
    expect(sunStart[6].id).toBe('sat');

    const monStart = orderedDays('mon');
    expect(monStart[0].id).toBe('mon');
    expect(monStart[6].id).toBe('sun');
  });

  it('handles day wrap-around correctly', () => {
    expect(nextDay('sat').id).toBe('sun');
    expect(prevDay('sun').id).toBe('sat');
    expect(nextDay('fri').id).toBe('sat');
  });

  it('handles month wrap-around correctly', () => {
    expect(nextMonth('dec').id).toBe('jan');
    expect(prevMonth('jan').id).toBe('dec');
  });

  it('correctly calculates leap years (2028 yes, 2100 no)', () => {
    expect(isLeapYear(2024)).toBe(true);
    expect(isLeapYear(2028)).toBe(true);
    expect(isLeapYear(2025)).toBe(false);
    expect(isLeapYear(2100)).toBe(false); // Century rule
    expect(isLeapYear(2000)).toBe(true); // 400-year rule
  });

  it('returns correct days count for all months including February', () => {
    expect(daysInMonth(2024, 2)).toBe(29); // leap
    expect(daysInMonth(2025, 2)).toBe(28); // non-leap
    expect(daysInMonth(2025, 1)).toBe(31);
    expect(daysInMonth(2025, 4)).toBe(30);
  });

  it('generates a valid month grid matrix for calendar', () => {
    // October 2026
    const grid = monthGrid(2026, 9, 'sun');
    expect(grid.length).toBeGreaterThanOrEqual(4);
    expect(grid[0].length).toBe(7);
  });

  it('builds sequence questions without duplicating options', () => {
    const questions = buildSequenceQuestions('day', 1, 5, 'sun');
    expect(questions.length).toBe(5);
    questions.forEach((q) => {
      expect(q.options.length).toBe(3);
      expect(q.options.some((o) => o.id === q.correctItem.id)).toBe(true);
    });
  });
});
