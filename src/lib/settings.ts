import { dbGet, dbRun, logHistory, nowIso } from "@/lib/db";
import { mapMedia, type MediaRow } from "@/lib/media";

interface SettingsRow {
  id: number;
  company_name: string;
  phone_display: string;
  phone_e164: string;
  whatsapp_number: string;
  email: string;
  address_street: string;
  address_comuna: string;
  address_city: string;
  address_country: string;
  hours_weekday: string;
  hours_saturday: string;
  logo_media_id: number | null;
  favicon_media_id: number | null;
  instagram_url: string;
  instagram_enabled: number;
  facebook_url: string;
  facebook_enabled: number;
  tiktok_url: string;
  tiktok_enabled: number;
  linkedin_url: string;
  linkedin_enabled: number;
  youtube_url: string;
  youtube_enabled: number;
  whatsapp_social_enabled: number;
  publish_immediately: number;
  last_published_at: string | null;
  updated_at: string;
  rut: string;
  legal_name: string;
  bank_name: string;
  bank_account_type: string;
  bank_account_number: string;
  bank_holder: string;
  bank_holder_rut: string;
  bank_email: string;
  vat_rate: number;
  prices_include_vat: number;
  quote_number_prefix: string;
  quote_valid_days: number;
  default_payment_terms: string;
  default_delivery_terms: string;
  default_dispatch_terms: string;
  default_warranty_terms: string;
}

export interface SocialLink {
  url: string;
  enabled: boolean;
}

export interface Settings {
  companyName: string;
  phoneDisplay: string;
  phoneE164: string;
  whatsappNumber: string;
  email: string;
  address: {
    street: string;
    comuna: string;
    city: string;
    country: string;
    full: string;
  };
  hours: { days: string; time: string }[];
  logo: ReturnType<typeof mapMedia> | null;
  social: {
    instagram: SocialLink;
    facebook: SocialLink;
    tiktok: SocialLink;
    linkedin: SocialLink;
    youtube: SocialLink;
    whatsapp: { enabled: boolean };
  };
  publishImmediately: boolean;
  lastPublishedAt: string | null;
  updatedAt: string;
  rut: string;
  legalName: string;
  bank: {
    name: string;
    accountType: string;
    accountNumber: string;
    holder: string;
    holderRut: string;
    email: string;
  };
  vatRate: number;
  pricesIncludeVat: boolean;
  quoteNumberPrefix: string;
  quoteValidDays: number;
  defaultCommercialTerms: {
    payment: string;
    delivery: string;
    dispatch: string;
    warranty: string;
  };
}

async function mapSettings(row: SettingsRow): Promise<Settings> {
  let logo: ReturnType<typeof mapMedia> | null = null;
  if (row.logo_media_id) {
    const mediaRow = await dbGet<MediaRow>(`SELECT * FROM media WHERE id = ?`, [row.logo_media_id]);
    if (mediaRow) logo = mapMedia(mediaRow);
  }

  return {
    companyName: row.company_name,
    phoneDisplay: row.phone_display,
    phoneE164: row.phone_e164,
    whatsappNumber: row.whatsapp_number,
    email: row.email,
    address: {
      street: row.address_street,
      comuna: row.address_comuna,
      city: row.address_city,
      country: row.address_country,
      full: `${row.address_street}, ${row.address_comuna}, ${row.address_city}, ${row.address_country}`,
    },
    hours: [
      { days: "Lunes a viernes", time: row.hours_weekday },
      { days: "Sábado", time: row.hours_saturday },
    ],
    logo,
    social: {
      instagram: { url: row.instagram_url, enabled: !!row.instagram_enabled },
      facebook: { url: row.facebook_url, enabled: !!row.facebook_enabled },
      tiktok: { url: row.tiktok_url, enabled: !!row.tiktok_enabled },
      linkedin: { url: row.linkedin_url, enabled: !!row.linkedin_enabled },
      youtube: { url: row.youtube_url, enabled: !!row.youtube_enabled },
      whatsapp: { enabled: !!row.whatsapp_social_enabled },
    },
    publishImmediately: !!row.publish_immediately,
    lastPublishedAt: row.last_published_at,
    updatedAt: row.updated_at,
    rut: row.rut,
    legalName: row.legal_name,
    bank: {
      name: row.bank_name,
      accountType: row.bank_account_type,
      accountNumber: row.bank_account_number,
      holder: row.bank_holder,
      holderRut: row.bank_holder_rut,
      email: row.bank_email,
    },
    vatRate: row.vat_rate,
    pricesIncludeVat: !!row.prices_include_vat,
    quoteNumberPrefix: row.quote_number_prefix,
    quoteValidDays: row.quote_valid_days,
    defaultCommercialTerms: {
      payment: row.default_payment_terms,
      delivery: row.default_delivery_terms,
      dispatch: row.default_dispatch_terms,
      warranty: row.default_warranty_terms,
    },
  };
}

