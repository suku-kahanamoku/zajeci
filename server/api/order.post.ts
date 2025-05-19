import { H3Event } from "h3";
import { isValidObjectId } from "mongoose";

import OrderForm from "@/emails/OrderForm.vue";
import { AddressModel } from "@/modules/auth-module/runtime/models/address.schema";
import { UserModel } from "@/modules/auth-module/runtime/models/user.schema";
import { AddressDocument } from "~/modules/auth-module/runtime/types/address.interface";

import { OrderModel } from "../models/order.schema";
import { RESOLVE_FACTORY } from "@/modules/common-module/runtime/utils/server.functions";

export default defineEventHandler(async (event: H3Event) => {
  const session = await getUserSession(event);
  const query = getQuery(event);
  const body = await readBody(event);
  const order = (await OrderModel.create(body)).toObject();

  const user = body.user;
  user.address = user.address || {};

  if (!isValidObjectId(user.address.main?._id)) {
    delete (user.address.main as any)._id;
  }

  if (!isValidObjectId(user._id)) {
    delete (user as any)._id;
  }

  // pokud je to prihlaseny uzivatel, aktualizuje data
  if (user._id && user.email === session.user?.email) {
    const session = await getUserSession(event);

    // vytvori nebo aktualizuje adresu a uzivateli preda referenci
    user.address.main = await upsertAddress(
      user.address.main as AddressDocument
    );
    // najde a aktualizuje uzivatele
    await UserModel.findByIdAndUpdate(user._id, user, {
      new: true,
      upsert: true,
    });

    // aktualizuje session
    await setUserSession(event, {
      user: order.user,
      tokens: session.tokens,
    });
  }
  // pokud uzivatel neexistuje vytvori ho
  else if (!(await UserModel.exists({ email: user.email }))?._id) {
    // vytvori adresu a uzivateli preda referenci
    user.address.main = await upsertAddress(
      user.address.main as AddressDocument
    );
    // vytvori uzivatele
    await UserModel.create(user);
  }

  // pokud se podari ulozit objednavku do DB, odesle se mail klientovi i adminovi
  if (order?._id) {
    const t = await useTranslation(event);
    const { template, send } = await useMailing(event);
    const orderId = order._id.toString();
    await send({
      subject: t("$.mailing.order.confirmed.subject", { orderId }),
      template: await template(OrderForm, {
        url: process.env.FRONTEND_HOST,
        email: process.env.NUXT_MAILING_FROM as string,
        orderId,
      }),
      to: [
        {
          Email: order.user.email,
        },
      ],
      bcc: [
        {
          Email: process.env.NUXT_MAILING_FROM as string,
        },
      ],
    });
  }

  const result = order || {};
  RESOLVE_FACTORY(result, query.factory);

  return {
    data: result,
    meta: { total: result ? 1 : 0 },
  };
});

/**
 * Vytvori nebo upravy adresar
 *
 * @export
 * @param {AddressDocument} address
 * @return {*}  {Promise<AddressDocument>}
 */
async function upsertAddress(
  address: AddressDocument
): Promise<AddressDocument> {
  if (address) {
    if (address._id) {
      return (await AddressModel.findByIdAndUpdate(address._id, address, {
        new: true,
        upsert: true,
      })) as AddressDocument;
    }
    // Pokud _id chybi, vytvori novou adresu
    else {
      return await AddressModel.create(address);
    }
  }
  return address;
}
