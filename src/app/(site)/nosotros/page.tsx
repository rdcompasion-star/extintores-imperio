import type { Metadata } from "next";
import "@/lib/bootstrap";
import { PageHeader } from "@/components/ui/PageHeader";
import { AboutSection } from "@/components/home/AboutSection";
import { ClientsSection } from "@/components/home/ClientsSection";
import { ContactCTA } from "@/components/home/ContactCTA";
import { getContentMap, listClientLogos } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "Extintores Imperio: 15 años de experiencia en venta, recarga y mantención de extintores y equipos contra incendios en Chile.",
};

export default async function NosotrosPage() {
  const content = await getContentMap("home");
  const clientLogos = await listClientLogos();

  return (
    <>
      <PageHeader
        eyebrow="Nosotros"
        title="15 años protegiendo empresas, comercios y hogares"
        lead="Extintores Imperio es una empresa chilena dedicada a la comercialización, recarga y mantención de equipos contra incendios, con un equipo joven, profesional y capacitado."
      />
      <AboutSection content={content.about ?? {}} />
      <ClientsSection content={content.clients ?? {}} logos={clientLogos} />
      <ContactCTA />
    </>
  );
}
