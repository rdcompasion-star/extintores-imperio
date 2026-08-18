import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloatingButton } from "@/components/layout/WhatsAppFloatingButton";
import { QuickAccessShortcut } from "@/components/admin/QuickAccessShortcut";
import { EditModeProvider } from "@/components/admin/EditModeContext";
import { EditModeToggle } from "@/components/admin/EditModeToggle";
import { getSettings } from "@/lib/settings";
import { listMenuItems } from "@/lib/queries";
import { isAuthenticated } from "@/lib/auth";
import { SITE_URL } from "@/lib/site";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  const menuItems = await listMenuItems({ onlyVisible: true });
  const isAdmin = await isAuthenticated();

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: settings.companyName,
    url: SITE_URL,
    telephone: settings.phoneE164,
    email: settings.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address.street,
      addressLocality: settings.address.comuna,
      addressRegion: settings.address.city,
      addressCountry: "CL",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "19:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday"],
        opens: "09:00",
        closes: "14:00",
      },
    ],
  };

  return (
    <EditModeProvider isAdmin={isAdmin}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-(--z-toast) focus:rounded-md focus:bg-red-700 focus:px-4 focus:py-2 focus:text-white"
      >
        Saltar al contenido principal
      </a>
      <Header settings={settings} menuItems={menuItems} />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
      <WhatsAppFloatingButton />
      <QuickAccessShortcut />
      <EditModeToggle />
    </EditModeProvider>
  );
}
