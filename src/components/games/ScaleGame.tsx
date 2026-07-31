"use client";

import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameShell, type GameProps } from "./shared";

const ACCENT = "var(--color-accent)";

const QUALITIES = ["Empatia", "Forza", "Creatività", "Coraggio", "Unicità"];

interface Judgment {
  id: number;
  text: string;
}

const INITIAL_JUDGMENTS: Judgment[] = [
  { id: 1, text: "Non sei abbastanza" },
  { id: 2, text: "Dovresti fare di più" },
  { id: 3, text: "Gli altri sono migliori" },
  { id: 4, text: "Non ce la farai" },
  { id: 5, text: "Sei troppo diverso" },
];

export function ScaleGame({ onReveal }: GameProps) {
  const [phase, setPhase] = useState<"intro" | "active" | "complete">("intro");
  const [judgments, setJudgments] = useState<Judgment[]>(INITIAL_JUDGMENTS);
  const revealedRef = useRef(false);

  const removeJudgment = useCallback(
    (id: number) => {
      if (phase !== "active") return;
      setJudgments((current) => current.filter((j) => j.id !== id));
      if (judgments.length === 1 && !revealedRef.current) {
        revealedRef.current = true;
        setPhase("complete");
        setTimeout(onReveal, 5000);
      }
    },
    [onReveal, phase, judgments.length],
  );

  const cleared = INITIAL_JUDGMENTS.length - judgments.length;
  const balanced = cleared / INITIAL_JUDGMENTS.length;

  if (phase === "intro") {
    return (
      <GameShell accent={ACCENT}>
        <div className="flex flex-col items-center py-4 text-center">
          <ScaleIllustration level={0.2} />
          <p className="font-display text-2xl font-semibold">La Bilancia</p>
          <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-[var(--color-tint-clay-quote)]">
            Lascia andare le misure che non ti appartengono. Il tuo valore non ha bisogno di confronti.
          </p>
          <button onClick={() => setPhase("active")} className="btn btn-primary btn-lg mt-6">
            Metti in equilibrio
          </button>
        </div>
      </GameShell>
    );
  }

  return (
    <GameShell accent={ACCENT}>
      <div className="relative flex flex-col items-center text-center">
        {/* Glow decorativo */}
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle, ${ACCENT} 1px, transparent 1px)`,
            backgroundSize: "26px 26px",
            maskImage: "linear-gradient(to bottom, black, transparent 70%)",
          }}
        />

        <div className="relative z-10 w-full max-w-sm">
          <ScaleIllustration level={balanced} complete={phase === "complete"} />
        </div>

        <AnimatePresence mode="wait">
          {phase === "complete" ? (
            <motion.div key="balanced" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 mt-5">
              <p className="font-display text-2xl text-[var(--color-tint-clay-paler)]">Sei già abbastanza.</p>
              <p className="mt-1 text-xs uppercase tracking-[0.22em] text-white/35">
                la misura torna al cuore
              </p>
            </motion.div>
          ) : (
            <motion.div key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative z-10 mt-4">
              <p className="text-sm text-[var(--color-tint-clay-soft)]">Sfiora via ogni giudizio</p>
              <p className="mt-1 text-xs text-white/35">
                {judgments.length === 0 ? "ci sei quasi..." : `tocca la × · ${judgments.length} rimanenti`}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative z-10 mt-6 grid w-full max-w-sm grid-cols-2 gap-3">
          {/* Giudizi */}
          <div className="rounded-2xl border border-[var(--color-tint-clay-pale)]/15 bg-gradient-to-b from-[var(--color-tint-clay-pale)]/[0.07] to-transparent p-3">
            <p className="mb-2.5 flex items-center justify-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--color-tint-clay-pale)]/70">
              <span className="h-1 w-1 rounded-full bg-[var(--color-tint-clay-pale)]" />
              Giudizi
            </p>
            <AnimatePresence mode="popLayout">
              {judgments.length === 0 && (
                <motion.p
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-6 font-display text-base text-[var(--color-tint-clay-pale)]/70"
                >
                  ✨ Spazio libero
                </motion.p>
              )}
              {judgments.map((j) => (
                <motion.button
                  layout
                  key={j.id}
                  onClick={() => removeJudgment(j.id)}
                  className="mb-1.5 flex w-full min-h-[40px] touch-none items-center gap-2 rounded-xl border border-[var(--color-tint-clay-pale)]/15 bg-[var(--color-on-dark-2)]/60 px-2 py-1.5 text-left text-[10px] font-medium leading-tight text-[var(--color-tint-clay-paler)] shadow-lg shadow-black/20 backdrop-blur-sm cursor-pointer hover:border-[var(--color-tint-clay-pale)]/40 active:scale-95 transition-transform"
                  style={{ backgroundImage: "linear-gradient(95deg,transparent 88%,var(--color-tint-clay-pale)/[0.12] 88%)" }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6, x: j.id % 2 ? -80 : 80, filter: "blur(4px)" }}
                  whileTap={{ scale: 0.94 }}
                  aria-label={`Elimina: ${j.text}`}
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-tint-clay-pale)]/12 text-[11px] font-bold text-[var(--color-tint-clay-pale)] border border-[var(--color-tint-clay-pale)]/30">
                    ×
                  </span>
                  <span className="flex-1">{j.text}</span>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>

          {/* Qualità */}
          <div className="rounded-2xl border border-[var(--color-accent)]/15 bg-gradient-to-b from-[var(--color-accent)]/[0.07] to-transparent p-3">
            <p className="mb-2.5 flex items-center justify-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]/80">
              <span className="h-1 w-1 rounded-full bg-[var(--color-accent)]" />
              Ciò che sei
            </p>
            <div className="flex flex-col gap-1.5">
              {QUALITIES.map((q, i) => (
                <motion.div
                  key={q}
                  className="flex items-center justify-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-1 py-1 text-[10px] text-[var(--color-base-content)]"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <svg viewBox="0 0 16 16" className="h-3 w-3 text-[var(--color-accent)]" aria-hidden="true">
                    <path d="M2 8l4 4 8-9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {q}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </GameShell>
  );
}

function ScaleIllustration({ level, complete = false }: { level: number; complete?: boolean }) {
  const tilt = level >= 1 ? 0 : -10 + level * 10;

  return (
    <svg viewBox="0 0 220 160" className="mx-auto h-40 w-full max-w-[220px]" aria-hidden="true">
      <defs>
        <linearGradient id="scaleMetal2" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="var(--color-tint-clay-pale)" />
          <stop offset="0.5" stopColor={ACCENT} />
          <stop offset="1" stopColor="var(--color-tint-clay-paler)" />
        </linearGradient>
        <filter id="scaleGlow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Glow in equilibrio */}
      {complete && (
        <circle cx="110" cy="46" r="14" fill="none" stroke={ACCENT} strokeWidth="1.5" strokeDasharray="4 4" opacity="0.9">
          <animateTransform attributeName="transform" type="rotate" from="0 110 46" to="360 110 46" dur="6s" repeatCount="indefinite" />
        </circle>
      )}

      <motion.g
        style={{ originX: "110px", originY: "46px" }}
        animate={{ rotate: tilt }}
        transition={{ type: "spring", stiffness: 90, damping: 12 }}
      >
        {/* Asta orizzontale */}
        <line x1="35" y1="46" x2="185" y2="46" stroke="url(#scaleMetal2)" strokeWidth="6" strokeLinecap="round" />
        {/* Perno centrale */}
        <line x1="110" y1="46" x2="110" y2="105" stroke="url(#scaleMetal2)" strokeWidth="6" strokeLinecap="round" />
        {/* Piatto sinistro */}
        <line x1="35" y1="46" x2="35" y2="78" stroke="var(--color-tint-clay-pale)" strokeWidth="2" />
        <path d="M6 78h58l-9 18H15Z" fill="var(--color-tint-clay-paler)" stroke="var(--color-tint-clay-pale)" strokeWidth="1.5" opacity="0.95" />
        {/* Piatto destro */}
        <line x1="185" y1="46" x2="185" y2="78" stroke="var(--color-tint-clay-pale)" strokeWidth="2" />
        <path d="M156 78h58l-9 18H165Z" fill="var(--color-tint-clay-paler)" stroke="var(--color-tint-clay-pale)" strokeWidth="1.5" opacity="0.95" />
      </motion.g>

      {/* Base */}
      <path d="M84 130h52l10 18H74Z" fill="url(#scaleMetal2)" />
      <path d="M110 130v-10" stroke="var(--color-tint-clay-pale)" strokeWidth="2" />
      {/* Perno */}
      <circle cx="110" cy="46" r="8" fill="var(--color-tint-clay-paler)" stroke={ACCENT} strokeWidth="2.5" />
      <circle cx="110" cy="46" r="3" fill={ACCENT} />
    </svg>
  );
}

