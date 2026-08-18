import fs from "node:fs/promises";
import crypto from "node:crypto";
import sharp from "sharp";
import { put } from "@vercel/blob";
import "../src/lib/db";
import { createMediaRecord } from "../src/lib/queries";
import { updateSettings } from "../src/lib/settings";

const buffer = await fs.readFile("public/logo-imperio-transparent.png");
const id = crypto.randomBytes(8).toString("hex");
const folder = "general";

const meta = await sharp(buffer).metadata();

const webpBuffer = await sharp(buffer).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 90 }).toBuffer();
const thumbBuffer = await sharp(buffer).resize({ width: 400, withoutEnlargement: true }).webp({ quality: 85 }).toBuffer();

const originalBlob = await put(`${folder}/${id}-original.png`, buffer, { access: "public", contentType: "image/png", addRandomSuffix: false });
const webpBlob = await put(`${folder}/${id}.webp`, webpBuffer, { access: "public", contentType: "image/webp", addRandomSuffix: false });
const thumbBlob = await put(`${folder}/${id}-thumb.webp`, thumbBuffer, { access: "public", contentType: "image/webp", addRandomSuffix: false });

const media = await createMediaRecord({
  filename: `${id}-original.png`,
  originalName: "logo-imperio.png",
  folder,
  mime: "image/png",
  width: meta.width ?? null,
  height: meta.height ?? null,
  variants: { original: originalBlob.url, webp: webpBlob.url, thumb: thumbBlob.url },
});

await updateSettings({ logoMediaId: media.id });

// eslint-disable-next-line no-console
console.log("Logo actualizado:", media.id, webpBlob.url);
