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
    <main className="relative min-h-[100dvh] overflow-hidden safe-inset">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image src="/images/hero-bg.jpg" alt="" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f0a1a]/80 via-[#0f0a1a]/60 to-[#0f0a1a]/90" />
      </div>

      {/* Content — flex column with gap, centered */}
      <AnimatePresence>
        {!exiting && (
          <motion.div
            className="relative z-10 flex flex-col items-center justify-center min-h-[100dvh] layout-padding gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {/* Icon — micro-spacing: gap-2 to title */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-[#e85a8f] to-[#5ae8c8] flex items-center justify-center shadow-lg shadow-[#e85a8f]/30">
                <span className="text-3xl sm:text-4xl">✦</span>
              </div>
            </motion.div>

            {/* Title — space above > space below (2x rule) */}
            <motion.h1
              className="font-display text-center text-[2.5rem] sm:text-5xl md:text-6xl font-bold leading-tight max-w-sm sm:max-w-md"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Il Percorso delle{" "}
              <span className="gradient-text">Sei Parole</span>
            </motion.h1>

            {/* Body text — gap-3 below title, gap-6 to button */}
            <motion.p
              className="font-body text-center text-[0.95rem] sm:text-lg text-[#c8c0d8] leading-relaxed max-w-xs sm:max-w-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              style={{ textShadow: "0 1px 8px rgba(0,0,0,0.5)" }}
            >
              Ogni esperienza rappresenta una tappa del tuo viaggio.
              Per scoprire le sei parole, dovrai esplorare il festival e affrontare
              le sfide che ti accompagneranno verso una maggiore{" "}
              <span className="text-[#e85a8f] font-medium">consapevolezza</span>.
            </motion.p>

            {/* Button — macro-spacing: gap-8 from text */}
            <motion.button
              onClick={handleStart}
              className="font-display text-xl sm:text-2xl font-bold text-white rounded-full cursor-pointer min-h-[56px] px-12 py-5 w-full max-w-[280px]"
              style={{
                background: "linear-gradient(135deg, #e85a8f 0%, #c84a7a 50%, #a83a6a 100%)",
                boxShadow: "0 8px 32px rgba(232, 90, 143, 0.5), 0 2px 8px rgba(0,0,0,0.3)",
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.7 }}
              whileHover={{ scale: 1.05, boxShadow: "0 12px 40px rgba(232, 90, 143, 0.6)" }}
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