/* refactored: tokens */
"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/cn";
import { type ReactNode, forwardRef } from "react";

type Size = "sm" | "md" | "lg";

/**
 * framer-motion extends the native button event surface with its own
 * drag handlers (typed as `PointerEvent + PanInfo`). To avoid the
 * `onDrag` type collision, we pull the prop types straight from
 * framer-motion and omit `ref` (we forward manually).
 */
type MotionButtonProps = Omit<HTMLMotionProps<"button">, "ref" | "children">;

interface PrimaryButtonProps extends MotionButtonProps {
  size?: Size;
  leading?: ReactNode;
  trailing?: ReactNode;
  children?: ReactNode;
}

const sizeClass: Record<Size, string> = {
  sm: "px-4 py-2 text-sm min-h-[40px]",
  md: "px-6 py-3 text-sm sm:text-base min-h-[48px]",
  lg: "px-8 py-4 text-base sm:text-lg min-h-[56px]",
};

const baseClass =
  "inline-flex items-center justify-center gap-2 font-semibold rounded-full select-none cursor-pointer";

/**
 * Primary CTA — gradient pink, scales on hover/tap.
 * For ghost/icon variants use the dedicated components.
 */
export const PrimaryButton = forwardRef<HTMLButtonElement, PrimaryButtonProps>(
  function PrimaryButton(
    { size = "md", className, leading, trailing, children, ...rest },
    ref,
  ) {
    return (
      <motion.button
        ref={ref}
        whileHover={rest.disabled ? undefined : { scale: 1.05 }}
        whileTap={rest.disabled ? undefined : { scale: 0.95 }}
        className={cn(
          baseClass,
          sizeClass[size],
          "bg-[var(--gradient-cta)] text-white shadow-[0_8px_32px_var(--color-accent)]",
          rest.disabled && "opacity-50 cursor-not-allowed",
          className,
        )}
        {...rest}
      >
        {leading}
        {children}
        {trailing}
      </motion.button>
    );
  },
);

interface GhostButtonProps extends MotionButtonProps {
  size?: Size;
  children?: ReactNode;
  /** Color used for the inner stroke / text. Defaults to primary pink. */
  accent?: string;
}

/**
 * Outlined / lower-emphasis CTA — used for secondary actions like
 * "ricomincia", "chiudi scanner", etc.
 */
export const GhostButton = forwardRef<HTMLButtonElement, GhostButtonProps>(
  function GhostButton(
    { size = "md", className, children, accent = "var(--color-accent)", ...rest },
    ref,
  ) {
    return (
      <motion.button
        ref={ref}
        whileHover={rest.disabled ? undefined : { scale: 1.04 }}
        whileTap={rest.disabled ? undefined : { scale: 0.96 }}
        className={cn(
          baseClass,
          sizeClass[size],
          "bg-white/5 border border-white/15 text-white rounded-full",
          rest.disabled && "opacity-50 cursor-not-allowed",
          className,
        )}
        style={{
          borderColor: `${accent}55`,
          color: accent,
        }}
        {...rest}
      >
        {children}
      </motion.button>
    );
  },
);
