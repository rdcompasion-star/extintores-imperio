import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

const placeholderSlots = Array.from({ length: 6 });

export function ClientsSection({ content }: { content: Record<string, string> }) {
  return (
    <section className="border-t border-border py-14 sm:py-16 lg:py-20">
      <Container>
        <SectionHeading title={content.title} align="center" />

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {placeholderSlots.map((_, i) => (
            <div
              key={i}
              className="flex h-16 items-center justify-center rounded-lg border border-dashed border-border-strong bg-surface text-xs font-medium text-ink-300"
            >
              Logo cliente
            </div>
          ))}
        </div>
        <p className="mt-5 text-center text-xs text-ink-400">
          Espacio preparado para incorporar los logos de clientes reales de Extintores Imperio.
        </p>
      </Container>
    </section>
  );
}
