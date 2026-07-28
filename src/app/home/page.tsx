"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { STEPS } from "@/data/steps";
import { useProgress } from "@/hooks/useProgress";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
} as const;

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 24 } },
} as const;

export default function HomePage() {
  const { isUnlocked, isCompleted, allCompleted, progress, resetProgress } =
    useProgress();

  return (
    <main className="min-h-dvh bg-[#0f0a1a] pb-32 safe-inset">
      {/* ── Header — macro-spacing: py-24 ── */}
      <header className="relative py-20 sm:py-28">
        <div className="absolute inset-0 z-0">
          <Image src="/images/hero-bg.jpg" alt="" fill className="object-cover opacity-15" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f0a1a]/30 to-[#0f0a1a]" />
        </div>
        <div className="relative z-10 flex flex-col items-center text-center layout-padding gap-6">
          <motion.h1
            className="font-display text-3xl sm:text-5xl md:text-6xl font-bold"
            style={{ textShadow: "0 2px 16px rgba(0,0,0,0.5)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Il Percorso delle <span className="gradient-text">Sei Parole</span>
          </motion.h1>
          <motion.p
            className="text-[#c8c0d8] text-sm sm:text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Esplora il festival, trova i QR Code, scopri le parole
          </motion.p>
          {/* Progress bar — macro-spacing below subtitle */}
          <motion.div
            className="w-full max-w-xs mt-4"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex justify-between text-xs text-[#a09ab5] mb-2">
              <span>Progresso</span>
              <span>{progress.completedSteps.length}/6 tappe</span>
            </div>
            <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#e85a8f] to-[#5ae8c8] rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(progress.completedSteps.length / 6) * 100}%` }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        </div>
      </header>

      {/* ── Content — macro-spacing: gap-24 between sections ── */}
      <div className="flex flex-col items-center gap-24 sm:gap-32 layout-padding">
        {/* ── Mappa — macro-spacing ── */}
        <motion.section
          className="w-full max-w-4xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">
            Esplora la Mappa
          </h2>
          <Link href="/mappa" className="block group">
            <div className="relative rounded-2xl overflow-hidden h-56 sm:h-64 md:h-80 shadow-lg shadow-black/20">
              <Image src="/images/map-bg.jpg" alt="Mappa del festival" fill className="object-cover group-hover:scale-105 group-active:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f0a1a]/80 via-[#0f0a1a]/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-center flex flex-col gap-1">
                <p className="font-display text-xl sm:text-2xl font-semibold text-shadow">Mappa del Festival</p>
                <p className="text-[#c8c0d8] text-sm text-shadow-soft">Trova le 6 posizioni dei QR Code nascosti</p>
                <span className="inline-block mt-2 px-5 py-2 bg-[#5ae8c8]/20 text-[#5ae8c8] rounded-full text-sm font-medium group-hover:bg-[#5ae8c8]/30 transition-colors">
                  Vedi la mappa →
                </span>
              </div>
            </div>
          </Link>
        </motion.section>

        {/* ── Le Sei Tappe — macro-spacing ── */}
        <section className="w-full max-w-4xl">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h2 className="font-display text-2xl sm:text-3xl font-bold">
              Le Sei Tappe
            </h2>
            {allCompleted && (
              <Link href="/finale" className="px-4 py-2 bg-[#e85a8f]/10 text-[#e85a8f] rounded-full text-sm font-medium hover:bg-[#e85a8f]/20 transition-colors min-h-[40px] flex items-center">
                Finale →
              </Link>
            )}
          </div>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {STEPS.map((step) => {
              const unlocked = isUnlocked(step.id);
              const completed = isCompleted(step.id);
              return (
                <motion.div key={step.id} variants={item}>
                  <Link
                    href={unlocked ? `/tappa/${step.id}` : "#"}
                    className={`block rounded-2xl overflow-hidden border shadow-lg shadow-black/10 ${
                      unlocked ? "bg-[#1a1230] border-white/5" : "bg-[#1a1230]/50 border-white/5 opacity-60"
                    } ${completed ? "ring-2 ring-[#5ae8c8]/30" : ""}`}
                  >
                    <div className="relative h-40 sm:h-48">
                      <Image src={step.image} alt={step.title} fill className={`object-cover ${!unlocked ? "blur-sm" : ""}`} />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1a1230] to-transparent" />
                      <div className="absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs" style={{ backgroundColor: step.color }}>
                        {unlocked ? step.id : "🔒"}
                      </div>
                      {completed && (
                        <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#5ae8c8] flex items-center justify-center text-xs">✓</div>
                      )}
                    </div>
                    <div className="p-4 sm:p-5 flex flex-col gap-1">
                      <h3 className="font-display font-bold text-lg sm:text-xl">{unlocked ? step.title : "Tappa bloccata"}</h3>
                      <p className="text-[#a09ab5] text-xs sm:text-sm">📍 {step.location}</p>
                      <p className="text-xs sm:text-sm text-[#a09ab5] leading-relaxed">{unlocked ? step.description : "Scansiona il QR Code per sbloccare"}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[10px] sm:text-xs font-mono tracking-wider px-2 sm:px-3 py-1 rounded-full" style={{ backgroundColor: unlocked ? `${step.color}20` : "rgba(255,255,255,0.05)", color: unlocked ? step.color : "#8b85a0" }}>
                          {unlocked ? step.word : "???"}
                        </span>
                        <span className="text-[10px] sm:text-xs text-[#a09ab5]">{step.id}/6</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </section>

        {/* Reset */}
        {progress.completedSteps.length > 0 && (
          <div className="text-center">
            <button onClick={() => { if (confirm("Vuoi davvero ripristinare i progressi?")) resetProgress(); }}
              className="text-xs text-[#a09ab5] hover:text-red-400 transition-colors cursor-pointer min-h-[44px] px-4 py-2">
              ↻ Ripristina progressi
            </button>
          </div>
        )}
      </div>
    </main>
  );
}