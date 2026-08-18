import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { CertificateIcon, ShieldIcon } from "@/components/ui/icons";

const points = [
  {
    title: "Marco normativo",
    text: "En Chile, los extintores portátiles se rigen por el D.S. 44 del Ministerio de Economía, Fomento y Turismo y sus modificaciones, que establecen requisitos técnicos y de mantención para estos equipos.",
  },
  {
    title: "Certificación",
    text: "Los extintores del catálogo de Extintores Imperio se comercializan con certificación CESMEC cuando corresponde, indicada en la ficha de cada producto.",
  },
  {
    title: "Mantención periódica",
    text: "Los extintores requieren revisión y mantención periódica para asegurar su correcto funcionamiento. Consulta con Extintores Imperio los plazos aplicables a tu equipo.",
  },
];

export function NormativaSection({
  compact = false,
  content,
}: {
  compact?: boolean;
  content: Record<string, string>;
}) {
  return (
    <section className={`border-t border-border ${compact ? "py-14 sm:py-16 lg:py-20" : "py-10 sm:py-14"}`}>
      <Container>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading title={content.title} lead={content.lead} />
          {compact && (
            <ButtonLink href="/normativa" variant="secondary" size="md" className="shrink-0">
              Leer más
            </ButtonLink>
          )}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {points.map((point) => (
            <div key={point.title} className="rounded-xl border border-border bg-surface p-6">
              <ShieldIcon className="h-6 w-6 text-red-700" />
              <h3 className="mt-4 text-[15px] font-semibold text-ink-950">{point.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-500">{point.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-start gap-3 rounded-lg border border-border-strong bg-surface-2 px-5 py-4 text-sm text-ink-600">
          <CertificateIcon className="mt-0.5 h-[18px] w-[18px] shrink-0 text-ink-400" />
          <p>
            Esta sección es educativa y referencial; no constituye asesoría legal. Ante requisitos normativos
            específicos para tu instalación, consulta a un profesional competente o directamente a Extintores
            Imperio para validar la información aplicable a tu caso.
          </p>
        </div>
      </Container>
    </section>
  );
}
