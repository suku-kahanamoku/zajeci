import { H3Event } from "h3";

import Test from "@/emails/Test.vue";

export default defineEventHandler(async (event: H3Event) => {
  const { template, send } = await useMailing(event);

  // odesle mail klientovi
  const html = await template(Test, {
    msg: "hlaska",
  });

  return html;
});
