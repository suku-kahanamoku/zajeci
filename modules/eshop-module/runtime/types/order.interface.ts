import type { IAddress, IUser } from "@suku-kahanamoku/auth-module/types";
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

/**
 * Rozhrani pro payment v cashdesku
 *
 * @export
 * @interface IPayment
 */
export interface IPayment {
  type: PaymentServices | string;
  label: string;
  unitPrice: number;
  totalPrice?: number;
  avatar?: string;
  disabled?: boolean;
  valid?: boolean;
  value?: PaymentServices | string;
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

/**
 * Rozhrani pro delivery v cashdesku
 *
 * @export
 * @interface IDelivery
 */
export interface IDelivery {
  type: DeliveryServices | string;
  label: string;
  unitPrice: number;
  totalPrice?: number;
  disabled?: boolean;
  avatar?: string;
  help?: string;
  address?: IAddress;
  valid?: boolean;
  key?: number;
  value: DeliveryServices | string;
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
