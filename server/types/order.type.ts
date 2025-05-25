import { IAddress } from "@/modules/auth-module/runtime/types/address.interface";

import { IUser } from "@/modules/auth-module/runtime/types/user.interface";
import { IResponse } from "@/modules/common-module/runtime/types";
import { IWine } from "@/modules/wine-module/runtime/types/wine.interface";

/**
 * Enum pro typy plateb
 *
 * @export
 * @enum {number}
 */
export enum PaymentServices {
  bank = "bank",
  card = "card",
  paypal = "paypal",
  gopay = "gopay",
  applePay = "applePay",
  googlePay = "googlePay",
  cash = "cash",
}

export const paymentObjects = {
  cash: { label: "$.cashdesk.payment.cash", price: 0, avatar: "mdi:cash-100" },
  bank: {
    label: "$.cashdesk.payment.bank",
    price: 0,
    avatar: "mdi:bank-outline",
  },
  card: {
    label: "$.cashdesk.payment.card",
    price: 0,
    avatar: "mdi:credit-card-outline",
    disabled: true,
  },
  paypal: {
    label: "$.cashdesk.payment.paypal",
    price: 0,
    avatar: "logos:paypal",
    disabled: true,
  },
  gopay: {
    label: "$.cashdesk.payment.gopay",
    price: 0,
    avatar: "arcticons:gopay",
    disabled: true,
  },
  applePay: {
    label: "$.cashdesk.payment.apple_pay",
    price: 0,
    avatar: "simple-icons:applepay",
    disabled: true,
  },
  googlePay: {
    label: "$.cashdesk.payment.google_pay",
    price: 0,
    avatar: "simple-icons:googlepay",
    disabled: true,
  },
};

/**
 * Rozhrani pro payment v cashdesku
 *
 * @export
 * @interface IPayment
 */
export interface IPayment {
  type: PaymentServices;
  totalPrice: number;
  valid?: boolean;
}

/**
 * Enum pro typy doprav
 *
 * @export
 * @enum {number}
 */
export enum DeliveryServices {
  free = "free",
  ppl = "ppl",
  gls = "gls",
  dpd = "dpd",
  post = "post",
  zas = "zas",
  dhl = "dhl",
  geis = "geis",
}

export const deliveryObjects = {
  free: {
    label: "$.cashdesk.delivery.brno",
    price: 0,
    avatar: "mdi:home-city-outline",
    help: "$.cashdesk.delivery.brno_free",
  },
  post: {
    label: "$.cashdesk.delivery.post",
    price: 209,
    avatar: "/img/delivery/post.jpg",
    help: "$.cashdesk.delivery.not_quaranteed",
  },
  dpd: {
    label: "$.cashdesk.delivery.dpd",
    price: 150,
    avatar: "mdi:truck-outline",
    help: "$.cashdesk.delivery.not_quaranteed",
  },
  messenger: {
    label: "$.cashdesk.delivery.messenger",
    price: 175,
    avatar: "mdi:truck-outline",
    help: "$.cashdesk.delivery.third_day",
  },
};

/**
 * Rozhrani pro delivery v cashdesku
 *
 * @export
 * @interface IDelivery
 */
export interface IDelivery {
  type: DeliveryServices;
  address?: IAddress;
  totalPrice: number;
  valid?: boolean;
}

/**
 * Rozhrani pro jednotlive kosiky
 *
 * @export
 * @interface ICart
 */
export interface ICart {
  wine: IWine;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

/**
 * Enum pro stav objednavky
 *
 * @export
 * @enum {number}
 */
export enum OrderStatus {
  pending = "pending",
  confirmed = "confirmed",
  delivered = "delivered",
  cancelled = "cancelled",
  returned = "returned",
  refunded = "refunded",
  failed = "failed",
  onHold = "onHold",
  completed = "completed",
}

/**
 * Rozhrani pro cashdesk
 *
 * @export
 * @interface IOrder
 */
export interface IOrder {
  _id: string;
  user: IUser;
  carts: ICart[];
  totalPrice: number;
  status: OrderStatus;
  delivery: IDelivery;
  payment: IPayment;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IOrderResponse extends IResponse {
  data?: IOrder;
}

export interface IOrderesResponse extends IResponse {
  data?: IOrder[];
}
