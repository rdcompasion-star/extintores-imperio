import { db, dbGet, dbAll, dbRun, logHistory, nowIso } from "@/lib/db";
import { mapMedia, type Media, type MediaRow } from "@/lib/media";
import { contentRegistry } from "@/lib/content-registry";
import type { AgentCategory, Presentation, FireClassId, ContentStatus } from "@/lib/product-constants";

export type { AgentCategory, Presentation, FireClassId, ContentStatus };
export {
  categoryLabels,
  agentFilterOptions,
  classificationFilterOptions,
  capacityFilterOptions,
} from "@/lib/product-constants";

// ---------- Productos ----------

export interface Product {
  id: number;
  slug: string;
  name: string;
  category: AgentCategory;
  categoryLabel: string;
  presentation: Presentation;
  agent: string;
  capacityValue: number;
  capacityUnit: string;
  capacityLabel: string;
  concentration?: string | null;
  extinguishingRating?: string | null;
  classification?: "ABC" | "BC" | "K" | null;
  dischargedWeight?: string | null;
  chargedWeight?: string | null;
  certification?: string | null;
  cabinet?: string | null;
  hose?: string | null;
  nozzle?: string | null;
  reel?: string | null;
  cylinder?: string | null;
  description: string;
  fireClasses: FireClassId[];
  price: string | null;
  image: Media | null;
  gallery: Media[];
  seoTitle: string | null;
  seoDescription: string | null;
  status: ContentStatus;
  order: number;
}

interface ProductRow {
  id: number;
  slug: string;
  name: string;
  category: string;
  category_label: string;
  presentation: string;
  agent: string;
  capacity_value: number;
  capacity_unit: string;
  capacity_label: string;
  concentration: string | null;
  extinguishing_rating: string | null;
  classification: string | null;
  discharged_weight: string | null;
  charged_weight: string | null;
  certification: string | null;
  cabinet: string | null;
  hose: string | null;
  nozzle: string | null;
  reel: string | null;
  cylinder: string | null;
  description: string;
  fire_classes: string;
  price: string | null;
  image_media_id: number | null;
  gallery: string;
  seo_title: string | null;
  seo_description: string | null;
  status: string;
  order_index: number;
}

async function getMediaById(id: number | null): Promise<Media | null> {
  if (!id) return null;
  const row = await dbGet<MediaRow>(`SELECT * FROM media WHERE id = ?`, [id]);
  return row ? mapMedia(row) : null;
}

async function mapProduct(row: ProductRow): Promise<Product> {
  const galleryIds: number[] = JSON.parse(row.gallery || "[]");
  const galleryMedia = await Promise.all(galleryIds.map((id) => getMediaById(id)));
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category as AgentCategory,
    categoryLabel: row.category_label,
    presentation: row.presentation as Presentation,
    agent: row.agent,
    capacityValue: row.capacity_value,
    capacityUnit: row.capacity_unit,
    capacityLabel: row.capacity_label,
    concentration: row.concentration,
    extinguishingRating: row.extinguishing_rating,
    classification: row.classification as Product["classification"],
    dischargedWeight: row.discharged_weight,
    chargedWeight: row.charged_weight,
    certification: row.certification,
    cabinet: row.cabinet,
    hose: row.hose,
    nozzle: row.nozzle,
    reel: row.reel,
    cylinder: row.cylinder,
    description: row.description,
    fireClasses: JSON.parse(row.fire_classes || "[]"),
    price: row.price,
    image: await getMediaById(row.image_media_id),
    gallery: galleryMedia.filter((m): m is Media => !!m),
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    status: row.status as ContentStatus,
    order: row.order_index,
  };
}

export async function listProducts(opts: { includeDrafts?: boolean; includeDeleted?: boolean } = {}): Promise<Product[]> {
  let sql = `SELECT * FROM products WHERE 1=1`;
  if (!opts.includeDeleted) sql += ` AND deleted_at IS NULL`;
  if (!opts.includeDrafts) sql += ` AND status = 'published'`;
  sql += ` ORDER BY order_index ASC, id ASC`;
  const rows = await dbAll<ProductRow>(sql);
  return Promise.all(rows.map(mapProduct));
}

