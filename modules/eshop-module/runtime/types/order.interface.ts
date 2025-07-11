import type { IAddress } from "@/modules/auth-module/runtime/types/address.interface";
import type { IUser } from "@/modules/auth-module/runtime/types/user.interface";
import type { IResponse } from "@suku-kahanamoku/common-module/types";
import type { IWine } from "@/modules/wine-module/runtime/types/wine.interface";

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
  cash: { label: "$.payment.cash", price: 0, avatar: "mdi:cash-100" },
  bank: {
    label: "$.payment.bank",
    price: 0,
    avatar: "mdi:bank-outline",
  },
  card: {
    label: "$.payment.card",
    price: 0,
    avatar: "mdi:credit-card-outline",
    disabled: true,
  },
  paypal: {
    label: "$.payment.paypal",
    price: 0,
    avatar: "logos:paypal",
    disabled: true,
  },
  gopay: {
    label: "$.payment.gopay",
    price: 0,
    avatar: "arcticons:gopay",
    disabled: true,
  },
  applePay: {
    label: "$.payment.apple_pay",
    price: 0,
    avatar: "simple-icons:applepay",
    disabled: true,
  },
  googlePay: {
    label: "$.payment.google_pay",
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
    label: "$.delivery.brno",
    price: 0,
    avatar: "mdi:home-city-outline",
    help: "$.delivery.brno_free",
  },
  post: {
    label: "$.delivery.post",
    price: 209,
    avatar: "/img/delivery/post.jpg",
    help: "$.delivery.not_quaranteed",
  },
  dpd: {
    label: "$.delivery.dpd",
    price: 150,
    avatar: "mdi:truck-outline",
    help: "$.delivery.not_quaranteed",
  },
  messenger: {
    label: "$.delivery.messenger",
    price: 175,
    avatar: "mdi:truck-outline",
    help: "$.delivery.third_day",
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
  key?: number;
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

export interface IOrdersResponse extends IResponse {
  data?: IOrder[];
}
