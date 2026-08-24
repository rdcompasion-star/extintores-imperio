import { createClient, type Client, type InArgs } from "@libsql/client";
import path from "node:path";
import fs from "node:fs";

// En local (sin variables de entorno) usa un archivo SQLite normal.
// En producción (Vercel), TURSO_DATABASE_URL/TURSO_AUTH_TOKEN apuntan a la
// base de datos real en Turso — mismo motor SQLite, mismo código.
function resolveUrl(): string {
  if (process.env.TURSO_DATABASE_URL) return process.env.TURSO_DATABASE_URL;

  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  const localDbPath = path.join(dataDir, "cms.sqlite").replace(/\\/g, "/");
  return `file:${localDbPath}`;
}

const url = resolveUrl();
const authToken = process.env.TURSO_AUTH_TOKEN;

declare global {
  // eslint-disable-next-line no-var
  var __cmsDb: Client | undefined;
}

export const db = global.__cmsDb ?? createClient({ url, authToken });
if (process.env.NODE_ENV !== "production") global.__cmsDb = db;

export type Row = Record<string, unknown>;

/** Una sola fila o undefined. */
export async function dbGet<T = Row>(sql: string, args: InArgs = []): Promise<T | undefined> {
  await ensureSchema();
  const res = await db.execute({ sql, args });
  const row = res.rows[0] as unknown as T | undefined;
  return row ?? undefined;
}

/** Todas las filas. */
export async function dbAll<T = Row>(sql: string, args: InArgs = []): Promise<T[]> {
  await ensureSchema();
  const res = await db.execute({ sql, args });
  return res.rows as unknown as T[];
}

/** INSERT/UPDATE/DELETE. Devuelve el id autoincremental (si aplica) y filas afectadas. */
export async function dbRun(sql: string, args: InArgs = []): Promise<{ lastInsertRowid: number; changes: number }> {
  await ensureSchema();
  const res = await db.execute({ sql, args });
  return { lastInsertRowid: Number(res.lastInsertRowid ?? 0), changes: res.rowsAffected };
}

