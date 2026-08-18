import "@/lib/bootstrap";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { FaqManager } from "@/components/admin/FaqManager";
import { listFaqs } from "@/lib/queries";

export default async function FaqAdminPage() {
  const faqs = await listFaqs({ includeDrafts: true });

  return (
    <div>
      <AdminPageHeader
        title="Preguntas frecuentes"
        breadcrumb={[{ label: "Inicio", href: "/admin" }, { label: "Preguntas frecuentes" }]}
      />
      <FaqManager faqs={faqs} />
    </div>
  );
}
