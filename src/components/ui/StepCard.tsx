import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { IconBadge } from "@/components/ui/IconBadge";
import { cn } from "@/lib/cn";
import type { Step } from "@/data/steps";

interface StepCardProps {
  step: Step;
  /** Whether the step has been unlocked (by QR scan) */
  unlocked: boolean;
  /** Whether the step has been completed */
  completed: boolean;
}

/**
 * Tappa summary card — used in the home grid and in the map legend.
 * Single source of truth so visuals stay aligned.
 */
export function StepCard({ step, unlocked, completed }: StepCardProps) {
  const cardBody = (
    <>
      <div className="relative h-40 sm:h-48">
        <Image
          src={step.image}
          alt={step.title}
          fill
          className={cn("object-cover", !unlocked && "blur-sm")}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1230] to-transparent" />
        <IconBadge
          size="sm"
          color={unlocked ? step.color : "#1a1230"}
          className="absolute top-3 left-3"
        >
          {unlocked ? step.id : "🔒"}
        </IconBadge>
        {completed && (
          <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[var(--color-accent-mint)] flex items-center justify-center text-xs">
            ✓
          </div>
        )}
      </div>
      <div className="p-4 sm:p-5 flex flex-col gap-1">
        <h3 className="font-display font-bold text-lg sm:text-xl">
          {unlocked ? step.title : "Tappa bloccata"}
        </h3>
        <p className="text-[#a09ab5] text-xs sm:text-sm">📍 {step.location}</p>
        <p className="text-xs sm:text-sm text-[#a09ab5] leading-relaxed">
          {unlocked ? step.description : "Scansiona il QR Code per sbloccare"}
        </p>
        <div className="flex items-center justify-between mt-2">
          <span
            className="text-[10px] sm:text-xs font-mono tracking-wider px-2 sm:px-3 py-1 rounded-full"
            style={{
              backgroundColor: unlocked ? `${step.color}20` : "rgba(255,255,255,0.05)",
              color: unlocked && completed ? step.color : "#8b85a0",
            }}
          >
            {completed ? step.word : "???"}
          </span>
          <span className="text-[10px] sm:text-xs text-[#a09ab5]">
            {step.id}/6
          </span>
        </div>
      </div>
    </>
  );

  const cardClass = cn(
    "step-card block rounded-2xl overflow-hidden border shadow-lg shadow-black/10",
    unlocked
      ? "bg-[#1a1230] border-white/5"
      : "bg-[#1a1230]/50 border-white/5 opacity-60",
    completed && "ring-2 ring-[var(--color-accent-mint)]/30",
  );

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 24 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 24 } },
      }}
    >
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
