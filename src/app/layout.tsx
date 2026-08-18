import type { Metadata } from "next";
import { Inter, Space_Grotesk, IBM_Plex_Mono, Bebas_Neue } from "next/font/google";
import "./globals.css";
import "@/lib/bootstrap";
import { SITE_URL } from "@/lib/site";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Extintores Imperio | Venta, recarga y mantención de extintores en Chile",
    template: "%s | Extintores Imperio",
  },
  description:
    "Venta, recarga y mantención de extintores y equipos contra incendios en Chile. Extintores CO₂, Polvo Químico Seco (PQS), Clase K y red húmeda con certificación CESMEC. Cotiza por WhatsApp.",
  keywords: [
    "extintores Chile",
    "venta de extintores",
    "extintores Santiago",
    "extintores Cerrillos",
    "extintores PQS",
    "extintores CO2",
    "extintores clase K",
    "recarga de extintores",
    "mantención de extintores",
    "equipos contra incendios",
  ],
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: SITE_URL,
    siteName: "Extintores Imperio",
    title: "Extintores Imperio | Venta, recarga y mantención de extintores en Chile",
    description:
      "Catálogo de extintores CO₂, PQS, Clase K y red húmeda. Certificación CESMEC. Cotiza por WhatsApp en minutos.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es-CL"
      className={`${inter.variable} ${spaceGrotesk.variable} ${ibmPlexMono.variable} ${bebasNeue.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
