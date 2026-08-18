import { notFound } from "next/navigation";
import "@/lib/bootstrap";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { QuoteEditor } from "@/components/admin/quotes/QuoteEditor";
import { getQuote, listCatalogItems } from "@/lib/quote-queries";
import { getSettings } from "@/lib/settings";

export default async function EditarCotizacionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const quote = await getQuote(Number(id));
  if (!quote) notFound();

  const catalogItems = await listCatalogItems();
  const settings = await getSettings();

  return (
    <div>
      <AdminPageHeader
        title={quote.number}
        breadcrumb={[
          { label: "Inicio", href: "/admin" },
          { label: "Cotizaciones", href: "/admin/cotizaciones" },
          { label: quote.number },
        ]}
      />
      <QuoteEditor
        catalogItems={catalogItems}
        quote={quote}
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
