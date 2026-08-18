import { ReactNode } from "react";

export function SectionHeading({
  title,
  lead,
  align = "left",
  size = "md",
  bebas = false,
}: {
  title: ReactNode;
  lead?: ReactNode;
  align?: "left" | "center";
  size?: "md" | "lg";
  bebas?: boolean;
}) {
  return (
    <div className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      <h2
        className={`font-semibold text-ink-950 ${
          size === "lg" ? "text-[28px] leading-[1.15] sm:text-4xl" : "text-2xl sm:text-3xl"
        }`}
        style={bebas ? { fontFamily: "var(--font-bebas-neue)" } : undefined}
      >
        {title}
      </h2>
      {lead && <p className="mt-3 text-[15px] leading-relaxed text-ink-500 sm:text-base">{lead}</p>}
    </div>
  );
}
