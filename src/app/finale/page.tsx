"use client";

import Link from "next/link";
import { STEPS, FULL_PHRASE } from "@/data/steps";
import { useProgress } from "@/hooks/useProgress";

export default function FinalePage() {
  const { allCompleted } = useProgress();

  if (!allCompleted) {
    return (
      <main className="min-h-dvh flex items-center justify-center bg-[#0f0a1a] px-6">
        <div className="text-center">
          <p className="text-2xl mb-4">🔒 Non ancora!</p>
          <p className="text-[#8b85a0] mb-6">
            Completa tutte le 6 tappe per sbloccare la schermata finale.
          </p>
          <Link
            href="/home"
            className="text-[#e85a8f] hover:text-[#c84a7a] transition-colors"
          >
            ← Torna alla Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-dvh flex items-center justify-center bg-[#0f0a1a] px-6 py-20">
      <div className="max-w-2xl mx-auto text-center stagger">
        {/* Decorative top */}
        <div className="mb-8">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#e85a8f] to-[#5ae8c8] flex items-center justify-center animate-pulse-glow">
            <span className="text-2xl">✦</span>
          </div>
        </div>

        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          Complimenti! 🎉
        </h1>

        <p className="text-[#8b85a0] text-lg mb-8">
          Hai completato tutte e sei le tappe del percorso.
        </p>

        {/* Words revealed */}
        <div className="p-8 rounded-2xl bg-gradient-to-br from-[#1a1230] to-[#2d1b69] border border-white/10 mb-8">
          <p className="text-sm text-[#8b85a0] mb-4">Le sei parole:</p>
          <div className="flex flex-wrap justify-center gap-3">
            {STEPS.map((step) => (
              <span
                key={step.id}
                className="px-4 py-2 rounded-full text-lg font-bold tracking-wider"
                style={{
                  backgroundColor: `${step.color}20`,
                  color: step.color,
                }}
              >
                {step.word}
              </span>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-white/10">
            <p className="text-xl md:text-2xl font-light italic text-[#a09ab5] leading-relaxed">
              “{FULL_PHRASE}”
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="p-8 rounded-2xl bg-[#1a1230] border border-[#e85a8f]/20">
          <h2 className="text-xl md:text-2xl font-bold mb-3 gradient-text">
            Workshop di Psicologia
          </h2>
          <p className="text-[#8b85a0] mb-6 leading-relaxed">
            Ti aspetto al{" "}
            <span className="text-white font-semibold">
              WORKSHOP DI PSICOLOGIA
            </span>{" "}
            per il{" "}
            <span className="text-[#e85a8f]">Muro della consapevolezza</span>.
          </p>
          <div className="inline-block px-6 py-3 bg-[#e85a8f]/10 text-[#e85a8f] rounded-full font-medium border border-[#e85a8f]/20">
            🧠 Scopri di più su te stesso
          </div>
        </div>

        {/* Restart */}
        <Link
          href="/"
          className="inline-block mt-8 text-sm text-[#8b85a0] hover:text-white transition-colors"
        >
          ↻ Ricominciare il percorso
        </Link>
      </div>
    </main>
  );
}
