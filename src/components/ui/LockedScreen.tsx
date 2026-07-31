"use client";

import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LockedScreenProps {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description: React.ReactNode;
  primaryAction: { label: string; onClick: () => void };
  secondaryAction?: { label: string; render: (onClick: () => void) => React.ReactNode };
  footerLink?: { href: string; label: string };
}

export function LockedScreen({ icon = "🔒", title, description, primaryAction, secondaryAction, footerLink }: LockedScreenProps) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="hero min-h-dvh bg-base-100">
      <div className="hero-content text-center max-w-sm">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-4">
          <div className="text-4xl mb-2">{icon}</div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <div className="text-base-content/60 text-sm">{description}</div>
          <Button onClick={primaryAction.onClick} size="lg" className="mt-2">{primaryAction.label}</Button>
          {secondaryAction && (
            <>
              <button onClick={() => setExpanded(v => !v)} className="link link-hover text-xs text-base-content/60 mt-2">
                {secondaryAction.label}
              </button>
              <AnimatePresence>
                {expanded && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden w-full">
                    <div className="pt-3">{secondaryAction.render(() => setExpanded(false))}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
          {footerLink && <a href={footerLink.href} className="link link-hover text-sm text-base-content/60 mt-2">← {footerLink.label}</a>}
        </motion.div>
      </div>
    </div>
  );
}

interface ManualCodeFormProps {
  stepId: number;
  secretWord: string;
  onSubmit: (code: number) => void;
  gateLocked: boolean;
}

export function ManualCodeForm({ stepId, secretWord, onSubmit, gateLocked }: ManualCodeFormProps) {
  const [code, setCode] = useState("");
  const submit = () => {
    if (gateLocked) { alert("Devi prima completare la tappa precedente."); return; }
    if (code.trim().toUpperCase() === secretWord.toUpperCase()) onSubmit(stepId);
    else alert("Parola non valida.");
  };
  return (
    <div className="card bg-base-200 border border-base-300">
      <div className="card-body gap-2">
        <p className="text-xs text-base-content/60 text-left">
          Inserisci la parola segreta comunicata dall&rsquo;organizzatore:
        </p>
        <div className="join">
          <input
            type="text"
            value={code}
            onChange={e => setCode(e.target.value)}
            onKeyDown={e => e.key === "Enter" && submit()}
            autoCapitalize="characters"
            className="input input-bordered join-item flex-1 text-center text-lg font-bold uppercase"
            placeholder="parola segreta"
          />
          <Button onClick={submit} variant="primary" size="md" className="join-item">OK</Button>
        </div>
      </div>
    </div>
  );
}