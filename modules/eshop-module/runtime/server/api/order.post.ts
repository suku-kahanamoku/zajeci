import type { H3Event } from "h3";
import { phpApiFetch, toLegacySingleResponse } from "@/server/utils/phpApi";

/** Map cashdesk payment type → PHP payment_method enum */
const PAYMENT_METHOD_MAP: Record<string, string> = {
  bank: "bank_transfer",
  cash: "cash",
  card: "card",
  paypal: "online",
  gopay: "online",
  apple_pay: "online",
  google_pay: "online",
};

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody(event);

  const user = body.user || {};
  const address = user.address?.main || {};
  const delivery = body.delivery || {};
  const payment = body.payment || {};

  // Build a human-readable note from cashdesk state
  const noteParts: string[] = [];
  if (delivery.label || delivery.type)
    noteParts.push(`Doprava: ${delivery.label || delivery.type}`);
  if (address.street)
    noteParts.push(
      `Adresa: ${address.street}, ${address.city || ""} ${address.zip || ""}, ${address.state || "CZ"}`,
    );
  if (user.givenName || user.surname)
    noteParts.push(
      `Jméno: ${[user.givenName, user.surname].filter(Boolean).join(" ")}`,
    );
  if (user.phone) noteParts.push(`Tel: ${user.phone}`);

  // Transform cashdesk format → PHP /orders format
  const phpBody = {
    items: (body.carts || []).map((c: any) => ({
      product_id: c.wine?.id ?? c.wine?._id,
      quantity: c.quantity,
    })),
    currency: "CZK",
    payment_method: PAYMENT_METHOD_MAP[payment.type] ?? "bank_transfer",
    note: noteParts.join(" | "),
  };

  const phpResponse = await phpApiFetch(event, "/orders", {
    method: "POST",
    body: phpBody,
  });

  const result = phpResponse.data;

  // Send order confirmation email with PHP order data + original cashdesk user info
  if (phpResponse.success && result?.id) {
    await $fetch("/api/email/order", {
      method: "POST",
      body: { ...result, _cashdeskUser: body.user },
    });
  }

  return toLegacySingleResponse(phpResponse);
});
