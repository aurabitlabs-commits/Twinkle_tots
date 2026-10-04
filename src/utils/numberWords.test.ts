import { describe, it, expect } from 'vitest';
import {
  getNumberWord,
  getAllNumbers,
  generateSequenceQuestion,
} from './numberWords';

describe('numberWords utilities', () => {
  it('correctly returns spellings for key milestones', () => {
    expect(getNumberWord(1).en).toBe('One');
    expect(getNumberWord(1).hi).toBe('एक');
    expect(getNumberWord(14).en).toBe('Fourteen');
    expect(getNumberWord(14).hi).toBe('चौदह');
    expect(getNumberWord(20).en).toBe('Twenty');
    expect(getNumberWord(20).hi).toBe('बीस');
    expect(getNumberWord(40).en).toBe('Forty');
    expect(getNumberWord(40).hi).toBe('चालीस');
    expect(getNumberWord(45).en).toBe('Forty-Five');
    expect(getNumberWord(45).hi).toBe('पैंतालीस');
    expect(getNumberWord(78).en).toBe('Seventy-Eight');
    expect(getNumberWord(78).hi).toBe('अठहत्तर');
    expect(getNumberWord(100).en).toBe('One Hundred');
    expect(getNumberWord(100).hi).toBe('एक सौ');
  });

  it('generates 100 numbers correctly', () => {
    const list = getAllNumbers(100);
    expect(list.length).toBe(100);
    expect(list[0].num).toBe(1);
    expect(list[99].num).toBe(100);
  });

  it('generates Before questions correctly', () => {
    const q = generateSequenceQuestion('before', '1-20');
    expect(q.type).toBe('before');
    expect(q.correctNumber).toBe(q.givenNumbers[0] - 1);
    expect(q.options.includes(q.correctNumber)).toBe(true);
  });

  it('generates After questions correctly', () => {
    const q = generateSequenceQuestion('after', '1-50');
    expect(q.type).toBe('after');
    expect(q.correctNumber).toBe(q.givenNumbers[0] + 1);
    expect(q.options.includes(q.correctNumber)).toBe(true);
  });

  it('generates Between questions correctly', () => {
    const q = generateSequenceQuestion('between', '1-100');
    expect(q.type).toBe('between');
    expect(q.correctNumber).toBe(q.givenNumbers[0] + 1);
    expect(q.givenNumbers[1]).toBe(q.givenNumbers[0] + 2);
    expect(q.options.includes(q.correctNumber)).toBe(true);
  });
});
