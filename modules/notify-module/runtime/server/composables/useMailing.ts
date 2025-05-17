import type { H3Event } from "h3";
import { useTranslation } from "@intlify/h3";
import { Component } from "vue";
import { render } from "@vue-email/render";
import Mailjet from "node-mailjet";

export async function useMailing(event: H3Event) {
  const tt = await useTranslation(event);

  const mailjet = new Mailjet({
    apiKey: process.env.NUXT_MAILING_API_KEY,
    apiSecret: process.env.NUXT_MAILING_API_SECRET,
    options: {
      timeout: 8000,
    },
  });

  const template = async (cmp: Component, props: any) => {
    return await render(cmp, { tt, ...props });
  };

  const send = async (config: {
    subject: string;
    template: string;
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
          Subject: tt(config.subject),
          HTMLPart: config.template,
        },
      ],
    });
  };

  return { template, send };
}
