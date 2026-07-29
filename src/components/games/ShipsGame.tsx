"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameShell, type GameProps } from "./shared";

const ACCENT = "#9E5AE8";
const HARBOR_DEFAULT_WIDTH = 320;

/**
 * Drag a small boat across a quiet harbor to dock beside a waiting ship.
 * Pure touch + drag, with a tap-to-advance fallback for accessibility.
 */
export function ShipsGame({ onReveal }: GameProps) {
  const [phase, setPhase] = useState<"intro" | "active" | "complete">("intro");
  const [shipX, setShipX] = useState(0);
  const [harborWidth, setHarborWidth] = useState(HARBOR_DEFAULT_WIDTH);
  const harborRef = useRef<HTMLDivElement>(null);
  const revealedRef = useRef(false);

  // Track the harbor width so drag constraints can use it without reading
  // the ref during render (which React 19 forbids).
  useEffect(() => {
    if (!harborRef.current) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setHarborWidth(entry.contentRect.width);
    });
    observer.observe(harborRef.current);
    setHarborWidth(harborRef.current.clientWidth);
    return () => observer.disconnect();
  }, [phase]);

  const complete = useCallback(() => {
    if (revealedRef.current) return;
    revealedRef.current = true;
    setPhase("complete");
    setTimeout(onReveal, 1800);
  }, [onReveal]);

  const checkArrival = (_: unknown, info: { offset: { x: number } }) => {
    if (shipX + info.offset.x >= harborWidth * 0.48) complete();
    else setShipX((current) => Math.max(0, current + info.offset.x));
  };

  const nudge = () => {
    const next = Math.min(shipX + harborWidth * 0.12, harborWidth * 0.52);
    setShipX(next);
    if (next >= harborWidth * 0.48) complete();
  };

  return (
    <GameShell accent={ACCENT}>
      {phase === "intro" ? (
        <motion.div
          className="flex flex-col items-center py-2 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="relative mx-auto mb-5 h-24 w-24"
            animate={{ y: [0, -7, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="absolute inset-0 rounded-full blur-2xl" style={{ background: `${ACCENT}35` }} />
            <svg viewBox="0 0 96 96" className="relative h-full w-full" aria-hidden="true">
              <circle cx="48" cy="48" r="44" fill="#21143a" stroke={ACCENT} strokeOpacity="0.5" />
              <path
                d="M21 60c10-6 18 6 27 0s17 6 27 0"
                fill="none"
                stroke={ACCENT}
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path d="M31 53h35l-8 11H39Z" fill="#f5eeff" />
              <path d="M47 29v25M45 31 33 51h12Z" stroke={ACCENT} fill={ACCENT} fillOpacity="0.6" />
            </svg>
          </motion.div>
          <p className="font-display text-2xl font-semibold text-white">Le Navi nel Porto</p>
          <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-[#a9a2bb]">
            A volte basta attraversare un piccolo tratto d&apos;acqua per scoprire che qualcuno era già lì.
          </p>
          <motion.button
            onClick={() => setPhase("active")}
            className="mt-6 min-h-[48px] rounded-full px-7 py-3 font-semibold text-white shadow-lg cursor-pointer"
            style={{
              background: `linear-gradient(135deg, ${ACCENT}, #6e37ad)`,
              boxShadow: `0 0 28px ${ACCENT}45`,
            }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            Entra nel porto
          </motion.button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div
            ref={harborRef}
            className="relative h-[300px] overflow-hidden rounded-3xl border border-white/10 bg-[#090617] shadow-2xl sm:h-[340px]"
            style={{ boxShadow: `inset 0 0 70px ${ACCENT}12` }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(158,90,232,0.18),transparent_38%),linear-gradient(#100922,#171036_57%,#101b3b_58%,#070d25)]" />
            {/* Stars */}
            {[10, 18, 27, 39, 48, 59, 73, 83, 91].map((left, i) => (
              <motion.i
                key={left}
                className="absolute h-1 w-1 rounded-full bg-white"
                style={{ left: `${left}%`, top: `${10 + (i * 13) % 38}%` }}
                animate={{ opacity: [0.2, 1, 0.2], scale: [0.7, 1.6, 0.7] }}
                transition={{ duration: 1.8 + (i % 3), repeat: Infinity, delay: i * 0.17 }}
              />
            ))}
            {/* Moon */}
            <motion.div
              className="absolute right-[12%] top-7 h-12 w-12 rounded-full bg-[#fff4cf] sm:h-16 sm:w-16"
              style={{ boxShadow: "0 0 35px #fff1bd88" }}
              animate={{ boxShadow: ["0 0 24px #fff1bd55", "0 0 45px #fff1bd99", "0 0 24px #fff1bd55"] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            {/* Ocean */}
            <div className="absolute inset-x-0 bottom-0 h-[43%] overflow-hidden">
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="absolute h-px rounded-full bg-[#b596ff]"
                  style={{
                    width: `${35 + i * 12}%`,
                    left: `${(i * 23) % 35}%`,
                    top: `${18 + i * 20}%`,
                    opacity: 0.16 + i * 0.05,
                  }}
                  animate={{ x: [-22, 28, -22], scaleX: [0.85, 1.15, 0.85] }}
                  transition={{ duration: 3.5 + i, repeat: Infinity, ease: "easeInOut" }}
                />
              ))}
              <motion.svg
                viewBox="0 0 600 80"
                preserveAspectRatio="none"
                className="absolute inset-x-0 top-0 h-16 w-[120%] -translate-x-[8%]"
                animate={{ x: [-10, 10, -10] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                aria-hidden="true"
              >
                <path d="M0 25Q50 5 100 25t100 0t100 0t100 0t100 0t100 0v55H0Z" fill="#28386c" fillOpacity="0.42" />
              </motion.svg>
            </div>
            {/* Background island */}
            <div className="absolute bottom-[29%] left-1/2 -translate-x-1/2">
              <svg viewBox="0 0 150 60" className="w-28 opacity-80" aria-hidden="true">
                <path
                  d="M8 56c8-26 24-37 43-35 13-20 38-17 47 4 20-3 37 12 44 31Z"
                  fill="#17152c"
                  stroke="#614881"
                />
                <path d="M68 23c-1-16 10-17 13-20-2 9 8 13 3 25" fill="#48366a" />
              </svg>
            </div>

            <AnimatePresence>
              {phase === "complete" && (
                <>
                  <motion.div
                    className="absolute bottom-[25%] left-[34%] right-[13%] h-[3px] origin-left rounded-full"
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: [0, 1, 0.7, 1] }}
                    transition={{ duration: 0.8 }}
                    style={{
                      background: `linear-gradient(90deg, transparent, ${ACCENT}, #fff, ${ACCENT})`,
                      boxShadow: `0 0 18px ${ACCENT}`,
                    }}
                  />
                  {Array.from({ length: 12 }, (_, i) => (
                    <motion.span
                      key={i}
                      className="absolute left-[68%] top-[42%] h-1.5 w-1.5 rounded-full"
                      style={{ background: i % 3 === 0 ? "#fff1a6" : ACCENT }}
                      initial={{ x: 0, y: 0, opacity: 1 }}
                      animate={{
                        x: Math.cos((i / 12) * Math.PI * 2) * (38 + (i % 3) * 10),
                        y: Math.sin((i / 12) * Math.PI * 2) * (38 + (i % 3) * 10),
                        opacity: 0,
                        scale: [1, 1.8, 0],
                      }}
                      transition={{ duration: 1.2, delay: 0.15 }}
                    />
                  ))}
                </>
              )}
            </AnimatePresence>

            <motion.div
              className="absolute bottom-[21%] left-[7%] z-20 touch-none cursor-grab active:cursor-grabbing"
              drag={phase === "active" ? "x" : false}
              dragConstraints={{ left: 0, right: harborWidth * 0.53 }}
              dragElastic={0.08}
              onDragEnd={checkArrival}
              animate={{ x: shipX, y: [0, -3, 0], scale: phase === "complete" ? 1.08 : 1 }}
              transition={{
                x: { type: "spring", stiffness: 180, damping: 20 },
                y: { duration: 2.2, repeat: Infinity, ease: "easeInOut" },
              }}
              whileDrag={{ scale: 1.08 }}
            >
              <Boat small />
            </motion.div>
            <motion.div
              className="absolute bottom-[20%] right-[5%] z-10"
              animate={{ y: [0, -4, 0], rotate: [-1, 1, -1] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            >
              <Boat />
            </motion.div>
            <div className="absolute inset-x-0 bottom-3 text-[10px] uppercase tracking-[0.22em] text-white/40">
              Mostra · porto delle presenze
            </div>
          </div>

          <AnimatePresence mode="wait">
            {phase === "active" ? (
              <motion.div
                key="guide"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4"
              >
                <p className="text-sm text-[#b9b1c9]">Trascina la vela verso la nave illuminata</p>
                <motion.button
                  onClick={nudge}
                  className="mt-2 min-h-[48px] rounded-full border border-[#9E5AE8]/35 bg-[#9E5AE8]/10 px-6 text-sm font-medium text-[#d9baff] cursor-pointer"
                  whileTap={{ scale: 0.95 }}
                  aria-label="Avvicina la nave"
                >
                  oppure tocca per avanzare →
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="done"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-5"
              >
                <p className="font-display text-2xl text-[#d9baff]">
                  La distanza diventa incontro.
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.25em] text-white/40">
                  due rotte, un porto
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </GameShell>
  );
}

function Boat({ small = false }: { small?: boolean }) {
  return (
    <svg
      viewBox="0 0 120 92"
      className={small ? "w-[72px] sm:w-[88px]" : "w-[92px] sm:w-[112px]"}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={small ? "smallHull" : "largeHull"} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor={small ? "#f6efff" : "#ddd2ef"} />
          <stop offset="1" stopColor={small ? ACCENT : "#70508f"} />
        </linearGradient>
      </defs>
      <path
        d="M14 57h96L96 78c-3 7-11 10-20 10H39c-10 0-17-4-21-12Z"
        fill={`url(#${small ? "smallHull" : "largeHull"})`}
        stroke="white"
        strokeOpacity="0.55"
        strokeWidth="2"
      />
      <path d="M56 10v48" stroke="#e8ddf6" strokeWidth="3" strokeLinecap="round" />
      <path
        d="M53 14 20 53h33Z"
        fill={small ? ACCENT : "#b991df"}
        fillOpacity="0.75"
        stroke="white"
        strokeOpacity="0.5"
      />
      <path d="m60 23 28 30H60Z" fill="#f8f1ff" fillOpacity="0.9" />
      {!small && (
        <>
          <rect x="76" y="44" width="25" height="14" rx="3" fill="#301b49" />
          <circle cx="83" cy="51" r="2" fill="#ffd98a" />
          <circle cx="94" cy="51" r="2" fill="#ffd98a" />
        </>
      )}
    </svg>
  );
}
