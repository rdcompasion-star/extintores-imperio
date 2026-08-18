export interface MediaRow {
  id: number;
  filename: string;
  original_name: string;
  folder: string;
  alt_text: string;
  mime: string;
  width: number | null;
  height: number | null;
  variants: string;
  created_at: string;
}

export interface MediaVariants {
  original: string;
  webp?: string;
  thumb?: string;
}

export interface Media {
  id: number;
  folder: string;
  alt: string;
  width: number | null;
  height: number | null;
  src: string;
  thumbSrc: string;
  originalName: string;
  createdAt: string;
}

// Con Vercel Blob, las variantes ya son URLs absolutas (https://...). En local
// (sin BLOB_READ_WRITE_TOKEN) son rutas relativas servidas por
// src/app/uploads/[...path]/route.ts. Esta función soporta ambas sin que el
// resto del código necesite saber cuál se está usando.
function resolvePath(value: string): string {
  return /^https?:\/\//.test(value) ? value : `/uploads/${value}`;
}

export function mapMedia(row: MediaRow): Media {
  const variants: MediaVariants = JSON.parse(row.variants || "{}");
  const src = resolvePath(variants.webp || variants.original);
  const thumbSrc = variants.thumb ? resolvePath(variants.thumb) : src;
  return {
    id: row.id,
    folder: row.folder,
    alt: row.alt_text,
    width: row.width,
    height: row.height,
    src,
    thumbSrc,
    originalName: row.original_name,
    createdAt: row.created_at,
  };
}

export const mediaFolders = [
  { value: "hero", label: "Hero" },
  { value: "productos", label: "Productos" },
  { value: "servicios", label: "Servicios" },
  { value: "nosotros", label: "Nosotros" },
  { value: "clientes", label: "Clientes" },
  { value: "general", label: "General" },
] as const;
