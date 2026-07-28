"use client";

import Link from "next/link";
import Image from "next/image";
import { STEPS } from "@/data/steps";
import { useProgress } from "@/hooks/useProgress";

export default function HomePage() {
  const { isUnlocked, isCompleted, allCompleted, progress, resetProgress } =
    useProgress();

  return (
    <main className="min-h-dvh bg-[#0f0a1a] pb-20">
      {/* Header */}
      <header className="relative py-16 px-6 text-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-bg.jpg"
            alt=""
            fill
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f0a1a]/40 to-[#0f0a1a]" />
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl md:text-5xl font-bold mb-3">
            Il Percorso delle <span className="gradient-text">Sei Parole</span>
          </h1>
          <p className="text-[#8b85a0] text-lg">
            Esplora il festival, trova i QR Code, scopri le parole
          </p>
          {/* Progress bar */}
          <div className="mt-6 max-w-xs mx-auto">
            <div className="flex justify-between text-xs text-[#8b85a0] mb-1">
              <span>Progresso</span>
              <span>
                {progress.completedSteps.length}/6 tappe
              </span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#e85a8f] to-[#5ae8c8] rounded-full transition-all duration-500"
                style={{
                  width: `${(progress.completedSteps.length / 6) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 space-y-16">
        {/* Sezione 1: Esplora la Mappa */}
        <section className="animate-fade-in-up">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="text-[#5ae8c8]">📍</span> Esplora la Mappa
          </h2>
          <Link href="/mappa" className="block group">
            <div className="relative rounded-2xl overflow-hidden h-64 md:h-80">
              <Image
                src="/images/map-bg.jpg"
                alt="Mappa del festival"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f0a1a] via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-xl font-semibold mb-1">
                  Mappa del Festival
                </p>
                <p className="text-[#8b85a0]">
                  Trova le 6 posizioni dei QR Code nascosti
                </p>
                <span className="inline-block mt-3 px-5 py-2 bg-[#5ae8c8]/20 text-[#5ae8c8] rounded-full text-sm font-medium group-hover:bg-[#5ae8c8]/30 transition-colors">
                  Vedi la mappa →
                </span>
              </div>
            </div>
          </Link>
        </section>

        {/* Sezione 2: Le Sei Tappe */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <span className="text-[#e85a8f]">✦</span> Le Sei Tappe
            </h2>
            {allCompleted && (
              <Link
                href="/finale"
                className="px-4 py-2 bg-[#e85a8f]/10 text-[#e85a8f] rounded-full text-sm font-medium hover:bg-[#e85a8f]/20 transition-colors"
              >
                Vai al finale →
              </Link>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 stagger">
            {STEPS.map((step) => {
              const unlocked = isUnlocked(step.id);
              const completed = isCompleted(step.id);
              return (
                <Link
                  key={step.id}
                  href={unlocked ? `/tappa/${step.id}` : "#"}
                  className={`step-card block rounded-2xl overflow-hidden border ${
                    unlocked
                      ? "bg-[#1a1230] border-white/5"
                      : "bg-[#1a1230]/50 border-white/5 opacity-60"
                  } ${completed ? "ring-2 ring-[#5ae8c8]/30" : ""}`}
                >
                  <div className="relative h-44">
                    <Image
                      src={step.image}
                      alt={step.title}
                      fill
                      className={`object-cover ${!unlocked ? "blur-sm" : ""}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a1230] to-transparent" />
                    <div
                      className="absolute top-3 left-3 w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm"
                      style={{ backgroundColor: step.color }}
                    >
                      {unlocked ? step.id : "🔒"}
                    </div>
                    {completed && (
                      <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-[#5ae8c8] flex items-center justify-center text-sm">
                        ✓
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg mb-1">
                      {unlocked ? step.title : "Tappa bloccata"}
                    </h3>
                    <p className="text-[#8b85a0] text-sm mb-3">
                      📍 {step.location}
                    </p>
                    <p className="text-sm text-[#a09ab5] leading-relaxed">
                      {unlocked
                        ? step.description
                        : "Scansiona il QR Code per sbloccare"}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <span
                        className="text-xs font-mono tracking-wider px-3 py-1 rounded-full"
                        style={{
                          backgroundColor: unlocked
                            ? `${step.color}20`
                            : "rgba(255,255,255,0.05)",
                          color: unlocked ? step.color : "#8b85a0",
                        }}
                      >
                        {unlocked ? step.word : "???"}
                      </span>
                      <span className="text-xs text-[#8b85a0]">
                        Tappa {step.id}/6
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* QR Code link */}
        <section className="text-center">
          <Link
            href="/qr"
            className="inline-block px-8 py-3 bg-white/5 text-white rounded-full font-semibold hover:bg-white/10 transition-colors border border-white/10"
          >
            📱 Genera QR Code per la stampa
          </Link>
        </section>

        {/* Reset progress */}
        {progress.completedSteps.length > 0 && (
          <div className="text-center">
            <button
              onClick={() => {
                if (
                  confirm(
                    "Vuoi davvero ripristinare i progressi? Tutte le tappe sbloccate verranno resettate."
                  )
                ) {
                  resetProgress();
                }
              }}
              className="text-xs text-[#8b85a0] hover:text-red-400 transition-colors cursor-pointer"
            >
              ↻ Ripristina progressi
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
