import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { CheckIcon } from "@/components/ui/icons";

const highlights = [
  "Comercialización de extintores y equipos contra incendios",
  "Servicio de recarga de extintores",
  "Servicio de mantención de extintores y equipos contra incendios",
  "15 años de experiencia en el mercado",
  "Equipo joven, profesional y capacitado",
];

export function AboutSection({
  compact = false,
  content,
}: {
  compact?: boolean;
  content: Record<string, string>;
}) {
  return (
    <section className={`border-t border-border bg-surface ${compact ? "py-14 sm:py-16 lg:py-20" : "py-10 sm:py-14"}`}>
      <Container className="grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-16">
        <div>
          <SectionHeading title={content.title} lead={content.lead} />
          {compact && (
            <div className="mt-6">
              <ButtonLink href="/nosotros" variant="secondary" size="md">
                Conocer más
              </ButtonLink>
            </div>
          )}
        </div>

        <ul className="flex flex-col gap-3">
          {highlights.map((item) => (
            <li key={item} className="flex items-start gap-3 rounded-lg bg-bg px-4 py-3.5 text-[15px] text-ink-800">
              <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-red-700" />
              {item}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
