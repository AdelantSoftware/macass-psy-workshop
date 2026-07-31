"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { STEPS } from "@/data/steps";
import { useProgress } from "@/hooks/useProgress";
import { SectionTitle } from "@/components/ui/Typography";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StepCard } from "@/components/ui/StepCard";
import { Button } from "@/components/ui/Button";

const containerAnim = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export default function HomePage() {
  const { isUnlocked, isCompleted, allCompleted, progress, resetProgress } = useProgress();
  const completedCount = progress.completedSteps.length;

  return (
    <div className="min-h-dvh bg-base-100 flex flex-col">
      {/* Hero header — compatto come app mobile */}
      <div className="relative pt-16 pb-6 sm:pt-20 sm:pb-8">
        <div className="absolute inset-0 z-0">
          <Image src="/images/hero-bg.jpg" alt="" fill className="object-cover opacity-8" />
          <div className="absolute inset-0 bg-gradient-to-b from-base-100/80 to-base-100" />
        </div>
        <div className="relative z-10 flex flex-col items-center text-center layout-padding gap-3">
          <motion.h1
            className="font-display text-2xl sm:text-4xl md:text-5xl font-bold"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            Il Percorso delle{" "}<br />
            <span className="gradient-text">Sei Parole</span>
          </motion.h1>
          <motion.p
            className="text-sm text-base-content/60 max-w-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            Esplora il festival, scopri le parole
          </motion.p>
          <motion.div
            className="w-full max-w-[240px] mt-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.25 }}
          >
            <ProgressBar
              value={completedCount / 6}
              label=""
              rightLabel={`${completedCount}/6`}
            />
          </motion.div>
        </div>
      </div>

      {/* Contenuto scrollabile */}
      <div className="flex-1 flex flex-col items-center gap-12 layout-padding pb-32">
        {/* Map preview card */}
        <section className="w-full max-w-lg">
          <SectionTitle size="sm" className="mb-3">
            Esplora la Mappa
          </SectionTitle>
          <Link href="/mappa" className="block group">
            <div className="card bg-base-200 border border-base-300/40 overflow-hidden image-full transition-all duration-300 active:scale-[0.98]">
              <figure className="relative h-36 sm:h-44">
                <Image
                  src="/img/mappa.png"
                  alt="Mappa del festival"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 60vw"
                />
              </figure>
              <div className="card-body items-center text-center gap-1">
                <h3 className="card-title text-lg font-display">Mappa del Festival</h3>
                <p className="text-xs text-base-content/50">Trova le 6 posizioni dei QR Code</p>
                <span className="badge badge-outline badge-accent badge-sm mt-2 tracking-wide">
                  Vedi la mappa →
                </span>
              </div>
            </div>
          </Link>
        </section>

        {/* Il Libro card */}
        <section className="w-full max-w-lg">
          <SectionTitle size="sm" className="mb-3">
            Il Libro
          </SectionTitle>
          <Link href="/libro" className="block group">
            <div className="card bg-base-200 border border-base-300/40 overflow-hidden transition-all duration-300 group-active:scale-[0.98]">
              <figure className="relative h-40 sm:h-48">
                <Image
                  src="/img/copertina-del-libro.jpg"
                  alt="Copertina del libro"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 60vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-base-200/40 to-transparent" />
              </figure>
              <div className="card-body items-center text-center gap-1">
                <span className="badge badge-outline badge-accent badge-sm mt-1 tracking-wide">
                  Scopri il libro →
                </span>
              </div>
            </div>
          </Link>
        </section>

        {/* Step grid */}
        <section className="w-full max-w-lg">
          <div className="flex items-center justify-between mb-4">
            <SectionTitle size="sm">Le Sei Tappe</SectionTitle>
            {allCompleted && (
              <Link href="/finale" className="btn btn-primary btn-sm rounded-full">
                Finale →
              </Link>
            )}
          </div>
          <motion.div
            className="flex flex-col gap-3"
            variants={containerAnim}
            initial="hidden"
            animate="show"
          >
            {STEPS.map((step) => (
              <StepCard
                key={step.id}
                step={step}
                unlocked={isUnlocked(step.id)}
                completed={isCompleted(step.id)}
              />
            ))}
          </motion.div>
        </section>

        {/* Reset */}
        {completedCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (confirm("Vuoi davvero ripristinare i progressi?"))
                resetProgress();
            }}
            className="text-base-content/30 hover:text-base-content/50"
          >
            ↻ Ripristina progressi
          </Button>
        )}
      </div>
    </div>
  );
}