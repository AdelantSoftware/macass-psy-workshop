"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

interface RevealCardProps {
  eyebrow?: string;
  word: string;
  stepId?: number;
  color?: string;
  caption?: string;
  actionLabel: string;
  onAction: () => void;
}

export function RevealCard({ eyebrow, word, stepId, color, caption, actionLabel, onAction }: RevealCardProps) {
  const resolvedCaption = caption ?? (stepId ? `Tappa ${stepId} di 6 completata ✓` : undefined);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="text-center"
    >
      <div className="card bg-base-200 border border-base-300">
        <div className="card-body items-center gap-4">
          {eyebrow && <p className="text-sm text-base-content/60">{eyebrow}</p>}
          <motion.h2
            className="font-display text-5xl sm:text-6xl md:text-7xl font-bold tracking-wider"
            style={{ color }}
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.3 }}
          >
            {word}
          </motion.h2>
          <div className="divider my-2" />
          {resolvedCaption && <p className="text-sm text-base-content/60">{resolvedCaption}</p>}
        </div>
      </div>
      <Button onClick={onAction} size="lg" className="mt-6">
        {actionLabel}
      </Button>
    </motion.div>
  );
}