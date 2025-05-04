import { defineEventHandler } from "h3";

export default defineEventHandler(async () => {
  const config = useRuntimeConfig();

  const credentials = Buffer.from(
    `${config.fakturoidClientId}:${config.fakturoidClientSecret}`
  ).toString("base64");

  const response = await fetch("https://app.fakturoid.cz/api/v3/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": `Basic ${credentials}`, // Added Basic Authorization header
    },
    body: JSON.stringify({
      grant_type: "client_credentials",
    }),
  });

  const tokenData = await response.json();

  if (!response.ok) {
    console.error(tokenData);
    throw createError({
      statusCode: 500,
      statusMessage: "Nepodařilo se získat access_token z Fakturoid API.",
    });
  }

  return tokenData; // obsahuje: access_token, token_type, expires_in
});
