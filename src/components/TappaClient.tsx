"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { STEPS } from "@/data/steps";
import { useProgress } from "@/hooks/useProgress";

function EmotionWheel({ onReveal }: { onReveal: () => void }) {
  const emotions = ["Felicità","Tristezza","Rabbia","Paura","Sorpresa","Disgusto","Serenità","Gratitudine"];
  const [spinning, setSpinning] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const spin = () => {
    setSpinning(true);
    const idx = Math.floor(Math.random() * emotions.length);
    setTimeout(() => {
      setSelected(emotions[idx]);
      setSpinning(false);
      setTimeout(onReveal, 800);
    }, 2000);
  };

  return (
    <div className="text-center">
      <div
        className={`w-36 h-36 sm:w-48 sm:h-48 mx-auto rounded-full border-4 border-dashed border-[#E8735A]/50 flex items-center justify-center text-xl sm:text-2xl font-bold transition-transform ${spinning ? "animate-spin-slow" : ""}`}
        style={{ background: "conic-gradient(from 0deg, #E8735A, #5AE8C8, #5A8FE8, #E8C85A, #9E5AE8, #E85A8F, #E8735A)" }}
      >
        <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-[#1a1230] flex items-center justify-center text-sm sm:text-lg">
          {selected ?? "?"}
        </div>
      </div>
      {!selected && (
        <button onClick={spin} disabled={spinning}
          className="mt-5 sm:mt-6 px-6 py-3 sm:px-8 sm:py-3 bg-[#E8735A] text-white rounded-full font-semibold hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 cursor-pointer min-h-[48px] text-sm sm:text-base">
          {spinning ? "Girando..." : "Gira la Ruota 🎡"}
        </button>
      )}
    </div>
  );
}

function AgendaGame({ onReveal }: { onReveal: () => void }) {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Rispondere a 47 email", removed: false },
    { id: 2, text: "Meeting delle 9:00", removed: false },
    { id: 3, text: "Deadline domani", removed: false },
    { id: 4, text: "Più caffè", removed: false },
    { id: 5, text: "Riunione inutile", removed: false },
    { id: 6, text: "Stare in silenzio", removed: false },
  ]);
  const remove = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, removed: true } : t));
    const remaining = tasks.filter(t => t.id !== id && !t.removed);
    if (remaining.length === 0) setTimeout(onReveal, 800);
  };
  return (
    <div className="space-y-2 sm:space-y-3">
      <p className="text-center text-[#8b85a0] mb-3 sm:mb-4 text-sm">Tocca per liberarti dagli impegni inutili ✋</p>
      {tasks.map(task => (
        <button key={task.id} onClick={() => remove(task.id)}
          className={`w-full p-3 sm:p-4 rounded-xl text-left font-medium transition-all cursor-pointer text-sm ${task.removed ? "bg-[#5A8FE8]/10 text-[#5A8FE8] line-through opacity-40" : "bg-[#1a1230] border border-white/10 hover:border-[#5A8FE8]/40 active:border-[#5A8FE8]/60 min-h-[48px]"}`}>
          {task.removed ? "✓ " : ""}{task.text}
        </button>
      ))}
    </div>
  );
}

function HugGame({ onReveal }: { onReveal: () => void }) {
  const [hugging, setHugging] = useState(false);
  const [progress, setProgress] = useState(0);
  const startHug = () => {
    setHugging(true);
    let p = 0;
    const interval = setInterval(() => {
      p += 2;
      setProgress(p);
      if (p >= 100) { clearInterval(interval); setTimeout(onReveal, 500); }
    }, 60);
  };
  return (
    <div className="text-center">
      <div className={`text-6xl sm:text-8xl mb-4 sm:mb-6 transition-transform ${hugging ? "scale-125" : "animate-float"}`}>🧸</div>
      {!hugging ? (
        <button onClick={startHug}
          className="px-6 py-3 sm:px-8 sm:py-3 bg-[#E8C85A] text-[#1a1230] rounded-full font-semibold hover:scale-105 active:scale-95 transition-transform cursor-pointer min-h-[48px] text-sm sm:text-base">
          Stringi forte! 🤗
        </button>
      ) : (
        <div className="w-52 sm:w-64 mx-auto">
          <div className="h-3 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-[#E8C85A] rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-sm text-[#8b85a0] mt-2">{progress < 50 ? "Stringi di più..." : progress < 90 ? "Quasi..." : "💕"}</p>
        </div>
      )}
    </div>
  );
}

