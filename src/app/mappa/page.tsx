"use client";

import Link from "next/link";
import Image from "next/image";
import { STEPS } from "@/data/steps";

export default function MappaPage() {
  return (
    <main className="min-h-dvh bg-[#0f0a1a] pb-20">
      {/* Header */}
      <div className="relative py-12 px-6 text-center border-b border-white/5">
        <Link
          href="/home"
          className="absolute left-6 top-1/2 -translate-y-1/2 text-[#8b85a0] hover:text-white transition-colors text-sm"
        >
          ← Home
        </Link>
        <h1 className="text-2xl md:text-4xl font-bold">
          📍 Mappa del Festival
        </h1>
        <p className="text-[#8b85a0] mt-2">
          Le 6 posizioni dei QR Code da trovare
        </p>
      </div>

      {/* Map illustration */}
      <div className="max-w-4xl mx-auto px-6 mt-8">
        <div className="relative rounded-2xl overflow-hidden h-[50vh] md:h-[60vh]">
          <Image
            src="/images/map-bg.jpg"
            alt="Mappa del festival"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[#0f0a1a]/30" />

          {/* Location pins - styled as absolute positioned elements */}
          {STEPS.map((step, i) => {
            // Distribute pins across the map
            const positions = [
              { top: "15%", left: "20%" },
              { top: "30%", left: "70%" },
              { top: "50%", left: "25%" },
              { top: "45%", left: "80%" },
              { top: "70%", left: "50%" },
              { top: "80%", left: "30%" },
            ];
            const pos = positions[i];

            return (
              <div
                key={step.id}
                className="absolute group cursor-pointer"
                style={{ top: pos.top, left: pos.left }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg animate-float"
                  style={{
                    backgroundColor: step.color,
                    animationDelay: `${i * 0.3}s`,
                  }}
                >
                  {step.id}
                </div>
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-[#1a1230] rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20">
                  <p className="font-semibold text-sm">{step.title}</p>
                  <p className="text-xs text-[#8b85a0]">📍 {step.location}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3">
          {STEPS.map((step) => (
            <Link
              key={step.id}
              href={`/tappa/${step.id}`}
              className="flex items-center gap-3 p-3 rounded-xl bg-[#1a1230] border border-white/5 hover:border-white/10 transition-colors"
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0"
                style={{ backgroundColor: step.color }}
              >
                {step.id}
              </div>
              <div className="min-w-0">
                <p className="font-medium text-sm truncate">{step.location}</p>
                <p className="text-xs text-[#8b85a0]">Tappa {step.id}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
