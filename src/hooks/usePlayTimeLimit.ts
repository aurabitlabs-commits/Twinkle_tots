import { useEffect, useState, useCallback, useRef } from 'react';
import { addDaySeconds, getTodayKey, loadDetailedProgress } from '@/utils/progressTracker';
import { loadSettings } from '@/utils/storage';

export function usePlayTimeLimit() {
  const [isRestTime, setIsRestTime] = useState(false);
  const [extraMinutesGranted, setExtraMinutesGranted] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const checkTime = useCallback(() => {
    const settings = loadSettings();
    const limitMinutes = (settings as unknown as { playTimeLimit?: number }).playTimeLimit ?? 0;
    if (limitMinutes <= 0) {
      setIsRestTime(false);
      return;
    }

    const today = getTodayKey();
    const progress = loadDetailedProgress();
    const day = progress.dayStats[today];
    const totalMinutes = (day ? day.seconds / 60 : 0);

    const allowedTotal = limitMinutes + extraMinutesGranted;

    if (totalMinutes >= allowedTotal) {
      setIsRestTime(true);
    } else {
      setIsRestTime(false);
    }
  }, [extraMinutesGranted]);

  useEffect(() => {
    checkTime();
    intervalRef.current = setInterval(() => {
      // If window is visible/foreground, increment by 5s
      if (typeof document !== 'undefined' && !document.hidden) {
        addDaySeconds(5);
        checkTime();
      }
    }, 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [checkTime]);

  const grantMoreTime = useCallback(() => {
    setExtraMinutesGranted((m) => m + 10);
    setIsRestTime(false);
  }, []);

  return {
    isRestTime,
    grantMoreTime,
  };
}
