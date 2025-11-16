import { defineEventHandler, H3Event, readBody } from "h3";
import ContactForm from "@/emails/ContactForm.vue";
import { OrderModel } from "~/modules/eshop-module/runtime/models/order.schema";

export default defineEventHandler(async (event: H3Event) => {
  const { template, send } = await useMailing(event);
  const locale = event.context.nuxtI18n.vueI18nOptions.locale;
  const body = await OrderModel.findById("6900e2bd41c4b9456f6709d0");

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
