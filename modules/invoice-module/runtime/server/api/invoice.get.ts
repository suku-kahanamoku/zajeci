import { defineEventHandler, H3Event, readBody } from "h3";
import ContactForm from "@/emails/ContactForm.vue";

export default defineEventHandler(async (event: H3Event) => {
  const { template, send } = await useMailing(event);

  // Stažení PDF přílohy z invoice endpointu
  let attachments: any[] = [];
  try {
    const invoiceUrl = `/api/invoice?locale=cs`;

    const pdfBuffer = (await $fetch(invoiceUrl, {
      method: "GET",
      responseType: "arrayBuffer",
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
