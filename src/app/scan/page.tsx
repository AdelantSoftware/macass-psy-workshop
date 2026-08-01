"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { STEPS } from "@/data/steps";
import { useProgress } from "@/hooks/useProgress";
import QRScanner from "@/components/QRScanner";

export default function ScanPage() {
  const router = useRouter();
  const { unlockStep, canScan } = useProgress();

  const handleScan = useCallback(
    (data: string) => {
      const scanned = data.trim().toUpperCase();
      const matched = STEPS.find(
        (s) => scanned === s.secretWord.toUpperCase(),
      );
      if (matched && canScan(matched.id)) {
        unlockStep(matched.id);
        router.push(`/tappa/${matched.id}`);
      } else {
        alert("QR Code non valido per nessuna tappa.");
        router.push("/home");
      }
    },
    [unlockStep, canScan, router],
  );

  return <QRScanner onScan={handleScan} onClose={() => router.push("/home")} />;
}