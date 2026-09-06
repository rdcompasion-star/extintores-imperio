import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { ClientLogo } from "@/lib/queries";

const cellClasses = "flex h-16 w-28 shrink-0 items-center justify-center sm:h-20 sm:w-36 lg:h-24 lg:w-40";

export function ClientsSection({ content, logos }: { content: Record<string, string>; logos: ClientLogo[] }) {
  const columns = Math.max(1, Math.ceil(logos.length / 3));
  // Duración proporcional a la cantidad de logos: recorrido continuo a
  // velocidad constante, ni apurado ni tedioso, sin importar cuántos haya.
  const durationSeconds = Math.min(90, Math.max(24, columns * 3.2));

  return (
    <section className="border-t border-border py-14 sm:py-16 lg:py-20">
      <Container>
        <SectionHeading title={content.title} align="center" />
      </Container>

      {logos.length === 0 ? (
        <Container>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
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
      ) : (
        <div className="relative mt-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
          <div
            className="grid w-max grid-flow-col grid-rows-3 gap-3 sm:gap-4 lg:gap-6"
            style={{ animation: `clients-marquee ${durationSeconds}s linear infinite` }}
          >
            {[...logos, ...logos].map((logo, i) => (
              <div key={`${logo.id}-${i}`} className={cellClasses}>
                <div className="flex h-full w-full items-center justify-center rounded-lg border border-border bg-surface p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logo.media.src}
                    alt={logo.name || logo.media.alt || "Logo cliente"}
                    className="h-full w-full object-contain"
                    loading="lazy"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
