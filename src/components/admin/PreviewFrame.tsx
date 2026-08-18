"use client";

import { useState } from "react";

const sizes = {
  mobile: { width: 375, height: 720, label: "📱 Mobile" },
  tablet: { width: 768, height: 800, label: "📱 Tablet" },
  desktop: { width: 1280, height: 800, label: "💻 Desktop" },
} as const;

type SizeKey = keyof typeof sizes;

export function PreviewFrame({ paths }: { paths: { href: string; label: string }[] }) {
  const [size, setSize] = useState<SizeKey>("mobile");
  const [path, setPath] = useState(paths[0]?.href ?? "/");

  const current = sizes[size];

  return (
    <div className="flex flex-col gap-4 px-5 py-6 sm:px-8">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1 rounded-lg bg-surface-2 p-1">
          {(Object.keys(sizes) as SizeKey[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setSize(key)}
              className={`rounded-md px-3.5 py-2 text-sm font-medium ${
                size === key ? "bg-bg text-ink-900 shadow-sm" : "text-ink-500"
              }`}
            >
              {sizes[key].label}
            </button>
          ))}
        </div>

        <select
          value={path}
          onChange={(e) => setPath(e.target.value)}
          className="h-10 rounded-md border border-border-strong bg-bg px-3 text-sm text-ink-900"
        >
          {paths.map((p) => (
            <option key={p.href} value={p.href}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-center overflow-x-auto rounded-xl border border-border bg-surface-2 p-6">
        <div
          className="overflow-hidden rounded-lg border border-border-strong bg-bg shadow-lg"
          style={{ width: current.width, height: current.height }}
        >
          <iframe key={`${size}-${path}`} src={path} title="Vista previa del sitio" className="h-full w-full" />
        </div>
      </div>
      <p className="text-center text-xs text-ink-400">
        Esta vista previa muestra el sitio publicado en vivo, tal como lo ven tus clientes.
      </p>
    </div>
  );
}
