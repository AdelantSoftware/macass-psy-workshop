/* refactored: tokens */
"use client";

import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GhostButton, PrimaryButton } from "@/components/ui/Button";

interface LockedScreenProps {
  /** Emoji or short tag rendered in the lock circle */
  icon?: ReactNode;
  /** Title (e.g. "Tappa bloccata") */
  title: ReactNode;
  /** Body explanation */
  description: ReactNode;
  /** Primary call-to-action */
  primaryAction: { label: string; onClick: () => void };
  /** Optional secondary action (e.g. "manual code") */
  secondaryAction?: { label: string; render: (onClick: () => void) => ReactNode };
  /** Footer link (e.g. back to home) */
  footerLink?: { href: string; label: string };
}

/**
 * Full-screen "locked" placeholder. Used both when a tappa must be unlocked
 * by scanning a QR code AND when the finale is gated behind completion.
 *
 * Center-aligned, generous padding, mobile-first (max-width caps on larger
 * screens so text never gets too wide).
 */
export function LockedScreen({
  icon = "🔒",
  title,
  description,
  primaryAction,
  secondaryAction,
  footerLink,
}: LockedScreenProps) {
  const [expanded, setExpanded] = useState(false);
  return (
    <main className="min-h-dvh bg-[var(--color-bg)] flex items-center justify-center layout-padding safe-inset">
      <motion.div
        className="text-center max-w-sm w-full animate-fade-in-up"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-5 sm:mb-6 rounded-full bg-white/5 flex items-center justify-center text-3xl sm:text-4xl">
          {icon}
        </div>
        <h1 className="text-xl sm:text-2xl font-bold mb-3 text-balance">{title}</h1>
        <div className="text-[var(--color-muted-strong)] mb-5 sm:mb-6 text-sm sm:text-base">
          {description}
        </div>
        <PrimaryButton onClick={primaryAction.onClick}>
          {primaryAction.label}
        </PrimaryButton>

        {secondaryAction && (
          <div className="mt-4">
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="text-xs text-[var(--color-muted-strong)] hover:text-white transition-colors mt-2 min-h-[44px] px-2 py-2"
            >
              {secondaryAction.label}
            </button>
            <AnimatePresence initial={false}>
              {expanded && (
                <motion.div
                  key="secondary"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="pt-3">
                    {secondaryAction.render(() => setExpanded(false))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {footerLink && (
          <div className="mt-4">
            <a
              href={footerLink.href}
              className="text-sm text-[var(--color-muted-strong)] hover:text-white transition-colors min-h-[44px] inline-flex items-center"
            >
              ← {footerLink.label}
            </a>
          </div>
        )}
      </motion.div>
    </main>
  );
}

interface ManualCodeFormProps {
  /** Title of the current step (used in success/error messaging) */
  stepId: number;
  /** Submit handler — receives the entered code */
  onSubmit: (code: number) => void;
  /** When true, the previous step hasn't been completed yet */
  gateLocked: boolean;
}

/**
 * Minimal numeric-code fallback for users without a working camera.
 * Embedded inside LockedScreen via the `secondaryAction.render` slot.
 */
export function ManualCodeForm({ stepId, onSubmit, gateLocked }: ManualCodeFormProps) {
  const [code, setCode] = useState("");
  const submit = () => {
    const num = Number(code);
    if (gateLocked) {
      window.alert("Devi prima completare la tappa precedente.");
      return;
    }
    if (num >= 1 && num <= 6 && num === stepId) onSubmit(num);
    else window.alert("Codice non valido.");
  };
  return (
    <div className="p-3 sm:p-4 bg-white/5 rounded-xl border border-white/10">
      <p className="text-xs text-[var(--color-muted-strong)] mb-2 text-left">
        Inserisci il numero della tappa (1-6):
      </p>
      <div className="flex gap-2">
        <input
          type="number"
          min={1}
          max={6}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
          className="flex-1 px-3 py-2 bg-[var(--color-surface)] border border-white/10 rounded-lg text-white text-center text-lg font-bold focus:outline-none focus:border-[var(--color-accent)] min-h-[48px]"
          placeholder="?"
        />
        <GhostButton size="sm" onClick={submit} className="!bg-[var(--color-accent)] !border-[var(--color-accent)] text-white">
          OK
        </GhostButton>
      </div>
    </div>
  );
}
