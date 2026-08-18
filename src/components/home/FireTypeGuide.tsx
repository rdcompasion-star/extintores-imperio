import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { FlameIcon, WhatsAppIcon } from "@/components/ui/icons";
import { fireClasses } from "@/lib/fire-classes";
import { buildWhatsAppLink } from "@/lib/site-config";

export function FireTypeGuide({
  compact = false,
  content,
  whatsappNumber,
}: {
  compact?: boolean;
  content: Record<string, string>;
  whatsappNumber: string;
}) {
  return (
    <section className={compact ? "py-14 sm:py-16 lg:py-20" : "py-10 sm:py-14"}>
      <Container>
        <SectionHeading title={content.title} lead={content.lead} />

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {fireClasses.map((fc) => (
            <div key={fc.id} className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-5">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-red-50 font-display text-lg font-bold text-red-700">
                {fc.id}
              </span>
              <div>
                <h3 className="text-[15px] font-semibold text-ink-950">{fc.title}</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-ink-500">{fc.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-start gap-3 rounded-xl bg-ink-950 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2.5 text-[15px] font-medium text-white">
            <FlameIcon className="h-5 w-5 text-red-500" />
            ¿No sabes cuál necesitas? Consúltanos.
          </p>
          <ButtonLink
            href={buildWhatsAppLink(
              whatsappNumber,
              "Hola, no estoy seguro de qué extintor necesito. ¿Me pueden orientar?"
            )}
            external
            variant="outlineLight"
            size="md"
            icon={<WhatsAppIcon className="h-4 w-4" />}
          >
            {content.cta_text}
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
