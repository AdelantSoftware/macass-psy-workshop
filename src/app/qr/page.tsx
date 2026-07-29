/* refactored: tokens */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { STEPS } from "@/data/steps";
import { PageHeader } from "@/components/ui/PageHeader";
import { PrimaryButton } from "@/components/ui/Button";

const QR_KEY = "macass2026";
const QR_BASE = "https://voce.adelant.tech/tappa";

export default function QRPage() {
  const router = useRouter();
  const [inputKey, setInputKey] = useState("");
  const [authorized, setAuthorized] = useState(false);

  if (!authorized) {
    return (
      <main className="min-h-dvh flex items-center justify-center bg-[var(--color-bg)] layout-padding safe-inset">
        <motion.div
          className="text-center max-w-sm w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-white/5 flex items-center justify-center text-3xl">
            🔐
          </div>
          <h1 className="text-xl sm:text-2xl font-bold mb-3 text-balance">Area riservata</h1>
          <p className="text-[var(--color-muted-strong)] text-sm mb-6">
            Inserisci la chiave per accedere alla generazione QR code.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (inputKey === QR_KEY) setAuthorized(true);
              else window.alert("Chiave errata.");
            }}
            className="flex gap-2"
          >
            <input
              type="password"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              className="flex-1 px-4 py-3 bg-[var(--color-surface)] border border-white/10 rounded-xl text-white text-center focus:outline-none focus:border-[var(--color-accent)] min-h-[48px]"
              placeholder="Chiave..."
            />
            <PrimaryButton type="submit" size="md" className="!px-5 !py-3 !min-h-[48px]">
              →
            </PrimaryButton>
          </form>
          <button
            onClick={() => router.push("/home")}
            className="inline-block mt-6 text-sm text-[var(--color-muted-strong)] hover:text-white transition-colors min-h-[44px] py-2 cursor-pointer"
          >
            ← Torna alla Home
          </button>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-dvh bg-[var(--color-bg)] pb-20 sm:pb-24 safe-inset">
      <PageHeader
        title={
          <>
            <span aria-hidden="true">📱 </span>QR Code — Stampa per il Festival
          </>
        }
        subtitle="Stampali e posizionali nelle 6 tappe del percorso"
        backHref="/home"
        backLabel="Home"
        dense
      />

      <div className="max-w-6xl mx-auto layout-padding mt-10 sm:mt-14">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.08 } },
          }}
        >
          {STEPS.map((step) => (
            <motion.div
              key={step.id}
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
              className="bg-[var(--color-surface)] border border-white/5 rounded-2xl p-4 sm:p-6 text-center"
            >
              <div className="inline-block mb-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: step.color }}
                >
                  {step.id}
                </div>
              </div>
              <h3 className="font-bold text-base sm:text-lg mb-1">{step.title}</h3>
              <p className="text-[var(--color-muted-strong)] text-xs sm:text-sm mb-3 sm:mb-4">
                📍 {step.location}
              </p>
              <div className="inline-block p-3 sm:p-4 bg-white rounded-xl mb-3 sm:mb-4">
                <QRCodeSVG
                  value={`${QR_BASE}/${step.id}`}
                  size={160}
                  bgColor="var(--color-text)fff"
                  fgColor={step.color}
                  level="H"
                  includeMargin={false}
                />
              </div>
              <p className="text-[10px] sm:text-xs text-[var(--color-muted-strong)] mb-2 font-mono break-all">
                {`${QR_BASE}/${step.id}`}
              </p>
              <p className="text-sm font-semibold" style={{ color: step.color }}>
                Parola: {step.word}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-8 sm:mt-12 text-center">
          <PrimaryButton onClick={() => window.print()} size="lg">
            🖨️ Stampa tutti i QR Code
          </PrimaryButton>
        </div>
      </div>
    </main>
  );
}
