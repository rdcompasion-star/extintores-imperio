import type { Metadata } from "next";
import "@/lib/bootstrap";
import { PageHeader } from "@/components/ui/PageHeader";
import { FireTypeGuide } from "@/components/home/FireTypeGuide";
import { ContactCTA } from "@/components/home/ContactCTA";
import { getContentMap } from "@/lib/queries";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Tipos de fuego",
  description:
    "Guía educativa sobre las clases de fuego A, B, C, D y K, y qué tipo de extintor corresponde a cada una.",
};

export default async function TiposDeFuegoPage() {
  const content = await getContentMap("home");
  const settings = await getSettings();

  return (
    <>
      <PageHeader
        eyebrow="Guía educativa"
        title="¿Qué tipo de fuego necesitas combatir?"
        bebas
        lead="Conocer la clase de fuego de tu instalación es el primer paso para elegir el extintor correcto."
      />
      <FireTypeGuide compact content={content.fire_guide ?? {}} whatsappNumber={settings.whatsappNumber} />
      <ContactCTA />
    </>
  );
}
