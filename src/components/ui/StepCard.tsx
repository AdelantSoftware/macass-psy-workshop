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
    <>
      <figure className="relative h-40 sm:h-48">
        <Image src={step.image} alt={step.title} fill className={cn("object-cover", !unlocked && "blur-sm")} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-base-200 to-transparent" />
        <IconBadge size="sm" color={unlocked ? step.color : "transparent"} className="absolute top-3 left-3">
          {unlocked ? step.id : "🔒"}
        </IconBadge>
        {completed && <div className="absolute top-3 right-3 badge badge-success badge-sm">✓</div>}
      </figure>
      <div className="card-body p-4 sm:p-5 gap-1">
        <h3 className="card-title text-lg">{unlocked ? step.title : "Tappa bloccata"}</h3>
        <p className="text-xs text-base-content/60">📍 {step.location}</p>
        <p className="text-xs text-base-content/60 leading-relaxed">{unlocked ? step.description : "Scansiona il QR Code per sbloccare"}</p>
        <div className="card-actions justify-between items-center mt-2">
          <span className={cn("badge badge-sm font-mono tracking-wider", completed && "badge-success")} style={completed ? {} : { backgroundColor: unlocked ? `${step.color}20` : "transparent", color: "var(--color-muted-strong)" }}>
            {completed ? step.word : "???"}
          </span>
          <span className="text-xs text-base-content/40">{step.id}/6</span>
        </div>
      </div>
    </>
  );

  const cardClass = cn("card bg-base-200 border border-base-300 overflow-hidden transition-all duration-200", completed && "ring-2 ring-success/30");

  return (
    <motion.div variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}>
      {unlocked ? (
        <Link href={`/tappa/${step.id}`} className={cardClass}>{cardBody}</Link>
      ) : (
        <div className={cardClass} aria-disabled>{cardBody}</div>
      )}
    </motion.div>
  );
}