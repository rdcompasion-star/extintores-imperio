import Link from "next/link";
import "@/lib/bootstrap";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { QuotesListClient } from "@/components/admin/quotes/QuotesListClient";
import { listQuotes } from "@/lib/quote-queries";

export default async function CotizacionesPage() {
  const quotes = await listQuotes();

  return (
    <div>
      <AdminPageHeader
        title="Cotizaciones"
        breadcrumb={[{ label: "Inicio", href: "/admin" }, { label: "Cotizaciones" }]}
        description={
          quotes.length === 1 ? "1 cotización creada." : `${quotes.length} cotizaciones creadas.`
        }
        action={
          <Link
            href="/admin/cotizaciones/nueva"
            className="rounded-md bg-red-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-800"
          >
            + Nueva cotización
          </Link>
        }
      />
      <QuotesListClient quotes={quotes} />
    </div>
  );
}
