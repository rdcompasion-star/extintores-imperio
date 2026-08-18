import { AgentCategory } from "@/lib/queries";

const accent: Record<AgentCategory, string> = {
  co2: "var(--color-ink-700)",
  "pqs-abc": "var(--color-red-600)",
  "red-humeda": "#3b6ea5",
  "clase-k": "var(--color-safety-amber)",
};

/**
 * Ilustración vectorial genérica de un extintor, usada como marcador visual
 * consistente mientras no se dispone de fotografía real del producto.
 */
export function ProductGlyph({
  category,
  presentation,
  className = "",
}: {
  category: AgentCategory;
  presentation?: string;
  className?: string;
}) {
  const isReel = category === "red-humeda";
  const color = accent[category];

  if (isReel) {
    return (
      <svg viewBox="0 0 160 160" className={className} aria-hidden="true">
        <rect x={24} y={24} width={112} height={112} rx={6} fill="var(--color-surface-2)" stroke="var(--color-border-strong)" strokeWidth={2} />
        <circle cx={80} cy={80} r={34} fill="none" stroke={color} strokeWidth={6} />
        <circle cx={80} cy={80} r={8} fill={color} />
        <path d="M104 104 Q124 118 132 138" fill="none" stroke="var(--color-ink-700)" strokeWidth={4} strokeLinecap="round" />
      </svg>
    );
  }

  const isWheeled = presentation === "rodante";

  return (
    <svg viewBox="0 0 160 160" className={className} aria-hidden="true">
      {/* Cilindro */}
      <rect x={58} y={40} width={44} height={90} rx={12} fill="var(--color-surface-2)" stroke="var(--color-border-strong)" strokeWidth={2} />
      {/* Banda de agente */}
      <rect x={58} y={78} width={44} height={20} fill={color} opacity={0.9} />
      {/* Válvula */}
      <rect x={72} y={22} width={16} height={20} rx={3} fill="var(--color-ink-700)" />
      {/* Manguera */}
      <path d="M88 34 Q118 40 112 66" fill="none" stroke="var(--color-ink-500)" strokeWidth={4} strokeLinecap="round" />
      {/* Manija */}
      <path d="M64 30 h28" stroke="var(--color-ink-700)" strokeWidth={4} strokeLinecap="round" />
      {isWheeled && (
        <>
          <circle cx={68} cy={140} r={9} fill="var(--color-ink-700)" />
          <circle cx={92} cy={140} r={9} fill="var(--color-ink-700)" />
        </>
      )}
    </svg>
  );
}
