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
      if (!canScan(stepId)) { alert("Devi prima completare la tappa precedente."); return; }
      const match = data.match(/\/tappa\/(\d)/);
      if (match && Number(match[1]) === stepId) unlockStep(stepId);
      else alert("QR Code non valido.");
    },
    [stepId, unlockStep, canScan],
  );

  if (!step) {
    return (
      <div className="hero min-h-dvh bg-base-100">
        <div className="hero-content text-center">
          <p className="text-xl mb-4">❌ Tappa non trovata</p>
          <button onClick={() => router.push("/home")} className="link link-hover text-primary">Torna alla Home</button>
        </div>
      </div>
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
              <>Scansiona il QR Code a <strong className="text-base-content">{step.location}</strong> per sbloccare questa tappa.</>
            ) : (
              <>Prima completa la tappa {stepId - 1} ({prev?.location ?? "precedente"}).</>
            )
          }
          primaryAction={{ label: "📷 Scansiona QR Code", onClick: () => setShowScanner(true) }}
          secondaryAction={{
            label: "📱 Non hai la camera? Inserisci codice manualmente",
            render: (close) => (
              <ManualCodeForm stepId={stepId} onSubmit={() => { unlockStep(stepId); close(); }} gateLocked={!canScan(stepId)} />
            ),
          }}
          footerLink={{ href: "/home", label: "Torna alla Home" }}
        />
        <AnimatePresence>
          {showScanner && <QRScanner key="scanner" onScan={handleScan} onClose={() => setShowScanner(false)} />}
        </AnimatePresence>
      </>
    );
  }

  return (
    <div className="min-h-dvh bg-base-100 pb-20">
      <PageHeader
        title={
          <div className="flex flex-col items-center gap-2">
            <IconBadge size="md" color={step.color}>{step.id}</IconBadge>
            <span>{step.title}</span>
          </div>
        }
        subtitle={<>📍 {step.location}</>}
        backHref="/home"
      />

      <div className="max-w-lg mx-auto layout-padding mt-8">
        <AnimatePresence mode="wait">
          {!revealed ? (
            <motion.div key="game" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
              <p className="text-center text-base-content/60 mb-6 leading-relaxed text-sm sm:text-base">{step.description}</p>
              <div className="card bg-base-200 border border-base-300">
                <div className="card-body p-4 sm:p-6">
                  <Interaction onReveal={handleReveal} />
                </div>
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
    </div>
  );
}