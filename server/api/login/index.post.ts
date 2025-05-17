import { H3Event } from "h3";

import { UserModel } from "@/server/models/user.schema";
import { COMPARE_PASSWORD } from "@/modules/common-module/runtime/utils/server.functions";
import { useAuth } from "@/server/composables/useAuth";

export default defineEventHandler(async (event: H3Event) => {
  const t = await useTranslation(event);
  const body = await readBody(event);
  const { setSession } = useAuth();

  // kontrola, zda jsou zadane vsechny potrebne fieldy
  if (!body.email || !body.password) {
    throw createError({
      statusCode: 400,
      statusMessage: t("$.message.bad_request"),
      message: t("$.message.miss_fields"),
    });
  }

  // kontrola uzivatele a hesla
  const user = await UserModel.findOne({ email: body.email });
  if (user?._id) {
    const isValid =
      (await COMPARE_PASSWORD(body.password, user.password || "")) ||
      (await COMPARE_PASSWORD(body.password, user.tempPassword || ""));
    if (!isValid) {
      throw createError({
        statusCode: 401,
        statusMessage: t("$.message.unauthorized"),
        message: t("$.message.incorrect_login"),
      });
    }
  }
  // pokud uzivatel neexistuje, zarve chybu
  else {
    throw createError({
      statusCode: 401,
      statusMessage: t("$.message.unauthorized"),
      message: t("$.message.incorrect_login"),
    });
  }

  const result = { ...user.toObject(), password: undefined };

  // nastavi session
  await setSession(event, result);

  return result;
});
