/* refactored: tokens */
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameShell, type GameProps } from "./shared";
import { ProgressDots } from "@/components/ui/ProgressBar";

const ACCENT = "var(--color-accent-sage)";
const BEST_TIME_KEY = "macass.memory.best";

interface Concept {
  key: string;
  label: string;
  render: () => React.ReactElement;
}

const CONCEPTS: Concept[] = [
  { key: "star",     label: "Stella",   render: () => (<svg viewBox="0 0 64 64" className="h-12 w-12"><defs><radialGradient id="memStarA" cx="50%" cy="40%" r="60%"><stop offset="0%" stopColor="var(--color-tint-ochre-pale)" /><stop offset="100%" stopColor={ACCENT} /></radialGradient></defs><path d="M32 6 L39 25 L59 26 L43 39 L49 58 L32 47 L15 58 L21 39 L5 26 L25 25 Z" fill="url(#memStarA)" /></svg>) },
  { key: "moon",     label: "Luna",     render: () => (<svg viewBox="0 0 64 64" className="h-12 w-12"><defs><linearGradient id="memMoonA" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stopColor="var(--color-tint-lavender-pale)" /><stop offset="100%" stopColor="var(--color-tint-lavender-pale)" /></linearGradient></defs><path d="M44 14a22 22 0 1 0 0 36 18 18 0 0 1 0-36Z" fill="url(#memMoonA)" /></svg>) },
  { key: "flower",   label: "Fiore",    render: () => (<svg viewBox="0 0 64 64" className="h-12 w-12"><g transform="translate(32 32)">{[0, 60, 120, 180, 240, 300].map((deg) => <ellipse key={deg} cx="0" cy="-13" rx="6" ry="11" fill="var(--color-tint-clay-pale)" transform={`rotate(${deg})`} />)}<circle r="6" fill="var(--color-tint-ochre-pale)" /></g></svg>) },
  { key: "infinity", label: "Infinito", render: () => (<svg viewBox="0 0 64 64" className="h-12 w-12"><path d="M8 32c0-8 6-14 14-14s12 6 18 14 10 14 18 14 14-6 14-14-6-14-14-14-12 6-18 14-10 14-18 14S8 40 8 32Z" fill="none" stroke={ACCENT} strokeWidth="5" strokeLinecap="round" /></svg>) },
  { key: "lotus",    label: "Loto",     render: () => (<svg viewBox="0 0 64 64" className="h-12 w-12"><g transform="translate(32 40)" fill="var(--color-tint-clay-pale)"><path d="M0 0 Q-14 -4 -14 -16 Q-6 -10 0 -2 Z" /><path d="M0 0 Q-10 -10 -2 -22 Q4 -10 0 -2 Z" /><path d="M0 0 Q10 -10 2 -22 Q-4 -10 0 -2 Z" /><path d="M0 0 Q14 -4 14 -16 Q6 -10 0 -2 Z" /></g><circle cx="32" cy="40" r="3" fill="var(--color-tint-ochre-pale)" /></svg>) },
  { key: "spiral",   label: "Spirale",  render: () => (<svg viewBox="0 0 64 64" className="h-12 w-12"><path d="M32 32 m-22 0 a22 22 0 1 0 44 0 a18 18 0 1 1 -36 0 a14 14 0 1 0 28 0 a10 10 0 1 1 -20 0 a6 6 0 1 0 12 0" fill="none" stroke="var(--color-tint-ochre-pale)" strokeWidth="2.5" strokeLinecap="round" /></svg>) },
];

interface Card {
  id: number;
  key: string;
  label: string;
  flipped: boolean;
  matched: boolean;
}

const buildDeck = (): Card[] =>
  [...CONCEPTS, ...CONCEPTS]
    .map((c, i) => ({ id: i, key: c.key, label: c.label, flipped: false, matched: false }))
    .sort(() => Math.random() - 0.5);

const fmt = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

