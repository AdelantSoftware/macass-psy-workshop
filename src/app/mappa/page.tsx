"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { STEPS } from "@/data/steps";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionTitle } from "@/components/ui/Typography";
import { PinMarker } from "@/components/ui/PinMarker";
import { MapLegendItem } from "@/components/ui/MapLegendItem";

const PIN_POSITIONS: ReadonlyArray<{ top: string; left: string }> = [
  // 1-2-3 in basso a destra
  { top: "78%", left: "72%" },
  { top: "88%", left: "62%" },
  { top: "88%", left: "82%" },
  // 4 al centro, leggermente in alto
  { top: "16%", left: "50%" },
  // 5-6 in mezzo tra 1-2-3 e 4
  { top: "50%", left: "44%" },
  { top: "50%", left: "58%" },
];

export default function MappaPage() {
  return (
    <div className="min-h-dvh bg-base-100 pb-20">
      <PageHeader
        title="📍 Mappa del Festival"
        subtitle="Le 6 posizioni dei QR Code da trovare"
        backHref="/home"
      />

      <div className="layout-padding my-10">
        <div className="card bg-base-200 border border-base-300/60 overflow-hidden shadow-lg shadow-black/20">
          <figure className="relative h-[45vh] sm:h-[50vh] md:h-[60vh]">
            <Image
              src="/img/mappa.png"
              alt="Mappa del festival"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 60vw"
            />
            <div className="absolute inset-0 bg-base-100/30" />
            {STEPS.map((step, i) => (
              <PinMarker
                key={step.id}
                step={step}
                position={PIN_POSITIONS[i]}
                delay={i * 0.3}
              />
            ))}
          </figure>
        </div>

        <SectionTitle size="sm" className="mt-6 mb-3">
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
    </div>
  );
}