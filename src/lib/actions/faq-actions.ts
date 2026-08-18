"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";
import { createFaq, updateFaq, softDeleteFaq, reorderFaqs, type ContentStatus } from "@/lib/queries";

export async function saveFaqAction(
  id: number | null,
  question: string,
  answer: string,
  status: ContentStatus
) {
  await requireAuth();
  if (id) {
    await updateFaq(id, question, answer, status);
  } else {
    await createFaq(question, answer, status);
  }
  revalidatePath("/", "layout");
  revalidatePath("/admin/faq");
  return { ok: true as const };
}

export async function deleteFaqAction(id: number) {
  await requireAuth();
  await softDeleteFaq(id);
  revalidatePath("/", "layout");
  revalidatePath("/admin/faq");
  return { ok: true as const };
}

export async function reorderFaqsAction(orderedIds: number[]) {
  await requireAuth();
  await reorderFaqs(orderedIds);
  revalidatePath("/", "layout");
  revalidatePath("/admin/faq");
  return { ok: true as const };
}
