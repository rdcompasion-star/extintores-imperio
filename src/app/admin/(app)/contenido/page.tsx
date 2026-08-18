import "@/lib/bootstrap";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ContentEditor } from "@/components/admin/ContentEditor";
import { contentRegistry } from "@/lib/content-registry";
import { getContentMap, listSections } from "@/lib/queries";

export default async function ContenidoPage() {
  const content = await getContentMap("home");
  const sections = await listSections("home");
  const visibility = Object.fromEntries(sections.map((s) => [s.key, s.visible]));

  return (
    <div>
      <AdminPageHeader
        title="Contenido"
        breadcrumb={[{ label: "Inicio", href: "/admin" }, { label: "Contenido" }]}
        description="Textos de cada sección de la página de inicio. Apaga una sección para ocultarla sin borrar su contenido."
      />
      <ContentEditor sections={contentRegistry} initialContent={content} initialVisibility={visibility} />
    </div>
  );
}
