import Link from "next/link";
import { ShieldIcon } from "@/components/ui/icons";

export function Logo({
  dark = false,
  companyName = "Extintores Imperio",
  logoSrc,
  onClick,
}: {
  dark?: boolean;
  companyName?: string;
  logoSrc?: string;
  onClick?: () => void;
}) {
  const words = companyName.trim().split(/\s+/);
  const twoLine = words.length === 2;

  return (
    <Link
      href="/"
      onClick={onClick}
      className="flex items-center gap-2.5 shrink-0"
      aria-label={`${companyName}, ir al inicio`}
    >
      {logoSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logoSrc} alt={companyName} className="h-12 w-auto max-w-[210px] object-contain sm:h-14" />
      ) : (
        <>
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-red-700 text-white">
            <ShieldIcon className="h-5 w-5" />
          </span>
          <span
            className={`font-display text-[17px] font-semibold leading-none tracking-tight ${
              dark ? "text-white" : "text-ink-950"
            }`}
          >
            {twoLine ? (
              <>
                {words[0]}
                <br />
                <span className="text-red-700">{words[1]}</span>
              </>
            ) : (
              companyName
            )}
          </span>
        </>
      )}
    </Link>
  );
}