export async function getProductBySlug(slug: string, opts: { includeDrafts?: boolean } = {}): Promise<Product | null> {
  let sql = `SELECT * FROM products WHERE slug = ? AND deleted_at IS NULL`;
  if (!opts.includeDrafts) sql += ` AND status = 'published'`;
  const row = await dbGet<ProductRow>(sql, [slug]);
  return row ? mapProduct(row) : null;
}

export async function getProductById(id: number): Promise<Product | null> {
  const row = await dbGet<ProductRow>(`SELECT * FROM products WHERE id = ?`, [id]);
  return row ? mapProduct(row) : null;
}

export async function getRelatedProducts(product: Product, limit = 3): Promise<Product[]> {
  const rows = await dbAll<ProductRow>(
    `SELECT * FROM products WHERE category = ? AND slug != ? AND status = 'published' AND deleted_at IS NULL ORDER BY order_index ASC LIMIT ?`,
    [product.category, product.slug, limit]
  );
  return Promise.all(rows.map(mapProduct));
}

export interface ProductInput {
  slug: string;
  name: string;
  category: AgentCategory;
  categoryLabel: string;
  presentation: Presentation;
  agent: string;
  capacityValue: number;
  capacityUnit: string;
  capacityLabel: string;
  concentration?: string | null;
  extinguishingRating?: string | null;
  classification?: string | null;
  dischargedWeight?: string | null;
  chargedWeight?: string | null;
  certification?: string | null;
  cabinet?: string | null;
  hose?: string | null;
  nozzle?: string | null;
  reel?: string | null;
  cylinder?: string | null;
  description: string;
  fireClasses: string[];
  price?: string | null;
  imageMediaId?: number | null;
  gallery?: number[];
  seoTitle?: string | null;
  seoDescription?: string | null;
  status: ContentStatus;
}

export async function createProduct(input: ProductInput): Promise<number> {
  const { lastInsertRowid } = await dbRun(
    `INSERT INTO products (
      slug, name, category, category_label, presentation, agent,
      capacity_value, capacity_unit, capacity_label, concentration,
      extinguishing_rating, classification, discharged_weight, charged_weight,
      certification, cabinet, hose, nozzle, reel, cylinder, description,
      fire_classes, price, image_media_id, gallery, seo_title, seo_description,
      status, order_index
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
      (SELECT COALESCE(MAX(order_index), -1) + 1 FROM products))`,
    [
      input.slug,
      input.name,
      input.category,
      input.categoryLabel,
      input.presentation,
      input.agent,
      input.capacityValue,
      input.capacityUnit,
      input.capacityLabel,
      input.concentration ?? null,
      input.extinguishingRating ?? null,
      input.classification ?? null,
      input.dischargedWeight ?? null,
      input.chargedWeight ?? null,
      input.certification ?? null,
      input.cabinet ?? null,
      input.hose ?? null,
      input.nozzle ?? null,
      input.reel ?? null,
      input.cylinder ?? null,
      input.description,
      JSON.stringify(input.fireClasses ?? []),
      input.price ?? null,
      input.imageMediaId ?? null,
      JSON.stringify(input.gallery ?? []),
      input.seoTitle ?? null,
      input.seoDescription ?? null,
      input.status,
    ]
  );
  await logHistory("product", lastInsertRowid, `Se creó el producto "${input.name}".`);
  return lastInsertRowid;
}

export async function updateProduct(id: number, input: ProductInput) {
  await dbRun(
    `UPDATE products SET
      slug=?, name=?, category=?, category_label=?,
      presentation=?, agent=?, capacity_value=?,
      capacity_unit=?, capacity_label=?, concentration=?,
      extinguishing_rating=?, classification=?,
      discharged_weight=?, charged_weight=?, certification=?,
      cabinet=?, hose=?, nozzle=?, reel=?, cylinder=?,
      description=?, fire_classes=?, price=?,
      image_media_id=?, gallery=?, seo_title=?,
      seo_description=?, status=?, updated_at=?
    WHERE id=?`,
    [
      input.slug,
      input.name,
      input.category,
      input.categoryLabel,
      input.presentation,
      input.agent,
      input.capacityValue,
      input.capacityUnit,
      input.capacityLabel,
      input.concentration ?? null,
      input.extinguishingRating ?? null,
      input.classification ?? null,
      input.dischargedWeight ?? null,
      input.chargedWeight ?? null,
      input.certification ?? null,
      input.cabinet ?? null,
      input.hose ?? null,
      input.nozzle ?? null,
      input.reel ?? null,
      input.cylinder ?? null,
      input.description,
      JSON.stringify(input.fireClasses ?? []),
      input.price ?? null,
      input.imageMediaId ?? null,
      JSON.stringify(input.gallery ?? []),
      input.seoTitle ?? null,
      input.seoDescription ?? null,
      input.status,
      nowIso(),
      id,
    ]
  );
  await logHistory("product", id, `Se editó el producto "${input.name}".`);
}

