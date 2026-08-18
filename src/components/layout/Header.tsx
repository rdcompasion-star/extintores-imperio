"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Logo } from "@/components/layout/Logo";
import { MenuIcon, CloseIcon, PhoneIcon } from "@/components/ui/icons";
import { buildTelLink } from "@/lib/site-config";
import type { Settings } from "@/lib/settings";
import type { MenuItem } from "@/lib/queries";

export function Header({ settings, menuItems }: { settings: Settings; menuItems: MenuItem[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <>
    <header className="sticky top-0 z-(--z-sticky) border-b border-border bg-bg/95 backdrop-blur supports-[backdrop-filter]:bg-bg/80">
      <Container className="flex h-16 items-center justify-between gap-4 lg:h-[72px]">
        <Logo companyName={settings.companyName} logoSrc={settings.logo?.src} />

        <nav className="hidden lg:flex lg:items-center lg:gap-1" aria-label="Navegación principal">
          {menuItems.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.id}
                href={link.href}
                className={`rounded-md px-3.5 py-2 text-[15px] font-medium transition-colors ${
                  active
                    ? "text-red-700"
                    : "text-ink-700 hover:text-ink-950 hover:bg-surface-2"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:flex lg:items-center lg:gap-3">
          <a
            href={buildTelLink(settings.phoneE164)}
            className="flex items-center gap-2 text-[15px] font-medium text-ink-700 hover:text-ink-950"
          >
            <PhoneIcon className="h-4 w-4" />
            {settings.phoneDisplay}
          </a>
          <ButtonLink href="/contacto" size="md">
            Cotizar
          </ButtonLink>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-11 w-11 items-center justify-center rounded-md text-ink-900 hover:bg-surface-2 lg:hidden"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          {open ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>
      </Container>
    </header>

    {open && (
      <div
        id="mobile-menu"
        className="fixed inset-x-0 top-16 bottom-0 z-(--z-modal) overflow-y-auto bg-bg lg:hidden"
      >
        <Container className="flex flex-col gap-1 py-6">
          {menuItems.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              className={`rounded-lg px-4 py-3.5 text-lg font-medium ${
                pathname === link.href
                  ? "bg-red-50 text-red-700"
                  : "text-ink-900 hover:bg-surface-2"
              }`}
            >
              {link.label}
            </Link>
          ))}

          <div className="mt-4 flex flex-col gap-3 border-t border-border pt-6">
            <a
              href={buildTelLink(settings.phoneE164)}
              className="flex items-center gap-2.5 px-4 text-base font-medium text-ink-700"
            >
              <PhoneIcon className="h-5 w-5" />
              {settings.phoneDisplay}
            </a>
            <div className="px-4">
              <ButtonLink href="/contacto" size="lg" className="w-full">
                Cotizar extintores
              </ButtonLink>
            </div>
          </div>
        </Container>
      </div>
    )}
    </>
  );
}
