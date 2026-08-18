import { db, dbGet, dbAll, dbRun, logHistory, nowIso } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { calculateQuote, type CalcLineInput } from "@/lib/quote-calculations";
import type { DiscountType, QuoteItemKind, QuoteStatus } from "@/lib/quote-constants";

// ---------- Catálogo ----------

export interface QuoteCatalogItem {
  id: number;
  code: string;
  kind: QuoteItemKind;
  category: string;
  name: string;
  unit: string;
  sizeLabel: string;
  netPrice: number;
  active: boolean;
  notes: string;
}

interface QuoteCatalogRow {
  id: number;
  code: string;
  kind: string;
  category: string;
  name: string;
  unit: string;
  size_label: string;
  net_price: number;
  active: number;
  notes: string;
}

function mapCatalogItem(row: QuoteCatalogRow): QuoteCatalogItem {
  return {
    id: row.id,
    code: row.code,
    kind: row.kind as QuoteItemKind,
    category: row.category,
    name: row.name,
    unit: row.unit,
    sizeLabel: row.size_label,
    netPrice: row.net_price,
    active: !!row.active,
    notes: row.notes,
  };
}

export async function listCatalogItems(options: { includeInactive?: boolean } = {}): Promise<QuoteCatalogItem[]> {
  const rows = options.includeInactive
    ? await dbAll<QuoteCatalogRow>(`SELECT * FROM quote_catalog_items ORDER BY order_index ASC`)
    : await dbAll<QuoteCatalogRow>(`SELECT * FROM quote_catalog_items WHERE active = 1 ORDER BY order_index ASC`);
  return rows.map(mapCatalogItem);
}

export async function getCatalogItem(id: number): Promise<QuoteCatalogItem | null> {
  const row = await dbGet<QuoteCatalogRow>(`SELECT * FROM quote_catalog_items WHERE id = ?`, [id]);
  return row ? mapCatalogItem(row) : null;
}

export async function setCatalogItemActive(id: number, active: boolean) {
  await dbRun(`UPDATE quote_catalog_items SET active = ?, updated_at = ? WHERE id = ?`, [
    active ? 1 : 0,
    nowIso(),
    id,
  ]);
}

// ---------- Numeración ----------

async function getNextQuoteNumber(prefix: string): Promise<string> {
  const year = new Date().getFullYear();
  const tx = await db.transaction("write");
  try {
    const res = await tx.execute({ sql: `SELECT last_number FROM quote_counters WHERE year = ?`, args: [year] });
    const row = res.rows[0] as unknown as { last_number: number } | undefined;
    const nextNumber = (row?.last_number ?? 0) + 1;
    if (row) {
      await tx.execute({ sql: `UPDATE quote_counters SET last_number = ? WHERE year = ?`, args: [nextNumber, year] });
    } else {
      await tx.execute({ sql: `INSERT INTO quote_counters (year, last_number) VALUES (?, ?)`, args: [year, nextNumber] });
    }
    await tx.commit();
    return `${prefix}-${year}-${String(nextNumber).padStart(4, "0")}`;
  } catch (err) {
    await tx.rollback();
    throw err;
  }
}

// ---------- Cotizaciones ----------

export interface QuoteLineInput {
  catalogItemId: number | null;
  kind: QuoteItemKind;
  code: string;
  name: string;
  sizeLabel: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  discountType: DiscountType;
  discountValue: number;
}

export interface QuoteClientInput {
  name: string;
  rut: string;
  contact: string;
  phone: string;
  email: string;
  address: string;
  comuna: string;
  city: string;
  activity: string;
}

export interface QuoteInput {
  seller: string;
  issueDate: string;
  validUntil: string;
  client: QuoteClientInput;
  items: QuoteLineInput[];
  discountType: DiscountType;
  discountValue: number;
  vatRate: number;
  observations: string;
  paymentTerms: string;
  deliveryTerms: string;
  dispatchTerms: string;
  warrantyTerms: string;
  extraTerms: string;
  status: QuoteStatus;
}

