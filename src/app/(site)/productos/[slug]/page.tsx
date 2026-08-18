import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import "@/lib/bootstrap";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { ProductGlyph } from "@/components/product/ProductGlyph";
import { ProductGrid } from "@/components/product/ProductGrid";
import { WhatsAppIcon, CertificateIcon } from "@/components/ui/icons";
import { getProductBySlug, getRelatedProducts, type Product } from "@/lib/queries";
import { fireClasses } from "@/lib/fire-classes";
import { buildProductWhatsAppMessage, buildWhatsAppLink } from "@/lib/site-config";
import { getSettings } from "@/lib/settings";
import { SITE_URL } from "@/lib/site";

export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.seoTitle || product.name,
    description:
      product.seoDescription || `${product.description} Consulta precio y disponibilidad con Extintores Imperio.`,
  };
}

const specRows = (p: Product) =>
  [
    { label: "Agente extintor", value: p.agent },
    { label: "Capacidad", value: p.capacityLabel },
    { label: "Concentración nominal", value: p.concentration },
    { label: "Clasificación", value: p.classification },
    { label: "Potencial de extinción", value: p.extinguishingRating },
    { label: "Masa descargado", value: p.dischargedWeight },
    { label: "Masa cargado", value: p.chargedWeight },
    { label: "Gabinete", value: p.cabinet },
    { label: "Manguera", value: p.hose },
    { label: "Carrete", value: p.reel },
    { label: "Pitón", value: p.nozzle },
    { label: "Cilindro", value: p.cylinder },
    { label: "Certificación", value: p.certification },
  ].filter((row) => Boolean(row.value));

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const settings = await getSettings();
  const related = await getRelatedProducts(product);
  const usos = fireClasses.filter((fc) => product.fireClasses.includes(fc.id));
  const whatsappHref = buildWhatsAppLink(settings.whatsappNumber, buildProductWhatsAppMessage(product.name));

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    category: product.categoryLabel,
    brand: { "@type": "Brand", name: settings.companyName },
    offers: {
      "@type": "Offer",
      priceCurrency: "CLP",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/productos/${product.slug}`,
    },
  };

  return (
    <div className="py-8 sm:py-10 lg:py-12">
      <Container>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />

        <nav aria-label="Ruta de navegación" className="mb-6 text-sm text-ink-500">
          <Link href="/productos" className="hover:text-ink-800">
            Productos
          </Link>
          <span className="mx-2">/</span>
          <span className="text-ink-700">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-border bg-surface-2 lg:sticky lg:top-24 lg:h-fit">
            {product.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.image.src}
                alt={product.image.alt || product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <ProductGlyph
                category={product.category}
                presentation={product.presentation}
                className="h-56 w-56 sm:h-64 sm:w-64"
              />
            )}
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">
              {product.categoryLabel}
            </p>
            <h1 className="mt-1.5 text-[26px] font-semibold leading-tight text-ink-950 sm:text-[32px]">
              {product.name}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              {product.classification && <Badge tone="red">Clasificación {product.classification}</Badge>}
              {product.certification && (
                <Badge tone="ink">
                  <CertificateIcon className="h-3.5 w-3.5" />
                  Certificación {product.certification}
                </Badge>
              )}
            </div>

            <p className="mt-5 text-[15px] leading-relaxed text-ink-700 sm:text-base">
              {product.description}
            </p>

            <p className="mt-5 text-lg font-semibold text-ink-900">{product.price || "Consultar precio"}</p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={whatsappHref} external size="lg" icon={<WhatsAppIcon className="h-5 w-5" />}>
                Cotizar este producto por WhatsApp
              </ButtonLink>
              <ButtonLink href="/contacto" variant="secondary" size="lg">
                Ver otras formas de contacto
              </ButtonLink>
            </div>

            <div className="mt-10 rounded-xl border border-border bg-surface">
              <h2 className="border-b border-border px-5 py-3.5 text-sm font-semibold text-ink-900">
                Especificaciones técnicas
              </h2>
              <dl>
                {specRows(product).map((row, i) => (
                  <div
                    key={row.label}
                    className={`flex items-center justify-between gap-4 px-5 py-3 text-sm ${
                      i % 2 === 1 ? "bg-surface-2/60" : ""
                    }`}
                  >
                    <dt className="text-ink-500">{row.label}</dt>
                    <dd className="font-mono font-medium text-ink-900">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {usos.length > 0 && (
              <div className="mt-8">
                <h2 className="text-sm font-semibold text-ink-900">Uso indicado según su clasificación</h2>
                <ul className="mt-3 flex flex-col gap-2.5">
                  {usos.map((u) => (
                    <li key={u.id} className="flex items-start gap-3 rounded-lg bg-surface-2 px-4 py-3 text-sm text-ink-700">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-700 text-xs font-bold text-white">
                        {u.id}
                      </span>
                      <span>
                        <strong className="font-semibold text-ink-900">{u.title}:</strong> {u.description}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs text-ink-400">
                  Referencial según la clasificación informada por el fabricante. Ante dudas sobre la aplicación en tu instalación, consulta con Extintores Imperio.
                </p>
              </div>
            )}
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-16 border-t border-border pt-10">
            <h2 className="mb-6 text-xl font-semibold text-ink-950">Productos relacionados</h2>
            <ProductGrid products={related} whatsappNumber={settings.whatsappNumber} />
          </div>
        )}
      </Container>
    </div>
  );
}
