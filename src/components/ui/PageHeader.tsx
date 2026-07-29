/* refactored: tokens */
import Link from "next/link";
import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

interface PageHeaderProps {
  /** Page title (h1) */
  title: ReactNode;
  /** Optional subtitle below the title */
  subtitle?: ReactNode;
  /** Optional leading "back to home" arrow (rendered as Link) */
  backHref?: string;
  backLabel?: string;
  /** Optional inline element in the bottom area (e.g. progress bar) */
  footer?: ReactNode;
  /** Use lighter padding for visual sub-pages */
  dense?: boolean;
  /** Optional center className override */
  className?: string;
}

/**
 * Standard top-of-page banner: title (with optional subtitle and back link).
 * Renders the back link ABOVE the title on small screens and floating
 * alongside the title on larger screens — never overlapping.
 */
export function PageHeader({
  title,
  subtitle,
  backHref,
  backLabel = "Home",
  footer,
  dense = false,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "relative border-b border-white/5 layout-padding text-center",
        dense ? "py-8 sm:py-10" : "py-12 sm:py-16",
        className,
      )}
    >
      {backHref && (
        <nav className="mb-3 sm:absolute sm:mb-0 sm:left-4 sm:top-1/2 sm:-translate-y-1/2 sm:left-6">
          <Link
            href={backHref}
            className="inline-flex items-center gap-1 text-sm text-[var(--color-muted-strong)] hover:text-white transition-colors min-h-[44px] min-w-[44px] px-2 sm:px-0"
          >
            <span aria-hidden="true">←</span>
            <span className="sm:sr-only">{backLabel}</span>
            <span className="hidden sm:inline">{backLabel}</span>
          </Link>
        </nav>
      )}
      <motion.h1
        className="font-display font-bold text-pretty text-balance text-2xl sm:text-3xl md:text-4xl"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {title}
      </motion.h1>
      {subtitle && (
        <motion.p
          className="mt-1 text-sm text-[var(--color-muted-strong)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {subtitle}
        </motion.p>
      )}
      {footer && <div className="mt-6 sm:mt-8">{footer}</div>}
    </header>
  );
}