export function MemoryGame({ onReveal }: GameProps) {
  const [phase, setPhase] = useState<"preview" | "active" | "complete">("preview");
  // All cards start face-up for preview, flip after 1.7s
  const [deck, setDeck] = useState<Card[]>(() =>
    buildDeck().map((c) => ({ ...c, flipped: true })),
  );
  const [moves, setMoves] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [bestTime, setBestTime] = useState<number | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(BEST_TIME_KEY);
      return raw ? Number(raw) : null;
    } catch {
      return null;
    }
  });
  const revealCalled = useRef(false);
  const startTimeRef = useRef<number | null>(null);
  const selectedRef = useRef<number[]>([]);
  const deckRef = useRef<Card[]>(deck);
  deckRef.current = deck;

  // Preview → active after 1.7s — durability: usa ref per timestamp
  useEffect(() => {
    const id = setTimeout(() => {
      setDeck((prev) => {
        const next = prev.map((c) => ({ ...c, flipped: false }));
        return next;
      });
      setPhase("active");
      startTimeRef.current = Date.now();
    }, 1700);
    return () => clearTimeout(id);
  }, []);

  // Tick elapsed during active phase.
  useEffect(() => {
    if (phase !== "active") return;
    const id = window.setInterval(() => {
      if (startTimeRef.current !== null) {
        setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }
    }, 250);
    return () => clearInterval(id);
  }, [phase]);

  const finishWith = (finalElapsed: number) => {
    setPhase("complete");
    tryVibrate([30, 30, 60]);
    try {
      const raw = window.localStorage.getItem(BEST_TIME_KEY);
      const prev = raw ? Number(raw) : null;
      if (prev === null || finalElapsed < prev) {
        window.localStorage.setItem(BEST_TIME_KEY, String(finalElapsed));
        setBestTime(finalElapsed);
      }
    } catch {
      /* ignore */
    }
    if (!revealCalled.current) {
      revealCalled.current = true;
      setTimeout(onReveal, 5000);
    }
  };

  const flip = (id: number) => {
    if (phase !== "active") return;
    const card = deck[id];
    if (!card || card.flipped || card.matched) return;
    if (selectedRef.current.length === 2) return;

    const nextDeck = deck.map((c) => (c.id === id ? { ...c, flipped: true } : c));
    const nextSelected = [...selectedRef.current, id];
    selectedRef.current = nextSelected;
    setDeck(nextDeck);

    if (nextSelected.length === 2) {
      const nextMoves = moves + 1;
      setMoves(nextMoves);
      const [a, b] = nextSelected;
      const aCard = nextDeck[a];
      const bCard = nextDeck[b];
      const isMatch = aCard.key === bCard.key;
      window.setTimeout(() => {
        setDeck((prev) =>
          prev.map((c) =>
            c.id === a || c.id === b
              ? { ...c, flipped: isMatch ? true : false, matched: isMatch ? true : c.matched }
              : c,
          ),
        );
        selectedRef.current = [];
        if (isMatch && nextDeck.every((c) => c.matched || c.id === a || c.id === b)) {
          const finalElapsed = startTimeRef.current
            ? Math.floor((Date.now() - startTimeRef.current) / 1000)
            : elapsed;
          finishWith(finalElapsed);
        }
      }, isMatch ? 520 : 900);
    }
  };

  const reset = () => {
    setDeck(buildDeck());
    selectedRef.current = [];
    setMoves(0);
    setElapsed(0);
    setPhase("preview");
    revealCalled.current = false;
    startTimeRef.current = null;
  };

  const matchedCount = deck.filter((c) => c.matched).length / 2;

  return (
    <GameShell accent={ACCENT}>
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle, ${ACCENT} 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
          maskImage: "linear-gradient(to bottom, black, transparent 75%)",
        }}
      />

      {/* Status bar */}
      <div className="relative z-10 mb-4 flex items-center justify-between px-1 text-[10px] uppercase tracking-[0.28em]">
        <div className="flex items-center gap-2 text-[var(--color-tint-clay-mist)]">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: ACCENT, boxShadow: `0 0 8px ${ACCENT}` }}
          />
          <span>
            {phase === "preview" ? "Osserva" : phase === "complete" ? "Completo" : "Trova le coppie"}
          </span>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-[var(--color-tint-clay-text-soft)]">
          <span>
            ⏱ <span className="font-mono text-white/90">{fmt(elapsed)}</span>
          </span>
          <span>
            ↺ <span className="font-mono text-white/90">{moves}</span>
          </span>
        </div>
      </div>

      <ProgressDots total={6} filled={matchedCount} color={ACCENT} className="relative z-10 mb-4" />
      {bestTime !== null && phase !== "complete" && (
        <p className="relative z-10 mb-3 text-center text-[9px] uppercase tracking-[0.22em] text-white/40">
          record {fmt(bestTime)}
        </p>
      )}

      <div className="relative z-10 mx-auto grid max-w-xs grid-cols-4 gap-2.5 sm:max-w-sm sm:gap-3">
        <AnimatePresence>
          {phase === "complete" && (
            <motion.div
              key="confetti"
              className="absolute inset-0 z-30 grid place-items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Confetti />
            </motion.div>
          )}
        </AnimatePresence>
        {deck.map((card, i) => {
          const showFace = card.flipped || card.matched;
          const concept = CONCEPTS.find((c) => c.key === card.key);
          return (
            <motion.button
              key={card.id}
              layout
              onClick={() => flip(card.id)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="relative aspect-square cursor-pointer perspective-800"
              disabled={phase === "preview"}
              aria-label={`Carta ${card.label}`}
            >
              <motion.div
                className="relative h-full w-full transform-style-3d"
                animate={{
                  rotateY: showFace ? 0 : 180,
                  scale: card.matched ? [1, 1.08, 1] : 1,
                }}
                transition={{
                  rotateY: { duration: 0.55, ease: [0.4, 0, 0.2, 1] },
                  scale: { duration: 0.5 },
                }}
              >
                <div className="absolute inset-0 grid place-items-center rounded-xl border border-white/10 bg-gradient-to-br from-[var(--color-tint-ink-pale)] to-[var(--color-base-200)] backface-hidden rotate-y-180">
                  <CardBack />
                </div>
                <div
                  className="absolute inset-0 grid place-items-center rounded-xl border backface-hidden"
                  style={{
                    background: card.matched ? `${ACCENT}1f` : "var(--color-card-glass)",
                    borderColor: card.matched ? `${ACCENT}66` : "var(--color-on-dark-7)",
                    boxShadow: card.matched ? `0 0 18px ${ACCENT}55` : undefined,
                  }}
                >
                  {concept?.render()}
                </div>
              </motion.div>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {phase === "preview" ? (
          <motion.p
            key="preview"
            className="relative z-10 mt-4 text-xs uppercase tracking-[0.26em] text-[var(--color-tint-clay-text-soft)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, repeat: Infinity }}
          >
            Memorizza le posizioni
          </motion.p>
        ) : phase === "active" ? (
          <motion.div
            key="active"
            className="relative z-10 mt-4 flex items-center justify-center gap-2 text-xs text-[var(--color-tint-clay-mist)]"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <span>{matchedCount} di 6 coppie</span>
            <span className="text-white/25">·</span>
            <button
              onClick={reset}
              className="text-[10px] uppercase tracking-[0.22em] text-white/45 hover:text-white"
            >
              ricomincia
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="complete"
            className="relative z-10 mt-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p
              className="text-[10px] font-semibold uppercase tracking-[0.32em]"
              style={{ color: ACCENT }}
            >
              Hai ritrovato
            </p>
            <p className="mt-1 font-display text-2xl text-white">
              {fmt(elapsed)} <span className="text-sm text-[var(--color-tint-clay-text)]">· {moves} mosse</span>
            </p>
            {bestTime === elapsed && (
              <motion.p
                className="mt-1 text-xs"
                style={{ color: ACCENT }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                ✦ Nuovo record personale
              </motion.p>
            )}
            <motion.button
              onClick={reset}
              whileTap={{ scale: 0.96 }}
              className="mt-3 inline-flex min-h-[44px] items-center justify-center rounded-full border px-5 text-xs uppercase tracking-[0.22em]"
              style={{ borderColor: `${ACCENT}66`, color: ACCENT }}
            >
              Gioca ancora
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </GameShell>
  );
}

function CardBack() {
  return (
    <svg viewBox="0 0 64 64" className="h-12 w-12" aria-hidden="true">
      <defs>
        <radialGradient id="memBack" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor={ACCENT} stopOpacity="0.45" />
          <stop offset="100%" stopColor={ACCENT} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill="url(#memBack)" />
      <circle cx="32" cy="32" r="24" fill="none" stroke={ACCENT} strokeOpacity="0.55" strokeWidth="1" />
      <circle cx="32" cy="32" r="17" fill="none" stroke={ACCENT} strokeOpacity="0.35" strokeWidth="1" strokeDasharray="2 3" />
      {[0, 45, 90, 135].map((deg) => (
        <g key={deg} transform={`rotate(${deg} 32 32)`}>
          <ellipse cx="32" cy="14" rx="3" ry="7" fill={ACCENT} fillOpacity="0.7" />
        </g>
      ))}
      <circle cx="32" cy="32" r="5" fill={ACCENT} fillOpacity="0.85" />
      <circle cx="32" cy="32" r="2" fill="var(--color-base-100)" />
    </svg>
  );
}

function Confetti() {
  const colors = [ACCENT, "var(--color-tint-ochre-pale)", "var(--color-tint-clay-pale)", "var(--color-tint-clay-light)", "var(--color-tint-lavender-pale)"];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 36 }, (_, i) => {
        const angle = (i / 36) * Math.PI * 2;
        const radius = 60 + (i % 4) * 40;
        return (
          <motion.span
            key={i}
            className="absolute left-1/2 top-1/2 block h-2 w-1.5 rounded-sm"
            style={{ background: colors[i % colors.length] }}
            initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
            animate={{
              x: Math.cos(angle) * radius,
              y: Math.sin(angle) * radius + 40,
              opacity: [1, 1, 0],
              rotate: [0, 180 + i * 8],
            }}
            transition={{ duration: 1.6, ease: "easeOut", delay: i * 0.015 }}
          />
        );
      })}
    </div>
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
