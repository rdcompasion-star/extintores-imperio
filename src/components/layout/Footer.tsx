import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/layout/Logo";
import {
  PhoneIcon,
  MailIcon,
  MapPinIcon,
  WhatsAppIcon,
  InstagramIcon,
  FacebookIcon,
  TikTokIcon,
  LinkedInIcon,
  YouTubeIcon,
} from "@/components/ui/icons";
import { buildTelLink, buildWhatsAppLink } from "@/lib/site-config";
import { categoryLabels } from "@/lib/queries";
import { getSettings } from "@/lib/settings";

const footerColumns = [
  {
    title: "Catálogo",
    links: [
      { href: "/productos?agente=co2", label: categoryLabels.co2 },
      { href: "/productos?agente=pqs-abc", label: categoryLabels["pqs-abc"] },
      { href: "/productos?agente=clase-k", label: categoryLabels["clase-k"] },
      { href: "/productos?agente=red-humeda", label: categoryLabels["red-humeda"] },
    ],
  },
  {
    title: "Empresa",
    links: [
      { href: "/servicios", label: "Servicios" },
      { href: "/tipos-de-fuego", label: "Tipos de fuego" },
      { href: "/normativa", label: "Normativa" },
      { href: "/nosotros", label: "Nosotros" },
      { href: "/faq", label: "Preguntas frecuentes" },
    ],
  },
];

const socialIcons = {
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  tiktok: TikTokIcon,
  linkedin: LinkedInIcon,
  youtube: YouTubeIcon,
} as const;

export async function Footer() {
  const settings = await getSettings();
  const year = new Date().getFullYear();
  const socialEntries = (Object.keys(socialIcons) as (keyof typeof socialIcons)[]).filter(
    (key) => settings.social[key].enabled && settings.social[key].url
  );

  return (
    <footer className="border-t border-border bg-ink-950 text-ink-100">
      <Container className="grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr] lg:gap-8">
        <div className="flex flex-col gap-4">
          <Logo dark companyName={settings.companyName} logoSrc={settings.logo?.src} />
          <p className="max-w-xs text-sm leading-relaxed text-ink-300">
            Venta, recarga y mantención de extintores y equipos contra incendios. Empresa chilena con 15
            años de experiencia en el mercado.
          </p>
          {socialEntries.length > 0 && (
            <div className="flex items-center gap-2 pt-1">
              {socialEntries.map((key) => {
                const Icon = socialIcons[key];
                return (
                  <a
                    key={key}
                    href={settings.social[key].url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={key}
                    className="flex h-9 w-9 items-center justify-center rounded-md bg-white/5 text-ink-300 hover:bg-white/10 hover:text-white"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          )}
        </div>

        {footerColumns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h3 className="mb-4 text-sm font-semibold text-white">{col.title}</h3>
            <ul className="flex flex-col gap-2.5">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-ink-300 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div>
          <h3 className="mb-4 text-sm font-semibold text-white">Contacto</h3>
          <ul className="flex flex-col gap-3 text-sm text-ink-300">
            {settings.social.whatsapp.enabled && (
              <li>
                <a
                  href={buildWhatsAppLink(
                    settings.whatsappNumber,
                    "Hola, quiero cotizar extintores. ¿Me pueden ayudar?"
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2.5 hover:text-white"
                >
                  <WhatsAppIcon className="mt-0.5 h-4 w-4 shrink-0" />
                  {settings.phoneDisplay}
                </a>
              </li>
            )}
            <li>
              <a href={buildTelLink(settings.phoneE164)} className="flex items-start gap-2.5 hover:text-white">
                <PhoneIcon className="mt-0.5 h-4 w-4 shrink-0" />
                Llamar ahora
              </a>
            </li>
            <li>
              <a href={`mailto:${settings.email}`} className="flex items-start gap-2.5 hover:text-white">
                <MailIcon className="mt-0.5 h-4 w-4 shrink-0" />
                {settings.email}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{settings.address.full}</span>
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-2 py-6 text-xs text-ink-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {settings.companyName}. Todos los derechos reservados.
          </p>
          <p>{settings.hours.map((h) => `${h.days} ${h.time}`).join(" · ")}</p>
        </Container>
      </div>
    </footer>
  );
}
