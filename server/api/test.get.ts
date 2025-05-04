import { defineEventHandler, readBody, setHeader, send } from "h3";
import { Buffer } from "buffer";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { subject_id, items } = body;

  const config = useRuntimeConfig();
  const accountSlug = config.fakturoidAccountSlug;

  const userAgent = "NuxtApp (admin@example.com)";

  // Získání tokenu
  const tokenRes = await $fetch("/api/fakturoid/token");
  const accessToken = tokenRes.access_token;

  const apiBase = `https://app.fakturoid.cz/api/v3/accounts/${accountSlug}`;

  // 1. Vytvoření faktury
  const createResponse = await fetch(`${apiBase}/invoices.json`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "User-Agent": userAgent,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      invoice: {
        subject_id,
        custom_id: "2025-001",
        due: 7,
        currency: "CZK",
        language: "cz",
        payment_method: "bankovní převod",
        lines: items.map((item: any) => ({
          name: item.name,
          quantity: item.quantity,
          unit_name: item.unit || "ks",
          unit_price: item.price,
          vat_rate: item.vat || 21,
        })),
      },
    }),
  });

  const invoice = await createResponse.json();

  if (!createResponse.ok) {
    console.error(invoice);
    throw createError({
      statusCode: 500,
      statusMessage:
        invoice?.error_description || "Chyba při vystavování faktury",
    });
  }

  // 2. Stažení PDF
  const pdfResponse = await fetch(
    `${apiBase}/invoices/${invoice.id}/download.pdf`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "User-Agent": userAgent,
      },
    }
  );

  const pdfBuffer = await pdfResponse.arrayBuffer();

  setHeader(event, "Content-Type", "application/pdf");
  setHeader(
    event,
    "Content-Disposition",
    `attachment; filename=faktura-${invoice.id}.pdf`
  );
  return send(event, Buffer.from(pdfBuffer));
});
