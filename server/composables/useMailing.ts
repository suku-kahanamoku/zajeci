import { H3Event } from "h3";
import { useCompiler } from "#vue-email";
import Mailjet from "node-mailjet";
import { tryCookieLocale, useTranslation } from "@intlify/h3";

export async function useMailing(event: H3Event) {
  const locale =
    tryCookieLocale(event, { lang: "", name: "i18n_locale" })?.toString() ||
    "cs";
  const t = await useTranslation(event);

  const mailjet = new Mailjet({
    apiKey: process.env.NUXT_MAILING_API_KEY,
    apiSecret: process.env.NUXT_MAILING_API_SECRET,
    options: {
      timeout: 8000,
    },
  });

  const template = async (config: {
    name: string;
    props: Record<string, any>;
  }) => {
    return await useCompiler(config.name, {
      props: config.props,
      i18n: { defaultLocale: locale },
    });
  };

  const send = async (config: {
    subject: string;
    template: any;
    to: Array<{ Email: string }>;
    bcc?: Array<{ Email: string }>;
    cc?: Array<{ Email: string }>;
  }) => {
    return await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: process.env.NUXT_MAILING_FROM,
          },
          To: config.to,
          Bcc: config.bcc,
          Subject: config.subject?.startsWith("$.")
            ? t(config.subject)
            : config.subject,
          HTMLPart: config.template.html,
        },
      ],
    });
  };

  return { template, send };
}
