import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { IconBadge } from "@/components/ui/IconBadge";
import { cn } from "@/lib/cn";
import type { Step } from "@/data/steps";

interface StepCardProps {
  step: Step;
  unlocked: boolean;
  completed: boolean;
}

export function StepCard({ step, unlocked, completed }: StepCardProps) {
  const cardBody = (
    <div className="flex items-center gap-4 p-4">
      {/* Icon/Badge */}
      <IconBadge size="md" color={unlocked ? step.color : "transparent"}>
        {unlocked ? step.id : "🔒"}
      </IconBadge>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-sm sm:text-base truncate">
          {unlocked ? step.title : "Tappa bloccata"}
        </h3>
        <p className="text-xs text-base-content/50 truncate">
          {unlocked ? `📍 ${step.location}` : "Scansiona il QR Code per sbloccare"}
        </p>
      </div>

      {/* Status */}
      <div className="flex items-center gap-2 shrink-0">
        {completed ? (
          <span className="badge badge-success badge-sm font-mono tracking-wider">
            {step.word}
          </span>
        ) : (
          <span className="text-xs text-base-content/30 font-mono">{step.id}/6</span>
        )}
        {unlocked && !completed && (
          <span className="text-base-content/30 text-lg">→</span>
        )}
      </div>
    </div>
  );

  const cardClass = cn(
    "card bg-base-200 border border-base-300/40 overflow-hidden transition-all duration-200 active:scale-[0.98]",
    completed && "border-success/30",
  );

  return (
    <motion.div variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>
      {unlocked ? (
        <Link href={`/tappa/${step.id}`} className={cardClass}>
          {cardBody}
        </Link>
      ) : (
        <div className={cardClass} aria-disabled>
          {cardBody}
        </div>
      )}
    </motion.div>
  );
}