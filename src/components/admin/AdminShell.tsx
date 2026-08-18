"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { adminNavItems, mobilePrimaryCount } from "@/components/admin/admin-nav";
import { logoutAction } from "@/lib/actions/auth-actions";
import { CloseIcon } from "@/components/ui/icons";

export function AdminShell({
  children,
  username,
}: {
  children: React.ReactNode;
  username: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [moreOpen, setMoreOpen] = useState(false);

  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  const primary = adminNavItems.slice(0, mobilePrimaryCount);
  const rest = adminNavItems.slice(mobilePrimaryCount);

  async function handleLogout() {
    await logoutAction();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Sidebar desktop / tablet */}
      <aside className="hidden shrink-0 flex-col border-r border-border bg-bg sm:flex sm:w-[76px] lg:w-64">
        <div className="flex h-16 items-center gap-2.5 border-b border-border px-4 lg:px-5">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-red-700 text-sm font-bold text-white">
            EI
          </span>
          <span className="hidden text-sm font-semibold text-ink-950 lg:inline">Panel de administración</span>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
          {adminNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive(item.href) ? "bg-red-50 text-red-700" : "text-ink-600 hover:bg-surface-2"
              }`}
              title={item.label}
            >
              <span className="text-base leading-none">{item.emoji}</span>
              <span className="hidden lg:inline">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="border-t border-border p-3">
          <Link
            href="/"
            className="mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-600 hover:bg-surface-2"
          >
            <span className="text-base leading-none">🔗</span>
            <span className="hidden lg:inline">Ver sitio público</span>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-600 hover:bg-surface-2"
          >
            <span className="text-base leading-none">🚪</span>
            <span className="hidden lg:inline">Cerrar sesión ({username})</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1 pb-24 sm:pb-8">{children}</main>
      </div>

      {/* Bottom nav mobile */}
      <nav className="fixed inset-x-0 bottom-0 z-(--z-sticky) flex border-t border-border bg-bg sm:hidden">
        {primary.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium ${
              isActive(item.href) ? "text-red-700" : "text-ink-500"
            }`}
          >
            <span className="text-lg leading-none">{item.emoji}</span>
            {item.label}
          </Link>
        ))}
        <button
          type="button"
          onClick={() => setMoreOpen(true)}
          className="flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium text-ink-500"
        >
          <span className="text-lg leading-none">⋯</span>
          Más
        </button>
      </nav>

      {moreOpen && (
        <div className="fixed inset-0 z-(--z-modal) sm:hidden">
          <button
            type="button"
            aria-label="Cerrar"
            onClick={() => setMoreOpen(false)}
            className="absolute inset-0 z-(--z-modal-backdrop) bg-ink-950/50"
          />
          <div className="absolute inset-x-0 bottom-0 z-(--z-modal) rounded-t-2xl bg-bg p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-ink-900">Más opciones</p>
              <button
                type="button"
                onClick={() => setMoreOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-surface-2"
                aria-label="Cerrar"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {rest.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMoreOpen(false)}
                  className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-surface p-4 text-center text-xs font-medium text-ink-700"
                >
                  <span className="text-xl leading-none">{item.emoji}</span>
                  {item.label}
                </Link>
              ))}
              <Link
                href="/"
                className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-surface p-4 text-center text-xs font-medium text-ink-700"
              >
                <span className="text-xl leading-none">🔗</span>
                Ver sitio
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-surface p-4 text-center text-xs font-medium text-ink-700"
              >
                <span className="text-xl leading-none">🚪</span>
                Salir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
