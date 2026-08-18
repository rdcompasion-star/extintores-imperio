import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { ChevronDownIcon } from "@/components/ui/icons";
import { listFaqs } from "@/lib/queries";

export async function FAQSection({
  compact = false,
  content,
}: {
  compact?: boolean;
  content: Record<string, string>;
}) {
  const faqItems = await listFaqs();

  return (
    <section className={`border-t border-border bg-surface ${compact ? "py-14 sm:py-16 lg:py-20" : "py-10 sm:py-14"}`}>
      <Container className="max-w-3xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading title={content.title} />
          {compact && (
            <ButtonLink href="/faq" variant="secondary" size="md" className="shrink-0">
              Ver todas
            </ButtonLink>
          )}
        </div>

        <div className="mt-6 flex flex-col divide-y divide-border rounded-xl border border-border bg-bg">
          {faqItems.map((item) => (
            <details key={item.id} className="group px-5 py-4 open:pb-5 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-medium text-ink-900">
                {item.question}
                <ChevronDownIcon className="h-[18px] w-[18px] shrink-0 text-ink-400 transition-transform duration-150 ease-out group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-[14px] leading-relaxed text-ink-500">{item.answer}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
