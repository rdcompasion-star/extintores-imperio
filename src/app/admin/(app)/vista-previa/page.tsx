import "@/lib/bootstrap";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { PreviewFrame } from "@/components/admin/PreviewFrame";

const paths = [
  { href: "/", label: "Inicio" },
  { href: "/productos", label: "Productos" },
  { href: "/servicios", label: "Servicios" },
  { href: "/tipos-de-fuego", label: "Tipos de fuego" },
  { href: "/normativa", label: "Normativa" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/faq", label: "Preguntas frecuentes" },
  { href: "/contacto", label: "Contacto" },
];

export default function VistaPreviaPage() {
  return (
    <div>
      <AdminPageHeader
        title="Vista previa"
        breadcrumb={[{ label: "Inicio", href: "/admin" }, { label: "Vista previa" }]}
        description="Revisa cómo se ve cada página en distintos tamaños de pantalla."
      />
      <PreviewFrame paths={paths} />
    </div>
  );
}