export async function setProductStatus(id: number, status: ContentStatus) {
  const product = await getProductById(id);
  await dbRun(`UPDATE products SET status = ?, updated_at = ? WHERE id = ?`, [status, nowIso(), id]);
  await logHistory(
    "product",
    id,
    status === "published"
      ? `Se publicó el producto "${product?.name}".`
      : `Se ocultó el producto "${product?.name}" (borrador).`
  );
}

export async function duplicateProduct(id: number): Promise<number | null> {
  const product = await getProductById(id);
  if (!product) return null;
  let newSlug = `${product.slug}-copia`;
  let n = 2;
  while (await dbGet(`SELECT 1 as one FROM products WHERE slug = ?`, [newSlug])) {
    newSlug = `${product.slug}-copia-${n}`;
    n++;
  }
  return createProduct({
    ...product,
    slug: newSlug,
    name: `${product.name} (copia)`,
    classification: product.classification,
    fireClasses: product.fireClasses,
    imageMediaId: product.image?.id ?? null,
    gallery: product.gallery.map((g) => g.id),
    status: "draft",
  });
}

export async function softDeleteProduct(id: number) {
  const product = await getProductById(id);
  await dbRun(`UPDATE products SET deleted_at = ? WHERE id = ?`, [nowIso(), id]);
  await logHistory("product", id, `Se eliminó el producto "${product?.name}" (movido a la papelera).`);
}

export async function restoreProduct(id: number) {
  await dbRun(`UPDATE products SET deleted_at = NULL WHERE id = ?`, [id]);
  await logHistory("product", id, `Se restauró un producto desde la papelera.`);
}

export async function listTrashedProducts(): Promise<Product[]> {
  const rows = await dbAll<ProductRow>(
    `SELECT * FROM products WHERE deleted_at IS NOT NULL ORDER BY deleted_at DESC`
  );
  return Promise.all(rows.map(mapProduct));
}

export async function reorderProducts(orderedIds: number[]) {
  await db.batch(
    orderedIds.map((id, i) => ({ sql: `UPDATE products SET order_index = ? WHERE id = ?`, args: [i, id] })),
    "write"
  );
}

// ---------- Servicios ----------

export interface Service {
  id: number;
  slug: string;
  title: string;
  summary: string;
  description: string;
  image: Media | null;
  ctaText: string;
  ctaType: "whatsapp" | "tel" | "email" | "internal" | "external";
  ctaValue: string;
  status: ContentStatus;
  order: number;
}

interface ServiceRow {
  id: number;
  slug: string;
  title: string;
  summary: string;
  description: string;
  image_media_id: number | null;
  cta_text: string;
  cta_type: string;
  cta_value: string;
  status: string;
  order_index: number;
}

async function mapService(row: ServiceRow): Promise<Service> {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    description: row.description,
    image: await getMediaById(row.image_media_id),
    ctaText: row.cta_text,
    ctaType: row.cta_type as Service["ctaType"],
    ctaValue: row.cta_value,
    status: row.status as ContentStatus,
    order: row.order_index,
  };
}

export async function listServices(opts: { includeDrafts?: boolean; includeDeleted?: boolean } = {}): Promise<Service[]> {
  let sql = `SELECT * FROM services WHERE 1=1`;
  if (!opts.includeDeleted) sql += ` AND deleted_at IS NULL`;
  if (!opts.includeDrafts) sql += ` AND status = 'published'`;
  sql += ` ORDER BY order_index ASC`;
  const rows = await dbAll<ServiceRow>(sql);
  return Promise.all(rows.map(mapService));
}

export async function getServiceById(id: number): Promise<Service | null> {
  const row = await dbGet<ServiceRow>(`SELECT * FROM services WHERE id = ?`, [id]);
  return row ? mapService(row) : null;
}

