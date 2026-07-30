"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

interface ProgressBarProps {
  value: number;
  label?: string;
  rightLabel?: string;
  className?: string;
}

export function ProgressBar({ value, label, rightLabel, className }: ProgressBarProps) {
  const pct = Math.round(Math.max(0, Math.min(1, value)) * 100);
  return (
    <div className={cn("w-full", className)}>
      {(label || rightLabel) && (
        <div className="flex justify-between text-xs text-base-content/60 mb-1">
          {label && <span>{label}</span>}
          {rightLabel && <span>{rightLabel}</span>}
        </div>
      )}
      <progress className="progress progress-primary w-full" value={pct} max={100} />
    </div>
  );
}

export function ProgressDots({ total, filled, color, className }: {
  total: number;
  filled: number;
  color?: string;
  className?: string;
}) {
  return (
    <div className={cn("steps", className)}>
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className={cn("step step-sm", i < filled && "step-primary")}
          data-content={i < filled ? "✓" : i + 1} />
      ))}
    </div>
  );
}