"use client";

import { useState, useTransition, useRef } from "react";
import type { Settings } from "@/lib/settings";
import { updateSettingsAction } from "@/lib/actions/settings-actions";
import { uploadMediaAction } from "@/lib/actions/media-actions";
import {
  InstagramIcon,
  FacebookIcon,
  TikTokIcon,
  LinkedInIcon,
  YouTubeIcon,
  WhatsAppIcon,
} from "@/components/ui/icons";

const inputClasses =
  "h-11 w-full rounded-md border border-border-strong bg-surface px-3 text-[15px] text-ink-900 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-red-700";
const labelClasses = "mb-1.5 block text-sm font-medium text-ink-700";

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className={labelClasses}>{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className={inputClasses} />
    </div>
  );
}

const socialNetworks = [
  { key: "instagram" as const, label: "Instagram", Icon: InstagramIcon },
  { key: "facebook" as const, label: "Facebook", Icon: FacebookIcon },
  { key: "tiktok" as const, label: "TikTok", Icon: TikTokIcon },
  { key: "linkedin" as const, label: "LinkedIn", Icon: LinkedInIcon },
  { key: "youtube" as const, label: "YouTube", Icon: YouTubeIcon },
];

export function SettingsForm({ settings }: { settings: Settings }) {
  const [form, setForm] = useState({
    companyName: settings.companyName,
    phoneDisplay: settings.phoneDisplay,
    phoneE164: settings.phoneE164,
    whatsappNumber: settings.whatsappNumber,
    email: settings.email,
    addressStreet: settings.address.street,
    addressComuna: settings.address.comuna,
    addressCity: settings.address.city,
    addressCountry: settings.address.country,
    hoursWeekday: settings.hours[0]?.time ?? "",
    hoursSaturday: settings.hours[1]?.time ?? "",
    whatsappSocialEnabled: settings.social.whatsapp.enabled,
    instagramUrl: settings.social.instagram.url,
    instagramEnabled: settings.social.instagram.enabled,
    facebookUrl: settings.social.facebook.url,
    facebookEnabled: settings.social.facebook.enabled,
    tiktokUrl: settings.social.tiktok.url,
    tiktokEnabled: settings.social.tiktok.enabled,
    linkedinUrl: settings.social.linkedin.url,
    linkedinEnabled: settings.social.linkedin.enabled,
    youtubeUrl: settings.social.youtube.url,
    youtubeEnabled: settings.social.youtube.enabled,
    rut: settings.rut,
    legalName: settings.legalName,
    vatRatePercent: String(Math.round(settings.vatRate * 10000) / 100),
    quoteNumberPrefix: settings.quoteNumberPrefix,
    quoteValidDays: String(settings.quoteValidDays),
    bankName: settings.bank.name,
    bankAccountType: settings.bank.accountType,
    bankAccountNumber: settings.bank.accountNumber,
    bankHolder: settings.bank.holder,
    bankHolderRut: settings.bank.holderRut,
    bankEmail: settings.bank.email,
    defaultPaymentTerms: settings.defaultCommercialTerms.payment,
    defaultDeliveryTerms: settings.defaultCommercialTerms.delivery,
    defaultDispatchTerms: settings.defaultCommercialTerms.dispatch,
    defaultWarrantyTerms: settings.defaultCommercialTerms.warranty,
  });
  const [logoSrc, setLogoSrc] = useState<string | undefined>(settings.logo?.src);
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  function handleSave() {
    startTransition(async () => {
      const { vatRatePercent, quoteValidDays, ...rest } = form;
      await updateSettingsAction({
        ...rest,
        vatRate: Math.max(0, Number(vatRatePercent) || 0) / 100,
        quoteValidDays: Math.max(1, Math.floor(Number(quoteValidDays) || 15)),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  async function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    const fd = new FormData();
    fd.set("file", file);
    fd.set("folder", "general");
    const res = await uploadMediaAction(fd);
    setUploadingLogo(false);
    if (res.ok) {
      setLogoSrc(res.media.src);
      await updateSettingsAction({ logoMediaId: res.media.id });
    }
  }

  return (
    <div className="flex flex-col gap-8 px-5 py-6 sm:px-8">
      <section className="rounded-xl border border-border bg-bg p-5 sm:p-6">
        <h2 className="mb-4 text-base font-semibold text-ink-950">Logo</h2>
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-dashed border-border-strong bg-surface-2">
            {logoSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoSrc} alt="Logo" className="h-full w-full object-contain p-1" />
            ) : (
              <span className="text-xs text-ink-400">Sin logo</span>
            )}
          </div>
          <div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingLogo}
              className="rounded-md border border-border-strong bg-surface px-4 py-2 text-sm font-medium text-ink-700 hover:bg-surface-2 disabled:opacity-60"
            >
              {uploadingLogo ? "Subiendo..." : "Cambiar logo"}
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
            <p className="mt-1.5 text-xs text-ink-400">Si no subes uno, se usa el nombre de la empresa como logo.</p>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-bg p-5 sm:p-6">
        <h2 className="mb-4 text-base font-semibold text-ink-950">Empresa y contacto</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Nombre de la empresa" value={form.companyName} onChange={(v) => update("companyName", v)} />
          <Field label="Email" value={form.email} onChange={(v) => update("email", v)} type="email" />
          <Field
            label="Teléfono (formato a mostrar)"
            value={form.phoneDisplay}
            onChange={(v) => update("phoneDisplay", v)}
          />
          <Field
            label="Teléfono (formato +56...)"
            value={form.phoneE164}
            onChange={(v) => update("phoneE164", v)}
          />
          <Field
            label="Número de WhatsApp (solo dígitos, con código país)"
            value={form.whatsappNumber}
            onChange={(v) => update("whatsappNumber", v)}
          />
          <Field label="Calle y número" value={form.addressStreet} onChange={(v) => update("addressStreet", v)} />
          <Field label="Comuna" value={form.addressComuna} onChange={(v) => update("addressComuna", v)} />
          <Field label="Ciudad" value={form.addressCity} onChange={(v) => update("addressCity", v)} />
          <Field label="País" value={form.addressCountry} onChange={(v) => update("addressCountry", v)} />
          <Field
            label="Horario lunes a viernes"
            value={form.hoursWeekday}
            onChange={(v) => update("hoursWeekday", v)}
          />
          <Field label="Horario sábado" value={form.hoursSaturday} onChange={(v) => update("hoursSaturday", v)} />
        </div>
        <p className="mt-3 text-xs text-ink-400">
          Este teléfono, WhatsApp, email, dirección y horario se usan en todo el sitio (header, footer, contacto,
          botones de cotizar). Cambian en un solo lugar.
        </p>
      </section>

      <section className="rounded-xl border border-border bg-bg p-5 sm:p-6">
        <h2 className="mb-4 text-base font-semibold text-ink-950">Redes sociales</h2>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 rounded-lg border border-border bg-surface p-3">
            <WhatsAppIcon className="h-5 w-5 shrink-0 text-[#25D366]" />
            <span className="w-24 shrink-0 text-sm font-medium text-ink-700">WhatsApp</span>
            <span className="flex-1 text-sm text-ink-500">Usa el número de WhatsApp de arriba</span>
            <label className="flex items-center gap-2 text-xs text-ink-500">
              <input
                type="checkbox"
                checked={form.whatsappSocialEnabled}
                onChange={(e) => update("whatsappSocialEnabled", e.target.checked)}
                className="h-4 w-4 accent-red-700"
              />
              Activo
            </label>
          </div>
          {socialNetworks.map(({ key, label, Icon }) => {
            const urlKey = `${key}Url` as keyof typeof form;
            const enabledKey = `${key}Enabled` as keyof typeof form;
            return (
              <div key={key} className="flex flex-col gap-2 rounded-lg border border-border bg-surface p-3 sm:flex-row sm:items-center">
                <div className="flex w-32 shrink-0 items-center gap-2">
                  <Icon className="h-5 w-5 text-ink-500" />
                  <span className="text-sm font-medium text-ink-700">{label}</span>
                </div>
                <input
                  type="url"
                  placeholder={`https://${key}.com/...`}
                  value={form[urlKey] as string}
                  onChange={(e) => update(urlKey, e.target.value as never)}
                  className={`${inputClasses} flex-1`}
                />
                <label className="flex shrink-0 items-center gap-2 text-xs text-ink-500">
                  <input
                    type="checkbox"
                    checked={form[enabledKey] as boolean}
                    onChange={(e) => update(enabledKey, e.target.checked as never)}
                    className="h-4 w-4 accent-red-700"
                  />
                  Activo
                </label>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-xl border border-border bg-bg p-5 sm:p-6">
        <h2 className="mb-4 text-base font-semibold text-ink-950">Cotizador — datos legales y facturación</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Razón social" value={form.legalName} onChange={(v) => update("legalName", v)} />
          <Field label="RUT de la empresa" value={form.rut} onChange={(v) => update("rut", v)} />
          <Field label="IVA (%)" value={form.vatRatePercent} onChange={(v) => update("vatRatePercent", v)} />
          <Field
            label="Prefijo de numeración"
            value={form.quoteNumberPrefix}
            onChange={(v) => update("quoteNumberPrefix", v)}
          />
          <Field
            label="Validez de la cotización (días)"
            value={form.quoteValidDays}
            onChange={(v) => update("quoteValidDays", v)}
          />
        </div>
        <p className="mt-3 text-xs text-ink-400">
          El IVA y el prefijo de numeración se usan para todas las cotizaciones nuevas. Cambiar el IVA no afecta
          cotizaciones ya generadas.
        </p>
      </section>

      <section className="rounded-xl border border-border bg-bg p-5 sm:p-6">
        <h2 className="mb-4 text-base font-semibold text-ink-950">Datos bancarios (para el PDF)</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Banco" value={form.bankName} onChange={(v) => update("bankName", v)} />
          <Field label="Tipo de cuenta" value={form.bankAccountType} onChange={(v) => update("bankAccountType", v)} />
          <Field
            label="Número de cuenta"
            value={form.bankAccountNumber}
            onChange={(v) => update("bankAccountNumber", v)}
          />
          <Field label="Titular" value={form.bankHolder} onChange={(v) => update("bankHolder", v)} />
          <Field label="RUT del titular" value={form.bankHolderRut} onChange={(v) => update("bankHolderRut", v)} />
          <Field label="Email para pagos" value={form.bankEmail} onChange={(v) => update("bankEmail", v)} />
        </div>
        <p className="mt-3 text-xs text-ink-400">Si dejas estos campos vacíos, el PDF no muestra la sección de datos bancarios.</p>
      </section>

      <section className="rounded-xl border border-border bg-bg p-5 sm:p-6">
        <h2 className="mb-4 text-base font-semibold text-ink-950">Condiciones comerciales por defecto</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field
            label="Forma de pago"
            value={form.defaultPaymentTerms}
            onChange={(v) => update("defaultPaymentTerms", v)}
          />
          <Field
            label="Plazo de entrega"
            value={form.defaultDeliveryTerms}
            onChange={(v) => update("defaultDeliveryTerms", v)}
          />
          <Field
            label="Condiciones de despacho"
            value={form.defaultDispatchTerms}
            onChange={(v) => update("defaultDispatchTerms", v)}
          />
          <Field label="Garantía" value={form.defaultWarrantyTerms} onChange={(v) => update("defaultWarrantyTerms", v)} />
        </div>
        <p className="mt-3 text-xs text-ink-400">Aparecen precargadas en cada cotización nueva; se pueden editar caso a caso.</p>
      </section>

      <div className="sticky bottom-20 flex items-center gap-3 sm:bottom-0 sm:justify-end sm:border-t sm:border-border sm:bg-bg sm:py-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={pending}
          className="w-full rounded-md bg-red-700 px-6 py-3 text-[15px] font-semibold text-white shadow-lg hover:bg-red-800 disabled:opacity-60 sm:w-auto sm:shadow-none"
        >
          {saved ? "Cambios guardados ✓" : pending ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>
    </div>
  );
}
