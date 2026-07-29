import { cn } from "@/lib/cn";

type Size = "sm" | "md" | "lg";

interface IconBadgeProps {
  children: React.ReactNode;
  color?: string;
  size?: Size;
  className?: string;
  /** Show a soft outline border in the same color */
  ring?: boolean;
}

const sizeClass: Record<Size, string> = {
  sm: "h-6 w-6 text-[10px]",
  md: "h-8 w-8 text-xs sm:h-10 sm:w-10 sm:text-sm",
  lg: "h-14 w-14 text-base sm:h-16 sm:w-16 sm:text-xl",
};

/**
 * Round colored badge. Used to render the numbered step circles
 * (on the home page and on individual tappa detail pages).
 */
export function IconBadge({
  children,
  color = "var(--color-accent)",
  size = "md",
  className,
  ring = false,
}: IconBadgeProps) {
  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center text-white font-bold shrink-0",
        sizeClass[size],
        className,
      )}
      style={{
        backgroundColor: color,
        ...(ring ? { boxShadow: `0 0 0 2px ${color}22` } : null),
      }}
    >
      {children}
    </div>
  );
}
