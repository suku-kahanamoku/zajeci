import { defineEventHandler } from "h3";

export default defineEventHandler(async (event) => {
  const { createInvoicePdf } = await useInvoice(event);
  const body = await readBody(event);

  setResponseHeaders(event, {
    "Content-Type": "application/pdf",
    "Content-Disposition": 'attachment; filename="invoice.pdf"',
  });

  return await createInvoicePdf(body);
});
