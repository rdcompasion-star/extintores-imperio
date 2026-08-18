import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import { createElement, type ReactElement } from "react";
import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer";
import "@/lib/bootstrap";
import { isAuthenticated } from "@/lib/auth";
import { getQuote } from "@/lib/quote-queries";
import { getSettings } from "@/lib/settings";
import { dbGet } from "@/lib/db";
import { slugify } from "@/lib/slugify";
import { QuoteDocument } from "@/components/pdf/QuoteDocument";

export const runtime = "nodejs";

const uploadsRoot = path.join(process.cwd(), "data", "uploads");
const mimeByExt: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

// @react-pdf/renderer solo sabe decodificar JPEG y PNG (no WEBP), así que el
// PDF usa siempre el archivo "original" subido, nunca la variante .webp que
// el sitio usa para la web.
async function loadLogoDataUri(logoMediaId: number | null): Promise<string | null> {
  if (!logoMediaId) return null;
  const row = await dbGet<{ variants: string }>(`SELECT variants FROM media WHERE id = ?`, [logoMediaId]);
  if (!row) return null;
  const variants = JSON.parse(row.variants || "{}") as { original?: string };
  if (!variants.original) return null;

  const ext = path.extname(variants.original).toLowerCase();
  const mime = mimeByExt[ext];
  if (!mime) return null;

  try {
    if (/^https?:\/\//.test(variants.original)) {
      const res = await fetch(variants.original);
      if (!res.ok) return null;
      const data = Buffer.from(await res.arrayBuffer());
      return `data:${mime};base64,${data.toString("base64")}`;
    }

    const resolved = path.join(uploadsRoot, variants.original);
    if (!resolved.startsWith(uploadsRoot)) return null;
    const data = await fs.readFile(resolved);
    return `data:${mime};base64,${data.toString("base64")}`;
  } catch {
    return null;
  }
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authed = await isAuthenticated();
  if (!authed) return new NextResponse("No autorizado.", { status: 401 });

  const { id } = await params;
  const quote = await getQuote(Number(id));
  if (!quote) return new NextResponse("Cotización no encontrada.", { status: 404 });

  const settings = await getSettings();
  const logoDataUri = await loadLogoDataUri(settings.logo?.id ?? null);

  const buffer = await renderToBuffer(
    createElement(QuoteDocument, { quote, settings, logoDataUri }) as ReactElement<DocumentProps>
  );

  const clientSlug = slugify(quote.client.name || "cliente") || "cliente";
  const filename = `COTIZACION-${quote.number}-${clientSlug}`.toUpperCase() + ".pdf";

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
