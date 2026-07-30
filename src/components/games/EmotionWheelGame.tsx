/* refactored: tokens */
"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameShell } from "./shared";
import type { GameProps } from "./shared";

interface Emotion {
  name: string;
  prompt: string;
  color: string;
}

const EMOTIONS: Emotion[] = [
  { name: "Felicità",  prompt: "Quale piccola cosa ti ha acceso un sorriso oggi?", color: "var(--color-tint-rust-pale)" },
  { name: "Tristezza", prompt: "Di cosa avrebbe bisogno la tua tristezza, se potesse parlare?", color: "var(--color-tint-sky-shade)" },
  { name: "Rabbia",    prompt: "Quale confine sta chiedendo di essere ascoltato?", color: "var(--color-tint-rust-light)" },
  { name: "Paura",     prompt: "Cosa cambierebbe se non dovessi affrontarla da solə?", color: "var(--color-tint-violet-pale)" },
  { name: "Sorpresa",  prompt: "Cosa non ti aspettavi di sentire proprio qui?", color: "var(--color-tint-rust-pale)" },
  { name: "Disgusto",  prompt: "Da cosa il tuo corpo sta cercando di proteggerti?", color: "var(--color-tint-rust-pale)" },
  { name: "Serenità",  prompt: "Dove senti questa quiete, adesso, nel tuo corpo?", color: "var(--color-tint-pink-pale)" },
  { name: "Gratitudine", prompt: "A chi o a cosa vorresti dire grazie, in silenzio?", color: "var(--color-tint-rust-pale)" },
];

const ACCENT = "var(--color-accent-rust)";
const SECTOR_COUNT = EMOTIONS.length; // 8 → 45deg slices

function polar(angle: number, radius = 47): { x: number; y: number } {
  const radians = ((angle - 90) * Math.PI) / 180;
  return { x: 50 + radius * Math.cos(radians), y: 50 + radius * Math.sin(radians) };
}

function sectorPath(index: number): string {
  const start = polar(index * (360 / SECTOR_COUNT));
  const end = polar((index + 1) * (360 / SECTOR_COUNT));
  return `M 50 50 L ${start.x} ${start.y} A 47 47 0 0 1 ${end.x} ${end.y} Z`;
}

