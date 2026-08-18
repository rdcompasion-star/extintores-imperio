import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { listServices } from "@/lib/queries";
import { resolveCta } from "@/lib/site-config";

export async function ServicesSection({
  compact = false,
  content,
  whatsappNumber,
}: {
  compact?: boolean;
  content: Record<string, string>;
  whatsappNumber: string;
}) {
  const services = await listServices();

  return (
    <section className={`border-t border-border bg-surface ${compact ? "py-14 sm:py-16 lg:py-20" : "py-10 sm:py-14"}`}>
      <Container>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading title={content.title} lead={content.lead} />
          {compact && (
            <ButtonLink href="/servicios" variant="secondary" size="md" className="shrink-0">
              Ver todos los servicios
            </ButtonLink>
          )}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {services.map((service, i) => {
            const cta = resolveCta(service.ctaType, service.ctaValue, whatsappNumber);
            return (
              <div key={service.slug} className="flex flex-col gap-3 rounded-xl border border-border bg-bg p-6">
                <span className="font-mono text-xs font-semibold text-red-700">0{i + 1}</span>
                <h3 className="text-lg font-semibold text-ink-950">{service.title}</h3>
                <p className="text-[14px] leading-relaxed text-ink-500">{service.description}</p>
                <ButtonLink
                  href={cta.href}
                  external={cta.external}
                  variant="ghost"
                  size="md"
                  icon={<WhatsAppIcon className="h-4 w-4" />}
                  className="mt-auto -ml-2 w-fit"
                >
                  {service.ctaText}
                </ButtonLink>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
