"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";
import { slugify } from "@/lib/slugify";
import { createService, updateService, softDeleteService, reorderServices, type ServiceInput } from "@/lib/queries";

export async function saveServiceAction(
  id: number | null,
  input: Omit<ServiceInput, "slug"> & { slug?: string }
) {
  await requireAuth();
  const slug = input.slug?.trim() || slugify(input.title);
  const finalInput: ServiceInput = { ...input, slug };

  if (id) {
    await updateService(id, finalInput);
  } else {
    await createService(finalInput);
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin/servicios");
  return { ok: true as const };
}

export async function deleteServiceAction(id: number) {
  await requireAuth();
  await softDeleteService(id);
  revalidatePath("/", "layout");
  revalidatePath("/admin/servicios");
  return { ok: true as const };
}

export async function reorderServicesAction(orderedIds: number[]) {
  await requireAuth();
  await reorderServices(orderedIds);
  revalidatePath("/", "layout");
  revalidatePath("/admin/servicios");
  return { ok: true as const };
}
