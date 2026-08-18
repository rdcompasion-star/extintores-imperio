import "@/lib/bootstrap";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { MenuManager } from "@/components/admin/MenuManager";
import { listMenuItems } from "@/lib/queries";

export default async function MenuAdminPage() {
  const items = await listMenuItems();

  return (
    <div>
      <AdminPageHeader
        title="Menú de navegación"
        breadcrumb={[{ label: "Inicio", href: "/admin" }, { label: "Menú" }]}
        description="Este es el menú que aparece en el header y el footer del sitio."
      />
      <MenuManager items={items} />
    </div>
  );
}
