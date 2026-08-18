import type { Metadata } from "next";
import "@/lib/bootstrap";
import { PageHeader } from "@/components/ui/PageHeader";
import { NormativaSection } from "@/components/home/NormativaSection";
import { ContactCTA } from "@/components/home/ContactCTA";
import { getContentMap } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Normativa de extintores en Chile",
  description:
    "Información general sobre el D.S. 44 del Ministerio de Economía y la certificación de extintores en Chile. Contenido educativo, no constituye asesoría legal.",
};

export default async function NormativaPage() {
  const content = await getContentMap("home");

  return (
    <>
      <PageHeader
        eyebrow="Normativa"
        title="Normativa y seguridad en extintores en Chile"
        bebas
        lead="Una guía general para entender el marco regulatorio de los extintores portátiles en Chile."
      />
      <NormativaSection content={content.normativa ?? {}} />
      <ContactCTA />
    </>
  );
}
