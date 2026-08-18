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
        <SectionHeading title={content.title} lead={content.lead} bebas />

        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4">
          {fireClasses.slice(0, 2).map((fc) => (
            <div key={fc.id} className="flex flex-col gap-2 rounded-xl border border-border bg-surface p-3 sm:gap-3 sm:p-5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 font-display text-base font-bold text-red-700 sm:h-11 sm:w-11 sm:text-lg">
                {fc.id}
              </span>
              <div>
                <h3 className="text-[13px] font-semibold text-ink-950 sm:text-[15px]">{fc.title}</h3>
                <p className="mt-1 text-[11px] leading-snug text-ink-500 sm:text-[13px] sm:leading-relaxed">{fc.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-3 gap-3 sm:mt-4 sm:gap-4">
          {fireClasses.slice(2).map((fc) => (
            <div key={fc.id} className="flex flex-col gap-2 rounded-xl border border-border bg-surface p-3 sm:gap-3 sm:p-5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 font-display text-base font-bold text-red-700 sm:h-11 sm:w-11 sm:text-lg">
                {fc.id}
              </span>
              <div>
                <h3 className="text-[13px] font-semibold text-ink-950 sm:text-[15px]">{fc.title}</h3>
                <p className="mt-1 text-[11px] leading-snug text-ink-500 sm:text-[13px] sm:leading-relaxed">{fc.description}</p>
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