export interface QuoteLine extends QuoteLineInput {
  id: number;
  lineTotal: number;
}

export interface Quote {
  id: number;
  number: string;
  issueDate: string;
  validUntil: string;
  seller: string;
  client: QuoteClientInput;
  items: QuoteLine[];
  discountType: DiscountType;
  discountValue: number;
  vatRate: number;
  subtotal: number;
  discountAmount: number;
  net: number;
  vatAmount: number;
  total: number;
  observations: string;
  paymentTerms: string;
  deliveryTerms: string;
  dispatchTerms: string;
  warrantyTerms: string;
  extraTerms: string;
  status: QuoteStatus;
  createdAt: string;
  updatedAt: string;
}

interface QuoteRow {
  id: number;
  number: string;
  issue_date: string;
  valid_until: string;
  seller: string;
  client_name: string;
  client_rut: string;
  client_contact: string;
  client_phone: string;
  client_email: string;
  client_address: string;
  client_comuna: string;
  client_city: string;
  client_activity: string;
  discount_type: string;
  discount_value: number;
  vat_rate: number;
  subtotal: number;
  discount_amount: number;
  net: number;
  vat_amount: number;
  total: number;
  observations: string;
  payment_terms: string;
  delivery_terms: string;
  dispatch_terms: string;
  warranty_terms: string;
  extra_terms: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface QuoteItemRow {
  id: number;
  catalog_item_id: number | null;
  kind: string;
  code: string;
  name: string;
  size_label: string;
  unit: string;
  quantity: number;
  unit_price: number;
  discount_type: string;
  discount_value: number;
  line_total: number;
}

function mapQuoteItem(row: QuoteItemRow): QuoteLine {
  return {
    id: row.id,
    catalogItemId: row.catalog_item_id,
    kind: row.kind as QuoteItemKind,
    code: row.code,
    name: row.name,
    sizeLabel: row.size_label,
    unit: row.unit,
    quantity: row.quantity,
    unitPrice: row.unit_price,
    discountType: row.discount_type as DiscountType,
    discountValue: row.discount_value,
    lineTotal: row.line_total,
  };
}

function mapQuote(row: QuoteRow, items: QuoteLine[]): Quote {
  return {
    id: row.id,
    number: row.number,
    issueDate: row.issue_date,
    validUntil: row.valid_until,
    seller: row.seller,
    client: {
      name: row.client_name,
      rut: row.client_rut,
      contact: row.client_contact,
      phone: row.client_phone,
      email: row.client_email,
      address: row.client_address,
      comuna: row.client_comuna,
      city: row.client_city,
      activity: row.client_activity,
    },
    items,
    discountType: row.discount_type as DiscountType,
    discountValue: row.discount_value,
    vatRate: row.vat_rate,
    subtotal: row.subtotal,
    discountAmount: row.discount_amount,
    net: row.net,
    vatAmount: row.vat_amount,
    total: row.total,
    observations: row.observations,
    paymentTerms: row.payment_terms,
    deliveryTerms: row.delivery_terms,
    dispatchTerms: row.dispatch_terms,
    warrantyTerms: row.warranty_terms,
    extraTerms: row.extra_terms,
    status: row.status as QuoteStatus,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function itemsToCalcLines(items: QuoteLineInput[]): CalcLineInput[] {
  return items.map((item) => ({
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    discountType: item.discountType,
    discountValue: item.discountValue,
  }));
}

function computeLineTotal(item: QuoteLineInput): number {
  const lineSubtotal = item.quantity * item.unitPrice;
  return item.discountType === "percent"
    ? Math.round(lineSubtotal - (lineSubtotal * Math.min(Math.max(item.discountValue, 0), 100)) / 100)
    : item.discountType === "amount"
      ? lineSubtotal - Math.min(Math.max(item.discountValue, 0), lineSubtotal)
      : lineSubtotal;
}

export async function createQuote(input: QuoteInput): Promise<number> {
  const settings = await getSettings();
  const totals = calculateQuote({
    lines: itemsToCalcLines(input.items),
    globalDiscountType: input.discountType,
    globalDiscountValue: input.discountValue,
    vatRate: input.vatRate,
  });
  const number = await getNextQuoteNumber(settings.quoteNumberPrefix || "COT");

  const tx = await db.transaction("write");
  let newId: number;
  try {
    const result = await tx.execute({
      sql: `INSERT INTO quotes (
          number, issue_date, valid_until, seller,
          client_name, client_rut, client_contact, client_phone, client_email,
          client_address, client_comuna, client_city, client_activity,
          discount_type, discount_value, vat_rate,
          subtotal, discount_amount, net, vat_amount, total,
          observations, payment_terms, delivery_terms, dispatch_terms, warranty_terms, extra_terms,
          status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        number,
        input.issueDate,
        input.validUntil,
        input.seller,
        input.client.name,
        input.client.rut,
        input.client.contact,
        input.client.phone,
        input.client.email,
        input.client.address,
        input.client.comuna,
        input.client.city,
        input.client.activity,
        input.discountType,
        input.discountValue,
        input.vatRate,
        totals.subtotal,
        totals.discountAmount,
        totals.net,
        totals.vatAmount,
        totals.total,
        input.observations,
        input.paymentTerms,
        input.deliveryTerms,
        input.dispatchTerms,
        input.warrantyTerms,
        input.extraTerms,
        input.status,
      ],
    });
    newId = Number(result.lastInsertRowid);

    for (let i = 0; i < input.items.length; i++) {
      const item = input.items[i];
      await tx.execute({
        sql: `INSERT INTO quote_items (
          quote_id, catalog_item_id, kind, code, name, size_label, unit, quantity, unit_price,
          discount_type, discount_value, line_total, order_index
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          newId,
          item.catalogItemId,
          item.kind,
          item.code,
          item.name,
          item.sizeLabel,
          item.unit,
          item.quantity,
          item.unitPrice,
          item.discountType,
          item.discountValue,
          computeLineTotal(item),
          i,
        ],
      });
    }
    await tx.commit();
  } catch (err) {
    await tx.rollback();
    throw err;
  }

  await logHistory("quotes", newId, `Se creó la cotización.`);
  return newId;
}

export async function updateQuote(id: number, input: QuoteInput) {
  const totals = calculateQuote({
    lines: itemsToCalcLines(input.items),
    globalDiscountType: input.discountType,
    globalDiscountValue: input.discountValue,
    vatRate: input.vatRate,
  });

  const tx = await db.transaction("write");
  try {
    await tx.execute({
      sql: `UPDATE quotes SET
        issue_date = ?, valid_until = ?, seller = ?,
        client_name = ?, client_rut = ?, client_contact = ?,
        client_phone = ?, client_email = ?, client_address = ?,
        client_comuna = ?, client_city = ?, client_activity = ?,
        discount_type = ?, discount_value = ?, vat_rate = ?,
        subtotal = ?, discount_amount = ?, net = ?,
        vat_amount = ?, total = ?,
        observations = ?, payment_terms = ?, delivery_terms = ?,
        dispatch_terms = ?, warranty_terms = ?, extra_terms = ?,
        status = ?, updated_at = ?
      WHERE id = ?`,
      args: [
        input.issueDate,
        input.validUntil,
        input.seller,
        input.client.name,
        input.client.rut,
        input.client.contact,
        input.client.phone,
        input.client.email,
        input.client.address,
        input.client.comuna,
        input.client.city,
        input.client.activity,
        input.discountType,
        input.discountValue,
        input.vatRate,
        totals.subtotal,
        totals.discountAmount,
        totals.net,
        totals.vatAmount,
        totals.total,
        input.observations,
        input.paymentTerms,
        input.deliveryTerms,
        input.dispatchTerms,
        input.warrantyTerms,
        input.extraTerms,
        input.status,
        nowIso(),
        id,
      ],
    });
    await tx.execute({ sql: `DELETE FROM quote_items WHERE quote_id = ?`, args: [id] });

    for (let i = 0; i < input.items.length; i++) {
      const item = input.items[i];
      await tx.execute({
        sql: `INSERT INTO quote_items (
          quote_id, catalog_item_id, kind, code, name, size_label, unit, quantity, unit_price,
          discount_type, discount_value, line_total, order_index
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          id,
          item.catalogItemId,
          item.kind,
          item.code,
          item.name,
          item.sizeLabel,
          item.unit,
          item.quantity,
          item.unitPrice,
          item.discountType,
          item.discountValue,
          computeLineTotal(item),
          i,
        ],
      });
    }
    await tx.commit();
  } catch (err) {
    await tx.rollback();
    throw err;
  }

  await logHistory("quotes", id, `Se editó la cotización.`);
}

export async function getQuote(id: number): Promise<Quote | null> {
  const row = await dbGet<QuoteRow>(`SELECT * FROM quotes WHERE id = ?`, [id]);
  if (!row) return null;
  const itemRows = await dbAll<QuoteItemRow>(
    `SELECT * FROM quote_items WHERE quote_id = ? ORDER BY order_index ASC`,
    [id]
  );
  return mapQuote(row, itemRows.map(mapQuoteItem));
}

export interface QuoteSummary {
  id: number;
  number: string;
  issueDate: string;
  clientName: string;
  total: number;
  status: QuoteStatus;
}

export async function listQuotes(): Promise<QuoteSummary[]> {
  const rows = await dbAll<{
    id: number;
    number: string;
    issue_date: string;
    client_name: string;
    total: number;
    status: string;
  }>(`SELECT id, number, issue_date, client_name, total, status FROM quotes WHERE deleted_at IS NULL ORDER BY id DESC`);
  return rows.map((r) => ({
    id: r.id,
    number: r.number,
    issueDate: r.issue_date,
    clientName: r.client_name,
    total: r.total,
    status: r.status as QuoteStatus,
  }));
}

export async function setQuoteStatus(id: number, status: QuoteStatus) {
  await dbRun(`UPDATE quotes SET status = ?, updated_at = ? WHERE id = ?`, [status, nowIso(), id]);
  await logHistory("quotes", id, `Se cambió el estado de la cotización a "${status}".`);
}

export async function softDeleteQuote(id: number) {
  await dbRun(`UPDATE quotes SET deleted_at = ? WHERE id = ?`, [nowIso(), id]);
  await logHistory("quotes", id, `Se eliminó la cotización.`);
}

export async function duplicateQuote(id: number): Promise<number | null> {
  const original = await getQuote(id);
  if (!original) return null;

  const settings = await getSettings();
  const today = new Date().toISOString().slice(0, 10);
  const validUntil = new Date(Date.now() + (settings.quoteValidDays || 15) * 86400000)
    .toISOString()
    .slice(0, 10);

  const newId = await createQuote({
    seller: original.seller,
    issueDate: today,
    validUntil,
    client: original.client,
    items: original.items.map((item) => ({
      catalogItemId: item.catalogItemId,
      kind: item.kind,
      code: item.code,
      name: item.name,
      sizeLabel: item.sizeLabel,
      unit: item.unit,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      discountType: item.discountType,
      discountValue: item.discountValue,
    })),
    discountType: original.discountType,
    discountValue: original.discountValue,
    vatRate: original.vatRate,
    observations: original.observations,
    paymentTerms: original.paymentTerms,
    deliveryTerms: original.deliveryTerms,
    dispatchTerms: original.dispatchTerms,
    warrantyTerms: original.warrantyTerms,
    extraTerms: original.extraTerms,
    status: "borrador",
  });

  await logHistory("quotes", newId, `Se duplicó desde la cotización ${original.number}.`);
  return newId;
}
