"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { STEPS } from "@/data/steps";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";

const QR_KEY = "macass2026";
const QR_BASE = "https://voce.adelant.tech/tappa";

export default function QRPage() {
  const router = useRouter();
  const [inputKey, setInputKey] = useState("");
  const [authorized, setAuthorized] = useState(false);

  if (!authorized) {
    return (
      <div className="hero min-h-dvh bg-base-100">
        <div className="hero-content text-center max-w-sm">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-4">
            <div className="text-4xl">🔐</div>
            <h1 className="text-2xl font-bold">Area riservata</h1>
            <p className="text-sm text-base-content/60">Inserisci la chiave per accedere alla generazione QR code.</p>
            <form onSubmit={e => { e.preventDefault(); if (inputKey === QR_KEY) setAuthorized(true); else alert("Chiave errata."); }} className="join w-full">
              <input type="password" value={inputKey} onChange={e => setInputKey(e.target.value)}
                className="input input-bordered join-item flex-1 text-center" placeholder="Chiave..." />
              <Button type="submit" variant="primary" className="join-item">→</Button>
            </form>
            <button onClick={() => router.push("/home")} className="link link-hover text-sm text-base-content/60">← Torna alla Home</button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-base-100 pb-20">
      <PageHeader title="📱 QR Code — Stampa per il Festival" subtitle="Stampali e posizionali nelle 6 tappe del percorso" backHref="/home" />

      <div className="max-w-6xl mx-auto layout-padding mt-10">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          initial="hidden"
          animate="show"
          variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } }}
        >
          {STEPS.map((step) => (
            <motion.div key={step.id} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
              className="card bg-base-200 border border-base-300 p-4 sm:p-6 text-center gap-3">
              <div className="flex justify-center">
                <div className="badge rounded-full p-2 text-white font-bold" style={{ backgroundColor: step.color }}>{step.id}</div>
              </div>
              <h3 className="font-bold text-lg">{step.title}</h3>
              <p className="text-sm text-base-content/60">📍 {step.location}</p>
              <div className="bg-white rounded-xl p-3 sm:p-4 inline-block mx-auto">
                <QRCodeSVG value={`${QR_BASE}/${step.id}`} size={160} bgColor="#ffffff" fgColor={step.color.startsWith("#") ? step.color : "#e85a8f"} level="H" includeMargin={false} />
              </div>
              <p className="text-xs text-base-content/40 font-mono break-all">{`${QR_BASE}/${step.id}`}</p>
              <p className="text-sm font-semibold" style={{ color: step.color }}>Parola: {step.word}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-8 text-center">
          <Button onClick={() => window.print()} size="lg">🖨️ Stampa tutti i QR Code</Button>
        </div>
      </div>
    </div>
  );
}