export interface ServiceInput {
  slug: string;
  title: string;
  summary: string;
  description: string;
  imageMediaId?: number | null;
  ctaText: string;
  ctaType: Service["ctaType"];
  ctaValue: string;
  status: ContentStatus;
}

export async function createService(input: ServiceInput): Promise<number> {
  const { lastInsertRowid } = await dbRun(
    `INSERT INTO services (slug, title, summary, description, image_media_id, cta_text, cta_type, cta_value, status, order_index)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, (SELECT COALESCE(MAX(order_index), -1) + 1 FROM services))`,
    [
      input.slug,
      input.title,
      input.summary,
      input.description,
      input.imageMediaId ?? null,
      input.ctaText,
      input.ctaType,
      input.ctaValue,
      input.status,
    ]
  );
  await logHistory("service", lastInsertRowid, `Se creó el servicio "${input.title}".`);
  return lastInsertRowid;
}

export async function updateService(id: number, input: ServiceInput) {
  await dbRun(
    `UPDATE services SET slug=?, title=?, summary=?, description=?,
      image_media_id=?, cta_text=?, cta_type=?, cta_value=?,
      status=?, updated_at=? WHERE id=?`,
    [
      input.slug,
      input.title,
      input.summary,
      input.description,
      input.imageMediaId ?? null,
      input.ctaText,
      input.ctaType,
      input.ctaValue,
      input.status,
      nowIso(),
      id,
    ]
  );
  await logHistory("service", id, `Se editó el servicio "${input.title}".`);
}

export async function softDeleteService(id: number) {
  const s = await getServiceById(id);
  await dbRun(`UPDATE services SET deleted_at = ? WHERE id = ?`, [nowIso(), id]);
  await logHistory("service", id, `Se eliminó el servicio "${s?.title}".`);
}

export async function reorderServices(orderedIds: number[]) {
  await db.batch(
    orderedIds.map((id, i) => ({ sql: `UPDATE services SET order_index = ? WHERE id = ?`, args: [i, id] })),
    "write"
  );
}

// ---------- FAQ ----------

export interface Faq {
  id: number;
  question: string;
  answer: string;
  status: ContentStatus;
  order: number;
}

interface FaqRow {
  id: number;
  question: string;
  answer: string;
  status: string;
  order_index: number;
}

function mapFaq(row: FaqRow): Faq {
  return { id: row.id, question: row.question, answer: row.answer, status: row.status as ContentStatus, order: row.order_index };
}

export async function listFaqs(opts: { includeDrafts?: boolean; includeDeleted?: boolean } = {}): Promise<Faq[]> {
  let sql = `SELECT * FROM faq WHERE 1=1`;
  if (!opts.includeDeleted) sql += ` AND deleted_at IS NULL`;
  if (!opts.includeDrafts) sql += ` AND status = 'published'`;
  sql += ` ORDER BY order_index ASC`;
  const rows = await dbAll<FaqRow>(sql);
  return rows.map(mapFaq);
}

export async function getFaqById(id: number): Promise<Faq | null> {
  const row = await dbGet<FaqRow>(`SELECT * FROM faq WHERE id = ?`, [id]);
  return row ? mapFaq(row) : null;
}

export async function createFaq(question: string, answer: string, status: ContentStatus): Promise<number> {
  const { lastInsertRowid } = await dbRun(
    `INSERT INTO faq (question, answer, status, order_index) VALUES (?, ?, ?, (SELECT COALESCE(MAX(order_index), -1) + 1 FROM faq))`,
    [question, answer, status]
  );
  await logHistory("faq", lastInsertRowid, `Se creó la pregunta "${question}".`);
  return lastInsertRowid;
}

export async function updateFaq(id: number, question: string, answer: string, status: ContentStatus) {
  await dbRun(`UPDATE faq SET question=?, answer=?, status=?, updated_at=? WHERE id=?`, [
    question,
    answer,
    status,
    nowIso(),
    id,
  ]);
  await logHistory("faq", id, `Se editó la pregunta "${question}".`);
}

export async function softDeleteFaq(id: number) {
  const f = await getFaqById(id);
  await dbRun(`UPDATE faq SET deleted_at = ? WHERE id = ?`, [nowIso(), id]);
  await logHistory("faq", id, `Se eliminó la pregunta "${f?.question}".`);
}

