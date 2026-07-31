/* refactored: tokens */
/**
 * Shared utilities for the interactive mini-games.
 */

import { type ReactNode } from "react";

export interface GamePhase {
  phase: "intro" | "active" | "complete" | "preview";
  [key: string]: unknown;
}

/**
 * The common contract every mini-game honours: render an interactive
 * experience and call `onReveal` when the user has completed it.
 */
export interface GameProps {
  onReveal: () => void;
}

/**
 * Background + sizing wrapper used by every game to keep the visual
 * frame consistent across all 6 tappe.
 */
export function GameShell({
  accent,
  children,
}: {
  accent: string;
  children: ReactNode;
}) {
  return (
    <div
      className="relative min-h-[430px] overflow-hidden rounded-3xl p-3 sm:p-7 text-center"
      style={{
        background: `radial-gradient(circle at 50% 35%, ${accent}26, transparent 54%), linear-gradient(180deg, var(--color-on-dark-2), transparent)`,
      }}    >
      {children}
    </div>
  );
}
