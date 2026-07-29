"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { STEPS } from "@/data/steps";
import { useProgress } from "@/hooks/useProgress";
import { PageHeader } from "@/components/ui/PageHeader";
import { LockedScreen, ManualCodeForm } from "@/components/ui/LockedScreen";
import { IconBadge } from "@/components/ui/IconBadge";
import { RevealCard } from "@/components/ui/RevealCard";
import { INTERACTIONS } from "@/components/games/registry";
import QRScanner from "@/components/QRScanner";
/**
 * Orchestrator for a single tappa:
 *  • If the tappa is locked → show a LockedScreen with scan / manual code
 *  • Otherwise show the game and reveal the word once complete
 *  • Then advance to the next step (or /finale)
 *
 * Individual games live in src/components/games/ — this component is
 * intentionally thin: it just wires together UI primitives.
 */
export default function TappaClient({ stepId }: { stepId: number }) {
  const step = STEPS.find((s) => s.id === stepId);
  const router = useRouter();
  const { isUnlocked, unlockStep, completeStep, canScan } = useProgress();
  const [revealed, setRevealed] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  const unlocked = isUnlocked(stepId);

  const handleReveal = useCallback(() => {
    setRevealed(true);
    completeStep(stepId);
  }, [stepId, completeStep]);

  const handleScan = useCallback(
    (data: string) => {
      setShowScanner(false);
      if (!canScan(stepId)) {
        window.alert("Devi prima completare la tappa precedente.");
        return;
      }
      const match = data.match(/\/tappa\/(\d)/);
      if (match && Number(match[1]) === stepId) unlockStep(stepId);
      else window.alert("QR Code non valido.");
    },
    [stepId, unlockStep, canScan],
  );

  if (!step) {
    return (
      <main className="min-h-dvh flex items-center justify-center bg-[#0f0a1a] layout-padding safe-inset">
        <div className="text-center">
          <p className="text-xl sm:text-2xl mb-4">❌ Tappa non trovata</p>
          <button onClick={() => router.push("/home")} className="text-[var(--color-accent)] underline cursor-pointer min-h-[44px]">
            Torna alla Home
          </button>
        </div>
      </main>
    );
  }

  const Interaction = INTERACTIONS[stepId];
  const handleNext = () => (stepId < 6 ? router.push(`/tappa/${stepId + 1}`) : router.push("/finale"));

  if (!unlocked) {
    const prev = STEPS[stepId - 2];
    return (
      <>
        <LockedScreen
          icon="🔒"
          title={step.title}
          description={
            canScan(stepId) ? (
              <>
                Scansiona il QR Code a <strong className="text-[var(--color-text-warm)]">{step.location}</strong> per sbloccare questa tappa.
              </>
            ) : (
              <>
                Prima completa la tappa {stepId - 1} ({prev?.location ?? "precedente"}).
              </>
            )
          }
          primaryAction={{ label: "📷 Scansiona QR Code", onClick: () => setShowScanner(true) }}
          secondaryAction={{
            label: "📱 Non hai la camera? Inserisci codice manualmente",
            render: (close) => (
              <ManualCodeForm
                stepId={stepId}
                onSubmit={() => {
                  unlockStep(stepId);
                  close();
                }}
                gateLocked={!canScan(stepId)}
              />
            ),
          }}
          footerLink={{ href: "/home", label: "Torna alla Home" }}
        />
        <AnimatePresence>
          {showScanner && (
            <QRScanner key="scanner" onScan={handleScan} onClose={() => setShowScanner(false)} />
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <main className="min-h-dvh bg-[#0f0a1a] pb-20 safe-inset">
      <PageHeader
        title={
          <div className="flex flex-col items-center gap-2">
            <IconBadge size="md" color={step.color}>
              {step.id}
            </IconBadge>
            <span>{step.title}</span>
          </div>
        }
        subtitle={<>📍 {step.location}</>}
        backHref="/home"
        backLabel="Home"
        dense
      />

      <div className="max-w-lg mx-auto layout-padding mt-8 sm:mt-10">
        <AnimatePresence mode="wait">
          {!revealed ? (
            <motion.div
              key="game"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-center text-[#a09ab5] mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base text-pretty">
                {step.description}
              </p>
              <div className="p-4 sm:p-6 rounded-2xl bg-[#1a1230] border border-white/5">
                <Interaction onReveal={handleReveal} />
              </div>
            </motion.div>
          ) : (
            <RevealCard
              key="reveal"
              eyebrow="Hai scoperto la parola:"
              word={step.word}
              color={step.color}
              stepId={stepId}
              actionLabel={stepId < 6 ? "Prossima tappa →" : "Scopri il significato →"}
              onAction={handleNext}
            />
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