export async function reorderFaqs(orderedIds: number[]) {
  await db.batch(
    orderedIds.map((id, i) => ({ sql: `UPDATE faq SET order_index = ? WHERE id = ?`, args: [i, id] })),
    "write"
  );
}

// ---------- Menú ----------

export interface MenuItem {
  id: number;
  label: string;
  href: string;
  visible: boolean;
  order: number;
}

interface MenuRow {
  id: number;
  label: string;
  href: string;
  visible: number;
  order_index: number;
}

function mapMenuItem(row: MenuRow): MenuItem {
  return { id: row.id, label: row.label, href: row.href, visible: !!row.visible, order: row.order_index };
}

export async function listMenuItems(opts: { onlyVisible?: boolean } = {}): Promise<MenuItem[]> {
  let sql = `SELECT * FROM menu_items`;
  if (opts.onlyVisible) sql += ` WHERE visible = 1`;
  sql += ` ORDER BY order_index ASC`;
  const rows = await dbAll<MenuRow>(sql);
  return rows.map(mapMenuItem);
}

export async function createMenuItem(label: string, href: string): Promise<number> {
  const { lastInsertRowid } = await dbRun(
    `INSERT INTO menu_items (label, href, visible, order_index) VALUES (?, ?, 1, (SELECT COALESCE(MAX(order_index), -1) + 1 FROM menu_items))`,
    [label, href]
  );
  await logHistory("menu", lastInsertRowid, `Se agregó "${label}" al menú.`);
  return lastInsertRowid;
}

export async function updateMenuItem(id: number, label: string, href: string, visible: boolean) {
  await dbRun(`UPDATE menu_items SET label=?, href=?, visible=? WHERE id=?`, [label, href, visible ? 1 : 0, id]);
  await logHistory("menu", id, `Se editó el elemento de menú "${label}".`);
}

export async function deleteMenuItem(id: number) {
  await dbRun(`DELETE FROM menu_items WHERE id = ?`, [id]);
  await logHistory("menu", id, `Se eliminó un elemento del menú.`);
}

export async function reorderMenuItems(orderedIds: number[]) {
  await db.batch(
    orderedIds.map((id, i) => ({ sql: `UPDATE menu_items SET order_index = ? WHERE id = ?`, args: [i, id] })),
    "write"
  );
  await logHistory("menu", null, `Se reordenó el menú.`);
}

// ---------- Secciones (visible on/off) ----------

export interface SectionRow {
  id: number;
  page: string;
  section_key: string;
  label: string;
  visible: number;
  order_index: number;
}

export interface SectionState {
  key: string;
  label: string;
  visible: boolean;
  order: number;
}

export async function listSections(page = "home"): Promise<SectionState[]> {
  const rows = await dbAll<SectionRow>(`SELECT * FROM sections WHERE page = ? ORDER BY order_index ASC`, [page]);
  return rows.map((r) => ({ key: r.section_key, label: r.label, visible: !!r.visible, order: r.order_index }));
}

export async function isSectionVisible(page: string, sectionKey: string): Promise<boolean> {
  const row = await dbGet<{ visible: number }>(
    `SELECT visible FROM sections WHERE page = ? AND section_key = ?`,
    [page, sectionKey]
  );
  return row ? !!row.visible : true;
}

export async function setSectionVisibility(page: string, sectionKey: string, visible: boolean) {
  await dbRun(`UPDATE sections SET visible = ? WHERE page = ? AND section_key = ?`, [
    visible ? 1 : 0,
    page,
    sectionKey,
  ]);
  const section = contentRegistry.find((s) => s.section === sectionKey);
  await logHistory(
    "section",
    sectionKey,
    `Se ${visible ? "activó" : "desactivó"} la sección "${section?.sectionLabel ?? sectionKey}".`
  );
}

// ---------- Contenido (content_blocks) ----------

interface ContentBlockRow {
  id: number;
  page: string;
  section: string;
  field: string;
  value: string;
  draft_value: string | null;
  has_draft: number;
  updated_at: string;
}

export async function getContentMap(page = "home"): Promise<Record<string, Record<string, string>>> {
  const rows = await dbAll<ContentBlockRow>(`SELECT * FROM content_blocks WHERE page = ?`, [page]);
  const map: Record<string, Record<string, string>> = {};
  for (const row of rows) {
    if (!map[row.section]) map[row.section] = {};
    map[row.section][row.field] = row.value;
  }
  return map;
}

