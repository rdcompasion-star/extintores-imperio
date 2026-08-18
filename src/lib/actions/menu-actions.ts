"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";
import { createMenuItem, updateMenuItem, deleteMenuItem, reorderMenuItems } from "@/lib/queries";

export async function saveMenuItemAction(
  id: number | null,
  label: string,
  href: string,
  visible: boolean
) {
  await requireAuth();
  if (id) {
    await updateMenuItem(id, label, href, visible);
  } else {
    await createMenuItem(label, href);
  }
  revalidatePath("/", "layout");
  revalidatePath("/admin/menu");
  return { ok: true as const };
}

export async function deleteMenuItemAction(id: number) {
  await requireAuth();
  await deleteMenuItem(id);
  revalidatePath("/", "layout");
  revalidatePath("/admin/menu");
  return { ok: true as const };
}

export async function reorderMenuItemsAction(orderedIds: number[]) {
  await requireAuth();
  await reorderMenuItems(orderedIds);
  revalidatePath("/", "layout");
  revalidatePath("/admin/menu");
  return { ok: true as const };
}
