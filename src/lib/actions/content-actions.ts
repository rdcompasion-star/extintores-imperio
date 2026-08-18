"use server";

import { revalidatePath } from "next/cache";
import { isAuthenticated } from "@/lib/auth";
import { updateContentBlock } from "@/lib/queries";

export async function updateContentBlockAction(
  page: string,
  section: string,
  field: string,
  value: string
): Promise<{ ok: boolean; error?: string }> {
  const authed = await isAuthenticated();
  if (!authed) return { ok: false, error: "No autorizado." };

  await updateContentBlock(page, section, field, value);
  revalidatePath("/", "layout");
  return { ok: true };
}
