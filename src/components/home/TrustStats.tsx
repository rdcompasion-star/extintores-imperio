import { Container } from "@/components/ui/Container";

export function TrustStats({ content }: { content: Record<string, string> }) {
  return (
    <section className="border-b border-border bg-surface">
      <Container className="flex justify-center">
        <div className="flex flex-col items-center gap-1 py-8 text-center sm:py-10">
          <p className="font-display text-4xl font-semibold text-ink-950 sm:text-5xl">
            {content.stat1_value}
            <span className="text-red-700">{content.stat1_suffix}</span>
          </p>
          <p className="text-sm font-medium text-ink-500">{content.stat1_label}</p>
        </div>
      </Container>
    </section>
  );
}
