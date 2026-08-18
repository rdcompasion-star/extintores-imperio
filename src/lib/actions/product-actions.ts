"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";
import { slugify } from "@/lib/slugify";
import {
  createProduct,
  updateProduct,
  setProductStatus,
  duplicateProduct,
  softDeleteProduct,
  restoreProduct,
  reorderProducts,
  type ProductInput,
} from "@/lib/queries";

export async function saveProductAction(id: number | null, input: Omit<ProductInput, "slug"> & { slug?: string }) {
  await requireAuth();
  const slug = input.slug?.trim() || slugify(input.name);
  const finalInput: ProductInput = { ...input, slug };

  if (id) {
    await updateProduct(id, finalInput);
  } else {
    await createProduct(finalInput);
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin/productos");
  return { ok: true as const };
}

export async function setProductStatusAction(id: number, status: "draft" | "published") {
  await requireAuth();
  await setProductStatus(id, status);
  revalidatePath("/", "layout");
  revalidatePath("/admin/productos");
  return { ok: true as const };
}

export async function duplicateProductAction(id: number) {
  await requireAuth();
  await duplicateProduct(id);
  revalidatePath("/admin/productos");
  return { ok: true as const };
}

export async function deleteProductAction(id: number) {
  await requireAuth();
  await softDeleteProduct(id);
  revalidatePath("/", "layout");
  revalidatePath("/admin/productos");
  return { ok: true as const };
}

export async function restoreProductAction(id: number) {
  await requireAuth();
  await restoreProduct(id);
  revalidatePath("/", "layout");
  revalidatePath("/admin/productos");
  return { ok: true as const };
}

export async function reorderProductsAction(orderedIds: number[]) {
  await requireAuth();
  await reorderProducts(orderedIds);
  revalidatePath("/", "layout");
  revalidatePath("/admin/productos");
  return { ok: true as const };
}
