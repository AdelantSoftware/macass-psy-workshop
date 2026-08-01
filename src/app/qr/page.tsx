"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { STEPS } from "@/data/steps";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";

const QR_KEY = "macass2026";

const COLOR_MAP: Record<string, string> = {
  "var(--color-accent-clay)": "#c9775e",
  "var(--color-accent-ochre)": "#b8926a",
  "var(--color-accent-sand)": "#c4a87c",
  "var(--color-accent-sage)": "#7fa87f",
  "var(--color-accent-lavender)": "#9a7ea8",
  "var(--color-accent-amber)": "#d4a85a",
};

function resolveHex(cssVar: string): string {
  return COLOR_MAP[cssVar] ?? "#c9775e";
}

function downloadQR(index: number) {
  const svgEl = document.getElementById(`qr-svg-${index}`);
  if (!svgEl) return;
  const cloned = svgEl.cloneNode(true) as SVGElement;
  // Add quiet-zone padding (10px white border)
  cloned.setAttribute("style", "padding:10px;background:#fff;border-radius:8px;");
  const serializer = new XMLSerializer();
  const svgStr = serializer.serializeToString(cloned);
  const blob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `qr-tappa-${index + 1}.svg`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function QRPage() {
  const router = useRouter();
  const [inputKey, setInputKey] = useState("");
  const [authorized, setAuthorized] = useState(false);

  if (!authorized) {
    return (
      <div className="hero min-h-dvh bg-base-100">
        <div className="hero-content text-center max-w-sm">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="text-4xl">🔐</div>
            <h1 className="text-2xl font-bold">Area riservata</h1>
            <p className="text-sm text-base-content/50">
              Inserisci la chiave per accedere alla generazione QR code.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (inputKey === QR_KEY) setAuthorized(true);
                else alert("Chiave errata.");
              }}
              className="join w-full"
            >
              <input
                type="password"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                className="input input-bordered join-item flex-1 text-center"
                placeholder="Chiave..."
              />
              <Button type="submit" variant="primary" className="join-item rounded-r-full">
                →
              </Button>
            </form>
            <button
              onClick={() => router.push("/home")}
              className="link link-hover text-sm text-base-content/50"
            >
              ← Torna alla Home
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-base-100 pb-20">
      <PageHeader
        title="📱 QR Code — Stampa per il Festival"
        subtitle="Stampali e posizionali nelle 6 tappe del percorso"
        backHref="/home"
      />

      <div className="max-w-6xl mx-auto layout-padding mt-10">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.08 },
            },
          }}
        >
          {STEPS.map((step) => {
            const hex = resolveHex(step.color);
            return (
              <motion.div
                key={step.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 },
                }}
                className="card bg-base-200 border border-base-300/60 p-4 sm:p-6 text-center gap-3"
              >
                <div className="flex justify-center">
                  <div
                    className="badge rounded-full p-2 text-white font-bold"
                    style={{ backgroundColor: step.color }}
                  >
                    {step.id}
                  </div>
                </div>
                <h3 className="font-bold text-lg">{step.title}</h3>
                <p className="text-sm text-base-content/50">📍 {step.location}</p>
                <div className="bg-white rounded-xl p-4 inline-block mx-auto">
                  <QRCodeSVG
                    id={`qr-svg-${step.id - 1}`}
                    value={step.secretWord}
                    size={200}
                    bgColor="#ffffff"
                    fgColor={hex}
                    level="H"
                    includeMargin={true}
                  />
                </div>
                <p className="text-xs text-base-content/40 font-mono break-all">
                  {step.secretWord}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadQR(step.id - 1)}
                >
                  ⬇ Scarica QR
                </Button>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="my-16 text-center">
          <Button onClick={() => window.print()} size="lg" className="rounded-full">
            🖨️ Stampa tutti i QR Code
          </Button>
        </div>
      </div>
    </div>
  );
}