import type { ComponentType } from "react";
import { EmotionWheelGame } from "./EmotionWheelGame";
import { AgendaGame } from "./AgendaGame";
import { HugGame } from "./HugGame";
import { MemoryGame } from "./MemoryGame";
import { ShipsGame } from "./ShipsGame";
import { ScaleGame } from "./ScaleGame";

/**
 * Maps the numeric step id → the corresponding mini-game component.
 * Centralised so the TappaClient page just renders `INTERACTIONS[stepId]`
 * and does not need to know about the individual games.
 */
export const INTERACTIONS: Record<number, ComponentType<{ onReveal: () => void }>> = {
  1: EmotionWheelGame,
  2: AgendaGame,
  3: HugGame,
  4: MemoryGame,
  5: ShipsGame,
  6: ScaleGame,
};
