import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductGlyph } from "@/components/product/ProductGlyph";
import { ArrowRightIcon } from "@/components/ui/icons";
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
                className="group flex flex-col gap-3 rounded-xl border border-border bg-surface p-5 transition-colors duration-150 ease-out hover:border-ink-400"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-lg bg-surface-2">
                  <ProductGlyph category={cat.value} className="h-9 w-9" />
                </span>
                <div>
                  <h3 className="text-[15px] font-semibold text-ink-950">{categoryLabels[cat.value]}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-ink-500">{cat.blurb}</p>
                </div>
                <div className="mt-auto flex items-center justify-between pt-1 text-xs font-medium text-ink-400">
                  <span>
                    {count} producto{count === 1 ? "" : "s"}
                  </span>
                  <ArrowRightIcon className="h-4 w-4 text-ink-300 transition-transform duration-150 ease-out group-hover:translate-x-0.5 group-hover:text-red-700" />
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
