"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";

export default function WelcomePage() {
  const router = useRouter();
  const [exiting, setExiting] = useState(false);

  const handleStart = () => {
    setExiting(true);
    setTimeout(() => router.push("/home"), 400);
  };

  return (
    <div className="relative min-h-dvh overflow-hidden">
      {/* Background image — softer overlay */}
      <div className="absolute inset-0 z-0">
        <Image src="/images/hero-bg.jpg" alt="" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1410]/85 via-[#1a1410]/50 to-[#1a1410]/92" />
        {/* Warm vignette overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#c9775e]/10 to-transparent" />
      </div>

      <AnimatePresence>
        {!exiting && (
          <motion.div
            className="relative z-10 flex flex-col items-center justify-center min-h-dvh gap-8 sm:gap-10 px-6 sm:px-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {/* Logo mark — warm clay circle */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-[#c9775e] to-[#7fa87f] flex items-center justify-center shadow-lg shadow-[#c9775e]/20">
                <span className="text-3xl sm:text-4xl text-[#e8ddd0]">✦</span>
              </div>
            </motion.div>

            {/* Title — larger, more breathing room */}
            <motion.h1
              className="font-display text-center text-[2.8rem] sm:text-5xl md:text-7xl font-bold leading-[1.05] max-w-[90vw] sm:max-w-lg tracking-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Il Percorso delle{" "}
              <span className="gradient-text">Sei Parole</span>
            </motion.h1>

            {/* Subtitle — warmer, more poetic */}
            <motion.p
              className="text-center text-sm sm:text-base md:text-lg text-[#e8ddd0]/55 leading-relaxed max-w-[85vw] sm:max-w-md font-light tracking-wide"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              Ogni esperienza è una tappa del tuo viaggio.{" "}
              Scopri le sei parole esplorando il festival,
              affrontando le sfide che ti accompagneranno verso una maggiore{" "}
              <span className="text-[#c9775e] font-medium">consapevolezza</span>.
            </motion.p>

            {/* CTA — warm button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.7 }}
            >
              <Button
                size="xl"
                onClick={handleStart}
                className="w-full max-w-[280px] rounded-full"
              >
                Inizia il viaggio →
              </Button>
            </motion.div>

            {/* Decorative bottom text */}
            <motion.p
              className="absolute bottom-12 text-xs text-[#e8ddd0]/20 font-light tracking-widest uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              MACASS Psy Workshop
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#1a1410] to-transparent z-10 pointer-events-none" />
    </div>
  );
}