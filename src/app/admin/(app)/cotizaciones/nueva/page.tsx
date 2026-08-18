import "@/lib/bootstrap";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { QuoteEditor } from "@/components/admin/quotes/QuoteEditor";
import { listCatalogItems } from "@/lib/quote-queries";
import { getSettings } from "@/lib/settings";

export default async function NuevaCotizacionPage() {
  const catalogItems = await listCatalogItems();
  const settings = await getSettings();

  return (
    <div>
      <AdminPageHeader
        title="Nueva cotización"
        breadcrumb={[
          { label: "Inicio", href: "/admin" },
          { label: "Cotizaciones", href: "/admin/cotizaciones" },
          { label: "Nueva" },
        ]}
      />
      <QuoteEditor
        catalogItems={catalogItems}
        companyName={settings.companyName}
        vatRate={settings.vatRate}
        quoteValidDays={settings.quoteValidDays}
        defaultTerms={{
          payment: settings.defaultCommercialTerms.payment,
          delivery: settings.defaultCommercialTerms.delivery,
          dispatch: settings.defaultCommercialTerms.dispatch,
          warranty: settings.defaultCommercialTerms.warranty,
        }}
      />
    </div>
  );
}
