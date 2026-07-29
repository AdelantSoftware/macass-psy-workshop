"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { STEPS } from "@/data/steps";
import { useProgress } from "@/hooks/useProgress";

function EmotionWheel({ onReveal }: { onReveal: () => void }) {
  const emotions = [
    { name: "Felicità", prompt: "Quale piccola cosa ti ha acceso un sorriso oggi?", color: "#ff9b7d" },
    { name: "Tristezza", prompt: "Di cosa avrebbe bisogno la tua tristezza, se potesse parlare?", color: "#c87986" },
    { name: "Rabbia", prompt: "Quale confine sta chiedendo di essere ascoltato?", color: "#ee5f55" },
    { name: "Paura", prompt: "Cosa cambierebbe se non dovessi affrontarla da solə?", color: "#9d657f" },
    { name: "Sorpresa", prompt: "Cosa non ti aspettavi di sentire proprio qui?", color: "#f4ad79" },
    { name: "Disgusto", prompt: "Da cosa il tuo corpo sta cercando di proteggerti?", color: "#b97068" },
    { name: "Serenità", prompt: "Dove senti questa quiete, adesso, nel tuo corpo?", color: "#e98d91" },
    { name: "Gratitudine", prompt: "A chi o a cosa vorresti dire grazie, in silenzio?", color: "#ff806a" },
  ];
  const [phase, setPhase] = useState<"intro" | "active" | "complete">("intro");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [rotation, setRotation] = useState(0);
  const revealCalled = useRef(false);

  const polar = (angle: number, radius = 47) => {
    const radians = (angle - 90) * Math.PI / 180;
    return { x: 50 + radius * Math.cos(radians), y: 50 + radius * Math.sin(radians) };
  };
  const sectorPath = (index: number) => {
    const start = polar(index * 45);
    const end = polar((index + 1) * 45);
    return `M 50 50 L ${start.x} ${start.y} A 47 47 0 0 1 ${end.x} ${end.y} Z`;
  };

  const spin = () => {
    const index = Math.floor(Math.random() * emotions.length);
    setSelectedIndex(index);
    setPhase("active");
    setRotation(2160 - index * 45 - 22.5);
  };

  const finishSpin = () => {
    if (phase !== "active" || selectedIndex === null) return;
    setPhase("complete");
    if (!revealCalled.current) {
      revealCalled.current = true;
      setTimeout(onReveal, 1800);
    }
  };

  const selected = selectedIndex === null ? null : emotions[selectedIndex];

  return (
    <div className="relative min-h-[430px] overflow-hidden rounded-[1.5rem] -m-4 p-5 sm:-m-6 sm:p-7 text-center"
      style={{ background: "radial-gradient(circle at 50% 35%, rgba(232,115,90,.16), transparent 54%), linear-gradient(180deg, rgba(255,255,255,.025), transparent)" }}>
      <div className="pointer-events-none absolute inset-0 opacity-25"
        style={{ backgroundImage: "radial-gradient(circle, #E8735A 1px, transparent 1px)", backgroundSize: "24px 24px", maskImage: "linear-gradient(to bottom, black, transparent 75%)" }} />

      <AnimatePresence mode="wait">
        {phase === "intro" ? (
          <motion.div key="intro" className="relative z-10 flex min-h-[390px] flex-col items-center justify-center"
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: .96 }}>
            <motion.div className="relative mb-7 grid h-28 w-28 place-items-center rounded-full border border-[#E8735A]/30"
              animate={{ boxShadow: ["0 0 0 0 rgba(232,115,90,.05)", "0 0 0 18px rgba(232,115,90,.08)", "0 0 0 0 rgba(232,115,90,.05)"] }}
              transition={{ duration: 3, repeat: Infinity }}>
              <div className="absolute inset-3 rounded-full border border-dashed border-[#E8735A]/50" />
              <svg viewBox="0 0 48 48" className="h-12 w-12 text-[#E8735A]" fill="none" aria-hidden="true">
                <path d="M24 39s-13-7.4-13-17.2C11 15.3 18.5 12 24 18c5.5-6 13-2.7 13 3.8C37 31.6 24 39 24 39Z" stroke="currentColor" strokeWidth="1.7" />
                <path d="M8 24h8l3-6 5 13 4-9 3 4h9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[.34em] text-[#E8735A]">Un momento per te</p>
            <h3 className="font-display text-3xl font-semibold text-white">Che cosa senti?</h3>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#a9a2bc]">Lascia che la ruota scelga una parola. Non serve giudicarla: basta ascoltarla.</p>
            <motion.button onClick={spin} className="mt-8 min-h-12 rounded-full bg-[#E8735A] px-7 py-3 text-sm font-semibold text-white shadow-[0_0_28px_rgba(232,115,90,.28)] cursor-pointer"
              whileHover={{ scale: 1.04, boxShadow: "0 0 38px rgba(232,115,90,.45)" }} whileTap={{ scale: .96 }}>
              Inizia ad ascoltare
            </motion.button>
          </motion.div>
        ) : (
          <motion.div key="wheel" className="relative z-10 flex min-h-[390px] flex-col items-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[.3em] text-[#E8735A]">
              {phase === "active" ? "Lascia andare il controllo" : "La ruota si è fermata su"}
            </p>
            <div className="relative h-[250px] w-[250px] sm:h-[280px] sm:w-[280px]">
              <motion.div className="absolute inset-1 rounded-full bg-[#E8735A]/20 blur-2xl"
                animate={phase === "complete" ? { scale: [1, 1.25, 1.08], opacity: [.25, .7, .35] } : { scale: [1, 1.08, 1], opacity: [.15, .3, .15] }}
                transition={{ duration: phase === "complete" ? .7 : 1.6, repeat: phase === "active" ? Infinity : 0 }} />
              <motion.div className="absolute inset-3" animate={{ rotate: rotation }} onAnimationComplete={finishSpin}
                transition={{ duration: 4.2, ease: [0.12, 0.72, 0.12, 1] }}>
                <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-[0_14px_24px_rgba(0,0,0,.38)]" aria-label="Ruota delle emozioni">
                  <circle cx="50" cy="50" r="49" fill="#160f27" stroke="rgba(255,255,255,.15)" strokeWidth="1" />
                  {emotions.map((emotion, index) => (
                    <path key={emotion.name} d={sectorPath(index)} fill={emotion.color}
                      opacity={phase === "complete" && index !== selectedIndex ? .3 : 1}
                      stroke="#24152d" strokeWidth=".65" />
                  ))}
                  <circle cx="50" cy="50" r="12" fill="#160f27" stroke="rgba(255,255,255,.28)" strokeWidth="1" />
                  <circle cx="50" cy="50" r="4" fill="#E8735A" />
                </svg>
              </motion.div>
              <motion.div className="absolute left-1/2 top-0 z-20 -translate-x-1/2"
                animate={phase === "active" ? { y: [0, 4, 0] } : { y: 0 }} transition={{ duration: .18, repeat: phase === "active" ? Infinity : 0 }}>
                <div className="h-0 w-0 border-x-[12px] border-t-[22px] border-x-transparent border-t-white drop-shadow-[0_3px_8px_rgba(255,255,255,.45)]" />
              </motion.div>
              {phase === "complete" && Array.from({ length: 12 }).map((_, index) => (
                <motion.span key={index} className="absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full bg-[#E8735A]"
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{ x: Math.cos(index * Math.PI / 6) * 145, y: Math.sin(index * Math.PI / 6) * 145, opacity: 0, scale: 0 }}
                  transition={{ duration: .9, ease: "easeOut" }} />
              ))}
            </div>
            <AnimatePresence mode="wait">
              {phase === "active" ? (
                <motion.p key="listening" className="mt-3 text-sm italic text-[#a9a2bc]" initial={{ opacity: 0 }} animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.4 }}>Ascolta quello che emerge…</motion.p>
              ) : selected ? (
                <motion.div key="result" className="mt-2" initial={{ opacity: 0, y: 14, scale: .92 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 18 }}>
                  <h3 className="font-display text-4xl font-semibold text-[#ff9b87]">{selected.name}</h3>
                  <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-[#d1cadf]">{selected.prompt}</p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AgendaGame({ onReveal }: { onReveal: () => void }) {
  const initialTasks = [
    { id: 1, icon: "✉", category: "Posta", text: "Rispondere a tutte le email" },
    { id: 2, icon: "□", category: "Riunione", text: "Meeting che poteva essere una mail" },
    { id: 3, icon: "◷", category: "Scadenza", text: "Finire tutto entro stasera" },
    { id: 4, icon: "☕", category: "Pausa", text: "Un altro caffè di corsa" },
    { id: 5, icon: "⌁", category: "Chat", text: "Essere sempre reperibile" },
  ];
  const [phase, setPhase] = useState<"intro" | "active" | "complete">("intro");
  const [tasks, setTasks] = useState(initialTasks);
  const [justRemoved, setJustRemoved] = useState<number | null>(null);
  const revealCalled = useRef(false);

  const remove = (id: number) => {
    if (phase !== "active" || !tasks.some(task => task.id === id)) return;
    setJustRemoved(id);
    setTasks(previous => {
      const next = previous.filter(task => task.id !== id);
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

  const freed = initialTasks.length - tasks.length;

  return (
    <div className="relative min-h-[460px] overflow-hidden rounded-[1.5rem] -m-4 p-4 sm:-m-6 sm:p-6"
      style={{ background: "linear-gradient(145deg, rgba(90,143,232,.13), rgba(26,18,48,.2) 48%, rgba(90,143,232,.06))" }}>
      <div className="pointer-events-none absolute inset-0 opacity-[.08]"
        style={{ backgroundImage: "linear-gradient(#8ab2f5 1px, transparent 1px), linear-gradient(90deg, #8ab2f5 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
      <AnimatePresence mode="wait">
        {phase === "intro" ? (
          <motion.div key="intro" className="relative z-10 flex min-h-[425px] flex-col items-center justify-center text-center"
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
            <motion.div className="relative mb-7 h-28 w-24 rounded-xl border border-[#5A8FE8]/35 bg-[#171027] p-3 shadow-[0_18px_50px_rgba(0,0,0,.3)]"
              animate={{ rotate: [-2, 2, -2] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
              <div className="absolute -top-2 left-4 right-4 flex justify-between">
                {[0, 1, 2].map(ring => <span key={ring} className="h-4 w-1 rounded-full bg-[#7fa9ef]" />)}
              </div>
              <div className="mt-2 text-left text-[8px] uppercase tracking-[.25em] text-[#5A8FE8]">Oggi</div>
              {[72, 52, 64, 44].map((width, index) => <motion.div key={width} className="mt-3 h-1 rounded-full bg-white/15" style={{ width: `${width}%` }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: .2 + index * .12 }} />)}
            </motion.div>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[.34em] text-[#74a8ff]">Fai spazio</p>
            <h3 className="font-display text-3xl font-semibold">Non tutto è urgente.</h3>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#aaa4bc]">Scorri via ciò che oggi non ti serve. Cancellare può essere un gesto di cura.</p>
            <motion.button onClick={() => setPhase("active")}
              className="mt-8 min-h-12 rounded-full bg-[#5A8FE8] px-7 py-3 text-sm font-semibold text-white shadow-[0_0_30px_rgba(90,143,232,.28)] cursor-pointer"
              whileHover={{ scale: 1.04 }} whileTap={{ scale: .96 }}>
              Apri la mia agenda
            </motion.button>
          </motion.div>
        ) : phase === "active" ? (
          <motion.div key="active" className="relative z-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: .96 }}>
            <div className="mb-5 flex items-end justify-between px-1">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[.28em] text-[#74a8ff]">La tua giornata</p>
                <h3 className="mt-1 font-display text-2xl font-semibold">Cosa puoi lasciare?</h3>
              </div>
              <div className="text-right">
                <motion.span key={freed} className="block text-2xl font-semibold text-[#74a8ff]" initial={{ scale: 1.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>{freed}</motion.span>
                <span className="text-[9px] uppercase tracking-widest text-[#8b85a0]">liberati</span>
              </div>
            </div>
            <p className="mb-4 px-1 text-xs text-[#9690aa]">Scorri a sinistra oppure tocca ×</p>
            <div className="space-y-3">
              <AnimatePresence initial={false}>
                {tasks.map((task, index) => (
                  <motion.div key={task.id} layout className="relative overflow-hidden rounded-xl bg-[#5A8FE8]/20"
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ x: -360, opacity: 0, rotate: -5, height: 0, marginBottom: 0 }}
                    transition={{ layout: { type: "spring", stiffness: 260, damping: 26 }, delay: index * .035 }}>
                    <div className="absolute inset-y-0 right-0 flex w-24 items-center justify-center bg-[#5A8FE8] text-xs font-semibold uppercase tracking-wider text-white">Lascia</div>
                    <motion.div drag="x" dragConstraints={{ left: -120, right: 0 }} dragElastic={.08}
                      onDragEnd={(_, info) => { if (info.offset.x < -75 || info.velocity.x < -500) remove(task.id); }}
                      className="relative flex min-h-[64px] touch-pan-y items-center gap-3 border border-white/[.08] bg-[#1a1230] px-3 py-2.5 shadow-[0_8px_20px_rgba(0,0,0,.16)]"
                      style={{ clipPath: "polygon(0 0, 100% 0, 100% 88%, 97% 94%, 94% 89%, 91% 96%, 88% 90%, 85% 100%, 82% 91%, 78% 96%, 74% 90%, 70% 100%, 66% 91%, 62% 97%, 58% 90%, 54% 100%, 50% 92%, 46% 98%, 42% 91%, 38% 100%, 34% 92%, 30% 98%, 26% 90%, 22% 99%, 18% 92%, 14% 98%, 10% 91%, 6% 97%, 3% 91%, 0 96%)" }}>
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-[#5A8FE8]/25 bg-[#5A8FE8]/10 text-lg text-[#8ab4fb]">{task.icon}</div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[9px] font-semibold uppercase tracking-[.22em] text-[#6f9de9]">{task.category}</p>
                        <p className="mt-1 truncate text-sm text-[#eeeaf5]">{task.text}</p>
                      </div>
                      <motion.button onClick={() => remove(task.id)} aria-label={`Cancella ${task.text}`}
                        className="grid h-12 w-12 shrink-0 cursor-pointer place-items-center rounded-full text-xl text-[#827c94] hover:bg-[#5A8FE8]/10 hover:text-[#8ab4fb]"
                        whileTap={{ scale: .82, rotate: 12 }}>×</motion.button>
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <AnimatePresence>
              {justRemoved !== null && (
                <motion.div className="pointer-events-none absolute inset-x-0 bottom-3 text-center text-xs font-medium text-[#8ab4fb]"
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>Un po’ di spazio in più ✦</motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div key="complete" className="relative z-10 flex min-h-[425px] flex-col items-center justify-center text-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <motion.div className="absolute h-56 w-56 rounded-full bg-[#5A8FE8]/20 blur-[55px]"
              initial={{ scale: .4, opacity: 0 }} animate={{ scale: 1.25, opacity: .65 }} transition={{ duration: 1.1 }} />
            <motion.div className="relative mb-7 grid h-24 w-24 place-items-center rounded-full border border-[#7cafff]/40 bg-[#5A8FE8]/10"
              initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 180, damping: 13 }}>
              <svg viewBox="0 0 48 48" className="h-12 w-12 text-[#8ab4fb]" fill="none" aria-hidden="true">
                <path d="M12 9h24a3 3 0 0 1 3 3v24a3 3 0 0 1-3 3H12a3 3 0 0 1-3-3V12a3 3 0 0 1 3-3Z" stroke="currentColor" strokeWidth="1.6" />
                <path d="M16 24l5 5 11-12M16 5v8M32 5v8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {[0, 1, 2, 3].map(index => <motion.span key={index} className="absolute h-1.5 w-1.5 rounded-full bg-[#8ab4fb]" initial={{ x: 0, y: 0, opacity: 1 }} animate={{ x: [0, -55 + index * 36], y: [0, index % 2 ? 55 : -55], opacity: 0 }} transition={{ duration: 1, delay: .2 + index * .08 }} />)}
            </motion.div>
            <motion.p className="text-[10px] font-semibold uppercase tracking-[.34em] text-[#74a8ff]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .3 }}>Agenda libera</motion.p>
            <motion.h3 className="mt-2 font-display text-4xl font-semibold" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .42 }}>Il vuoto è tempo tuo.</motion.h3>
            <motion.p className="mt-3 max-w-xs text-sm leading-relaxed text-[#b2abc3]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .6 }}>Accettare significa anche scegliere cosa non portare con sé.</motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function HugGame({ onReveal }: { onReveal: () => void }) {
  const accent = "#E8C85A";
  const [phase, setPhase] = useState<"intro" | "active" | "complete">("intro");
  const [pressing, setPressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [breath, setBreath] = useState(0); // 0..1 cycle
  const revealCalled = useRef(false);
  const rafRef = useRef<number | null>(null);
  const lastTickRef = useRef<number | null>(null);
  const breathStartRef = useRef<number | null>(null);
  const vibrateRef = useRef<number | null>(null);

  // Smooth progress driven by press state, on a single rAF loop.
  useEffect(() => {
    const loop = (now: number) => {
      if (lastTickRef.current === null) lastTickRef.current = now;
      const dt = Math.min(64, now - lastTickRef.current);
      lastTickRef.current = now;
      if (pressing && phase === "active") {
        setProgress(p => Math.min(100, p + dt * 0.045));
        if (breathStartRef.current === null) breathStartRef.current = now;
        const elapsed = (now - breathStartRef.current) / 1000;
        // 4 second breathing cycle (inhale 2s, exhale 2s) — slower while filling.
        setBreath((Math.sin((elapsed / 4) * Math.PI * 2 - Math.PI / 2) + 1) / 2);
      } else {
        breathStartRef.current = null;
        // gentle breath drift when idle
        setBreath(b => (b + dt * 0.0008) % 1);
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

  // Completion transition
  useEffect(() => {
    if (progress >= 100 && phase === "active") {
      setPhase("complete");
      setPressing(false);
      if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
        try { navigator.vibrate([40, 30, 80, 30, 140]); } catch {}
      }
      if (!revealCalled.current) {
        revealCalled.current = true;
        setTimeout(onReveal, 2400);
      }
    }
  }, [progress, phase, onReveal]);

  // Light haptic tick on press start
  const startPress = () => {
    if (phase === "complete") return;
    if (phase === "intro") setPhase("active");
    setPressing(true);
    if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
      try { navigator.vibrate(20); } catch {}
      vibrateRef.current = window.setInterval(() => {
        try { navigator.vibrate(12); } catch {}
      }, 1100);
    }
  };
  const endPress = () => {
    setPressing(false);
    if (vibrateRef.current !== null) {
      clearInterval(vibrateRef.current);
      vibrateRef.current = null;
    }
  };
  useEffect(() => () => {
    if (vibrateRef.current !== null) clearInterval(vibrateRef.current);
  }, []);

  const sadness = 1 - progress / 100; // 1=sad, 0=joy
  const breathScale = 0.94 + breath * 0.12; // breathing of bear
  const ringScale = 0.7 + breath * 0.6;
  const ringOpacity = 0.15 + breath * 0.4;

  // SVG teddy bear — expression shifts with sadness level
  const Bear = ({ size = 220 }: { size?: number }) => {
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
            <stop offset="0%" stopColor={accent} stopOpacity={0.55 - sadness * 0.4} />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* ears */}
        <circle cx="62" cy="62" r="22" fill="url(#bearBody)" />
        <circle cx="158" cy="62" r="22" fill="url(#bearBody)" />
        <circle cx="62" cy="62" r="11" fill="#7a5020" />
        <circle cx="158" cy="62" r="11" fill="#7a5020" />
        {/* arms wrapped around (visible while hugging) */}
        {pressing && (
          <g>
            <path d="M30 130 Q-10 150 18 188 Q35 198 56 178" fill="url(#bearBody)" stroke="#7a5020" strokeOpacity="0.35" strokeWidth="1.5" />
            <path d="M190 130 Q230 150 202 188 Q185 198 164 178" fill="url(#bearBody)" stroke="#7a5020" strokeOpacity="0.35" strokeWidth="1.5" />
            {/* little arms in front */}
            <path d="M55 168 Q70 195 110 195 Q150 195 165 168" fill="url(#bearBelly)" stroke="#b88840" strokeOpacity="0.5" strokeWidth="1.2" />
          </g>
        )}
        {/* body */}
        <ellipse cx="110" cy="135" rx="78" ry="70" fill="url(#bearBody)" />
        {/* belly */}
        <ellipse cx="110" cy="150" rx="52" ry="44" fill="url(#bearBelly)" />
        {/* head */}
        <circle cx="110" cy="92" r="58" fill="url(#bearBody)" />
        {/* muzzle */}
        <ellipse cx="110" cy="105" rx="28" ry="22" fill="#fbe5b1" />
        {/* nose */}
        <ellipse cx="110" cy="92" rx="7" ry="5" fill="#5a3a18" />
        <path d={`M110 96 Q110 ${96 + mouthCurve * 0.4} 110 ${100 + mouthCurve}`} stroke="#5a3a18" strokeWidth="2" strokeLinecap="round" fill="none" />
        {/* mouth */}
        <path d={`M96 ${110 + mouthCurve * 0.3} Q110 ${112 + mouthCurve} 124 ${110 + mouthCurve * 0.3}`} stroke="#5a3a18" strokeWidth="2" strokeLinecap="round" fill="none" />
        {/* eyes */}
        <g transform={`translate(0 ${eyeY})`}>
          <ellipse cx="85" cy="78" rx="7" ry={9 - eyeLid * 0.4} fill="#2a1a08" />
          <ellipse cx="135" cy="78" rx="7" ry={9 - eyeLid * 0.4} fill="#2a1a08" />
          {/* sparkle */}
          <circle cx="87" cy="75" r="2" fill="#fff" opacity={1 - sadness * 0.7} />
          <circle cx="137" cy="75" r="2" fill="#fff" opacity={1 - sadness * 0.7} />
          {/* tear when very sad */}
          {sadness > 0.7 && <motion.path d="M85 88 Q82 102 85 110" stroke="#7ec9f0" strokeWidth="2" strokeLinecap="round" fill="none" animate={{ pathLength: [0, 1, 0], opacity: [0, 1, 0] }} transition={{ duration: 2.5, repeat: Infinity }} />}
        </g>
        {/* cheeks */}
        <circle cx="72" cy="100" r="14" fill="url(#cheekGlow)" />
        <circle cx="148" cy="100" r="14" fill="url(#cheekGlow)" />
        {/* bow on head (becomes brighter as progress fills) */}
        <g transform="translate(110 32)" opacity={0.4 + progress / 100 * 0.6}>
          <path d="M-14 0 Q-22 -10 -10 -6 Q0 -2 -10 6 Q-22 10 -14 0 Z" fill={accent} />
          <path d="M14 0 Q22 -10 10 -6 Q0 -2 10 6 Q22 10 14 0 Z" fill={accent} />
          <circle r="4" fill={accent} />
        </g>
      </svg>
    );
  };

  const Heart = ({ index }: { index: number }) => {
    const angle = (index / 12) * Math.PI * 2;
    const radius = 70 + (index % 3) * 18;
    return (
      <motion.span
        key={`${pressing}-${index}`}
        className="pointer-events-none absolute left-1/2 top-1/2 text-base sm:text-lg"
        style={{ color: accent }}
        initial={{ x: 0, y: 0, opacity: 0, scale: 0.6, rotate: 0 }}
        animate={pressing && phase === "active" ? {
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius - 20,
          opacity: [0, 1, 0],
          scale: [0.4, 1.1, 0.5],
          rotate: [0, index * 12]
        } : { opacity: 0 }}
        transition={pressing && phase === "active" ? {
          duration: 1.6 + (index % 4) * 0.2,
          repeat: Infinity,
          delay: (index % 6) * 0.25,
          ease: "easeOut"
        } : { duration: 0.2 }}
      >
        ♥
      </motion.span>
    );
  };

  if (phase === "intro") {
    return (
      <div className="relative overflow-hidden rounded-[1.5rem] -m-4 p-5 sm:-m-6 sm:p-7 text-center"
        style={{ background: `radial-gradient(circle at 50% 35%, ${accent}22, transparent 55%), linear-gradient(180deg, rgba(255,255,255,.03), transparent)` }}>
        <div className="pointer-events-none absolute inset-0 opacity-25"
          style={{ backgroundImage: `radial-gradient(circle, ${accent} 1px, transparent 1px)`, backgroundSize: "24px 24px", maskImage: "linear-gradient(to bottom, black, transparent 75%)" }} />
        <motion.div className="relative z-10 mx-auto my-4 flex items-center justify-center"
          style={{ width: 180, height: 180 }}
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}>
          <motion.div className="absolute inset-0 rounded-full"
            animate={{ scale: [1, 1.18, 1], opacity: [0.18, 0.32, 0.18] }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{ background: `radial-gradient(circle, ${accent}55 0%, transparent 65%)` }} />
          <Bear size={180} />
        </motion.div>
        <p className="text-[10px] font-semibold uppercase tracking-[.34em]" style={{ color: accent }}>Un abbraccio curativo</p>
        <h3 className="mt-2 font-display text-3xl font-semibold text-white">Stringimi forte.</h3>
        <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-[#aaa3bc]">Tieni premuto sull'orsetto per qualche secondo. Più ti fermi, più si scioglie.</p>
        <motion.div
          onPointerDown={startPress}
          onPointerUp={endPress}
          onPointerLeave={endPress}
          onPointerCancel={endPress}
          whileTap={{ scale: 0.96 }}
          className="relative z-10 mx-auto mt-7 inline-flex min-h-[56px] cursor-pointer touch-none items-center justify-center rounded-full px-8 text-base font-semibold text-[#1a1230]"
          style={{ background: `linear-gradient(135deg, ${accent}, #c79a2b)`, boxShadow: `0 0 36px ${accent}66` }}>
          <span className="mr-2">🤗</span>Tienimi stretto
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-[1.5rem] -m-4 p-5 sm:-m-6 sm:p-7 text-center"
      style={{ background: `radial-gradient(circle at 50% 50%, ${accent}${Math.round(20 + progress * 0.25).toString(16).padStart(2, "0")}, transparent 60%), linear-gradient(180deg, rgba(255,255,255,.03), transparent)` }}>
      <div className="pointer-events-none absolute inset-0 opacity-25"
        style={{ backgroundImage: `radial-gradient(circle, ${accent} 1px, transparent 1px)`, backgroundSize: "24px 24px", maskImage: "linear-gradient(to bottom, black, transparent 75%)" }} />

      <div className="relative mx-auto flex items-center justify-center"
        style={{ width: 280, height: 280, touchAction: "none" }}
        onPointerDown={startPress}
        onPointerUp={endPress}
        onPointerLeave={endPress}
        onPointerCancel={endPress}>
        {/* Breathing rings */}
        {[0, 1, 2].map(i => (
          <motion.span
            key={i}
            className="pointer-events-none absolute inset-0 rounded-full border"
            style={{ borderColor: accent }}
            animate={pressing ? {
              scale: [ringScale, ringScale + 0.4 + i * 0.1],
              opacity: [ringOpacity, 0]
            } : { scale: ringScale, opacity: ringOpacity * 0.3 }}
            transition={pressing ? { duration: 2.4 + i * 0.4, repeat: Infinity, ease: "easeOut" } : { duration: 0.4 }} />
        ))}
        {/* Bear */}
        <motion.div className="relative"
          animate={{
            scale: phase === "complete" ? 1.15 : breathScale,
            rotate: pressing ? [0, -1.5, 1.5, 0] : 0
          }}
          transition={{
            scale: { type: "spring", stiffness: 110, damping: 14 },
            rotate: { duration: 2.2, repeat: pressing ? Infinity : 0, ease: "easeInOut" }
          }}
          style={{ filter: `drop-shadow(0 0 ${20 + progress * 0.4}px ${accent}88)` }}>
          <Bear size={240} />
        </motion.div>
        {/* Hearts */}
        {Array.from({ length: 12 }).map((_, i) => <Heart key={i} index={i} />)}
        {/* Completion glow burst */}
        {phase === "complete" && (
          <motion.span
            className="pointer-events-none absolute inset-0 rounded-full"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: [0, 1, 0], scale: [0.6, 2.2] }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            style={{ background: `radial-gradient(circle, ${accent}cc, transparent 60%)` }} />
        )}
      </div>

      <p className="mt-2 text-[10px] font-semibold uppercase tracking-[.32em]" style={{ color: accent }}>
        {phase === "complete" ? "Si è sciolto" : pressing ? "Respira con me" : "Tienimi ancora"}
      </p>

      <div className="relative mx-auto mt-4 w-56 sm:w-64">
        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${accent}, #fff5d6)` }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 80, damping: 18 }} />
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

      {/* Heartbeat line at completion */}
      <AnimatePresence>
        {phase === "complete" && (
          <motion.div
            className="mx-auto mt-5 max-w-xs"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}>
            <svg viewBox="0 0 300 60" className="h-14 w-full" aria-label="Battito cardiaco">
              <motion.path
                d="M0 30 L60 30 L80 30 L95 12 L110 50 L125 18 L145 30 L300 30"
                fill="none"
                stroke={accent}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: [0, 1, 1, 0, 1], opacity: [0, 1, 1, 0.3, 1] }}
                transition={{ duration: 2.4, times: [0, 0.5, 0.65, 0.8, 1], repeat: Infinity, repeatDelay: 0.3 }} />
            </svg>
            <p className="mt-1 text-[10px] uppercase tracking-[.3em] text-white/40">il tuo cuore batte ancora</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MemoryGame({ onReveal }: { onReveal: () => void }) {
  const accent = "#5AE89E";
  // 6 abstract concepts, drawn as styled SVG inside the cards
  const concepts: Array<{ key: string; label: string; render: () => React.ReactElement }> = [
    { key: "star",    label: "Stella",   render: () => (<svg viewBox="0 0 64 64" className="h-12 w-12"><path d="M32 6 L39 25 L59 26 L43 39 L49 58 L32 47 L15 58 L21 39 L5 26 L25 25 Z" fill="url(#memStarA)" /><defs><radialGradient id="memStarA" cx="50%" cy="40%" r="60%"><stop offset="0%" stopColor="#fff5d6" /><stop offset="100%" stopColor="#5AE89E" /></radialGradient></defs></svg>) },
    { key: "moon",    label: "Luna",     render: () => (<svg viewBox="0 0 64 64" className="h-12 w-12"><path d="M44 14a22 22 0 1 0 0 36 18 18 0 0 1 0-36Z" fill="url(#memMoonA)" /><defs><linearGradient id="memMoonA" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stopColor="#c8baff" /><stop offset="100%" stopColor="#7a5ad9" /></linearGradient></defs></svg>) },
    { key: "flower",  label: "Fiore",    render: () => (<svg viewBox="0 0 64 64" className="h-12 w-12"><g transform="translate(32 32)">{[0, 60, 120, 180, 240, 300].map(deg => <ellipse key={deg} cx="0" cy="-13" rx="6" ry="11" fill="#ff9bcc" transform={`rotate(${deg})`} />)}<circle r="6" fill="#ffd98a" /></g></svg>) },
    { key: "infinity",label: "Infinito", render: () => (<svg viewBox="0 0 64 64" className="h-12 w-12"><path d="M8 32c0-8 6-14 14-14s12 6 18 14 10 14 18 14 14-6 14-14-6-14-14-14-12 6-18 14-10 14-18 14S8 40 8 32Z" fill="none" stroke="#5AE89E" strokeWidth="5" strokeLinecap="round" /></svg>) },
    { key: "lotus",   label: "Loto",     render: () => (<svg viewBox="0 0 64 64" className="h-12 w-12"><g transform="translate(32 40)" fill="#ffb3d9"><path d="M0 0 Q-14 -4 -14 -16 Q-6 -10 0 -2 Z" /><path d="M0 0 Q-10 -10 -2 -22 Q4 -10 0 -2 Z" /><path d="M0 0 Q10 -10 2 -22 Q-4 -10 0 -2 Z" /><path d="M0 0 Q14 -4 14 -16 Q6 -10 0 -2 Z" /></g><circle cx="32" cy="40" r="3" fill="#fff5d6" /></svg>) },
    { key: "spiral",  label: "Spirale",  render: () => (<svg viewBox="0 0 64 64" className="h-12 w-12"><path d="M32 32 m-22 0 a22 22 0 1 0 44 0 a18 18 0 1 1 -36 0 a14 14 0 1 0 28 0 a10 10 0 1 1 -20 0 a6 6 0 1 0 12 0" fill="none" stroke="#ffd98a" strokeWidth="2.5" strokeLinecap="round" /></svg>) },
  ];

  const buildDeck = () => {
    const pairs = [...concepts, ...concepts]
      .map((c, i) => ({ id: i, key: c.key, label: c.label, flipped: false, matched: false }))
      .sort(() => Math.random() - 0.5);
    return pairs;
  };

  const STORAGE_KEY = "macass.memory.best";
  type Card = { id: number; key: string; label: string; flipped: boolean; matched: boolean };
  const [phase, setPhase] = useState<"preview" | "active" | "complete">("preview");
  const [deck, setDeck] = useState<Card[]>(() => buildDeck());
  const [selected, setSelected] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const revealCalled = useRef(false);
  const startTimeRef = useRef<number | null>(null);

  // Load best time on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setBestTime(Number(raw));
    } catch {}
  }, []);

  // Preview phase → active after 1.6s
  useEffect(() => {
    if (phase !== "preview") return;
    const t = window.setTimeout(() => {
      setDeck(prev => prev.map(c => ({ ...c, flipped: false })));
      setPhase("active");
      startTimeRef.current = Date.now();
    }, 1700);
    // set all to flipped for preview
    setDeck(prev => prev.map(c => ({ ...c, flipped: true })));
    return () => clearTimeout(t);
  }, [phase]);

  // Timer during active
  useEffect(() => {
    if (phase !== "active") return;
    const id = window.setInterval(() => {
      if (startTimeRef.current !== null) setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 250);
    return () => clearInterval(id);
  }, [phase]);

  const finishWith = (finalMoves: number, finalElapsed: number) => {
    setPhase("complete");
    if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
      try { navigator.vibrate([30, 30, 60]); } catch {}
    }
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const prev = raw ? Number(raw) : null;
      if (prev === null || finalElapsed < prev) {
        window.localStorage.setItem(STORAGE_KEY, String(finalElapsed));
        setBestTime(finalElapsed);
      }
    } catch {}
    if (!revealCalled.current) {
      revealCalled.current = true;
      setTimeout(onReveal, 2200);
    }
    // mark moves in the dependency so closure knows latest
    void finalMoves;
  };

  const flip = (id: number) => {
    if (phase !== "active") return;
    const card = deck[id];
    if (!card || card.flipped || card.matched) return;
    if (selected.length === 2) return;

    const nextDeck = deck.map(c => (c.id === id ? { ...c, flipped: true } : c));
    const nextSelected = [...selected, id];
    setDeck(nextDeck);
    setSelected(nextSelected);

    if (nextSelected.length === 2) {
      const nextMoves = moves + 1;
      setMoves(nextMoves);
      const [a, b] = nextSelected;
      const aCard = nextDeck[a];
      const bCard = nextDeck[b];
      const isMatch = aCard.key === bCard.key;
      window.setTimeout(() => {
        setDeck(prev => prev.map(c => (c.id === a || c.id === b ? { ...c, flipped: isMatch ? true : false, matched: isMatch ? true : c.matched } : c)));
        setSelected([]);
        if (isMatch && nextDeck.every(c => c.matched || c.id === a || c.id === b)) {
          const finalElapsed = startTimeRef.current ? Math.floor((Date.now() - startTimeRef.current) / 1000) : elapsed;
          finishWith(nextMoves, finalElapsed);
        }
      }, isMatch ? 520 : 900);
    }
  };

  const reset = () => {
    setDeck(buildDeck());
    setSelected([]);
    setMoves(0);
    setElapsed(0);
    setPhase("preview");
    revealCalled.current = false;
    startTimeRef.current = null;
  };

  const fmt = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  // Card back SVG: workshop mandala — a small lotus + concentric circles
  const CardBack = () => (
    <svg viewBox="0 0 64 64" className="h-12 w-12" aria-hidden="true">
      <defs>
        <radialGradient id="memBack" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.45" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill="url(#memBack)" />
      <circle cx="32" cy="32" r="24" fill="none" stroke={accent} strokeOpacity="0.55" strokeWidth="1" />
      <circle cx="32" cy="32" r="17" fill="none" stroke={accent} strokeOpacity="0.35" strokeWidth="1" strokeDasharray="2 3" />
      {[0, 45, 90, 135].map(deg => (
        <g key={deg} transform={`rotate(${deg} 32 32)`}>
          <ellipse cx="32" cy="14" rx="3" ry="7" fill={accent} fillOpacity="0.7" />
        </g>
      ))}
      <circle cx="32" cy="32" r="5" fill={accent} fillOpacity="0.85" />
      <circle cx="32" cy="32" r="2" fill="#0f0a1a" />
    </svg>
  );

  // Confetti at completion
  const Confetti = () => (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 36 }).map((_, i) => {
        const angle = (i / 36) * Math.PI * 2;
        const radius = 60 + (i % 4) * 40;
        const colors = [accent, "#ffd98a", "#ff9bcc", "#7ad9ff", "#c8baff"];
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
              rotate: [0, 180 + i * 8]
            }}
            transition={{ duration: 1.6, ease: "easeOut", delay: i * 0.015 }} />
        );
      })}
    </div>
  );

  const matchedCount = deck.filter(c => c.matched).length / 2;

  return (
    <div className="relative overflow-hidden rounded-[1.5rem] -m-4 p-5 sm:-m-6 sm:p-7 text-center"
      style={{ background: `radial-gradient(circle at 50% 30%, ${accent}1a, transparent 55%), linear-gradient(180deg, rgba(255,255,255,.025), transparent)` }}>
      <div className="pointer-events-none absolute inset-0 opacity-20"
        style={{ backgroundImage: `radial-gradient(circle, ${accent} 1px, transparent 1px)`, backgroundSize: "24px 24px", maskImage: "linear-gradient(to bottom, black, transparent 75%)" }} />

      {/* Status bar */}
      <div className="relative z-10 mb-4 flex items-center justify-between px-1 text-[10px] uppercase tracking-[.28em]">
        <div className="flex items-center gap-2 text-[#b9b1c9]">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: accent, boxShadow: `0 0 8px ${accent}` }} />
          <span>{phase === "preview" ? "Osserva" : phase === "complete" ? "Completo" : "Trova le coppie"}</span>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-[#9d97b1]">
          <span>⏱ <span className="font-mono text-white/90">{fmt(elapsed)}</span></span>
          <span>↺ <span className="font-mono text-white/90">{moves}</span></span>
        </div>
      </div>

      {/* Progress dots */}
      <div className="relative z-10 mb-4 flex items-center justify-center gap-1.5">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.span
            key={i}
            className="h-1.5 rounded-full"
            animate={{
              width: i < matchedCount ? 18 : 6,
              backgroundColor: i < matchedCount ? accent : "rgba(255,255,255,.15)"
            }}
            transition={{ type: "spring", stiffness: 220, damping: 18 }} />
        ))}
        {bestTime !== null && phase !== "complete" && (
          <span className="ml-3 text-[9px] uppercase tracking-[.22em] text-white/40">record {fmt(bestTime)}</span>
        )}
      </div>

      <div className="relative z-10 mx-auto grid max-w-xs grid-cols-4 gap-2.5 sm:max-w-sm sm:gap-3">
        <AnimatePresence>
          {phase === "complete" && <motion.div key="confetti" className="absolute inset-0 z-30 grid place-items-center"><Confetti /></motion.div>}
        </AnimatePresence>
        {deck.map((card, i) => {
          const showFace = card.flipped || card.matched;
          const concept = concepts.find(c => c.key === card.key);
          return (
            <motion.button
              key={card.id}
              layout
              onClick={() => flip(card.id)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="relative aspect-square cursor-pointer [perspective:800px]"
              disabled={phase === "preview"}
              aria-label={`Carta ${card.label}`}>
              <motion.div
                className="relative h-full w-full [transform-style:preserve-3d]"
                animate={{
                  rotateY: showFace ? 0 : 180,
                  scale: card.matched ? [1, 1.08, 1] : 1
                }}
                transition={{
                  rotateY: { duration: 0.55, ease: [0.4, 0, 0.2, 1] },
                  scale: { duration: 0.5 }
                }}>
                {/* back */}
                <div className="absolute inset-0 grid place-items-center rounded-xl border border-white/10 bg-gradient-to-br from-[#1f1538] to-[#2d1b69] [backface-visibility:hidden]">
                  <CardBack />
                </div>
                {/* face */}
                <div
                  className="absolute inset-0 grid place-items-center rounded-xl border [backface-visibility:hidden]"
                  style={{
                    transform: "rotateY(180deg)",
                    background: card.matched ? `${accent}1f` : "rgba(26,18,48,.95)",
                    borderColor: card.matched ? `${accent}66` : "rgba(255,255,255,.18)",
                    boxShadow: card.matched ? `0 0 18px ${accent}55` : undefined
                  }}>
                  {concept?.render()}
                </div>
              </motion.div>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {phase === "preview" ? (
          <motion.p key="preview" className="relative z-10 mt-4 text-xs uppercase tracking-[.26em] text-[#9d97b1]"
            initial={{ opacity: 0 }} animate={{ opacity: [0.3, 1, 0.3] }} exit={{ opacity: 0 }}
            transition={{ duration: 1.4, repeat: Infinity }}>
            Memorizza le posizioni
          </motion.p>
        ) : phase === "active" ? (
          <motion.div key="active" className="relative z-10 mt-4 flex items-center justify-center gap-2 text-xs text-[#b9b1c9]"
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <span>{matchedCount} di 6 coppie</span>
            <span className="text-white/25">·</span>
            <button onClick={reset} className="text-[10px] uppercase tracking-[.22em] text-white/45 hover:text-white">ricomincia</button>
          </motion.div>
        ) : (
          <motion.div key="complete" className="relative z-10 mt-5"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-[10px] font-semibold uppercase tracking-[.32em]" style={{ color: accent }}>Hai ritrovato</p>
            <p className="mt-1 font-display text-2xl text-white">{fmt(elapsed)} <span className="text-sm text-[#aaa3bc]">· {moves} mosse</span></p>
            {bestTime === elapsed && (
              <motion.p className="mt-1 text-xs" style={{ color: accent }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                ✦ Nuovo record personale
              </motion.p>
            )}
            <motion.button onClick={reset} whileTap={{ scale: 0.96 }} className="mt-3 inline-flex min-h-[44px] items-center justify-center rounded-full border px-5 text-xs uppercase tracking-[.22em]"
              style={{ borderColor: `${accent}66`, color: accent }}>
              Gioca ancora
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ShipsGame({ onReveal }: { onReveal: () => void }) {
  const accent = "#9E5AE8";
  const [phase, setPhase] = useState<"intro" | "active" | "complete">("intro");
  const [shipX, setShipX] = useState(0);
  const harborRef = useRef<HTMLDivElement>(null);
  const revealedRef = useRef(false);

  const complete = useCallback(() => {
    if (revealedRef.current) return;
    revealedRef.current = true;
    setPhase("complete");
    setTimeout(onReveal, 1800);
  }, [onReveal]);

  const checkArrival = (_: unknown, info: { offset: { x: number } }) => {
    const harborWidth = harborRef.current?.clientWidth ?? 320;
    if (shipX + info.offset.x >= harborWidth * 0.48) complete();
    else setShipX(current => Math.max(0, current + info.offset.x));
  };

  const nudge = () => {
    const harborWidth = harborRef.current?.clientWidth ?? 320;
    const next = Math.min(shipX + harborWidth * 0.12, harborWidth * 0.52);
    setShipX(next);
    if (next >= harborWidth * 0.48) complete();
  };

  const Boat = ({ small = false }: { small?: boolean }) => (
    <svg viewBox="0 0 120 92" className={small ? "w-[72px] sm:w-[88px]" : "w-[92px] sm:w-[112px]"} aria-hidden="true">
      <defs>
        <linearGradient id={small ? "smallHull" : "largeHull"} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor={small ? "#f6efff" : "#ddd2ef"} />
          <stop offset="1" stopColor={small ? accent : "#70508f"} />
        </linearGradient>
      </defs>
      <path d="M14 57h96L96 78c-3 7-11 10-20 10H39c-10 0-17-4-21-12Z" fill={`url(#${small ? "smallHull" : "largeHull"})`} stroke="white" strokeOpacity=".55" strokeWidth="2" />
      <path d="M56 10v48" stroke="#e8ddf6" strokeWidth="3" strokeLinecap="round" />
      <path d="M53 14 20 53h33Z" fill={small ? accent : "#b991df"} fillOpacity=".75" stroke="white" strokeOpacity=".5" />
      <path d="m60 23 28 30H60Z" fill="#f8f1ff" fillOpacity=".9" />
      {!small && <><rect x="76" y="44" width="25" height="14" rx="3" fill="#301b49" /><circle cx="83" cy="51" r="2" fill="#ffd98a" /><circle cx="94" cy="51" r="2" fill="#ffd98a" /></>}
    </svg>
  );

  if (phase === "intro") return (
    <motion.div className="text-center py-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.div className="relative mx-auto mb-5 h-24 w-24" animate={{ y: [0, -7, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
        <div className="absolute inset-0 rounded-full blur-2xl" style={{ background: `${accent}35` }} />
        <svg viewBox="0 0 96 96" className="relative h-full w-full" aria-hidden="true">
          <circle cx="48" cy="48" r="44" fill="#21143a" stroke={accent} strokeOpacity=".5" />
          <path d="M21 60c10-6 18 6 27 0s17 6 27 0" fill="none" stroke={accent} strokeWidth="3" strokeLinecap="round" />
          <path d="M31 53h35l-8 11H39Z" fill="#f5eeff" /><path d="M47 29v25M45 31 33 51h12Z" stroke={accent} fill={accent} fillOpacity=".6" />
        </svg>
      </motion.div>
      <p className="font-display text-2xl font-semibold text-white">Le Navi nel Porto</p>
      <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-[#a9a2bb]">A volte basta attraversare un piccolo tratto d’acqua per scoprire che qualcuno era già lì.</p>
      <motion.button onClick={() => setPhase("active")} className="mt-6 min-h-[48px] rounded-full px-7 py-3 font-semibold text-white shadow-lg" style={{ background: `linear-gradient(135deg, ${accent}, #6e37ad)`, boxShadow: `0 0 28px ${accent}45` }} whileHover={{ scale: 1.04 }} whileTap={{ scale: .96 }}>
        Entra nel porto
      </motion.button>
    </motion.div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
      <div ref={harborRef} className="relative h-[300px] overflow-hidden rounded-[24px] border border-white/10 bg-[#090617] shadow-2xl sm:h-[340px]" style={{ boxShadow: `inset 0 0 70px ${accent}12` }}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(158,90,232,.18),transparent_38%),linear-gradient(#100922,#171036_57%,#101b3b_58%,#070d25)]" />
        {[10, 18, 27, 39, 48, 59, 73, 83, 91].map((left, i) => <motion.i key={left} className="absolute h-1 w-1 rounded-full bg-white" style={{ left: `${left}%`, top: `${10 + (i * 13) % 38}%` }} animate={{ opacity: [.2, 1, .2], scale: [.7, 1.6, .7] }} transition={{ duration: 1.8 + (i % 3), repeat: Infinity, delay: i * .17 }} />)}
        <motion.div className="absolute right-[12%] top-7 h-12 w-12 rounded-full bg-[#fff4cf] sm:h-16 sm:w-16" style={{ boxShadow: "0 0 35px #fff1bd88" }} animate={{ boxShadow: ["0 0 24px #fff1bd55", "0 0 45px #fff1bd99", "0 0 24px #fff1bd55"] }} transition={{ duration: 4, repeat: Infinity }} />
        <div className="absolute inset-x-0 bottom-0 h-[43%] overflow-hidden">
          {[0, 1, 2, 3].map(i => <motion.div key={i} className="absolute h-px rounded-full bg-[#b596ff]" style={{ width: `${35 + i * 12}%`, left: `${(i * 23) % 35}%`, top: `${18 + i * 20}%`, opacity: .16 + i * .05 }} animate={{ x: [-22, 28, -22], scaleX: [.85, 1.15, .85] }} transition={{ duration: 3.5 + i, repeat: Infinity, ease: "easeInOut" }} />)}
          <motion.svg viewBox="0 0 600 80" preserveAspectRatio="none" className="absolute inset-x-0 top-0 h-16 w-[120%] -translate-x-[8%]" animate={{ x: [-10, 10, -10] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} aria-hidden="true"><path d="M0 25Q50 5 100 25t100 0t100 0t100 0t100 0t100 0v55H0Z" fill="#28386c" fillOpacity=".42" /></motion.svg>
        </div>
        <div className="absolute bottom-[29%] left-1/2 -translate-x-1/2">
          <svg viewBox="0 0 150 60" className="w-28 opacity-80" aria-hidden="true"><path d="M8 56c8-26 24-37 43-35 13-20 38-17 47 4 20-3 37 12 44 31Z" fill="#17152c" stroke="#614881" /><path d="M68 23c-1-16 10-17 13-20-2 9 8 13 3 25" fill="#48366a" /></svg>
        </div>

        <AnimatePresence>
          {phase === "complete" && <>
            <motion.div className="absolute bottom-[25%] left-[34%] right-[13%] h-[3px] origin-left rounded-full" initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: 1, opacity: [0, 1, .7, 1] }} transition={{ duration: .8 }} style={{ background: `linear-gradient(90deg, transparent, ${accent}, #fff, ${accent})`, boxShadow: `0 0 18px ${accent}` }} />
            {[0,1,2,3,4,5,6,7,8,9,10,11].map(i => <motion.span key={i} className="absolute left-[68%] top-[42%] h-1.5 w-1.5 rounded-full" style={{ background: i % 3 === 0 ? "#fff1a6" : accent }} initial={{ x: 0, y: 0, opacity: 1 }} animate={{ x: Math.cos(i / 12 * Math.PI * 2) * (38 + i % 3 * 10), y: Math.sin(i / 12 * Math.PI * 2) * (38 + i % 3 * 10), opacity: 0, scale: [1, 1.8, 0] }} transition={{ duration: 1.2, delay: .15 }} />)}
          </>}
        </AnimatePresence>

        <motion.div className="absolute bottom-[21%] left-[7%] z-20 touch-none cursor-grab active:cursor-grabbing" drag={phase === "active" ? "x" : false} dragConstraints={{ left: 0, right: (harborRef.current?.clientWidth ?? 320) * .53 }} dragElastic={.08} onDragEnd={checkArrival} animate={{ x: shipX, y: [0, -3, 0], scale: phase === "complete" ? 1.08 : 1 }} transition={{ x: { type: "spring", stiffness: 180, damping: 20 }, y: { duration: 2.2, repeat: Infinity, ease: "easeInOut" } }} whileDrag={{ scale: 1.08 }}><Boat small /></motion.div>
        <motion.div className="absolute bottom-[20%] right-[5%] z-10" animate={{ y: [0, -4, 0], rotate: [-1, 1, -1] }} transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}><Boat /></motion.div>
        <div className="absolute inset-x-0 bottom-3 text-[10px] uppercase tracking-[.22em] text-white/40">Mostra · porto delle presenze</div>
      </div>

      <AnimatePresence mode="wait">
        {phase === "active" ? <motion.div key="guide" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-4">
          <p className="text-sm text-[#b9b1c9]">Trascina la vela verso la nave illuminata</p>
          <motion.button onClick={nudge} className="mt-2 min-h-[48px] rounded-full border border-[#9E5AE8]/35 bg-[#9E5AE8]/10 px-6 text-sm font-medium text-[#d9baff]" whileTap={{ scale: .95 }} aria-label="Avvicina la nave">oppure tocca per avanzare →</motion.button>
        </motion.div> : <motion.div key="done" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-5"><p className="font-display text-2xl text-[#d9baff]">La distanza diventa incontro.</p><p className="mt-1 text-xs uppercase tracking-[.25em] text-white/40">due rotte, un porto</p></motion.div>}
      </AnimatePresence>
    </motion.div>
  );
}

function ScaleGame({ onReveal }: { onReveal: () => void }) {
  const accent = "#E85A8F";
  const qualities = ["Empatia", "Forza", "Creatività", "Coraggio", "Unicità"];
  const initialJudgments = [
    { id: 1, text: "Non sei abbastanza" },
    { id: 2, text: "Dovresti fare di più" },
    { id: 3, text: "Gli altri sono migliori" },
    { id: 4, text: "Non ce la farai" },
    { id: 5, text: "Sei troppo diverso" },
  ];
  const [phase, setPhase] = useState<"intro" | "active" | "complete">("intro");
  const [judgments, setJudgments] = useState(initialJudgments);
  const [burst, setBurst] = useState(0);
  const revealedRef = useRef(false);
  const tilt = judgments.length === 0 ? 0 : -5 - judgments.length * 1.7;

  const removeJudgment = useCallback((id: number) => {
    if (phase !== "active") return;
    setBurst(id + Date.now());
    setJudgments(current => {
      const next = current.filter(j => j.id !== id);
      if (next.length === 0 && !revealedRef.current) {
        revealedRef.current = true;
        setPhase("complete");
        setTimeout(onReveal, 1900);
      }
      return next;
    });
  }, [onReveal, phase]);

  if (phase === "intro") return (
    <motion.div className="py-2 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.svg viewBox="0 0 180 140" className="mx-auto mb-3 w-36" aria-hidden="true" animate={{ rotate: [-2, 2, -2] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
        <defs><linearGradient id="introMetal" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fff0f6" /><stop offset=".5" stopColor={accent} /><stop offset="1" stopColor="#6e2945" /></linearGradient></defs>
        <path d="M90 30v72M35 103h110M67 103l23-49 23 49" fill="none" stroke="url(#introMetal)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M25 39h130M40 42 24 79h33Zm100 0-16 37h33Z" fill="none" stroke="#f4cddd" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="90" cy="39" r="8" fill={accent} stroke="#ffe4ef" strokeWidth="3" />
      </motion.svg>
      <p className="font-display text-2xl font-semibold">La Bilancia</p>
      <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-[#aaa3b9]">Lascia andare le misure che non ti appartengono. Il tuo valore non ha bisogno di confronti.</p>
      <motion.button onClick={() => setPhase("active")} className="mt-6 min-h-[48px] rounded-full px-7 py-3 font-semibold text-white" style={{ background: `linear-gradient(135deg, ${accent}, #a83260)`, boxShadow: `0 0 28px ${accent}40` }} whileHover={{ scale: 1.04 }} whileTap={{ scale: .96 }}>Metti in equilibrio</motion.button>
    </motion.div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative pb-1 text-center">
      <div className="relative h-[390px] overflow-hidden rounded-[24px] border border-white/[.08] bg-[radial-gradient(circle_at_50%_70%,rgba(232,90,143,.12),transparent_40%),linear-gradient(180deg,#130b21,#0c0815)] sm:h-[430px]">
        {[0,1,2,3,4,5].map(i => <motion.span key={i} className="absolute h-1 w-1 rounded-full bg-[#ffd6e6]" style={{ left: `${12 + i * 16}%`, top: `${8 + (i % 3) * 9}%` }} animate={{ opacity: [.15, .7, .15] }} transition={{ repeat: Infinity, duration: 2 + i * .25 }} />)}
        <AnimatePresence>
          {phase === "complete" && <motion.div className="absolute left-1/2 top-8 z-30 -translate-x-1/2" initial={{ opacity: 0, scale: .2, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: "spring", stiffness: 170, damping: 14 }}>
            <motion.svg viewBox="0 0 80 80" className="h-16 w-16" animate={{ filter: ["drop-shadow(0 0 8px #E85A8F77)", "drop-shadow(0 0 22px #E85A8Fcc)", "drop-shadow(0 0 8px #E85A8F77)"] }} transition={{ duration: 2, repeat: Infinity }} aria-hidden="true"><path d="M40 68S11 51 11 29c0-17 21-22 29-7 8-15 29-10 29 7 0 22-29 39-29 39Z" fill={accent} stroke="#ffd7e6" strokeWidth="2" /></motion.svg>
          </motion.div>}
        </AnimatePresence>

        <div className="absolute inset-x-3 top-[88px] sm:inset-x-6 sm:top-[105px]">
          <motion.div className="relative h-3 origin-center rounded-full" animate={{ rotate: tilt }} transition={{ type: "spring", stiffness: 105, damping: 12, mass: .8 }} style={{ background: "linear-gradient(180deg,#f8dce7,#a85475 55%,#542239)", boxShadow: phase === "complete" ? `0 0 18px ${accent}, 0 0 38px ${accent}55` : "0 4px 12px #0008" }}>
            <span className="absolute -left-1 -top-1 h-5 w-5 rounded-full border-2 border-[#f6cedd] bg-[#7c3551]" /><span className="absolute -right-1 -top-1 h-5 w-5 rounded-full border-2 border-[#f6cedd] bg-[#7c3551]" />
            <motion.div className="absolute left-0 top-2 w-[44%] -translate-x-[4%]" animate={{ y: tilt < 0 ? 7 : 0 }} transition={{ type: "spring", stiffness: 100, damping: 12 }}>
              <div className="mx-auto h-16 w-px bg-gradient-to-b from-[#e7b2c6] to-[#7e3a55]" />
              <div className="relative -mt-1 min-h-[146px] rounded-b-[48px] border-x border-b border-[#ad5a79]/80 bg-[#2a1020]/80 px-2 pb-3 pt-4 backdrop-blur-sm">
                <span className="absolute -top-1 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-[#d88aa8]" />
                <p className="mb-2 text-[9px] font-semibold uppercase tracking-[.18em] text-[#d98ca9]">Giudizi</p>
                <AnimatePresence mode="popLayout">
                  {judgments.map(j => <motion.button layout key={j.id} onClick={() => removeJudgment(j.id)} drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={.8} onDragEnd={(_, info) => { if (Math.abs(info.offset.x) > 65 || Math.abs(info.velocity.x) > 450) removeJudgment(j.id); }} className="mb-1.5 block min-h-[40px] w-full touch-pan-y rounded-sm border border-[#e8b6c8]/20 bg-[#f4e9e7] px-2 py-1 text-left text-[9px] font-medium leading-tight text-[#51273a] shadow-md sm:text-[10px]" style={{ backgroundImage: "linear-gradient(95deg,transparent 92%,#dabfc2 92%)" }} initial={{ opacity: 0, scale: .8 }} animate={{ opacity: 1, scale: 1, rotate: j.id % 2 ? -1 : 1 }} exit={{ opacity: 0, scale: [.95, .7, 0], rotate: j.id % 2 ? -18 : 18, x: j.id % 2 ? -110 : 110, filter: "blur(4px)" }} whileTap={{ scale: .92 }} aria-label={`Elimina: ${j.text}`}><span className="mr-1 text-[#b13e69]">×</span>{j.text}</motion.button>)}
                </AnimatePresence>
                {judgments.length === 0 && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-8 font-display text-base text-[#f5aec8]">Spazio libero</motion.p>}
              </div>
            </motion.div>

            <motion.div className="absolute right-0 top-2 w-[44%] translate-x-[4%]" animate={{ y: tilt < 0 ? -7 : 0 }} transition={{ type: "spring", stiffness: 100, damping: 12 }}>
              <div className="mx-auto h-16 w-px bg-gradient-to-b from-[#e7b2c6] to-[#7e3a55]" />
              <div className="relative -mt-1 min-h-[146px] rounded-b-[48px] border-x border-b border-[#ad5a79]/80 bg-[#1d1729]/90 px-2 pb-3 pt-4">
                <span className="absolute -top-1 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-[#d88aa8]" />
                <p className="mb-2 text-[9px] font-semibold uppercase tracking-[.18em] text-[#eac6d5]">Ciò che sei</p>
                {qualities.map((q, i) => <motion.div key={q} className="mb-1.5 flex min-h-[20px] items-center justify-center rounded-full border border-white/10 bg-white/[.05] px-1 text-[9px] text-[#f3dce5] sm:text-[10px]" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * .08 }}><span className="mr-1 text-[#E85A8F]">◆</span>{q}</motion.div>)}
              </div>
            </motion.div>
          </motion.div>
        </div>

        <svg viewBox="0 0 220 180" className="absolute bottom-0 left-1/2 h-[250px] w-[220px] -translate-x-1/2" aria-hidden="true">
          <defs><linearGradient id="scaleMetal" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#f8dce7" /><stop offset=".42" stopColor="#bd6989" /><stop offset="1" stopColor="#532239" /></linearGradient></defs>
          <path d="M110 26v112" stroke="url(#scaleMetal)" strokeWidth="11" strokeLinecap="round" />
          <path d="M73 153 101 90h18l28 63Z" fill="#39182a" stroke="url(#scaleMetal)" strokeWidth="4" strokeLinejoin="round" />
          <path d="M52 164h116c9 0 14 5 17 12H35c3-7 8-12 17-12Z" fill="url(#scaleMetal)" />
          <circle cx="110" cy="26" r="11" fill="#4d2034" stroke="#f5ccdc" strokeWidth="4" />
          <circle cx="110" cy="26" r="3" fill="#fff0f6" />
        </svg>

        <AnimatePresence>
          {burst > 0 && judgments.length > 0 && [0,1,2,3,4,5,6,7].map(i => <motion.i key={`${burst}-${i}`} className="absolute left-[24%] top-[48%] z-40 h-2 w-1 bg-[#ead6d2]" initial={{ opacity: 1, x: 0, y: 0, rotate: 0 }} animate={{ opacity: 0, x: (i - 3.5) * 13, y: -20 - (i % 3) * 13, rotate: i * 70 }} transition={{ duration: .7 }} />)}
        </AnimatePresence>
      </div>
      <AnimatePresence mode="wait">
        {phase === "active" ? <motion.div key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-4"><p className="text-sm text-[#b7afc4]">Sfiora via ogni giudizio</p><p className="mt-1 text-xs text-white/35">trascina una carta oppure toccala</p></motion.div> : <motion.div key="balanced" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4"><p className="font-display text-2xl text-[#f2aec7]">Sei già abbastanza.</p><p className="mt-1 text-xs uppercase tracking-[.22em] text-white/35">la misura torna al cuore</p></motion.div>}
      </AnimatePresence>
    </motion.div>
  );
}

const INTERACTIONS: Record<number, React.FC<{ onReveal: () => void }>> = {
  1: EmotionWheel, 2: AgendaGame, 3: HugGame, 4: MemoryGame, 5: ShipsGame, 6: ScaleGame,
};

function ManualCodeFallback({ stepId, onUnlock, canScan }: { stepId: number; onUnlock: (id: number) => void; canScan: (id: number) => boolean }) {
  const [show, setShow] = useState(false);
  const [code, setCode] = useState("");
  const handleSubmit = () => {
    const num = Number(code);
    if (num >= 1 && num <= 6 && num === stepId) {
      if (!canScan(stepId)) {
        alert("Devi prima completare la tappa precedente.");
        return;
      }
      onUnlock(stepId); setShow(false);
    } else alert("Codice non valido.");
  };
  if (!show) return (
    <button onClick={() => setShow(true)} className="text-xs text-[#8b85a0] hover:text-white transition-colors cursor-pointer mt-2 min-h-[44px] px-2 py-2">
      📱 Non hai la camera? Inserisci codice manualmente
    </button>
  );
  return (
    <div className="mt-3 p-3 sm:p-4 bg-white/5 rounded-xl border border-white/10">
      <p className="text-xs text-[#8b85a0] mb-2">Inserisci il numero della tappa (1-6):</p>
      <div className="flex gap-2">
        <input type="number" min={1} max={6} value={code} onChange={e => setCode(e.target.value)}
          className="flex-1 px-3 py-2 bg-[#1a1230] border border-white/10 rounded-lg text-white text-center text-lg font-bold focus:outline-none focus:border-[#e85a8f] min-h-[48px]"
          placeholder="?" />
        <button onClick={handleSubmit} className="px-4 py-2 bg-[#e85a8f] text-white rounded-lg font-semibold hover:scale-105 active:scale-95 transition-transform cursor-pointer min-h-[48px]">
          OK
        </button>
      </div>
    </div>
  );
}

export default function TappaClient({ stepId }: { stepId: number }) {
  const step = STEPS.find(s => s.id === stepId);
  const router = useRouter();
  const { isUnlocked, isCompleted, unlockStep, completeStep, canScan } = useProgress();
  const [revealed, setRevealed] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  const unlocked = isUnlocked(stepId);
  const handleReveal = useCallback(() => { setRevealed(true); completeStep(stepId); }, [stepId, completeStep]);
  const handleScan = useCallback((data: string) => {
    setShowScanner(false);
    if (!canScan(stepId)) {
      alert("Devi prima completare la tappa precedente.");
      return;
    }
    const match = data.match(/\/tappa\/(\d)/);
    if (match && Number(match[1]) === stepId) unlockStep(stepId);
    else alert("QR Code non valido.");
  }, [stepId, unlockStep, canScan]);

  if (!step) return (
    <main className="min-h-dvh flex items-center justify-center bg-[#0f0a1a] px-4">
      <div className="text-center">
        <p className="text-xl sm:text-2xl mb-4">❌ Tappa non trovata</p>
        <Link href="/home" className="text-[#e85a8f] underline">Torna alla Home</Link>
      </div>
    </main>
  );

  const Interaction = INTERACTIONS[stepId];
  const handleNext = () => stepId < 6 ? router.push(`/tappa/${stepId + 1}`) : router.push("/finale");

  if (!unlocked) return (
    <main className="min-h-dvh flex items-center justify-center bg-[#0f0a1a] layout-padding safe-inset">
      <div className="text-center max-w-sm w-full animate-fade-in-up">
        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-5 sm:mb-6 rounded-full bg-white/5 flex items-center justify-center text-3xl sm:text-4xl">🔒</div>
        <h1 className="text-xl sm:text-2xl font-bold mb-3">{step.title}</h1>
        <p className="text-[#8b85a0] mb-5 sm:mb-6 text-sm sm:text-base">
          {!canScan(stepId)
            ? `Prima completa la tappa ${stepId - 1} (${STEPS[stepId - 2].location}).`
            : `Scansiona il QR Code a ${step.location} per sbloccare questa tappa.`
          }
        </p>
        <button onClick={() => setShowScanner(true)}
          className="px-5 py-3 sm:px-6 sm:py-3 bg-gradient-to-r from-[#e85a8f] to-[#c84a7a] text-white rounded-full font-semibold hover:scale-105 active:scale-95 transition-transform cursor-pointer mb-3 min-h-[48px] text-sm sm:text-base">
          📷 Scansiona QR Code
        </button>
        <ManualCodeFallback stepId={stepId} onUnlock={unlockStep} canScan={canScan} />
        <div className="mt-4">
          <Link href="/home" className="text-sm text-[#8b85a0] hover:text-white transition-colors min-h-[44px] inline-flex items-center">
            ← Torna alla Home
          </Link>
        </div>
        {showScanner && (
          <div className="fixed inset-0 z-50">
            <div className="fixed inset-0 z-[100] bg-[#0f0a1a]/95 flex flex-col items-center justify-center safe-inset">
              <div className="relative w-full max-w-sm aspect-square rounded-2xl overflow-hidden bg-black">
                <div id="qr-scanner-inline" className="w-full h-full" />
              </div>
              <button onClick={() => setShowScanner(false)}
                className="mt-4 px-6 py-2 bg-white/10 text-white rounded-full text-sm hover:bg-white/20 transition-colors cursor-pointer min-h-[48px]">
                ✕ Chiudi
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );

  return (
    <main className="min-h-dvh bg-[#0f0a1a] pb-24 safe-inset">
      <div className="relative py-8 sm:py-10 layout-padding text-center">
        <Link href="/home"
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 text-[#8b85a0] hover:text-white transition-colors text-sm min-h-[44px] min-w-[44px] flex items-center justify-center">
          ← Home
        </Link>
        <div className="inline-block w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-bold text-sm mb-2" style={{ backgroundColor: step.color }}>
          {step.id}
        </div>
        <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold">{step.title}</h1>
        <p className="text-[#8b85a0] text-sm mt-1">📍 {step.location}</p>
      </div>

      <div className="max-w-lg mx-auto layout-padding mt-8 sm:mt-10">
        {!revealed ? (
          <>
            <p className="text-center text-[#a09ab5] mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base">{step.description}</p>
            <div className="p-4 sm:p-6 rounded-2xl bg-[#1a1230] border border-white/5">
              <Interaction onReveal={handleReveal} />
            </div>
          </>
        ) : (
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <motion.div
              className="p-6 sm:p-10 rounded-2xl bg-gradient-to-br from-[#1a1230] to-[#2d1b69] border border-white/10"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
            >
              <p className="text-xs sm:text-sm text-[#8b85a0] mb-3 sm:mb-4">Hai scoperto la parola:</p>
              <motion.h2
                className="font-display text-5xl sm:text-6xl md:text-7xl font-bold tracking-wider mb-3 sm:mb-4"
                style={{ color: step.color }}
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.3 }}
              >
                {step.word}
              </motion.h2>
              <motion.div
                className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-4 sm:my-6"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              />
              <p className="text-xs sm:text-sm text-[#8b85a0]">Tappa {step.id} di 6 completata ✓</p>
            </motion.div>
            <motion.button
              onClick={handleNext}
              className="mt-6 sm:mt-8 px-6 py-3 sm:px-8 sm:py-3 bg-gradient-to-r from-[#e85a8f] to-[#c84a7a] text-white rounded-full font-semibold cursor-pointer min-h-[48px] text-sm sm:text-base"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {stepId < 6 ? "Prossima tappa →" : "Scopri il significato →"}
            </motion.button>
          </motion.div>
        )}
      </div>
    </main>
  );
}
