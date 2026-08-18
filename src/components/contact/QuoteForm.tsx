"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { buildWhatsAppLink } from "@/lib/site-config";

const inputClasses =
  "h-12 w-full rounded-md border border-border-strong bg-bg px-3.5 text-[15px] text-ink-900 placeholder:text-ink-400 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-red-700";

const labelClasses = "mb-1.5 block text-sm font-medium text-ink-700";

export function QuoteForm({
  whatsappNumber,
  productNames,
}: {
  whatsappNumber: string;
  productNames: string[];
}) {
  const [values, setValues] = useState({
    nombre: "",
    empresa: "",
    telefono: "",
    email: "",
    producto: "",
    cantidad: "",
    comuna: "",
    mensaje: "",
  });

  function update<K extends keyof typeof values>(key: K, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const lines = [
      "Hola, quiero solicitar una cotización:",
      `Nombre: ${values.nombre}`,
      values.empresa && `Empresa: ${values.empresa}`,
      `Teléfono: ${values.telefono}`,
      values.email && `Email: ${values.email}`,
      `Producto: ${values.producto || "A definir"}`,
      values.cantidad && `Cantidad: ${values.cantidad}`,
      values.comuna && `Comuna: ${values.comuna}`,
      values.mensaje && `Mensaje: ${values.mensaje}`,
    ].filter(Boolean);

    window.open(buildWhatsAppLink(whatsappNumber, lines.join("\n")), "_blank", "noopener,noreferrer");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="nombre" className={labelClasses}>
            Nombre *
          </label>
          <input
            id="nombre"
            required
            value={values.nombre}
            onChange={(e) => update("nombre", e.target.value)}
            className={inputClasses}
            autoComplete="name"
          />
        </div>
        <div>
          <label htmlFor="empresa" className={labelClasses}>
            Empresa
          </label>
          <input
            id="empresa"
            value={values.empresa}
            onChange={(e) => update("empresa", e.target.value)}
            className={inputClasses}
            autoComplete="organization"
          />
        </div>
        <div>
          <label htmlFor="telefono" className={labelClasses}>
            Teléfono *
          </label>
          <input
            id="telefono"
            type="tel"
            required
            value={values.telefono}
            onChange={(e) => update("telefono", e.target.value)}
            className={inputClasses}
            autoComplete="tel"
          />
        </div>
        <div>
          <label htmlFor="email" className={labelClasses}>
            Email
          </label>
          <input
            id="email"
            type="email"
            value={values.email}
            onChange={(e) => update("email", e.target.value)}
            className={inputClasses}
            autoComplete="email"
          />
        </div>
        <div>
          <label htmlFor="producto" className={labelClasses}>
            Producto que necesita
          </label>
          <select
            id="producto"
            value={values.producto}
            onChange={(e) => update("producto", e.target.value)}
            className={inputClasses}
          >
            <option value="">No estoy seguro / consultar</option>
            {productNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="cantidad" className={labelClasses}>
            Cantidad
          </label>
          <input
            id="cantidad"
            inputMode="numeric"
            value={values.cantidad}
            onChange={(e) => update("cantidad", e.target.value)}
            className={inputClasses}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="comuna" className={labelClasses}>
            Comuna
          </label>
          <input
            id="comuna"
            value={values.comuna}
            onChange={(e) => update("comuna", e.target.value)}
            className={inputClasses}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="mensaje" className={labelClasses}>
            Mensaje
          </label>
          <textarea
            id="mensaje"
            rows={3}
            value={values.mensaje}
            onChange={(e) => update("mensaje", e.target.value)}
            className="w-full resize-none rounded-md border border-border-strong bg-bg px-3.5 py-3 text-[15px] text-ink-900 placeholder:text-ink-400 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-red-700"
          />
        </div>
      </div>

      <Button type="submit" size="lg" icon={<WhatsAppIcon className="h-5 w-5" />} className="mt-1 w-full sm:w-auto">
        Solicitar cotización
      </Button>
      <p className="text-xs text-ink-400">
        Al enviar se abrirá WhatsApp con tu cotización lista para enviar a Extintores Imperio.
      </p>
    </form>
  );
}
