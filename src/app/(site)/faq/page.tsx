import type { Metadata } from "next";
import "@/lib/bootstrap";
import { PageHeader } from "@/components/ui/PageHeader";
import { FAQSection } from "@/components/home/FAQSection";
import { ContactCTA } from "@/components/home/ContactCTA";
import { getContentMap, listFaqs } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Preguntas frecuentes",
  description: "Respuestas a las preguntas más comunes sobre extintores, recarga, mantención y cotizaciones.",
};

export default async function FaqPage() {
  const content = await getContentMap("home");
  const faqItems = await listFaqs();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <PageHeader eyebrow="Ayuda" title="Preguntas frecuentes" />
      <FAQSection content={content.faq_teaser ?? {}} />
      <ContactCTA />
    </>
  );
}
