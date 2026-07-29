import Link from "next/link";
import { IconBadge } from "@/components/ui/IconBadge";
import type { Step } from "@/data/steps";

interface MapLegendItemProps {
  step: Step;
}

/**
 * Compact list entry beneath the map: numbered color circle + location.
 * Links to the tappa, so it doubles as an a11y alternative for the
 * pin overlay (which is hard to interact with on touch devices).
 */
export function MapLegendItem({ step }: MapLegendItemProps) {
  return (
    <Link
      href={`/tappa/${step.id}`}
      className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl bg-[#1a1230] border border-white/5 hover:border-white/10 active:border-white/15 transition-colors min-h-[52px]"
    >
      <IconBadge size="sm" color={step.color}>
        {step.id}
      </IconBadge>
      <div className="min-w-0">
        <p className="font-medium text-xs sm:text-sm truncate">{step.location}</p>
        <p className="text-[10px] sm:text-xs text-[#8b85a0]">Tappa {step.id}</p>
      </div>
    </Link>
  );
}
