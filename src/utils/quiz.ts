import { shuffle } from './shuffle';
import type { ColorEntry, GenericQuestion, HindiEntry, ShapeEntry } from '@/types';

export function buildLetterRound(allLetters: string[], roundSize = 10): GenericQuestion[] {
  const uniqueLetters = shuffle(allLetters).slice(0, Math.min(roundSize, allLetters.length));
  return uniqueLetters.map((letter) => {
    const wrongOptions = shuffle(allLetters.filter((l) => l !== letter)).slice(0, 2);
    const options = shuffle([letter, ...wrongOptions]).map((l) => ({
      id: l,
      kind: 'text' as const,
      value: l,
      label: l,
    }));

    return {
      id: `letter_${letter}`,
      promptText: 'Listen and tap the letter!',
      promptAudioText: `Find the letter ${letter}`,
      correctId: letter,
      options,
      feedbackAudioText: `Yes! ${letter}`,
    };
  });
}

export function buildNumberRound(maxNumber = 10, roundSize = 10): GenericQuestion[] {
  const allNumbers = Array.from({ length: maxNumber }, (_, i) => String(i + 1));
  const uniqueNumbers = shuffle(allNumbers).slice(0, Math.min(roundSize, maxNumber));

  return uniqueNumbers.map((numStr) => {
    const correct = parseInt(numStr, 10);
    const candidates: number[] = [];
    for (let delta = 1; delta <= 3; delta++) {
      if (correct - delta >= 1) candidates.push(correct - delta);
      if (correct + delta <= maxNumber) candidates.push(correct + delta);
    }
    const wrongOptions = shuffle(candidates).slice(0, 2).map(String);
    const options = shuffle([numStr, ...wrongOptions]).map((n) => ({
      id: n,
      kind: 'text' as const,
      value: n,
      label: n,
    }));

    return {
      id: `num_${numStr}`,
      promptText: 'How many?',
      promptAudioText: 'How many?',
      correctId: numStr,
      options,
      feedbackAudioText: `Yes!`,
    };
  });
}

export function buildHindiRound(
  allEntries: HindiEntry[],
  mode: 'swar' | 'vyanjan' | 'all' = 'all',
  roundSize = 10
): GenericQuestion[] {
  const filtered = allEntries.filter((e) => {
    if (mode === 'swar') return e.group === 'swar';
    if (mode === 'vyanjan') return e.group === 'vyanjan';
    return true;
  });

  const selected = shuffle(filtered).slice(0, Math.min(roundSize, filtered.length));

  return selected.map((entry) => {
    const wrongEntries = shuffle(filtered.filter((e) => e.id !== entry.id)).slice(0, 2);
    const options = shuffle([entry, ...wrongEntries]).map((e) => ({
      id: e.id,
      kind: 'text' as const,
      value: e.letter,
      label: e.letter,
      emoji: e.noPicture ? undefined : e.emoji,
    }));

    return {
      id: `hindi_${entry.id}`,
      promptText: 'अक्षर सुनो और चुनो',
      promptAudioText: `अक्षर ढूँढो: ${entry.letter}... ${entry.audioPhrase}`,
      correctId: entry.id,
      options,
      feedbackAudioText: `शाबाश! ${entry.audioPhrase}`,
    };
  });
}

export function buildShapeRound(allShapes: ShapeEntry[], roundSize = 10): GenericQuestion[] {
  const shapeColors = ['#FF7043', '#42A5F5', '#66BB6A', '#FFA726', '#AB47BC', '#EC407A', '#26A69A'];
  const shuffledShapes = shuffle(allShapes);
  const selected = shuffledShapes.slice(0, Math.min(roundSize, allShapes.length));

  return selected.map((shape, qIdx) => {
    const wrongShapes = shuffle(allShapes.filter((s) => s.id !== shape.id)).slice(0, 2);
    const optionShapes = shuffle([shape, ...wrongShapes]);
    const palette = shuffle(shapeColors);

    const options = optionShapes.map((s, idx) => ({
      id: s.id,
      kind: 'shape' as const,
      value: s.id,
      label: s.nameEn,
      color: palette[idx % palette.length], // Random distinct color for each shape!
    }));

    return {
      id: `shape_${shape.id}_${qIdx}`,
      promptText: 'Find the shape!',
      promptAudioText: `Find the ${shape.nameEn}... ${shape.nameHi} ढूँढो`,
      correctId: shape.id,
      options,
      feedbackAudioText: `Yes! ${shape.nameEn}`,
    };
  });
}

export function buildColorRound(allColors: ColorEntry[], roundSize = 10): GenericQuestion[] {
  const shuffledColors = shuffle(allColors);
  const selected = shuffledColors.slice(0, Math.min(roundSize, allColors.length));

  return selected.map((color, qIdx) => {
    const wrongColors = shuffle(allColors.filter((c) => c.id !== color.id)).slice(0, 2);
    const options = shuffle([color, ...wrongColors]).map((c) => ({
      id: c.id,
      kind: 'color' as const,
      value: c.id,
      color: c.hex,
      label: c.nameEn,
    }));

    return {
      id: `color_${color.id}_${qIdx}`,
      promptText: 'Find the color!',
      promptAudioText: `Find ${color.nameEn}... ${color.nameHi} ढूँढो`,
      correctId: color.id,
      options,
      feedbackAudioText: `Yes! ${color.nameEn}`,
    };
  });
}

export function roundStars(firstTryCorrect: number): number {
  if (firstTryCorrect >= 9) return 3;
  if (firstTryCorrect >= 5) return 2;
  return 1;
}
