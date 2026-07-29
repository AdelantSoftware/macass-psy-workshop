"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { STEPS } from "@/data/steps";
import { useProgress } from "@/hooks/useProgress";
import { SectionTitle } from "@/components/ui/Typography";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StepCard } from "@/components/ui/StepCard";
import { cn } from "@/lib/cn";

const gridContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
} as const;

export default function HomePage() {
  const { isUnlocked, isCompleted, allCompleted, progress, resetProgress } = useProgress();

  const totalSteps = STEPS.length;
  const completedCount = progress.completedSteps.length;

  return (
    <main className="min-h-dvh bg-[#0f0a1a] pb-24 sm:pb-32 safe-inset">
      {/* Header */}
      <header className="relative py-12 sm:py-16">
        <div className="absolute inset-0 z-0">
          <Image src="/images/hero-bg.jpg" alt="" fill className="object-cover opacity-15" />
          <div className="absolute inset-0 bg-[var(--gradient-overlay-bottom)]" />
        </div>
        <div className="relative z-10 flex flex-col items-center text-center layout-padding gap-4 sm:gap-6">
          <motion.h1
            className="font-display text-pretty text-balance text-3xl sm:text-5xl md:text-6xl font-bold text-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Il Percorso delle <span className="gradient-text">Sei Parole</span>
          </motion.h1>
          <motion.p
            className="text-[#c8c0d8] text-sm sm:text-lg text-pretty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Esplora il festival, trova i QR Code, scopri le parole
          </motion.p>
          <motion.div
            className="w-full max-w-xs mt-4"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <ProgressBar
              value={completedCount / totalSteps}
              label="Progresso"
              rightLabel={`${completedCount}/${totalSteps} tappe`}
            />
          </motion.div>
        </div>
      </header>

      {/* Content */}
      <div className="flex flex-col items-center gap-16 sm:gap-24 layout-padding">
        {/* Map preview */}
        <motion.section
          className="w-full max-w-4xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <SectionTitle size="md" center className="mb-4 sm:mb-6">
            Esplora la Mappa
          </SectionTitle>
          <Link href="/mappa" className="block group focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-mint)] rounded-2xl">
            <div className="relative rounded-2xl overflow-hidden h-48 sm:h-64 md:h-80 shadow-lg shadow-black/20">
              <Image
                src="/images/map-bg.jpg"
                alt="Mappa del festival"
                fill
                className="object-cover group-hover:scale-105 group-active:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 60vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f0a1a]/80 via-[#0f0a1a]/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 text-center flex flex-col gap-1">
                <p className="font-display text-xl sm:text-2xl font-semibold text-shadow">
                  Mappa del Festival
                </p>
                <p className="text-[#c8c0d8] text-sm text-shadow-soft">
                  Trova le 6 posizioni dei QR Code nascosti
                </p>
                <span className="inline-block mt-2 px-5 py-2 bg-[#5ae8c8]/20 text-[#5ae8c8] rounded-full text-sm font-medium group-hover:bg-[#5ae8c8]/30 transition-colors">
                  Vedi la mappa →
                </span>
              </div>
            </div>
          </Link>
        </motion.section>

        {/* Le sei tappe */}
        <section className="w-full max-w-4xl">
          <div className="flex items-center justify-between mb-4 sm:mb-6 gap-4">
            <SectionTitle size="md">Le Sei Tappe</SectionTitle>
            {allCompleted && (
              <Link
                href="/finale"
                className="px-4 py-2 bg-[var(--color-accent-soft)] text-[var(--color-accent)] rounded-full text-sm font-medium hover:bg-[var(--color-accent)]/30 transition-colors min-h-[40px] flex items-center shrink-0"
              >
                Finale →
              </Link>
            )}
          </div>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
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

        {completedCount > 0 && (
          <ResetProgressButton onReset={() => {
            if (window.confirm("Vuoi davvero ripristinare i progressi?")) resetProgress();
          }} />
        )}
      </div>
    </main>
  );
}

function ResetProgressButton({ onReset }: { onReset: () => void }) {
  return (
    <div className="text-center">
      <button
        onClick={onReset}
        className={cn(
          "text-xs text-[#a09ab5] hover:text-red-400 transition-colors min-h-[44px] px-4 py-2 cursor-pointer",
        )}
      >
        ↻ Ripristina progressi
      </button>
    </div>
  );
}
