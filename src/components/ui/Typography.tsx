import { cn } from "@/lib/cn";

export function SectionTitle({ children, className, size = "md", center = false }: {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
  center?: boolean;
}) {
  const sizeClass = { sm: "text-lg sm:text-xl", md: "text-2xl sm:text-3xl", lg: "text-3xl sm:text-4xl" };
  return <h2 className={cn("font-display font-bold", sizeClass[size], center && "text-center", className)}>{children}</h2>;
}

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("text-xs font-semibold uppercase tracking-widest text-primary", className)}>{children}</p>;
}