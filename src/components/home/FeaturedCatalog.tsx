import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { ProductGrid } from "@/components/product/ProductGrid";
import { listProducts } from "@/lib/queries";

export async function FeaturedCatalog({
  content,
  whatsappNumber,
}: {
  content: Record<string, string>;
  whatsappNumber: string;
}) {
  const featured = (await listProducts()).slice(0, 4);

  return (
    <section className="border-y border-border bg-surface py-14 sm:py-16 lg:py-20">
      <Container>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading title={content.title} lead={content.lead} />
          <ButtonLink href="/productos" variant="secondary" size="md" className="shrink-0">
            Ver catálogo completo
          </ButtonLink>
        </div>

        <div className="mt-8">
          <ProductGrid products={featured} whatsappNumber={whatsappNumber} />
        </div>
      </Container>
    </section>
  );
}
