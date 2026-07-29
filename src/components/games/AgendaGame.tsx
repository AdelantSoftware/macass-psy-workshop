"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameShell } from "./shared";
import type { GameProps } from "./shared";

interface Task {
  id: number;
  icon: string;
  category: string;
  text: string;
}

const INITIAL_TASKS: Task[] = [
  { id: 1, icon: "✉", category: "Posta",     text: "Rispondere a tutte le email" },
  { id: 2, icon: "□", category: "Riunione",  text: "Meeting che poteva essere una mail" },
  { id: 3, icon: "◷", category: "Scadenza",  text: "Finire tutto entro stasera" },
  { id: 4, icon: "☕", category: "Pausa",     text: "Un altro caffè di corsa" },
  { id: 5, icon: "⌁", category: "Chat",      text: "Essere sempre reperibile" },
];

const ACCENT = "#5A8FE8";

export function AgendaGame({ onReveal }: GameProps) {
  const [phase, setPhase] = useState<"intro" | "active" | "complete">("intro");
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [justRemoved, setJustRemoved] = useState<number | null>(null);
  const revealCalled = useRef(false);

  const remove = (id: number) => {
    if (phase !== "active" || !tasks.some((t) => t.id === id)) return;
    setJustRemoved(id);
    setTasks((previous) => {
      const next = previous.filter((t) => t.id !== id);
      if (next.length === 0) {
        setTimeout(() => setPhase("complete"), 350);
        if (!revealCalled.current) {
          revealCalled.current = true;
          setTimeout(onReveal, 2100);
        }
      }
      return next;
    });
    setTimeout(() => setJustRemoved(null), 500);
  };

  const freed = INITIAL_TASKS.length - tasks.length;

  return (
    <GameShell accent={ACCENT}>
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(#8ab2f5 1px, transparent 1px), linear-gradient(90deg, #8ab2f5 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <AnimatePresence mode="wait">
        {phase === "intro" ? (
          <motion.div
            key="intro"
            className="relative z-10 flex min-h-[395px] flex-col items-center justify-center text-center"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
          >
            <motion.div
              className="relative mb-7 h-28 w-24 rounded-xl border border-[#5A8FE8]/35 bg-[#171027] p-3 shadow-[0_18px_50px_rgba(0,0,0,0.3)]"
              animate={{ rotate: [-2, 2, -2] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="absolute -top-2 left-4 right-4 flex justify-between">
                {[0, 1, 2].map((ring) => (
                  <span key={ring} className="h-4 w-1 rounded-full bg-[#7fa9ef]" />
                ))}
              </div>
              <div className="mt-2 text-left text-[8px] uppercase tracking-[0.25em] text-[#5A8FE8]">
                Oggi
              </div>
              {[72, 52, 64, 44].map((width, index) => (
                <motion.div
                  key={width}
                  className="mt-3 h-1 rounded-full bg-white/15"
                  style={{ width: `${width}%` }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.2 + index * 0.12 }}
                />
              ))}
            </motion.div>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.34em] text-[#74a8ff]">
              Fai spazio
            </p>
            <h3 className="font-display text-3xl font-semibold">Non tutto è urgente.</h3>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#aaa4bc]">
              Scorri via ciò che oggi non ti serve. Cancellare può essere un gesto di cura.
            </p>
            <motion.button
              onClick={() => setPhase("active")}
              className="mt-8 min-h-12 rounded-full bg-[#5A8FE8] px-7 py-3 text-sm font-semibold text-white shadow-[0_0_30px_rgba(90,143,232,0.28)] cursor-pointer"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              Apri la mia agenda
            </motion.button>
          </motion.div>
        ) : phase === "active" ? (
          <motion.div
            key="active"
            className="relative z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
          >
            <div className="mb-5 flex items-end justify-between px-1">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#74a8ff]">
                  La tua giornata
                </p>
                <h3 className="mt-1 font-display text-2xl font-semibold">Cosa puoi lasciare?</h3>
              </div>
              <div className="text-right">
                <motion.span
                  key={freed}
                  className="block text-2xl font-semibold text-[#74a8ff]"
                  initial={{ scale: 1.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  {freed}
                </motion.span>
                <span className="text-[9px] uppercase tracking-widest text-[#8b85a0]">liberati</span>
              </div>
            </div>
            <p className="mb-4 px-1 text-xs text-[#9690aa]">
              Scorri a sinistra oppure tocca ×
            </p>
            <div className="space-y-3">
              <AnimatePresence initial={false}>
                {tasks.map((task) => (
                  <motion.div
                    key={task.id}
                    layout
                    className="relative overflow-hidden rounded-xl bg-[#5A8FE8]/20"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ x: -360, opacity: 0, rotate: -5, height: 0, marginBottom: 0 }}
                    transition={{
                      layout: { type: "spring", stiffness: 260, damping: 26 },
                      delay: 0.035 * tasks.findIndex((t) => t.id === task.id),
                    }}
                  >
                    <div className="absolute inset-y-0 right-0 flex w-24 items-center justify-center bg-[#5A8FE8] text-xs font-semibold uppercase tracking-wider text-white">
                      Lascia
                    </div>
                    <motion.div
                      drag="x"
                      dragConstraints={{ left: -120, right: 0 }}
                      dragElastic={0.08}
                      onDragEnd={(_, info) => {
                        if (info.offset.x < -75 || info.velocity.x < -500) remove(task.id);
                      }}
                      className="relative flex min-h-[64px] touch-pan-y items-center gap-3 border border-white/[0.08] bg-[#1a1230] px-3 py-2.5 shadow-[0_8px_20px_rgba(0,0,0,0.16)]"
                    >
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-[#5A8FE8]/25 bg-[#5A8FE8]/10 text-lg text-[#8ab4fb]">
                        {task.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#6f9de9]">
                          {task.category}
                        </p>
                        <p className="mt-1 truncate text-sm text-[#eeeaf5]">{task.text}</p>
                      </div>
                      <motion.button
                        onClick={() => remove(task.id)}
                        aria-label={`Cancella ${task.text}`}
                        className="grid h-12 w-12 shrink-0 cursor-pointer place-items-center rounded-full text-xl text-[#827c94] hover:bg-[#5A8FE8]/10 hover:text-[#8ab4fb]"
                        whileTap={{ scale: 0.82, rotate: 12 }}
                      >
                        ×
                      </motion.button>
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <AnimatePresence>
              {justRemoved !== null && (
                <motion.div
                  className="pointer-events-none absolute inset-x-0 bottom-3 text-center text-xs font-medium text-[#8ab4fb]"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  Un po&apos; di spazio in più ✦
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            key="complete"
            className="relative z-10 flex min-h-[395px] flex-col items-center justify-center text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="absolute h-56 w-56 rounded-full bg-[#5A8FE8]/20 blur-[55px]"
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1.25, opacity: 0.65 }}
              transition={{ duration: 1.1 }}
            />
            <motion.div
              className="relative mb-7 grid h-24 w-24 place-items-center rounded-full border border-[#7cafff]/40 bg-[#5A8FE8]/10"
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 180, damping: 13 }}
            >
              <svg viewBox="0 0 48 48" className="h-12 w-12 text-[#8ab4fb]" fill="none" aria-hidden="true">
                <path
                  d="M12 9h24a3 3 0 0 1 3 3v24a3 3 0 0 1-3 3H12a3 3 0 0 1-3-3V12a3 3 0 0 1 3-3Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <path
                  d="M16 24l5 5 11-12M16 5v8M32 5v8"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {[0, 1, 2, 3].map((index) => (
                <motion.span
                  key={index}
                  className="absolute h-1.5 w-1.5 rounded-full bg-[#8ab4fb]"
                  initial={{ x: 0, y: 0, opacity: 1 }}
                  animate={{ x: [0, -55 + index * 36], y: [0, index % 2 ? 55 : -55], opacity: 0 }}
                  transition={{ duration: 1, delay: 0.2 + index * 0.08 }}
                />
              ))}
            </motion.div>
            <motion.p
              className="text-[10px] font-semibold uppercase tracking-[0.34em] text-[#74a8ff]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Agenda libera
            </motion.p>
            <motion.h3
              className="mt-2 font-display text-4xl font-semibold"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42 }}
            >
              Il vuoto è tempo tuo.
            </motion.h3>
            <motion.p
              className="mt-3 max-w-xs text-sm leading-relaxed text-[#b2abc3]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Accettare significa anche scegliere cosa non portare con sé.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </GameShell>
  );
}
