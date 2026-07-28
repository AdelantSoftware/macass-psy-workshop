"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { STEPS, FULL_PHRASE } from "@/data/steps";
import { useProgress } from "@/hooks/useProgress";

export default function FinalePage() {
  const { allCompleted } = useProgress();

  if (!allCompleted) {
    return (
      <main className="min-h-dvh flex items-center justify-center bg-[#0f0a1a] px-5 safe-inset">
        <div className="text-center max-w-sm">
          <p className="text-xl sm:text-2xl mb-4">🔒 Non ancora!</p>
          <p className="text-[#8b85a0] text-sm mb-6">Completa tutte le 6 tappe per sbloccare la schermata finale.</p>
          <Link href="/home" className="text-[#e85a8f] hover:text-[#c84a7a] transition-colors min-h-[44px] inline-flex items-center">
            ← Torna alla Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-dvh flex items-center justify-center bg-[#0f0a1a] px-5 sm:px-6 py-12 safe-inset">
      <div className="max-w-lg mx-auto text-center">
        <motion.div
          className="mb-6 sm:mb-8"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-full bg-gradient-to-br from-[#e85a8f] to-[#5ae8c8] flex items-center justify-center">
            <span className="text-xl sm:text-2xl">✦</span>
          </div>
        </motion.div>

        <motion.h1
          className="font-display text-3xl sm:text-5xl md:text-6xl font-bold mb-3 sm:mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Complimenti! 🎉
        </motion.h1>

        <motion.p
          className="text-[#8b85a0] text-base sm:text-lg mb-6 sm:mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Hai completato tutte e sei le tappe del percorso.
        </motion.p>

        <motion.div
          className="p-5 sm:p-8 rounded-2xl bg-gradient-to-br from-[#1a1230] to-[#2d1b69] border border-white/10 mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <p className="text-xs sm:text-sm text-[#8b85a0] mb-3 sm:mb-4">Le sei parole:</p>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {STEPS.map((step, i) => (
              <motion.span
                key={step.id}
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.3 + i * 0.12 }}
                className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-sm sm:text-lg font-bold tracking-wider"
                style={{ backgroundColor: `${step.color}20`, color: step.color }}
              >
                {step.word}
              </motion.span>
            ))}
          </div>
          <motion.div
            className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-white/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <p className="text-base sm:text-xl md:text-2xl font-light italic text-[#a09ab5] leading-relaxed">
              “{FULL_PHRASE}”
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          className="p-5 sm:p-8 rounded-2xl bg-[#1a1230] border border-[#e85a8f]/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.5 }}
        >
          <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 gradient-text">Workshop di Psicologia</h2>
          <p className="text-[#8b85a0] text-sm sm:text-base mb-4 sm:mb-6 leading-relaxed">
            Ti aspetto al <span className="text-white font-semibold">WORKSHOP DI PSICOLOGIA</span> per il <span className="text-[#e85a8f]">Muro della consapevolezza</span>.
          </p>
          <div className="inline-block px-5 py-2.5 sm:px-6 sm:py-3 bg-[#e85a8f]/10 text-[#e85a8f] rounded-full font-medium border border-[#e85a8f]/20 text-sm">
            🧠 Scopri di più su te stesso
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
        >
          <Link href="/" className="inline-block mt-6 sm:mt-8 text-sm text-[#8b85a0] hover:text-white transition-colors min-h-[44px] py-2">
            ↻ Ricominciare il percorso
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
