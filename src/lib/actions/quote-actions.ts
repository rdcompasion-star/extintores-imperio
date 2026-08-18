"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import {
  createQuote,
  updateQuote,
  duplicateQuote,
  softDeleteQuote,
  setQuoteStatus,
  type QuoteInput,
} from "@/lib/quote-queries";
import type { QuoteStatus } from "@/lib/quote-constants";

export async function saveQuoteAction(id: number | null, input: QuoteInput) {
  await requireAuth();

  let quoteId: number;
  if (id) {
    await updateQuote(id, input);
    quoteId = id;
  } else {
    quoteId = await createQuote(input);
  }

  revalidatePath("/admin/cotizaciones");
  revalidatePath(`/admin/cotizaciones/${quoteId}`);
  return { ok: true as const, id: quoteId };
}

export async function duplicateQuoteAction(id: number) {
  await requireAuth();
  const newId = await duplicateQuote(id);
  revalidatePath("/admin/cotizaciones");
  if (newId) redirect(`/admin/cotizaciones/${newId}`);
  return { ok: false as const };
}

export async function deleteQuoteAction(id: number) {
  await requireAuth();
  await softDeleteQuote(id);
  revalidatePath("/admin/cotizaciones");
  return { ok: true as const };
}

export async function setQuoteStatusAction(id: number, status: QuoteStatus) {
  await requireAuth();
  await setQuoteStatus(id, status);
  revalidatePath("/admin/cotizaciones");
  revalidatePath(`/admin/cotizaciones/${id}`);
  return { ok: true as const };
}
