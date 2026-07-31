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
    <div className="relative h-dvh overflow-hidden bg-base-100">
      {/* Immagine di sfondo full-bleed */}
      <div className="absolute inset-0 z-0">
        <Image src="/images/hero-bg.jpg" alt="" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1410]/80 via-[#1a1410]/40 to-[#1a1410]/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#c9775e]/8 to-transparent" />
      </div>

      <AnimatePresence>
        {!exiting && (
          <motion.div
            className="relative z-10 flex flex-col items-center justify-center h-full gap-6 sm:gap-8 px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {/* Logo */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="text-3xl sm:text-4xl text-[#e8ddd0]">✦</span>
              </div>
            </motion.div>

            {/* Titolo */}
            <motion.h1
              className="font-display text-center text-[2.6rem] sm:text-5xl md:text-6xl font-bold leading-[1.05] max-w-[90vw] sm:max-w-md tracking-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Il Percorso delle{" "}
              <span className="gradient-text">Sei Parole</span>
            </motion.h1>

            {/* Sottotitolo */}
            <motion.p
              className="text-center text-sm sm:text-base text-base-content/70 leading-relaxed max-w-[85vw] sm:max-w-sm font-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              Ogni esperienza è una tappa del tuo viaggio.{" "}
              Scopri le sei parole esplorando il festival.
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.7 }}
            >
              <button
                onClick={handleStart}
                className="btn btn-primary rounded-full px-10 py-4 text-base font-semibold border-none shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 active:scale-95"
              >
                Inizia il viaggio
              </button>
            </motion.div>

            {/* Testo decorativo */}
            <motion.p
              className="absolute bottom-12 text-[0.6rem] text-base-content/20 font-light tracking-[0.2em] uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              MACASS Psy Workshop
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-base-100 to-transparent z-10 pointer-events-none" />
    </div>
  );
}