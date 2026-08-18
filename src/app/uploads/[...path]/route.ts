import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

// Sirve las imágenes subidas desde el panel. Se implementa como route handler
// (no como archivo estático en /public) porque el servidor de producción de
// Next cachea la lista de archivos de /public al arrancar: una imagen subida
// mientras el servidor ya está corriendo no aparecería hasta reiniciar. Este
// handler lee el archivo del disco en cada request, así que las fotos que
// suba el administrador se ven de inmediato, sin reiniciar nada.

const uploadsRoot = path.join(process.cwd(), "data", "uploads");

const mimeByExt: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
};

export async function GET(_req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: segments } = await params;

  if (!segments || segments.length === 0) {
    return new NextResponse("Not found", { status: 404 });
  }

  // Evita path traversal (../) fuera de data/uploads.
  const resolved = path.join(uploadsRoot, ...segments);
  if (!resolved.startsWith(uploadsRoot)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const ext = path.extname(resolved).toLowerCase();
  const mime = mimeByExt[ext];
  if (!mime) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const data = await fs.readFile(resolved);
    return new NextResponse(new Uint8Array(data), {
      status: 200,
      headers: {
        "Content-Type": mime,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
