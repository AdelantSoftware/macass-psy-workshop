"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { PrimaryButton } from "@/components/ui/Button";

/**
 * Welcome / intro screen. Single CTA "Inizia il viaggio" that fades
 * the page out and routes to /home.
 */
export default function WelcomePage() {
  const router = useRouter();
  const [exiting, setExiting] = useState(false);

  const handleStart = () => {
    setExiting(true);
    setTimeout(() => router.push("/home"), 400);
  };

  return (
    <main className="relative min-h-[100dvh] overflow-hidden safe-inset">
      <div className="absolute inset-0 z-0">
        <Image src="/images/hero-bg.jpg" alt="" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f0a1a]/80 via-[#0f0a1a]/60 to-[#0f0a1a]/90" />
      </div>

      <AnimatePresence>
        {!exiting && (
          <motion.div
            className="relative z-10 flex flex-col items-center justify-center min-h-[100dvh] layout-padding-lg gap-8 sm:gap-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[var(--gradient-hero)] flex items-center justify-center shadow-lg shadow-[#e85a8f]/30">
                <span className="text-3xl sm:text-4xl">✦</span>
              </div>
            </motion.div>

            <motion.h1
              className="font-display text-center text-[2.5rem] sm:text-5xl md:text-6xl font-bold leading-tight max-w-sm sm:max-w-md text-balance"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Il Percorso delle <span className="gradient-text">Sei Parole</span>
            </motion.h1>

            <motion.p
              className="font-body text-center text-[0.95rem] sm:text-lg text-[#c8c0d8] leading-relaxed max-w-xs sm:max-w-sm text-pretty text-shadow-soft"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              Ogni esperienza rappresenta una tappa del tuo viaggio. Per scoprire le sei parole,
              dovrai esplorare il festival e affrontare le sfide che ti accompagneranno verso una
              maggiore <span className="text-[#e85a8f] font-medium">consapevolezza</span>.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.7 }}
            >
              <PrimaryButton size="lg" onClick={handleStart} className="!w-full max-w-[280px]">
                Inizia il viaggio →
              </PrimaryButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-0 left-0 right-0 h-20 bg-[var(--gradient-overlay-top)] z-10 pointer-events-none" />
    </main>
  );
}
