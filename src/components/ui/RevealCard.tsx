/* refactored: tokens */
"use client";

import { motion } from "framer-motion";

interface RevealCardProps {
  /** Eyebrow label above the word ("Hai scoperto la parola:") */
  eyebrow?: string;
  /** Large reveal word */
  word: string;
  /** Step number to display (when omitted, defaults to no caption) */
  stepId?: number;
  /** Color for the word */
  color?: string;
  /** Caption shown below divider (overrides default "Tappa X di 6 completata ✓") */
  caption?: string;
  /** Primary action label */
  actionLabel: string;
  onAction: () => void;
}

/**
 * Centerpiece card used both when a tappa reveals its word AND on the
 * finale page. Gradient + soft glow + primary action button.
 *
 * Mobile-first: padding scales down for screens < 640px.
 */
export function RevealCard({
  eyebrow,
  word,
  stepId,
  color = "var(--color-accent)",
  caption,
  actionLabel,
  onAction,
}: RevealCardProps) {
  const resolvedCaption =
    caption !== undefined
      ? caption
      : stepId !== undefined
        ? `Tappa ${stepId} di 6 completata ✓`
        : undefined;

  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <motion.div
        className="rounded-2xl bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface-hover)] border border-white/10 p-6 sm:p-10"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
      >
        {eyebrow && (
          <p className="text-xs sm:text-sm text-[var(--color-muted-strong)] mb-3 sm:mb-4">
            {eyebrow}
          </p>
        )}
        <motion.h2
          className="font-display text-5xl sm:text-6xl md:text-7xl font-bold tracking-wider mb-3 sm:mb-4"
          style={{ color }}
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.3 }}
        >
          {word}
        </motion.h2>
        <motion.div
          className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-4 sm:my-6"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        />
        {resolvedCaption !== undefined && (
          <p className="text-xs sm:text-sm text-[var(--color-muted-strong)]">{resolvedCaption}</p>
        )}
      </motion.div>
      <motion.button
        onClick={onAction}
        className="mt-6 sm:mt-8 px-6 py-3 sm:px-8 sm:py-3 bg-[var(--gradient-cta)] text-white rounded-full font-semibold min-h-[48px] text-sm sm:text-base"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {actionLabel}
      </motion.button>
    </motion.div>
  );
}
