"use client";

import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameShell, type GameProps } from "./shared";

const ACCENT = "#E85A8F";

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

/**
 * Visual scale: judgments on the left pan, qualities on the right.
 * Tap or swipe away each judgment to balance the scale.
 */
export function ScaleGame({ onReveal }: GameProps) {
  const [phase, setPhase] = useState<"intro" | "active" | "complete">("intro");
  const [judgments, setJudgments] = useState<Judgment[]>(INITIAL_JUDGMENTS);
  const [burst, setBurst] = useState(0);
  const revealedRef = useRef(false);

  const removeJudgment = useCallback(
    (id: number) => {
      if (phase !== "active") return;
      setBurst(id + Date.now());
      setJudgments((current) => {
        const next = current.filter((j) => j.id !== id);
        if (next.length === 0 && !revealedRef.current) {
          revealedRef.current = true;
          setPhase("complete");
          setTimeout(onReveal, 1900);
        }
        return next;
      });
    },
    [onReveal, phase],
  );

  const tilt = judgments.length === 0 ? 0 : -5 - judgments.length * 1.7;

  if (phase === "intro") {
    return (
      <GameShell accent={ACCENT}>
        <motion.div className="py-2 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <motion.svg
            viewBox="0 0 180 140"
            className="mx-auto mb-3 w-36"
            aria-hidden="true"
            animate={{ rotate: [-2, 2, -2] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <defs>
              <linearGradient id="introMetal" x1="0" y1="0" x2="1" y2="1">
                <stop stopColor="#fff0f6" />
                <stop offset="0.5" stopColor={ACCENT} />
                <stop offset="1" stopColor="#6e2945" />
              </linearGradient>
            </defs>
            <path
              d="M90 30v72M35 103h110M67 103l23-49 23 49"
              fill="none"
              stroke="url(#introMetal)"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M25 39h130M40 42 24 79h33Zm100 0-16 37h33Z"
              fill="none"
              stroke="#f4cddd"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="90" cy="39" r="8" fill={ACCENT} stroke="#ffe4ef" strokeWidth="3" />
          </motion.svg>
          <p className="font-display text-2xl font-semibold">La Bilancia</p>
          <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-[#aaa3b9]">
            Lascia andare le misure che non ti appartengono. Il tuo valore non ha bisogno di confronti.
          </p>
          <motion.button
            onClick={() => setPhase("active")}
            className="mt-6 min-h-[48px] rounded-full px-7 py-3 font-semibold text-white cursor-pointer"
            style={{
              background: `linear-gradient(135deg, ${ACCENT}, #a83260)`,
              boxShadow: `0 0 28px ${ACCENT}40`,
            }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            Metti in equilibrio
          </motion.button>
        </motion.div>
      </GameShell>
    );
  }

  return (
    <GameShell accent={ACCENT}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative pb-1 text-center"
      >
        <div className="relative h-[390px] overflow-hidden rounded-3xl border border-white/[0.08] bg-[radial-gradient(circle_at_50%_70%,rgba(232,90,143,0.12),transparent_40%),linear-gradient(180deg,#130b21,#0c0815)] sm:h-[430px]">
          {/* Sparkles */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <motion.span
              key={i}
              className="absolute h-1 w-1 rounded-full bg-[#ffd6e6]"
              style={{ left: `${12 + i * 16}%`, top: `${8 + (i % 3) * 9}%` }}
              animate={{ opacity: [0.15, 0.7, 0.15] }}
              transition={{ repeat: Infinity, duration: 2 + i * 0.25 }}
            />
          ))}
          <AnimatePresence>
            {phase === "complete" && (
              <motion.div
                className="absolute left-1/2 top-8 z-30 -translate-x-1/2"
                initial={{ opacity: 0, scale: 0.2, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 170, damping: 14 }}
              >
                <motion.svg
                  viewBox="0 0 80 80"
                  className="h-16 w-16"
                  animate={{
                    filter: [
                      "drop-shadow(0 0 8px #E85A8F77)",
                      "drop-shadow(0 0 22px #E85A8Fcc)",
                      "drop-shadow(0 0 8px #E85A8F77)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  aria-hidden="true"
                >
                  <path
                    d="M40 68S11 51 11 29c0-17 21-22 29-7 8-15 29-10 29 7 0 22-29 39-29 39Z"
                    fill={ACCENT}
                    stroke="#ffd7e6"
                    strokeWidth="2"
                  />
                </motion.svg>
              </motion.div>
            )}
          </AnimatePresence>

          {/* The beam + pans */}
          <div className="absolute inset-x-3 top-[88px] sm:inset-x-6 sm:top-[105px]">
            <motion.div
              className="relative h-3 origin-center rounded-full"
              animate={{ rotate: tilt }}
              transition={{ type: "spring", stiffness: 105, damping: 12, mass: 0.8 }}
              style={{
                background: "linear-gradient(180deg,#f8dce7,#a85475 55%,#542239)",
                boxShadow:
                  phase === "complete"
                    ? `0 0 18px ${ACCENT}, 0 0 38px ${ACCENT}55`
                    : "0 4px 12px #0008",
              }}
            >
              <span className="absolute -left-1 -top-1 h-5 w-5 rounded-full border-2 border-[#f6cedd] bg-[#7c3551]" />
              <span className="absolute -right-1 -top-1 h-5 w-5 rounded-full border-2 border-[#f6cedd] bg-[#7c3551]" />

              {/* Left pan: judgments */}
              <motion.div
                className="absolute left-0 top-2 w-[44%] -translate-x-[4%]"
                animate={{ y: tilt < 0 ? 7 : 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 12 }}
              >
                <div className="mx-auto h-16 w-px bg-gradient-to-b from-[#e7b2c6] to-[#7e3a55]" />
                <div className="relative -mt-1 min-h-[146px] rounded-b-[48px] border-x border-b border-[#ad5a79]/80 bg-[#2a1020]/80 px-2 pb-3 pt-4 backdrop-blur-sm">
                  <span className="absolute -top-1 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-[#d88aa8]" />
                  <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#d98ca9]">
                    Giudizi
                  </p>
                  <AnimatePresence mode="popLayout">
                    {judgments.map((j) => (
                      <motion.button
                        layout
                        key={j.id}
                        onClick={() => removeJudgment(j.id)}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.8}
                        onDragEnd={(_, info) => {
                          if (Math.abs(info.offset.x) > 65 || Math.abs(info.velocity.x) > 450) {
                            removeJudgment(j.id);
                          }
                        }}
                        className="mb-1.5 block min-h-[40px] w-full touch-pan-y rounded-sm border border-[#e8b6c8]/20 bg-[#f4e9e7] px-2 py-1 text-left text-[9px] font-medium leading-tight text-[#51273a] shadow-md sm:text-[10px] cursor-pointer"
                        style={{ backgroundImage: "linear-gradient(95deg,transparent 92%,#dabfc2 92%)" }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1, rotate: j.id % 2 ? -1 : 1 }}
                        exit={{
                          opacity: 0,
                          scale: [0.95, 0.7, 0],
                          rotate: j.id % 2 ? -18 : 18,
                          x: j.id % 2 ? -110 : 110,
                          filter: "blur(4px)",
                        }}
                        whileTap={{ scale: 0.92 }}
                        aria-label={`Elimina: ${j.text}`}
                      >
                        <span className="mr-1 text-[#b13e69]">×</span>
                        {j.text}
                      </motion.button>
                    ))}
                  </AnimatePresence>
                  {judgments.length === 0 && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="pt-8 font-display text-base text-[#f5aec8]"
                    >
                      Spazio libero
                    </motion.p>
                  )}
                </div>
              </motion.div>

              {/* Right pan: qualities */}
              <motion.div
                className="absolute right-0 top-2 w-[44%] translate-x-[4%]"
                animate={{ y: tilt < 0 ? -7 : 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 12 }}
              >
                <div className="mx-auto h-16 w-px bg-gradient-to-b from-[#e7b2c6] to-[#7e3a55]" />
                <div className="relative -mt-1 min-h-[146px] rounded-b-[48px] border-x border-b border-[#ad5a79]/80 bg-[#1d1729]/90 px-2 pb-3 pt-4">
                  <span className="absolute -top-1 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-[#d88aa8]" />
                  <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#eac6d5]">
                    Ciò che sei
                  </p>
                  {QUALITIES.map((q, i) => (
                    <motion.div
                      key={q}
                      className="mb-1.5 flex min-h-[20px] items-center justify-center rounded-full border border-white/10 bg-white/[0.05] px-1 text-[9px] text-[#f3dce5] sm:text-[10px]"
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                    >
                      <span className="mr-1 text-[#E85A8F]">◆</span>
                      {q}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Base */}
          <svg
            viewBox="0 0 220 180"
            className="absolute bottom-0 left-1/2 h-[250px] w-[220px] -translate-x-1/2"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="scaleMetal" x1="0" y1="0" x2="1" y2="1">
                <stop stopColor="#f8dce7" />
                <stop offset="0.42" stopColor="#bd6989" />
                <stop offset="1" stopColor="#532239" />
              </linearGradient>
            </defs>
            <path d="M110 26v112" stroke="url(#scaleMetal)" strokeWidth="11" strokeLinecap="round" />
            <path d="M73 153 101 90h18l28 63Z" fill="#39182a" stroke="url(#scaleMetal)" strokeWidth="4" strokeLinejoin="round" />
            <path d="M52 164h116c9 0 14 5 17 12H35c3-7 8-12 17-12Z" fill="url(#scaleMetal)" />
            <circle cx="110" cy="26" r="11" fill="#4d2034" stroke="#f5ccdc" strokeWidth="4" />
            <circle cx="110" cy="26" r="3" fill="#fff0f6" />
          </svg>

          {/* Burst effect */}
          <AnimatePresence>
            {burst > 0 &&
              judgments.length > 0 &&
              [0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                <motion.i
                  key={`${burst}-${i}`}
                  className="absolute left-[24%] top-[48%] z-40 h-2 w-1 bg-[#ead6d2]"
                  initial={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
                  animate={{
                    opacity: 0,
                    x: (i - 3.5) * 13,
                    y: -20 - (i % 3) * 13,
                    rotate: i * 70,
                  }}
                  transition={{ duration: 0.7 }}
                />
              ))}
          </AnimatePresence>
        </div>
        <AnimatePresence mode="wait">
          {phase === "active" ? (
            <motion.div
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-4"
            >
              <p className="text-sm text-[#b7afc4]">Sfiora via ogni giudizio</p>
              <p className="mt-1 text-xs text-white/35">trascina una carta oppure toccala</p>
            </motion.div>
          ) : (
            <motion.div
              key="balanced"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4"
            >
              <p className="font-display text-2xl text-[#f2aec7]">Sei già abbastanza.</p>
              <p className="mt-1 text-xs uppercase tracking-[0.22em] text-white/35">
                la misura torna al cuore
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </GameShell>
  );
}