export async function getSettings(): Promise<Settings> {
  const row = await dbGet<SettingsRow>(`SELECT * FROM settings WHERE id = 1`);
  return mapSettings(row as SettingsRow);
}

export type SettingsPatch = Partial<{
  companyName: string;
  phoneDisplay: string;
  phoneE164: string;
  whatsappNumber: string;
  email: string;
  addressStreet: string;
  addressComuna: string;
  addressCity: string;
  addressCountry: string;
  hoursWeekday: string;
  hoursSaturday: string;
  logoMediaId: number | null;
  faviconMediaId: number | null;
  instagramUrl: string;
  instagramEnabled: boolean;
  facebookUrl: string;
  facebookEnabled: boolean;
  tiktokUrl: string;
  tiktokEnabled: boolean;
  linkedinUrl: string;
  linkedinEnabled: boolean;
  youtubeUrl: string;
  youtubeEnabled: boolean;
  whatsappSocialEnabled: boolean;
  publishImmediately: boolean;
  rut: string;
  legalName: string;
  bankName: string;
  bankAccountType: string;
  bankAccountNumber: string;
  bankHolder: string;
  bankHolderRut: string;
  bankEmail: string;
  vatRate: number;
  pricesIncludeVat: boolean;
  quoteNumberPrefix: string;
  quoteValidDays: number;
  defaultPaymentTerms: string;
  defaultDeliveryTerms: string;
  defaultDispatchTerms: string;
  defaultWarrantyTerms: string;
}>;

const columnMap: Record<string, string> = {
  companyName: "company_name",
  phoneDisplay: "phone_display",
  phoneE164: "phone_e164",
  whatsappNumber: "whatsapp_number",
  email: "email",
  addressStreet: "address_street",
  addressComuna: "address_comuna",
  addressCity: "address_city",
  addressCountry: "address_country",
  hoursWeekday: "hours_weekday",
  hoursSaturday: "hours_saturday",
  logoMediaId: "logo_media_id",
  faviconMediaId: "favicon_media_id",
  instagramUrl: "instagram_url",
  instagramEnabled: "instagram_enabled",
  facebookUrl: "facebook_url",
  facebookEnabled: "facebook_enabled",
  tiktokUrl: "tiktok_url",
  tiktokEnabled: "tiktok_enabled",
  linkedinUrl: "linkedin_url",
  linkedinEnabled: "linkedin_enabled",
  youtubeUrl: "youtube_url",
  youtubeEnabled: "youtube_enabled",
  whatsappSocialEnabled: "whatsapp_social_enabled",
  publishImmediately: "publish_immediately",
  rut: "rut",
  legalName: "legal_name",
  bankName: "bank_name",
  bankAccountType: "bank_account_type",
  bankAccountNumber: "bank_account_number",
  bankHolder: "bank_holder",
  bankHolderRut: "bank_holder_rut",
  bankEmail: "bank_email",
  vatRate: "vat_rate",
  pricesIncludeVat: "prices_include_vat",
  quoteNumberPrefix: "quote_number_prefix",
  quoteValidDays: "quote_valid_days",
  defaultPaymentTerms: "default_payment_terms",
  defaultDeliveryTerms: "default_delivery_terms",
  defaultDispatchTerms: "default_dispatch_terms",
  defaultWarrantyTerms: "default_warranty_terms",
};

export async function updateSettings(patch: SettingsPatch) {
  const keys = Object.keys(patch) as (keyof SettingsPatch)[];
  if (keys.length === 0) return;

  const sets: string[] = [];
  const values: unknown[] = [];
  for (const key of keys) {
    const col = columnMap[key];
    if (!col) continue;
    let value = patch[key];
    if (typeof value === "boolean") value = value ? 1 : (0 as never);
    sets.push(`${col} = ?`);
    values.push(value ?? null);
  }
  sets.push("updated_at = ?");
  values.push(nowIso());

  await dbRun(`UPDATE settings SET ${sets.join(", ")} WHERE id = 1`, values as (string | number | null)[]);
  await logHistory("settings", 1, "Se actualizó la Configuración general (información de contacto/empresa).");
}

export async function markPublished() {
  await dbRun(`UPDATE settings SET last_published_at = ? WHERE id = 1`, [nowIso()]);
}
