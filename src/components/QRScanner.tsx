/* refactored: tokens */
"use client";

import { useEffect, useRef, useState } from "react";

interface QRScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
}

export default function QRScanner({ onScan, onClose }: QRScannerProps) {
  const [error, setError] = useState<string | null>(null);
  // Keep the latest callback without making the effect re-run.
  const onScanRef = useRef(onScan);
  onScanRef.current = onScan;

  useEffect(() => {
    let stopped = false;
    let instance: { stop: () => Promise<void> } | null = null;

    const initScanner = async () => {
      try {
        const { Html5Qrcode } = await import("html5-qrcode");

        // Ensure the container is clean — a leftover <video> here is what
        // causes the "two cameras stacked on top of each other" effect.
        const container = document.getElementById("qr-reader");
        if (container) container.innerHTML = "";

        const html5QrCode = new Html5Qrcode("qr-reader");
        instance = html5QrCode;

        // Pick ONE camera (the back-facing one) explicitly.
        const cameras = await Html5Qrcode.getCameras();
        const backCamera =
          cameras.find((c) => /back|rear|environment/i.test(c.label)) ??
          cameras.find((c) => /1/i.test(c.id)) ??
          cameras[0];

        if (!backCamera) {
          if (!stopped) {
            setError("Nessuna fotocamera trovata sul dispositivo.");
          }
          return;
        }

        await html5QrCode.start(
          backCamera.id,
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText: string) => {
            if (stopped) return;
            stopped = true;
            html5QrCode.stop().catch(() => {});
            onScanRef.current(decodedText);
          },
          () => {
            // ignore errors during scan
          }
        );
      } catch {
        if (!stopped) {
          setError("Impossibile inizializzare lo scanner QR. Prova con un altro browser.");
        }
      }
    };

    initScanner();

    return () => {
      stopped = true;
      if (instance) {
        instance.stop().catch(() => {});
      }
      // Clear the container so no video element lingers after unmount.
      const container = document.getElementById("qr-reader");
      if (container) container.innerHTML = "";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-[var(--color-bg)] flex flex-col items-center justify-center">
      <div className="relative w-full max-w-lg aspect-[3/4] rounded-2xl overflow-hidden bg-black">
        <div id="qr-reader" className="w-full h-full" />
      </div>

      {error && (
        <div className="mt-4 px-6 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm text-center">
          {error}
        </div>
      )}

      <button
        onClick={onClose}
        className="mt-6 px-6 py-2 bg-white/10 text-white rounded-full text-sm hover:bg-white/20 transition-colors cursor-pointer"
      >
        ✕ Chiudi scanner
      </button>
    </div>
  );
}
