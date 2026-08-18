"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";
import { setSectionVisibility } from "@/lib/queries";

export async function setSectionVisibilityAction(sectionKey: string, visible: boolean) {
  await requireAuth();
  await setSectionVisibility("home", sectionKey, visible);
  revalidatePath("/", "layout");
  revalidatePath("/admin/contenido");
  return { ok: true as const };
}
