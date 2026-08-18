import "@/lib/bootstrap";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { MediaLibrary } from "@/components/admin/MediaLibrary";
import { listMedia } from "@/lib/queries";

export default async function MediosPage() {
  const media = await listMedia();

  return (
    <div>
      <AdminPageHeader
        title="Fotos"
        breadcrumb={[{ label: "Inicio", href: "/admin" }, { label: "Fotos" }]}
        description="Sube y organiza las imágenes del sitio. Una foto se puede reutilizar en varios productos o secciones."
      />
      <MediaLibrary initialMedia={media} />
    </div>
  );
}
