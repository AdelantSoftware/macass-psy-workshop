"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { STEPS } from "@/data/steps";
import { useProgress } from "@/hooks/useProgress";
import { LockedScreen, ManualCodeForm } from "@/components/ui/LockedScreen";
import { IconBadge } from "@/components/ui/IconBadge";
import { RevealCard } from "@/components/ui/RevealCard";
import { Button } from "@/components/ui/Button";
import { INTERACTIONS } from "@/components/games/registry";
import QRScanner from "@/components/QRScanner";

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
        alert("Devi prima completare la tappa precedente.");
        return;
      }
      const scanned = data.trim().toUpperCase();
      if (step && scanned === step.secretWord.toUpperCase()) unlockStep(stepId);
      else alert("QR Code non valido.");
    },
    [stepId, step, unlockStep, canScan],
  );

  if (!step) {
    return (
      <div className="hero min-h-dvh bg-base-100">
        <div className="hero-content text-center">
          <p className="text-xl mb-4">❌ Tappa non trovata</p>
          <button onClick={() => router.push("/home")} className="link link-hover text-primary">
            Torna alla Home
          </button>
        </div>
      </div>
    );
  }

  const Interaction = INTERACTIONS[stepId];
  const handleNext = () =>
    stepId < 6 ? router.push(`/tappa/${stepId + 1}`) : router.push("/finale");

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
                Scansiona il QR Code a{" "}
                <strong className="text-base-content">{step.location}</strong>{" "}
                per sbloccare questa tappa.
              </>
            ) : (
              <>
                Prima completa la tappa {stepId - 1} (
                {prev?.location ?? "precedente"}).
              </>
            )
          }
          primaryAction={{
            label: "📷 Scansiona QR Code",
            onClick: () => setShowScanner(true),
          }}
          secondaryAction={{
            label: "Non hai la camera? Inserisci la parola segreta",
            render: (close) => (
              <ManualCodeForm
                stepId={stepId}
                secretWord={step.secretWord}
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
            <QRScanner
              key="scanner"
              onScan={handleScan}
              onClose={() => setShowScanner(false)}
            />
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <div className="min-h-dvh bg-base-100 flex flex-col relative">
      {/* Sfondo decorativo della tappa */}
      <div className="absolute inset-0 z-0">
        <Image src={step.image} alt="" fill className="object-cover opacity-[0.06]" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-b from-base-100/70 to-base-100" />
      </div>

      {/* Fixed header */}
      <div className="sticky top-0 z-20 bg-base-100/90 backdrop-blur-md border-b border-base-300/50">
        <div className="flex items-center gap-3 p-4 max-w-4xl mx-auto w-full">
          <button
            onClick={() => router.push("/home")}
            className="btn btn-ghost btn-sm btn-square text-base-content/60 hover:text-base-content"
          >
            <span className="text-lg">←</span>
          </button>
          <IconBadge size="md" color={step.color}>
            {step.id}
          </IconBadge>
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-lg sm:text-xl font-bold truncate">
              {step.title}
            </h1>
            <p className="text-xs text-base-content/50 truncate">
              📍 {step.location}
            </p>
          </div>
        </div>
      </div>

      {/* Game content */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10">
        <div className="w-full max-w-4xl px-3 py-4 sm:px-8 sm:py-10">
          <AnimatePresence mode="wait">
            {!revealed ? (
              <motion.div
                key="game"
                className="w-full flex flex-col items-center"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
              >
                <p className="text-center text-base-content/50 mb-6 leading-relaxed text-sm sm:text-base max-w-lg font-light">
                  {step.description}
                </p>
                <div className="card bg-base-200 border border-base-300/60 w-full max-w-2xl">
                  <div className="card-body p-2.5 sm:p-6 md:p-8">
                    <Interaction onReveal={handleReveal} />
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="w-full max-w-lg">
                <RevealCard
                  key="reveal"
                  eyebrow="Hai scoperto la parola:"
                  word={step.word}
                  color={step.color}
                  stepId={stepId}
                  actionLabel={
                    stepId < 6 ? "Prossima tappa →" : "Scopri il significato →"
                  }
                  onAction={handleNext}
                />
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}