const schemaStatements = [
  `CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
  )`,
  `CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    company_name TEXT NOT NULL DEFAULT 'Extintores Imperio',
    phone_display TEXT NOT NULL DEFAULT '',
    phone_e164 TEXT NOT NULL DEFAULT '',
    whatsapp_number TEXT NOT NULL DEFAULT '',
    email TEXT NOT NULL DEFAULT '',
    address_street TEXT NOT NULL DEFAULT '',
    address_comuna TEXT NOT NULL DEFAULT '',
    address_city TEXT NOT NULL DEFAULT '',
    address_country TEXT NOT NULL DEFAULT '',
    hours_weekday TEXT NOT NULL DEFAULT '',
    hours_saturday TEXT NOT NULL DEFAULT '',
    logo_media_id INTEGER,
    favicon_media_id INTEGER,
    instagram_url TEXT NOT NULL DEFAULT '',
    instagram_enabled INTEGER NOT NULL DEFAULT 0,
    facebook_url TEXT NOT NULL DEFAULT '',
    facebook_enabled INTEGER NOT NULL DEFAULT 0,
    tiktok_url TEXT NOT NULL DEFAULT '',
    tiktok_enabled INTEGER NOT NULL DEFAULT 0,
    linkedin_url TEXT NOT NULL DEFAULT '',
    linkedin_enabled INTEGER NOT NULL DEFAULT 0,
    youtube_url TEXT NOT NULL DEFAULT '',
    youtube_enabled INTEGER NOT NULL DEFAULT 0,
    whatsapp_social_enabled INTEGER NOT NULL DEFAULT 1,
    publish_immediately INTEGER NOT NULL DEFAULT 1,
    last_published_at TEXT,
    updated_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
  )`,
  `CREATE TABLE IF NOT EXISTS media (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT NOT NULL,
    original_name TEXT NOT NULL,
    folder TEXT NOT NULL DEFAULT 'general',
    alt_text TEXT NOT NULL DEFAULT '',
    mime TEXT NOT NULL,
    width INTEGER,
    height INTEGER,
    variants TEXT NOT NULL DEFAULT '{}',
    created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
  )`,
  `CREATE TABLE IF NOT EXISTS content_blocks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    page TEXT NOT NULL,
    section TEXT NOT NULL,
    field TEXT NOT NULL,
    value TEXT NOT NULL DEFAULT '',
    draft_value TEXT,
    has_draft INTEGER NOT NULL DEFAULT 0,
    updated_at TEXT NOT NULL DEFAULT (datetime('now','localtime')),
    UNIQUE(page, section, field)
  )`,
  `CREATE TABLE IF NOT EXISTS sections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    page TEXT NOT NULL,
    section_key TEXT NOT NULL,
    label TEXT NOT NULL,
    visible INTEGER NOT NULL DEFAULT 1,
    order_index INTEGER NOT NULL DEFAULT 0,
    UNIQUE(page, section_key)
  )`,
  `CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    category_label TEXT NOT NULL,
    presentation TEXT NOT NULL DEFAULT 'portatil',
    agent TEXT NOT NULL DEFAULT '',
    capacity_value REAL NOT NULL DEFAULT 0,
    capacity_unit TEXT NOT NULL DEFAULT 'KG',
    capacity_label TEXT NOT NULL DEFAULT '',
    concentration TEXT,
    extinguishing_rating TEXT,
    classification TEXT,
    discharged_weight TEXT,
    charged_weight TEXT,
    certification TEXT,
    cabinet TEXT,
    hose TEXT,
    nozzle TEXT,
    reel TEXT,
    cylinder TEXT,
    description TEXT NOT NULL DEFAULT '',
    fire_classes TEXT NOT NULL DEFAULT '[]',
    price TEXT,
    image_media_id INTEGER,
    gallery TEXT NOT NULL DEFAULT '[]',
    seo_title TEXT,
    seo_description TEXT,
    status TEXT NOT NULL DEFAULT 'published',
    order_index INTEGER NOT NULL DEFAULT 0,
    deleted_at TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now','localtime')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
  )`,
  `CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    summary TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    image_media_id INTEGER,
    cta_text TEXT NOT NULL DEFAULT 'Solicitar servicio',
    cta_type TEXT NOT NULL DEFAULT 'whatsapp',
    cta_value TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'published',
    order_index INTEGER NOT NULL DEFAULT 0,
    deleted_at TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now','localtime')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
  )`,
  `CREATE TABLE IF NOT EXISTS faq (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'published',
    order_index INTEGER NOT NULL DEFAULT 0,
    deleted_at TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now','localtime')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
  )`,
  `CREATE TABLE IF NOT EXISTS menu_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    label TEXT NOT NULL,
    href TEXT NOT NULL,
    visible INTEGER NOT NULL DEFAULT 1,
    order_index INTEGER NOT NULL DEFAULT 0
  )`,
  `CREATE TABLE IF NOT EXISTS history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at TEXT NOT NULL DEFAULT (datetime('now','localtime')),
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    summary TEXT NOT NULL,
    username TEXT NOT NULL DEFAULT 'admin'
  )`,
  `CREATE TABLE IF NOT EXISTS quote_catalog_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL,
    kind TEXT NOT NULL,
    category TEXT NOT NULL,
    name TEXT NOT NULL,
    unit TEXT NOT NULL DEFAULT 'unidad',
    size_label TEXT NOT NULL DEFAULT '',
    net_price INTEGER NOT NULL,
    active INTEGER NOT NULL DEFAULT 1,
    notes TEXT NOT NULL DEFAULT '',
    catalog_group TEXT NOT NULL DEFAULT 'general',
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now','localtime')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
  )`,
  `CREATE TABLE IF NOT EXISTS quote_counters (
    year INTEGER PRIMARY KEY,
    last_number INTEGER NOT NULL DEFAULT 0
  )`,
  `CREATE TABLE IF NOT EXISTS quotes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    number TEXT UNIQUE NOT NULL,
    issue_date TEXT NOT NULL,
    valid_until TEXT NOT NULL,
    seller TEXT NOT NULL DEFAULT '',
    client_name TEXT NOT NULL DEFAULT '',
    client_rut TEXT NOT NULL DEFAULT '',
    client_contact TEXT NOT NULL DEFAULT '',
    client_phone TEXT NOT NULL DEFAULT '',
    client_email TEXT NOT NULL DEFAULT '',
    client_address TEXT NOT NULL DEFAULT '',
    client_comuna TEXT NOT NULL DEFAULT '',
    client_city TEXT NOT NULL DEFAULT '',
    client_activity TEXT NOT NULL DEFAULT '',
    discount_type TEXT NOT NULL DEFAULT 'none',
    discount_value INTEGER NOT NULL DEFAULT 0,
    vat_rate REAL NOT NULL DEFAULT 0.19,
    subtotal INTEGER NOT NULL DEFAULT 0,
    discount_amount INTEGER NOT NULL DEFAULT 0,
    net INTEGER NOT NULL DEFAULT 0,
    vat_amount INTEGER NOT NULL DEFAULT 0,
    total INTEGER NOT NULL DEFAULT 0,
    observations TEXT NOT NULL DEFAULT '',
    payment_terms TEXT NOT NULL DEFAULT '',
    delivery_terms TEXT NOT NULL DEFAULT '',
    dispatch_terms TEXT NOT NULL DEFAULT '',
    warranty_terms TEXT NOT NULL DEFAULT '',
    extra_terms TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'borrador',
    deleted_at TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now','localtime')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
  )`,
  `CREATE TABLE IF NOT EXISTS quote_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    quote_id INTEGER NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
    catalog_item_id INTEGER REFERENCES quote_catalog_items(id) ON DELETE SET NULL,
    kind TEXT NOT NULL,
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    size_label TEXT NOT NULL DEFAULT '',
    unit TEXT NOT NULL DEFAULT 'unidad',
    quantity INTEGER NOT NULL,
    unit_price INTEGER NOT NULL,
    discount_type TEXT NOT NULL DEFAULT 'none',
    discount_value INTEGER NOT NULL DEFAULT 0,
    line_total INTEGER NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0
  )`,
];

