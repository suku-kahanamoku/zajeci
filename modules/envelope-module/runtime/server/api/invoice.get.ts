import { createInvoicePdf } from "~/modules/envelope-module/runtime/utils/pdf.functions";
import { defineEventHandler } from "h3";

export default defineEventHandler(async (event) => {
  // Example data structure, replace with real data from body
  const invoiceData = {
    supplier: {
      name: "Jan Novák",
      address: "Ulice 123",
      city: "Praha",
      zip: "11000",
      ico: "12345678",
      dic: "CZ12345678",
      bank: "123456789/0100",
      vs: "20250001",
      payment: "Převodem",
    },
    customer: {
      company: "Firma s.r.o.",
      address: "Firemní 456",
      city: "Brno",
      zip: "60200",
      ico: "87654321",
      dic: "CZ87654321",
      orderNumber: "OBJ20251108",
      issueDate: "8.11.2025",
      dueDate: "22.11.2025",
    },
    description: "Popis faktury, dlouhý text...",
    items: [
      { name: "Produkt 1", price: 1000 },
      { name: "Produkt 2", price: 500 },
    ],
    total: 1500,
  };

  const pdfBuffer = await createInvoicePdf(invoiceData);

  /* event.res.setHeader('Content-Type', 'application/pdf');
  event.res.setHeader('Content-Disposition', 'attachment; filename="invoice.pdf"'); */

  setResponseHeaders(event, {
    "Content-Type": "application/pdf",
    "Content-Disposition": 'inline; filename="document.pdf"',
  });
  return pdfBuffer;
});
