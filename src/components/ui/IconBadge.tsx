import { cn } from "@/lib/cn";

export function IconBadge({ children, color = "var(--color-primary)", size = "md", className }: {
  children: React.ReactNode;
  color?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeClass = { sm: "badge-sm", md: "badge-md", lg: "badge-lg" }[size];
  return (
    <div className={cn("badge rounded-full text-white font-bold shrink-0", sizeClass, className)} style={{ backgroundColor: color }}>
      {children}
    </div>
  );
}