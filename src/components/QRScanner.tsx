"use client";

import { useEffect, useRef, useState } from "react";

interface QRScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
}

export default function QRScanner({ onScan, onClose }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let animationId: number | null = null;
    let stopped = false;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        if (stopped) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setScanning(true);
        }
      } catch {
        setError("Camera non accessibile. Verifica i permessi del browser.");
      }
    };

    startCamera();

    return () => {
      stopped = true;
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  // Try using html5-qrcode
  useEffect(() => {
    if (!scanning) return;

    let scanner: unknown = null;

    const initScanner = async () => {
      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        const html5QrCode = new Html5Qrcode("qr-reader");
        scanner = html5QrCode;
        await html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText: string) => {
            onScan(decodedText);
            html5QrCode.stop().catch(() => {});
          },
          () => {
            // ignore errors during scan
          }
        );
      } catch {
        setError("Impossibile inizializzare lo scanner QR. Prova con un altro browser.");
      }
    };

    initScanner();

    return () => {
      if (scanner && typeof scanner === "object" && "stop" in scanner) {
        (scanner as { stop: () => Promise<void> }).stop().catch(() => {});
      }
    };
  }, [scanning, onScan]);

  return (
    <div className="fixed inset-0 z-50 bg-[#0f0a1a] flex flex-col items-center justify-center">
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
