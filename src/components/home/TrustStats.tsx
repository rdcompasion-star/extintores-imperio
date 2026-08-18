import { Container } from "@/components/ui/Container";

export function TrustStats({ content }: { content: Record<string, string> }) {
  const stats = [
    { value: content.stat1_value, suffix: content.stat1_suffix, label: content.stat1_label },
    { value: content.stat2_value, suffix: content.stat2_suffix, label: content.stat2_label },
    { value: content.stat3_value, suffix: content.stat3_suffix, label: content.stat3_label },
  ];

  return (
    <section className="border-b border-border bg-surface">
      <Container className="grid grid-cols-1 divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {stats.map((stat, i) => (
          <div key={i} className="flex flex-col items-center gap-1 py-8 text-center sm:py-10">
            <p className="font-display text-4xl font-semibold text-ink-950 sm:text-5xl">
              {stat.value}
              <span className="text-red-700">{stat.suffix}</span>
            </p>
            <p className="text-sm font-medium text-ink-500">{stat.label}</p>
          </div>
        ))}
      </Container>
    </section>
  );
}
