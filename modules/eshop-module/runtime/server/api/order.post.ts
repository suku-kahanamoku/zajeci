import { H3Event } from "h3";
import { isValidObjectId } from "mongoose";

import OrderForm from "@/emails/OrderForm.vue";
import { AddressModel } from "@/modules/auth-module/runtime/models/address.schema";
import { UserModel } from "@/modules/auth-module/runtime/models/user.schema";
import { IAddress } from "@/modules/auth-module/runtime/types/address.interface";
import { RESOLVE_FACTORY } from "@suku-kahanamoku/common-module/server-utils";

import { OrderModel } from "../../models/order.schema";
import { IOrderResponse } from "../../types/order.interface";

export default defineEventHandler(
  async (event: H3Event): Promise<IOrderResponse> => {
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
      user.address.main = await upsertAddress(user.address.main as IAddress);
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
      user.address.main = await upsertAddress(user.address.main as IAddress);
      // vytvori uzivatele
      await UserModel.create(user);
    }

    // pokud se podari ulozit objednavku do DB, odesle se mail klientovi i adminovi
    if (order.user.email) {
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

    const result = order;
    RESOLVE_FACTORY(result, query.factory);

    return {
      data: result,
      meta: { total: result ? 1 : 0 },
    };
  }
);

/**
 * Vytvori nebo upravy adresar
 *
 * @export
 * @param {IAddress} address
 * @return {*}  {Promise<IAddress>}
 */
async function upsertAddress(address: IAddress): Promise<IAddress> {
  if (address) {
    if (address._id) {
      return (await AddressModel.findByIdAndUpdate(address._id, address, {
        new: true,
        upsert: true,
      })) as IAddress;
    }
    // Pokud _id chybi, vytvori novou adresu
    else {
      return await AddressModel.create(address);
    }
  }
  return address;
}
