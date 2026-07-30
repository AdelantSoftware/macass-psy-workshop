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
    <div className="min-h-dvh flex items-center justify-center bg-base-100 layout-padding py-12">
      <div className="max-w-lg mx-auto text-center flex flex-col items-center gap-8">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl">
            ✦
          </div>
        </motion.div>

        <motion.h1
          className="font-display text-3xl sm:text-5xl md:text-6xl font-bold"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Complimenti! 🎉
        </motion.h1>

        <motion.p
          className="text-base-content/60 text-base sm:text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Hai completato tutte e sei le tappe del percorso.
        </motion.p>

        <motion.div
          className="card bg-base-200 border border-base-300 w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="card-body items-center gap-4">
            <p className="text-sm text-base-content/60">Le sei parole:</p>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {STEPS.map((step, i) => (
                <motion.span
                  key={step.id}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.3 + i * 0.12 }}
                  className="px-3 py-1.5 rounded-full text-sm sm:text-lg font-bold tracking-wider"
                  style={{ backgroundColor: `${step.color}20`, color: step.color }}
                >
                  {step.word}
                </motion.span>
              ))}
            </div>
            <div className="divider my-2" />
            <p className="text-xl md:text-2xl font-light italic text-base-content/60 leading-relaxed">
              &ldquo;{FULL_PHRASE}&rdquo;
            </p>
          </div>
        </motion.div>

        <motion.div
          className="card bg-base-200 border border-primary/20 w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <div className="card-body items-center gap-3">
            <h2 className="card-title font-display text-2xl sm:text-3xl gradient-text">Workshop di Psicologia</h2>
            <p className="text-sm sm:text-base text-base-content/60">
              Ti aspetto al <span className="font-semibold text-white">WORKSHOP DI PSICOLOGIA</span> per il <span className="text-primary">Muro della consapevolezza</span>.
            </p>
            <span className="badge badge-outline badge-primary">🧠 Scopri di più su te stesso</span>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}>
          <button onClick={() => router.push("/")} className="link link-hover text-sm text-base-content/60">
            ↻ Ricominciare il percorso
          </button>
        </motion.div>
      </div>
    </div>
  );
}