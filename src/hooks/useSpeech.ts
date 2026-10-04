import { useCallback, useEffect, useRef } from 'react';
import type { AppSettings } from '@/types';

let cachedSettings: AppSettings | null = null;
let activeUtterance: SpeechSynthesisUtterance | null = null; // Prevent Chrome GC bug

export function setCachedSettings(s: AppSettings) {
  cachedSettings = s;
}

export function getCachedSettings(): AppSettings {
  if (!cachedSettings) {
    return { soundEffects: true, voice: true };
  }
  return cachedSettings;
}

export function useSpeech() {
  const speakTokenRef = useRef(0);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = useCallback((text: string, opts?: { rate?: number; pitch?: number; lang?: string }) => {
    const settings = getCachedSettings();
    if (!settings.voice) return;
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const synth = window.speechSynthesis;
    const token = ++speakTokenRef.current;

    // Small delay to ensure any previous cancel settles
    setTimeout(() => {
      if (token !== speakTokenRef.current) return;

      try {
        synth.cancel();
        if (synth.paused) {
          synth.resume();
        }

        // Detect language if text contains Devanagari characters
        const hasDevanagari = /[\u0900-\u097F]/.test(text);
        const targetLang = opts?.lang || (hasDevanagari ? 'hi-IN' : 'en-US');

        // Clean up tricky Hindi characters for speech engines so they pronounce clearly
        let spokenText = text;
        if (hasDevanagari || targetLang.startsWith('hi')) {
          spokenText = spokenText
            .replace(/अः/g, 'अहः')
            .replace(/\bङ\b/g, 'अंगा')
            .replace(/\bञ\b/g, 'इयाँ')
            .replace(/\bण\b/g, 'अण');
        }

        const utterance = new SpeechSynthesisUtterance(spokenText);
        activeUtterance = utterance; // Prevent GC while speaking

        utterance.rate = opts?.rate ?? (hasDevanagari ? 0.82 : 0.88);
        utterance.pitch = opts?.pitch ?? 1.05;
        utterance.volume = 1;
        utterance.lang = targetLang;

        const voices = synth.getVoices();
        if (voices && voices.length > 0) {
          if (hasDevanagari || targetLang.startsWith('hi')) {
            const hindiVoice = voices.find(
              (v) =>
                v.lang === 'hi-IN' ||
                v.lang.startsWith('hi') ||
                v.name.toLowerCase().includes('hindi')
            );
            if (hindiVoice) utterance.voice = hindiVoice;
          } else {
            const preferred = voices.find(
              (v) =>
                (v.name.includes('Google US English') ||
                  v.name.includes('Samantha') ||
                  v.name.includes('Natural') ||
                  v.name.includes('Female')) &&
                v.lang.startsWith('en')
            );
            if (preferred) utterance.voice = preferred;
          }
        }

        utterance.onend = () => {
          activeUtterance = null;
        };

        utterance.onerror = () => {
          activeUtterance = null;
        };

        if (synth.paused) {
          synth.resume();
        }

        synth.speak(utterance);
      } catch (err) {
        console.warn('Speech synthesis error:', err);
      }
    }, 40);
  }, []);

  const speakBilingual = useCallback((enText: string, hiText: string) => {
    speak(enText);
    setTimeout(() => {
      speak(hiText, { lang: 'hi-IN' });
    }, 1200);
  }, [speak]);

  const stop = useCallback(() => {
    speakTokenRef.current++;
    activeUtterance = null;
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, []);

  return { speak, speakBilingual, stop };
}

export function playTone(type: 'correct' | 'wrong' | 'win' | 'tap' | 'pop' | 'snap' | 'chime') {
  const settings = getCachedSettings();
  if (!settings.soundEffects) return;
  if (typeof window === 'undefined' || !window.AudioContext) return;

  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const now = ctx.currentTime;

    const playNote = (freq: number, start: number, duration: number, oscType: OscillatorType = 'sine', maxGain: number = 0.15) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = oscType;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, now + start);
      gain.gain.linearRampToValueAtTime(maxGain, now + start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + start + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + start);
      osc.stop(now + start + duration);
    };

    if (type === 'correct') {
      playNote(523, 0, 0.15);
      playNote(659, 0.12, 0.15);
      playNote(784, 0.24, 0.25);
    } else if (type === 'wrong') {
      playNote(300, 0, 0.18, 'triangle', 0.12);
      playNote(250, 0.14, 0.22, 'triangle', 0.12);
    } else if (type === 'win') {
      playNote(523, 0, 0.14);
      playNote(659, 0.12, 0.14);
      playNote(784, 0.24, 0.14);
      playNote(1047, 0.36, 0.4);
    } else if (type === 'tap') {
      playNote(600, 0, 0.07, 'sine', 0.1);
    } else if (type === 'pop') {
      playNote(800, 0, 0.06, 'sine', 0.12);
    } else if (type === 'snap') {
      playNote(900, 0, 0.05, 'triangle', 0.15);
      playNote(1200, 0.04, 0.08, 'sine', 0.12);
    } else if (type === 'chime') {
      playNote(659, 0, 0.15, 'sine', 0.15);
      playNote(880, 0.1, 0.25, 'sine', 0.15);
    }

    setTimeout(() => ctx.close(), 1600);
  } catch {
    // audio context failure should never crash
  }
}
