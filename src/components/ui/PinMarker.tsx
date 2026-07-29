/* refactored: tokens */
import Link from "next/link";
import { motion } from "framer-motion";
import { IconBadge } from "@/components/ui/IconBadge";
import type { Step } from "@/data/steps";

interface PinMarkerProps {
  step: Step;
  /** Optional explicit (top,left) percentages; default cycles through a balanced layout */
  position?: { top: string; left: string };
  /** Animation delay (so multiple pins don't all bounce in sync) */
  delay?: number;
}

/**
 * Positioned pin used on the festival map. Always links to /tappa/<id>.
 * Tooltip surfaces title + location on hover/focus (mobile-friendly via focus-within).
 */
export function PinMarker({ step, position, delay = 0 }: PinMarkerProps) {
  return (
    <Link
      href={`/tappa/${step.id}`}
      className="absolute group focus:outline-none"
      style={{ top: position?.top, left: position?.left }}
    >
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay }}
      >
        <IconBadge
          size="md"
          color={step.color}
          className="shadow-lg animate-float cursor-pointer"
        >
          {step.id}
        </IconBadge>
      </motion.div>
      <span
        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-[var(--color-surface)] rounded-lg shadow-xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20"
      >
        <p className="font-semibold text-xs sm:text-sm">{step.title}</p>
        <p className="text-[10px] sm:text-xs text-[var(--color-muted-strong)]">📍 {step.location}</p>
      </span>
    </Link>
  );
}
