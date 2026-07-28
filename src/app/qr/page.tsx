"use client";

import { STEPS } from "@/data/steps";
import { QRCodeSVG } from "qrcode.react";
import Link from "next/link";

const QR_URLS = STEPS.map((step) => ({
  ...step,
  url: `https://macass.workshop.it/tappa/${step.id}`,
}));

export default function QRCodePage() {
  return (
    <main className="min-h-dvh bg-[#0f0a1a] pb-20">
      {/* Header */}
      <div className="relative py-10 px-6 text-center border-b border-white/5">
        <Link
          href="/home"
          className="absolute left-6 top-1/2 -translate-y-1/2 text-[#8b85a0] hover:text-white transition-colors text-sm"
        >
          ← Home
        </Link>
        <h1 className="text-2xl md:text-4xl font-bold">
          📱 QR Code — Stampa per il Festival
        </h1>
        <p className="text-[#8b85a0] mt-2">
          Stampali e posizionali nelle 6 tappe del percorso
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger">
          {QR_URLS.map((step) => (
            <div
              key={step.id}
              className="bg-[#1a1230] border border-white/5 rounded-2xl p-6 text-center"
            >
              <div className="inline-block mb-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: step.color }}
                >
                  {step.id}
                </div>
              </div>
              <h3 className="font-bold text-lg mb-1">{step.title}</h3>
              <p className="text-[#8b85a0] text-sm mb-4">
                📍 {step.location}
              </p>

              {/* QR Code */}
              <div className="inline-block p-4 bg-white rounded-xl mb-4">
                <QRCodeSVG
                  value={step.url}
                  size={180}
                  bgColor="#ffffff"
                  fgColor={step.color}
                  level="H"
                  includeMargin={false}
                />
              </div>

              <p className="text-xs text-[#8b85a0] mb-3 font-mono break-all">
                {step.url}
              </p>

              <p className="text-sm font-semibold" style={{ color: step.color }}>
                Parola: {step.word}
              </p>

              {/* Download button */}
              <a
                href={step.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 px-4 py-2 text-xs bg-white/5 text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                Apri link →
              </a>
            </div>
          ))}
        </div>

        {/* Print all button */}
        <div className="mt-12 text-center">
          <button
            onClick={() => window.print()}
            className="px-8 py-3 bg-gradient-to-r from-[#e85a8f] to-[#c84a7a] text-white rounded-full font-semibold hover:scale-105 transition-transform cursor-pointer"
          >
            🖨️ Stampa tutti i QR Code
          </button>
        </div>
      </div>
    </main>
  );
}
