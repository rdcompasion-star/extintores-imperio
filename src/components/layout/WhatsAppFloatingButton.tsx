import { WhatsAppIcon } from "@/components/ui/icons";
import { buildWhatsAppLink } from "@/lib/site-config";
import { getSettings } from "@/lib/settings";

export async function WhatsAppFloatingButton() {
  const settings = await getSettings();
  if (!settings.social.whatsapp.enabled) return null;

  return (
    <a
      href={buildWhatsAppLink(settings.whatsappNumber, "Hola, quiero cotizar extintores. ¿Me pueden ayudar?")}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-(--z-sticky) flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition-transform duration-150 ease-out hover:scale-105 active:scale-95 lg:hidden"
      aria-label="Cotizar por WhatsApp"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
