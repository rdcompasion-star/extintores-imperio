"use server";

import { revalidatePath } from "next/cache";
import { requireAuth, verifyPassword, changePassword as changePasswordDb } from "@/lib/auth";
import { updateSettings, type SettingsPatch } from "@/lib/settings";

export async function updateSettingsAction(patch: SettingsPatch) {
  await requireAuth();
  await updateSettings(patch);
  revalidatePath("/", "layout");
  return { ok: true as const };
}

export async function changePasswordAction(_prevState: { error: string; ok?: boolean } | null, formData: FormData) {
  await requireAuth();
  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (!current || !next || !confirm) return { error: "Completa los tres campos." };
  if (next.length < 6) return { error: "La nueva contraseña debe tener al menos 6 caracteres." };
  if (next !== confirm) return { error: "Las contraseñas nuevas no coinciden." };

  const valid = await verifyPassword("admin", current);
  if (!valid) return { error: "La contraseña actual no es correcta." };

  await changePasswordDb("admin", next);
  return { error: "", ok: true };
}
