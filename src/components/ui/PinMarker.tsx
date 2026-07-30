import Link from "next/link";
import { motion } from "framer-motion";
import { IconBadge } from "@/components/ui/IconBadge";
import type { Step } from "@/data/steps";

interface PinMarkerProps {
  step: Step;
  position?: { top: string; left: string };
  delay?: number;
}

export function PinMarker({ step, position, delay = 0 }: PinMarkerProps) {
  return (
    <Link href={`/tappa/${step.id}`} className="absolute group focus:outline-none cursor-pointer" style={{ top: position?.top, left: position?.left }}>
      <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay }}>
        <IconBadge size="md" color={step.color} className="shadow-lg animate-float">
          {step.id}
        </IconBadge>
      </motion.div>
      <div className="tooltip tooltip-bottom" data-tip={step.title}>
        <div className="sr-only">📍 {step.location}</div>
      </div>
    </Link>
  );
}