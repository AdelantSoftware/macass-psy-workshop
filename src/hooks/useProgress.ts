"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "macass-psy-workshop-progress";

export interface Progress {
  unlockedSteps: number[];
  completedSteps: number[];
  currentStep: number;
}

const DEFAULT_PROGRESS: Progress = {
  unlockedSteps: [1],
  completedSteps: [],
  currentStep: 1,
};

/**
 * localStorage-backed progress store. Using `useSyncExternalStore`
 * (instead of a `useEffect`-driven `useState`) keeps us in line with
 * React 19's recommendation: state is derived from a subscribe
 * pattern, not from a setState-in-effect.
 */

const isBrowser = () => typeof window !== "undefined";

const readSnapshot = (): Progress => {
  if (!isBrowser()) return DEFAULT_PROGRESS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<Progress>;
    return {
      unlockedSteps: Array.isArray(parsed.unlockedSteps) ? parsed.unlockedSteps : [1],
      completedSteps: Array.isArray(parsed.completedSteps) ? parsed.completedSteps : [],
      currentStep: typeof parsed.currentStep === "number" ? parsed.currentStep : 1,
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
};

const writeSnapshot = (progress: Progress) => {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    /* quota / private mode — ignore */
  }
  listeners.forEach((l) => l());
};

const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getServerSnapshot = (): Progress => DEFAULT_PROGRESS;

const getSnapshot = (): Progress => readSnapshot();

const update = (mutator: (current: Progress) => Progress) => {
  const next = mutator(readSnapshot());
  writeSnapshot(next);
};

export function useProgress() {
  const progress = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const unlockStep = useCallback(
    (stepId: number) => {
      // Step 1 is always unlocked by default.
      if (stepId === 1) return;
      const current = readSnapshot();
      if (!current.completedSteps.includes(stepId - 1)) return;
      update((p) => ({
        ...p,
        unlockedSteps: p.unlockedSteps.includes(stepId)
          ? p.unlockedSteps
          : [...p.unlockedSteps, stepId],
        currentStep: stepId,
      }));
    },
    [],
  );

  const completeStep = useCallback((stepId: number) => {
    update((p) => ({
      ...p,
      completedSteps: p.completedSteps.includes(stepId)
        ? p.completedSteps
        : [...p.completedSteps, stepId],
    }));
  }, []);

  const isUnlocked = useCallback(
    (stepId: number) => progress.unlockedSteps.includes(stepId),
    [progress.unlockedSteps],
  );

  const isCompleted = useCallback(
    (stepId: number) => progress.completedSteps.includes(stepId),
    [progress.completedSteps],
  );

  const canScan = useCallback(
    (stepId: number) => stepId === 1 || progress.completedSteps.includes(stepId - 1),
    [progress.completedSteps],
  );

  const resetProgress = useCallback(() => {
    writeSnapshot(DEFAULT_PROGRESS);
  }, []);

  return {
    progress,
    loaded: true,
    unlockStep,
    completeStep,
    isUnlocked,
    isCompleted,
    canScan,
    allCompleted: progress.completedSteps.length >= 6,
    resetProgress,
  };
}
