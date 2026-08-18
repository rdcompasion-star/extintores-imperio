import type { Metadata } from "next";
import "@/lib/bootstrap";
import { PageHeader } from "@/components/ui/PageHeader";
import { ServicesSection } from "@/components/home/ServicesSection";
import { ContactCTA } from "@/components/home/ContactCTA";
import { getContentMap } from "@/lib/queries";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Servicios",
  description:
    "Venta, mantención y recarga de extintores y equipos contra incendios en Chile. Extintores Imperio, 15 años de experiencia.",
};

export default async function ServiciosPage() {
  const content = await getContentMap("home");
  const settings = await getSettings();

  return (
    <>
      <PageHeader
        eyebrow="Servicios"
        title="Venta, mantención y recarga de extintores"
        lead="Extintores Imperio acompaña a tu empresa, comercio u hogar en todo el ciclo de vida de tus equipos contra incendios."
      />
      <ServicesSection content={content.services ?? {}} whatsappNumber={settings.whatsappNumber} />
      <ContactCTA />
    </>
  );
}