const settingsMigrations: Record<string, string> = {
  rut: `ALTER TABLE settings ADD COLUMN rut TEXT NOT NULL DEFAULT ''`,
  legal_name: `ALTER TABLE settings ADD COLUMN legal_name TEXT NOT NULL DEFAULT ''`,
  bank_name: `ALTER TABLE settings ADD COLUMN bank_name TEXT NOT NULL DEFAULT ''`,
  bank_account_type: `ALTER TABLE settings ADD COLUMN bank_account_type TEXT NOT NULL DEFAULT ''`,
  bank_account_number: `ALTER TABLE settings ADD COLUMN bank_account_number TEXT NOT NULL DEFAULT ''`,
  bank_holder: `ALTER TABLE settings ADD COLUMN bank_holder TEXT NOT NULL DEFAULT ''`,
  bank_holder_rut: `ALTER TABLE settings ADD COLUMN bank_holder_rut TEXT NOT NULL DEFAULT ''`,
  bank_email: `ALTER TABLE settings ADD COLUMN bank_email TEXT NOT NULL DEFAULT ''`,
  vat_rate: `ALTER TABLE settings ADD COLUMN vat_rate REAL NOT NULL DEFAULT 0.19`,
  prices_include_vat: `ALTER TABLE settings ADD COLUMN prices_include_vat INTEGER NOT NULL DEFAULT 0`,
  quote_number_prefix: `ALTER TABLE settings ADD COLUMN quote_number_prefix TEXT NOT NULL DEFAULT 'COT'`,
  quote_valid_days: `ALTER TABLE settings ADD COLUMN quote_valid_days INTEGER NOT NULL DEFAULT 15`,
  default_payment_terms: `ALTER TABLE settings ADD COLUMN default_payment_terms TEXT NOT NULL DEFAULT ''`,
  default_delivery_terms: `ALTER TABLE settings ADD COLUMN default_delivery_terms TEXT NOT NULL DEFAULT ''`,
  default_dispatch_terms: `ALTER TABLE settings ADD COLUMN default_dispatch_terms TEXT NOT NULL DEFAULT ''`,
  default_warranty_terms: `ALTER TABLE settings ADD COLUMN default_warranty_terms TEXT NOT NULL DEFAULT ''`,
};

let readyPromise: Promise<void> | null = null;

/** Crea las tablas (si faltan) y aplica migraciones aditivas. Idempotente. */
export function ensureSchema(): Promise<void> {
  if (!readyPromise) {
    readyPromise = (async () => {
      // El build de Next corre varios workers en paralelo contra el mismo
      // archivo SQLite local; sin esto, escrituras concurrentes fallan de
      // inmediato con SQLITE_BUSY en vez de esperar su turno.
      try {
        await db.execute(`PRAGMA busy_timeout = 5000`);
      } catch {
        // Turso remoto no soporta este pragma; no es necesario ahí.
      }

      for (const stmt of schemaStatements) {
        await db.execute(stmt);
      }

      const existingRes = await db.execute(`PRAGMA table_info(settings)`);
      const settingsColumns = new Set(existingRes.rows.map((c) => c.name as string));
      for (const [column, sql] of Object.entries(settingsMigrations)) {
        if (!settingsColumns.has(column)) await db.execute(sql);
      }

      const catalogRes = await db.execute(`PRAGMA table_info(quote_catalog_items)`);
      const catalogColumns = new Set(catalogRes.rows.map((c) => c.name as string));
      if (!catalogColumns.has("catalog_group")) {
        await db.execute(`ALTER TABLE quote_catalog_items ADD COLUMN catalog_group TEXT NOT NULL DEFAULT 'general'`);
      }

      const backfillRes = await db.execute(`SELECT id, rut FROM settings WHERE id = 1`);
      const backfillRow = backfillRes.rows[0] as unknown as { id: number; rut: string } | undefined;
      if (backfillRow && !backfillRow.rut) {
        await db.execute({
          sql: `UPDATE settings SET rut = ?, legal_name = ?, vat_rate = 0.19, quote_number_prefix = 'COT', quote_valid_days = 15 WHERE id = 1`,
          args: ["77.403.695-4", "Extintores Imperio EIRL"],
        });
      }
    })();
  }
  return readyPromise;
}

export async function logHistory(
  entityType: string,
  entityId: string | number | null,
  summary: string,
  username = "admin"
) {
  await dbRun(
    `INSERT INTO history (entity_type, entity_id, summary, username) VALUES (?, ?, ?, ?)`,
    [entityType, entityId === null ? null : String(entityId), summary, username]
  );
}

export function nowIso() {
  return new Date().toISOString();
}
