import type { AppProgress, AppSettings } from '@/types';

const KEYS = {
  progress: 'twinkletots_progress',
  settings: 'twinkletots_settings',
} as const;

export const defaultProgress: AppProgress = {
  totalStars: 0,
  bestAbcRound: 0,
  bestNumRound: 0,
  seenCards: [],
  starsByTopic: {},
  tracedLetters: [],
  bestScores: {},
};

export const defaultSettings: AppSettings = {
  soundEffects: true,
  voice: true,
};

export function loadProgress(): AppProgress {
  try {
    const raw = localStorage.getItem(KEYS.progress);
    if (!raw) return { ...defaultProgress };
    const parsed = JSON.parse(raw);
    return {
      ...defaultProgress,
      ...parsed,
      starsByTopic: parsed.starsByTopic || {},
      tracedLetters: parsed.tracedLetters || [],
      bestScores: parsed.bestScores || {},
    };
  } catch {
    return { ...defaultProgress };
  }
}

export function saveProgress(progress: AppProgress): void {
  try {
    localStorage.setItem(KEYS.progress, JSON.stringify(progress));
  } catch {
    // storage failure should never crash the app
  }
}

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(KEYS.settings);
    if (!raw) return { ...defaultSettings };
    const parsed = JSON.parse(raw);
    return { ...defaultSettings, ...parsed };
  } catch {
    return { ...defaultSettings };
  }
}

export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(KEYS.settings, JSON.stringify(settings));
  } catch {
    // storage failure should never crash the app
  }
}

export function resetProgress(): void {
  try {
    localStorage.setItem(KEYS.progress, JSON.stringify(defaultProgress));
  } catch {
    // ignore
  }
}
