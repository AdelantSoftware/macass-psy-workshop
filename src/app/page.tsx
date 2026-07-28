"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function WelcomePage() {
  const router = useRouter();
  const [exiting, setExiting] = useState(false);

  const handleStart = () => {
    setExiting(true);
    setTimeout(() => router.push("/home"), 400);
  };

  return (
    <main className="relative min-h-[100dvh] overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image src="/images/hero-bg.jpg" alt="" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f0a1a]/80 via-[#0f0a1a]/60 to-[#0f0a1a]/90" />
      </div>

      {/* Centered content */}
      <AnimatePresence>
        {!exiting && (
          <motion.div
            className="relative z-10 flex flex-col items-center justify-center min-h-[100dvh] px-6 py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {/* Logo icon — truly centered */}
            <motion.div
              className="mb-8"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#e85a8f] to-[#5ae8c8] flex items-center justify-center shadow-lg shadow-[#e85a8f]/20">
                <span className="text-2xl sm:text-3xl">✦</span>
              </div>
            </motion.div>

            {/* Title — centered, high contrast */}
            <motion.h1
              className="font-display text-center text-[2.2rem] leading-[1.15] sm:text-5xl md:text-6xl font-bold mb-5 sm:mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Il Percorso delle{" "}
              <span className="gradient-text">Sei Parole</span>
            </motion.h1>

            {/* Body text — readable, contrasted, warm tone */}
            <motion.p
              className="font-body text-center text-[0.95rem] sm:text-lg text-[#c8c0d8] mb-8 sm:mb-10 leading-relaxed max-w-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              style={{ textShadow: "0 1px 8px rgba(0,0,0,0.5)" }}
            >
              Ogni esperienza rappresenta una tappa del tuo viaggio.
              <br className="hidden sm:block" />
              Durante questo percorso incontrerai sei parole.
              <br className="hidden sm:block" />
              Per scoprirle dovrai esplorare il festival, trovare i sei QR Code
              nascosti e affrontare le sfide che ti accompagneranno verso una
              maggiore{" "}
              <span className="text-[#e85a8f] font-medium">consapevolezza</span>.
            </motion.p>

            {/* CTA button — warm, visible */}
            <motion.button
              onClick={handleStart}
              className="font-display px-10 py-4 bg-gradient-to-r from-[#e85a8f] to-[#c84a7a] text-white text-lg font-semibold rounded-full cursor-pointer min-h-[50px] shadow-lg shadow-[#e85a8f]/25"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.7 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Inizia il viaggio →
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#0f0a1a] to-transparent z-10" />
    </main>
  );
}
