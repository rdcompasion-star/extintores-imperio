import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { ShieldIcon, CertificateIcon, WhatsAppIcon } from "@/components/ui/icons";
import { buildWhatsAppLink } from "@/lib/site-config";
import { EditableText } from "@/components/admin/EditableText";

export function Hero({
  content,
  whatsappNumber,
}: {
  content: Record<string, string>;
  whatsappNumber: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-ink-950">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, white 0, white 1px, transparent 1px, transparent 14px)",
        }}
      />
      <div
        aria-hidden
        className="absolute -right-24 top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full bg-red-700/25 blur-[110px]"
      />

      <Container className="relative py-16 sm:py-20 lg:py-28">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5">
            <ShieldIcon className="h-3.5 w-3.5 shrink-0 text-red-500" />
            <EditableText
              page="home"
              section="hero"
              field="badge"
              value={content.badge}
              label="Texto de la insignia"
              className="text-xs font-semibold text-white/80"
            />
          </div>

          <EditableText
            page="home"
            section="hero"
            field="title"
            value={content.title}
            as="h1"
            multiline
            label="Título principal"
            className="mt-6 block text-[34px] font-semibold leading-[1.08] text-white sm:text-5xl lg:text-[56px]"
          />

          <EditableText
            page="home"
            section="hero"
            field="subtitle"
            value={content.subtitle}
            as="p"
            multiline
            label="Subtítulo"
            className="mt-5 block max-w-lg text-[16px] leading-relaxed text-white/70 sm:text-lg"
          />

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink
              href={buildWhatsAppLink(whatsappNumber, "Hola, quiero cotizar extintores. ¿Me pueden ayudar?")}
              external
              size="lg"
              icon={<WhatsAppIcon className="h-5 w-5" />}
            >
              {content.cta_primary_text}
            </ButtonLink>
            <ButtonLink href="/productos" variant="outlineLight" size="lg">
              {content.cta_secondary_text}
            </ButtonLink>
          </div>

          <div className="mt-10 flex items-center gap-2 text-sm text-white/60">
            <CertificateIcon className="h-4 w-4 text-white/40" />
            {content.certification_note}
          </div>
        </div>
      </Container>
    </section>
  );
}
