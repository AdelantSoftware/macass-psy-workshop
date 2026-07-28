"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function WelcomePage() {
  const router = useRouter();
  const [exiting, setExiting] = useState(false);

  const handleStart = () => {
    setExiting(true);
    setTimeout(() => router.push("/home"), 500);
  };

  return (
    <main
      className={`relative min-h-dvh flex items-center justify-center overflow-hidden transition-opacity duration-500 ${
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
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f0a1a]/80 via-[#0f0a1a]/60 to-[#0f0a1a]/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto stagger">
        {/* Logo / Icon */}
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[#e85a8f] to-[#5ae8c8] flex items-center justify-center animate-float">
            <span className="text-3xl">✦</span>
          </div>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Il Percorso delle{" "}
          <span className="gradient-text">Sei Parole</span>
        </h1>

        <p className="text-lg md:text-xl text-[#8b85a0] mb-10 leading-relaxed">
          Ogni esperienza rappresenta una tappa del tuo viaggio. Durante questo
          percorso incontrerai sei parole. Per scoprirle dovrai esplorare il
          festival, trovare i sei QR Code nascosti e affrontare le sfide che ti
          accompagneranno verso una maggiore <span className="text-[#e85a8f]">consapevolezza</span>.
        </p>

        <button
          onClick={handleStart}
          className="px-10 py-4 bg-gradient-to-r from-[#e85a8f] to-[#c84a7a] text-white text-lg font-semibold rounded-full hover:scale-105 transition-transform animate-pulse-glow cursor-pointer"
        >
          Inizia il viaggio →
        </button>
      </div>

      {/* Decorative particles */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0f0a1a] to-transparent z-10" />
    </main>
  );
}
