export interface ItemProgress {
  topic: string;
  itemId: string;
  seen: number;
  attempts: number;
  firstTryCorrect: number;
  traced: number;
  lastPlayed: string;
}

export interface DayStats {
  date: string; // YYYY-MM-DD
  stars: number;
  seconds: number;
  games: number;
}

export interface DetailedProgressData {
  items: Record<string, ItemProgress>; // key: `${topic}_${itemId}`
  dayStats: Record<string, DayStats>; // key: YYYY-MM-DD
}

const STORAGE_KEY = 'twinkletots_detailed_progress';

export function getTodayKey(): string {
  return new Date().toISOString().split('T')[0];
}

export function loadDetailedProgress(): DetailedProgressData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { items: {}, dayStats: {} };
    const parsed = JSON.parse(raw);
    return {
      items: parsed.items || {},
      dayStats: parsed.dayStats || {},
    };
  } catch {
    return { items: {}, dayStats: {} };
  }
}

export function saveDetailedProgress(data: DetailedProgressData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export function recordItemViewed(topic: string, itemId: string): void {
  const data = loadDetailedProgress();
  const key = `${topic}_${itemId}`;
  const now = new Date().toISOString();

  const prev = data.items[key] || {
    topic,
    itemId,
    seen: 0,
    attempts: 0,
    firstTryCorrect: 0,
    traced: 0,
    lastPlayed: now,
  };

  data.items[key] = {
    ...prev,
    seen: prev.seen + 1,
    lastPlayed: now,
  };

  saveDetailedProgress(data);
}

export function recordItemAttempt(topic: string, itemId: string, firstTry: boolean): void {
  const data = loadDetailedProgress();
  const key = `${topic}_${itemId}`;
  const now = new Date().toISOString();

  const prev = data.items[key] || {
    topic,
    itemId,
    seen: 0,
    attempts: 0,
    firstTryCorrect: 0,
    traced: 0,
    lastPlayed: now,
  };

  data.items[key] = {
    ...prev,
    attempts: prev.attempts + 1,
    firstTryCorrect: firstTry ? prev.firstTryCorrect + 1 : prev.firstTryCorrect,
    lastPlayed: now,
  };

  // Record day games
  const today = getTodayKey();
  const day = data.dayStats[today] || { date: today, stars: 0, seconds: 0, games: 0 };
  data.dayStats[today] = { ...day, games: day.games + 1 };

  saveDetailedProgress(data);
}

export function recordItemTraced(topic: string, itemId: string): void {
  const data = loadDetailedProgress();
  const key = `${topic}_${itemId}`;
  const now = new Date().toISOString();

  const prev = data.items[key] || {
    topic,
    itemId,
    seen: 0,
    attempts: 0,
    firstTryCorrect: 0,
    traced: 0,
    lastPlayed: now,
  };

  data.items[key] = {
    ...prev,
    traced: prev.traced + 1,
    lastPlayed: now,
  };

  saveDetailedProgress(data);
}

export function addDaySeconds(seconds: number): void {
  const data = loadDetailedProgress();
  const today = getTodayKey();
  const day = data.dayStats[today] || { date: today, stars: 0, seconds: 0, games: 0 };
  data.dayStats[today] = { ...day, seconds: day.seconds + seconds };
  saveDetailedProgress(data);
}

export function addDayStars(starsCount: number): void {
  const data = loadDetailedProgress();
  const today = getTodayKey();
  const day = data.dayStats[today] || { date: today, stars: 0, seconds: 0, games: 0 };
  data.dayStats[today] = { ...day, stars: day.stars + starsCount };
  saveDetailedProgress(data);
}

export type ItemStatus = 'new' | 'practicing' | 'mastered';

export function getItemStatus(item?: ItemProgress): ItemStatus {
  if (!item || item.attempts === 0) return 'new';
  const accuracy = item.firstTryCorrect / item.attempts;
  if (item.firstTryCorrect >= 3 && accuracy >= 0.7) {
    return 'mastered';
  }
  return 'practicing';
}

export function getPracticingItemIds(topic: string): string[] {
  const data = loadDetailedProgress();
  return Object.values(data.items)
    .filter((i) => i.topic === topic && getItemStatus(i) === 'practicing')
    .map((i) => i.itemId);
}

export function getNeedsPracticeItems(limit = 5): ItemProgress[] {
  const data = loadDetailedProgress();
  return Object.values(data.items)
    .filter((i) => i.attempts > 0 && getItemStatus(i) === 'practicing')
    .sort((a, b) => {
      const missesA = a.attempts - a.firstTryCorrect;
      const missesB = b.attempts - b.firstTryCorrect;
      return missesB - missesA;
    })
    .slice(0, limit);
}

export function getDoingGreatItems(limit = 5): ItemProgress[] {
  const data = loadDetailedProgress();
  return Object.values(data.items)
    .filter((i) => getItemStatus(i) === 'mastered')
    .sort((a, b) => b.firstTryCorrect - a.firstTryCorrect)
    .slice(0, limit);
}

export function getDayStreak(): number {
  const data = loadDetailedProgress();
  let streak = 0;
  const d = new Date();

  for (let i = 0; i < 30; i++) {
    const key = d.toISOString().split('T')[0];
    const day = data.dayStats[key];
    if (day && (day.seconds > 30 || day.stars > 0 || day.games > 0)) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else if (i === 0) {
      // today may not have been completed yet, check yesterday
      d.setDate(d.getDate() - 1);
    } else {
      break;
    }
  }
  return Math.max(1, streak);
}

export function getPast7DaysStats(): DayStats[] {
  const data = loadDetailedProgress();
  const result: DayStats[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    const stat = data.dayStats[key] || { date: key, stars: 0, seconds: 0, games: 0 };
    result.push(stat);
  }
  return result;
}