export async function getContentValue(page: string, section: string, field: string, fallback = ""): Promise<string> {
  const row = await dbGet<{ value: string }>(
    `SELECT value FROM content_blocks WHERE page = ? AND section = ? AND field = ?`,
    [page, section, field]
  );
  return row?.value ?? fallback;
}

export async function updateContentBlock(page: string, section: string, field: string, value: string) {
  await dbRun(
    `UPDATE content_blocks SET value = ?, has_draft = 0, draft_value = NULL, updated_at = ? WHERE page = ? AND section = ? AND field = ?`,
    [value, nowIso(), page, section, field]
  );
  const def = contentRegistry.find((s) => s.section === section)?.fields.find((f) => f.field === field);
  await logHistory("content", `${page}.${section}.${field}`, `Se editó "${def?.label ?? field}" en la sección "${section}".`);
}

// ---------- Medios ----------

export async function listMedia(folder?: string): Promise<Media[]> {
  const rows = folder
    ? await dbAll<MediaRow>(`SELECT * FROM media WHERE folder = ? ORDER BY created_at DESC`, [folder])
    : await dbAll<MediaRow>(`SELECT * FROM media ORDER BY created_at DESC`);
  return rows.map(mapMedia);
}

export async function getMediaRowById(id: number): Promise<Media | null> {
  return getMediaById(id);
}

export async function createMediaRecord(input: {
  filename: string;
  originalName: string;
  folder: string;
  mime: string;
  width: number | null;
  height: number | null;
  variants: Record<string, string>;
}): Promise<Media> {
  const { lastInsertRowid } = await dbRun(
    `INSERT INTO media (filename, original_name, folder, mime, width, height, variants) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      input.filename,
      input.originalName,
      input.folder,
      input.mime,
      input.width,
      input.height,
      JSON.stringify(input.variants),
    ]
  );
  await logHistory("media", lastInsertRowid, `Se subió la imagen "${input.originalName}".`);
  const row = await dbGet<MediaRow>(`SELECT * FROM media WHERE id = ?`, [lastInsertRowid]);
  return mapMedia(row as MediaRow);
}

export async function updateMediaAlt(id: number, alt: string) {
  await dbRun(`UPDATE media SET alt_text = ? WHERE id = ?`, [alt, id]);
  await logHistory("media", id, `Se actualizó el texto alternativo de una imagen.`);
}

export async function deleteMediaRecord(id: number): Promise<{ media: Media; folder: string; filePaths: string[] } | null> {
  const row = await dbGet<MediaRow>(`SELECT * FROM media WHERE id = ?`, [id]);
  if (!row) return null;
  await dbRun(`DELETE FROM media WHERE id = ?`, [id]);
  await logHistory("media", id, `Se eliminó la imagen "${row.original_name}".`);
  const variants: Record<string, string> = JSON.parse(row.variants || "{}");
  return { media: mapMedia(row), folder: row.folder, filePaths: Object.values(variants) };
}

export async function isMediaInUse(id: number): Promise<boolean> {
  const inProduct = await dbGet(`SELECT 1 as one FROM products WHERE image_media_id = ? OR gallery LIKE '%' || ? || '%'`, [id, id]);
  const inService = await dbGet(`SELECT 1 as one FROM services WHERE image_media_id = ?`, [id]);
  const inSettings = await dbGet(`SELECT 1 as one FROM settings WHERE logo_media_id = ? OR favicon_media_id = ?`, [id, id]);
  return !!(inProduct || inService || inSettings);
}

// ---------- Historial ----------

export interface HistoryEntry {
  id: number;
  createdAt: string;
  entityType: string;
  entityId: string | null;
  summary: string;
  username: string;
}

export async function listHistory(limit = 50): Promise<HistoryEntry[]> {
  const rows = await dbAll<{
    id: number;
    created_at: string;
    entity_type: string;
    entity_id: string | null;
    summary: string;
    username: string;
  }>(`SELECT * FROM history ORDER BY id DESC LIMIT ?`, [limit]);
  return rows.map((r) => ({
    id: r.id,
    createdAt: r.created_at,
    entityType: r.entity_type,
    entityId: r.entity_id,
    summary: r.summary,
    username: r.username,
  }));
}
