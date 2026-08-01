/* refactored: tokens */
"use client";

import { useEffect, useRef, useState } from "react";
import type { Html5QrcodeCameraScanConfig, QrcodeErrorCallback, QrcodeSuccessCallback } from "html5-qrcode";

interface QRScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
}

type ScannerHandle = {
  stop: () => Promise<void>;
  start: (
    cameraIdOrConfig: string | MediaTrackConstraints,
    configuration: Html5QrcodeCameraScanConfig | undefined,
    qrCodeSuccessCallback: QrcodeSuccessCallback | undefined,
    qrCodeErrorCallback: QrcodeErrorCallback | undefined,
  ) => Promise<null>;
};

export default function QRScanner({ onScan, onClose }: QRScannerProps) {
  const [error, setError] = useState<string | null>(null);
  const [cameras, setCameras] = useState<{ id: string; label: string }[]>([]);

  const onScanRef = useRef(onScan);
  onScanRef.current = onScan;
  const scannerRef = useRef<ScannerHandle | null>(null);
  const currentCameraIdxRef = useRef(0);
  const stoppedRef = useRef(false);
  const isSwitchingRef = useRef(false);

  const startScanner = async (
    handle: ScannerHandle,
    cameraId: string,
  ) => {
    await handle.start(
      cameraId,
      { fps: 10, qrbox: { width: 250, height: 250 } },
      (decodedText: string) => {
        if (stoppedRef.current) return;
        stoppedRef.current = true;
        handle.stop().catch(() => {});
        onScanRef.current(decodedText);
      },
      () => {
        // ignore errors during scan
      },
    );
  };

  useEffect(() => {
    const initScanner = async () => {
      try {
        const { Html5Qrcode } = await import("html5-qrcode");

        const container = document.getElementById("qr-reader");
        if (container) container.innerHTML = "";

        const html5QrCode = new Html5Qrcode("qr-reader");
        scannerRef.current = html5QrCode;

        const availableCameras = await Html5Qrcode.getCameras();
        setCameras(availableCameras);

        // Pick back camera initially, or first available
        const initialIndex = availableCameras.findIndex(
          (c) => /back|rear|environment/i.test(c.label),
        );
        const idx = initialIndex >= 0 ? initialIndex : 0;
        currentCameraIdxRef.current = idx;

        const camera = availableCameras[idx];
        if (!camera) {
          if (!stoppedRef.current) {
            setError("Nessuna fotocamera trovata sul dispositivo.");
          }
          return;
        }

        await startScanner(html5QrCode, camera.id);
      } catch {
        if (!stoppedRef.current) {
          setError(
            "Impossibile inizializzare lo scanner QR. Prova con un altro browser.",
          );
        }
      }
    };

    initScanner();

    return () => {
      stoppedRef.current = true;
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
        scannerRef.current = null;
      }
      const container = document.getElementById("qr-reader");
      if (container) container.innerHTML = "";
    };
  }, []);

  const switchCamera = async () => {
    if (cameras.length < 2 || isSwitchingRef.current) return;
    isSwitchingRef.current = true;

    if (scannerRef.current) {
      await scannerRef.current.stop().catch(() => {});
      scannerRef.current = null;
    }

    // Reset per permettere al nuovo scanner di funzionare
    stoppedRef.current = false;

    const nextIndex = (currentCameraIdxRef.current + 1) % cameras.length;
    currentCameraIdxRef.current = nextIndex;

    try {
      const { Html5Qrcode } = await import("html5-qrcode");

      const container = document.getElementById("qr-reader");
      if (container) container.innerHTML = "";

      const html5QrCode = new Html5Qrcode("qr-reader");
      scannerRef.current = html5QrCode;

      await startScanner(html5QrCode, cameras[nextIndex].id);
    } catch {
      if (!stoppedRef.current) {
        setError("Errore nel cambio fotocamera.");
      }
    } finally {
      isSwitchingRef.current = false;
    }
  };

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

      <div className="mt-6 flex gap-3">
        {cameras.length > 1 && (
          <button
            onClick={switchCamera}
            className="px-4 py-2 bg-white/10 text-white rounded-full text-sm hover:bg-white/20 transition-colors cursor-pointer flex items-center gap-2"
          >
            ⟳ Ruota fotocamera
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