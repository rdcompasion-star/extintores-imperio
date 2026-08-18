import type { Metadata } from "next";
import "@/lib/bootstrap";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { QuoteForm } from "@/components/contact/QuoteForm";
import { WhatsAppIcon, PhoneIcon, MailIcon, MapPinIcon } from "@/components/ui/icons";
import { buildMailLink, buildTelLink, buildWhatsAppLink } from "@/lib/site-config";
import { getSettings } from "@/lib/settings";
import { listProducts } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Contacta a Extintores Imperio por WhatsApp, teléfono o email. Solicita tu cotización de extintores en Cerrillos, Santiago.",
};

export default async function ContactoPage() {
  const settings = await getSettings();
  const products = await listProducts();
  const mapQuery = encodeURIComponent(settings.address.full);

  const contactMethods = [
    settings.social.whatsapp.enabled && {
      icon: WhatsAppIcon,
      label: "WhatsApp",
      value: settings.phoneDisplay,
      href: buildWhatsAppLink(settings.whatsappNumber, "Hola, quiero cotizar extintores. ¿Me pueden ayudar?"),
      external: true,
    },
    {
      icon: PhoneIcon,
      label: "Llamar",
      value: settings.phoneDisplay,
      href: buildTelLink(settings.phoneE164),
      external: false,
    },
    {
      icon: MailIcon,
      label: "Email",
      value: settings.email,
      href: buildMailLink(settings.email, "Cotización de extintores"),
      external: false,
    },
  ].filter((m): m is Exclude<typeof m, false> => Boolean(m));

  return (
    <>
      <PageHeader
        eyebrow="Contacto"
        title="Hablemos de tu proyecto"
        lead="Escríbenos por WhatsApp, llámanos o completa el formulario de cotización."
      />

      <section className="py-12 sm:py-16">
        <Container className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {contactMethods.map((method) => (
                <ButtonLink
                  key={method.label}
                  href={method.href}
                  external={method.external}
                  variant="secondary"
                  size="lg"
                  className="justify-between lg:justify-start"
                  icon={<method.icon className="h-5 w-5 text-red-700" />}
                >
                  <span className="flex flex-col items-start leading-tight">
                    <span className="text-xs font-normal text-ink-400">{method.label}</span>
                    <span>{method.value}</span>
                  </span>
                </ButtonLink>
              ))}
            </div>

            <div className="rounded-xl border border-border bg-surface p-6">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-ink-900">
                <MapPinIcon className="h-[18px] w-[18px] text-red-700" />
                Ubicación
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">{settings.address.full}</p>

              <h3 className="mt-5 text-sm font-semibold text-ink-900">Horario de atención</h3>
              <ul className="mt-2 flex flex-col gap-1 text-sm text-ink-600">
                {settings.hours.map((h) => (
                  <li key={h.days} className="flex justify-between gap-4">
                    <span>{h.days}</span>
                    <span className="font-medium text-ink-900">{h.time}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 overflow-hidden rounded-lg border border-border">
                <iframe
                  title="Ubicación de Extintores Imperio en el mapa"
                  src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                  className="h-56 w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-ink-950">Formulario de cotización</h2>
            <p className="mt-1.5 text-sm text-ink-500">Cuéntanos qué necesitas y te contactamos a la brevedad.</p>
            <div className="mt-6">
              <QuoteForm whatsappNumber={settings.whatsappNumber} productNames={products.map((p) => p.name)} />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
