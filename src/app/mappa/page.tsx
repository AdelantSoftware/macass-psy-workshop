"use client";

import Link from "next/link";
import Image from "next/image";
import { STEPS } from "@/data/steps";

export default function MappaPage() {
  return (
    <main className="min-h-dvh bg-[#0f0a1a] pb-24 safe-inset">
      {/* Header */}
      <div className="relative py-8 sm:py-16 layout-padding text-center border-b border-white/5">
        <Link
          href="/home"
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b85a0] hover:text-white transition-colors text-sm min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          ← Home
        </Link>
        <h1 className="text-xl sm:text-3xl md:text-4xl font-bold">
          📍 Mappa del Festival
        </h1>
        <p className="text-[#8b85a0] text-sm mt-1">
          Le 6 posizioni dei QR Code da trovare
        </p>
      </div>

      {/* Map */}
      <div className="max-w-4xl mx-auto layout-padding mt-6 sm:mt-8">
        <div className="relative rounded-2xl overflow-hidden h-[45vh] sm:h-[50vh] md:h-[60vh]">
          <Image
            src="/images/map-bg.jpg"
            alt="Mappa del festival"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[#0f0a1a]/30" />

          {/* Pins */}
          {STEPS.map((step, i) => {
            const positions = [
              { top: "12%", left: "18%" },
              { top: "28%", left: "72%" },
              { top: "48%", left: "22%" },
              { top: "44%", left: "82%" },
              { top: "68%", left: "48%" },
              { top: "78%", left: "28%" },
            ];
            const pos = positions[i];

            return (
              <div
                key={step.id}
                className="absolute group"
                style={{ top: pos.top, left: pos.left }}
              >
                <Link href={`/tappa/${step.id}`}>
                  <div
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-lg animate-float"
                    style={{
                      backgroundColor: step.color,
                      animationDelay: `${i * 0.3}s`,
                    }}
                  >
                    {step.id}
                  </div>
                </Link>
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-[#1a1230] rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20">
                  <p className="font-semibold text-xs sm:text-sm">{step.title}</p>
                  <p className="text-[10px] sm:text-xs text-[#8b85a0]">📍 {step.location}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 sm:mt-6 grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
          {STEPS.map((step) => (
            <Link
              key={step.id}
              href={`/tappa/${step.id}`}
              className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl bg-[#1a1230] border border-white/5 hover:border-white/10 active:border-white/15 transition-colors min-h-[52px]"
            >
              <div
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white font-bold text-[10px] sm:text-xs shrink-0"
                style={{ backgroundColor: step.color }}
              >
                {step.id}
              </div>
              <div className="min-w-0">
                <p className="font-medium text-xs sm:text-sm truncate">{step.location}</p>
                <p className="text-[10px] sm:text-xs text-[#8b85a0]">Tappa {step.id}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}