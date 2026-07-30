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

const gridContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
} as const;

export default function HomePage() {
  const { isUnlocked, isCompleted, allCompleted, progress, resetProgress } = useProgress();
  const completedCount = progress.completedSteps.length;

  return (
    <div className="min-h-dvh bg-base-100 pb-24">
      {/* Hero header — più sobrio, più caldo */}
      <div className="relative py-20 sm:py-24 md:py-28">
        <div className="absolute inset-0 z-0">
          <Image src="/images/hero-bg.jpg" alt="" fill className="object-cover opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-base-100/80 to-base-100" />
        </div>
        <div className="relative z-10 flex flex-col items-center text-center px-4 sm:px-8 gap-5">
          <motion.h1
            className="font-display text-3xl sm:text-5xl md:text-6xl font-bold text-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Il Percorso delle{" "}
            <span className="gradient-text">Sei Parole</span>
          </motion.h1>
          <motion.p
            className="text-base-content/50 text-sm sm:text-base md:text-lg max-w-lg font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Esplora il festival, trova i QR Code, scopri le parole
          </motion.p>
          <motion.div
            className="w-full max-w-xs mt-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <ProgressBar
              value={completedCount / 6}
              label="Progresso"
              rightLabel={`${completedCount}/6 tappe`}
            />
          </motion.div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-16 sm:gap-20 px-4 sm:px-8">
        {/* Map preview — più raccolta */}
        <section className="w-full max-w-4xl">
          <SectionTitle size="md" center className="mb-5 sm:mb-6">
            Esplora la Mappa
          </SectionTitle>
          <Link href="/mappa" className="block group">
            <div className="card bg-base-200 border border-base-300/60 overflow-hidden image-full shadow-lg shadow-black/20 transition-all duration-300 hover:border-base-300">
              <figure>
                <Image
                  src="/images/map-bg.jpg"
                  alt="Mappa del festival"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 60vw"
                />
              </figure>
              <div className="card-body items-center text-center justify-end p-6 sm:p-8">
                <h3 className="card-title text-xl sm:text-2xl font-display text-shadow">
                  Mappa del Festival
                </h3>
                <p className="text-sm text-base-content/60 text-shadow-soft">
                  Trova le 6 posizioni dei QR Code nascosti
                </p>
                <div className="card-actions mt-3">
                  <span className="badge badge-outline badge-accent badge-sm tracking-wide">
                    Vedi la mappa →
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </section>

        {/* Le sei tappe — più arioso */}
        <section className="w-full max-w-4xl">
          <div className="flex items-center justify-between mb-5 sm:mb-6 gap-4">
            <SectionTitle size="md">Le Sei Tappe</SectionTitle>
            {allCompleted && (
              <Link href="/finale" className="btn btn-primary btn-sm rounded-full">
                Finale →
              </Link>
            )}
          </div>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
            variants={gridContainer}
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

        {/* Reset progress */}
        {completedCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (confirm("Vuoi davvero ripristinare i progressi?"))
                resetProgress();
            }}
            className="text-base-content/40 hover:text-base-content/60"
          >
            ↻ Ripristina progressi
          </Button>
        )}
      </div>
    </div>
  );
}