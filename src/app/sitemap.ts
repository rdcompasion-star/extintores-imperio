import type { MetadataRoute } from "next";
import "@/lib/bootstrap";
import { listProducts } from "@/lib/queries";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    "/productos",
    "/servicios",
    "/tipos-de-fuego",
    "/normativa",
    "/nosotros",
    "/faq",
    "/contacto",
  ].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1 : 0.7,
  }));

  const products = await listProducts();
  const productRoutes = products.map((p) => ({
    url: `${SITE_URL}/productos/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...productRoutes];
}
