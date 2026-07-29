import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface SectionTitleProps {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
  center?: boolean;
}

const sizeClass = {
  sm: "text-lg sm:text-xl",
  md: "text-2xl sm:text-3xl",
  lg: "text-3xl sm:text-4xl",
};

/**
 * Page or section heading. Defaults to md-size + bold display font.
 */
export function SectionTitle({
  children,
  className,
  size = "md",
  center = false,
}: SectionTitleProps) {
  return (
    <h2
      className={cn(
        "font-display font-bold text-pretty",
        sizeClass[size],
        center && "text-center",
        className,
      )}
    >
      {children}
    </h2>
  );
}

interface EyebrowProps {
  children: ReactNode;
  className?: string;
  accent?: string;
}

/** Small uppercase tag rendered above titles. */
export function Eyebrow({ children, className, accent = "var(--color-accent)" }: EyebrowProps) {
  return (
    <p
      className={cn(
        "text-[10px] sm:text-xs font-semibold uppercase tracking-[0.28em] sm:tracking-[0.34em]",
        className,
      )}
      style={{ color: accent }}
    >
      {children}
    </p>
  );
}
