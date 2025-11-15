import { defineEventHandler } from "h3";

export default defineEventHandler(async (event) => {
  const { createInvoicePdf } = await useInvoice(event);
  const body = await readBody(event);

  const pdfBuffer = await createInvoicePdf(body);

  /* event.res.setHeader('Content-Type', 'application/pdf');
  event.res.setHeader('Content-Disposition', 'attachment; filename="invoice.pdf"'); */

  setResponseHeaders(event, {
    "Content-Type": "application/pdf",
    "Content-Disposition": 'inline; filename="document.pdf"',
  });
  return pdfBuffer;
});
