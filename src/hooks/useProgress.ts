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
 * localStorage-backed progress store, using `useSyncExternalStore`.
 *
 * Important: `getSnapshot` MUST return a stable reference as long as
 * the underlying value has not changed. Otherwise React 19 detects an
 * infinite update loop (Minified error #185). We achieve this by
 * holding a single module-level cache that we only invalidate on write.
 */

const isBrowser = () => typeof window !== "undefined";

let cachedSnapshot: Progress | null = null;

const invalidateCache = () => {
  cachedSnapshot = null;
};

const isSameProgress = (a: Progress, b: Progress) =>
  a.currentStep === b.currentStep &&
  a.unlockedSteps.length === b.unlockedSteps.length &&
  a.completedSteps.length === b.completedSteps.length &&
  a.unlockedSteps.every((v, i) => v === b.unlockedSteps[i]) &&
  a.completedSteps.every((v, i) => v === b.completedSteps[i]);

const readSnapshot = (): Progress => {
  if (cachedSnapshot) return cachedSnapshot;
  if (!isBrowser()) {
    cachedSnapshot = DEFAULT_PROGRESS;
    return cachedSnapshot;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      cachedSnapshot = DEFAULT_PROGRESS;
      return cachedSnapshot;
    }
    const parsed = JSON.parse(raw) as Partial<Progress>;
    const next: Progress = {
      unlockedSteps: Array.isArray(parsed.unlockedSteps) ? parsed.unlockedSteps : [1],
      completedSteps: Array.isArray(parsed.completedSteps) ? parsed.completedSteps : [],
      currentStep: typeof parsed.currentStep === "number" ? parsed.currentStep : 1,
    };
    // If the parsed value matches the previous cache, keep the previous
    // reference so consumers don't see a new identity.
    if (cachedSnapshot && isSameProgress(cachedSnapshot, next)) {
      return cachedSnapshot;
    }
    cachedSnapshot = next;
    return cachedSnapshot;
  } catch {
    cachedSnapshot = DEFAULT_PROGRESS;
    return cachedSnapshot;
  }
};

const writeSnapshot = (progress: Progress) => {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    /* quota / private mode — ignore */
  }
  cachedSnapshot = progress;
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
    invalidateCache();
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
