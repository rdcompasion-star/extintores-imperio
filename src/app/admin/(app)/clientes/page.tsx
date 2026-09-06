import "@/lib/bootstrap";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ClientLogosManager } from "@/components/admin/ClientLogosManager";
import { listClientLogos } from "@/lib/queries";

export default async function ClientesPage() {
  const logos = await listClientLogos();

  return (
    <div>
      <AdminPageHeader
        title="Logos de clientes"
        breadcrumb={[{ label: "Inicio", href: "/admin" }, { label: "Logos de clientes" }]}
        description={`${logos.length} logo${logos.length === 1 ? "" : "s"} cargado${logos.length === 1 ? "" : "s"}. Aparecen en la sección "Clientes" de la página de inicio.`}
      />
      <ClientLogosManager logos={logos} />
    </div>
  );
}
