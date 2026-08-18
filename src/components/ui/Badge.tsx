import { ReactNode } from "react";

type Tone = "red" | "ink" | "outline";

const tones: Record<Tone, string> = {
  red: "bg-red-50 text-red-700",
  ink: "bg-surface-2 text-ink-700",
  outline: "border border-border-strong text-ink-700",
};

export function Badge({
  children,
  tone = "ink",
  className = "",
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
