import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { WhatsAppIcon, PhoneIcon } from "@/components/ui/icons";
import { buildTelLink, buildWhatsAppLink } from "@/lib/site-config";
import { getSettings } from "@/lib/settings";
import { getContentValue } from "@/lib/queries";

export async function ContactCTA() {
  const settings = await getSettings();
  const title = await getContentValue("home", "contact_cta", "title", "¿Listo para cotizar?");
  const lead = await getContentValue(
    "home",
    "contact_cta",
    "lead",
    "Escríbenos por WhatsApp o completa el formulario y te respondemos a la brevedad."
  );

  return (
    <section className="border-t border-border bg-ink-950 py-14 sm:py-16">
      <Container className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white sm:text-3xl">{title}</h2>
          <p className="mt-2 max-w-md text-[15px] text-white/65">{lead}</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          {settings.social.whatsapp.enabled && (
            <ButtonLink
              href={buildWhatsAppLink(
                settings.whatsappNumber,
                "Hola, quiero cotizar extintores. ¿Me pueden ayudar?"
              )}
              external
              size="lg"
              icon={<WhatsAppIcon className="h-5 w-5" />}
            >
              Cotizar por WhatsApp
            </ButtonLink>
          )}
          <ButtonLink
            href={buildTelLink(settings.phoneE164)}
            variant="outlineLight"
            size="lg"
            icon={<PhoneIcon className="h-5 w-5" />}
          >
            {settings.phoneDisplay}
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
