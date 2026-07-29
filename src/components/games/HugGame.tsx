"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameShell } from "./shared";
import type { GameProps } from "./shared";

const ACCENT = "#E8C85A";

/**
 * Soft tactile experience: the user holds the bear, progress fills,
 * the bear's expression shifts from sad → joyful.
 * Uses pointer events so it works on touch + mouse.
 */
export function HugGame({ onReveal }: GameProps) {
  const [phase, setPhase] = useState<"intro" | "active" | "complete">("intro");
  const [pressing, setPressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [breath, setBreath] = useState(0); // 0..1 cycle
  const revealCalled = useRef(false);
  const rafRef = useRef<number | null>(null);
  const lastTickRef = useRef<number | null>(null);
  const breathStartRef = useRef<number | null>(null);
  const vibrateRef = useRef<number | null>(null);

  // Single requestAnimationFrame loop: progresses the bar while pressed.
  useEffect(() => {
    const loop = (now: number) => {
      if (lastTickRef.current === null) lastTickRef.current = now;
      const dt = Math.min(64, now - lastTickRef.current);
      lastTickRef.current = now;
      if (pressing && phase === "active") {
        setProgress((p) => Math.min(100, p + dt * 0.045));
        if (breathStartRef.current === null) breathStartRef.current = now;
        const elapsed = (now - breathStartRef.current) / 1000;
        // 4-second breathing cycle (inhale 2s, exhale 2s).
        setBreath((Math.sin((elapsed / 4) * Math.PI * 2 - Math.PI / 2) + 1) / 2);
      } else {
        breathStartRef.current = null;
        setBreath((b) => (b + dt * 0.0008) % 1); // idle drift
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTickRef.current = null;
    };
  }, [pressing, phase]);

  // Auto-progress to "complete" once the bar fills.
  // The rAF loop is the single source of truth for `progress`; this
  // effect only watches it for the one-shot transition to "complete"
  // (guarded by a ref so we never re-schedule the side effects).
  useEffect(() => {
    if (progress >= 100 && phase === "active" && !revealCalled.current) {
      revealCalled.current = true;
      const id = window.setTimeout(() => {
        setPhase("complete");
        setPressing(false);
        tryVibrate([40, 30, 80, 30, 140]);
        window.setTimeout(onReveal, 2400);
      }, 0);
      return () => window.clearTimeout(id);
    }
  }, [progress, phase, onReveal]);

  // Light haptic tick on press start; periodically while held.
  const startPress = () => {
    if (phase === "complete") return;
    if (phase === "intro") setPhase("active");
    setPressing(true);
    tryVibrate(20);
    vibrateRef.current = window.setInterval(() => tryVibrate(12), 1100);
  };
  const endPress = () => {
    setPressing(false);
    if (vibrateRef.current !== null) {
      clearInterval(vibrateRef.current);
      vibrateRef.current = null;
    }
  };

  useEffect(
    () => () => {
      if (vibrateRef.current !== null) clearInterval(vibrateRef.current);
    },
    [],
  );

  const sadness = 1 - progress / 100; // 1=sad, 0=joy
  const breathScale = 0.94 + breath * 0.12;
  const ringScale = 0.7 + breath * 0.6;
  const ringOpacity = 0.15 + breath * 0.4;

  return (
    <GameShell accent={ACCENT}>
      <div
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage: `radial-gradient(circle, ${ACCENT} 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
          maskImage: "linear-gradient(to bottom, black, transparent 75%)",
        }}
      />

      <div
        className="relative mx-auto flex items-center justify-center"
        style={{ width: 280, height: 280, touchAction: "none" }}
        onPointerDown={startPress}
        onPointerUp={endPress}
        onPointerLeave={endPress}
        onPointerCancel={endPress}
      >
        {/* Breathing rings */}
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="pointer-events-none absolute inset-0 rounded-full border"
            style={{ borderColor: ACCENT }}
            animate={
              pressing
                ? { scale: [ringScale, ringScale + 0.4 + i * 0.1], opacity: [ringOpacity, 0] }
                : { scale: ringScale, opacity: ringOpacity * 0.3 }
            }
            transition={pressing ? { duration: 2.4 + i * 0.4, repeat: Infinity, ease: "easeOut" } : { duration: 0.4 }}
          />
        ))}

        <motion.div
          className="relative"
          animate={{
            scale: phase === "complete" ? 1.15 : breathScale,
            rotate: pressing ? [0, -1.5, 1.5, 0] : 0,
          }}
          transition={{
            scale: { type: "spring", stiffness: 110, damping: 14 },
            rotate: { duration: 2.2, repeat: pressing ? Infinity : 0, ease: "easeInOut" },
          }}
          style={{ filter: `drop-shadow(0 0 ${20 + progress * 0.4}px ${ACCENT}88)` }}
        >
          <Bear size={240} sadness={sadness} progress={progress} />
        </motion.div>

        {Array.from({ length: 12 }, (_, i) => (
          <Heart key={i} index={i} pressing={pressing && phase === "active"} />
        ))}

        {phase === "complete" && (
          <motion.span
            className="pointer-events-none absolute inset-0 rounded-full"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: [0, 1, 0], scale: [0.6, 2.2] }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            style={{ background: `radial-gradient(circle, ${ACCENT}cc, transparent 60%)` }}
          />
        )}
      </div>

      <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.32em]" style={{ color: ACCENT }}>
        {phase === "complete"
          ? "Si è sciolto"
          : pressing
            ? "Respira con me"
            : phase === "intro"
              ? "Un abbraccio curativo"
              : "Tienimi ancora"}
      </p>

      {phase !== "intro" && (
        <div className="relative mx-auto mt-4 w-56 sm:w-64">
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${ACCENT}, #fff5d6)` }}
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", stiffness: 80, damping: 18 }}
            />
          </div>
          <p className="mt-2 text-xs text-[#aaa3bc] min-h-[1.25rem]">
            {phase === "complete"
              ? "Grazie 💛"
              : progress < 30
                ? "Sentiti il peso dell'orsetto fra le braccia…"
                : progress < 70
                  ? "Respira lento. Anch'io mi sto rilassando."
                  : "Quasi. Ancora un po'."}
          </p>
        </div>
      )}

      {phase === "intro" && (
        <motion.button
          onPointerDown={startPress}
          onPointerUp={endPress}
          onPointerLeave={endPress}
          onPointerCancel={endPress}
          whileTap={{ scale: 0.96 }}
          className="relative z-10 mx-auto mt-7 inline-flex min-h-[56px] cursor-pointer touch-none items-center justify-center rounded-full px-8 text-base font-semibold text-[#1a1230]"
          style={{
            background: `linear-gradient(135deg, ${ACCENT}, #c79a2b)`,
            boxShadow: `0 0 36px ${ACCENT}66`,
          }}
        >
          <span className="mr-2">🤗</span>Tienimi stretto
        </motion.button>
      )}

      <AnimatePresence>
        {phase === "complete" && (
          <motion.div
            className="mx-auto mt-5 max-w-xs"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <svg viewBox="0 0 300 60" className="h-14 w-full" aria-label="Battito cardiaco">
              <motion.path
                d="M0 30 L60 30 L80 30 L95 12 L110 50 L125 18 L145 30 L300 30"
                fill="none"
                stroke={ACCENT}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                  pathLength: [0, 1, 1, 0, 1],
                  opacity: [0, 1, 1, 0.3, 1],
                }}
                transition={{
                  duration: 2.4,
                  times: [0, 0.5, 0.65, 0.8, 1],
                  repeat: Infinity,
                  repeatDelay: 0.3,
                }}
              />
            </svg>
            <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-white/40">
              il tuo cuore batte ancora
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </GameShell>
  );
}