function MemoryGame({ onReveal }: { onReveal: () => void }) {
  const symbols = ["🌟", "🌙", "☀️", "🌈", "⭐", "🌸"];
  const [cards, setCards] = useState(() => {
    const pairs = [...symbols, ...symbols];
    return pairs.map((s, i) => ({ id: i, symbol: s, flipped: false, matched: false })).sort(() => Math.random() - 0.5);
  });
  const [selected, setSelected] = useState<number[]>([]);

  const flip = (id: number) => {
    if (selected.length === 2 || cards[id].flipped || cards[id].matched) return;
    const newCards = cards.map(c => c.id === id ? { ...c, flipped: true } : c);
    const newSelected = [...selected, id];
    if (newSelected.length === 2) {
      const [first, second] = newSelected;
      if (newCards[first].symbol === newCards[second].symbol) {
        newCards[first].matched = true;
        newCards[second].matched = true;
      }
      setTimeout(() => {
        setCards(prev => prev.map(c => c.id === first || c.id === second ? { ...c, flipped: c.matched } : c));
        setSelected([]);
      }, 600);
    }
    setCards(newCards);
    setSelected(newSelected);
    if (newCards.every(c => c.matched || c.id === id)) setTimeout(onReveal, 800);
  };

  return (
    <div>
      <p className="text-center text-[#8b85a0] mb-3 sm:mb-4 text-sm">Trova tutte le coppie! 🃏</p>
      <div className="grid grid-cols-4 gap-2.5 sm:gap-3 max-w-xs sm:max-w-sm mx-auto">
        {cards.map(card => (
          <button key={card.id} onClick={() => flip(card.id)}
            className={`aspect-square rounded-xl text-xl sm:text-2xl font-bold flex items-center justify-center transition-all cursor-pointer ${card.flipped || card.matched ? card.matched ? "bg-[#5AE89E]/20 border border-[#5AE89E]/40" : "bg-[#1a1230] border border-white/20" : "bg-[#2d1b69] border border-white/10 hover:border-white/20 active:border-white/30 min-h-[52px]"}`}>
            {card.flipped || card.matched ? card.symbol : "?"}
          </button>
        ))}
      </div>
    </div>
  );
}

function ShipsGame({ onReveal }: { onReveal: () => void }) {
  const [shipPos, setShipPos] = useState(0);
  const [met, setMet] = useState(false);
  const moveShip = () => {
    const newPos = Math.min(shipPos + 10, 100);
    setShipPos(newPos);
    if (newPos >= 100) { setMet(true); setTimeout(onReveal, 800); }
  };
  return (
    <div className="text-center">
      <div className="relative h-28 sm:h-32 bg-[#1a1230] rounded-2xl overflow-hidden mb-4 sm:mb-6">
        <div className="absolute bottom-0 left-0 right-0 h-14 sm:h-16 bg-gradient-to-t from-[#5A8FE8]/20 to-transparent" />
        <div className="absolute bottom-6 sm:bottom-8 text-3xl sm:text-4xl transition-all duration-300" style={{ left: `calc(${shipPos}% - 16px)` }}>⛵</div>
        <div className="absolute bottom-6 sm:bottom-8 right-3 sm:right-4 text-3xl sm:text-4xl">🚢</div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-xl sm:text-2xl">🏝️</div>
      </div>
      {!met ? (
        <button onClick={moveShip}
          className="px-6 py-3 sm:px-8 sm:py-3 bg-[#9E5AE8] text-white rounded-full font-semibold hover:scale-105 active:scale-95 transition-transform cursor-pointer min-h-[48px] text-sm sm:text-base">
          Avanza! ⛵
        </button>
      ) : (
        <p className="text-[#9E5AE8] text-base sm:text-lg font-semibold">Le navi si sono incontrate! 🤝</p>
      )}
    </div>
  );
}

