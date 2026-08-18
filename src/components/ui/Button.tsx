import Link from "next/link";
import { ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "dark" | "outlineLight";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-colors duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-red-700 text-white hover:bg-red-800 active:bg-red-800 focus-visible:outline-red-700",
  secondary:
    "bg-transparent text-ink-900 border border-border-strong hover:bg-surface-2 focus-visible:outline-ink-900",
  ghost: "bg-transparent text-ink-700 hover:bg-surface-2 focus-visible:outline-ink-900",
  dark: "bg-ink-950 text-white hover:bg-ink-900 focus-visible:outline-ink-950",
  outlineLight:
    "bg-transparent text-white border border-white/25 hover:bg-white/10 focus-visible:outline-white",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-[15px]",
  lg: "h-[52px] px-6 text-base",
};

interface CommonProps {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  icon?: ReactNode;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  icon,
  ...rest
}: CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}

export function ButtonLink({
  children,
  variant = "primary",
  size = "md",
  className = "",
  icon,
  href,
  external,
  ...rest
}: CommonProps & { href: string; external?: boolean } & Omit<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    "href"
  >) {
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        {...rest}
      >
        {icon}
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} {...rest}>
      {icon}
      {children}
    </Link>
  );
}
