import { ReactNode } from "react";
import { Container } from "@/components/ui/Container";

export function PageHeader({
  eyebrow,
  title,
  lead,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
}) {
  return (
    <section className="border-b border-border bg-ink-950 py-14 sm:py-16">
      <Container>
        <div className="max-w-2xl">
          {eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-wide text-red-500">{eyebrow}</p>
          )}
          <h1 className="mt-2 text-[30px] font-semibold leading-tight text-white sm:text-4xl">{title}</h1>
          {lead && <p className="mt-4 text-[15px] leading-relaxed text-white/65 sm:text-base">{lead}</p>}
        </div>
      </Container>
    </section>
  );
}
