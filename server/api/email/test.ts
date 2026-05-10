import { defineEventHandler, H3Event } from "h3";
import ContactForm from "@/emails/ContactForm.vue";

export default defineEventHandler(async (event: H3Event) => {
  const { template, send } = await useMailing(event);
  const locale = event.context.nuxtI18n.vueI18nOptions.locale;

  // Fetch a sample order from PHP API for testing
  const config = useRuntimeConfig();
  let body: any = null;
  try {
    const phpRes = await $fetch<any>(`${config.phpApiBaseUrl}/orders?limit=1`);
    body = (Array.isArray(phpRes?.data) ? phpRes.data[0] : null) ?? null;
  } catch (error) {
    console.error("Chyba při načítání testovací objednávky:", error);
  }

  // Stažení PDF přílohy z invoice endpointu
  let attachments: any[] = [];
  try {
    const invoiceUrl = `/api/invoice?locale=${locale}`;

    const pdfBuffer = (await $fetch(invoiceUrl, {
      method: "POST",
      responseType: "arrayBuffer",
      body,
    })) as ArrayBuffer;

    attachments = [
      {
        ContentType: "application/pdf",
        Filename: "faktura.pdf",
        Base64Content: Buffer.from(pdfBuffer).toString("base64"),
      },
    ];
  } catch (error) {
    console.error("Chyba při stahování přílohy faktury:", error);
    // Pokračovat bez přílohy, pokud stahování selže
  }

  // odesle mail adminovi (s přílohou)
  await send({
    subject: "$.mailing.contact_form.subject",
    template: await template(ContactForm, {
      email: "sukusovi@gmail.com",
      msg: "fdsa",
    }),
    to: [
      {
        Email: "sukusovi@gmail.com",
      },
    ],
    attachments: attachments,
  });

  return { message: "Email odeslán", attachments: attachments };
});
