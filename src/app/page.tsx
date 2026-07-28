"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function WelcomePage() {
  const router = useRouter();
  const [exiting, setExiting] = useState(false);

  const handleStart = () => {
    setExiting(true);
    setTimeout(() => router.push("/home"), 400);
  };

  return (
    <main
      className={`relative min-h-dvh flex flex-col items-center justify-center px-5 safe-inset transition-opacity duration-400 ${
        exiting ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-bg.jpg"
          alt=""
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f0a1a]/70 via-[#0f0a1a]/50 to-[#0f0a1a]/85" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-md w-full stagger">
        {/* Logo */}
        <div className="mb-6 sm:mb-8">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-gradient-to-br from-[#e85a8f] to-[#5ae8c8] flex items-center justify-center animate-float">
            <span className="text-2xl sm:text-3xl">✦</span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-5 sm:mb-6 leading-tight">
          Il Percorso delle{" "}
          <span className="gradient-text">Sei Parole</span>
        </h1>

        <p className="text-base sm:text-lg text-[#8b85a0] mb-8 sm:mb-10 leading-relaxed px-2">
          Ogni esperienza rappresenta una tappa del tuo viaggio. Durante questo
          percorso incontrerai sei parole. Per scoprirle dovrai esplorare il
          festival, trovare i sei QR Code nascosti e affrontare le sfide che ti
          accompagneranno verso una maggiore{" "}
          <span className="text-[#e85a8f] font-medium">consapevolezza</span>.
        </p>

        <button
          onClick={handleStart}
          className="px-8 py-4 sm:px-10 sm:py-4 bg-gradient-to-r from-[#e85a8f] to-[#c84a7a] text-white text-lg font-semibold rounded-full hover:scale-105 active:scale-95 transition-transform animate-pulse-glow cursor-pointer min-h-[48px]"
        >
          Inizia il viaggio →
        </button>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0f0a1a] to-transparent z-10" />
    </main>
  );
}
