"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "macass-psy-workshop-progress";

export interface Progress {
  unlockedSteps: number[];
  completedSteps: number[];
  currentStep: number;
}

const DEFAULT_PROGRESS: Progress = {
  unlockedSteps: [1], // First step is always unlocked
  completedSteps: [],
  currentStep: 1,
};

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(DEFAULT_PROGRESS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setProgress(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
    setLoaded(true);
  }, []);

  const save = useCallback((p: Progress) => {
    setProgress(p);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
    } catch {
      // ignore
    }
  }, []);

  const unlockStep = useCallback(
    (stepId: number) => {
      const updated = {
        ...progress,
        unlockedSteps: progress.unlockedSteps.includes(stepId)
          ? progress.unlockedSteps
          : [...progress.unlockedSteps, stepId],
        currentStep: stepId,
      };
      save(updated);
    },
    [progress, save]
  );

  const completeStep = useCallback(
    (stepId: number) => {
      const updated = {
        ...progress,
        completedSteps: progress.completedSteps.includes(stepId)
          ? progress.completedSteps
          : [...progress.completedSteps, stepId],
      };
      save(updated);
    },
    [progress, save]
  );

  const isUnlocked = useCallback(
    (stepId: number) => progress.unlockedSteps.includes(stepId),
    [progress.unlockedSteps]
  );

  const isCompleted = useCallback(
    (stepId: number) => progress.completedSteps.includes(stepId),
    [progress.completedSteps]
  );

  const allCompleted = progress.completedSteps.length >= 6;

  const resetProgress = useCallback(() => {
    save(DEFAULT_PROGRESS);
  }, [save]);

  return {
    progress,
    loaded,
    unlockStep,
    completeStep,
    isUnlocked,
    isCompleted,
    allCompleted,
    resetProgress,
  };
}
