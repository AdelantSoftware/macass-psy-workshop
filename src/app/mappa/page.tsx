/* refactored: tokens */
"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { STEPS } from "@/data/steps";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionTitle } from "@/components/ui/Typography";
import { PinMarker } from "@/components/ui/PinMarker";
import { MapLegendItem } from "@/components/ui/MapLegendItem";

/**
 * Hard-coded layout for the 6 pins: spreads them across the festival
 * image without needing a real geocoded map. Kept as plain data so
 * they live in ONE place (no scattered inline-percent values).
 */
const PIN_POSITIONS: ReadonlyArray<{ top: string; left: string }> = [
  { top: "12%", left: "18%" },
  { top: "28%", left: "72%" },
  { top: "48%", left: "22%" },
  { top: "44%", left: "82%" },
  { top: "68%", left: "48%" },
  { top: "78%", left: "28%" },
];

export default function MappaPage() {
  return (
    <main className="min-h-dvh bg-[var(--color-bg)] pb-20 sm:pb-24 safe-inset">
      <PageHeader
        title={
          <>
            <span aria-hidden="true">📍 </span>Mappa del Festival
          </>
        }
        subtitle="Le 6 posizioni dei QR Code da trovare"
        backHref="/home"
        backLabel="Home"
      />

      <div className="layout-padding mt-10 sm:mt-16">
        <div className="relative rounded-2xl overflow-hidden h-[45vh] sm:h-[50vh] md:h-[60vh]">
          <Image
            src="/images/map-bg.jpg"
            alt="Mappa del festival"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 60vw"
          />
          <div className="absolute inset-0 bg-[var(--color-bg)]/30" />
          {STEPS.map((step, i) => (
            <PinMarker
              key={step.id}
              step={step}
              position={PIN_POSITIONS[i]}
              delay={i * 0.3}
            />
          ))}
        </div>

        <SectionTitle size="sm" className="mt-6 sm:mt-8 mb-3">
          Legenda
        </SectionTitle>
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {STEPS.map((step) => (
            <MapLegendItem key={step.id} step={step} />
          ))}
        </motion.div>
      </div>
    </main>
  );
}
