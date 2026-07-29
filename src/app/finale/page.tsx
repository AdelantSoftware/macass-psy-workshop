/* refactored: tokens */
"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { STEPS, FULL_PHRASE } from "@/data/steps";
import { useProgress } from "@/hooks/useProgress";
import { LockedScreen } from "@/components/ui/LockedScreen";

export default function FinalePage() {
  const { allCompleted } = useProgress();
  const router = useRouter();

  if (!allCompleted) {
    return (
      <LockedScreen
        icon="🔒"
        title="Non ancora!"
        description="Completa tutte le 6 tappe per sbloccare la schermata finale."
        primaryAction={{ label: "Torna alla Home", onClick: () => router.push("/home") }}
      />
    );
  }

  return (
    <main className="min-h-dvh flex items-center justify-center bg-[var(--color-bg)] layout-padding safe-inset py-12 sm:py-20">
      <div className="max-w-lg mx-auto text-center flex flex-col items-center gap-8 sm:gap-10">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[var(--gradient-hero)] flex items-center justify-center">
            <span className="text-xl sm:text-2xl">✦</span>
          </div>
        </motion.div>

        <motion.h1
          className="font-display text-pretty text-balance text-3xl sm:text-5xl md:text-6xl font-bold"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Complimenti! 🎉
        </motion.h1>

        <motion.p
          className="text-[var(--color-text-warm)] text-base sm:text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Hai completato tutte e sei le tappe del percorso.
        </motion.p>

        <motion.div
          className="w-full p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface-hover)] border border-white/10 flex flex-col items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <p className="text-xs sm:text-sm text-[var(--color-muted-strong)]">Le sei parole:</p>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {STEPS.map((step, i) => (
              <motion.span
                key={step.id}
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                  delay: 0.3 + i * 0.12,
                }}
                className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-sm sm:text-lg font-bold tracking-wider"
                style={{ backgroundColor: `${step.color}20`, color: step.color }}
              >
                {step.word}
              </motion.span>
            ))}
          </div>
          <motion.div
            className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.0, duration: 0.6 }}
          />
          <p className="text-base sm:text-xl md:text-2xl font-light italic text-[var(--color-muted)] leading-relaxed">
            &ldquo;{FULL_PHRASE}&rdquo;
          </p>
        </motion.div>

        <motion.div
          className="w-full p-6 sm:p-8 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-accent)]/20 flex flex-col items-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold gradient-text">
            Workshop di Psicologia
          </h2>
          <p className="text-[var(--color-text-warm)] text-sm sm:text-base leading-relaxed">
            Ti aspetto al <span className="text-white font-semibold">WORKSHOP DI PSICOLOGIA</span>{" "}
            per il <span className="text-[var(--color-accent)]">Muro della consapevolezza</span>.
          </p>
          <div className="inline-block px-5 py-2.5 sm:px-6 sm:py-3 bg-[var(--color-accent)]/10 text-[var(--color-accent)] rounded-full font-medium border border-[var(--color-accent)]/20 text-sm">
            🧠 Scopri di più su te stesso
          </div>
        </motion.div>

        {/* Back link */}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          <button
            onClick={() => router.push("/")}
            className="text-sm text-[var(--color-muted)] hover:text-white transition-colors min-h-[44px] py-2 inline-flex items-center cursor-pointer"
          >
            ↻ Ricominciare il percorso
          </button>
        </motion.div>
      </div>
    </main>
  );
}
