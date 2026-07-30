import Link from "next/link";

interface PageHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  backHref?: string;
  backLabel?: string;
  footer?: React.ReactNode;
}

export function PageHeader({ title, subtitle, backHref, backLabel = "Home", footer }: PageHeaderProps) {
  return (
    <div className="navbar bg-base-100 border-b border-base-300 min-h-0 py-4 px-4">
      <div className="navbar-start">
        {backHref && (
          <Link href={backHref} className="btn btn-ghost btn-sm gap-1 text-base-content/60">
            <span>←</span>
            <span>{backLabel}</span>
          </Link>
        )}
      </div>
      <div className="navbar-center flex-col">
        <h1 className="font-display text-xl sm:text-3xl font-bold text-center">{title}</h1>
        {subtitle && <p className="text-sm text-base-content/60">{subtitle}</p>}
      </div>
      <div className="navbar-end" />
      {footer && <div className="w-full mt-4">{footer}</div>}
    </div>
  );
}