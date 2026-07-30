import Link from "next/link";
import { IconBadge } from "@/components/ui/IconBadge";
import type { Step } from "@/data/steps";

export function MapLegendItem({ step }: { step: Step }) {
  return (
    <Link href={`/tappa/${step.id}`} className="btn btn-ghost btn-sm justify-start gap-3 h-auto min-h-[52px] py-2 px-3 rounded-xl border border-base-300 normal-case">
      <IconBadge size="sm" color={step.color}>{step.id}</IconBadge>
      <div className="min-w-0 text-left">
        <p className="text-xs sm:text-sm font-medium truncate">{step.location}</p>
        <p className="text-[10px] sm:text-xs text-base-content/40">Tappa {step.id}</p>
      </div>
    </Link>
  );
}