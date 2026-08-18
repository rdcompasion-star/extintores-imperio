import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductGlyph } from "@/components/product/ProductGlyph";
import { AgentCategory, categoryLabels, listProducts } from "@/lib/queries";

const categories: { value: AgentCategory; blurb: string }[] = [
  { value: "co2", blurb: "Fuegos clase B y C, ideal para equipos eléctricos" },
  { value: "pqs-abc", blurb: "Uso general, fuegos clase A, B y C" },
  { value: "clase-k", blurb: "Grasas y aceites de cocina" },
  { value: "red-humeda", blurb: "Sistema fijo de ataque directo con agua" },
];

export async function CategoryNav({ title }: { title: string }) {
  const products = await listProducts();

  return (
    <section className="py-14 sm:py-16 lg:py-20">
      <Container>
        <SectionHeading title={title} />

        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {categories.map((cat) => {
            const count = products.filter((p) => p.category === cat.value).length;
            return (
              <Link
                key={cat.value}
                href={`/productos?agente=${cat.value}`}
                className="group flex flex-col items-center gap-3 rounded-xl border border-border bg-surface p-6 text-center transition-colors duration-150 ease-out hover:border-ink-400"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-lg bg-surface-2">
                  <ProductGlyph category={cat.value} className="h-9 w-9" />
                </span>
                <div>
                  <h3 className="text-lg text-ink-950">{categoryLabels[cat.value]}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-ink-500">{cat.blurb}</p>
                </div>
                <span className="mt-auto flex items-center gap-1.5 rounded-md bg-red-700 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white transition-colors group-hover:bg-red-800 [font-family:var(--font-rockwell)]">
                  Ver productos ({count})
                </span>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
