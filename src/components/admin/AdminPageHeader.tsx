import Link from "next/link";
import { ReactNode } from "react";

export function AdminPageHeader({
  title,
  breadcrumb,
  action,
  description,
}: {
  title: string;
  breadcrumb: { label: string; href?: string }[];
  action?: ReactNode;
  description?: string;
}) {
  return (
    <div className="border-b border-border bg-bg px-5 py-5 sm:px-8 sm:py-6">
      <nav aria-label="Ruta de navegación" className="mb-2 flex flex-wrap items-center gap-1 text-xs text-ink-400">
        {breadcrumb.map((crumb, i) => (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && <span>/</span>}
            {crumb.href ? (
              <Link href={crumb.href} className="hover:text-ink-700">
                {crumb.label}
              </Link>
            ) : (
              <span className="text-ink-600">{crumb.label}</span>
            )}
          </span>
        ))}
      </nav>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-ink-950 sm:text-2xl">{title}</h1>
          {description && <p className="mt-1 text-sm text-ink-500">{description}</p>}
        </div>
        {action}
      </div>
    </div>
  );
}
