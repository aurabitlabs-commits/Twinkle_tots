import { useCallback, useEffect, useState } from 'react';
import type { AppSettings } from '@/types';
import { loadSettings, saveSettings } from '@/utils/storage';
import { setCachedSettings } from './useSpeech';

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());

  useEffect(() => {
    setCachedSettings(settings);
    saveSettings(settings);
  }, [settings]);

  const toggle = useCallback((key: keyof AppSettings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const update = useCallback((partial: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  }, []);

  const setSetting = useCallback((key: string, value: unknown) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }, []);

  return { settings, toggle, update, setSetting };
}
