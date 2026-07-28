"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { STEPS } from "@/data/steps";
import { QRCodeSVG } from "qrcode.react";

const QR_KEY = "macass2026";

const QR_URLS = STEPS.map((step) => ({
  ...step,
  url: `https://macass-psy-workshop.adelant.workers.dev/tappa/${step.id}`,
}));

export default function QRPage() {
  const [inputKey, setInputKey] = useState("");
  const [authorized, setAuthorized] = useState(false);

  if (!authorized) {
    return (
      <main className="min-h-dvh flex items-center justify-center bg-[#0f0a1a] px-5 safe-inset">
        <motion.div
          className="text-center max-w-sm w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-white/5 flex items-center justify-center text-3xl">🔐</div>
          <h1 className="text-xl sm:text-2xl font-bold mb-3">Area riservata</h1>
          <p className="text-[#8b85a0] text-sm mb-6">Inserisci la chiave per accedere alla generazione QR code.</p>
          <div className="flex gap-2">
            <input
              type="password"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && inputKey === QR_KEY) setAuthorized(true); }}
              className="flex-1 px-4 py-3 bg-[#1a1230] border border-white/10 rounded-xl text-white text-center focus:outline-none focus:border-[#e85a8f] min-h-[48px]"
              placeholder="Chiave..."
            />
            <button
              onClick={() => { if (inputKey === QR_KEY) setAuthorized(true); else alert("Chiave errata."); }}
              className="px-5 py-3 bg-[#e85a8f] text-white rounded-xl font-semibold hover:scale-105 active:scale-95 transition-transform cursor-pointer min-h-[48px]"
            >
              →
            </button>
          </div>
          <Link href="/home" className="inline-block mt-6 text-sm text-[#8b85a0] hover:text-white transition-colors min-h-[44px] py-2">
            ← Torna alla Home
          </Link>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-dvh bg-[#0f0a1a] pb-24 safe-inset">
      <div className="relative py-8 sm:py-10 px-4 sm:px-6 text-center border-b border-white/5">
        <Link href="/home" className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b85a0] hover:text-white transition-colors text-sm min-h-[44px] flex items-center justify-center">← Home</Link>
        <h1 className="text-xl sm:text-3xl md:text-4xl font-bold">📱 QR Code — Stampa per il Festival</h1>
        <p className="text-[#8b85a0] text-sm mt-1">Stampali e posizionali nelle 6 tappe del percorso</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-6 sm:mt-8">
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8" initial="hidden" animate="show" variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } }}>
          {QR_URLS.map((step) => (
            <motion.div key={step.id} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="bg-[#1a1230] border border-white/5 rounded-2xl p-4 sm:p-6 text-center">
              <div className="inline-block mb-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: step.color }}>{step.id}</div>
              </div>
              <h3 className="font-bold text-base sm:text-lg mb-1">{step.title}</h3>
              <p className="text-[#8b85a0] text-xs sm:text-sm mb-3 sm:mb-4">📍 {step.location}</p>
              <div className="inline-block p-3 sm:p-4 bg-white rounded-xl mb-3 sm:mb-4">
                <QRCodeSVG value={step.url} size={160} bgColor="#ffffff" fgColor={step.color} level="H" includeMargin={false} />
              </div>
              <p className="text-[10px] sm:text-xs text-[#8b85a0] mb-2 font-mono break-all">{step.url}</p>
              <p className="text-sm font-semibold" style={{ color: step.color }}>Parola: {step.word}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-10 sm:mt-12 text-center">
          <button onClick={() => window.print()} className="px-6 py-3 sm:px-8 sm:py-3 bg-gradient-to-r from-[#e85a8f] to-[#c84a7a] text-white rounded-full font-semibold hover:scale-105 active:scale-95 transition-transform cursor-pointer min-h-[48px] text-sm sm:text-base">
            🖨️ Stampa tutti i QR Code
          </button>
        </div>
      </div>
    </main>
  );
}
