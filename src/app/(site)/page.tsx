import "@/lib/bootstrap";
import { Hero } from "@/components/home/Hero";
import { TrustStats } from "@/components/home/TrustStats";
import { CategoryNav } from "@/components/home/CategoryNav";
import { FeaturedCatalog } from "@/components/home/FeaturedCatalog";
import { FireTypeGuide } from "@/components/home/FireTypeGuide";
import { ServicesSection } from "@/components/home/ServicesSection";
import { NormativaSection } from "@/components/home/NormativaSection";
import { AboutSection } from "@/components/home/AboutSection";
import { ClientsSection } from "@/components/home/ClientsSection";
import { FAQSection } from "@/components/home/FAQSection";
import { ContactCTA } from "@/components/home/ContactCTA";
import { getContentMap, listSections } from "@/lib/queries";
import { getSettings } from "@/lib/settings";

export default async function Home() {
  const content = await getContentMap("home");
  const sections = await listSections("home");
  const settings = await getSettings();

  const isVisible = (key: string) => sections.find((s) => s.key === key)?.visible !== false;

  return (
    <>
      <Hero content={content.hero ?? {}} whatsappNumber={settings.whatsappNumber} />
      {isVisible("trust") && <TrustStats content={content.trust ?? {}} />}
      {isVisible("categories") && <CategoryNav title={content.categories?.title ?? "Explora por tipo de agente"} />}
      {isVisible("featured_catalog") && (
        <FeaturedCatalog content={content.featured_catalog ?? {}} whatsappNumber={settings.whatsappNumber} />
      )}
      {isVisible("fire_guide") && (
        <FireTypeGuide compact content={content.fire_guide ?? {}} whatsappNumber={settings.whatsappNumber} />
      )}
      {isVisible("services") && (
        <ServicesSection compact content={content.services ?? {}} whatsappNumber={settings.whatsappNumber} />
      )}
      {isVisible("normativa") && <NormativaSection compact content={content.normativa ?? {}} />}
      {isVisible("about") && <AboutSection compact content={content.about ?? {}} />}
      {isVisible("clients") && <ClientsSection content={content.clients ?? {}} />}
      {isVisible("faq_teaser") && <FAQSection compact content={content.faq_teaser ?? {}} />}
      {isVisible("contact_cta") && <ContactCTA />}
    </>
  );
}
