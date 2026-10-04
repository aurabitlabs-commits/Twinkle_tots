import { useCallback, useEffect, useState } from 'react';
import type { AppProgress } from '@/types';
import { defaultProgress, loadProgress, saveProgress } from '@/utils/storage';

export function useStars() {
  const [progress, setProgress] = useState<AppProgress>(() => loadProgress());

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const addStars = useCallback((count: number, topicId?: string) => {
    setProgress((prev) => {
      const topicStars = topicId ? (prev.starsByTopic[topicId] || 0) + count : 0;
      return {
        ...prev,
        totalStars: prev.totalStars + count,
        starsByTopic: topicId
          ? { ...prev.starsByTopic, [topicId]: topicStars }
          : prev.starsByTopic,
      };
    });
  }, []);

  const recordRoundScore = useCallback((topic: string, score: number) => {
    setProgress((prev) => {
      const currentBest = prev.bestScores[topic] || (topic === 'abc' ? prev.bestAbcRound : topic === 'num' ? prev.bestNumRound : 0);
      if (score <= currentBest) return prev;
      return {
        ...prev,
        bestScores: { ...prev.bestScores, [topic]: score },
        bestAbcRound: topic === 'abc' ? score : prev.bestAbcRound,
        bestNumRound: topic === 'num' ? score : prev.bestNumRound,
      };
    });
  }, []);

  const markCardSeen = useCallback((cardId: string) => {
    setProgress((prev) => {
      if (prev.seenCards.includes(cardId)) return prev;
      return { ...prev, seenCards: [...prev.seenCards, cardId] };
    });
  }, []);

  const markLetterTraced = useCallback((letterId: string) => {
    setProgress((prev) => {
      if (prev.tracedLetters.includes(letterId)) return prev;
      return { ...prev, tracedLetters: [...prev.tracedLetters, letterId] };
    });
  }, []);

  const resetAll = useCallback(() => {
    setProgress({ ...defaultProgress });
  }, []);

  return {
    progress,
    addStars,
    recordRoundScore,
    markCardSeen,
    markLetterTraced,
    resetAll,
  };
}
