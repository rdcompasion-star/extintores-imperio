import "@/lib/bootstrap";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { ChangePasswordForm } from "@/components/admin/ChangePasswordForm";
import { getSettings } from "@/lib/settings";

export default async function ConfiguracionPage() {
  const settings = await getSettings();

  return (
    <div>
      <AdminPageHeader
        title="Configuración"
        breadcrumb={[{ label: "Inicio", href: "/admin" }, { label: "Configuración" }]}
        description="Información de la empresa, contacto y redes sociales. Se usa en todo el sitio."
      />
      <SettingsForm settings={settings} />
      <div className="px-5 pb-8 sm:px-8">
        <ChangePasswordForm />
      </div>
    </div>
  );
}
