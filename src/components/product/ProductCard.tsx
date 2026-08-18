import Link from "next/link";
import { Product } from "@/lib/queries";
import { ProductGlyph } from "@/components/product/ProductGlyph";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { CertificateIcon } from "@/components/ui/icons";
import { buildProductWhatsAppMessage, buildWhatsAppLink } from "@/lib/site-config";

interface ProductCardProps {
  product: Product;
  whatsappNumber: string;
  compareEnabled?: boolean;
  isComparing?: boolean;
  compareDisabled?: boolean;
  onToggleCompare?: (slug: string) => void;
}

export function ProductCard({
  product,
  whatsappNumber,
  compareEnabled = false,
  isComparing = false,
  compareDisabled = false,
  onToggleCompare,
}: ProductCardProps) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface transition-shadow duration-150 ease-out hover:shadow-md hover:shadow-black/[0.04]">
      <Link
        href={`/productos/${product.slug}`}
        className="relative flex aspect-[4/3] items-center justify-center bg-surface-2"
      >
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image.src}
            alt={product.image.alt || product.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <ProductGlyph
            category={product.category}
            presentation={product.presentation}
            className="h-16 w-16 sm:h-32 sm:w-32"
          />
        )}
        {product.classification && (
          <span className="absolute left-3 top-3">
            <Badge tone="red">{product.classification}</Badge>
          </span>
        )}
        {product.status === "draft" && (
          <span className="absolute right-3 top-3">
            <Badge tone="outline" className="bg-bg">
              Borrador
            </Badge>
          </span>
        )}
      </Link>

      {compareEnabled && (
        <label
          className={`flex items-center gap-1.5 border-b border-border px-2.5 py-2 text-[11px] font-medium sm:gap-2 sm:px-4 sm:py-2.5 sm:text-[13px] ${
            compareDisabled ? "cursor-not-allowed text-ink-300" : "cursor-pointer text-ink-600"
          }`}
        >
          <input
            type="checkbox"
            checked={isComparing}
            disabled={compareDisabled}
            onChange={() => onToggleCompare?.(product.slug)}
            className="h-3.5 w-3.5 shrink-0 accent-red-700 sm:h-4 sm:w-4"
          />
          <span className="truncate">Comparar</span>
        </label>
      )}

      <div className="flex flex-1 flex-col gap-2 p-3 sm:gap-3 sm:p-5">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400 sm:text-xs">
            {product.categoryLabel}
          </p>
          <Link href={`/productos/${product.slug}`}>
            <h3 className="mt-1 text-[13px] font-semibold leading-snug text-ink-950 sm:text-[15px] sm:leading-snug lg:text-base">
              {product.name}
            </h3>
          </Link>
        </div>

        <dl className="grid grid-cols-2 gap-x-2 gap-y-1 border-y border-border py-2 font-mono text-[11px] text-ink-700 sm:gap-x-3 sm:gap-y-1.5 sm:py-3 sm:text-[13px]">
          <div>
            <dt className="text-ink-400">Capacidad</dt>
            <dd className="font-medium">{product.capacityLabel}</dd>
          </div>
          {product.extinguishingRating && (
            <div>
              <dt className="text-ink-400">Potencial</dt>
              <dd className="font-medium">{product.extinguishingRating}</dd>
            </div>
          )}
        </dl>

        {product.certification && (
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-ink-500 sm:text-xs">
            <CertificateIcon className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
            <span className="truncate">Certificación {product.certification}</span>
          </div>
        )}

        <p className="text-[13px] font-semibold text-ink-700 sm:text-sm">{product.price || "Consultar precio"}</p>

        <div className="mt-auto flex flex-col gap-1.5 pt-1 sm:gap-2">
          <ButtonLink
            href={`/productos/${product.slug}`}
            variant="secondary"
            size="md"
            className="w-full justify-center !h-9 !px-2 !text-[12px] sm:!h-11 sm:!px-5 sm:!text-[15px]"
          >
            Ver especificaciones
          </ButtonLink>
          <ButtonLink
            href={buildWhatsAppLink(whatsappNumber, buildProductWhatsAppMessage(product.name))}
            external
            size="md"
            className="w-full justify-center !h-9 !px-2 !text-[12px] sm:!h-11 sm:!px-5 sm:!text-[15px]"
          >
            Cotizar
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}
