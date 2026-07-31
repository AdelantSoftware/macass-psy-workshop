"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FULL_PHRASE } from "@/data/steps";
import { useProgress } from "@/hooks/useProgress";
import { LockedScreen } from "@/components/ui/LockedScreen";

export default function FinalePage() {
  const { allCompleted } = useProgress();
  const router = useRouter();

  if (!allCompleted) {
    return (
      <LockedScreen
        icon="🔒"
        title="Non ancora!"
        description="Completa tutte le 6 tappe per sbloccare la schermata finale."
        primaryAction={{ label: "Torna alla Home", onClick: () => router.push("/home") }}
      />
    );
  }

  return (
    <div className="relative min-h-dvh flex items-center justify-center bg-base-100 layout-padding py-12">
      {/* Sfondo */}
      <div className="absolute inset-0 z-0">
        <Image src="/img/sfondo-2.jpg" alt="" fill className="object-cover" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-b from-base-100/80 via-base-100/60 to-base-100" />
      </div>

      <div className="mt-3 relative z-10 w-full max-w-sm mx-auto text-center flex flex-col items-center gap-8">

        {/* Logo */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-base-100/10 backdrop-blur-sm border border-white/15 shadow-lg shadow-primary/20 flex items-center justify-center overflow-hidden">
            <Image
              src="/img/logo.jpg"
              alt="Logo MACASS Psy"
              width={96}
              height={96}
              className="rounded-full object-cover w-full h-full"
            />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="font-display text-3xl sm:text-4xl font-bold"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Complimenti! 🎉
        </motion.h1>

        <motion.p
          className="text-sm text-base-content/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Hai completato tutte e sei le tappe.
        </motion.p>

        {/* Words card */}
        <motion.div
          className="card bg-base-200 border border-base-300/40 w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="card-body items-center gap-4">
            <p className="text-[0.6rem] text-base-content/40 uppercase tracking-widest">
              Le sei parole
            </p>
            <motion.p
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.3 }}
              className="font-display text-3xl sm:text-4xl font-bold gradient-text leading-tight"
            >
              {FULL_PHRASE}
            </motion.p>
          </div>
        </motion.div>

        {/* Workshop CTA */}
        <motion.div
          className="card bg-base-200 border border-primary/10 w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <div className="card-body items-center gap-3">
            <h2 className="card-title font-display text-xl sm:text-2xl gradient-text">
              Workshop di Psicologia
            </h2>
            <p className="text-xs sm:text-sm text-base-content/60">
              Ti aspetto al workshop per il{" "}
              <span className="text-primary">Muro della consapevolezza</span>.
            </p>
            <span className="badge badge-outline badge-primary badge-sm">
              🧠 Scopri di più su te stesso
            </span>
            <a
              href="https://www.eventbrite.it/e/workshop-di-psicologia-la-voce-che-non-sapevo-di-avere-tickets-1994898708739?aff=odcleoeventsincollection&utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAdGRleATZxDNwZG9mAmV4dG4DYWVtAjExAHNydGMGYXBwX2lkDzEyNDAyNDU3NDI4NzQxNAABpyUirsDJZsuy_51AvPpXyei0-a3KOotNKVz4aHf2IDpHqmfqqQXKvnsc0Pbx_aem_8J0rReqBjXRj-eE4a3KEZQ"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary rounded-full px-8 mt-1"
            >
              Registrati all&rsquo;evento →
            </a>
          </div>
        </motion.div>

        {/* Reset link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          <button
            onClick={() => router.push("/")}
            className="link link-hover text-xs text-base-content/30 hover:text-base-content/50"
          >
            ↻ Ricominciare il percorso
          </button>
        </motion.div>
      </div>
    </div>
  );
}