/** Renders the body+face+expressions of the plush bear. */
function Bear({
  size = 220,
  sadness,
  progress,
}: {
  size?: number;
  sadness: number;
  progress: number;
}) {
  const eyeY = -8 + sadness * 6;
  const mouthCurve = 8 - sadness * 12; // frown → smile
  const eyeLid = 4 + sadness * 6;
  return (
    <svg viewBox="0 0 220 220" width={size} height={size} className="overflow-visible" aria-label="Orsetto di peluche">
      <defs>
        <radialGradient id="bearBody" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#f5d486" />
          <stop offset="60%" stopColor="#d9a851" />
          <stop offset="100%" stopColor="#8c6126" />
        </radialGradient>
        <radialGradient id="bearBelly" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#fbe5b1" />
          <stop offset="100%" stopColor="#e6c071" stopOpacity="0.4" />
        </radialGradient>
        <radialGradient id="cheekGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={ACCENT} stopOpacity={0.55 - sadness * 0.4} />
          <stop offset="100%" stopColor={ACCENT} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="62" cy="62" r="22" fill="url(#bearBody)" />
      <circle cx="158" cy="62" r="22" fill="url(#bearBody)" />
      <circle cx="62" cy="62" r="11" fill="#7a5020" />
      <circle cx="158" cy="62" r="11" fill="#7a5020" />
      <ellipse cx="110" cy="135" rx="78" ry="70" fill="url(#bearBody)" />
      <ellipse cx="110" cy="150" rx="52" ry="44" fill="url(#bearBelly)" />
      <circle cx="110" cy="92" r="58" fill="url(#bearBody)" />
      <ellipse cx="110" cy="105" rx="28" ry="22" fill="#fbe5b1" />
      <ellipse cx="110" cy="92" rx="7" ry="5" fill="#5a3a18" />
      <path
        d={`M110 96 Q110 ${96 + mouthCurve * 0.4} 110 ${100 + mouthCurve}`}
        stroke="#5a3a18"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d={`M96 ${110 + mouthCurve * 0.3} Q110 ${112 + mouthCurve} 124 ${110 + mouthCurve * 0.3}`}
        stroke="#5a3a18"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <g transform={`translate(0 ${eyeY})`}>
        <ellipse cx="85" cy="78" rx="7" ry={9 - eyeLid * 0.4} fill="#2a1a08" />
        <ellipse cx="135" cy="78" rx="7" ry={9 - eyeLid * 0.4} fill="#2a1a08" />
        <circle cx="87" cy="75" r="2" fill="#fff" opacity={1 - sadness * 0.7} />
        <circle cx="137" cy="75" r="2" fill="#fff" opacity={1 - sadness * 0.7} />
        {sadness > 0.7 && (
          <motion.path
            d="M85 88 Q82 102 85 110"
            stroke="#7ec9f0"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            animate={{ pathLength: [0, 1, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />
        )}
      </g>
      <circle cx="72" cy="100" r="14" fill="url(#cheekGlow)" />
      <circle cx="148" cy="100" r="14" fill="url(#cheekGlow)" />
      {/* Bow on head — brighter as progress fills */}
      <g transform="translate(110 32)" opacity={0.4 + (progress / 100) * 0.6}>
        <path d="M-14 0 Q-22 -10 -10 -6 Q0 -2 -10 6 Q-22 10 -14 0 Z" fill={ACCENT} />
        <path d="M14 0 Q22 -10 10 -6 Q0 -2 10 6 Q22 10 14 0 Z" fill={ACCENT} />
        <circle r="4" fill={ACCENT} />
      </g>
    </svg>
  );
}

function Heart({ index, pressing }: { index: number; pressing: boolean }) {
  const angle = (index / 12) * Math.PI * 2;
  const radius = 70 + (index % 3) * 18;
  return (
    <motion.span
      key={`${pressing}-${index}`}
      className="pointer-events-none absolute left-1/2 top-1/2 text-base sm:text-lg"
      style={{ color: ACCENT }}
      initial={{ x: 0, y: 0, opacity: 0, scale: 0.6, rotate: 0 }}
      animate={
        pressing
          ? {
              x: Math.cos(angle) * radius,
              y: Math.sin(angle) * radius - 20,
              opacity: [0, 1, 0],
              scale: [0.4, 1.1, 0.5],
              rotate: [0, index * 12],
            }
          : { opacity: 0 }
      }
      transition={
        pressing
          ? {
              duration: 1.6 + (index % 4) * 0.2,
              repeat: Infinity,
              delay: ((index % 6) * 0.25),
              ease: "easeOut",
            }
          : { duration: 0.2 }
      }
    >
      ♥
    </motion.span>
  );
}

function tryVibrate(pattern: number | number[]) {
  if (typeof navigator === "undefined" || typeof navigator.vibrate !== "function") return;
  try {
    navigator.vibrate(pattern);
  } catch {
    /* ignore */
  }
}
