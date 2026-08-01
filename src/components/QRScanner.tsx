/* refactored: tokens */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Html5QrcodeCameraScanConfig } from "html5-qrcode";

interface QRScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
}

type ScannerHandle = {
  stop: () => Promise<void>;
  start: (
    cameraIdOrConfig: string | MediaTrackConstraints,
    configuration: Html5QrcodeCameraScanConfig | undefined,
    qrCodeSuccessCallback: (text: string) => void,
    qrCodeErrorCallback: () => void,
  ) => Promise<null>;
};

type CameraDevice = { id: string; label: string };

export default function QRScanner({ onScan, onClose }: QRScannerProps) {
  const [error, setError] = useState<string | null>(null);
  const [cameras, setCameras] = useState<CameraDevice[]>([]);
  const [switching, setSwitching] = useState(false);

  const onScanRef = useRef(onScan);
  onScanRef.current = onScan;
  const scannerRef = useRef<ScannerHandle | null>(null);
  const cameraIdxRef = useRef(0);
  const aliveRef = useRef(true); // true = component mounted, false = unmounting

  // --- helpers ---

  const clearContainer = useCallback(() => {
    const el = document.getElementById("qr-reader");
    if (el) el.innerHTML = "";
  }, []);

  const stopCurrent = useCallback(async () => {
    const s = scannerRef.current;
    if (s) {
      scannerRef.current = null;
      await s.stop().catch(() => {});
    }
    clearContainer();
  }, [clearContainer]);

  const startScanner = useCallback(
    async (scanner: ScannerHandle, cameraId: string) => {
      await scanner.start(
        cameraId,
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText: string) => {
          if (!aliveRef.current) return;
          aliveRef.current = false; // stop accepting further scans
          scanner.stop().catch(() => {});
          onScanRef.current(decodedText);
        },
        () => {
          /* ignore per-frame errors */
        },
      );
    },
    [],
  );

  // --- initialisation (runs once on mount) ---

  useEffect(() => {
    aliveRef.current = true;

    (async () => {
      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        if (!aliveRef.current) return;

        clearContainer();
        const scanner = new Html5Qrcode("qr-reader");
        scannerRef.current = scanner;

        const available: CameraDevice[] = await Html5Qrcode.getCameras();
        if (!aliveRef.current) return;
        setCameras(available);

        const backIdx = available.findIndex((c) =>
          /back|rear|environment/i.test(c.label),
        );
        const idx = backIdx >= 0 ? backIdx : 0;
        cameraIdxRef.current = idx;

        const cam = available[idx];
        if (!cam) {
          setError("Nessuna fotocamera trovata sul dispositivo.");
          return;
        }

        await startScanner(scanner, cam.id);
      } catch {
        if (aliveRef.current) {
          setError(
            "Impossibile inizializzare lo scanner QR. Prova con un altro browser.",
          );
        }
      }
    })();

    return () => {
      aliveRef.current = false;
      stopCurrent();
    };
  }, [clearContainer, startScanner, stopCurrent]);

  // --- switch camera ---

  const switchCamera = useCallback(async () => {
    if (cameras.length < 2 || switching || !aliveRef.current) return;
    setSwitching(true);
    setError(null);

    await stopCurrent();

    const nextIdx = (cameraIdxRef.current + 1) % cameras.length;
    cameraIdxRef.current = nextIdx;

    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      if (!aliveRef.current) return;

      clearContainer();
      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;

      await startScanner(scanner, cameras[nextIdx].id);
    } catch {
      if (aliveRef.current) {
        setError("Errore nel cambio fotocamera.");
      }
    } finally {
      if (aliveRef.current) setSwitching(false);
    }
  }, [cameras, switching, clearContainer, startScanner, stopCurrent]);

  // --- render ---

  return (
    <div className="fixed inset-0 z-50 bg-[var(--color-bg)] flex flex-col items-center justify-center">
      <div className="relative w-full max-w-lg aspect-[3/4] rounded-2xl overflow-hidden bg-black">
        <div id="qr-reader" className="w-full h-full" />

        {/* switching overlay */}
        {switching && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
            <div className="flex flex-col items-center gap-2">
              <div className="h-8 w-8 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              <span className="text-xs text-white/70">Cambio fotocamera…</span>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 px-6 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm text-center max-w-sm">
          {error}
        </div>
      )}

      <div className="mt-6 flex gap-3">
        {cameras.length > 1 && (
          <button
            onClick={switchCamera}
            disabled={switching}
            className="px-4 py-2 bg-white/10 text-white rounded-full text-sm hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center gap-2"
          >
            {switching ? "⟳" : "⟳ Ruota fotocamera"}
          </button>
        )}

        <button
          onClick={onClose}
          className="px-6 py-2 bg-white/10 text-white rounded-full text-sm hover:bg-white/20 transition-colors cursor-pointer"
        >
          ✕ Chiudi scanner
        </button>
      </div>
    </div>
  );
}