export function EmotionWheelGame({ onReveal }: GameProps) {
  const [phase, setPhase] = useState<"intro" | "active" | "complete">("intro");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [rotation, setRotation] = useState(0);
  const revealCalled = useRef(false);

  const spin = () => {
    const index = Math.floor(Math.random() * EMOTIONS.length);
    setSelectedIndex(index);
    setPhase("active");
    setRotation(2160 - index * (360 / SECTOR_COUNT) - 360 / SECTOR_COUNT / 2);
  };

  const finishSpin = () => {
    if (phase !== "active" || selectedIndex === null) return;
    setPhase("complete");
    if (!revealCalled.current) {
      revealCalled.current = true;
      setTimeout(onReveal, 3200);
    }
  };

  const selected = selectedIndex === null ? null : EMOTIONS[selectedIndex];

  return (
    <GameShell accent={ACCENT}>
      <div
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage: "radial-gradient(circle, var(--color-accent-rust) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage: "linear-gradient(to bottom, black, transparent 75%)",
        }}
      />

      <AnimatePresence mode="wait">
        {phase === "intro" ? (
          <motion.div
            key="intro"
            className="relative z-10 flex min-h-[390px] flex-col items-center justify-center"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
          >
            <motion.div
              className="relative mb-7 grid h-28 w-28 place-items-center rounded-full border border-[var(--color-accent-rust)]/30"
              animate={{
                boxShadow: [
                  "0 0 0 0 var(--color-accent-soft)",
                  "0 0 0 18px var(--color-accent-soft)",
                  "0 0 0 0 var(--color-accent-soft)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <div className="absolute inset-3 rounded-full border border-dashed border-[var(--color-accent-rust)]/50" />
              <svg viewBox="0 0 48 48" className="h-12 w-12 text-[var(--color-accent-rust)]" fill="none" aria-hidden="true">
                <path
                  d="M24 39s-13-7.4-13-17.2C11 15.3 18.5 12 24 18c5.5-6 13-2.7 13 3.8C37 31.6 24 39 24 39Z"
                  stroke="currentColor"
                  strokeWidth="1.7"
                />
                <path
                  d="M8 24h8l3-6 5 13 4-9 3 4h9"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.34em] text-[var(--color-accent-rust)]">
              Un momento per te
            </p>
            <h3 className="font-display text-3xl font-semibold text-white">Che cosa senti?</h3>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-[var(--color-tint-sky-shade)]">
              Lascia che la ruota scelga una parola. Non serve giudicarla: basta ascoltarla.
            </p>
            <button
              onClick={spin}
              className="btn btn-primary btn-lg mt-8"
            >
              Inizia ad ascoltare
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="wheel"
            className="relative z-10 flex min-h-[390px] flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--color-accent-rust)]">
              {phase === "active" ? "Lascia andare il controllo" : "La ruota si è fermata su"}
            </p>
            <div className="relative h-[250px] w-[250px] sm:h-[280px] sm:w-[280px]">
              <motion.div
                className="absolute inset-1 rounded-full bg-[var(--color-accent-rust)]/20 blur-2xl"
                animate={
                  phase === "complete"
                    ? { scale: [1, 1.25, 1.08], opacity: [0.25, 0.7, 0.35] }
                    : { scale: [1, 1.08, 1], opacity: [0.15, 0.3, 0.15] }
                }
                transition={{
                  duration: phase === "complete" ? 0.7 : 1.6,
                  repeat: phase === "active" ? Infinity : 0,
                }}
              />
              <motion.div
                className="absolute inset-3"
                animate={{ rotate: rotation }}
                onAnimationComplete={finishSpin}
                transition={{ duration: 4.2, ease: [0.12, 0.72, 0.12, 1] }}
              >
                <svg
                  viewBox="0 0 100 100"
                  className="h-full w-full drop-shadow-[0_14px_24px_rgba(0,0,0,0.38)]"
                  aria-label="Ruota delle emozioni"
                >
                  <circle cx="50" cy="50" r="49" fill="var(--color-tint-ink-pale)" stroke="var(--color-on-dark-6)" strokeWidth="1" />
                  {EMOTIONS.map((emotion, index) => (
                    <path
                      key={emotion.name}
                      d={sectorPath(index)}
                      fill={emotion.color}
                      opacity={phase === "complete" && index !== selectedIndex ? 0.3 : 1}
                      stroke="var(--color-tint-ink-pale)"
                      strokeWidth="0.65"
                    />
                  ))}
                  <circle cx="50" cy="50" r="12" fill="var(--color-tint-ink-pale)" stroke="var(--color-on-dark-10)" strokeWidth="1" />
                  <circle cx="50" cy="50" r="4" fill="var(--color-accent-rust)" />
                </svg>
              </motion.div>
              <motion.div
                className="absolute left-1/2 top-0 z-20 -translate-x-1/2"
                animate={phase === "active" ? { y: [0, 4, 0] } : { y: 0 }}
                transition={{ duration: 0.18, repeat: phase === "active" ? Infinity : 0 }}
              >
                <div className="h-0 w-0 border-x-[12px] border-t-[22px] border-x-transparent border-t-white drop-shadow-[0_3px_8px_var(--color-on-dark-11)]" />
              </motion.div>
              {phase === "complete" &&
                Array.from({ length: 12 }, (_, index) => (
                  <motion.span
                    key={index}
                    className="absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full bg-[var(--color-accent-rust)]"
                    initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                    animate={{
                      x: Math.cos((index * Math.PI) / 6) * 145,
                      y: Math.sin((index * Math.PI) / 6) * 145,
                      opacity: 0,
                      scale: 0,
                    }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
                  />
                ))}
            </div>
            <AnimatePresence mode="wait">
              {phase === "active" ? (
                <motion.p
                  key="listening"
                  className="mt-3 text-sm italic text-[var(--color-tint-sky-shade)]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ repeat: Infinity, duration: 1.4 }}
                >
                  Ascolta quello che emerge…
                </motion.p>
              ) : (
                selected && (
                  <motion.div
                    key="result"
                    className="mt-2"
                    initial={{ opacity: 0, y: 14, scale: 0.92 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 220, damping: 18 }}
                  >
                    <h3 className="font-display text-4xl font-semibold text-[var(--color-tint-rust-light)]">
                      {selected.name}
                    </h3>
                    <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-[var(--color-tint-sky-pale-2)]">
                      {selected.prompt}
                    </p>
                  </motion.div>
                )
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </GameShell>
  );
}
