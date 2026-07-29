/* refactored: tokens */
"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  /** 0..1 — clamped internally */
  value: number;
  label?: string;
  rightLabel?: string;
  height?: number;
  className?: string;
}

/**
 * Horizontal progress bar with gradient fill. Used on the home page
 * header to show how many tappe the user has completed.
 */
export function ProgressBar({
  value,
  label,
  rightLabel,
  height = 10,
  className,
}: ProgressBarProps) {
  const pct = Math.max(0, Math.min(1, value)) * 100;
  return (
    <div className={className}>
      {(label || rightLabel) && (
        <div className="flex justify-between text-xs text-[var(--color-muted)] mb-2">
          {label && <span>{label}</span>}
          {rightLabel && <span>{rightLabel}</span>}
        </div>
      )}
      <div
        className="bg-white/10 rounded-full overflow-hidden"
        style={{ height: `${height}px` }}
      >
        <motion.div
          className="h-full bg-[var(--gradient-progress)] rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

interface ProgressDotsProps {
  total: number;
  filled: number;
  /** Color of the active dots */
  color?: string;
  className?: string;
}

/**
 * Pill-styled progress dots: filled dots expand & use the accent color,
 * empty dots stay short and translucent.
 */
export function ProgressDots({
  total,
  filled,
  color = "var(--color-accent-mint)",
  className,
}: ProgressDotsProps) {
  return (
    <div className={`flex items-center justify-center gap-1.5 ${className ?? ""}`}>
      {Array.from({ length: total }, (_, i) => (
        <motion.span
          key={i}
          className="h-1.5 rounded-full"
          animate={{
            width: i < filled ? 18 : 6,
            backgroundColor: i < filled ? color : "var(--color-on-dark-6)",
          }}
          transition={{ type: "spring", stiffness: 220, damping: 18 }}
        />
      ))}
    </div>
  );
}
