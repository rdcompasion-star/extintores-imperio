"use server";

import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";
import { put, del } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";
import { createMediaRecord, deleteMediaRecord, updateMediaAlt, isMediaInUse } from "@/lib/queries";

// En Vercel el filesystem es efímero: si hay BLOB_READ_WRITE_TOKEN, las
// imágenes se suben a Vercel Blob (URLs públicas reales). Si no, se guardan
// en disco local (sirve para desarrollo) y las sirve
// src/app/uploads/[...path]/route.ts.
const useBlob = !!process.env.BLOB_READ_WRITE_TOKEN;
const uploadsRoot = path.join(process.cwd(), "data", "uploads");
const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/svg+xml"];
const maxBytes = 10 * 1024 * 1024;

async function saveFile(relPath: string, buffer: Buffer, contentType: string): Promise<string> {
  if (useBlob) {
    const blob = await put(relPath, buffer, { access: "public", contentType, addRandomSuffix: false });
    return blob.url;
  }
  const fullPath = path.join(uploadsRoot, relPath);
  await fs.mkdir(path.dirname(fullPath), { recursive: true });
  await fs.writeFile(fullPath, buffer);
  return relPath;
}

async function deleteFile(pathOrUrl: string): Promise<void> {
  if (/^https?:\/\//.test(pathOrUrl)) {
    try {
      await del(pathOrUrl);
    } catch {
      // ya no existe en el storage; no es un error del usuario
    }
    return;
  }
  try {
    await fs.unlink(path.join(uploadsRoot, pathOrUrl));
  } catch {
    // el archivo ya no existe; no es un error del usuario
  }
}

export async function uploadMediaAction(formData: FormData) {
  await requireAuth();

  const file = formData.get("file") as File | null;
  const folder = String(formData.get("folder") ?? "general");

  if (!file || file.size === 0) {
    return { ok: false as const, error: "No se seleccionó ningún archivo." };
  }
  if (!allowedTypes.includes(file.type)) {
    return { ok: false as const, error: "Formato no soportado. Usa JPG, PNG, WEBP, AVIF o SVG." };
  }
  if (file.size > maxBytes) {
    return { ok: false as const, error: "La imagen supera el límite de 10MB." };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const id = crypto.randomBytes(8).toString("hex");

  const extMap: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/avif": "avif",
    "image/svg+xml": "svg",
  };
  const ext = extMap[file.type] ?? "bin";
  const originalFilename = `${id}-original.${ext}`;

  try {
    const variants: Record<string, string> = {
      original: await saveFile(`${folder}/${originalFilename}`, buffer, file.type),
    };

    let width: number | null = null;
    let height: number | null = null;

    if (file.type !== "image/svg+xml") {
      const meta = await sharp(buffer).metadata();
      width = meta.width ?? null;
      height = meta.height ?? null;

      const webpBuffer = await sharp(buffer)
        .resize({ width: 1600, withoutEnlargement: true })
        .webp({ quality: 82 })
        .toBuffer();
      variants.webp = await saveFile(`${folder}/${id}.webp`, webpBuffer, "image/webp");

      const thumbBuffer = await sharp(buffer)
        .resize({ width: 400, withoutEnlargement: true })
        .webp({ quality: 78 })
        .toBuffer();
      variants.thumb = await saveFile(`${folder}/${id}-thumb.webp`, thumbBuffer, "image/webp");
    }

    const media = await createMediaRecord({
      filename: originalFilename,
      originalName: file.name,
      folder,
      mime: file.type,
      width,
      height,
      variants,
    });

    revalidatePath("/", "layout");
    revalidatePath("/admin/medios");
    return { ok: true as const, media };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("uploadMediaAction failed:", err);
    return { ok: false as const, error: "No se pudo procesar la imagen. Intenta nuevamente." };
  }
}

export async function deleteMediaAction(id: number) {
  await requireAuth();

  if (await isMediaInUse(id)) {
    return {
      ok: false as const,
      error: "Esta imagen se está usando en el sitio. Reemplázala antes de eliminarla.",
    };
  }

  const result = await deleteMediaRecord(id);
  if (result) {
    await Promise.all(result.filePaths.map((p) => deleteFile(p)));
  }

  revalidatePath("/admin/medios");
  return { ok: true as const };
}

export async function updateMediaAltAction(id: number, alt: string) {
  await requireAuth();
  await updateMediaAlt(id, alt);
  revalidatePath("/", "layout");
  return { ok: true as const };
}
