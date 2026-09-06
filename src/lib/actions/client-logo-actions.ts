"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";
import {
  createClientLogo,
  updateClientLogo,
  replaceClientLogoMedia,
  deleteClientLogo,
  reorderClientLogos,
} from "@/lib/queries";

export async function addClientLogoAction(mediaId: number, name: string) {
  await requireAuth();
  const id = await createClientLogo(mediaId, name);
  revalidatePath("/", "layout");
  revalidatePath("/admin/clientes");
  return { ok: true as const, id };
}

export async function updateClientLogoAction(id: number, name: string) {
  await requireAuth();
  await updateClientLogo(id, name);
  revalidatePath("/", "layout");
  revalidatePath("/admin/clientes");
  return { ok: true as const };
}

export async function replaceClientLogoMediaAction(id: number, mediaId: number) {
  await requireAuth();
  await replaceClientLogoMedia(id, mediaId);
  revalidatePath("/", "layout");
  revalidatePath("/admin/clientes");
  return { ok: true as const };
}

export async function deleteClientLogoAction(id: number) {
  await requireAuth();
  await deleteClientLogo(id);
  revalidatePath("/", "layout");
  revalidatePath("/admin/clientes");
  return { ok: true as const };
}

export async function reorderClientLogosAction(orderedIds: number[]) {
  await requireAuth();
  await reorderClientLogos(orderedIds);
  revalidatePath("/", "layout");
  revalidatePath("/admin/clientes");
  return { ok: true as const };
}