function ScaleGame({ onReveal }: { onReveal: () => void }) {
  const [judgments, setJudgments] = useState([
    { id: 1, text: "Non sei abbastanza", removed: false },
    { id: 2, text: "Dovresti fare di più", removed: false },
    { id: 3, text: "Gli altri sono migliori", removed: false },
    { id: 4, text: "Non ce la farai", removed: false },
    { id: 5, text: "Sei troppo diverso", removed: false },
  ]);
  const qualities = ["Empatia", "Forza", "Creatività", "Coraggio", "Unicità"];
  const removeJudgment = (id: number) => {
    setJudgments(prev => prev.map(j => j.id === id ? { ...j, removed: true } : j));
    const remaining = judgments.filter(j => j.id !== id && !j.removed);
    if (remaining.length === 0) setTimeout(onReveal, 800);
  };
  const removedCount = judgments.filter(j => j.removed).length;
  const tilt = (removedCount / judgments.length) * 25;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="relative">
        <div className="flex items-end justify-center gap-4 sm:gap-8 h-36 sm:h-40 transition-transform duration-500" style={{ transform: `rotate(${tilt}deg)` }}>
          <div className="flex-1 bg-[#E85A8F]/10 rounded-xl p-2.5 sm:p-4 border border-[#E85A8F]/20 min-h-[100px] sm:min-h-[120px]">
            <p className="text-[10px] sm:text-xs text-[#E85A8F] font-semibold mb-1.5 sm:mb-2 text-center">GIUDIZI</p>
            {judgments.filter(j => !j.removed).map(j => (
              <button key={j.id} onClick={() => removeJudgment(j.id)}
                className="w-full text-left text-[10px] sm:text-xs p-1.5 sm:p-2 mb-1 rounded bg-[#E85A8F]/10 text-[#E85A8F] hover:bg-[#E85A8F]/20 active:bg-[#E85A8F]/30 transition-colors cursor-pointer min-h-[36px]">
                ✕ {j.text}
              </button>
            ))}
            {judgments.every(j => j.removed) && <p className="text-[10px] sm:text-xs text-[#5AE8C8] text-center mt-3 sm:mt-4">Vuoto! ✨</p>}
          </div>
          <div className="flex-1 bg-[#5AE8C8]/10 rounded-xl p-2.5 sm:p-4 border border-[#5AE8C8]/20 min-h-[100px] sm:min-h-[120px]">
            <p className="text-[10px] sm:text-xs text-[#5AE8C8] font-semibold mb-1.5 sm:mb-2 text-center">QUALITÀ</p>
            {qualities.map((q, i) => (
              <p key={i} className="text-[10px] sm:text-xs p-1.5 sm:p-2 mb-1 rounded bg-[#5AE8C8]/10 text-[#5AE8C8]">♥ {q}</p>
            ))}
          </div>
        </div>
        <div className="flex justify-center mt-2"><div className="w-3 h-3 sm:w-4 sm:h-4 bg-[#8b85a0] rounded-full" /></div>
      </div>
      <p className="text-center text-xs sm:text-sm text-[#8b85a0]">Tocca i giudizi per eliminarli dalla bilancia</p>
    </div>
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
    <main className="min-h-dvh flex items-center justify-center bg-[#0f0a1a] px-5 safe-inset">
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
      <div className="relative py-8 sm:py-10 px-4 sm:px-6 text-center">
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

      <div className="max-w-lg mx-auto px-4 sm:px-6">
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
